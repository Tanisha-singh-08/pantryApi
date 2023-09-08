# Use a suitable base image (Node.js)
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy your application code into the container
COPY . .

# Install dependencies (if you have not done so already)
RUN npm install

# Expose the API port (port 9443 in your case)
EXPOSE 9443

# Define the command to run your application
CMD ["node", "server.js"]
