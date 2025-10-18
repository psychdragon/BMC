document.addEventListener('DOMContentLoaded', () => {
    const swotGrid = document.querySelector('.swot-grid');
    const subtitle = document.querySelector('.subtitle');
    const saveButton = document.getElementById('saveSwotBtn');
    const saveStatus = document.getElementById('saveStatus');
    const printButton = document.getElementById('printSwotBtn');
    const exportPdfButton = document.getElementById('exportSwotPdfBtn');

    // --- Save Logic ---
    const saveSwot = () => {
        const swotData = {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
        };

        document.querySelectorAll('.swot-quadrant').forEach(quadrant => {
            const category = Array.from(quadrant.classList).find(c => ['strengths', 'weaknesses', 'opportunities', 'threats'].includes(c));
            if (category) {
                const items = [];
                quadrant.querySelectorAll('li').forEach(li => {
                    items.push(li.textContent.trim());
                });
                swotData[category] = items;
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('load');

        if (!fileName) {
            alert('Cannot save: No file is currently loaded.');
            return;
        }

        saveStatus.textContent = 'Saving...';
        showLoader();

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/save_swot.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: fileName,
                content: swotData
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
            hideLoader();
            saveButton.disabled = false;
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);
        });
    };


    // Function to render the SWOT analysis from JSON data
    const renderSwot = (data) => {
        const container = document.querySelector('.swot-quadrant-container');
        if (!container) return;

        const renderList = (category, items) => {
            const quadrant = container.querySelector(`.${category} ul`);
            if (quadrant) {
                quadrant.innerHTML = '';
                items.forEach(itemText => {
                    const li = document.createElement('li');
                    li.textContent = itemText;
                    li.setAttribute('contenteditable', 'true');

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'list-actions';
                    actionsDiv.innerHTML = `
                        <button class="list-action-btn add-item" title="Add item below">+</button>
                        <button class="list-action-btn remove-item" title="Remove item">-</button>
                    `;
                    li.appendChild(actionsDiv);
                    quadrant.appendChild(li);
                });
            }
        };

        if (data.strengths) renderList('strengths', data.strengths);
        if (data.weaknesses) renderList('weaknesses', data.weaknesses);
        if (data.opportunities) renderList('opportunities', data.opportunities);
        if (data.threats) renderList('threats', data.threats);
    };

    // --- Print and Export Logic ---
    const printSwot = () => {
        window.print();
    };

    const exportToPdf = () => {
        const element = document.getElementById('swotToExport');
        const opt = {
            margin:       0.5,
            filename:     `${subtitle.textContent.trim().replace(/ /g, '_')}_SWOT_Analysis.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (saveButton) saveButton.addEventListener('click', saveSwot);
    if (printButton) printButton.addEventListener('click', printSwot);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportToPdf);

    // --- Dynamic Loading Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');
    const baseUrl = window.APP_BASE_URL || '/';

    if (loadFile) {
        if (loadFile.endsWith('.json') && !loadFile.includes('..') && !loadFile.includes('/')) {
            const dataUrl = `${baseUrl}data/${loadFile}`;
            if (subtitle) {
                const readableName = loadFile.replace('-swot.json', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                subtitle.textContent = `For: ${readableName}`;
            }

            fetch(dataUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`Network response was not ok (status: ${response.status})`);
                    return response.json();
                })
                .then(data => {
                    renderSwot(data);
                })
                .catch(error => {
                    console.error('Error fetching SWOT data:', error);
                    swotGrid.innerHTML = `<p>Error loading SWOT Analysis data from <strong>${dataUrl}</strong>. Please ensure the file exists and is a valid JSON.</p>`;
                });
        } else {
            console.error('Invalid file name specified.');
            swotGrid.innerHTML = '<p>Error: Invalid file name provided.</p>';
            if (subtitle) subtitle.textContent = 'Error';
        }
    } else {
        swotGrid.innerHTML = '<p>No SWOT analysis file specified.</p>';
        if (subtitle) subtitle.textContent = 'No file loaded';
    }

    // --- Initialize Add/Remove Button Logic ---
    initializeListActions('.swot-container');

    // Initialize WYSIWYG Editor
    initializeWysiwyg({
        launchBtnId: 'launchEditor',
        editorContainerId: 'editorContainer',
        summernoteId: 'summernote',
        saveBtnId: 'saveEditorContent',
        exportBtnId: 'exportDocx',
        exitBtnId: 'exitEditor',
        contentContainerSelector: '.swot-quadrant-container',
        actionsContainerSelector: '.swot-actions',
        titleSelector: '.subtitle',
        saveFunction: saveSwot
    });
});
