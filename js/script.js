document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.canvas');
    const subtitle = document.querySelector('.subtitle');
    const saveButton = document.getElementById('saveCanvasBtn');
    const saveStatus = document.getElementById('saveStatus');
    const printButton = document.getElementById('printBtn');
    const exportPdfButton = document.getElementById('exportPdfBtn');

    // Function to render the canvas from JSON data
    const renderCanvas = (data) => {
        canvas.innerHTML = '';
        const titles = {
            keyPartners: 'Key Partners',
            keyActivities: 'Key Activities',
            valuePropositions: 'Value Propositions',
            customerRelationships: 'Customer Relationships',
            customerSegments: 'Customer Segments',
            keyResources: 'Key Resources',
            channels: 'Channels',
            costStructure: 'Cost Structure',
            revenueStreams: 'Revenue Streams'
        };

        const createBox = (key, items) => {
            const box = document.createElement('div');
            const kebabCaseKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            box.classList.add('box', kebabCaseKey);
            box.dataset.key = key; // Store the original key

            const title = document.createElement('h2');
            title.textContent = titles[key] || key;
            box.appendChild(title);

            const ul = document.createElement('ul');
            items.forEach(itemText => {
                const li = document.createElement('li');
                li.innerHTML = itemText; // Use innerHTML to preserve formatting
                li.setAttribute('contenteditable', 'true');

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'list-actions';
                actionsDiv.innerHTML = `
                    <button class="list-action-btn add-item" title="Add item below">+</button>
                    <button class="list-action-btn remove-item" title="Remove item">-</button>
                `;
                li.appendChild(actionsDiv);
                ul.appendChild(li);
            });
            box.appendChild(ul);
            return box;
        };

        const gridOrder = [
            'keyPartners', 'keyActivities', 'valuePropositions', 'customerRelationships', 'customerSegments',
            'keyResources', 'channels', 'costStructure', 'revenueStreams'
        ];

        gridOrder.forEach(key => {
            if (data[key]) {
                const box = createBox(key, data[key]);
                canvas.appendChild(box);
            }
        });
    };

    // --- Save Logic ---
    const saveCanvas = () => {
        const canvasData = {};
        const canvasBoxes = document.querySelectorAll('.canvas .box');

        canvasBoxes.forEach(box => {
            const key = box.dataset.key;
            const items = [];
            const listItems = box.querySelectorAll('li');
            listItems.forEach(li => {
                items.push(li.innerHTML); // Use innerHTML to preserve formatting
            });
            canvasData[key] = items;
        });

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('load');

        if (!fileName) {
            alert('Cannot save: No file is currently loaded.');
            return;
        }

        saveStatus.textContent = 'Saving...';
        saveButton.disabled = true;

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/save.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: fileName,
                content: canvasData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                saveStatus.textContent = 'Saved successfully!';
                saveStatus.style.color = 'green';
            } else {
                saveStatus.textContent = `Error: ${data.message}`;
                saveStatus.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Save error:', error);
            saveStatus.textContent = 'A network error occurred.';
            saveStatus.style.color = 'red';
        })
        .finally(() => {
            saveButton.disabled = false;
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);
        });
    };

    // --- Print and Export Logic ---
    const printCanvas = () => {
        window.print();
    };

    const exportToPdf = () => {
        const element = document.getElementById('canvasToExport');
        const opt = {
            margin:       0.5,
            filename:     `${subtitle.textContent.trim().replace(/ /g, '_')}_Business_Model_Canvas.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const generateSwotButton = document.getElementById('generateSwotBtn');

    // --- SWOT Generation Logic ---
    const generateSwotAnalysis = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('load');
        const apiKey = localStorage.getItem('deepSeekApiKey');

        if (!fileName) {
            alert('Cannot generate SWOT: No file is currently loaded.');
            return;
        }

        if (!apiKey) {
            alert('API Key not found. Please set it in the settings page.');
            window.location.href = 'settings';
            return;
        }

        const statusElement = document.getElementById('saveStatus');
        statusElement.textContent = 'Generating SWOT Analysis...';
        statusElement.style.color = 'inherit';
        generateSwotButton.disabled = true;

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/generate_swot.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bmc_file: fileName,
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
                statusElement.textContent = 'SWOT Analysis generated successfully!';
                statusElement.style.color = 'green';
                // Redirect to the new SWOT page
                window.location.href = `swot?load=${data.file}`;
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('SWOT Generation error:', error);
            statusElement.textContent = `Error: ${error.message}`;
            statusElement.style.color = 'red';
        })
        .finally(() => {
            generateSwotButton.disabled = false;
            setTimeout(() => { statusElement.textContent = ''; }, 5000);
        });
    };

    if (saveButton) saveButton.addEventListener('click', saveCanvas);
    if (printButton) printButton.addEventListener('click', printCanvas);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportToPdf);
    if (generateSwotButton) generateSwotButton.addEventListener('click', generateSwotAnalysis);

    // --- Dynamic Loading Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');

    // Use the base URL provided from PHP to construct the correct path
    const baseUrl = window.APP_BASE_URL || '/';

    let dataUrl = `${baseUrl}data/canvas-template.json`;
    if (loadFile) {
        if (loadFile.endsWith('.json') && !loadFile.includes('..') && !loadFile.includes('/')) {
            dataUrl = `${baseUrl}data/${loadFile}`;
            if (subtitle) {
                const readableName = loadFile.replace('.json', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                subtitle.textContent = readableName;
            }
        } else {
            console.error('Invalid file name specified.');
            canvas.innerHTML = '<p>Error: Invalid file name provided.</p>';
            if (subtitle) subtitle.textContent = 'Error';
            return;
        }
    } else {
        if (subtitle) subtitle.textContent = 'Default Template';
    }

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok (status: ${response.status})`);
            return response.json();
        })
        .then(data => {
            renderCanvas(data);
        })
        .catch(error => {
            console.error('Error fetching canvas data:', error);
            canvas.innerHTML = `<p>Error loading Business Model Canvas data from <strong>${dataUrl}</strong>. Please ensure the file exists and is a valid JSON.</p>`;
        });

    // --- Initialize Add/Remove Button Logic ---
    initializeListActions('.canvas-container');
});