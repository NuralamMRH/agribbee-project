# Use the official Node.js runtime as the base image
FROM node:20.18.1-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application code to the container
COPY . .

# Set NODE_ENV environment variable
ENV NODE_ENV=development

# Start the server
CMD ["npm", "run", "dev"]