# pull down the image once again
FROM node:22-alpine

# set working directory
WORKDIR /usr/src/app

# copy package file
COPY package*.json ./

# install required stuffies
RUN npm i

# needed for https on docker
COPY ./certs/localhost+1.pem ./certs/
COPY ./certs/localhost+1-key.pem ./certs/

# copy ander goed
COPY . .

# expose a port (default for vite is 5173 but other frotnedn is there)
EXPOSE 5174

# run that thing (tell vite to allow connections from places other than localhost)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]