import { useState } from "react";
import UploadPDF from "./components/UploadPDF";
import RiskList from "./components/RiskList";
import ChatBox from "./components/ChatBox.jsx";
import DocumentViewer from "./components/DocumentViewer.jsx";

function App() {
	const [risks, setRisks] = useState([]);
	const [docId, setDocId] = useState(null);
	const [fileMeta, setFileMeta] = useState(null);
	const [selectedRiskIndex, setSelectedRiskIndex] = useState(null);
	const [fileUrl, setFileUrl] = useState(null);
	
	// Handles PDF upload and sets risks + doc id
	const handleUpload = (data,file) => {
		setRisks(data.risks || []);
		setDocId(data.doc_id);
		setFileMeta({
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2), // size in MB
		});
		const url = URL.createObjectURL(file);
		setFileUrl(url);

		console.log("File URL:", url); // check in console
		setSelectedRiskIndex(null);
	};

	// No sample risks - show nothing initially

	// Real backend call for the chatbox
	const askBackend = async (question) => {
		try {
			const response = await fetch('http://localhost:5000/ask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					question: question,
					doc_id: docId
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const answer = await response.text();
			return answer;
		} catch (error) {
			console.error('Chat request failed:', error);
			return "Sorry, I couldn't process your question. Please try again.";
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-2xl font-bold mb-6 text-center">
				Legal Risk Analyzer
			</h1>

			{/* Main Layout: Two columns on md+, stacked on mobile */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Left column */}
				<div className="space-y-6">
					{!docId ? (
						<UploadPDF onUpload={handleUpload} />
					) : (
						<div className="bg-white border border-gray-200 rounded-lg">
							<div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
								<div>
									<h2 className="text-lg font-medium text-black">Document Preview</h2>
									<p className="text-sm text-gray-500">
										{fileMeta?.name} ({fileMeta?.size} MB)
									</p>
								</div>
								<button
									className="text-sm text-red-500 hover:underline"
									onClick={() => {
										// reset everything
										setDocId(null);
										setFileMeta(null);
										setRisks([]);
									}}
								>
									Remove
								</button>
							</div>
							<div className="p-4">
								<DocumentViewer fileUrl={fileUrl} selectedIndex={selectedRiskIndex} />
							</div>
						</div>
					)}
				</div>

				{/* Right column: Chat + Risks */}
				<div className="space-y-6">
					{/* ChatBox appears only after document upload - Made bigger */}
					{docId && (
						<div className="bg-white border border-gray-200 rounded-lg">
							<div className="border-b border-gray-200 px-6 py-4">
								<h2 className="text-lg font-medium text-black">Ask the Assistant</h2>
							</div>
							<div className="p-4">
								<ChatBox onSend={askBackend} />
							</div>
						</div>
					)}
					{/* Only show RiskList if document is uploaded */}
					{docId && (
						<RiskList
							risks={risks}
							onSelect={(index) => setSelectedRiskIndex(index)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;