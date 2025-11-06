# Use official Playwright image with pre-installed browsers
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set working directory
WORKDIR /app

# Copy package files for layer caching optimization
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Run as non-root user for security
USER pwuser

# Default command to run tests
CMD ["npx", "playwright", "test"]
