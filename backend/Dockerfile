# pull official base image
# TODO(benjibrandt): evaluate if using alpine-based images for these is worth the dependency hassle
# For now, it's whatever for local dev
FROM python:3.8.1

# set work directory
ENV APP_HOME /roshambo
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY backend/requirements.txt $APP_HOME
RUN pip install -r requirements.txt

# install netcat - used in entrypoint.sh
RUN apt-get update && apt-get install -y netcat

# copy project
COPY backend $APP_HOME
COPY backend/.docker/entrypoint.sh $APP_HOME

ENTRYPOINT ["/roshambo/.docker/entrypoint.sh"]
