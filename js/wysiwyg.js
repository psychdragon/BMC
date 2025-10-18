function initializeWysiwyg(options) {
    const {
        launchBtnId,
        editorContainerId,
        summernoteId,
        saveBtnId,
        exportBtnId,
        exitBtnId,
        contentContainerSelector,
        actionsContainerSelector,
        titleSelector,
        saveFunction
    } = options;

    const launchEditorBtn = document.getElementById(launchBtnId);
    const editorContainer = document.getElementById(editorContainerId);
    const summernoteEditor = document.getElementById(summernoteId);
    const saveEditorContentBtn = document.getElementById(saveBtnId);
    const exportDocxBtn = document.getElementById(exportBtnId);
    const exitEditorBtn = document.getElementById(exitBtnId);
    const contentContainer = document.querySelector(contentContainerSelector);
    const actionsContainer = document.querySelector(actionsContainerSelector);
    const titleElement = document.querySelector(titleSelector);

    if (!launchEditorBtn || !editorContainer || !contentContainer) {
        // Silently return if the required elements are not on the page
        return;
    }

    launchEditorBtn.addEventListener('click', () => {
        actionsContainer.style.display = 'none';
        contentContainer.style.display = 'none';
        editorContainer.style.display = 'block';

        $('#' + summernoteId).summernote({
            height: 500,
            focus: true,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
                onInit: function() {
                    $('#' + summernoteId).summernote('code', contentContainer.innerHTML);
                }
            }
        });
    });

    exitEditorBtn.addEventListener('click', () => {
        $('#' + summernoteId).summernote('destroy');
        editorContainer.style.display = 'none';
        contentContainer.style.display = 'block';
        actionsContainer.style.display = 'flex';
    });

    saveEditorContentBtn.addEventListener('click', () => {
        const editedContent = $('#' + summernoteId).summernote('code');
        contentContainer.innerHTML = editedContent;

        $('#' + summernoteId).summernote('destroy');
        editorContainer.style.display = 'none';
        contentContainer.style.display = 'block';
        actionsContainer.style.display = 'flex';

        if (typeof saveFunction === 'function') {
            saveFunction();
        }
    });

    exportDocxBtn.addEventListener('click', () => {
        const content = $('#' + summernoteId).summernote('code');
        const title = titleElement ? titleElement.textContent.trim().replace(/ /g, '_') : 'document';
        const converted = htmlDocx.asBlob(content);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(converted);
        link.download = `${title}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
