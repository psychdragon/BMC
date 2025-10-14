<div class="list-container">
    <h1>View Projects</h1>
    <p class="subtitle">Select a project to view its documents, or generate new ones.</p>
    <p id="generationStatus" class="status-message" style="text-align: center;"></p>
    <div class="project-list">
        <?php
        $dataDir = 'data/';
        if (is_dir($dataDir)) {
            $files = scandir($dataDir);
            $projects = [];

            // Group files by project base name
            foreach ($files as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                    $baseName = preg_replace('/(-swot|-proposal)\.json$/', '', $file);
                    $baseName = str_replace('.json', '', $baseName);

                    if (!isset($projects[$baseName])) {
                        $projects[$baseName] = [];
                    }
                    $projects[$baseName][] = $file;
                }
            }

            if (count($projects) > 0) {
                foreach ($projects as $baseName => $projectFiles) {
                    $displayName = ucwords(str_replace('-', ' ', $baseName));

                    echo "<div class='project-card' data-basename='" . htmlspecialchars($baseName) . "'>";
                    echo "<div class='project-title'>
                            <h2 contenteditable='true'>{$displayName}</h2>
                            <button class='rename-project-btn'>💾</button>
                          </div>";
                    echo "<div class='doc-links'>";

                    // Define the order and labels for documents
                    $docTypes = [
                        '.json' => 'BMC',
                        '-swot.json' => 'SWOT',
                        '-proposal.json' => 'Proposal'
                    ];

                    foreach ($docTypes as $suffix => $label) {
                        $fileName = $baseName . $suffix;
                        if (in_array($fileName, $projectFiles)) {
                            $urlPath = ($label === 'BMC') ? 'canvas' : strtolower($label);
                            echo "<a href='{$baseUrl}{$urlPath}?load=" . htmlspecialchars($fileName) . "' class='doc-link'>View {$label}</a>";
                        }
                    }

                    // --- Generation Links ---
                    $bmcFile = $baseName . '.json';
                    $swotFile = $baseName . '-swot.json';
                    $proposalFile = $baseName . '-proposal.json';

                    echo "<div class='generation-links'>";
                    if (in_array($bmcFile, $projectFiles) && !in_array($swotFile, $projectFiles)) {
                        // This link is handled by canvas.php's JS
                        echo "<a href='{$baseUrl}canvas?load=" . htmlspecialchars($bmcFile) . "' class='generate-link'>Generate SWOT</a>";
                    }
                    if (in_array($swotFile, $projectFiles) && !in_array($proposalFile, $projectFiles)) {
                        echo "<a href='#' class='generate-proposal-btn generate-link' data-file='" . htmlspecialchars($bmcFile) . "'>Generate Proposal</a>";
                    }
                    echo "</div>"; // .generation-links

                    echo "</div></div>"; // .doc-links, .project-card
                }
            } else {
                echo "<p>No projects found. Create a new Business Model Canvas to start a project.</p>";
            }
        } else {
            echo "<p>Error: The data directory does not exist or is not readable.</p>";
        }
        ?>
    </div>
    <a href="<?php echo $baseUrl; ?>" class="back-link">← Back to Main Menu</a>
</div>
<script src="<?php echo $baseUrl; ?>js/view.js"></script>
