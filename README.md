# Population management

[![CircleCI](https://circleci.com/gh/PaulKariukiRimiru/population-manager.svg?style=svg)](https://circleci.com/gh/PaulKariukiRimiru/population-manager)

This application can be used to manage population in different locations

## Getting Started

To start development

    * Use https://github.com/PaulKariukiRimiru/population-manager.git to clone the repository

    * In the project folder run `npm install` or `yarn`

    * Add a .env file with `[ DEV_PORT TEST_PORT BASE_URL MONGO_URL_DEV MONGO_URL_TEST]` variables

### Prerequisites
    * Ensure you have node and mongodb installed in your machine

    * Ensure that you have Git intalled in your machine

### Running

<b>To run the app locally</b><br>

    * Run the application using - 'yarn start:dev'

    * Access app through http://localhost:3000/

## Running the tests

To run the tests
    
    * Use command `yarn test`


## Built With

* Node + typescript

* Mongoose ORM

* Jest


## API Documentation

Endpoint                    |  Functionality
 ------------------------   |   ------------------------ 
GET {BASE_URL}/location               | get all locations
GET {BASE_URL}/location/:name         | get location by name
POST {BASE_URL}/location              | create location
PUT {BASE_URL}/location               | update location
DELETE {BASE_URL}/location           | delete location

**Data structure**

```
{
  name: string;
  male: number;
  female: number;
  parentLocation: string;
}
```
## Authors

* **Paul Rimiru** - *Initial work* - [PaulKariukiRimiru](https://github.com/PaulKariukiRimiru)
