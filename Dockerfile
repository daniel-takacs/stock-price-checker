# Use the official Node.js image as a base
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Define the environment variable
ENV PORT=3000

# Command to run the application
CMD ["npm", "run", "dev"]
