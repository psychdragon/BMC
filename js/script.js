document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.canvas');
    const subtitle = document.querySelector('.subtitle');

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

        // A helper function to create a canvas block
        const createBox = (key, items) => {
            const box = document.createElement('div');
            // Add a class based on the key, converting camelCase to kebab-case
            const kebabCaseKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            box.classList.add('box', kebabCaseKey);

            const title = document.createElement('h2');
            title.textContent = titles[key] || key;
            box.appendChild(title);

            const ul = document.createElement('ul');
            items.forEach(itemText => {
                const li = document.createElement('li');
                li.innerHTML = itemText; // Use innerHTML to render strong tags if any
                ul.appendChild(li);
            });
            box.appendChild(ul);
            return box;
        };

        // Define the order of the canvas blocks for CSS grid
        const gridOrder = [
            'keyPartners', 'keyActivities', 'valuePropositions', 'customerRelationships', 'customerSegments',
            'keyResources', 'channels', 'costStructure', 'revenueStreams'
        ];

        // Create and append boxes in the correct order
        gridOrder.forEach(key => {
            if (data[key]) {
                const box = createBox(key, data[key]);
                canvas.appendChild(box);
            }
        });
    };

    // --- Dynamic Loading Logic ---
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');

    let dataUrl = 'data/canvas-template.json'; // Default file

    if (loadFile) {
        // Basic security check: ensure it's a .json file and doesn't contain path traversal
        if (loadFile.endsWith('.json') && !loadFile.includes('..') && !loadFile.includes('/')) {
            dataUrl = `data/${loadFile}`;
            // Set the subtitle text based on the filename
            if (subtitle) {
                const readableName = loadFile
                    .replace('.json', '') // Remove extension
                    .replace(/-/g, ' ')   // Replace hyphens with spaces
                    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
                subtitle.textContent = readableName;
            }
        } else {
            console.error('Invalid file name specified.');
            canvas.innerHTML = '<p>Error: Invalid file name provided.</p>';
            if (subtitle) subtitle.textContent = 'Error';
            return;
        }
    } else {
        if (subtitle) {
            subtitle.textContent = 'Default Template';
        }
    }

    // Fetch the data and render the canvas
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }
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