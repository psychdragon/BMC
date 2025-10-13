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
                li.innerHTML = itemText;
                li.setAttribute('contenteditable', 'true'); // Make item editable
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

        fetch('/api/save.php', {
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
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (saveButton) saveButton.addEventListener('click', saveCanvas);
    if (printButton) printButton.addEventListener('click', printCanvas);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportToPdf);

    // --- Dynamic Loading Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');

    let dataUrl = '/data/canvas-template.json';
    if (loadFile) {
        if (loadFile.endsWith('.json') && !loadFile.includes('..') && !loadFile.includes('/')) {
            dataUrl = `/data/${loadFile}`;
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
});