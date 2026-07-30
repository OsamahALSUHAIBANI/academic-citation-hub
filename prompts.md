# Sequential Prompts Guide (`prompts.md`)

Execute these prompts in order to build the entire Kanban application step-by-step.

---

## Prompt 1: Project Setup & Local Storage Handler

Read CLAUDE.md for project context.

Set up a minimal Next.js App Router project structure with Tailwind CSS in this workspace.
Create a server-side storage utility (`lib/storage.ts`) that handles reading and writing local files using Node.js `fs` module:
1. `data/profiles.csv`: Reads and appends email/password credentials. Automatically create the directory and header `email,password` if non-existent.
2. `data/userdata.json`: Reads, creates, and updates user profile info and tasks using `email` as the primary key.

Ensure safe error handling so file operations do not crash if files are missing.

---

## Prompt 2: API Routes for Local Auth & User Data

Read CLAUDE.md and `lib/storage.ts`.

Create Next.js API Routes (`app/api/...`) for:
1. `/api/auth/register`: Accepts `email`, `password`, `name`, and `dateOfBirth`. Appends email/password to `data/profiles.csv` and initializes their entry in `data/userdata.json`.
2. `/api/auth/login`: Validates credentials against `data/profiles.csv` and returns user details upon success.
3. `/api/tasks`: 
   - `GET`: Fetches tasks for the logged-in email from `data/userdata.json`.
   - `POST/PUT`: Updates or adds tasks for the specified email key in `data/userdata.json`.

---

## Prompt 3: UI Design System & Auth Page

Read CLAUDE.md for visual constraints.

Build a legendary dark navy themed Login/Register interface (`app/page.tsx` or `app/login/page.tsx`):
- Deep Navy background (`#0b132b` / `#1c2541`), glowing slate cards, crisp typography.
- Form toggle between Login and Registration.
- Upon successful login, save user session locally and navigate to the `/board` view.

---

## Prompt 4: Interactive Kanban Board with Drag & Drop

Read CLAUDE.md.

Create the main Kanban Board page (`app/board/page.tsx`):
1. **Header**: Display logged-in user name, date of birth, and Logout button.
2. **Columns**: Render 4 distinct dark navy columns: `Backlog`, `To Do`, `In Progress`, `Done`.
3. **Task Cards**: Render cards with Title, Description, Date, and color-coded Priority badges (High = Rose `#f43f5e`, Medium = Amber `#f59e0b`, Low = Sapphire `#3b82f6`).
4. **Drag & Drop**: Implement smooth drag-and-drop movement. When a card is dropped into a new column, instantly update its status and trigger a `POST/PUT` to `/api/tasks` to persist the update in `data/userdata.json`.
5. **New Task Modal**: Add a modal form to create a new card with Title, Description, Date, Priority, and target Column.
