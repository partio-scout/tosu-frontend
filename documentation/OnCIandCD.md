# On CI and CD

This project uses TravisCI to manage continuous integration needs.

Travis is used to perform three tasks:

- Run unit tests
- Run end-to-end tests
- Deploy this application to AWS and Docker hub

## Unit tests
Unit test are quite straight forward using Travis.
Travis runs the tests using the command `npm run test`

## End-to-End tests
This part is more complicated. To achieve the goal of end-to-end testing
this project uses Docker and Cypress in Travis.
We have a three container setup consisting of tosu-frontend, tosu-backend and 
postgresql. This is started with `docker-compose.yml`.
On startup tosu-backend container will run database migrations
if the postgresql-containers database is empty.

After running `docker-compose up` Travis will run 
`npx cypress run`. This will use headless electron
runner of cypress. 
If the end-to-end tests fail the Travis build will fail.

The tosu-frontend image contains the production build
of the application and serves it using npm/serve on port 3000.

## Deploy this application to AWS and Docker hub
After running tests this application is deployed
using two scripts `scripts/deploy.sh`and `docker_push`.
These scripts deploy the application only on the master branch.
