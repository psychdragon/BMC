<?php
// Set the content type to JSON
header('Content-Type: application/json');

require_once 'config.php';

// --- 1. Basic Input Validation ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$bmcFile = $input['bmc_file'] ?? null;
$apiKey = $input['api_key'] ?? null;

// Sanitize the filename to prevent path traversal attacks
if ($bmcFile !== null) {
    $bmcFile = basename($bmcFile);
}

if (empty($bmcFile) || empty($apiKey)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Missing bmc_file or api_key.']);
    exit;
}

// --- 2. Read the BMC Data ---
$bmcFilePath = '../data/' . $bmcFile;
if (!file_exists($bmcFilePath)) {
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'error', 'message' => 'BMC file not found.']);
    exit;
}
$bmcData = file_get_contents($bmcFilePath);

// --- 3. Prepare the API Request ---
$apiEndpoint = 'https://api.deepseek.com/chat/completions';
$systemPrompt = file_get_contents('system_prompt_swot.md');
$prompt = $systemPrompt . "\n\nHere is the Business Model Canvas data:\n\n" . $bmcData;

$requestData = [
    'model' => 'deepseek-chat',
    'messages' => [
        ['role' => 'system', 'content' => 'You are an expert business consultant and analyst.'],
        ['role' => 'user', 'content' => $prompt]
    ],
    'response_format' => ['type' => 'json_object']
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

// --- 4. Make the cURL Request ---
$ch = curl_init($apiEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 120); // 2 minutes timeout

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// --- 5. Handle the API Response ---
if ($curlError) {
    http_response_code(500); // Internal Server Error
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

// --- 6. Save the Generated Content ---
$swotFileName = str_replace('.json', '-swot.json', $bmcFile);
$swotFilePath = '../data/' . $swotFileName;

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

if (file_put_contents($swotFilePath, json_encode($decodedContent, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'SWOT analysis generated successfully!', 'file' => $swotFileName]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save the generated SWOT analysis file.']);
}
