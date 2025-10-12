# TODO List: Business Model Canvas Generator

## Phase 1: Basic Structure and UI

- [ ] **Task 1: Create the basic HTML structure for the Business Model Canvas in `index.php`.**
  - This should include the nine blocks of the canvas: Key Partners, Key Activities, Key Resources, Value Propositions, Customer Relationships, Channels, Customer Segments, Cost Structure, and Revenue Streams.

- [ ] **Task 2: Style the Business Model Canvas using CSS in `style.css`.**
  - The layout should be a grid that resembles a standard Business Model Canvas.
  - The design should be clean, responsive, and user-friendly.

- [ ] **Task 3: Implement basic JavaScript functionality in `script.js`.**
  - Allow users to click on a block to edit its content.
  - Use `contenteditable` attributes or a modal popup for editing.

## Phase 2: LLM Integration

- [ ] **Task 4: Create a PHP API endpoint for LLM interaction.**
  - This endpoint will receive a business idea from the frontend.
  - It will be responsible for calling the LLM API and returning the generated content.

- [ ] **Task 5: Integrate the DeepSeek API.**
  - Implement the logic to send a prompt to the DeepSeek API and parse the response.
  - The prompt should ask the LLM to generate content for each of the nine blocks of the Business Model Canvas.

- [ ] **Task 6: Connect the frontend to the API endpoint.**
  - Add a form to `index.php` where users can input their business idea.
  - Use JavaScript to send the user's input to the PHP API endpoint.
  - Populate the Business Model Canvas with the content returned by the API.

## Phase 3: Data Persistence and Exporting

- [ ] **Task 7: Implement save functionality.**
  - Add a "Save" button to the UI.
  - When clicked, the current content of the canvas should be saved as a JSON file in the `data` directory.

- [ ] **Task 8: Implement load functionality.**
  - Add a "Load" button to the UI.
  - When clicked, a user should be able to select a previously saved JSON file.
  - The content of the selected file should be loaded into the canvas.

- [ ] **Task 9: Implement export functionality.**
  - Add an "Export" button to the UI.
  - When clicked, the canvas should be exported to a printable HTML format.
  - This could open a new browser tab with a printer-friendly version of the canvas.
