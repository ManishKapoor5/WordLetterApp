<<<<<<< HEAD
const express = require('express');
const { getDriveClient, getDocsClient } = require('../services/googleClients');

const router = express.Router();

// Create a new letter and save to Google Drive
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

=======
const express = require('express');
const { getDriveClient, getDocsClient } = require('../services/googleClients');

const router = express.Router();

// Create a new letter and save to Google Drive
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

>>>>>>> 641ecc2db43fe231d536c1fd6b20f460ce9eb8e1
module.exports = router;