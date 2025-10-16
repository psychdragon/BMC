// js/utils.js

const loadingOverlay = document.getElementById('loading-overlay');

function showLoader() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoader() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function initializeListActions(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`List action container '${containerSelector}' not found.`);
        return;
    }

    // --- Create a new list item ---
    const createNewListItem = (content = 'New Item') => {
        const li = document.createElement('li');
        li.setAttribute('contenteditable', 'true');
        li.textContent = content;

        // Add action buttons to the new item as well
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'list-actions';
        actionsDiv.innerHTML = `
            <button class="list-action-btn add-item" title="Add item below">+</button>
            <button class="list-action-btn remove-item" title="Remove item">-</button>
        `;
        li.appendChild(actionsDiv);
        return li;
    };

    // --- Event Delegation for Add/Remove ---
    container.addEventListener('click', (event) => {
        const target = event.target;
        const currentLi = target.closest('li');

        if (!currentLi) return;

        // Handle ADD button click
        if (target.classList.contains('add-item')) {
            const newLi = createNewListItem();
            currentLi.parentNode.insertBefore(newLi, currentLi.nextSibling);

            // Set focus and select the text in the new item
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(newLi);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        // Handle REMOVE button click
        if (target.classList.contains('remove-item')) {
            const ul = currentLi.parentNode;
            // Don't remove the last item, just clear it
            if (ul.children.length > 1) {
                currentLi.remove();
            } else {
                currentLi.textContent = '';
                // Re-add buttons since textContent removes them
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'list-actions';
                actionsDiv.innerHTML = `
                    <button class="list-action-btn add-item" title="Add item below">+</button>
                    <button class="list-action-btn remove-item" title="Remove item">-</button>
                `;
                currentLi.appendChild(actionsDiv);
            }
        }
    });
}
