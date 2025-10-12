<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate New Canvas - Business Model Canvas Generator</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>Generate New Business Model Canvas</h1>
        <p>Enter your business idea, concept, or a brief description below. The AI will generate a Business Model Canvas for you.</p>

        <form action="api/generate.php" method="post" class="generator-form">
            <textarea name="business_idea" id="business_idea" rows="10" placeholder="e.g., A subscription service for eco-friendly pet toys."></textarea>
            <button type="submit">Generate Canvas</button>
        </form>

        <p><a href="index.php">Back to Main Menu</a></p>
    </div>
    <script src="js/generator.js"></script>
</body>
</html>
