<div class="swot-container">
    <div class="swot-header">
        <h1>SWOT Analysis</h1>
        <p class="subtitle"></p>
    </div>

    <div class="swot-actions">
        <button id="printSwotBtn">🖨️ Print</button>
        <button id="exportSwotPdfBtn">📄 Export to PDF</button>
    </div>

    <div id="swotToExport">
        <div class="swot-grid">
            <div class="swot-box strengths">
                <h2>Strengths</h2>
                <ul></ul>
            </div>
            <div class="swot-box weaknesses">
                <h2>Weaknesses</h2>
                <ul></ul>
            </div>
            <div class="swot-box opportunities">
                <h2>Opportunities</h2>
                <ul></ul>
            </div>
            <div class="swot-box threats">
                <h2>Threats</h2>
                <ul></ul>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="<?php echo $baseUrl; ?>js/swot.js"></script>