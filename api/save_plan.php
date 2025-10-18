<?php
// api/save_plan.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$fileName = $input['file'] ?? null;
$content = $input['content'] ?? null;

if (empty($fileName) || !isset($content)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing file name or content.']);
    exit;
}

$safeFileName = basename($fileName);
if ($safeFileName !== $fileName) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file name.']);
    exit;
}

$filePath = '../data/' . $safeFileName;

if (!file_exists($filePath)) {
    // Attempt to create the file if it doesn't exist, as a user might edit a newly generated plan before the first save.
    // This adds robustness.
    touch($filePath);
    if (!file_exists($filePath)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to create the plan file. Check directory permissions.']);
        exit;
    }
}


$jsonContent = json_encode($content, JSON_PRETTY_PRINT);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to encode content to JSON.']);
    exit;
}

if (file_put_contents($filePath, $jsonContent)) {
    echo json_encode(['status' => 'success', 'message' => 'Project plan saved successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to write to file. Check permissions.']);
}
