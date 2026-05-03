# Dockerfile

# ─────────────────────────────
# Stage 1 — Build Stage
# ─────────────────────────────
FROM node:20-alpine AS builder
# 👆 Base image — Node.js 18 alpine (lightweight) use karo
# alpine = Choti si Linux — sirf zaroorat ki cheezein

WORKDIR /app
# 👆 Container ke andar working directory set karo
# Matlab → cd /app

COPY package*.json ./
# 👆 Pehle sirf package.json copy karo
# package.json aur package-lock.json dono

RUN npm install
# 👆 Dependencies install karo

COPY . .
# 👆 Baaki saara code copy karo
# Pehle npm install kiya — Docker caching ke liye
# Code change ho toh sirf last layer rebuild hogi

RUN npm run build
# 👆 TypeScript compile karo → dist/ folder banta hai

# ─────────────────────────────
# Stage 2 — Production Stage
# ─────────────────────────────
FROM node:20-alpine AS production
# 👆 Naya fresh image — sirf production ke liye

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production
# 👆 Sirf production dependencies — devDependencies nahi
# Image size kam hogi ✅

COPY --from=builder /app/dist ./dist
# 👆 Build stage se compiled code copy karo

COPY --from=builder /app/uploads ./uploads
# 👆 Uploads folder copy karo

EXPOSE 3000
# 👆 Container ka port 3000 expose karo

CMD ["node", "dist/main"]
# 👆 App start karo