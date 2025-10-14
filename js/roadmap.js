document.addEventListener('DOMContentLoaded', () => {
    const roadmapContent = document.querySelector('.roadmap-content');
    const roadmapTitle = document.getElementById('roadmapTitle');
    const saveButton = document.getElementById('saveRoadmapBtn');
    const saveStatus = document.getElementById('saveStatus');
    const printButton = document.getElementById('printRoadmapBtn');
    const exportPdfButton = document.getElementById('exportRoadmapPdfBtn');

    // --- Save Logic ---
    const saveRoadmap = () => {
        const roadmapData = {
            project_name: roadmapTitle.textContent.replace('Roadmap: ', '').trim(),
            roadmap: []
        };

        document.querySelectorAll('.roadmap-quarter').forEach(quarterDiv => {
            const quarterData = {
                quarter: quarterDiv.querySelector('h3 span:first-child').textContent.trim(),
                theme: quarterDiv.querySelector('h3 span:last-child').textContent.trim(),
                milestones: []
            };

            quarterDiv.querySelectorAll('.milestone').forEach(milestoneDiv => {
                quarterData.milestones.push({
                    milestone: milestoneDiv.querySelector('h4').textContent.trim(),
                    description: milestoneDiv.querySelector('p').textContent.trim(),
                    target_date: milestoneDiv.querySelector('.target-date span').textContent.trim()
                });
            });
            roadmapData.roadmap.push(quarterData);
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
        const apiUrl = `${baseUrl}api/save_roadmap.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: fileName,
                content: roadmapData
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
    const printRoadmap = () => {
        window.print();
    };

    const exportRoadmapPdf = () => {
        const element = document.getElementById('roadmapToExport');
        const opt = {
            margin:       0.5,
            filename:     `${roadmapTitle.textContent.trim().replace(/ /g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const renderRoadmap = (data) => {
        roadmapTitle.textContent = data.project_name ? `Roadmap: ${data.project_name}` : 'Project Roadmap';
        roadmapTitle.setAttribute('contenteditable', 'true');

        if (data.roadmap && Array.isArray(data.roadmap)) {
            roadmapContent.innerHTML = '';
            data.roadmap.forEach(quarter => {
                const quarterDiv = document.createElement('div');
                quarterDiv.className = 'roadmap-quarter';

                let milestonesHtml = '';
                if (quarter.milestones && Array.isArray(quarter.milestones)) {
                    quarter.milestones.forEach(milestone => {
                        milestonesHtml += `
                            <div class="milestone">
                                <h4 contenteditable="true">${milestone.milestone}</h4>
                                <p contenteditable="true">${milestone.description}</p>
                                <span class="target-date">Target: <span contenteditable="true">${milestone.target_date}</span></span>
                            </div>
                        `;
                    });
                }

                quarterDiv.innerHTML = `
                    <h3><span contenteditable="true">${quarter.quarter}</span>: <span contenteditable="true">${quarter.theme}</span></h3>
                    <div class="milestones-container">
                        ${milestonesHtml}
                    </div>
                `;
                roadmapContent.appendChild(quarterDiv);
            });
        }
    };

    // --- Event Listeners ---
    if (saveButton) saveButton.addEventListener('click', saveRoadmap);
    if (printButton) printButton.addEventListener('click', printRoadmap);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportRoadmapPdf);

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
                    renderRoadmap(data);
                })
                .catch(error => {
                    console.error('Error fetching roadmap data:', error);
                    roadmapContent.innerHTML = '<p>Error loading roadmap data.</p>';
                });
        } else {
            roadmapContent.innerHTML = '<p>Error: Invalid file name provided.</p>';
        }
    } else {
        roadmapContent.innerHTML = '<p>No roadmap file specified.</p>';
    }
});
