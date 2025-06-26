# Development stage
FROM node:22.17.0-slim AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.ts ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the app port
EXPOSE 3001

# Command to run the application in development
CMD ["npm", "run", "dev"]

# Production stage
FROM node:22.17.0-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY knexfile.ts ./

# Install production dependencies only
RUN npm install --only=production

# Copy built files from development stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/src/db/migrations ./dist/db/migrations

# Expose the app port
EXPOSE 3001

# Command to run the application in production
CMD ["npm", "run", "start"]