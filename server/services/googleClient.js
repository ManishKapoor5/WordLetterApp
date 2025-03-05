<<<<<<< HEAD
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// Function to create/authenticate Drive API
const getDriveClient = (accessToken) => {
  const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
};

// Function to create/authenticate Docs API
const getDocsClient = (accessToken) => {
  const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  auth.setCredentials({ access_token: accessToken });
  return google.docs({ version: 'v1', auth });
};

module.exports = {
  getDriveClient,
  getDocsClient
=======
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// Function to create/authenticate Drive API
const getDriveClient = (accessToken) => {
  const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
};

// Function to create/authenticate Docs API
const getDocsClient = (accessToken) => {
  const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  auth.setCredentials({ access_token: accessToken });
  return google.docs({ version: 'v1', auth });
};

module.exports = {
  getDriveClient,
  getDocsClient
>>>>>>> 641ecc2db43fe231d536c1fd6b20f460ce9eb8e1
};