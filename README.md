<div align="center">

# 🌾 Smart Agriculture AI Platform

### An end-to-end AI-powered platform for Indian farmers

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.17-FF6F00?style=flat&logo=tensorflow)](https://tensorflow.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)](https://docker.com)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python)](https://python.org)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [AI Models](#ai-models)
- [Screenshots](#screenshots)
- [Resume Points](#resume-points)
- [Future Roadmap](#future-roadmap)

---

## 🎯 Overview

Smart Agriculture AI Platform solves 7 critical problems faced by Indian farmers:

| Problem | Solution |
|---|---|
| Crop diseases causing 20-40% yield loss | AI Disease Detection (95.6% accuracy) |
| Weather uncertainty | Real-time weather + farming alerts |
| Inefficient irrigation | Smart irrigation advisor |
| Wrong fertilizer usage | NPK recommendation engine |
| Unknown expected yield | ML yield prediction (R²=0.985) |
| Market price exploitation | Live mandi price dashboard |
| Language barrier | Hindi + English KisanBot |

---

##  Features

###  AI Crop Disease Detection
- Upload a leaf photo → get disease name, confidence score, symptoms, treatment, and prevention
- Model: **EfficientNetB0** fine-tuned on PlantVillage dataset
- **95.6% validation accuracy** on 15 disease classes (Pepper, Potato, Tomato)
- Training: Transfer learning with 2-phase fine-tuning on Google Colab T4 GPU
- Diagnosis history saved per user

### 1. Weather Intelligence
- Real-time weather data via OpenWeatherMap API
- 5-day forecast with rain probability
- Farming-specific alerts: heatwave, frost, rain, disease risk, high wind
- "Use My Location" GPS support

### 2. Fertilizer Recommendation
- Rule-based NPK calculator using standard agronomy tables
- Supports 11 crop types and 7 soil types
- Outputs: Urea, DAP, MOP quantities + application timing
- Autofill from saved farm profiles

### 3. Crop Yield Prediction
- Model: **Random Forest** trained on FAO crop yield dataset (28,242 samples)
- **R² = 0.985** accuracy
- Inputs: Crop, Region, Year, Rainfall, Pesticides, Temperature
- Output: Predicted yield in hg/ha, kg/ha, tonnes/acre + confidence interval

### 4. Market Price Dashboard
- 14 crops × 15 Indian mandis
- 30-day price trend chart
- 7-day price prediction with best selling date recommendation
- Tab-based UI: Mandi Prices | 30-Day Trend | 7-Day Forecast

### 5. Government Schemes Recommender
- 8 major schemes: PM-KISAN, Fasal Bima, Kisan Credit Card, e-NAM, etc.
- Eligibility filtering by farm area
- **Apply Now** button linking to official government portals
- Required documents checklist

### 6. KisanBot — AI Farming Assistant
- Bilingual: **Hindi + English** support
- Powered by **Groq LLM API** (LLaMA 3.1-8B-Instant)
- Agriculture-specific system prompt
- Conversation history maintained
- Quick suggestion chips for common questions

### 7. Farm Manager
- Multi-farm support per user account
- Add, view, delete farms
- Farm details: name, area, soil type, current crop
- JWT-secured, user-scoped CRUD

---

## -- Tech Stack --

### Frontend
- **React.js 18** + **Tailwind CSS**
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls

### Backend (core-api — Port 8000)
- **FastAPI** (Python)
- **SQLAlchemy** ORM + **Alembic** migrations
- **PostgreSQL** database
- **Redis** for OTP caching
- **JWT** authentication (access + refresh tokens)
- **Twilio** (SMS OTP — dev mode logs to console)

### AI Service (ai-service — Port 8001)
- **TensorFlow / Keras** — disease detection inference
- **EfficientNetB0** — pretrained CNN fine-tuned on PlantVillage
- **Scikit-learn** — yield prediction (Random Forest)
- **FastAPI** — inference API

### External APIs
- **OpenWeatherMap** — real-time weather data
- **Groq** — LLM inference (LLaMA 3.1-8B-Instant)
- **PlantVillage** dataset (via Kaggle) — disease detection training
- **FAO Crop Yield** dataset (via Kaggle) — yield prediction training

### DevOps
- **Docker + Docker Compose** — PostgreSQL + Redis containers
- **GitHub Actions** — CI/CD ready
- **AWS EC2 / S3** — deployment ready

---

## 📁 Project Structure

```
SmartAgricultureAIPlatform/
├── core-api/                    # Main backend (FastAPI)
│   ├── app/
│   │   ├── auth/               # JWT auth + OTP
│   │   ├── farms/              # Farm CRUD
│   │   ├── weather/            # Weather + alerts
│   │   ├── fertilizer/         # NPK recommendations
│   │   ├── yield_prediction/   # ML yield model
│   │   ├── market_price/       # Mandi prices
│   │   ├── schemes/            # Govt schemes
│   │   ├── chatbot/            # KisanBot (Groq LLM)
│   │   ├── db/                 # SQLAlchemy session
│   │   ├── core/               # Security, deps
│   │   ├── config.py           # Settings
│   │   └── main.py             # FastAPI app
│   ├── alembic/                # DB migrations
│   ├── requirements.txt
│   └── Dockerfile
│
├── ai-service/                  # AI inference service (FastAPI)
│   ├── app/
│   │   ├── disease/            # EfficientNetB0 inference
│   │   │   └── model/          # disease_model.h5
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                    # React.js frontend
│   ├── src/
│   │   ├── pages/              # Dashboard, Disease, Weather, etc.
│   │   ├── components/         # Layout, ProtectedRoute
│   │   ├── api/                # Axios clients
│   │   └── context/            # AuthContext
│   └── package.json
│
└── docker-compose.yml           # PostgreSQL + Redis
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-agriculture-ai-platform.git
cd smart-agriculture-ai-platform
```

### 2. Start PostgreSQL and Redis

```bash
docker compose up -d
```

### 3. Set up core-api

```bash
cd core-api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
alembic upgrade head
uvicorn app.main:app --reload
```

### 4. Set up ai-service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Add disease_model.h5 to app/disease/model/
uvicorn app.main:app --reload --port 8001
```

### 5. Set up frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Open in browser

```
http://localhost:5173
```

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_agri
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
OPENWEATHER_API_KEY=your-openweather-key
GROQ_API_KEY=your-groq-key
TWILIO_ACCOUNT_SID=dev_mode
TWILIO_AUTH_TOKEN=dev_mode
```

---

## 📡 API Documentation

Once running, visit:
- **Core API Swagger**: http://localhost:8000/docs
- **AI Service Swagger**: http://localhost:8001/docs

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new farmer |
| POST | `/auth/login` | Login + get JWT tokens |
| GET | `/farms` | List user's farms |
| POST | `/farms` | Create new farm |
| DELETE | `/farms/{id}` | Delete farm |
| GET | `/weather/current?lat=&lon=` | Weather + farming alerts |
| POST | `/fertilizer/recommend` | NPK fertilizer plan |
| POST | `/yield/predict` | Crop yield prediction |
| GET | `/market/prices?crop=` | Mandi prices + forecast |
| GET | `/schemes/` | Government schemes |
| POST | `/chatbot/chat` | KisanBot AI response |
| POST | `/disease/predict` | Disease detection (ai-service) |

---

## 🤖 AI Models

### Disease Detection Model
| Property | Value |
|---|---|
| Architecture | EfficientNetB0 (Transfer Learning) |
| Dataset | PlantVillage (Kaggle) |
| Training samples | 16,516 |
| Validation samples | 4,122 |
| Classes | 15 (Pepper, Potato, Tomato diseases) |
| Phase 1 accuracy | 93.98% (frozen base, 10 epochs) |
| Phase 2 accuracy | **95.61%** (fine-tuned, 10 epochs) |
| Training platform | Google Colab T4 GPU |

### Yield Prediction Model
| Property | Value |
|---|---|
| Algorithm | Random Forest Regressor |
| Dataset | FAO Crop Yield (Kaggle) |
| Training samples | 22,593 |
| Test samples | 5,649 |
| R² Score | **0.9850** |
| MAE | 3,945 hg/ha |
| Crops supported | 10 |
| Regions supported | 101 |

---

## 🗺️ Future Roadmap

- [ ] Drone integration for field monitoring
- [ ] IoT sensor data ingestion
- [ ] Satellite imagery analysis
- [ ] Voice assistant in Hindi
- [ ] AI-based pest prediction
- [ ] Community forum for farmers
- [ ] Mobile app (React Native)
- [ ] Real data.gov.in API integration for live mandi prices
- [ ] AWS deployment with auto-scaling

---

## 📝 Resume Points

Copy-paste ready for your CV:

- Built a production-ready full-stack AI platform with 9 modules using FastAPI, React.js, and TensorFlow
- Trained EfficientNetB0 CNN on PlantVillage dataset achieving **95.6% validation accuracy** for crop disease detection
- Implemented transfer learning with fine-tuning: frozen-base phase + top-layer fine-tuning to push accuracy from 93% → 95.6%
- Built Random Forest yield prediction model achieving **R² = 0.985** on 28,000+ sample FAO crop dataset
- Integrated real-time OpenWeatherMap API with rule-based farming alert system (heatwave, rain, frost, disease risk)
- Developed bilingual (Hindi+English) AI chatbot using **Groq LLM API** (LLaMA 3.1-8B) for farmer Q&A
- Implemented JWT authentication, RBAC, Redis OTP caching, and Alembic database migrations
- Containerized platform with **Docker Compose** (PostgreSQL + Redis + 2 FastAPI services + React frontend)

---

## 👨‍💻 Author

**Rupesh Pandey**

Built with ❤️ for Indian farmers 🌾

---

<div align="center">
⭐ Star this repo if you found it helpful!
</div>
