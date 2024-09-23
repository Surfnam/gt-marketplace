Hi guys for the backend setup, I installed some key dependencies and created a barebone express backend.

0. Folder setup
     - create a folder named 'backend' in the root folder
     - create files named server.js and .env

1. Installation
     - cd to the backend folder
     - in the terminal type:
         -npm init -y (creates package.json file)
         -npm i express mongoose dotenv (dependencies)
         -npm i -D nodemon (devDependency that restarts app automatically when there are changes )


2. package.json configurations

  - go to scripts and add the following:
      {
            "start": "node server.js",
            "dev": "nodemon server.js"
      }
  
  - in the terminal, type node run dev and confirm the server is running.

3. gitignore update
    - make sure to add .env and node modules to the gitignore file
 
          

Creating an edit!
