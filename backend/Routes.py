import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
import uuid
from chatbot import query
from Risk_Analysis_model import analyze_document
import spacy

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploaded_docs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question', '')
    doc_id = data.get('doc_id', '')
    context = ""

    # Optionally load document context
    if doc_id:
        sentences_path = os.path.join(UPLOAD_FOLDER, f"{doc_id}_sentences.txt")
        if os.path.exists(sentences_path):
            with open(sentences_path, "r", encoding="utf-8") as f:
                context = "\n".join([line.strip() for line in f if line.strip()])

    # Pass context to chatbot if needed
    answer = query(question, context=context)
    return answer  # Return string directly as frontend expects

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    doc_id = data.get('doc_id', '')
    if not doc_id:
        return jsonify({"error": "No doc_id provided"}), 400

    sentences_path = os.path.join(UPLOAD_FOLDER, f"{doc_id}_sentences.txt")
    if not os.path.exists(sentences_path):
        return jsonify({"error": "Document not found"}), 404

    with open(sentences_path, "r", encoding="utf-8") as f:
        sentences = [line.strip() for line in f if line.strip()]

    document_text = " ".join(sentences)
    analysis = analyze_document(document_text)
    return jsonify({"analysis": analysis})

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
    file.save(pdf_path)

    # Extract text from PDF
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""

    # Split text into sentences using spaCy
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    # Save sentences to a .txt file
    sentences_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_sentences.txt")
    with open(sentences_path, "w", encoding="utf-8") as f:
        for sent in sentences:
            f.write(sent + "\n")

    # Analyze document for risks immediately after upload
    document_text = " ".join(sentences)
    risks = analyze_document(document_text)

    return jsonify({
        "doc_id": file_id,
        "risks": risks,
        "num_sentences": len(sentences),
        "message": "PDF uploaded, sentences extracted, and risks analyzed."
    })

if __name__ == '__main__':
    app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)
