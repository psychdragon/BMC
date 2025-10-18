// js/refine.js

function initializeRefine(docType, baseName, renderFunction) {
    const toggleBtn = document.getElementById('toggleRefineBtn');
    const refinePanel = document.getElementById('refinePanel');
    const refinePromptTextarea = document.getElementById('refinePrompt');
    const refineSubmitBtn = document.getElementById('refineSubmitBtn');
    const refineStatus = document.getElementById('refineStatus');
    const contextDocsContainer = document.getElementById('refineContextDocs');

    toggleBtn.addEventListener('click', () => {
        refinePanel.style.display = refinePanel.style.display === 'none' ? 'block' : 'none';
    });

    refineSubmitBtn.addEventListener('click', () => {
        const userPrompt = refinePromptTextarea.value.trim();
        if (!userPrompt) {
            alert('Please enter a prompt.');
            return;
        }

        const apiKey = localStorage.getItem('deepSeekApiKey');
        if (!apiKey) {
            alert('API Key not found. Please set it in the settings page.');
            window.location.href = 'settings';
            return;
        }

        const contextDocs = Array.from(contextDocsContainer.querySelectorAll('input[name="context_doc"]:checked'))
                                 .map(checkbox => checkbox.value);

        refineStatus.textContent = 'Refining document...';
        showLoader();

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/refine_document.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                base_name: baseName,
                doc_type: docType,
                prompt: userPrompt,
                context_docs: contextDocs,
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
                refineStatus.textContent = 'Document refined successfully!';
                refineStatus.style.color = 'green';

                // Call the page-specific render function with the new content
                renderFunction(data.refined_content);

                // Hide the panel and clear the prompt
                setTimeout(() => {
                    refinePanel.style.display = 'none';
                    refinePromptTextarea.value = '';
                    refineStatus.textContent = '';
                }, 2000);
            } else {
                throw new Error(data.message || 'An unknown error occurred during refinement.');
            }
        })
        .catch(error => {
            console.error('Refinement error:', error);
            refineStatus.textContent = `Error: ${error.message}`;
            refineStatus.style.color = 'red';
        })
        .finally(() => {
            hideLoader();
        });
    });
}
