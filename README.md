# Legal Document Risk Analyzer

A full-stack application that analyzes legal documents for potential risks using AI and provides an interactive chat interface for document assistance.

## 🏗️ Architecture

- **Frontend**: React.js with Vite
- **Backend**: Flask (Python)
- **AI Models**: 
  - Gemini 2.5 Pro for chat assistance
  - BART for risk classification
  - spaCy for NLP processing

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Gemini API key

### 1. Backend Setup

```bash
# Install Python dependencies
python -m pip install -r backend/requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Set up environment variables
# Create backend/.env file with:
echo "api_key=your_gemini_api_key_here" > backend/.env

# Start backend server
python start_backend.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Install dependencies and start dev server
npm install
npm run dev
```

Or use the provided scripts:
- Windows: `start_frontend.bat`
- Linux/Mac: `bash start_frontend.sh`

The frontend will run on `http://localhost:5173`

## 🔧 API Endpoints

### POST /upload
Upload a PDF document for analysis
- **Input**: FormData with PDF file
- **Output**: `{doc_id, risks: [...], num_sentences, message}`

### POST /ask
Ask questions about the uploaded document
- **Input**: `{question, doc_id}`
- **Output**: AI-generated answer (string)

### POST /analyze
Analyze document for risks (alternative endpoint)
- **Input**: `{doc_id}`
- **Output**: `{analysis: [...]}`

## 📁 Project Structure

```
genai-hack/
├── backend/
│   ├── Routes.py              # Flask API routes
│   ├── chatbot.py            # Gemini AI integration
│   ├── Risk_Analysis_model.py # Risk detection logic
│   ├── uploaded_docs/        # PDF storage
│   └── requirements.txt      # Python dependencies
├── frontend/legal-frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application
│   │   └── components/
│   │       ├── UploadPDF.jsx # File upload component
│   │       ├── RiskList.jsx  # Risk display component
│   │       ├── ChatBox.jsx   # Chat interface
│   │       └── DocumentViewer.jsx # PDF viewer
│   └── package.json
├── start_backend.py          # Backend startup script
├── start_frontend.bat        # Windows frontend script
├── start_frontend.sh         # Linux/Mac frontend script
└── README.md
```

## 🎯 Features

- **PDF Upload**: Drag & drop or click to upload PDF documents
- **Risk Analysis**: Automatic detection of legal risks and red flags
- **Document Viewer**: In-browser PDF preview with risk highlighting
- **AI Chat**: Ask questions about your document with context-aware responses
- **Risk List**: Detailed view of identified risks with explanations

## 🔍 Risk Detection

The system identifies various legal risks including:
- Automatic renewal clauses
- Late payment fees
- Limitation of liability
- Warranty disclaimers
- Termination restrictions
- And more...

## 🛠️ Development

### Backend Development
```bash
cd backend
python Routes.py
```

### Frontend Development
```bash
cd frontend/legal-frontend
npm run dev
```

## 📝 Environment Variables

Create `backend/.env`:
```
api_key=your_gemini_api_key_here
```

## 🐛 Troubleshooting

1. **CORS Issues**: Make sure flask-cors is installed
2. **spaCy Model**: Run `python -m spacy download en_core_web_sm`
3. **API Key**: Ensure Gemini API key is set in `.env`
4. **Port Conflicts**: Backend uses 5000, frontend uses 5173

## 📄 License

This project is for educational purposes.
