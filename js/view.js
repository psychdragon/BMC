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
            handleDocumentGeneration(baseFile, docType);
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

    const handleDocumentGeneration = (baseFile, docType) => {
        const apiKey = localStorage.getItem('deepSeekApiKey');

        if (!apiKey) {
            alert('API Key not found. Please set it in the settings page.');
            window.location.href = 'settings';
            return;
        }

        generationStatus.textContent = `Generating ${docType} for ${baseFile}...`;
        generationStatus.style.color = 'inherit';

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
                generationStatus.textContent = `${docType.charAt(0).toUpperCase() + docType.slice(1)} generated successfully! Reloading...`;
                generationStatus.style.color = 'green';
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error(`${docType} Generation error:`, error);
            generationStatus.textContent = `Error: ${error.message}`;
            generationStatus.style.color = 'red';
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
