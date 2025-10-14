document.addEventListener('DOMContentLoaded', () => {
    const generationStatus = document.getElementById('generationStatus');

    document.querySelectorAll('.generate-proposal-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const baseFile = this.dataset.file;
            const apiKey = localStorage.getItem('deepSeekApiKey');

            if (!apiKey) {
                alert('API Key not found. Please set it in the settings page.');
                window.location.href = 'settings';
                return;
            }

            generationStatus.textContent = `Generating proposal for ${baseFile}...`;
            generationStatus.style.color = 'inherit';

            const baseUrl = window.APP_BASE_URL || '/';
            const apiUrl = `${baseUrl}api/generate_proposal.php`;

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bmc_file: baseFile,
                    api_key: apiKey
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message || `HTTP error! status: ${response.status}`); });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    generationStatus.textContent = 'Proposal generated successfully! Reloading...';
                    generationStatus.style.color = 'green';
                    // Reload the page to show the new "View Proposal" link
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    throw new Error(data.message || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                console.error('Proposal Generation error:', error);
                generationStatus.textContent = `Error: ${error.message}`;
                generationStatus.style.color = 'red';
            });
        });
    });
});
