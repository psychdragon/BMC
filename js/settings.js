document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const saveStatus = document.getElementById('saveStatus');

    // Load the saved API key from local storage, if it exists
    const savedApiKey = localStorage.getItem('deepSeekApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    // Save the API key to local storage when the button is clicked
    saveApiKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('deepSeekApiKey', apiKey);
            saveStatus.textContent = 'API key saved successfully!';
            saveStatus.style.color = 'green';
        } else {
            saveStatus.textContent = 'Please enter an API key.';
            saveStatus.style.color = 'red';
        }

        // Hide the status message after a few seconds
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 3000);
    });
});
