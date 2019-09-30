# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . /app
RUN npm install --silent
RUN truffle migrate --reset

# start app
CMD ["npm","run","dev"]
