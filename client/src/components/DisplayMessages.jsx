import ReactMarkdown from "react-markdown";

export default function DisplayMessage({ message }) {

    return (        
        <div className={`flex ${message?.role === "human" ? "justify-end" : "justify-start"} mb-2`}>
            {
                message?.role === "ai" && (
                    <span
                        role="img"
                        aria-label="aurora"
                        title="Aurora"
                        className="inline-flex items-center justify-center w-9 h-9 mr-3 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white text-lg shadow-md flex-shrink-0"
                    >
                        🌌
                    </span>
                )
            }
            <div className={`max-w-[50vw] px-4 py-2 my-4 rounded-lg ${message?.role === "human" ? "bg-[#1249B0] text-white" : "bg-[#17ADA1] text-"}`}>
                <ReactMarkdown>{message?.content}</ReactMarkdown>
            </div>
        </div>
    );
}       