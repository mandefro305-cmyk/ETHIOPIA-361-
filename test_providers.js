const axios = require('axios');

async function testChat() {
  try {
    console.log("Testing Groq...");
    const responseGroq = await axios.post('http://localhost:3000/api/chat', {
      message: 'Hello Groq!',
      language: 'en-US',
      provider: 'groq'
    });
    console.log('Groq Success! Response:', responseGroq.data.response);

    console.log("\nTesting OpenRouter...");
    const responseOR = await axios.post('http://localhost:3000/api/chat', {
      message: 'Hello OpenRouter!',
      language: 'en-US',
      provider: 'openrouter'
    });
    console.log('OpenRouter Success! Response:', responseOR.data.response);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testChat();
