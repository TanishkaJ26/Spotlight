<img width="1786" height="786" alt="Ai Agent" src="https://github.com/user-attachments/assets/86f411d0-06b4-46bd-994e-e1ef6cba5963" /># 🎙️ AI Webinar SaaS Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat&logo=stripe)
![VAPI](https://img.shields.io/badge/VAPI-AI%20Agents-purple?style=flat)

A full-stack AI-powered webinar platform that enables hosts to create
and stream live webinars with integrated AI agents, real-time attendee
interaction, and subscription-based access — built as a production-ready
SaaS application.

🌐 **Live Demo:** [Spotlight](https://spotlight-five-puce.vercel.app/)

## ✨ Features

### 🎬 Webinar Management
- Create and manage webinars with full lifecycle support
- Three webinar states — Waiting Room, Live Stream, Ended
- Real-time attendee live stream page
- Webinar and lead capture pages

### 📡 Livestreaming
- OBS Studio integration for professional live streaming
- Real-time stream connection directly within the application
- Live webinar page with stream status management
- Webinar recording functionality with playback support

### 🤖 AI Agent Integration
- VAPI-powered AI voice agents
- Users can create and configure their own AI agents
- Dedicated AI agent page and call page interface
- AI-assisted attendee interaction during webinars

### 💳 Payments & Subscriptions
- Stripe integration for subscription management
- Multi-step onboarding form
- Settings page for subscription management

### 🔐 Authentication & Database
- Secure user authentication
- Prisma ORM with Neon PostgreSQL database
- Protected routes and session management

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Neon PostgreSQL + Prisma ORM |
| Payments | Stripe |
| AI Agents | VAPI |
| Streaming | OBS Studio Integration |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon database account
- Stripe account
- VAPI account
- OBS Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-webinar-saas.git

# Navigate to project directory
cd ai-webinar-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
VAPI_API_KEY=
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
```

## 📸 Screenshots


| Landing Page | Dashboard | Create Webinar Form | Live Webinar | AI Agent |
|--------------|-----------|---------------------|--------------|----------|
| ![Landing](<img width="1891" height="861" alt="Landing" src="https://github.com/user-attachments/assets/7f335807-095f-40cc-92bd-64d1d7aeedd7" />) | ![Dashboard](<img width="1897" height="856" alt="Dashboard" src="https://github.com/user-attachments/assets/59ea2125-53f0-4037-8d65-f2d07b952e8f" />) | ![Create Webinar Form](<img width="1907" height="861" alt="Create Webinar" src="https://github.com/user-attachments/assets/3d46981b-ba1e-45d5-be48-e58ee98d9695" />) | ![Live Webinar](<img width="1898" height="867" alt="Live Stream" src="https://github.com/user-attachments/assets/05d5146c-b6d0-4287-81b5-01d47b7b274f" />) | ![AI Agent](<img width="1786" height="786" alt="Ai Agent" src="https://github.com/user-attachments/assets/86f411d0-06b4-46bd-994e-e1ef6cba5963" />) |

## 🏗️ Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard routes
│   ├── webinar/         # Webinar pages (waiting/live/ended)
│   ├── ai-agent/        # AI agent creation and call pages
│   └── api/             # API routes
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configs
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## 🔮 Future Improvements
- [ ] Analytics dashboard for webinar host insights
- [ ] Email notifications for attendees
- [ ] Multi-language support for AI agents

## 👩‍💻 Author

Tanishka Jangir
- GitHub: [@TanishkaJ26](https://github.com/TanishkaJ26)
- LinkedIn: [linkedin.com/in/tanishka-jangir](www.linkedin.com/in/tanishka-jangir-7567bb291)

## 📄 License

This project is open source and available under the MIT License.
