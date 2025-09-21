from transformers import pipeline
import spacy
import re

# Better model for zero-shot classification
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Load spaCy model for sentence splitting + entity extraction
nlp = spacy.load("en_core_web_sm")

# Expanded risk patterns (legal/contractual red flags)
RISK_PATTERNS = {
    "automatic renewal": r"\bautomatic renewal\b",
    "renewal without consent": r"\bwithout (?:prior )?notice\b",
    "penalty clause": r"\bpenalty of\b",
    "liquidated damages": r"\bliquidated damages\b",
    "non-refundable": r"\bnon[- ]?refundable\b",
    "late payment fees": r"\blate fee\b|\binterest rate\b",
    "termination restrictions": r"\bnot subject to termination\b|\bcannot terminate\b",
    "warranty disclaimer": r"\bno warranty\b|\bas-is basis\b",
    "limitation of liability": r"\blimited liability\b|\bnot liable\b",
    "governing law": r"\bgoverning law\b|\bjursidiction\b|\bcourt of\b"
}

def classify_clause(clause):
    candidate_labels = ["liability", "payment terms", "termination", "renewal", "confidentiality", "warranty", "jurisdiction"]
    result = classifier(clause, candidate_labels=candidate_labels, multi_label=True)
    labels = [(result['labels'][i], float(result['scores'][i]))
              for i in range(len(result['labels'])) if result['scores'][i] > 0.5]
    return labels

def extract_entities(clause):
    doc = nlp(clause)
    entities = {}
    for ent in doc.ents:
        entities.setdefault(ent.label_, []).append(ent.text)
    return entities

def detect_risk(clause):
    risks = []
    for label, pattern in RISK_PATTERNS.items():
        if re.search(pattern, clause, re.IGNORECASE):
            risks.append(label)
    return risks

def split_clauses(text):
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents]

def analyze_document(text):
    clauses = split_clauses(text)
    risks_output = []
    for clause in clauses:
        if not clause:
            continue
        risks = detect_risk(clause)
        if risks:  # Only include clauses with detected risks
            risks_output.append({
                "text": clause,
                "risks": risks
            })
    return risks_output
