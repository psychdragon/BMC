<div class="roadmap-container">
    <div class="roadmap-header">
        <h1 id="roadmapTitle"></h1>
    </div>

    <div class="roadmap-actions">
        <button id="saveRoadmapBtn">💾 Save Changes</button>
        <button id="printRoadmapBtn">🖨️ Print</button>
        <button id="exportRoadmapPdfBtn">📄 Export to PDF</button>
        <p id="saveStatus" class="status-message"></p>
    </div>

    <?php
    $projectFiles = []; // This will be populated by logic in the page
    if (isset($_GET['load'])) {
        $baseName = basename(explode('.json', $_GET['load'])[0]);
        // Basic security check
        if (!empty($baseName) && !preg_match('/[^a-z0-9-]/', $baseName)) {
            $dataDir = 'data/';
            $files = scandir($dataDir);
            foreach($files as $file) {
                if (strpos($file, $baseName) === 0) {
                    $projectFiles[] = $file;
                }
            }
        }
    }
    include 'templates/refine_ui.php';
    ?>

    <div id="roadmapToExport">
        <div class="roadmap-content">
            <!-- Roadmap quarters and milestones will be rendered here by JS -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/refine.js"></script>
<script src="<?php echo $baseUrl; ?>js/roadmap.js"></script>
