# AI Chat System for Ethiopia Tourism Website

This document explains how to set up and use the AI chat system that answers user questions about Ethiopia tourism places.

## Features

- **AI-powered chat**: Uses Google Gemini API (free) to answer questions about Ethiopia tourism
- **Context-aware**: Incorporates database information about tourist places
- **Fallback system**: Works even when AI API is unavailable
- **Responsive design**: Mobile-friendly chat widget
- **Real-time typing indicators**: Shows when AI is thinking

## Setup

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Get Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your free API key

### 3. Set up Gemini API Key
Create a `.env` file in the project root:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Start the Server
```bash
node server.js
```

## How It Works

### Backend (`/api/chat` endpoint)
1. Receives user messages from frontend
2. Fetches tourism data from database for context
3. Sends prompt to Google Gemini API with Ethiopia tourism context
4. Returns AI response to frontend
5. Falls back to database information if API fails

### Frontend (AI Chat Widget)
1. Floating chat widget in bottom-right corner
2. Minimizable interface
3. Real-time message sending and receiving
4. Typing indicators
5. Responsive design for mobile devices

## Files Added/Modified

### New Files
- `public/css/ai-chat.css` - Chat widget styles
- `public/js/ai-chat.js` - Chat widget JavaScript
- `AI_CHAT_SETUP.md` - This documentation file

### Modified Files
- `server.js` - Added AI chat endpoint with Gemini API
- `views/index.ejs` - Added chat widget includes
- `views/place.ejs` - Added chat widget includes

## Usage

1. The chat widget appears as a small box in the bottom-right corner
2. Click to expand and ask questions about Ethiopia tourism
3. The AI will provide helpful information based on:
   - Database content about tourist places
   - General knowledge about Ethiopia tourism
4. Works on all main pages (home, place details, etc.)

## Example Questions Users Can Ask

- "What are the best places to visit in Ethiopia?"
- "Tell me about Lalibela churches"
- "What's the best time to visit Simien Mountains?"
- "How do I get to Entoto Park?"
- "What cultural sites should I visit in Ethiopia?"

## Customization

### Changing the AI Model
Edit the model in the Gemini API call in `server.js`:
```javascript
// Change from gemini-pro to other available models
models/gemini-pro:generateContent
```

### Modifying the System Prompt
Change the system message in the API call to customize AI behavior:
```javascript
text: `Your custom system prompt here... ${prompt}`
```

### Styling the Widget
Modify `public/css/ai-chat.css` to change colors, sizes, and appearance.

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid
- Check that the `.env` file is properly configured
- Verify you have sufficient quota (Gemini has generous free limits)

### Chat Not Appearing
- Verify CSS and JS files are correctly linked
- Check browser console for JavaScript errors
- Ensure the server is running and serving static files

### Slow Responses
- Gemini API is generally fast and reliable
- Check internet connection and API response times

## Security Notes

- The API key should be kept secure and not exposed in client-side code
- Consider implementing rate limiting for the chat endpoint
- Validate and sanitize user inputs properly

## Why Gemini API?

- **Free**: Google Gemini offers generous free quotas
- **Reliable**: Fast response times and good uptime
- **Capable**: Excellent for tourism and travel-related questions
- **Easy Setup**: Simple API key generation process

## Future Enhancements

- Add chat history storage
- Implement multi-language support for the chat
- Add voice input/output capabilities
- Include more Ethiopia tourism data sources
- Add chat analytics and usage tracking
