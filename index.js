//require dot files
require('dotenv').config()

const express = require('express')
const request = require('request')
const querystring = require('querystring')
const cors = require('cors')
const app = express()

//global variable
const CLIENT_ID = process.env.CLIENT_ID
const CLINET_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/callback'
    : process.env.redirect_url
const SCOPES = 'user-read-currently-playing user-read-recently-played'
const PORT = process.env.PORT || 8000
const FRONTEND_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.FRONTEND_URI

//middleware
app.use(cors()) //Access for the frontend

//get request for /login route
app.get('/login', function (req, res) {
  res.redirect(
    'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      CLIENT_ID +
      (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
      '&redirect_uri=' +
      encodeURIComponent(REDIRECT_URI)
  )
})

//handle the redirect route which gives the code to get access token and refresh token

app.get('/callback', (req, res) => {
  const code = req.query.code || null
  console.log(code)
  if (code !== null) {
    const base64Code = new Buffer.from(
      `${CLIENT_ID}:${CLINET_SECRET}`
    ).toString('base64')
    console.log('base64:', base64Code)

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${base64Code}`,
      },
      json: true,
    }
    //request for access token
    request.post(authOptions, function (error, response, body) {
      console.log(error, response.statusCode)
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token
        const refresh_token = body.refresh_token

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          `${FRONTEND_URI}/lyrics#${querystring.stringify({
            access_token,
            refresh_token,
          })}`
        )
      } else {
        res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`)
      }
    })
  }
})

//get the refresh token
app.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  console.log('FROM :/refresh_token')
  console.log(req.query.refresh_token)
  const refresh_token = req.query.refresh_token
  console.log(refresh_token, process.env.CLIENT_SECRET)
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${new Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({ access_token })
    }
  })
})

//get for every Route
app.get('/', (req, res) => {
  res.json({ msg: 'This is the testing route 🧪🧪' })
})

//Stuffs for FrontEnd

//handle the get track route
app.get('/track/:trackId', (req, res) => {
  //musixmatch URL
  const name = req.params.trackId
  const url = `https://api.musixmatch.com/ws/1.1/track.search?q_track=${name}&apikey=${process.env.API_KEY}&page_size=3&page=1&s_track_rating=desc`
  request.get(url, (err, resp, body) => {
    if (resp.statusCode === 200) {
      res.send(body)
    }
  })
})

//Handle Route for lyrics

app.get('/lyrics/:lyricsId', (req, res) => {
  const id = req.params.lyricsId
  const url = `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.API_KEY}`
  request(url, (err, resp, body) => {
    if (resp.statusCode === 200) {
      res.send(body)
    }
  })
})

//listen for the port

app.listen(PORT, () => {
  console.log('Listening to PORT:', PORT)
})

// method: 'POST',
// url: 'https://accounts.spotify.com/api/token',
// body: {
//   grant_type: 'authorization_code',
//   code: code,
//   redirect_uri: REDIRECT_URI
