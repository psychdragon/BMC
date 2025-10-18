<div class="proposal-container">
    <div class="proposal-header">
        <h1 id="proposalTitle"></h1>
    </div>

    <div class="proposal-actions">
        <button id="saveProposalBtn">💾 Save Changes</button>
        <button id="printProposalBtn">🖨️ Print</button>
        <button id="exportProposalPdfBtn">📄 Export to PDF</button>
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

    <div id="proposalToExport">
        <div class="proposal-content">
            <section id="introduction">
                <h2>Introduction</h2>
                <p></p>
            </section>
            <section id="objectives">
                <h2>Objectives</h2>
                <ul></ul>
            </section>
            <section id="scope">
                <h2>Scope</h2>
                <h3>In Scope</h3>
                <ul class="in-scope"></ul>
                <h3>Out of Scope</h3>
                <ul class="out-of-scope"></ul>
            </section>
            <section id="deliverables">
                <h2>Deliverables</h2>
                <ul></ul>
            </section>
            <section id="timeline">
                <h2>Timeline</h2>
                <div class="timeline-phases"></div>
            </section>
            <section id="budget">
                <h2>Budget</h2>
                <p class="budget-summary"></p>
                <ul class="budget-breakdown"></ul>
            </section>
            <section id="conclusion">
                <h2>Conclusion</h2>
                <p></p>
            </section>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/refine.js"></script>
<script src="<?php echo $baseUrl; ?>js/proposal.js"></script>
