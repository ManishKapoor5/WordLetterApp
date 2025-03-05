require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://wordletterapp.netlify.app',
    'https://word-letter-app.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(helmet());

// Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

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

// Route to get Google OAuth URL
app.get('/api/auth/google/url', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents' 
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url });
});

// Google OAuth callback route
app.get('/api/auth/callback/google', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.redirect(
      `${process.env.CLIENT_URL}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`
    );
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Create a new letter and save to Google Drive
app.post('/api/letters', async (req, res) => {
  const { content, title, accessToken } = req.body;
  if (!content || !title || !accessToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const docs = getDocsClient(accessToken);

    // Create Google Doc
    const docResponse = await docs.documents.create({ requestBody: { title } });
    const documentId = docResponse.data.documentId;

    // Update document with content
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [{ insertText: { location: { index: 1 }, text: content } }]
      }
    });

    res.status(201).json({
      message: 'Letter saved successfully',
      documentId,
      documentUrl: `https://docs.google.com/document/d/${documentId}/edit`
    });
  } catch (error) {
    console.error('Error saving letter:', error);
    res.status(500).json({ error: 'Failed to save letter to Google Drive' });
  }
});

// Update an existing letter
app.put('/api/letters/:id', async (req, res) => {
  const documentId = req.params.id;
  const { content, accessToken } = req.body;

  if (!documentId || !content || !accessToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const docs = getDocsClient(accessToken);
    const document = await docs.documents.get({ documentId });

    // Create a new update request with safer content replacement
    const requests = [
      {
        deleteContentRange: {
          range: {
            // Start from the first paragraph's content
            startIndex: 1,
            // Find the end index by checking document content
            endIndex: document.data.body.content[document.data.body.content.length - 1].endIndex - 1
          }
        }
      },
      {
        insertText: {
          location: { index: 1 },
          text: content
        }
      }
    ];

    // Perform batch update
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests }
    });

    res.status(200).json({ message: 'Letter updated successfully' });
  } catch (error) {
    console.error('Error updating letter:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Detailed error:', error.response.data);
    }
    
    res.status(500).json({ 
      error: 'Failed to update letter', 
      details: error.message 
    });
  }
});

// Get list of saved letters
app.get('/api/letters', async (req, res) => {
  const { accessToken } = req.query;
  if (!accessToken) return res.status(400).json({ error: 'Access token is required' });

  try {
    const drive = getDriveClient(accessToken);
    const fileResponse = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document' and trashed=false",
      fields: 'files(id, name, webViewLink, createdTime)'
    });

    res.json({ letters: fileResponse.data.files });
  } catch (error) {
    console.error('Error fetching letters:', error);
    res.status(500).json({ error: 'Failed to fetch letters from Google Drive' });
  }
});

// Get a single letter for editing
app.get('/api/letters/:id', async (req, res) => {
  const { id } = req.params;
  const { accessToken } = req.query;
  if (!accessToken) return res.status(400).json({ error: 'Access token is required' });

  try {
    const docs = getDocsClient(accessToken);
    const document = await docs.documents.get({ documentId: id });

    let content = '';
    document.data.body?.content?.forEach(item => {
      item.paragraph?.elements?.forEach(element => {
        if (element.textRun) content += element.textRun.content;
      });
    });

    res.json({ id: document.data.documentId, title: document.data.title, content });
  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Failed to fetch letter from Google Drive' });
  }
});

app.get('/', (req, res) => {
  res.send({
    activeStatus:true,
    error:false
  }
  )});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
