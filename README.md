# 🚀 Legendary Dark Navy Kanban Board (Next.js)

An interactive, local-first **Kanban Board** application designed for efficient task management. Features smooth drag-and-drop mechanics, local authentication, and file-based data storage. The entire application was constructed without writing manual code, utilizing **Prompt Engineering** techniques in alignment with course standards.

---

## 📌 Key Features

- 🎨 **Legendary Dark Navy Theme:** Modern visual styling built with Tailwind CSS, featuring glowing UI cards and color-coded priority badges (Low, Medium, High).
- 📋 **Interactive Kanban Workflow:** Smooth drag-and-drop task movement across 4 core columns:
  - `Backlog` (Ideas & deferred items)
  - `To Do` (Pending tasks)
  - `In Progress` (Active work)
  - `Done` (Completed items)
- 🔒 **100% Local File-Based Storage:**
  - Credentials stored safely in a local CSV file (`data/profiles.csv`).
  - User profiles and task entries managed in a JSON file (`data/userdata.json`) keyed by email.
- ⚡ **Prompt-Driven Development:**
  - Built sequentially using structured context (`CLAUDE.md`) and modular prompts (`prompts.md`).

---

## 🏗️ Course Project Artifacts

This repository strictly adheres to the submission guidelines for prompt engineering coursework:
1. **`CLAUDE.md`**: Context file containing specs, rules, data structure schemas, and project constraints.
2. **`prompts.md`**: Guide containing the step-by-step execution prompts (Prompts 1 through 4) used to build the codebase.

---

## 🛠️ Getting Started (Local Execution)

To run the project locally on your machine:

1. **Install Dependencies:**
   ```bash
   npm install
