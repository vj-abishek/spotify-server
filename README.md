# spotify-server

## An example for using Spotify API with node js

# Installation
```
npm install
```
> To install the dependencies

```
npm start
```
> To start the Server

## Setup

1. [Register a Spotify App](https://developer.spotify.com/dashboard/applications) and add `http://localhost:8000/callback` as a Redirect URI in the app settings
2. Create an `.env` file in the root of the project 
3. Go to [Musicmatch Api ](https://developer.musixmatch.com/) and  get an API key add the API KEY to `.env` file
4. Create a `now.json` file and add the following

# now.json settings
```
"builds": [{
    "src": "index.js",
    "use": "@now/node-server"
}]



"routes": [{
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept"
    },
    "src": "/.*",
    "dest": "/index.js"
}]
```

# Add Secrets to now.sh
```
now secret add VERSION $VERSION
```
## To see the list of secrets 
```Shell
now secrets list
```
