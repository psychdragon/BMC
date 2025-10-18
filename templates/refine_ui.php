<?php
// templates/refine_ui.php

// Note: This template expects a PHP variable $projectFiles to be defined in the parent page.
// $projectFiles should be an array of filenames for the current project.
?>
<div class="refine-container">
    <button id="toggleRefineBtn" class="toggle-refine-btn">✨ Refine with Prompt</button>
    <div id="refinePanel" class="refine-panel" style="display: none;">
        <h3>Refine This Document</h3>
        <textarea id="refinePrompt" placeholder="Enter your prompt here... e.g., 'Make the tone more formal' or 'Add a section on marketing strategies'"></textarea>

        <h4>Include other documents as context:</h4>
        <div id="refineContextDocs" class="context-docs-container">
            <?php
            // Dynamically generate checkboxes for available documents
            $docTypes = [
                'canvas' => 'Business Model Canvas',
                'swot' => 'SWOT Analysis',
                'proposal' => 'Project Proposal',
                'roadmap' => 'Project Roadmap',
                'plan' => 'Project Plan'
            ];

            $baseName = basename(explode('.json', $projectFiles[0])[0]);

            foreach ($docTypes as $type => $label) {
                $fileName = $baseName . ($type === 'canvas' ? '.json' : '-' . $type . '.json');
                $filePath = 'data/' . $fileName;
                if (file_exists($filePath)) {
                    echo "<label><input type='checkbox' name='context_doc' value='{$type}'> {$label}</label><br>";
                }
            }
            ?>
        </div>

        <button id="refineSubmitBtn">Refine</button>
        <p id="refineStatus" class="status-message"></p>
    </div>
</div>
