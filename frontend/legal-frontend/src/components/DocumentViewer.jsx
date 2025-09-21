export default function DocumentViewer({ fileUrl }) {
    return (
        <div className="w-full h-[900px] md:h-[1000px] border rounded overflow-hidden shadow-md">
            {fileUrl ? (
                <iframe
                    src={fileUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="100%"
                    style={{
                        border: "none",
                        zoom: 1.5, // scale up the PDF inside the iframe
                    }}
                />
            ) : (
                <p className="text-gray-500 text-center mt-40 text-lg">
                    No document loaded.
                </p>
            )}
        </div>
    );
}
