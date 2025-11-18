# 🎤 Web Voice Assistant

A modern, web-based voice assistant powered by OpenRouter API and Gemini 2.0 Flash Experimental. Speak naturally and get intelligent AI responses with voice output!

## ✨ Features

- 🎤 **Voice Input** - Natural speech recognition using Web Speech API
- 💬 **Real-time Chat** - Beautiful conversation interface
- 🔊 **Voice Output** - AI responses spoken back to you
- 🤖 **Powered by Gemini 2.0** - Advanced AI via OpenRouter
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚙️ **Secure Settings** - Safe API key management

## 🚀 Quick Start

### 1. Get Your API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key

### 2. Setup

#### Option A: Local Setup
```bash
# Clone or download this repository
git clone https://github.com/samul005/voice-assistant.git
cd voice-assistant

# Open index.html in your browser
# No build process needed!
```

#### Option B: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select "main" branch as source
4. Your site will be live at `https://yourusername.github.io/voice-assistant`

### 3. Configure

1. Open the application in your browser
2. Click the **Settings** (⚙️) button
3. Enter your OpenRouter API key
4. Click **Save**

## 🎯 How to Use

1. **Click the microphone button** 🎤 to start listening
2. **Speak your question** or command
3. The assistant will:
   - Transcribe your speech
   - Process it with AI
   - Display the response
   - Speak it back to you

### Tips
- Click the microphone again to stop listening
- Use the **Clear Chat** button to start a new conversation
- Adjust your device volume for voice output

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks needed
- **Web Speech API** - Voice recognition and synthesis
- **OpenRouter API** - AI model access

### API Configuration
```javascript
Base URL: https://openrouter.ai/api/v1
Model: google/gemini-2.0-flash-exp:free
Endpoint: /chat/completions
```

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Safari (macOS/iOS)
- ⚠️ Firefox (Limited speech recognition support)

## 🛡️ Security

### API Key Safety
⚠️ **IMPORTANT SECURITY NOTES:**

- Your API key is stored **locally** in your browser's localStorage
- It is **never** sent to any server except OpenRouter
- **Do not share** your API key publicly
- **Do not commit** API keys to version control
- If exposed, **revoke immediately** at [OpenRouter Keys](https://openrouter.ai/keys)

### Best Practices
- Use the `.env.example` file for local development
- Never hardcode API keys in source files
- Clear your browser data to remove stored keys
- Use different keys for different projects

## 📁 File Structure

```
voice-assistant/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── script.js           # Voice assistant logic
├── .env.example        # Environment variable template
├── .gitignore          # Prevents committing sensitive files
└── README.md           # This file
```

## 🔨 Development

### Local Development with Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API key:
```
OPENROUTER_API_KEY=your-actual-api-key-here
```

3. Use a local server to test:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

### Customization

#### Change AI Model
Edit `script.js`:
```javascript
const CONFIG = {
    model: 'google/gemini-2.0-flash-exp:free', // Change this
    // Other models: openai/gpt-3.5-turbo, anthropic/claude-2, etc.
};
```

#### Modify Voice Settings
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 1.0;    // Speed (0.1 to 10)
utterance.pitch = 1.0;   // Pitch (0 to 2)
utterance.volume = 1.0;  // Volume (0 to 1)
```

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions (click lock icon in address bar)
- Ensure microphone is connected and working
- Try using HTTPS (required for some browsers)

### No Voice Output
- Check device volume settings
- Ensure browser supports speech synthesis
- Try a different browser (Chrome recommended)

### API Errors
- Verify your API key is correct
- Check OpenRouter status at [status.openrouter.ai](https://status.openrouter.ai)
- Ensure you have credits/quota remaining
- Check browser console for detailed errors

### "Speech recognition not supported"
- Use Chrome or Edge browser
- Ensure you're on HTTPS (except localhost)
- Update your browser to the latest version

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Open an issue on GitHub

## 🙏 Acknowledgments

- OpenRouter for providing API access
- Google for Gemini 2.0 Flash Experimental
- Web Speech API community

---

**Made with ❤️ by samul005**

🌟 Star this repo if you find it helpful!