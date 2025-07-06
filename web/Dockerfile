# Stage 1: Build the React app
FROM node:22-alpine AS build
WORKDIR /app

# Accept build argument for API base URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Leverage caching by installing dependencies first
COPY web/package.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code and build for production
COPY web ./
RUN npm run build

# Stage 2: Development environment
FROM node:22-alpine AS development
WORKDIR /app

# Install dependencies again for development
COPY package.json ./
RUN npm install --frozen-lockfile

# Copy the full source code
COPY . ./

# Expose port for the development server
EXPOSE 3000
CMD ["npm", "start"]

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]