# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . /app
RUN npm install

# start app
CMD ["sh","-c","node sample.js"]
