# Use the official Node.js image as a base
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Set the working directory to /workspace
WORKDIR /workspace

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Command to start the app (adjust as necessary based on your `package.json` scripts)
CMD ["npm", "run", "dev"]