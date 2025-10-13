<div class="form-container">
    <h1>Generate New Business Model Canvas</h1>
    <p class="subtitle">Enter your business idea, concept, or a brief description below. The AI will generate a Business Model Canvas for you.</p>

    <form class="generator-form" action="<?php echo $baseUrl; ?>api/generate.php" method="post">
        <textarea name="business_idea" id="business_idea" rows="8" placeholder="e.g., A subscription service for eco-friendly pet toys."></textarea>
        <button type="submit">🚀 Generate Canvas</button>
    </form>
    <a href="<?php echo $baseUrl; ?>" class="back-link">← Back to Main Menu</a>
</div>
<script src="<?php echo $baseUrl; ?>js/generator.js"></script>
