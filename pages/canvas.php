<div class="canvas-container">
    <div class="canvas-header">
        <h1>Business Model Canvas</h1>
        <p class="subtitle"></p>
    </div>

    <div class="canvas-actions">
        <button id="saveCanvasBtn">💾 Save Changes</button>
        <button id="printBtn">🖨️ Print</button>
        <button id="exportPdfBtn">📄 Export to PDF</button>
        <button id="generateSwotBtn">📊 Generate SWOT Analysis</button>
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

    <div id="canvasToExport">
        <div class="canvas">
            <!-- The 9 blocks of the Business Model Canvas will be generated here by js/script.js -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/refine.js"></script>
<script src="<?php echo $baseUrl; ?>js/script.js"></script>
