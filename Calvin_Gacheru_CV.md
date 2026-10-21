# Calvin Gacheru Mwangi
**Data Scientist & AI Engineer — Agentic AI, RAG and Production ML**

Nairobi, Kenya | [calvin.g.mwangi@gmail.com](mailto:calvin.g.mwangi@gmail.com) | [Portfolio](https://calvin-gacheru.github.io/MyPortfolio/) | [LinkedIn](https://ke.linkedin.com/in/calvin-gacheru-057672281) | [GitHub](https://github.com/Calvin-Gacheru)

---

## Profile

Final-year Data Science & Analytics student at USIU-Africa who builds AI systems end to end, from data pipeline to deployed service. I design **LangGraph agents** and **RAG** systems on PostgreSQL/pgvector, train and explain ML and deep-learning models (XGBoost, PyTorch, SHAP, Grad-CAM), and ship them behind **FastAPI** in **Docker** with CI/CD. I have delivered a live production website for a commercial client, and my portfolio includes 20 public projects. I am looking for graduate and junior roles in AI engineering, machine learning and data science.

---

## Technical Skills

- **Languages:** Python (advanced), SQL, JavaScript, HTML/CSS, R, Bash
- **LLMs & Agentic AI:** LangGraph, LangChain, RAG, tool calling, pgvector, Qdrant, sentence-transformer embeddings, Groq, DeepSeek, OpenAI API, Ollama (Llama 3.1)
- **Machine Learning:** scikit-learn, XGBoost, LightGBM, PyTorch (CNNs, transfer learning), NLP, time-series forecasting, imbalanced learning (SMOTE), Bayesian networks (pgmpy)
- **Explainability & Eval:** SHAP, Grad-CAM, Integrated Gradients, stratified and group k-fold cross-validation, threshold tuning, calibration
- **Engineering & MLOps:** FastAPI, Pydantic, Docker, Docker Compose, GitHub Actions CI/CD, PostgreSQL, SQLAlchemy, Redis, Kubernetes, Linux, Git, uv
- **Data & BI:** pandas, NumPy, ETL pipelines, EDA, Power BI, Plotly, Matplotlib, Seaborn, Streamlit
- **Security:** TLS/SSL, IAM/RBAC policies, server-side encryption (KMS), JWT authentication, sandboxed code execution

---

## Experience

### Freelance Web Developer — BikBat Insurance Agency
*Nairobi, Kenya · live client engagement | 2026*

- Delivered the client's business website from brief to production as the sole developer, covering requirements, build, content and launch.
- Owned the deployment end to end, covering domain registration, DNS and hosting. Live at [bikbatinsurance.com](https://bikbatinsurance.com).
- Structured service listings and trust-building content to convert visitors into insurance enquiries.

### Data Science Intern — Prodigy InfoTech
*Remote · completed with outstanding remarks | Sep 2025*

- Delivered four end-to-end projects on real-world datasets: exploratory analysis, predictive modelling, customer-churn analytics and NLP sentiment analysis.
- Shipped each one as a documented, reproducible repository, with emphasis on data quality checks and model interpretability.

---

## Selected Projects

### MyAnalyst — Autonomous Data Analysis Agent · [GitHub](https://github.com/Calvin-Gacheru/Automated-Junior-Analyst) · 2026
*Python · LangGraph · FastAPI · PostgreSQL/pgvector · Docker · DeepSeek · pandas*

- Built a multi-modal analysis workspace. Users upload CSV/XLSX data and PDF/DOCX documents, and a LangGraph agent profiles, cleans and forecasts the data before any question is asked.
- Designed a routed Q&A graph with three tracks: quantitative, document and hybrid. It plans, writes and runs pandas code, then retries automatically on failure. The hybrid track checks computed figures against targets in the documents and cites its sources.
- Ran LLM-generated code in a network-isolated, non-root, resource-limited Docker sandbox with datasets mounted read-only. Added pgvector semantic search, persistent business rules and AutoML modelling.

### MySaidi — AI Productivity Assistant · [GitHub](https://github.com/Calvin-Gacheru/MySaidi) · 2026
*Python · FastAPI · LangGraph · Groq (Llama 3.3 70B) · PostgreSQL (asyncpg) · JWT · PWA*

- Built a full-stack assistant whose LangGraph agent turns natural conversation into tool calls that create, update and review tasks, calendar events and habits.
- Shipped it as an installable Progressive Web App with JWT/bcrypt authentication, an async PostgreSQL backend and cloud deployment on Railway.

### AI Knowledge Retrieval System — RAG for Technical Support · [GitHub](https://github.com/Calvin-Gacheru/AI-KNOWLEDGE-RETRIEVAL-SYSTEM) · 2026
*Python · LangChain · pgvector · all-MiniLM-L6-v2 · Groq · FastAPI · Docker Compose*

- Centralised scattered support PDFs into a single PostgreSQL store for documents and vectors. Embeddings run locally and Groq generates grounded answers. Every query is logged, and an engineer feedback loop rates answer quality.

### LexiAssist — Explainable Handwriting Screening · [GitHub](https://github.com/Calvin-Gacheru/LexiAssist) · 2026
*Python · PyTorch · ResNet18 · Grad-CAM · Integrated Gradients · Streamlit*

- Fine-tuned an ImageNet ResNet18 in two stages against a custom CNN baseline to flag possible dyslexia-related patterns in handwriting.
- Validated it with writer-aware stratified group 5-fold cross-validation so that no writer's samples leak between splits, and tuned the decision threshold for recall of at least 0.90.
- Deployed it as a Streamlit app with Grad-CAM heatmaps, a consent gate and an explicit limitations panel. The app documents its own failure modes rather than overstating accuracy.

### Uber Price Prediction — Production MLOps Pipeline · [GitHub](https://github.com/Calvin-Gacheru/Uber-Price-Prediction) · 2026
*Python · scikit-learn · FastAPI · Pydantic · Streamlit · Docker Compose · GitHub Actions*

- Engineered temporal and spatial features from **93,000 ride records**. A leakage-safe scikit-learn pipeline reached a mean **R² of 0.985** (SD 0.002) across 5-fold cross-validation.
- Served the model through a validated FastAPI microservice and a Streamlit client, with multi-container Docker orchestration and GitHub Actions CI on every push.

### MamaGuard — Maternal Risk Detection System · [GitHub](https://github.com/Calvin-Gacheru/Maternal-Risk-Detection-System) · 2026
*Python · XGBoost · Random Forest · SHAP · Streamlit · SQLite · APScheduler · Africa's Talking SMS*

- Built clinical decision support for community health workers. It scores the risk of preeclampsia, gestational diabetes and anaemia from vitals, using engineered features such as MAP and BP velocity.
- Explained each prediction with SHAP and generated WHO-aligned action plans. Automated appointment booking, SMS reminders and escalation to a nurse after three missed visits.

---

## Additional Projects

- **Diabetes Risk Screening** — handled severe class imbalance with SMOTE and class-weighted XGBoost, reaching **88% recall**, and shipped it as a Streamlit app.
- **Twitter Entity Sentiment Analysis** — built an NLP pipeline tuned with GridSearchCV to a **93% F1-score** and deployed it as a live brand-monitoring app.
- **Secure Cloud Storage Architecture** — hardened MinIO with TLS, IAM/RBAC policies and KMS server-side encryption, validated on **100,000** synthetic records.
- **Behavioural Explainer** — built a local-first RAG system (Ollama, Llama 3.1, Qdrant) with a Typer CLI that explains interpersonal scenarios through psychology research.
- **Stroke Prediction with Bayesian Networks** — built a causal DAG with exact inference by variable elimination, with the structure validated using BIC/BDeu.

Full list of 20 projects: [calvin-gacheru.github.io/MyPortfolio/projects.html](https://calvin-gacheru.github.io/MyPortfolio/projects.html)

---

## Education

**BSc Data Science & Analytics** — Expected 2027
United States International University – Africa (USIU-Africa), Nairobi · final year (Year 4 of 4)

---

## Certifications

- **Build AI Agents using LangGraph** — Simplilearn (credential 10119397) — Apr 2026
- **Data Science Internship, Certificate of Completion** — Prodigy InfoTech (PIT/SEP25/00116) — Oct 2025

---

## Languages & Interests

**Languages:** English (native), Swahili (native) | **Interests:** Kaggle competitions, Linux and systems tinkering, chess, music, reading

*References available on request.*
