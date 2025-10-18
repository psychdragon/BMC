<div class="swot-container">
    <div class="swot-header">
        <h1>SWOT Analysis</h1>
        <p class="subtitle"></p>
    </div>

    <div class="swot-actions">
        <button id="saveSwotBtn">💾 Save Changes</button>
        <button id="printSwotBtn">🖨️ Print</button>
        <button id="exportSwotPdfBtn">📄 Export to PDF</button>
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

    <div id="swotToExport">
        <div class="swot-quadrant-container">
            <div class="swot-quadrant strengths">
                <span class="swot-quadrant-label">Strengths</span>
                <ul></ul>
            </div>
            <div class="swot-quadrant weaknesses">
                <span class="swot-quadrant-label">Weaknesses</span>
                <ul></ul>
            </div>
            <div class="swot-quadrant opportunities">
                <span class="swot-quadrant-label">Opportunities</span>
                <ul></ul>
            </div>
            <div class="swot-quadrant threats">
                <span class="swot-quadrant-label">Threats</span>
                <ul></ul>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/refine.js"></script>
<script src="<?php echo $baseUrl; ?>js/swot.js"></script>