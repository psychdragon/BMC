<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Business Model Canvas Generator</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="form-container">
            <h1>Settings</h1>
            <p class="subtitle">Manage your API keys here. The keys are saved locally in your browser and are not sent to our server.</p>

            <div class="settings-form">
                <label for="apiKey">DeepSeek API Key:</label>
                <input type="password" id="apiKey" name="apiKey" placeholder="Enter your DeepSeek API key">
                <button id="saveApiKey">Save Key</button>
                <p id="saveStatus" class="status-message"></p>
            </div>
            <a href="index.php" class="back-link">← Back to Main Menu</a>
        </div>
    </div>

    <script src="js/settings.js"></script>
</body>
</html>