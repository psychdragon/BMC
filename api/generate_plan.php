<?php
// api/generate_plan.php
header('Content-Type: application/json');

// --- 0. Configuration Check ---
if (file_exists('config.php')) {
    require_once 'config.php';
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Configuration file is missing. Please copy config.php.example to config.php and set your API key.']);
    exit;
}

// --- 1. Basic Input Validation ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$bmcFile = $input['bmc_file'] ?? null;
$apiKey = DEEPSEEK_API_KEY;

if (empty($bmcFile)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing bmc_file.']);
    exit;
}

if ($apiKey === 'YOUR_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'API key is not configured. Please set it in api/config.php.']);
    exit;
}

// --- 2. Security and File Path Construction ---
$safeBmcFile = basename($bmcFile);
if ($safeBmcFile !== $bmcFile) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file name.']);
    exit;
}

$baseName = str_replace('.json', '', $safeBmcFile);
$swotFile = $baseName . '-swot.json';
$proposalFile = $baseName . '-proposal.json';
$roadmapFile = $baseName . '-roadmap.json';
$planFile = $baseName . '-plan.json';

$bmcFilePath = '../data/' . $safeBmcFile;
$swotFilePath = '../data/' . $swotFile;
$proposalFilePath = '../data/' . $proposalFile;
$roadmapFilePath = '../data/' . $roadmapFile;
$planFilePath = '../data/' . $planFile;

// --- 3. Read and Consolidate Input Files ---
if (!file_exists($bmcFilePath) || !file_exists($swotFilePath) || !file_exists($proposalFilePath) || !file_exists($roadmapFilePath)) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Required source documents (BMC, SWOT, Proposal, or Roadmap) not found.']);
    exit;
}

$bmcData = file_get_contents($bmcFilePath);
$swotData = file_get_contents($swotFilePath);
$proposalData = file_get_contents($proposalFilePath);
$roadmapData = file_get_contents($roadmapFilePath);

$consolidatedData = "Business Model Canvas:\n" . $bmcData .
                    "\n\nSWOT Analysis:\n" . $swotData .
                    "\n\nProject Proposal:\n" . $proposalData .
                    "\n\nProject Roadmap:\n" . $roadmapData;

// --- 4. Prepare the API Request ---
$apiEndpoint = 'https://api.deepseek.com/chat/completions';
$systemPromptTemplate = file_get_contents('system_prompt_plan.md');
$prompt = str_replace('[PROJECT_DATA]', $consolidatedData, $systemPromptTemplate);

$requestData = [
    'model' => 'deepseek-chat',
    'messages' => [
        ['role' => 'system', 'content' => 'You are an expert project manager AI.'],
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

// --- 7. Save the Generated Content ---
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

if (file_put_contents($planFilePath, json_encode($decodedContent, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'Project plan generated successfully!', 'file' => $planFile]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save the generated plan file.']);
}
