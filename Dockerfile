FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for development)
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
