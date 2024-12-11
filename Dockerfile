FROM node:18.17.1
WORKDIR /app
ENV PORT=8000
ENV MODEL_URL='https://console.cloud.google.com/storage/browser/somatch'
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "npm", "run", "start"]