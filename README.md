# Legal Document Risk Analyzer

A full-stack application that analyzes legal documents for potential risks using AI and provides an interactive chat interface for document assistance. Upload a PDF document and get instant risk analysis with AI-powered insights and recommendations.

##  Architecture

- **Frontend**: React.js with Vite
- **Backend**: Flask (Python)
- **AI Models**: 
  - Gemini 2.5 Pro for chat assistance
  - BART for risk classification
  - spaCy for NLP processing

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Gemini API key

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Set up environment variables
# Create .env file with your Gemini API key:
echo "api_key=your_gemini_api_key_here" > .env

# Start backend server
python Routes.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/legal-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

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

## Project Structure

```
genai-hack/
├── backend/
│   ├── Routes.py              # Flask API routes with CORS
│   ├── chatbot.py            # Gemini AI integration
│   ├── Risk_Analysis_model.py # Risk detection logic
│   ├── uploaded_docs/        # PDF storage (auto-created)
│   └── requirements.txt      # Python dependencies
├── frontend/legal-frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application with state management
│   │   ├── components/
│   │   │   ├── UploadPDF.jsx # File upload with drag & drop
│   │   │   ├── RiskList.jsx  # Risk display with empty state
│   │   │   ├── ChatBox.jsx   # AI chat interface
│   │   │   └── DocumentViewer.jsx # PDF viewer
│   │   ├── index.css         # Tailwind CSS styles
│   │   └── main.jsx          # React entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## Features

- **PDF Upload**: Drag & drop or click to upload PDF documents with instant analysis
- **Risk Analysis**: Automatic detection of legal risks and red flags using AI
- **Document Viewer**: In-browser PDF preview with risk highlighting
- **AI Chat**: Ask questions about your document with context-aware responses
- **Risk List**: Detailed view of identified risks with explanations
- **Smart UI**: Clean, centered interface with loading states and empty state handling
- **Real-time Processing**: Instant risk analysis upon document upload
- **Responsive Design**: Works on desktop and mobile devices

## Risk Detection

The system identifies various legal risks including:
- **Automatic renewal clauses** - Contracts that renew without explicit consent
- **Late payment fees** - Penalties for overdue payments
- **Limitation of liability** - Clauses limiting responsibility for damages
- **Warranty disclaimers** - "As-is" or "no warranty" statements
- **Termination restrictions** - Clauses preventing contract termination
- **Penalty clauses** - Excessive penalty amounts
- **Liquidated damages** - Pre-determined damage amounts
- **Non-refundable terms** - Money that cannot be recovered
- **Governing law** - Jurisdiction and legal framework clauses

## User Interface

- **Centered Upload**: Clean, focused initial experience with centered upload component
- **Loading States**: Visual feedback during document analysis
- **Empty States**: Positive messaging when no risks are detected
- **Two-Column Layout**: Document viewer and analysis tools side-by-side
- **Interactive Elements**: Clickable risks with detailed explanations

## Development

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

### Making Changes
1. **Backend**: Edit files in `backend/` directory
2. **Frontend**: Edit files in `frontend/legal-frontend/src/` directory
3. **Hot Reload**: Both frontend and backend support hot reloading during development

## Environment Variables

Create `backend/.env`:
```
api_key=your_gemini_api_key_here
```

## Troubleshooting

1. **CORS Issues**: Make sure flask-cors is installed (`pip install flask-cors`)
2. **spaCy Model**: Run `python -m spacy download en_core_web_sm`
3. **API Key**: Ensure Gemini API key is set in `backend/.env`
4. **Port Conflicts**: Backend uses 5000, frontend uses 5173
5. **Upload Issues**: Check that uploaded_docs directory exists and is writable
6. **No Risks Detected**: This is normal - the system shows a positive message when no risks are found
7. **Chat Not Working**: Ensure backend is running and API key is valid

## Deployment

### Local Development
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Production Considerations
- Set up proper environment variables
- Configure CORS for your domain
- Set up file storage for uploaded documents
- Consider using a production WSGI server like Gunicorn

## Quick Start Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/legal-document-analyzer.git
   cd legal-document-analyzer
   ```

2. **Set up backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   echo "api_key=your_gemini_api_key_here" > .env
   python Routes.py
   ```

3. **Set up frontend** (in a new terminal)
   ```bash
   cd frontend/legal-frontend
   npm install
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173` and start analyzing documents!


## License

This project is for educational purposes.
