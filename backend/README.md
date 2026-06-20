# AFAQ API — Headless Backend Engine

> **API-First · KSA PDPL Compliant · Firebase-Free**
> Serves the Next.js web app and future Flutter mobile app from a single database (SQLite locally, PostgreSQL in production KSA).

---

## Architectural Boundaries (Non-Negotiable)

| Rule | Implementation |
|---|---|
| **No Firebase / No Docker (local)** | Self-hosted Node.js + SQLite (dev) / PostgreSQL (prod) |
| **Data residency** | Deploy to AWS `me-south-1` (Riyadh) or Saudi Cloud (STC, Elm) |
| **API-First** | All features exposed via `/api/v1/*` — no server-side rendering |
| **Passwordless auth** | Phone+OTP, Nafath, OAuth — zero password fields |
| **Versioned API** | All routes prefixed `/api/v1/` with `X-API-Version` header |
| **Containerized** | Docker + docker-compose ready for ECS/EKS deployment |

---

## Folder Structure

```
backend/
├── package.json
├── tsconfig.json
├── .env.example
│
├── prisma/
│   ├── schema.prisma             # SQLite (local) — enums as String, JSON as Text
│   ├── dev.db                    # Generated local database (gitignored)
│   ├── seed.ts                   # Subscription plan seed data
│   └── migrations/
│
└── src/
    ├── index.ts                  # Bootstrap + graceful shutdown
    ├── app.ts                    # Express app factory
    │
    ├── config/
    │   ├── env.ts                # Zod-validated environment
    │   └── database.ts           # Prisma client singleton
    │
    ├── common/
    │   ├── middleware/
    │   │   ├── auth.middleware.ts    # JWT guard (Bearer + HttpOnly cookie)
    │   │   └── error.middleware.ts   # Global error handler
    │   └── utils/
    │       ├── jwt.ts                # Access + refresh token (jose/HS256)
    │       └── otp.ts                # OTP generation + bcrypt hashing
    │
    └── modules/
        ├── auth/                 # Passwordless authentication
        │   ├── auth.routes.ts
        │   ├── auth.controller.ts
        │   ├── auth.service.ts
        │   └── auth.schema.ts
        │
        ├── ai/                   # 9-node AI orchestrator
        │   ├── ai.routes.ts
        │   ├── ai.controller.ts
        │   ├── ai.service.ts
        │   └── ai.schema.ts
        │
        ├── zatca/                # ZATCA Phase 2 e-invoicing (isolated)
        │   ├── zatca.routes.ts
        │   ├── zatca.controller.ts
        │   └── zatca.service.ts
        │
        └── commerce/             # Stores, pricing, portfolio, subscriptions
            ├── commerce.routes.ts
            ├── commerce.controller.ts
            └── commerce.service.ts
```

---

## API Endpoints (v1)

### Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/otp/send` | Public | Send 6-digit OTP to Saudi phone |
| POST | `/otp/verify` | Public | Verify OTP → issue JWT session |
| POST | `/nafath/initiate` | Public | Start Nafath biometric auth |
| POST | `/oauth` | Public | Google / Apple login |
| POST | `/refresh` | Public | Rotate access token |
| POST | `/logout` | Public | Revoke session |
| GET | `/me` | Private | Current user profile |

**Client detection:** Send `X-Client-Type: web` or `X-Client-Type: mobile`
- **Web:** Tokens set as HttpOnly cookies (`afaq_access`, `afaq_refresh`)
- **Mobile:** Tokens returned in JSON body as Bearer tokens

### AI Orchestrator — `/api/v1/ai`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/chat` | Optional | Route message to 9-node AI system |
| GET | `/sessions/:sessionId` | Private | Chat history |

### ZATCA E-Invoicing — `/api/v1/zatca`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/invoices` | Private | Generate UBL 2.1 XML + cryptographic stamp |
| POST | `/invoices/:id/submit` | Private | Submit to ZATCA Fatoora API |
| GET | `/invoices/:id` | Private | Invoice details |
| GET | `/stores/:storeId/invoices` | Private | List store invoices |

### Commerce — `/api/v1/commerce`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/plans` | Public | Subscription pricing (499/1499/Custom SAR) |
| GET | `/services` | Public | Service catalog |
| GET | `/portfolio` | Public | Portfolio case studies |
| POST | `/contact` | Public | Contact form submission |
| POST | `/recruitment` | Public | Job application |
| GET | `/stores` | Private | User's stores |
| POST | `/stores` | Private | Create store |
| GET | `/subscriptions/me` | Private | Active subscription |
| POST | `/subscriptions` | Private | Subscribe to plan |

---

## Quick Start (Local — No Docker)

```bash
cd backend
npm install
cp .env.example .env

# Generate DB + run migrations + seed
npx prisma migrate dev --name init

npm run dev
# → http://localhost:4000/api/v1/health
```

### Test Auth Flow

```bash
# Send OTP (check console for mock code)
curl -X POST http://localhost:4000/api/v1/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "512345678"}'

# Verify OTP (mobile client)
curl -X POST http://localhost:4000/api/v1/auth/otp/verify \
  -H "Content-Type: application/json" \
  -H "X-Client-Type: mobile" \
  -d '{"phone": "512345678", "code": "123456"}'
```

---

## Production Deployment (AWS Riyadh)

```bash
# Build and push to ECR (me-south-1)
docker build -t afaq-api .
docker tag afaq-api:latest <account>.dkr.ecr.me-south-1.amazonaws.com/afaq-api:latest
docker push <account>.dkr.ecr.me-south-1.amazonaws.com/afaq-api:latest

# Deploy to ECS Fargate with:
# - RDS PostgreSQL (me-south-1, Multi-AZ)
# - AWS Secrets Manager for JWT_SECRET, ZATCA keys
# - ALB with TLS 1.3 termination
# - CloudWatch for audit logs (PDPL requirement)
```

---

## Database Schema Domains

| Domain | Tables |
|---|---|
| **Auth** | `users`, `otp_sessions`, `refresh_tokens`, `nafath_sessions` |
| **Commerce** | `subscription_plans`, `subscriptions`, `stores`, `services`, `portfolio_items`, `contact_inquiries`, `recruitment_applications` |
| **AI** | `ai_sessions`, `ai_messages`, `ai_logs` |
| **ZATCA** | `zatca_certificates`, `zatca_invoices` |

Seed data includes the three AFAQ v2.0 pricing tiers (499 / 1499 / Custom SAR).
