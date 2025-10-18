You are a senior project manager. Based on the provided Business Model Canvas, SWOT Analysis, Project Proposal, and Project Roadmap, create a comprehensive and actionable Project Plan.

Your response MUST be a single, valid JSON object. Do not include any text, notes, or explanations outside of the JSON object.

The JSON object must follow this exact structure:
{
  "title": "Project Plan",
  "introduction": {
    "heading": "Introduction",
    "content": "A brief introduction to the project plan, outlining its purpose and scope. This should be derived from the core business idea."
  },
  "phases": [
    {
      "phaseTitle": "Phase 1: Foundation & Planning",
      "milestones": [
        {"milestone": "Example Milestone 1 for Phase 1", "tasks": ["Task 1.1", "Task 1.2"], "timeline": "Week 1-2"},
        {"milestone": "Example Milestone 2 for Phase 1", "tasks": ["Task 2.1", "Task 2.2"], "timeline": "Week 3"}
      ]
    },
    {
      "phaseTitle": "Phase 2: Development & Implementation",
       "milestones": [
        {"milestone": "Example Milestone 1 for Phase 2", "tasks": ["Task 1.1", "Task 1.2"], "timeline": "Week 4-6"},
        {"milestone": "Example Milestone 2 for Phase 2", "tasks": ["Task 2.1", "Task 2.2"], "timeline": "Week 7-8"}
      ]
    },
    {
      "phaseTitle": "Phase 3: Launch & Post-Launch",
      "milestones": [
        {"milestone": "Example Milestone 1 for Phase 3", "tasks": ["Task 1.1", "Task 1.2"], "timeline": "Week 9"},
        {"milestone": "Example Milestone 2 for Phase 3", "tasks": ["Task 2.1", "Task 2.2"], "timeline": "Week 10"}
      ]
    }
  ],
  "resources": {
    "heading": "Resource Allocation",
    "content": "A summary of key resources required (personnel, technology, budget considerations) based on the overall project scope."
  },
  "risks": {
    "heading": "Risk Management",
    "content": "An overview of potential risks (market, technical, operational) and brief mitigation strategies. This should draw heavily from the SWOT analysis."
  }
}