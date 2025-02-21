/**
 * Express server setup.
 * 
 * @file /Users/madushanka/dev/spinach/mastodon/sidecar/index.js
 */

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PORT = 3000;
const { publishMessage } = require('./redis/redis');

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
  const { spinachUserId } = req.body;
  const { email } = req.body;
  publishMessage(spinachUserId, email)
    .then(() => {
      res.status(200).send('Success');
    })
    .catch((error) => {
      res.status(500).send('Error');
    });
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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
