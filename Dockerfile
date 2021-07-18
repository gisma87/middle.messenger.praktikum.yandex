FROM alpine:3.7
RUN apt update && apt install -y nodejs && apt install -y npm
CMD node -v
#COPY target/ /app/
#CMD "tail" "-f" "/dev/null"
