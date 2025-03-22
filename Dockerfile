# Use the official Node.js image from Docker Hub
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Set the working directory inside the container
WORKDIR /workspace

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Command to run your app
CMD ["npm", "run", "dev"]
