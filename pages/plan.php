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

    <div id="planToExport">
        <div class="plan-content">
            <!-- Project plan phases and tasks will be rendered here by JS -->
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/plan.js"></script>
