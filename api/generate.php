<?php
// Set the content type to JSON
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
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$businessIdea = $input['business_idea'] ?? null;
$apiKey = $input['api_key'] ?? null;

if (empty($businessIdea) || empty($apiKey)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Missing business_idea or api_key.']);
    exit;
}

// --- 2. Prepare the API Request ---
$apiEndpoint = 'https://api.deepseek.com/chat/completions';
$systemPrompt = file_get_contents('system_prompt.md');
$prompt = str_replace('[USER_BUSINESS_IDEA]', $businessIdea, $systemPrompt);

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

// --- 3. Make the cURL Request ---
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

// --- 4. Handle the API Response ---
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

// --- 5. Save the Generated Content ---
// Create a safe filename from the business idea
$fileName = preg_replace('/[^a-z0-9]+/', '-', strtolower(substr($businessIdea, 0, 50)));
$fileName = trim($fileName, '-') . '.json';
$filePath = '../data/' . $fileName;

// Validate the generated content is valid JSON before saving
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

// Use JSON_PRETTY_PRINT for readability
if (file_put_contents($filePath, json_encode($decodedContent, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'Canvas generated successfully!', 'file' => $fileName]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save the generated canvas file.']);
}
