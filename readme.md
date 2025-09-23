## Install Nodejs on Windows

Node.js installer: https://nodejs.org/en/download/

If you can't check your npm and node version with `npm -v` and `node -v` please check in Powershell how the execution policy is set, it should be on 'Unrestricted'. You can change that with the command `Set-ExecutionPolicy Unrestricted`.

## Install Express

A minimal Node.js framework that will provides just enough features for the project.

`npm install express`

## Install Bruno

We'll need Bruno as an API client to check if our API routes are safe and working, for downloading it: `choco install bruno`, Chocolatey should be installed at the same time as npm/nodejs. If not please rerun the Nodejs installation.

You can also use the Bruno extension in VS Code.

## Install MySQL2

`npm install mysql2`

## Install Mongoose

A tool to use MongoDB in JavaScript.

`npm install mongoose`