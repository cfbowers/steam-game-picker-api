# steam-game-picker-api
API for [Steam Roulette](https://www.steamroulette.app/demo) application. Steam Roulette picks a random game that you have in common with selected friends. It will also show other games you have in common. The Steam API does not provide this functionality. 

The main functions of the API are authentication, linking app users to Steam accounts, fetching data using the distinct API keys of users, and interacting with data from the Steam API.

Built with Express.js, Node.js, MongoDB & Mongoose, Redux, and Passport for Steam authentication. 

## Status 
Currently being refactored to clean up files, and increase route  speed. The following changes have at least halved the amount of time each route would take: 
  1. Concurrent calls with `Promise.all` where possible
  2. Switched from [steamapi](https://www.npmjs.com/package/steamapi) package to making custom calls to the Steam api, removing unnecessary data processing
  3. Time complexity improvements in the steamServices.js functions

I'll post exact numbers when the refactor is complete. 

## Suggested Files to Review
```
  1. src/routes/index.js                    for layout of the app
  2. src/routes/handlers/steamHanders.js    for how handlers are written and wrapped in higher order functions
  3. src/routes/handlers/higherOrder.js     
  4. src/routes/services/steamServices.js   logic for getting Steam games and users
  5. src/util/steamAPI.js                   custom Steam API logic
```

## Problems Faced 
### Steam API data unavailable for certain Steam accounts
I initially wanted to only use my Steam API key for this app to keep it simple. However, the Steam API will return data based off of the permissions of the API key used. This meant that my API key would not be able to get data for Steam accounts I was not friends with, so basically, no one else could use this app. To solve this I: 
  1. Linked this app's user accounts with Steam Id that would be retrieved using Passport and a Steam API key that would need to be added manually by the user.   
  2. Made the routes require that the a user have a Steam Id and API key linked to their account before making calls to the Steam API. 
  3. Made Steam API calls with the Steam API key of the logged in user

### Try/catch in every route handler made the code less 'DRY' 
I wanted a better way to handle errors in the routes than wrapping each in a try/catch block. To solve this I: 
  1. Created the errorHandler.js middleware to handle all errors in the routes
  2. Wrote higher order functions in the higherOrder.js handler that would wrap appropriate handler functions. These functions would either send a successful result, redirect, or pass errors to errorHandler.js. 
  
## Other Noteworthy Packages 
The following and more found in `package.json`:
* node-fetch - making calls to Steam API
* config - central app configs 
* jsend - ensuring consistency in JSON objects returned by the API
* jsonwebtoken, bcryptjs - authentication
* passport, passport-steam - for authenticating to Steam and linking app accounts to Steam accounts
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
Mocha is used as the test runner, chai for expectations, and supertest for testing API routes. 
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
  |-- middleware              custom middleware logic for API routes
      |-- auth.js             authentication logic used for routes requiring a logged in user
      |-- errorHandler.js     catch-all error handler used by the app 
      |-- passport.js         custom passport setup using Steam API key of the logged in user 
      |-- SteamCheck.js       logic to ensure that user has SteamId and API key for routes that 
                              require it

  |-- routes             
      |-- index.js            all routes for API endpoints
      |-- handlers            handler functions for API routes
          |-- higherOrder.js  higher order functions that all handlers are wrapped in to handle 
                              success or error logic. this reduces the instances of try/catch in 
                              the handlers (keeping them DRY) and sends errors to the errorHandler
                              middleware.
      |-- services            "business logic" used by the route handlers, keeping the handlers free
                              from working directly with the database or API. 
                              general flow: route -> route handler -> service -> data source

  |-- util                    functions available to the entire app 
      |-- steamAPI.js         custom functions for working with the Steam API 
      |-- errors.js           error objects that will be used and passed to the errorHandler middleware

  |-- app.js                  main file for running the express application
|-- test                    folder containing route and util tests
```
