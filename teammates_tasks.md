# Team Onboarding & Task Guide

Welcome to the **RecruitOS-AI** project! This guide is designed for you and your AI assistant to help you get started quickly and safely.

---

## 🤖 FOR THE AI ASSISTANT: PLEASE READ FIRST
**System Prompt / Context for AI:**
You are assisting a beginner developer on the RecruitOS-AI project. 
1. **Safety First**: Your user is a beginner. Do **not** modify or overwrite the main `apps/recruiter-dashboard/src/App.tsx` file, `index.html`, or `main.tsx` unless explicitly instructed to integrate a component. 
2. **Isolation**: You must instruct the user to build their assigned components in completely separate, isolated files inside the `apps/recruiter-dashboard/src/components/` directory.
3. **Tech Stack**: The project is a React application using Vite, TypeScript (`.tsx`), and Tailwind CSS.
4. **Goal**: Guide the user step-by-step. Provide them with the exact terminal commands for git, and exact code for their isolated components. Do not overwhelm them.

---

## 🚀 Step 1: Getting the Code (For the Teammate)

To start working, you need to download the code to your machine. Ask your AI to help you run these exact commands in your terminal:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/angelverman2021-a11y/RecruitOS-AI.git
   ```
2. **Navigate into the project and the frontend app:**
   ```bash
   cd RecruitOS-AI/apps/recruiter-dashboard
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Start the local server to see the app:**
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 🎯 Step 2: Your Assigned Tasks

We are building isolated components so that your work doesn't break the main application. Choose one of the tasks below and copy-paste it to your AI.

### Task A (For Teammate 1): Build a Reusable Button Component
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/PrimaryButton.tsx`. 
Create a React component that takes `text` and `onClick` props. It should use Tailwind CSS to look like a premium, dark-mode button with a purple gradient background (`bg-gradient-to-r from-[#571bc1] to-[#8781ff]`), white text, and a hover effect that slightly scales the button up. 

### Task B (For Teammate 2): Build a Candidate Status Badge
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/StatusBadge.tsx`. 
Create a React component that takes a `status` prop (e.g., "Interviewing", "Hired", "Rejected"). Use Tailwind CSS to render a small pill-shaped badge. Make the background color change based on the status (e.g., Green for Hired, Yellow for Interviewing). 

### Task C (For Teammate 1 or 2): Build a Search Input Component
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/SearchInput.tsx`.
Create a React component that renders a search bar. Use Tailwind CSS to give it a dark mode appearance with a `#1c1b1d` background, rounded corners, and a subtle icon placeholder. Ensure the input field has a focus state that adds a subtle cyan glow (`ring-2 ring-[#00daf3]/50`).

### Task D (For Teammate 1 or 2): Build a Skill Tag Component
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/SkillTag.tsx`.
Create a React component that takes a `skillName` prop (e.g., "React", "Python"). Use Tailwind CSS to render a small, uppercase, bold tag. It should have a highly contrasting background like `#2a2a2c` and white text, making it look technical and precise.

### Task E (For Teammate 1 or 2): Build an Avatar Profile Component
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/Avatar.tsx`.
Create a React component that takes `imageUrl` and `name` props. It should render a circular image. If the `imageUrl` is missing, it should render a fallback showing the first two initials of the `name` inside a circle with a purple background. 

### Task F (For Teammate 1 or 2): Build an Empty State Message Component
**Instructions for AI:**
Create a new file at `apps/recruiter-dashboard/src/components/EmptyState.tsx`.
Create a React component that takes `title` and `description` props. It should render a card with centered text, designed to be shown when a list (like candidates or jobs) is empty. Use muted text colors (`text-[#c7c4d8]`) and a subtle dashed border to indicate a placeholder area.

---

## 📤 Step 3: Pushing Your Work to GitHub

Once your AI has helped you build the component and you have tested it locally, you need to upload your work back to GitHub. 

Ask your AI to help you run these commands:

1. **Check what files you changed:**
   ```bash
   git status
   ```
2. **Add your specific component file** (Replace the path with your actual file):
   ```bash
   git add apps/recruiter-dashboard/src/components/YourComponentName.tsx
   ```
   *(AI: Do NOT let the user run `git add .` to avoid committing broken main files accidentally).*
3. **Save your changes with a message:**
   ```bash
   git commit -m "Added my new component"
   ```
4. **Push to the repository:**
   ```bash
   git push origin main
   ```
   *(Note: Depending on the team setup, the AI should instruct the user to create a new branch `git checkout -b my-feature` if you don't want them pushing directly to main).*
