# spotify-server

## An example for using Spotify API with node js

# Installation
`npm install`
> To install the dependencies

`npm start`
> To start the Server

## Setup

1. [Register a Spotify App](https://developer.spotify.com/dashboard/applications) and add `http://localhost:8000/callback` as a Redirect URI in the app settings
2. Create an `.env` file in the root of the project based on `.env.example`
3. [Musicmatch Api ](https://developer.musixmatch.com/) and add the API KEY to `.env` file
4. Create a `now.json` file and add the following
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


