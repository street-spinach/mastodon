/**
 * Express server setup.
 * 
 * @file /Users/madushanka/dev/spinach/mastodon/sidecar/index.js
 */

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PORT = 3010;

require('dotenv').config({ path: '../.env.development' });
const { publishMessage } = require('./redis/redis');
const {executeScript} = require('./bash/bash');

/**
 * POST /sidecar_proxy/add_spinach_user
 * Endpoint to add a spinach user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.spinachUserId - The ID of the spinach user to add.
 * @param {string} req.body.email - The email of the spinach user to add.
 * @param {Object} res - The response object.
 * 
 * @returns {void}
 */
app.post('/sidecar_proxy/add_spinach_user', (req, res) => {
  console.log(req.body);  
  const { spinachUserId, email } = req.body;

  if (!spinachUserId || !email) {
    return res.status(400).json({ error: "spinachUserId and email are required." });
  }

  const pass = 'defaultPassword'; // Replace with actual logic to get the password

  try {
    executeScript(spinachUserId, email, pass);
    res.status(202).send('Accepted');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
  

  // publishMessage(spinachUserId, email)
  //   .then(() => {
  //     res.status(200).send('Success');
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ error: error.message });
  //   });


});

/**
* POST /sidecar_proxy/auth_exchange
* Endpoint to exchange an auth code for an access token.
*
* @param {Object} req - The request object.
* @param {Object} req.body - The body of the request.
* @param {string} req.body.code - The auth code to exchange.
* @param {Object} res - The response object.
* 
* @returns {void}
*/
app.post('/sidecar_proxy/auth_exchange', (req, res) => {

});

/**
 * Starts the Express server.
 * 
 * @returns {void}
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
