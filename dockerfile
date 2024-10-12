# Stage 1: Build the Vue.js app
FROM node:18-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using a lightweight web server (nginx)
FROM nginx:alpine AS production-stage

# Copy the built app from the previous stage to the nginx container
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
