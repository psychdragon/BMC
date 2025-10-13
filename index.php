<?php
// index.php router

// Calculate the base path of the application
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

// Get the requested URL path
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// --- START: FIX for Subdirectory Routing ---
// Remove the base path from the request path to get the actual page
if ($basePath != '' && $basePath != '/') {
    // If the app is in a subdirectory, strip it from the request path
    $page = substr($requestPath, strlen($basePath));
} else {
    // If the app is at the root, the request path is the page
    $page = $requestPath;
}
// Remove the leading slash
$page = ltrim($page, '/');
// --- END: FIX for Subdirectory Routing ---

if (empty($page)) {
    $page = 'home';
}

// Whitelist of allowed pages to prevent arbitrary file inclusion
$allowedPages = ['home', 'generator', 'view', 'settings', 'canvas'];
$pageName = in_array($page, $allowedPages) ? $page : '404';

// Route to the correct content
switch ($pageName) {
    case 'home':
        $pageTitle = 'Main Menu - Business Model Canvas Generator';
        include 'templates/header.php';
        include 'pages/home.php';
        include 'templates/footer.php';
        break;

    case 'generator':
        $pageTitle = 'Generate New Canvas - Business Model Canvas Generator';
        include 'templates/header.php';
        include 'pages/generator.php';
        include 'templates/footer.php';
        break;

    case 'view':
        $pageTitle = 'View Saved Canvases - Business Model Canvas Generator';
        include 'templates/header.php';
        include 'pages/view.php';
        include 'templates/footer.php';
        break;

    case 'settings':
        $pageTitle = 'Settings - Business Model Canvas Generator';
        include 'templates/header.php';
        include 'pages/settings.php';
        include 'templates/footer.php';
        break;

    case 'canvas':
        $pageTitle = 'Business Model Canvas';
        include 'templates/header.php';
        include 'pages/canvas.php';
        include 'templates/footer.php';
        break;

    default: // 404 Not Found
        http_response_code(404);
        $pageTitle = '404 - Page Not Found';
        include 'templates/header.php';
        include 'pages/404.php';
        include 'templates/footer.php';
        break;
}
