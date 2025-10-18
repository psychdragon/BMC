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
        <button id="launchEditor" class="btn btn-primary">Launch Editor</button>
        <p id="saveStatus" class="status-message"></p>
    </div>

    <div id="canvasToExport">
        <div class="canvas">
            <!-- The 9 blocks of the Business Model Canvas will be generated here by js/script.js -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<?php include 'templates/wysiwyg.php'; ?>
<script src="<?php echo $baseUrl; ?>js/script.js"></script>
