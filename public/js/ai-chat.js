// AI Chat Widget JavaScript with Voice Recognition
class AIChatWidget {
    constructor() {
        this.isMinimized = false;
        this.isRecording = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentLang = 'en-US'; // Default to English
        this.conversationHistory = []; // Store conversation context
        this.maxHistoryLength = 10; // Keep last 10 messages for context
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.initVoiceRecognition();
    }

    createChatWidget() {
        // Create chat widget HTML
        const chatHTML = `
            <div class="ai-chat-widget minimized" id="aiChatWidget">
                <div class="chat-header" onclick="aiChat.toggleChat()">
                    <h3>🇪🇹 Ethiopia Tourism AI</h3>
                    <div class="header-controls">
                        <select class="lang-selector" id="langSelector" onchange="aiChat.changeLanguage(this.value)">
                            <option value="en-US">🇬🇧 EN</option>
                            <option value="am-ET">🇪🇹 አማ</option>
                        </select>
                        <button class="chat-toggle" id="chatToggle">−</button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message ai">
                        Hello! I'm your Ethiopia tourism assistant. Ask me anything about Ethiopian tourist destinations, culture, travel tips, and more! 🌍
                    </div>
                </div>
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        class="chat-input" 
                        id="chatInput" 
                        placeholder="Ask about Ethiopia tourism... (Click 🎤 to speak)"
                        maxlength="500"
                    >
                    <button class="chat-mic" id="chatMic" title="Click to speak">🎤</button>
                    <button class="chat-send" id="chatSend">Send</button>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatMic = document.getElementById('chatMic');

        // Send message on button click
        chatSend.addEventListener('click', () => this.sendMessage());

        // Voice recording on microphone click
        chatMic.addEventListener('click', () => this.toggleVoiceRecording());

        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLang;

            this.recognition.onstart = () => {
                this.isRecording = true;
                document.getElementById('chatMic').textContent = '🔴';
                document.getElementById('chatMic').style.background = '#ff4444';
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopRecording();
                
                let errorMessage = 'Sorry, I couldn\'t hear you. Please try again.';
                
                switch(event.error) {
                    case 'not-allowed':
                        errorMessage = '🎤 Microphone permission denied. Please allow microphone access in your browser settings.';
                        setTimeout(() => {
                            this.addMessage('💡 Fix steps:\n1. Click the 🔒 or 🌐 icon in your address bar\n2. Set "Microphone" to "Allow"\n3. Refresh this page\n4. Try the microphone again', 'ai');
                        }, 1000);
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please speak clearly and try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not available. Please check your microphone settings.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                        break;
                    default:
                        errorMessage = `Voice recognition error: ${event.error}. Please try again.`;
                }
                
                this.addMessage(errorMessage, 'ai');
            };

            this.recognition.onend = () => {
                this.stopRecording();
            };
        } else {
            console.warn('Speech recognition not supported');
            document.getElementById('chatMic').style.display = 'none';
        }
    }

    changeLanguage(lang) {
        this.currentLang = lang;
        if (this.recognition) {
            this.recognition.lang = lang;
        }
        
        // Update placeholder text based on language
        const input = document.getElementById('chatInput');
        if (lang === 'am-ET') {
            input.placeholder = 'ስለ ቱሪዝም ኢትዮጵያ ጥያቄዎትን ያስገቡ... (🎤 ለመናገር ይጫኑ)';
        } else {
            input.placeholder = 'Ask about Ethiopia tourism... (Click 🎤 to speak)';
        }
    }

    toggleVoiceRecording() {
        if (!this.recognition) {
            this.addMessage('Voice recognition is not supported in your browser.', 'ai');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            // Request microphone permission first
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    this.recognition.start();
                })
                .catch((error) => {
                    console.error('Microphone permission denied:', error);
                    this.addMessage('🎤 Microphone access is required for voice input. Please allow microphone access in your browser settings and try again.', 'ai');
                    
                    // Show helpful instructions
                    setTimeout(() => {
                        this.addMessage('💡 To enable microphone:\n1. Click the lock/icon in your address bar\n2. Allow microphone access\n3. Refresh the page and try again', 'ai');
                    }, 1000);
                });
        }
    }

    stopRecording() {
        this.isRecording = false;
        const micButton = document.getElementById('chatMic');
        if (micButton) {
            micButton.textContent = '🎤';
            micButton.style.background = '#007bff';
        }
    }

    speakResponse(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a female voice if available
            const voices = this.synthesis.getVoices();
            const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female'));
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    toggleChat() {
        const widget = document.getElementById('aiChatWidget');
        const toggle = document.getElementById('chatToggle');
        
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            widget.classList.add('minimized');
            toggle.textContent = '+';
        } else {
            widget.classList.remove('minimized');
            toggle.textContent = '−';
            // Focus input when opening
            document.getElementById('chatInput').focus();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        
        // Disable send button
        const sendButton = document.getElementById('chatSend');
        sendButton.disabled = true;
        sendButton.textContent = '...';

        // Show typing indicator
        this.showTypingIndicator();

        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Keep only recent messages
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    language: this.currentLang,
                    history: this.conversationHistory.slice(0, -1) // Send all previous messages except current
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(data.response, 'ai');
            
            // Add AI response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            });
            
            // Speak the response
            this.speakResponse(data.response);
            
        } catch (error) {
            console.error('Chat error:', error);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage(
                'Sorry, I encountered an error. Please try again later.',
                'ai'
            );
        } finally {
            // Re-enable send button
            sendButton.disabled = false;
            sendButton.textContent = 'Send';
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator show';
        typingDiv.id = 'typingIndicator';
        typingDiv.textContent = 'AI is thinking...';
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChatWidget();
});
