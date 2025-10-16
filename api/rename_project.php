<?php
// api/rename_project.php
header('Content-Type: application/json');

// --- 1. Validate Request Method ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
    exit;
}

// --- 2. Get and Decode Input ---
$input = json_decode(file_get_contents('php://input'), true);
$oldBaseName = $input['old_name'] ?? null;
$newBaseName = $input['new_name'] ?? null;

// --- 3. Basic Input Validation ---
if (empty($oldBaseName) || empty($newBaseName)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing old_name or new_name.']);
    exit;
}

// --- 4. Sanitize and Validate New Name ---
// Create a safe filename from the new name
$safeNewBaseName = preg_replace('/[^a-z0-9]+/', '-', strtolower($newBaseName));
$safeNewBaseName = trim($safeNewBaseName, '-');

if (empty($safeNewBaseName)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'The new project name is invalid.']);
    exit;
}

// --- 5. Check for Conflicts ---
$dataDir = '../data/';
if (file_exists($dataDir . $safeNewBaseName . '.json')) {
    http_response_code(409); // Conflict
    echo json_encode(['status' => 'error', 'message' => 'A project with this name already exists.']);
    exit;
}

// --- 6. Rename All Associated Files ---
$docSuffixes = ['.json', '-swot.json', '-proposal.json', '-roadmap.json'];
$errors = [];
$renamedFiles = [];

foreach ($docSuffixes as $suffix) {
    $oldFile = $dataDir . $oldBaseName . $suffix;
    $newFile = $dataDir . $safeNewBaseName . $suffix;

    if (file_exists($oldFile)) {
        if (!rename($oldFile, $newFile)) {
            $errors[] = "Failed to rename {$oldFile} to {$newFile}.";
        } else {
            $renamedFiles[] = $newFile;
        }
    }
}

// --- 7. Respond ---
if (count($errors) > 0) {
    // Attempt to roll back by renaming files back to their original names
    foreach ($renamedFiles as $newFile) {
        $oldFileAgain = str_replace($safeNewBaseName, $oldBaseName, $newFile);
        rename($newFile, $oldFileAgain); // Best effort, might fail
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred during renaming.', 'details' => $errors]);
    exit;
}

if (count($renamedFiles) === 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'No files found for the original project name.']);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Project renamed successfully.']);
