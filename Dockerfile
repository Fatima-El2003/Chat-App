#Using the official Node js image as the base image
FROM node:18.6.0-alpine

#we specify the work directory
WORKDIR /app

#Compy the package .json containing all the dependnecies
COPY ../package*.json ./

#install all the dependencies listed in the package.json
RUN npm install

#copying all the other files to working directory
COPY . .

#expose the default port of react js
EXPOSE 3000

#command to run the app
CMD ["npm", "start"]