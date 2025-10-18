<div class="swot-container">
    <div class="swot-header">
        <h1>SWOT Analysis</h1>
        <p class="subtitle"></p>
    </div>

    <div class="swot-actions">
        <button id="saveSwotBtn">💾 Save Changes</button>
        <button id="printSwotBtn">🖨️ Print</button>
        <button id="exportSwotPdfBtn">📄 Export to PDF</button>
        <button id="launchEditor" class="btn btn-primary">Launch Editor</button>
        <p id="saveStatus" class="status-message"></p>
    </div>

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
<?php include 'templates/wysiwyg.php'; ?>
<script src="<?php echo $baseUrl; ?>js/swot.js"></script>