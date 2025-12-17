FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN ls -R

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]