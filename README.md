# BMC
A simple Business Model Canvas Generator powered by LLMs

## Deployment Instructions

This project is designed to be deployed on any standard web server that supports PHP.

### For Testers and Implementers

To deploy this system, follow these steps:

1.  **Download the project files:** You can either clone the repository or download the files as a ZIP archive.
2.  **Upload the files to your web server:** Using an FTP client or your web hosting control panel's file manager, upload the entire project folder to a directory on your web server (e.g., `public_html`, `www`, or a subdirectory).
3.  **Ensure file permissions are correct:** The web server needs permission to read the files. More importantly, it needs permission to write to the `data/` directory so it can save the JSON files. You may need to set the permissions for the `data/` directory to `755` or `777`, depending on your server configuration.
4.  **Access the application:** Open your web browser and navigate to the URL where you uploaded the files (e.g., `http://yourdomain.com/bmc/`).

That's it! The application should now be running. No build steps or complex configuration are required.
