FROM node:18-alpine

COPY "./" "/app"
WORKDIR "/app"
RUN npm install

# start
CMD ["npm", "run", "scrape"]