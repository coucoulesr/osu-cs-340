FROM node:14-alpine
WORKDIR /usr/src/coursesignal
COPY package*.json .
RUN npm install

COPY . .
CMD ["node", "CourseSignal.js"]