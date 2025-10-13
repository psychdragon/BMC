<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale-1.0">
    <title>Generate New Canvas - Business Model Canvas Generator</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="form-container">
            <h1>Generate New Business Model Canvas</h1>
            <p class="subtitle">Enter your business idea, concept, or a brief description below. The AI will generate a Business Model Canvas for you.</p>

            <form class="generator-form" action="api/generate.php" method="post">
                <textarea name="business_idea" id="business_idea" rows="8" placeholder="e.g., A subscription service for eco-friendly pet toys."></textarea>
                <button type="submit">🚀 Generate Canvas</button>
            </form>
            <a href="index.php" class="back-link">← Back to Main Menu</a>
        </div>
    </div>
    <script src="js/generator.js"></script>
</body>
</html>