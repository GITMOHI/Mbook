# FROM node:22.12.0
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# CMD ["npm", "start"]


FROM node:22.12.0  
WORKDIR /app       

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]