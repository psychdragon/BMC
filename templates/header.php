<?php
// templates/header.php

// Calculate the base URL dynamically
// This makes the links work correctly even when the app is in a subdirectory
$baseUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
// If the app is at the root, dirname might return just a slash or an empty string
if ($baseUrl == '' || $baseUrl == '/') {
    $baseUrl = '/';
} else {
    $baseUrl .= '/';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Business Model Canvas Generator'; ?></title>
    <link rel="stylesheet" href="<?php echo $baseUrl; ?>css/style.css">
    <script>
        // Pass the base URL from PHP to a global JavaScript variable
        window.APP_BASE_URL = "<?php echo $baseUrl; ?>";
    </script>
</head>
<body>
    <header class="main-nav">
        <div class="logo">
            <a href="<?php echo $baseUrl; ?>">BMCGen</a>
        </div>
        <nav class="nav-links">
            <a href="<?php echo $baseUrl; ?>generator">🚀 Generate New Canvas</a>
            <a href="<?php echo $baseUrl; ?>view">📂 View Saved Canvases</a>
            <a href="<?php echo $baseUrl; ?>settings">⚙️ Settings</a>
        </nav>
    </header>
    <div class="container">
