document.addEventListener('DOMContentLoaded', () => {
    const generationStatus = document.getElementById('generationStatus');
    const projectList = document.querySelector('.project-list');

    // --- Delegated Event Listener for All Actions in the Project List ---
    projectList.addEventListener('click', function(event) {
        const target = event.target;

        // --- Handle Document Generation ---
        if (target.classList.contains('generate-doc-btn')) {
            event.preventDefault();
            const baseFile = target.dataset.file;
            const docType = target.dataset.docType;
            handleDocumentGeneration(target, baseFile, docType); // Pass the button element
        }

        // --- Handle Project Rename ---
        if (target.classList.contains('rename-project-btn')) {
            event.preventDefault();
            const projectCard = target.closest('.project-card');
            const oldName = projectCard.dataset.basename;
            const newName = projectCard.querySelector('h2').textContent.trim();
            handleProjectRename(oldName, newName);
        }
    });

    const handleDocumentGeneration = (buttonElement, baseFile, docType) => {
        const apiKey = localStorage.getItem('deepSeekApiKey');

        if (!apiKey) {
            alert('API Key not found. Please set it in the settings page.');
            window.location.href = 'settings';
            return;
        }

        generationStatus.textContent = `Generating ${docType} for ${baseFile}...`;
        generationStatus.style.color = 'inherit';
        buttonElement.style.pointerEvents = 'none'; // Disable button during generation
        buttonElement.style.opacity = '0.5';

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/generate_${docType}.php`;

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
                generationStatus.textContent = `${docType.charAt(0).toUpperCase() + docType.slice(1)} generated successfully!`;
                generationStatus.style.color = 'green';

                // --- Dynamic UI Update ---
                const docLinksContainer = buttonElement.closest('.doc-links');
                const newFileName = data.file;
                const docLabel = docType.charAt(0).toUpperCase() + docType.slice(1);

                // Create the new "View" link
                const newLink = document.createElement('a');
                newLink.href = `${baseUrl}${docType}?load=${newFileName}`;
                newLink.className = 'doc-link';
                newLink.textContent = `View ${docLabel}`;

                // Check if a "View" link for this doc type already exists. If so, replace it.
                const existingLink = docLinksContainer.querySelector(`a[href*='${docType}?load=']`);
                if (existingLink) {
                    existingLink.replaceWith(newLink);
                } else {
                    // Otherwise, just append the new link
                    docLinksContainer.appendChild(newLink);
                }

                // Optional: You might want to hide or remove the generate button now
                // For now, we'll just re-enable it to allow regeneration.

            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error(`${docType} Generation error:`, error);
            generationStatus.textContent = `Error: ${error.message}`;
            generationStatus.style.color = 'red';
        })
        .finally(() => {
            // Re-enable the button
            buttonElement.style.pointerEvents = 'auto';
            buttonElement.style.opacity = '1';
            // Clear status after a few seconds
            setTimeout(() => { generationStatus.textContent = ''; }, 5000);
        });
    };

    const handleProjectRename = (oldName, newName) => {
        if (!newName || newName === oldName) {
            return; // No change or empty name
        }

        generationStatus.textContent = `Renaming '${oldName}' to '${newName}'...`;
        generationStatus.style.color = 'inherit';

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/rename_project.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                old_name: oldName,
                new_name: newName
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
                generationStatus.textContent = 'Project renamed successfully! Reloading...';
                generationStatus.style.color = 'green';
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('Rename error:', error);
            generationStatus.textContent = `Error: ${error.message}`;
            generationStatus.style.color = 'red';
        });
    };
});
