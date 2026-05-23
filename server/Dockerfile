FROM node:20

WORKDIR /chatbot-server

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

# production start command
CMD ["npm", "start"]