FROM node:12.2.0

ENV APP_HOME /roshambo-ui
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/frontend
WORKDIR $APP_HOME

COPY frontend $APP_HOME/frontend
COPY package.json $APP_HOME
COPY package-lock.json $APP_HOME
COPY webpack.config.js $APP_HOME
COPY .babelrc $APP_HOME

RUN ls -lah

RUN npm install

CMD ["npm", "run", "start"]
