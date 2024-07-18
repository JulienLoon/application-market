# Use Node.js base image
FROM node:14

# Install netcat
RUN apt-get update && apt-get install -y netcat

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Copy wait-for-it.sh
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 8080

# Run the app with wait-for-it
CMD ["./wait-for-it.sh", "db:3306", "--", "node", "index.js"]
