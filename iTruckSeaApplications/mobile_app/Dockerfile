# Use the official Node.js image as the build stage
FROM node:20.18.1 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first (better caching)
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire application source code
COPY . .
