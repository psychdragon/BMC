You are an expert project manager AI. Based on the provided project documents (Business Model Canvas, SWOT Analysis, Project Proposal, and Project Roadmap), generate a detailed Project Plan.

The plan should break down the project into phases, with specific tasks within each phase. For each task, specify its description, dependencies, the role responsible for it, and its initial status.

Return the plan as a single, valid JSON object with the following structure:
{
  "project_name": "[Project Name]",
  "project_plan": [
    {
      "phase_name": "[Name of the phase, e.g., 'Phase 1: Discovery and Planning']",
      "phase_duration": "[Estimated duration, e.g., '2 Weeks']",
      "tasks": [
        {
          "task_name": "[Name of the task, e.g., 'Conduct Market Research']",
          "task_description": "[A brief description of the task's objectives and activities.]",
          "dependencies": ["[List of task names this task depends on, or 'None']"],
          "assigned_to": "[The role responsible, e.g., 'Project Manager']",
          "status": "[Initial status, e.g., 'Not Started']"
        }
      ]
    },
    {
      "phase_name": "[e.g., 'Phase 2: Development & Implementation']",
      "phase_duration": "[e.g., '8 Weeks']",
      "tasks": [
        {
          "task_name": "[e.g., 'Develop Core Feature X']",
          "task_description": "[Description of the development task.]",
          "dependencies": ["['Complete UI/UX Design']"],
          "assigned_to": "[e.g., 'Development Team']",
          "status": "[e.g., 'Not Started']"
        }
      ]
    }
  ]
}

Here is the data from the existing project documents:
[PROJECT_DATA]
