document.addEventListener('DOMContentLoaded', () => {
    const proposalContent = document.querySelector('.proposal-content');
    const proposalTitle = document.getElementById('proposalTitle');
    const saveButton = document.getElementById('saveProposalBtn');
    const saveStatus = document.getElementById('saveStatus');
    const printButton = document.getElementById('printProposalBtn');
    const exportPdfButton = document.getElementById('exportProposalPdfBtn');

    // --- Save Logic ---
    const saveProposal = () => {
        const proposalData = {
            title: document.getElementById('proposalTitle').textContent.trim(),
            introduction: document.querySelector('#introduction p').textContent.trim(),
            objectives: Array.from(document.querySelectorAll('#objectives li')).map(li => li.textContent.trim()),
            scope: {
                in_scope: Array.from(document.querySelectorAll('#scope .in-scope li')).map(li => li.textContent.trim()),
                out_of_scope: Array.from(document.querySelectorAll('#scope .out-of-scope li')).map(li => li.textContent.trim())
            },
            deliverables: Array.from(document.querySelectorAll('#deliverables li')).map(li => li.textContent.trim()),
            timeline: Array.from(document.querySelectorAll('#timeline .phase')).map(phase => ({
                phase: phase.querySelector('.phase-name').textContent.trim(),
                duration: phase.querySelector('.phase-duration').textContent.trim(),
                description: phase.querySelector('p').textContent.trim()
            })),
            budget: {
                summary: document.querySelector('#budget .budget-summary').textContent.trim(),
                breakdown: Array.from(document.querySelectorAll('#budget .budget-breakdown li')).map(li => ({
                    item: li.querySelector('.item-name').textContent.trim(),
                    cost: li.querySelector('.item-cost').textContent.trim()
                }))
            },
            conclusion: document.querySelector('#conclusion p').textContent.trim()
        };

        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('load');

        if (!fileName) {
            alert('Cannot save: No file is currently loaded.');
            return;
        }

        saveStatus.textContent = 'Saving...';
        saveButton.disabled = true;

        const baseUrl = window.APP_BASE_URL || '/';
        const apiUrl = `${baseUrl}api/save_proposal.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: fileName,
                content: proposalData
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
    const printProposal = () => {
        window.print();
    };

    const exportProposalPdf = () => {
        const element = document.getElementById('proposalToExport');
        const opt = {
            margin:       0.5,
            filename:     `${proposalTitle.textContent.trim().replace(/ /g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const renderProposal = (data) => {
        proposalTitle.textContent = data.title || 'Project Proposal';
        proposalTitle.setAttribute('contenteditable', 'true');

        // Helper function to populate a list
        const populateList = (selector, items) => {
            const list = proposalContent.querySelector(selector);
            if (list && Array.isArray(items)) {
                list.innerHTML = '';
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    li.setAttribute('contenteditable', 'true');

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'list-actions';
                    actionsDiv.innerHTML = `
                        <button class="list-action-btn add-item" title="Add item below">+</button>
                        <button class="list-action-btn remove-item" title="Remove item">-</button>
                    `;
                    li.appendChild(actionsDiv);
                    list.appendChild(li);
                });
            }
        };

        // Helper function to set text content
        const setText = (selector, text) => {
            const element = proposalContent.querySelector(selector);
            if (element && text) {
                element.textContent = text;
                element.setAttribute('contenteditable', 'true');
            }
        };

        // Populate sections
        setText('#introduction p', data.introduction);
        populateList('#objectives ul', data.objectives);
        populateList('#scope .in-scope', data.scope?.in_scope);
        populateList('#scope .out-of-scope', data.scope?.out_of_scope);
        populateList('#deliverables ul', data.deliverables);
        setText('#budget .budget-summary', data.budget?.summary);
        setText('#conclusion p', data.conclusion);

        // Populate Timeline
        const timelineContainer = proposalContent.querySelector('#timeline .timeline-phases');
        if (timelineContainer && Array.isArray(data.timeline)) {
            timelineContainer.innerHTML = '';
            data.timeline.forEach(phase => {
                const phaseDiv = document.createElement('div');
                phaseDiv.className = 'phase';
                phaseDiv.innerHTML = `<h3><span class="phase-name" contenteditable="true">${phase.phase}</span> (<span class="phase-duration" contenteditable="true">${phase.duration}</span>)</h3><p contenteditable="true">${phase.description}</p>`;
                timelineContainer.appendChild(phaseDiv);
            });
        }

        // Populate Budget Breakdown
        const budgetList = proposalContent.querySelector('#budget .budget-breakdown');
        if (budgetList && Array.isArray(data.budget?.breakdown)) {
            budgetList.innerHTML = '';
            data.budget.breakdown.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong class="item-name" contenteditable="true">${item.item}</strong>: <span class="item-cost" contenteditable="true">${item.cost}</span>`;
                budgetList.appendChild(li);
            });
        }
    };

    // --- Event Listeners ---
    if (saveButton) saveButton.addEventListener('click', saveProposal);
    if (printButton) printButton.addEventListener('click', printProposal);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportProposalPdf);

    // --- Dynamic Loading Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');
    const baseUrl = window.APP_BASE_URL || '/';

    if (loadFile) {
        if (loadFile.endsWith('.json') && !loadFile.includes('..') && !loadFile.includes('/')) {
            const dataUrl = `${baseUrl}data/${loadFile}`;
            fetch(dataUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`Network response was not ok (status: ${response.status})`);
                    return response.json();
                })
                .then(data => {
                    renderProposal(data);
                })
                .catch(error => {
                    console.error('Error fetching proposal data:', error);
                    proposalContent.innerHTML = `<p>Error loading project proposal data. Please ensure the file exists and is valid JSON.</p>`;
                });
        } else {
            proposalContent.innerHTML = '<p>Error: Invalid file name provided.</p>';
        }
    } else {
        proposalContent.innerHTML = '<p>No project proposal file specified.</p>';
    }

    // --- Initialize Add/Remove Button Logic ---
    initializeListActions('.proposal-container');
});
