FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["env-cmd -f .env.development nodemon -x ts-node", "src/main.ts"]
EXPOSE 6068