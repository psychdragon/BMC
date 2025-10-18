document.addEventListener('DOMContentLoaded', () => {
    const planContent = document.querySelector('.plan-content');
    const planTitle = document.getElementById('planTitle');
    const saveButton = document.getElementById('savePlanBtn');
    const saveStatus = document.getElementById('saveStatus');
    const printButton = document.getElementById('printPlanBtn');
    const exportPdfButton = document.getElementById('exportPlanPdfBtn');

    // --- Save Logic ---
    const savePlan = () => {
        const planData = {
            project_name: planTitle.textContent.replace('Plan: ', '').trim(),
            project_plan: []
        };

        document.querySelectorAll('.plan-phase').forEach(phaseDiv => {
            const phaseData = {
                phase_name: phaseDiv.querySelector('h3 span:first-child').textContent.trim(),
                phase_duration: phaseDiv.querySelector('h3 span:last-child').textContent.trim(),
                tasks: []
            };

            phaseDiv.querySelectorAll('.task').forEach(taskDiv => {
                const dependencies = taskDiv.querySelector('.dependencies span').textContent.trim().split(',').map(s => s.trim()).filter(Boolean);
                phaseData.tasks.push({
                    task_name: taskDiv.querySelector('h4').textContent.trim(),
                    task_description: taskDiv.querySelector('p').textContent.trim(),
                    dependencies: dependencies,
                    assigned_to: taskDiv.querySelector('.assigned-to span').textContent.trim(),
                    status: taskDiv.querySelector('.status span').textContent.trim()
                });
            });
            planData.project_plan.push(phaseData);
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
        const apiUrl = `${baseUrl}api/save_plan.php`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: fileName,
                content: planData
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

    // --- Print and Export Logic ---
    const printPlan = () => {
        window.print();
    };

    const exportPlanPdf = () => {
        const element = document.getElementById('planToExport');
        const opt = {
            margin:       0.5,
            filename:     `${planTitle.textContent.trim().replace(/ /g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const renderPlan = (data) => {
        planTitle.textContent = data.project_name ? `Plan: ${data.project_name}` : 'Project Plan';
        planTitle.setAttribute('contenteditable', 'true');

        if (data.project_plan && Array.isArray(data.project_plan)) {
            planContent.innerHTML = '';
            data.project_plan.forEach(phase => {
                const phaseDiv = document.createElement('div');
                phaseDiv.className = 'plan-phase';

                let tasksHtml = '';
                if (phase.tasks && Array.isArray(phase.tasks)) {
                    phase.tasks.forEach(task => {
                        tasksHtml += `
                            <div class="task">
                                <h4 contenteditable="true">${task.task_name}</h4>
                                <p contenteditable="true">${task.task_description}</p>
                                <div class="task-details">
                                    <span class="dependencies">Dependencies: <span contenteditable="true">${task.dependencies.join(', ')}</span></span>
                                    <span class="assigned-to">Assigned To: <span contenteditable="true">${task.assigned_to}</span></span>
                                    <span class="status">Status: <span contenteditable="true">${task.status}</span></span>
                                </div>
                            </div>
                        `;
                    });
                }

                phaseDiv.innerHTML = `
                    <h3><span contenteditable="true">${phase.phase_name}</span> (<span contenteditable="true">${phase.phase_duration}</span>)</h3>
                    <div class="tasks-container">
                        ${tasksHtml}
                    </div>
                `;
                planContent.appendChild(phaseDiv);
            });
        }
    };

    // --- Event Listeners ---
    if (saveButton) saveButton.addEventListener('click', savePlan);
    if (printButton) printButton.addEventListener('click', printPlan);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportPlanPdf);

    // --- Initialize Refine ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');
    if (loadFile) {
        const baseName = loadFile.replace('-plan.json', '');
        initializeRefine('plan', baseName, renderPlan);
    }

    // --- Dynamic Loading Logic ---
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
                    renderPlan(data);
                })
                .catch(error => {
                    console.error('Error fetching plan data:', error);
                    planContent.innerHTML = '<p>Error loading project plan data.</p>';
                });
        } else {
            planContent.innerHTML = '<p>Error: Invalid file name provided.</p>';
        }
    } else {
        planContent.innerHTML = '<p>No project plan file specified.</p>';
    }
});
