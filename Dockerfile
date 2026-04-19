FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM node:18 AS backend-runtime
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend .
COPY --from=frontend-builder /app/frontend/dist ./public

ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
