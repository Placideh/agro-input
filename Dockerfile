FROM node:16.17.0-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install --global pm2

RUN cd build

RUN pm2 start "npm start" --name "backend"

# Copy needed env files
# COPY .env ./

# Bundle app source
# COPY build .

EXPOSE 8080
CMD ["node","index.js"]
