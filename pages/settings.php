<div class="form-container">
    <h1>Settings</h1>
    <p class="subtitle">Manage your API keys here. The keys are saved locally in your browser and are not sent to our server.</p>

    <div class="settings-form">
        <label for="apiKey">DeepSeek API Key:</label>
        <input type="password" id="apiKey" name="apiKey" placeholder="Enter your DeepSeek API key">
        <button id="saveApiKey">Save Key</button>
        <p id="saveStatus" class="status-message"></p>
    </div>
    <a href="<?php echo $baseUrl; ?>" class="back-link">← Back to Main Menu</a>
</div>

<script src="<?php echo $baseUrl; ?>js/settings.js"></script>
