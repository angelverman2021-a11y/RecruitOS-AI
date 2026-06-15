# RecruitOS-AI

A scalable, intelligent, AI-powered recruitment ecosystem that eliminates manual hiring bottlenecks and optimizes the talent acquisition lifecycle. 

## 🌐 Overall Architecture

The solution transitions recruitment from reactive filtering to predictive, automated matching and orchestration using a rich AI layer.

### 📂 Frontend Applications (React / Next.js)

1. **Recruiter Dashboard** (`apps/recruiter-dashboard`): 
   - Dashboard (Hiring Funnel, AI Suggestions, Pending Reviews)
   - Jobs (Create, Edit, AI Generated JD)
   - Candidates (Talent Pool, Shortlisted, Interviewed)
   - AI Matching (Top AI Matches, Risk Analysis, Recommended Questions)
   - Reports (Time to Hire, Recruiter Productivity)
   - Messages & Settings
2. **Candidate Portal** (`apps/candidate-portal`):
   - Dashboard (My Applications, AI Resume Score)
   - Recommended Jobs & Interview Practice
   - Skill Gap & Career Insights
3. **Admin Panel** (`apps/admin-panel`)
4. **Landing Page** (`apps/landing-page`)

### ⚙️ Backend Services

Microservices handling core logic (`backend/`):
- **Authentication**: Login, Signup, JWT, OAuth, Role Management
- **Job Service**: Create/Update Jobs, Search, AI JD Generator
- **Candidate Service**: Profiles, Resume Upload, Skills, Portfolio
- **Resume Service**: PDF Parsing, OCR, Skill Extraction
- **Interview Service**: Scheduling, Calendar Sync, Meet Links, Feedback, Recording
- **Notification Service**: Email, SMS, WhatsApp, Push
- **Analytics**: Hiring Funnel, Insights
- **integrations, websocket, ai-service**

### 🤖 AI Layer

Located in `ai/` and utilizing `agents/`, `rag/`, `embeddings/`, `pipelines/`, `prompts/`, `memory/`, and `evaluation/`:

1. **Resume Agent**: Takes Resume PDF -> Outputs Skills, Strengths, Weaknesses, Score
2. **JD Agent**: Takes Job Description -> Outputs Required/Preferred Skills, Experience, Vector Embeddings
3. **Matching Agent**: Compares Resume + JD -> Match Score, Skill/Experience Similarity, Culture Fit, Risk
4. **Interview Agent**: Generates Technical/HR/Coding Questions -> Evaluates Confidence, Communication during interview
5. **Skill Gap Agent**: Identifies Missing Skills -> Recommends Learning Path and Timeline
6. **Hiring Predictor**: Predicts Joining Probability, Offer Acceptance, and Retention
7. **Recruiter Copilot**: Instant natural language search (e.g., "Find Backend Engineer, 5 Years, Remote, Python")
8. **Candidate Copilot**: Helps candidates understand rejections and improve resumes

**RAG**: Knowledge base containing Company Policies, Hiring Guidelines, Previous Interviews, FAQs.

### 🗄️ Databases

- **PostgreSQL**: Core relational tables (Users, Companies, Jobs, Applications, Offers)
- **Qdrant (Vector DB)**: Storing embeddings for Resumes, Jobs, Interview Questions, Skills
- **Neo4j (Graph DB)**: Talent Graph mapping Candidates -> Skills -> Projects -> Companies -> Certifications
- **Redis**: Caching and background job queues

---

## 🚀 AI Workflow

1. Recruiter Creates Job -> AI Writes Better JD -> Converted to Embeddings
2. Resume Upload -> Parsing & Embeddings -> Similarity Search
3. Top 50 Candidates Identified -> AI Ranking -> Recruiter Reviews
4. Interview Scheduled -> AI Generates Questions -> Interview Conducted -> AI Evaluation
5. Candidate Ranked -> Offer Generated -> Onboarding
