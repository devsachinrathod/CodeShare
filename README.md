# CodeShare

Share code securely with a simple OTP. No accounts required.

## How it works

#docker compose up -d
#npx prisma db push
#npm run dev

1. **Sender** pastes code → generates a 6-digit OTP → sends the OTP via WhatsApp, Slack, SMS, etc.
2. **Receiver** enters the OTP → views and copies the decrypted code.
3. OTPs expire in **10 minutes** and are **single-use**.

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma
- Tailwind CSS
- AES-256-GCM encryption (server-side)
- SHA-256 hashed OTPs

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

With Docker:

```bash
docker compose up -d
```

Or point `DATABASE_URL` at any PostgreSQL instance.

### 3. Configure environment

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/codeshare?schema=public"
ENCRYPTION_KEY="<64 hex chars = 32 bytes>"
```

Generate an encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create the database schema

```bash
npx prisma db push
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Security notes

- Code is encrypted with AES-256-GCM before storage.
- OTPs are never stored in plaintext — only hashes.
- Encryption keys stay on the server.
- This is **not** end-to-end encryption; the server can decrypt shares.
- Basic in-memory rate limiting protects OTP redemption from brute force.
