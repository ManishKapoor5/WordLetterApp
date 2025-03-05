<<<<<<< HEAD
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const generateGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents' 
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

const exchangeCodeForTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

module.exports = {
  generateGoogleAuthUrl,
  exchangeCodeForTokens
=======
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const generateGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents' 
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

const exchangeCodeForTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

module.exports = {
  generateGoogleAuthUrl,
  exchangeCodeForTokens
>>>>>>> 641ecc2db43fe231d536c1fd6b20f460ce9eb8e1
};