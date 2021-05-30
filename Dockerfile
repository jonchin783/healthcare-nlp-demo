FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install mongoose
RUN npm install morgan
RUN npm install xmldom
RUN npm install bcrypt-nodejs
RUN npm install passport
RUN npm install passport-local
RUN npm install connect-flash
RUN npm install cookie-parser
RUN npm install express-session
RUN npm install serve-favicon
RUN npm install gulp
RUN npm install --no-optional
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "node", "nso-portal.js" ]
