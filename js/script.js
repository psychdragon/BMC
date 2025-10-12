document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.canvas');

    // Function to render the canvas from JSON data
    const renderCanvas = (data) => {
        // Clear existing canvas content
        canvas.innerHTML = '';

        // Map keys to titles
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

        // Iterate over the data and create the canvas blocks
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const box = document.createElement('div');
                box.classList.add('box', key.replace(/([A-Z])/g, '-$1').toLowerCase());

                const title = document.createElement('h2');
                title.textContent = titles[key];
                box.appendChild(title);

                const ul = document.createElement('ul');
                data[key].forEach(itemText => {
                    const li = document.createElement('li');
                    li.textContent = itemText;
                    ul.appendChild(li);
                });
                box.appendChild(ul);

                canvas.appendChild(box);
            }
        }
    };

    // Fetch the initial data and render the canvas
    fetch('data/canvas-template.json')
        .then(response => response.json())
        .then(data => {
            renderCanvas(data);
        })
        .catch(error => {
            console.error('Error fetching canvas data:', error);
            canvas.innerHTML = '<p>Error loading Business Model Canvas data.</p>';
        });
});
