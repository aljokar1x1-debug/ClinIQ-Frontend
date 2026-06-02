# ClinIQ — Healthcare Booking Platform

A full-stack healthcare appointment booking platform built with modern technologies.

## 🚀 Live Demo

> Frontend runs on `http://localhost:8080` | Backend API on `https://localhost:7000`

## 🛠️ Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **TanStack Router** — File-based routing
- **Tailwind CSS v4** — Styling
- **Framer Motion** + **GSAP** — Animations
- **Radix UI** — Accessible components
- **Axios** — HTTP client

### Backend

- **ASP.NET Core 10** — REST API
- **Entity Framework Core** — ORM
- **PostgreSQL** — Database
- **JWT Authentication** — Secure auth
- **Swagger** — API documentation

## ✨ Features

- 🔐 JWT Authentication (Register / Login)
- 👨‍⚕️ Doctor search with filters (specialty, city, fee)
- 📅 Multi-step appointment booking flow
- 👤 Patient dashboard (appointments, records, profile)
- 🏥 Doctor dashboard
- 🛡️ Admin panel (users, doctors, appointments, analytics)
- 🌙 Dark mode
- 🌍 Bilingual (Arabic / English) with RTL support
- 📱 Fully responsive

## 🏗️ Architecture

cliniq-health-hub-main/ # Frontend (React + TypeScript)
├── src/
│ ├── api/ # API layer (axios, auth, doctors, appointments)
│ ├── components/ # Reusable UI components
│ ├── context/ # React context (Auth, Theme, Language)
│ ├── routes/ # File-based routing
│ └── services/ # Business logic
ClinIQ.API/ # Backend (ASP.NET Core)
├── Controllers/ # API endpoints
├── Models/ # Database models
├── DTOs/ # Data transfer objects
├── Services/ # Business logic
├── Data/ # DbContext + migrations

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- .NET 10 SDK
- PostgreSQL 17

### Backend Setup

```bash
cd ClinIQ.API
# Update connection string in appsettings.json
dotnet ef database update
dotnet run
```

### Frontend Setup

```bash
cd cliniq-health-hub-main
npm install
npm run dev
```

## 📊 Database Schema

- **Users** — Authentication & profiles
- **Doctors** — Doctor profiles & specialties
- **Appointments** — Booking records
- **Schedules** — Doctor availability

## 🔑 Demo Accounts

| Role    | Email                  | Password  |
| ------- | ---------------------- | --------- |
| Admin   | admin@cliniq.com       | Admin1234 |
| Patient | (Register new account) | —         |

## 📝 Notes

- Backend uses localStorage-based demo data for non-critical features
- Images use initials avatars (real image upload ready for production)
- All bookings are saved to PostgreSQL database

## 👨‍💻 Developer

Built by **Zaky** as a portfolio project showcasing full-stack development skills.
