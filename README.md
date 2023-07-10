# Welcome to Notes Directory
![notesdirectory-github-image](https://github.com/anik-bin/notesdirectory-frontend/assets/65410444/35aa51c2-0b07-4fd1-891f-f406e50bcf7a)

This is the code for the backend part of the application.

## How to install it locally on your machine

1. Fork this project and clone it in your local machine
2. In the terminal type `npm i`. This will install all the necessary packages. (You should have Nodejs installed in your local machine)
3. Create an .env file in the root of your project and add the following lines 
    `PORT=4000`
    `MONGOURI= (PUT YOUR MONGODB DATABASE URL)`
    `JWT_SECRET_KEY= (PUT YOUR JWT SECRET KEY HERE)`
4. Your frontend now has been setup. You can run it by typing `npm dev`. Now your backend server will run on `port 4000` and you have simultaneously run the frontend part as well which will run on `port 3000`.

## Important points

1. You need to have a mongodb database setup locally
2. You need to generate a JWT secret key which can be a series of random numbers and alphabets or mix of both. You can easily find a key generator on the internet.
3. If you have not setup the frontend part yet. Here is the [link](https://github.com/anik-bin/notesdirectory-frontend)