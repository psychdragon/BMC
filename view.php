<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Saved Canvases - Business Model Canvas Generator</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .canvas-list {
            list-style: none;
            padding: 0;
        }
        .canvas-list li {
            margin: 10px 0;
            background-color: #f7fafc;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
        }
        .canvas-list a {
            text-decoration: none;
            color: #2d3748;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>View Saved Canvases</h1>
        <ul class="canvas-list">
            <?php
            $dataDir = 'data/';
            // Check if the directory exists
            if (is_dir($dataDir)) {
                $files = scandir($dataDir);
                $jsonFiles = array_filter($files, function($file) {
                    return pathinfo($file, PATHINFO_EXTENSION) === 'json';
                });

                if (count($jsonFiles) > 0) {
                    foreach ($jsonFiles as $file) {
                        $fileName = htmlspecialchars($file);
                        $canvasName = htmlspecialchars(pathinfo($file, PATHINFO_FILENAME));
                        echo "<li><a href='canvas.php?load={$fileName}'>{$canvasName}</a></li>";
                    }
                } else {
                    echo "<li>No saved canvases found.</li>";
                }
            } else {
                echo "<li>The data directory does not exist.</li>";
            }
            ?>
        </ul>
        <p><a href="index.php">Back to Main Menu</a></p>
    </div>
</body>
</html>
