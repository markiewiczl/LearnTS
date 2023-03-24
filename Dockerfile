FROM node:19.2
WORKDIR /
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]