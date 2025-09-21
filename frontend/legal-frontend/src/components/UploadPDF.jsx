import React from 'react';

export default function UploadPdf({ onUpload, onUploadStart }) { // <-- accept onUpload and onUploadStart props
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [inputKey, setInputKey] = React.useState(Date.now());

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        
        // Notify parent component that upload is starting
        if (onUploadStart) onUploadStart();

        console.log('Uploading', file);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);

            // Make API call to backend
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Upload response:', data);

            // Call App.jsx callback with real data
            if (onUpload) onUpload(data, file);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
            }
        }
    };

    const handleCancel = () => {
        setFile(null);
        setDragActive(false);
        setLoading(false);
        setInputKey(Date.now());
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-black">Document Upload</h2>
            </div>

            <div className="p-6 space-y-4">
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                            ? 'border-black bg-gray-50'
                            : file
                                ? 'border-gray-400 bg-gray-50'
                                : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        key={inputKey}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {file ? (
                        <div className="space-y-2">
                            <div className="w-8 h-8 border border-gray-400 rounded mx-auto flex items-center justify-center">
                                <span className="text-xs font-mono">PDF</span>
                            </div>
                            <p className="text-black font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="w-12 h-12 border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                                <span className="text-gray-400">↑</span>
                            </div>
                            <div>
                                <p className="text-black font-medium">Drop PDF here</p>
                                <p className="text-sm text-gray-500">or click to browse</p>
                            </div>
                        </div>
                    )}
                </div>

                {file && (
                    <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Ready to upload</span>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-black text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        loading || !file
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                    {loading ? 'Uploading...' : 'Upload Document'}
                </button>
            </div>
        </div>
    );
}
