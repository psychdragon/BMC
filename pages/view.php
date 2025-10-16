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
                    // Updated regex to handle all known suffixes
                    $baseName = preg_replace('/(-swot|-proposal|-roadmap|-plan)\.json$/', '', $file);
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
                    echo "<div class='doc-links-container' data-project-basename='" . htmlspecialchars($baseName) . "'>";

                    // --- View Links Column ---
                    echo "<div class='view-links'>";
                    echo "<h4>View Documents</h4>";
                    $docMap = [
                        'BMC' => ['suffix' => '.json', 'urlPath' => 'canvas'],
                        'SWOT' => ['suffix' => '-swot.json', 'urlPath' => 'swot'],
                        'Proposal' => ['suffix' => '-proposal.json', 'urlPath' => 'proposal'],
                        'Roadmap' => ['suffix' => '-roadmap.json', 'urlPath' => 'roadmap'],
                        'Plan' => ['suffix' => '-plan.json', 'urlPath' => 'plan']
                    ];
                    $foundDocs = 0;
                    foreach ($docMap as $label => $details) {
                        $fileName = $baseName . $details['suffix'];
                        if (in_array($fileName, $projectFiles)) {
                            echo "<a href='{$baseUrl}{$details['urlPath']}?load=" . htmlspecialchars($fileName) . "' class='doc-link'>{$label}</a>";
                            $foundDocs++;
                        }
                    }
                    if ($foundDocs === 0) {
                        echo "<p class='no-docs'>No documents found.</p>";
                    }
                    echo "</div>"; // .view-links

                    // --- Generation Links Column ---
                    echo "<div class='generate-links'>";
                    echo "<h4>Generate Documents</h4>";
                    $bmcFile = $baseName . '.json';
                    echo "<a href='{$baseUrl}canvas?load=" . htmlspecialchars($bmcFile) . "' class='generate-link'>SWOT</a>";
                    echo "<a href='#' class='generate-doc-btn generate-link' data-doc-type='proposal' data-file='" . htmlspecialchars($bmcFile) . "'>Proposal</a>";
                    echo "<a href='#' class='generate-doc-btn generate-link' data-doc-type='roadmap' data-file='" . htmlspecialchars($bmcFile) . "'>Roadmap</a>";
                    echo "<a href='#' class='generate-doc-btn generate-link' data-doc-type='plan' data-file='" . htmlspecialchars($bmcFile) . "'>Plan</a>";
                    echo "</div>"; // .generate-links

                    echo "</div></div>"; // .doc-links-container, .project-card
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
