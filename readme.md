# steam-game-picker-api
api for [Steam Roulette](https://www.steamroulette.app/demo) application.
The main functions of the api are authentication, linking app users to Steam accounts, fetching data
using the distinct api keys of users, and interacting with data from the Steam api.

## Notes 
### General
Built with Express.js, Node.js, MongoDB & Mongoose, Redux, and Passport for Steam authentication. 


### Other Noteworthy Packages 
The following and more found in `package.json`:
* node-fetch - making calls to steam api
* config - central app configs 
* jsend - ensuring consistency in JSON objects returned by the api
* jsonwebtoken, bcryptjs - authentication
* passport, passport-steam - for authenticating to steam and linking 
* mocha, chai, supertest - testing 

## Installation
From within the project directory: 
```
npm i 
```

## Running the Application in Development
From within the project directory: 
```
npm run dev
```

## Running Tests
Mocha is used as the test runner, chai for expectations, and supertest for testing api routes. 
I am currently working on building out the tests for this application. I've recently researched TDD,
and will incorporate in into future projects.  
Execute tests with: 
```
npm test
```

### Noteworthy Files and Folders 
```
|--src                
  |--config                   environment configurations for the app
  |-- data                    mongodb/mongoose configuration and models
  |-- middleware              custom middleware logic for api routes
      |-- auth.js             authentication logic used for routes requiring a logged in user
      |-- errorHandler.js     catch-all error handler used by the app 
      |-- passport.js         custom passport setup using steam api key of the logged in user 
      |-- steamCheck.js       logic to ensure that user has steamid and api key for routes that 
                              require it

  |-- routes             
      |-- index.js            all routes for api endpoints
      |-- handlers            handler functions for api routes
          |-- higherOrder.js  higher order functions that all handlers are wrapped in to handle 
                              success or error logic. this reduces the instances of try/catch in 
                              the handlers (keeping them DRY) and sends errors to the errorHandler
                              middleware.
      |-- services            "business logic" used by the route handlers, keeping the handlers free
                              from working directly with the database or api. 
                              general flow: route -> route handler -> service -> data source

  |-- util                    functions available to the entire app and without an obvious home
      |-- steamApi.js         custom functions for working with the steam api 
      |-- errors.js           error objects that will be used and passed to the errorHandler middleware

  |-- tests                   folder containing route and util tests
  |-- app.js                  main file for running the express application
```