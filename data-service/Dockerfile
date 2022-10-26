FROM node:14-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install && npm i typescript -g
COPY . .
EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD ["npm","run","docker"]