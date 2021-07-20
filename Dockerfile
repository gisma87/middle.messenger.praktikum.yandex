FROM ubuntu:18.04
RUN apt update && apt install -y nodejs && apt install -y npm
COPY dist ./dist/
RUN npm i express
COPY server.js ./
#EXPOSE 3000
CMD node ./server.js

