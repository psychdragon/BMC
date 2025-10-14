document.addEventListener('DOMContentLoaded', () => {
    const swotGrid = document.querySelector('.swot-grid');
    const subtitle = document.querySelector('.subtitle');
    const printButton = document.getElementById('printSwotBtn');
    const exportPdfButton = document.getElementById('exportSwotPdfBtn');

    // Function to render the SWOT analysis from JSON data
    const renderSwot = (data) => {
        const renderList = (category, items) => {
            const container = swotGrid.querySelector(`.${category} ul`);
            if (container) {
                container.innerHTML = '';
                items.forEach(itemText => {
                    const li = document.createElement('li');
                    li.textContent = itemText;
                    container.appendChild(li);
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
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

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
});
