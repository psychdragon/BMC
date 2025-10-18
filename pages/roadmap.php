<div class="roadmap-container">
    <div class="roadmap-header">
        <h1 id="roadmapTitle"></h1>
    </div>

    <div class="roadmap-actions">
        <button id="saveRoadmapBtn">💾 Save Changes</button>
        <button id="printRoadmapBtn">🖨️ Print</button>
        <button id="exportRoadmapPdfBtn">📄 Export to PDF</button>
        <button id="launchEditor" class="btn btn-primary">Launch Editor</button>
        <p id="saveStatus" class="status-message"></p>
    </div>

    <div id="roadmapToExport">
        <div class="roadmap-content">
            <!-- Roadmap quarters and milestones will be rendered here by JS -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<?php include 'templates/wysiwyg.php'; ?>
<script src="<?php echo $baseUrl; ?>js/roadmap.js"></script>
