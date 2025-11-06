# Use official Playwright image with pre-installed browsers
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

USER pwuser

CMD ["npx", "playwright", "test"]
