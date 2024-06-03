FROM node:16.17.0-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .
RUN npm run build

# Copy needed env files
# COPY .env ./

# Bundle app source
# COPY build .

EXPOSE 8080
CMD ["node","index.js"]
