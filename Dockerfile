FROM node:20-alpine

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build || true

EXPOSE 3000

CMD ["npm","run","start"]
