// AI Chat Widget JavaScript with Voice Recognition
class AIChatWidget {
    constructor() {
        this.isMinimized = true; // Start minimized by default
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

    clearImageSelection() {
        this.selectedImageBase64 = null;
        const chatUploadBtn = document.getElementById('chatUploadBtn');
        const chatImageUpload = document.getElementById('chatImageUpload');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewImg = document.getElementById('imagePreview');

        if (chatUploadBtn) {
            chatUploadBtn.style.background = '';
            chatUploadBtn.title = 'Upload Image';
            chatUploadBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i>';
        }
        if (chatImageUpload) {
            chatImageUpload.value = '';
        }
        if (previewContainer && previewImg) {
            previewContainer.style.display = 'none';
            previewImg.src = '';
        }
    }

    createChatWidget() {
        // Create chat widget HTML
        const chatHTML = `
            <div class="ai-fab" id="aiFab" onclick="aiChat.toggleChat()" style="display: flex;">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="ai-chat-widget minimized" id="aiChatWidget">
                <div class="chat-header" onclick="aiChat.toggleChat()">
                    <h3>🇪🇹 Ethiopia Tourism AI</h3>
                    <div class="header-controls">
                        <select class="lang-selector" id="aiProviderSelector" onclick="event.stopPropagation();">
                            <option value="groq">Groq</option>
                            <option value="openrouter">OpenRouter</option>
                        </select>
                        <select class="lang-selector" id="langSelector" onchange="aiChat.changeLanguage(this.value)" onclick="event.stopPropagation();">
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
                    <div id="imagePreviewContainer" style="display: none;">
                        <img id="imagePreview" src="" alt="Preview">
                        <button id="removeImageBtn"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="input-row">
                        <textarea
                            class="chat-input"
                            id="chatInput"
                            placeholder="Ask about Ethiopia..."
                            maxlength="500"
                            rows="1"
                        ></textarea>
                    </div>
                    <div class="action-row">
                        <input type="file" id="chatImageUpload" accept="image/*" style="display: none">
                        <button class="action-btn chat-upload" id="chatUploadBtn" title="Upload Image"><i class="fa-solid fa-paperclip"></i></button>
                        <button class="action-btn chat-mic" id="chatMic" title="Click to speak"><i class="fa-solid fa-microphone"></i></button>
                        <button class="action-btn chat-send" id="chatSend"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
            <!-- Image Modal -->
            <div id="chatImageModal" class="chat-image-modal">
                <button class="chat-image-modal-close" onclick="document.getElementById('chatImageModal').classList.remove('show')">&times;</button>
                <img class="chat-image-modal-content" id="chatImageModalImg">
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatMic = document.getElementById('chatMic');
        const chatUploadBtn = document.getElementById('chatUploadBtn');
        const chatImageUpload = document.getElementById('chatImageUpload');
        const removeImageBtn = document.getElementById('removeImageBtn');

        this.selectedImageBase64 = null;

        // Auto-resize textarea
        if (chatInput) {
            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });

            // Handle enter key to send (Shift+Enter for new line)
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Modal background click to close
        const modal = document.getElementById('chatImageModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }

        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                this.clearImageSelection();
            });
        }

        // Image upload handling

        // Image upload handling
// Image upload handling
        if (chatUploadBtn && chatImageUpload) {
            chatUploadBtn.addEventListener('click', () => {
                chatImageUpload.click();
            });

            chatImageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.selectedImageBase64 = event.target.result;
                        chatUploadBtn.style.background = '#28a745';
                        chatUploadBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Green to indicate success
                        chatUploadBtn.title = 'Image attached: ' + file.name;

                        const previewContainer = document.getElementById('imagePreviewContainer');
                        const previewImg = document.getElementById('imagePreview');
                        if (previewContainer && previewImg) {
                            previewImg.src = this.selectedImageBase64;
                            previewContainer.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });

            const removeImageBtn = document.getElementById('removeImageBtn');
            if (removeImageBtn) {
                removeImageBtn.addEventListener('click', () => {
                    this.clearImageSelection();
                });
            }
        }

        // Send message on button click
        chatSend.addEventListener('click', () => {
            this.lastInputWasVoice = false;
            this.sendMessage();
        });

        // Voice recording on microphone click
        chatMic.addEventListener('click', () => this.toggleVoiceRecording());

        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.lastInputWasVoice = false;
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
                this.lastInputWasVoice = true;
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
            // Update UI to show we are listening *before* requesting permissions
            // to provide immediate feedback to the user, particularly on mobile
            // where the permission popup might block the main thread.
            const micButton = document.getElementById('chatMic');
            if (micButton) {
                micButton.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
                micButton.style.background = '#ffc107';
            }

            // Request microphone permission first to handle mobile browser requirements
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    // Release the manual stream, we just needed to prompt for permission
                    stream.getTracks().forEach(track => track.stop());

                    try {
                        this.recognition.start();
                    } catch (e) {
                        // Handle case where recognition is already started
                        if (e.name === 'InvalidStateError') {
                            console.warn('Recognition already started');
                        } else {
                            throw e;
                        }
                    }
                })
                .catch((error) => {
                    console.error('Microphone permission denied:', error);
                    this.stopRecording();
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
            micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
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
        const fab = document.getElementById('aiFab');
        
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            widget.classList.add('minimized');
            fab.style.display = 'flex';
        } else {
            widget.classList.remove('minimized');
            fab.style.display = 'none';
            // Focus input when opening
            document.getElementById('chatInput').focus();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        const hasImage = this.selectedImageBase64 !== null;
        
        if (!message && !hasImage) return;

        // Add user message to chat
        this.addMessage(message, 'user', this.selectedImageBase64);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Disable send button
        const sendButton = document.getElementById('chatSend');
        sendButton.disabled = true;
        sendButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

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
            const providerSelector = document.getElementById('aiProviderSelector');
            const provider = providerSelector ? providerSelector.value : 'groq';

            const payload = {
                message: message,
                language: this.currentLang,
                history: this.conversationHistory.slice(0, -1), // Send all previous messages except current
                provider: provider
            };

            if (this.selectedImageBase64) {
                payload.image = this.selectedImageBase64;
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Clear selected image
            this.clearImageSelection();

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
            
            // Speak the response only if the user used voice input
            if (this.lastInputWasVoice) {
                this.speakResponse(data.response);
            }
            
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
            sendButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        }
    }

    addMessage(text, sender, imageUrl = null) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        if (imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.style.maxWidth = '100%';
            imgElement.style.maxHeight = '150px'; // Keep inline small
            imgElement.style.borderRadius = '8px';
            imgElement.style.marginBottom = '8px';
            imgElement.style.display = 'block';
            imgElement.style.objectFit = 'cover';

            // Add click event for modal
            imgElement.onclick = function() {
                const modal = document.getElementById('chatImageModal');
                const modalImg = document.getElementById('chatImageModalImg');
                if (modal && modalImg) {
                    modalImg.src = this.src;
                    modal.classList.add('show');
                }
            };

            messageDiv.appendChild(imgElement);
        }
if (text) {
            const textElement = document.createElement('span');
            textElement.textContent = text;
            messageDiv.appendChild(textElement);
        }
        
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
