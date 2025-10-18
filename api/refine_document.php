<?php
// api/refine_document.php
header('Content-Type: application/json');

// --- 1. Basic Input Validation ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$baseName = $input['base_name'] ?? null;
$docType = $input['doc_type'] ?? null;
$userPrompt = $input['prompt'] ?? null;
$contextDocs = $input['context_docs'] ?? [];
$apiKey = $input['api_key'] ?? null;

if (empty($baseName) || empty($docType) || empty($userPrompt) || empty($apiKey)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing base_name, doc_type, prompt, or api_key.']);
    exit;
}

// --- 2. Security and File Path Construction ---
$safeBaseName = basename($baseName);
if ($safeBaseName !== $baseName) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid base name.']);
    exit;
}

$docSuffixMap = [
    'canvas' => '.json',
    'swot' => '-swot.json',
    'proposal' => '-proposal.json',
    'roadmap' => '-roadmap.json',
    'plan' => '-plan.json'
];

if (!isset($docSuffixMap[$docType])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid document type specified.']);
    exit;
}

$originalDocFile = $safeBaseName . $docSuffixMap[$docType];
$originalDocPath = '../data/' . $originalDocFile;

if (!file_exists($originalDocPath)) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'The original document to be refined does not exist.']);
    exit;
}

// --- 3. Read and Consolidate Input Files ---
$originalDocContent = file_get_contents($originalDocPath);
$contextDocsContent = '';

foreach ($contextDocs as $contextDocType) {
    if (isset($docSuffixMap[$contextDocType])) {
        $contextDocFile = $safeBaseName . $docSuffixMap[$contextDocType];
        $contextDocPath = '../data/' . $contextDocFile;
        if (file_exists($contextDocPath)) {
            $contextDocsContent .= "--- " . strtoupper($contextDocType) . " ---\n";
            $contextDocsContent .= file_get_contents($contextDocPath) . "\n\n";
        }
    }
}

// --- 4. Prepare the API Request ---
$apiEndpoint = 'https://api.deepseek.com/chat/completions';
$systemPromptTemplate = file_get_contents('system_prompt_refine.md');

$prompt = str_replace('[ORIGINAL_DOCUMENT]', $originalDocContent, $systemPromptTemplate);
$prompt = str_replace('[USER_PROMPT]', $userPrompt, $prompt);
$prompt = str_replace('[CONTEXT_DOCUMENTS]', $contextDocsContent, $prompt);

$requestData = [
    'model' => 'deepseek-chat',
    'messages' => [
        ['role' => 'system', 'content' => 'You are an expert business consultant AI.'],
        ['role' => 'user', 'content' => $prompt]
    ],
    'response_format' => ['type' => 'json_object']
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

// --- 5. Make the cURL Request ---
$ch = curl_init($apiEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 180);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// --- 6. Handle the API Response ---
if ($curlError) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'cURL Error: ' . $curlError]);
    exit;
}

if ($httpcode !== 200) {
    http_response_code($httpcode);
    echo json_encode(['status' => 'error', 'message' => 'API Error: ' . $response, 'code' => $httpcode]);
    exit;
}

$responseData = json_decode($response, true);
$generatedContent = $responseData['choices'][0]['message']['content'] ?? null;

if (empty($generatedContent)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to extract content from API response.']);
    exit;
}

// --- 7. Save the Refined Content ---
$decodedContent = json_decode($generatedContent, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'The content received from the API was not valid JSON.',
        'raw_content' => $generatedContent
    ]);
    exit;
}

if (file_put_contents($originalDocPath, json_encode($decodedContent, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'Document refined successfully!', 'refined_content' => $decodedContent]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save the refined document file.']);
}
