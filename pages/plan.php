<div class="plan-container">
    <div class="plan-header">
        <h1 id="planTitle" contenteditable="true"></h1>
    </div>

    <div class="plan-actions">
        <button id="savePlanBtn">💾 Save Changes</button>
        <button id="printPlanBtn">🖨️ Print</button>
        <button id="exportPlanPdfBtn">📄 Export to PDF</button>
        <button id="launchEditor" class="btn btn-primary">Launch Editor</button>
        <p id="saveStatus" class="status-message"></p>
    </div>

    <div id="planToExport">
        <div id="planContent" class="plan-content">
            <!-- Introduction -->
            <div class="plan-section">
                <h2 id="introductionHeading" contenteditable="true"></h2>
                <p id="introductionContent" contenteditable="true"></p>
            </div>

            <!-- Phases -->
            <div id="phasesContainer"></div>

            <!-- Resources -->
            <div class="plan-section">
                <h2 id="resourcesHeading" contenteditable="true"></h2>
                <p id="resourcesContent" contenteditable="true"></p>
            </div>

            <!-- Risks -->
            <div class="plan-section">
                <h2 id="risksHeading" contenteditable="true"></h2>
                <p id="risksContent" contenteditable="true"></p>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<?php include 'templates/wysiwyg.php'; ?>
<script src="<?php echo $baseUrl; ?>js/plan.js"></script>
