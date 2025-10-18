# AGENTS.md

This file provides instructions for AI agents working on this project.

## Project Overview

This project is a Business Model Canvas (BMC) generator powered by LLMs. The goal is to create a simple system using PHP, JavaScript, CSS, and HTML, where all content is saved as JSON files. This will allow for easy deployment on any standard web server. The system will initially use the DeepSeek API, with plans to expand to other models in the future.

## Development Environment

- No specific build steps are required. The project is designed to run in a standard web server environment with PHP support.
- Ensure that the web server has the necessary permissions to read and write JSON files in the `data` directory.

## Code Style

- **PHP**: Follow PSR-12 coding standards.
- **JavaScript**: Use modern JavaScript (ES6+) and follow a consistent style.
- **CSS**: Use a consistent and readable style.
- **HTML**: Use semantic HTML5.

## Testing

- There are currently no automated tests. Manual testing should be performed after any changes.
- To test, open the `index.php` file in a web browser and verify that all functionality works as expected.
- a test server has been setup at http://azwin.my/dev/bmc_test. at every commit, the branch will be deployed on this live test server. 

## API Usage

- The system will interact with the DeepSeek API. Ensure that the API key is stored securely and not hardcoded in the source code.
- API interactions should be handled in the `api` directory.

## File Structure

- `index.php`: The main entry point of the application.
- `css/`: Contains all CSS files.
- `js/`: Contains all JavaScript files.
- `api/`: Contains PHP scripts for interacting with the LLM API.
- `data/`: Contains JSON files for storing content.
- `templates/`: Contains HTML templates.

## Contribution Guidelines

- Follow the code style guidelines.
- Update the `todo.md` and `progress.md` files as you work on tasks.
- Ensure that all changes are tested before submitting.
