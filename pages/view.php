<div class="list-container">
    <h1>View Saved Canvases</h1>
    <p class="subtitle">Select a previously generated Business Model Canvas to view or edit.</p>
    <ul class="canvas-list">
        <?php
        $dataDir = 'data/';
        if (is_dir($dataDir)) {
            $files = scandir($dataDir);
            // Filter files to get only the primary BMC json files (excluding swot files)
            $jsonFiles = array_filter($files, function($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'json' && strpos($file, '-swot.json') === false;
            });

            if (count($jsonFiles) > 0) {
                foreach ($jsonFiles as $file) {
                    $fileName = htmlspecialchars($file);
                    $canvasName = htmlspecialchars(pathinfo($file, PATHINFO_FILENAME));
                    $displayName = ucwords(str_replace('-', ' ', $canvasName));

                    echo "<li>";
                    echo "<a href='{$baseUrl}canvas?load={$fileName}'>{$displayName}</a>";

                    // Check for a corresponding SWOT file and add a link if it exists
                    $swotFileName = str_replace('.json', '-swot.json', $file);
                    if (file_exists($dataDir . $swotFileName)) {
                        $swotFileNameHtml = htmlspecialchars($swotFileName);
                        echo " <span class='doc-links'>| <a href='{$baseUrl}swot?load={$swotFileNameHtml}'>SWOT</a></span>";
                    }

                    echo "</li>";
                }
            } else {
                echo "<li>No saved canvases found.</li>";
            }
        } else {
            echo "<li>The data directory does not exist or is not readable.</li>";
        }
        ?>
    </ul>
    <a href="<?php echo $baseUrl; ?>" class="back-link">← Back to Main Menu</a>
</div>
