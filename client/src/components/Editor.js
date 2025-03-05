import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import axios from 'axios';
import 'quill/dist/quill.snow.css';
import './Editor.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});
  
  // References for our editor
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const contentToLoad = useRef(null);

  const showDraft = () => {
  try {
    // Retrieve the draft from local storage
    const draftString = localStorage.getItem('draft');
    
    if (draftString) {
      // Parse the draft JSON
      const draft = JSON.parse(draftString);
      
      // Create a modal or detailed view to show draft contents
      const draftDetailsModal = document.createElement('div');
      draftDetailsModal.className = 'draft-details-modal';
      draftDetailsModal.innerHTML = `
        <div class="draft-details-content">
          <h2>Saved Draft Details</h2>
          <div class="draft-title">
            <strong>Title:</strong> ${draft.title || 'No Title'}
          </div>
          <div class="draft-body">
            <strong>Content:</strong>
            <div class="draft-content-preview">
              ${draft.content || 'No content saved'}
            </div>
          </div>
          <div class="draft-actions">
            <button id="load-draft-btn">Load Draft</button>
            <button id="close-draft-modal">Close</button>
          </div>
        </div>
      `;

      // Append modal to body
      document.body.appendChild(draftDetailsModal);

      // Add event listeners
      const loadDraftBtn = draftDetailsModal.querySelector('#load-draft-btn');
      const closeDraftModal = draftDetailsModal.querySelector('#close-draft-modal');

      loadDraftBtn.addEventListener('click', () => {
        // Update title
        if (draft.title) {
          setTitle(draft.title);
        }
        
        // Update Quill editor content
        if (draft.content && quillInstance.current) {
          quillInstance.current.root.innerHTML = draft.content;
          quillInstance.current.update();
        }
        
        // Remove modal
        document.body.removeChild(draftDetailsModal);
      });

      closeDraftModal.addEventListener('click', () => {
        // Simply remove the modal
        document.body.removeChild(draftDetailsModal);
      });

      // Optional: Add some basic styling
      const styles = document.createElement('style');
      styles.textContent = `
        .draft-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .draft-details-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 80%;
          max-width: 500px;
          max-height: 70%;
          overflow-y: auto;
        }
        .draft-content-preview {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
          padding: 10px;
          margin-top: 10px;
        }
        .draft-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
      `;
      document.body.appendChild(styles);
    } else {
      // No draft found
      alert('No local draft found.');
    }
  } catch (error) {
    console.error('Error loading draft:', error);
    alert('Failed to load draft. Please try again.');
  }
};

  // Fetch letter data if we have an ID
  useEffect(() => {
    if (id) {
      const fetchLetter = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          
          console.log(`Fetching letter with ID: ${id}`);
          
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/letters/${id}`,
            {
              params: { accessToken }
            }
          );
          
          // Log the entire response for debugging
          console.log('API Response:', response.data);
          
          // Check actual content
          if (response.data.content) {
            console.log('Content from API (first 100 chars):', 
              response.data.content.substring(0, 100));
            console.log('Content length:', response.data.content.length);
          }
          
          // Store debugging info
          setDebug({
            apiResponse: response.data,
            hasContent: !!response.data.content,
            contentType: typeof response.data.content,
            contentLength: response.data.content ? response.data.content.length : 0
          });
          
          setTitle(response.data.title || '');
          
          // Store content in ref for immediate use when Quill is ready
          contentToLoad.current = response.data.content || '';
          
          // Also update the state
          setContent(response.data.content || '');
          
          console.log('Content loaded from API:', contentToLoad.current);
        } catch (err) {
          console.error('Error fetching letter:', err);
          setError('Failed to load the letter. Please try again later.');
          setDebug({ error: err.toString(), response: err.response?.data });
        } finally {
          setLoading(false);
        }
      };

      fetchLetter();
    }
  }, [id]);

  // Combined effect for Quill initialization and content loading
  useEffect(() => {
    console.log('Editor ref exists:', !!editorRef.current);
    console.log('Quill instance exists:', !!quillInstance.current);
    
    // Initialize Quill if not already done
    if (editorRef.current && !quillInstance.current) {
      console.log('Initializing Quill editor');
      
      const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['clean']
        ],
      };
      
      quillInstance.current = new Quill(editorRef.current, {
        modules,
        theme: 'snow',
        placeholder: 'Dear recipient...'
      });
      
      // Listen for content changes
      quillInstance.current.on('text-change', () => {
        // Get content directly from Quill and update state
        const editorContent = quillInstance.current.root.innerHTML;
        setContent(editorContent);
      });
    }
    
    // Set content if Quill is ready and we have content to load
    if (quillInstance.current && contentToLoad.current) {
      console.log('Setting content to Quill:', contentToLoad.current.substring(0, 100) + '...');
      
      // Use setTimeout to ensure DOM has settled
      setTimeout(() => {
        if (quillInstance.current) {
          // Set content and force a refresh
          quillInstance.current.root.innerHTML = contentToLoad.current;
          quillInstance.current.update();
          
          // Check what's in the editor after setting
          console.log('Content in editor after setting:', 
            quillInstance.current.root.innerHTML.substring(0, 100) + '...');
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
      }
    };
  }, [loading, contentToLoad.current]);

    // Save draft locally
  const saveDraft = () => {
    const currentContent = quillInstance.current
      ? quillInstance.current.root.innerHTML
      : content;
    const draft = { title, content: currentContent };
    localStorage.setItem('draft', JSON.stringify(draft));
    alert('Draft saved locally!');
  };
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your letter');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Get the latest content directly from Quill
      const currentContent = quillInstance.current ? 
        quillInstance.current.root.innerHTML : 
        content;
      
      const accessToken = localStorage.getItem('accessToken');
      
      // Log what we're sending to help debug
      console.log('Saving letter with:', {
        title,
        contentLength: currentContent.length,
        contentPreview: currentContent.substring(0, 100) + '...',
        // Don't log the actual token
        hasAccessToken: !!accessToken
      });
      
      // If this is an edit, we should use PUT instead of POST
      const url = id 
        ? `${process.env.REACT_APP_API_URL}/api/letters/${id}`
        : `${process.env.REACT_APP_API_URL}/api/letters`;
      
      const method = id ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: {
          title,
          content: currentContent,
          accessToken
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Save response:', response.data);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Error saving letter:', err);
      
      // More detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with:', err.response.status, err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
      }
      
      setError('Failed to save your letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Add a toggle for debugging panel
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  
  if (loading) {
    return <div className="loading">Loading your letter...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          type="text"
          className="title-input"
          placeholder="Letter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editor-actions">
          <button onClick={() => navigate('/')} className="cancel-btn">
            Cancel
          </button>
          <button onClick={showDraft} className="save-btn">
             Show Draft
          </button>
          <button onClick={saveDraft} className="save-btn">
             Save Draft
           </button>
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save to Drive'}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      
      

      <div className="editor-content">
        <div className="quill-container">
          <div ref={editorRef} />
        </div>
      </div>
    </div>
  );
};

export default Editor;