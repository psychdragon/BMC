<?php
// api/save_proposal.php
header('Content-Type: application/json');

// --- 1. Validate Request Method ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

// --- 2. Get and Decode Input ---
$input = json_decode(file_get_contents('php://input'), true);
$fileName = $input['file'] ?? null;
$content = $input['content'] ?? null;

// --- 3. Basic Input Validation ---
if (empty($fileName) || !isset($content)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Missing file name or content.']);
    exit;
}

// --- 4. Security Check for Filename ---
$safeFileName = basename($fileName);
if ($safeFileName !== $fileName) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file name.']);
    exit;
}

// --- 5. Construct File Path and Save ---
$filePath = '../data/' . $safeFileName;

if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'File not found.']);
    exit;
}

$jsonContent = json_encode($content, JSON_PRETTY_PRINT);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to encode content to JSON.']);
    exit;
}

if (file_put_contents($filePath, $jsonContent)) {
    echo json_encode(['status' => 'success', 'message' => 'Project proposal saved successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to write to file. Check permissions.']);
}
