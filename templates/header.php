<?php
// templates/header.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Business Model Canvas Generator'; ?></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header class="main-nav">
        <div class="logo">
            <a href="/">BMCGen</a>
        </div>
        <nav class="nav-links">
            <a href="/generator">🚀 Generate New Canvas</a>
            <a href="/view">📂 View Saved Canvases</a>
            <a href="/settings">⚙️ Settings</a>
        </nav>
    </header>
    <div class="container">
