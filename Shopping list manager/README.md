# BS_HA_04

## Local Dependencies

Version of npm - `8.xx.xx`

Version of node - `16.xx.xx`

Docker needs to be installed

## Installation

## Developer environment

PORT: localhost:4000

1.  In server root folder run `docker-compose up` for MongoDB container with volume
2.  Rename `.env.example` to `.env`
3.  Run `$ npm i` to install dependencies
4.  `npm run server`
5.  With the first start of the server, the database will be seeded

# Credentials

- Credentials:
  email: password
  1.  adminadmin@admin.com: adminadmin
  2.  robertliny@lenoch.com: robert
   
- MongoDB Compass URI:
  - `mongodb://username:root@localhost:27017/`

- Insomnia- environment setup
  ```
  {
	"host": "localhost:4000",
	"jwtToken": "<GIVEN_API_KEY>"
  }
  ```

---
# How to test 

1. Run `npm run test --runInBand --detectOpenHandles`
2. see results in the terminal
   Output for example:
   ```
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        22.241 s, estimated 23 s
   ```

## Authors

- Martin Rehorek