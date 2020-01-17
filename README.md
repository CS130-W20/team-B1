Director
========================

Director is a full-stack web app, designed to be the premiere destination for party playlists.

## Prerequisites

 - [Docker 19.03.5+ & docker-compose 1.24.1+](https://docs.docker.com/compose/install/)

## Usage

1.  From the root of the repo, run `docker-compose build` to build the docker containers.
2. To run them, use `docker-compose up`.
2. From there, http://localhost:8000 will link to the API, and http://localhost:3000 will link to the frontend.
4. Refer to `docker-compose` documentation for further options, such as running in detached mode.

## Testing

-  To test frontend components, run `npm run test`.
-  To test backend components, run `TODO: fill this in`.
-  TODO: travis ci.

## Cleanup

1.  To stop the containers:
    - If not detached: use `Ctrl+C` in the terminal window from which you ran `docker-compose up`
    - Whether detached or not: run `docker-compose down`.
2. To clean up the containers' associated volumes as well, run `docker-compose down -v`.
3. To do a full compose stack cleanup, destroying images, volumes and dangling stuff, run `docker-compose down -v --rmi all --remove-orphans`.
4. To completely clear everything Docker-related: `docker system prune`.
5. Consult the Docker documentation for further options beyond these.

## Tech Stack Description

Roshambo is built using Django and React. Django incorporates Django Channels, and the Django Rest Framework. React utilizes React Bootstrap. Refer to `backend/requirements.txt` for specific packages used in the backend, and to `package.json` for specific packages used in the frontend.

##### TA Readme stuff (TODO: merge with above)

# Sample Project Title
Briefly describe your project here.

## Directory Structure
Explain how the code is organized

## Installation/Run instructions
Explain how to run your application

## Relevant Links 
- Documentation link
- Working URL (if any)
- anything else



