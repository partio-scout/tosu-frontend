# Toiminnansuunnittelu [frontend]

[![Build Status](https://travis-ci.org/partio-scout/tosu-frontend.svg?branch=master)](https://travis-ci.org/partio-scout/tosu-frontend)

Scouts' activity planning app.

## Getting Started

These instructions will help you setup working environment for development and testing purposes.  
See [deployment](https://github.com/partio-scout/tosu-frontend#deployment) on how to deploy to production.

### Prerequisites

1. [node.js](https://nodejs.org/en/)
2. [tosu-backend](https://github.com/partio-scout/tosu-backend-node#how-to-use)

### Installing

- Make sure [**tosu-backend**](https://github.com/partio-scout/tosu-backend-node#how-to-use) is running
- Clone the repository `$ git clone git@github.com:partio-scout/tosu-frontend.git`
- Install npm packages `$ npm install`
- Run the project `$ npm start`

The app will be running at [http://localhost:3000/](http://localhost:3000/)

## On CI and CD

This project uses TravisCI to manage continuous integration needs.

Travis is used to perform three tasks:

- Run unit tests
- Run end-to-end tests
- Deploy this application to AWS and Docker hub


### Deploy this application to AWS and Docker hub
After running tests this application is deployed
using two scripts `scripts/deploy.sh`and `docker_push`.
These scripts deploy the application only on the master branch.


# Testing

## Unit tests

This project uses unit tests to tests functions and reducers. Components are tested with end-to-end testing.

### Running unit tests locally

- Run tests `$ npm test`
- Generate test coverage `$ npm run test-local`

### Running unit tests with continous integration

Unit test are quite straight forward using Travis. Travis runs the tests using the command `$ npm run test`

## End-to-end-testing

This project uses Cypress to run its end-to-end test suites. Documentation for Cypress API can be found [here](https://docs.cypress.io/api/api/table-of-contents.html)

### Running E2E-tests locally

Before running Cypress tests locally the user must first start both the frontend and the backend are running as described above. 

To start the Cypress-launcher input command
    
`$ npm run cypress:open`

while in the project root

The user can run all the test suites by pressing the "Run all specs"-button or a single test suite by pressing the filename

Tests can be found in directory 
> /cypress/integrations

New test files must have the **.spec.js** filename extension

### Running E2E-tests with continous integrations

The tests are run with Travis when the project is pushed to Github. To achieve the goal of end-to-end testing this project uses Docker and Cypress in Travis. We have a three container setup consisting of tosu-frontend, tosu-backend and postgresql. This is started with docker-compose.yml. On startup tosu-backend container will run database migrations if the postgresql-containers database is empty.

After running docker-compose up Travis will run `$ npx cypress run`. This will use headless electron runner of cypress. If the end-to-end tests fail the Travis build will fail.
Sometimes the test can pass in local environment but fail while run in CI. This is due to the tests handling differently when run by Chrome than when run in electron runner. Before making pull request you should run the tests using command 
`$ npx cypress run` to check if they will pass in the CI-environment.


The tosu-frontend image contains the production build of the application and serves it using npm/serve on port 3000.

## Deployment

### Automatic deployment

The app currently has automatic deployment from Travis CI to the [staging server](https://suunnittelu.beta.partio-ohjelma.fi/).

### Manual deployment

1. Get the unencrypted ssh key `tosu_node.pem`
2. SSH to the server instance:

```sh
$ chmod 600 tosu_node.pem
$ ssh-add tosu_node.pem
$ ssh ubuntu@suunnittelu.beta.partio-ohjelma.fi
```

3. Execute the following:

```sh
git clone https://github.com/partio-scout/tosu-frontend.git
cd tosu-frontend
npm install
npm run build
rm -rf /var/www/html
cp -a /build /var/www/html
cd ..
rm -rf tosu-frontend
```

## Resources
### JSDOC
Generate JSDOC with following command:
```$ npx jsdoc src/ -r```
### Backlogs

[Product backlog (Trello)](https://trello.com/b/87G4Y96t/tosu-app)

[Spring 2019 sprint backlog](https://docs.google.com/spreadsheets/d/1JXfi_ZUgXKkfvnegcy7C4KUzVWvdBlr7t2WN6icuReA/edit#gid=881218288)

[Fall 2018 product & sprint backlogs](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/)

[Spring 2018 product & sprint backlogs](https://docs.google.com/spreadsheets/d/1cA-ldx-M_ppxSicxjL06BmAjhoNi5I55M5BugoUBD98/edit?usp=drivesdk)

[ Spring 2019 end demo](https://docs.google.com/presentation/d/1gM9LLixv0au1nOW7uaX4Pt0axo0ZnNi-yr2oWLkl0lQ/edit?usp=sharing)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
