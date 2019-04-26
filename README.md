# Toiminnan suunnittelusovellus

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

The app will be running at http://localhost:3000/.

### Running tests

- Run tests `$ npm test`
- Generate test coverage `$ npm run test-local`

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

### Documentation

> TODO: Add documentation

### Backlogs

[Product backlog (Trello)](https://trello.com/b/87G4Y96t/tosu-app)

[Spring 2019 sprint backlog](https://docs.google.com/spreadsheets/d/1JXfi_ZUgXKkfvnegcy7C4KUzVWvdBlr7t2WN6icuReA/edit#gid=881218288)

[Fall 2018 product & sprint backlogs](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/)

[Spring 2018 product & sprint backlogs](https://docs.google.com/spreadsheets/d/1cA-ldx-M_ppxSicxjL06BmAjhoNi5I55M5BugoUBD98/edit?usp=drivesdk)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
