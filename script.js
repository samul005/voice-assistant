// ========================================
// Configuration
// ========================================
const CONFIG = {
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.0-flash-exp:free',
    apiKey: localStorage.getItem('openrouter_api_key') || '',
    endpoint: '/chat/completions'
};

// ========================================
// State Management
// ========================================
const state = {
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    conversationHistory: [],
    recognition: null,
    synthesis: window.speechSynthesis
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    micButton: document.getElementById('micButton'),
    clearBtn: document.getElementById('clearBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    chatMessages: document.getElementById('chatMessages'),
    statusText: document.getElementById('statusText'),
    statusIndicator: document.getElementById('statusIndicator')
};

// ========================================
// Initialize Speech Recognition
// ========================================
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
        return false;
    }

    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.lang = 'en-US';

    state.recognition.onstart = () => {
        state.isListening = true;
        updateStatus('Listening...', 'listening');
        elements.micButton.classList.add('listening');
    };

    state.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, 'user');
        processUserInput(transcript);
    };

    state.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
            showError('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
            showError('Microphone access denied. Please enable microphone permissions.');
        } else {
            showError(`Speech recognition error: ${event.error}`);
        }
        resetMicButton();
    };

    state.recognition.onend = () => {
        resetMicButton();
    };

    return true;
}

// ========================================
// API Functions
// ========================================
async function callOpenRouterAPI(userMessage) {
    if (!CONFIG.apiKey) {
        showError('Please configure your OpenRouter API key in settings.');
        return null;
    }

    updateStatus('Processing...', 'processing');

    // Add user message to conversation history
    state.conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    const requestBody = {
        model: CONFIG.model,
        messages: state.conversationHistory
    };

    try {
        const response = await fetch(`${CONFIG.baseURL}${CONFIG.endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Voice Assistant'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0]?.message?.content;

        if (!assistantMessage) {
            throw new Error('No response from AI');
        }

        // Add assistant response to conversation history
        state.conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;

    } catch (error) {
        console.error('API Error:', error);
        showError(`API Error: ${error.message}`);
        return null;
    }
}

// ========================================
// Message Processing
// ========================================
async function processUserInput(userMessage) {
    const response = await callOpenRouterAPI(userMessage);
    
    if (response) {
        addMessage(response, 'assistant');
        speakText(response);
    } else {
        updateStatus('Ready to listen', '');
    }
}

// ========================================
// Text-to-Speech
// ========================================
function speakText(text) {
    if (!state.synthesis) {
        console.error('Speech synthesis not supported');
        updateStatus('Ready to listen', '');
        return;
    }

    // Cancel any ongoing speech
    state.synthesis.cancel();

    updateStatus('Speaking...', 'speaking');
    state.isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
        state.isSpeaking = false;
        updateStatus('Ready to listen', '');
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        state.isSpeaking = false;
        updateStatus('Ready to listen', '');
    };

    state.synthesis.speak(utterance);
}

// ========================================
// UI Functions
// ========================================
function addMessage(text, sender) {
    // Remove welcome message if it exists
    const welcomeMessage = elements.chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = sender === 'user' ? 'You' : 'Assistant';
    
    const content = document.createElement('div');
    content.textContent = text;
    
    messageDiv.appendChild(label);
    messageDiv.appendChild(content);
    elements.chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function updateStatus(text, indicator) {
    elements.statusText.textContent = text;
    elements.statusIndicator.className = `status-indicator ${indicator}`;
}

function resetMicButton() {
    state.isListening = false;
    elements.micButton.classList.remove('listening');
    if (!state.isProcessing && !state.isSpeaking) {
        updateStatus('Ready to listen', '');
    }
}

function showError(message) {
    addMessage(message, 'assistant');
    updateStatus('Error occurred', '');
}

function clearChat() {
    state.conversationHistory = [];
    elements.chatMessages.innerHTML = `
        <div class="welcome-message">
            <h2>👋 Welcome!</h2>
            <p>Click the microphone button and start speaking.</p>
            <p class="small-text">Don't forget to configure your API key in settings!</p>
        </div>
    `;
    updateStatus('Ready to listen', '');
}

// ========================================
// Settings Functions
// ========================================
function openSettings() {
    elements.settingsPanel.classList.remove('hidden');
    elements.apiKeyInput.value = CONFIG.apiKey;
}

function closeSettings() {
    elements.settingsPanel.classList.add('hidden');
}

function saveSettings() {
    const apiKey = elements.apiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('Please enter an API key');
        return;
    }

    if (!apiKey.startsWith('sk-or-v1-')) {
        alert('Invalid API key format. OpenRouter keys should start with "sk-or-v1-"');
        return;
    }

    CONFIG.apiKey = apiKey;
    localStorage.setItem('openrouter_api_key', apiKey);
    
    closeSettings();
    addMessage('API key saved successfully! You can now use the voice assistant.', 'assistant');
}

// ========================================
// Event Listeners
// ========================================
elements.micButton.addEventListener('click', () => {
    if (!state.recognition) {
        showError('Speech recognition not initialized. Please refresh the page.');
        return;
    }

    if (state.isListening) {
        state.recognition.stop();
    } else {
        if (state.isSpeaking) {
            state.synthesis.cancel();
            state.isSpeaking = false;
        }
        try {
            state.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            showError('Failed to start voice recognition. Please try again.');
        }
    }
});

elements.clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
        clearChat();
    }
});

elements.settingsBtn.addEventListener('click', openSettings);
elements.closeSettingsBtn.addEventListener('click', closeSettings);
elements.saveSettingsBtn.addEventListener('click', saveSettings);

// Close settings panel when clicking outside
elements.settingsPanel.addEventListener('click', (e) => {
    if (e.target === elements.settingsPanel) {
        closeSettings();
    }
});

// Handle Enter key in API key input
elements.apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveSettings();
    }
});

// ========================================
// Initialization
// ========================================
function initialize() {
    console.log('🎤 Voice Assistant Initializing...');
    
    // Check for API key
    if (!CONFIG.apiKey) {
        addMessage('Welcome! Please configure your OpenRouter API key in settings to get started.', 'assistant');
    }

    // Initialize speech recognition
    const speechInitialized = initializeSpeechRecognition();
    
    if (speechInitialized) {
        console.log('✅ Speech recognition initialized');
    } else {
        console.error('❌ Speech recognition failed to initialize');
    }

    // Check for speech synthesis
    if (!state.synthesis) {
        console.warn('⚠️ Speech synthesis not supported');
        addMessage('Note: Voice output is not supported in your browser.', 'assistant');
    } else {
        console.log('✅ Speech synthesis available');
    }

    console.log('🚀 Voice Assistant Ready!');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.isListening) {
        state.recognition.stop();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (state.recognition && state.isListening) {
        state.recognition.stop();
    }
    if (state.synthesis) {
        state.synthesis.cancel();
    }
});