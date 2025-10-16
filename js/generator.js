document.addEventListener('DOMContentLoaded', () => {
    const generatorForm = document.querySelector('.generator-form');
    const businessIdeaTextarea = document.getElementById('business_idea');
    const submitButton = generatorForm.querySelector('button[type="submit"]');

    if (generatorForm) {
        generatorForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const businessIdea = businessIdeaTextarea.value.trim();
            const apiKey = localStorage.getItem('deepSeekApiKey');

            // --- 1. Frontend Validation ---
            if (!apiKey) {
                alert('API Key not found. Please set your DeepSeek API key in the Settings page.');
                return;
            }

            if (!businessIdea) {
                alert('Please enter a business idea.');
                return;
            }

            // --- 2. Provide User Feedback ---
            showLoader();

            // --- 3. Send Data to Backend using Fetch API ---
            const baseUrl = window.APP_BASE_URL || '/';
            const apiUrl = `${baseUrl}api/generate.php`;

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    business_idea: businessIdea,
                    api_key: apiKey
                })
            })
            .then(response => {
                if (!response.ok) {
                    // Try to get a meaningful error message from the response body
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    // --- 4. Handle Success ---
                    // Add a short delay before redirecting to allow the server to process the new file
                    setTimeout(() => {
                        window.location.href = `canvas?load=${data.file}`;
                    }, 500); // 500ms delay
                } else {
                    // --- 5. Handle Application-Level Errors ---
                    alert(`An error occurred: ${data.message}`);
                    // Re-enable the button if there was an error
                    submitButton.disabled = false;
                    submitButton.textContent = 'Generate Canvas';
                }
            })
            .catch(error => {
                // --- 6. Handle Network/Fetch Errors ---
                console.error('Fetch Error:', error);
                alert(`A critical error occurred: ${error.message}. Check the console for more details.`);
            })
            .finally(() => {
                hideLoader();
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Generate Canvas';
            });
        });
    }
});
