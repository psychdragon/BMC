<!-- WYSIWYG Editor Container -->
<div id="editorContainer" style="display: none;">
    <h3>WYSIWYG Editor</h3>
    <div id="summernote"></div>
    <div class="editor-actions">
        <button id="saveEditorContent" class="btn btn-primary">Save Changes</button>
        <button id="exportDocx" class="btn btn-secondary">Export as .docx</button>
        <button id="exitEditor" class="btn btn-secondary">Exit Editor</button>
    </div>
</div>

<!-- Summernote CSS -->
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
<!-- WYSIWYG Custom CSS -->
<link href="<?php echo $baseUrl; ?>css/wysiwyg.css" rel="stylesheet">

<!-- Summernote JS and dependencies -->
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
<!-- DOCX Exporter -->
<script src="https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js"></script>
<!-- Centralized WYSIWYG Logic -->
<script src="<?php echo $baseUrl; ?>js/wysiwyg.js"></script>
