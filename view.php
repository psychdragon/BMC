<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Saved Canvases - Business Model Canvas Generator</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="list-container">
            <h1>View Saved Canvases</h1>
            <p class="subtitle">Select a previously generated Business Model Canvas to view or edit.</p>
            <ul class="canvas-list">
                <?php
                $dataDir = 'data/';
                if (is_dir($dataDir)) {
                    $files = scandir($dataDir);
                    $jsonFiles = array_filter($files, function($file) {
                        return pathinfo($file, PATHINFO_EXTENSION) === 'json';
                    });

                    if (count($jsonFiles) > 0) {
                        foreach ($jsonFiles as $file) {
                            $fileName = htmlspecialchars($file);
                            $canvasName = htmlspecialchars(pathinfo($file, PATHINFO_FILENAME));
                            // Format name for display
                            $displayName = ucwords(str_replace('-', ' ', $canvasName));
                            echo "<li><a href='canvas.php?load={$fileName}'>{$displayName}</a></li>";
                        }
                    } else {
                        echo "<li>No saved canvases found.</li>";
                    }
                } else {
                    echo "<li>The data directory does not exist or is not readable.</li>";
                }
                ?>
            </ul>
            <a href="index.php" class="back-link">← Back to Main Menu</a>
        </div>
    </div>
</body>
</html>