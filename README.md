# SpaceRead 🚀

Multipurpose web app for UAEU students to share course resources, discover professors, and trade insights across campus. Think of it as the study launchpad for the UAEU community.

**Live site:** https://spaceread.net

## What you can do

- 🎓 Discover professors, explore ratings, and read reviews
- 📝 Share your experience with scores, course/grade context, and optional attachments or GIFs
- 💬 Reply to reviews and add reactions (likes/dislikes)
- 📚 Upload and download course materials
- ✅ Verify your UAEU email with a one-time code to keep the community trusted

## Repository structure

- `web-client/` — React + Vite frontend
- `services/` — Go backend services
  - `cmd/course` — course materials service
  - `cmd/professor` — professor reviews service

## Tech stack

- React 19 + Vite + TypeScript (frontend)
- Go 1.23 (backend)
- PostgreSQL (primary datastore)
- Azure Blob Storage (attachments/materials)
- Google ReCAPTCHA/Perspective/Translate (moderation & verification)
- AWS SES (email verification)

## Safety & trust

SpaceRead integrates multiple safety services to keep submissions clean and authentic, including ReCAPTCHA, Perspective API, Azure Vision, and VirusTotal.

## Local development

### Web client

```bash
cd web-client
npm install
npm run dev
```

Configuration:

- `.env` and `.env.development` define `VITE_*` values.
- For local API services, update `VITE_PROFESSOR_ENDPOINT` / `VITE_COURSE_ENDPOINT` or adjust the proxy in `web-client/vite.config.ts`.

### Services (Go)

Prerequisites: Go 1.23+, PostgreSQL, and access to the required cloud services.

```bash
cd services
go mod download
go run ./cmd/course
go run ./cmd/professor
```

Configuration:

- Services load configuration from environment variables (see `services/internal/course/config.go` and `services/internal/professor/config.go`).
- Common variables include:
  - `PORT`
  - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_SSLMODE`
  - `AZURE_STORAGE_ACCOUNT`, `AZURE_STORAGE_ACCESS_KEY`, `MATERIALS_CONTAINER`, `ATTACHMENTS_CONTAINER`
  - `SESSION_COOKIE_NAME`, `COOKIE_DOMAIN`, `JWT_SECRET`
  - Integration keys such as `RECAPTCHA_*`, `PERSPECTIVE_*`, `VISION_*`, and standard `AWS_*` credentials.

## Build & lint

```bash
cd web-client
npm run lint
npm run build
```

```bash
cd services
go test ./...
```

## Attribution

This project uses [Twemoji](https://twemoji.twitter.com/) licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
