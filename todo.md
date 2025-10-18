# TODO List: DraftoryAI Project Generator

## Phase 1: Basic Structure and UI (Completed)

- [x] **Task 1: Create the basic HTML structure for the Business Model Canvas.**
- [x] **Task 2: Style the Business Model Canvas using CSS.**
- [x] **Task 3: Implement basic JavaScript functionality for editing.**

## Phase 2: LLM Integration (Completed)

- [x] **Task 4: Create a PHP API endpoint for LLM interaction.**
- [x] **Task 5: Integrate the DeepSeek API.**
- [x] **Task 6: Connect the frontend to the API endpoint.**

## Phase 3: Data Persistence and Exporting (Completed)

- [x] **Task 7: Implement save functionality.**
- [x] **Task 8: Implement load functionality.**
- [x] **Task 9: Implement export functionality.**

## Phase 4: Expansion to Multiple Document Types (Completed)

- [x] **Task 10: Implement SWOT Analysis Generator.**
  - Includes generation, viewing, editing, saving, and printing.
- [x] **Task 11: Implement Project Proposal Generator.**
  - Includes generation from BMC/SWOT, viewing, editing, saving, and printing.
- [x] **Task 12: Implement Project Roadmap Generator.**
  - Includes generation from all prior docs, viewing, editing, saving, and printing.

## Phase 5: UI/UX Overhaul (Completed)

- [x] **Task 13: Refactor "View Canvases" to "View Projects".**
  - Group all related documents into project-based cards.
- [x] **Task 14: Implement Editable Project Titles.**
  - Add functionality to rename a project and all its associated files.
- [x] **Task 15: Implement Dynamic List Controls.**
  - Add "add/remove" buttons to all editable lists.
- [x] **Task 16: Add Global Loading Indicator.**
  - Provide visual feedback during all API calls.
- [x] **Task 17: Rebrand Site Header.**
  - Update site title to "DraftoryAI Project Generator" and add a logo.

## Phase 6: Next Features

- [ ] **Task 18: Implement Project Plan Generator.**
  - Follow the established pattern: System Prompt, Generate API, View/Edit Page, Save API.
- [x] **Task 19: Implement WYSIWYG Editor.**
  - Add a button to each document page to open an advanced editor.
  - Implement functionality to export the edited content as a `.docx` file.

## Future Vision (Post-Phase 6)

- [ ] **Evolve into a General Project Planning Tool:** Expand the application's purpose beyond just business model generation to support personal, group, or academic projects.
- [ ] **Folder-Based Project Organization:** Transition from the current flat-file structure to a more organized system where each project has its own dedicated folder.
- [ ] **Master Project Index File:** Introduce a master JSON file to serve as a single source of truth for all projects, simplifying discovery and management.
