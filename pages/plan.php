<div class="plan-container">
    <div class="plan-header">
        <h1 id="planTitle"></h1>
    </div>

    <div class="plan-actions">
        <button id="savePlanBtn">💾 Save Changes</button>
        <button id="printPlanBtn">🖨️ Print</button>
        <button id="exportPlanPdfBtn">📄 Export to PDF</button>
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

    <div id="planToExport">
        <div class="plan-content">
            <!-- Project plan phases and tasks will be rendered here by JS -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/refine.js"></script>
<script src="<?php echo $baseUrl; ?>js/plan.js"></script>
