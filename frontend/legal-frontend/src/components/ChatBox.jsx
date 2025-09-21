import React, {useEffect} from 'react'

// Simple markdown renderer for common LLM formatting
const renderMarkdown = (text) => {
  if (!text) return text;
  
  // Handle code blocks first (to avoid processing markdown inside them)
  text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded mt-3 mb-3 text-xs font-mono overflow-x-auto"><code>$1</code></pre>');
  
  // Handle blockquotes (>) 
  text = text.replace(/^>\s(.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 italic text-gray-700 my-2">$1</blockquote>');
  
  // Handle horizontal rules (---)
  text = text.replace(/^---\s*$/gm, '<hr class="border-gray-300 my-4" />');
  
  // Handle headings (#### ### ## #)
  text = text.replace(/^####\s(.+)$/gm, '<h4 class="text-sm font-semibold mt-4 mb-2 text-gray-800">$1</h4>');
  text = text.replace(/^###\s(.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2 text-gray-900">$1</h3>');
  text = text.replace(/^##\s(.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-3 text-gray-900">$1</h2>');
  text = text.replace(/^#\s(.+)$/gm, '<h1 class="text-xl font-bold mt-5 mb-3 text-gray-900">$1</h1>');
  
  // Handle **bold** first (before * italic to avoid conflicts)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Handle numbered lists (1. 2. 3.) - better formatting
  text = text.replace(/^\*\*(\d+)\.\s(.+)\*\*$/gm, '<div class="ml-4 mb-2 font-semibold">$1. $2</div>');
  text = text.replace(/^\d+\.\s(.+)$/gm, '<div class="ml-4 mb-1">$1</div>');
  
  // Handle bullet points with * (at start of line) - better spacing
  text = text.replace(/^\*\s(.+)$/gm, '<div class="ml-4 mb-1 flex"><span class="mr-2">•</span><span>$1</span></div>');
  
  // Handle bullet points with - (at start of line)
  text = text.replace(/^-\s(.+)$/gm, '<div class="ml-4 mb-1 flex"><span class="mr-2">•</span><span>$1</span></div>');
  
  // Handle *italic* (more precise regex to avoid conflicts)
  text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  
  // Handle `inline code`
  text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
  
  // Handle paragraphs (double line breaks)
  text = text.replace(/\n\n/g, '</p><p class="mb-3">');
  text = text.replace(/^/, '<p class="mb-3">');
  text = text.replace(/$/, '</p>');
  
  // Replace remaining single line breaks with <br>
  text = text.replace(/\n/g, '<br>');
  
  // Clean up empty paragraphs
  text = text.replace(/<p class="mb-3"><\/p>/g, '');
  
  return text;
};

export default function ChatBox({onSend}) {
    const [messages, setMessages] = React.useState([])
    const [input, setInput] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const bottomRef = React.useRef(null)

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, {sender: "user", text: userMessage}])
        setLoading(true)

        try {
            const response = await onSend(userMessage)
            setMessages(prev => [...prev, {sender: "bot", text: response}])
        } catch (error) {
            setMessages(prev => [...prev, {sender: "bot", text: "Sorry, something went wrong."}])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend();
        }
    }

    return (
        <div className="flex flex-col h-[600px] border border-gray-300 rounded-lg bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-medium text-black">Document Assistant</h3>
                <p className="text-xs text-gray-500">Ask questions about your document</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-8">
                        <p>No messages yet.</p>
                        <p>Start by asking a question about your document.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                                    msg.sender === "user"
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-900 border border-gray-200"
                                }`}
                            >
                                {msg.sender === "bot" ? (
                                    <div 
                                        dangerouslySetInnerHTML={{
                                            __html: renderMarkdown(msg.text)
                                        }}
                                        className="prose prose-sm max-w-none"
                                    />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg text-sm">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef}/>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        rows={3}
                        placeholder="Ask any question about the document..."
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !input.trim() || loading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    )
}