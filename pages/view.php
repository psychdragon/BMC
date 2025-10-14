<div class="list-container">
    <h1>View Saved Canvases</h1>
    <p class="subtitle">Select a previously generated Business Model Canvas to view associated documents or generate new ones.</p>
    <p id="generationStatus" class="status-message" style="text-align: center;"></p>
    <ul class="canvas-list">
        <?php
        $dataDir = 'data/';
        if (is_dir($dataDir)) {
            $files = scandir($dataDir);
            // Filter files to get only the primary BMC json files (excluding related documents)
            $jsonFiles = array_filter($files, function($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'json' &&
                       strpos($file, '-swot.json') === false &&
                       strpos($file, '-proposal.json') === false;
            });

            if (count($jsonFiles) > 0) {
                foreach ($jsonFiles as $file) {
                    $fileName = htmlspecialchars($file);
                    $canvasName = htmlspecialchars(pathinfo($file, PATHINFO_FILENAME));
                    $displayName = ucwords(str_replace('-', ' ', $canvasName));

                    echo "<li>";
                    echo "<a href='{$baseUrl}canvas?load={$fileName}'>{$displayName}</a>";

                    // --- Link to associated documents ---
                    echo "<div class='doc-links'>";

                    // Check for SWOT file
                    $swotFileName = str_replace('.json', '-swot.json', $file);
                    if (file_exists($dataDir . $swotFileName)) {
                        $swotFileNameHtml = htmlspecialchars($swotFileName);
                        echo " <a href='{$baseUrl}swot?load={$swotFileNameHtml}'>View SWOT</a>";
                    }

                    // Check for Proposal file OR show generate button
                    $proposalFileName = str_replace('.json', '-proposal.json', $file);
                    if (file_exists($dataDir . $proposalFileName)) {
                        $proposalFileNameHtml = htmlspecialchars($proposalFileName);
                        echo " <a href='{$baseUrl}proposal?load={$proposalFileNameHtml}'>View Proposal</a>";
                    } else if (file_exists($dataDir . $swotFileName)) {
                        // Only show Generate button if SWOT exists, as it's a dependency
                        echo " <a href='#' class='generate-proposal-btn' data-file='{$fileName}'>Generate Proposal</a>";
                    }

                    echo "</div></li>";
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
<script src="<?php echo $baseUrl; ?>js/view.js"></script>
