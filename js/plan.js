document.addEventListener('DOMContentLoaded', () => {
    const fileName = new URLSearchParams(window.location.search).get('load');
    const baseUrl = window.APP_BASE_URL || '/';

    const planTitle = document.getElementById('planTitle');
    const introductionHeading = document.getElementById('introductionHeading');
    const introductionContent = document.getElementById('introductionContent');
    const phasesContainer = document.getElementById('phasesContainer');
    const resourcesHeading = document.getElementById('resourcesHeading');
    const resourcesContent = document.getElementById('resourcesContent');
    const risksHeading = document.getElementById('risksHeading');
    const risksContent = document.getElementById('risksContent');
    const saveStatus = document.getElementById('saveStatus');

    const renderPlan = (data) => {
        planTitle.textContent = data.title || 'Project Plan';
        introductionHeading.textContent = data.introduction?.heading || 'Introduction';
        introductionContent.textContent = data.introduction?.content || '';

        // Render Phases and Milestones
        phasesContainer.innerHTML = '';
        if (data.phases && Array.isArray(data.phases)) {
            data.phases.forEach(phase => {
                const phaseElement = document.createElement('div');
                phaseElement.className = 'plan-section phase';

                let milestonesHTML = '';
                if (phase.milestones && Array.isArray(phase.milestones)) {
                    phase.milestones.forEach(milestone => {
                        const tasksHTML = milestone.tasks.map(task => `<li contenteditable="true" class="task-item">${task}</li>`).join('');
                        milestonesHTML += `
                            <div class="milestone">
                                <h4 contenteditable="true">${milestone.milestone}</h4>
                                <ul class="tasks">${tasksHTML}</ul>
                                <p><strong>Timeline:</strong> <span contenteditable="true">${milestone.timeline}</span></p>
                            </div>
                        `;
                    });
                }

                phaseElement.innerHTML = `
                    <h3 contenteditable="true">${phase.phaseTitle}</h3>
                    ${milestonesHTML}
                `;
                phasesContainer.appendChild(phaseElement);
            });
        }

        resourcesHeading.textContent = data.resources?.heading || 'Resource Allocation';
        resourcesContent.textContent = data.resources?.content || '';
        risksHeading.textContent = data.risks?.heading || 'Risk Management';
        risksContent.textContent = data.risks?.content || '';
    };

    const savePlan = () => {
        const content = {
            title: planTitle.textContent,
            introduction: {
                heading: introductionHeading.textContent,
                content: introductionContent.textContent
            },
            phases: [],
            resources: {
                heading: resourcesHeading.textContent,
                content: resourcesContent.textContent
            },
            risks: {
                heading: risksHeading.textContent,
                content: risksContent.textContent
            }
        };

        document.querySelectorAll('.phase').forEach(phaseEl => {
            const phaseData = {
                phaseTitle: phaseEl.querySelector('h3').textContent,
                milestones: []
            };
            phaseEl.querySelectorAll('.milestone').forEach(milestoneEl => {
                const milestoneData = {
                    milestone: milestoneEl.querySelector('h4').textContent,
                    tasks: Array.from(milestoneEl.querySelectorAll('.task-item')).map(li => li.textContent),
                    timeline: milestoneEl.querySelector('p > span').textContent
                };
                phaseData.milestones.push(milestoneData);
            });
            content.phases.push(phaseData);
        });

        showLoader();
        saveStatus.textContent = 'Saving...';

        fetch(`${baseUrl}api/save_plan.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: fileName, content })
        })
        .then(res => res.json())
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
            saveStatus.textContent = 'An error occurred.';
            saveStatus.style.color = 'red';
            console.error('Save error:', error);
        })
        .finally(() => {
            hideLoader();
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);
        });
    };

    const printPlan = () => window.print();

    const exportPlanPdf = () => {
        const element = document.getElementById('planToExport');
        const opt = {
            margin:       0.5,
            filename:     `${planTitle.textContent.trim().replace(/ /g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };


    if (fileName) {
        fetch(`${baseUrl}data/${fileName}`)
            .then(res => {
                if (!res.ok) throw new Error('File not found');
                return res.json();
            })
            .then(data => renderPlan(data))
            .catch(error => console.error('Error loading plan:', error));
    }

    document.getElementById('savePlanBtn').addEventListener('click', savePlan);
    document.getElementById('printPlanBtn').addEventListener('click', printPlan);
    document.getElementById('exportPlanPdfBtn').addEventListener('click', exportPlanPdf);
});
