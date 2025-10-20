import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const AISuggestionCard = ({ goal, handleGenerateSuggestion, loadingSuggestion }) => {
    return (
        <div className="p-6 w-full flex flex-col rounded-md shadow-md border-2 space-y-4 border-[#b9b9b9]">
            <button onClick={() => handleGenerateSuggestion(goal)} className={`self-start bg-[#A571E9] w-auto text-white rounded-full px-4 py-1 hover:-translate-y-2 hover:rotate-1 transition duration-200 ${loadingSuggestion ? 'animate-pulse' : 'animate-none'}`}>
                {loadingSuggestion ? (
                    <p>Loading suggestion...</p>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <FontAwesomeIcon icon={faLightbulb} color="white" />
                        <p>Generate Action Plan</p>
                    </div>
                )}
            </button>
            {goal.aiSuggestion ?
                <div className="flex flex-col space-y-1">
                    {goal.aiSuggestion
                        .split("\n")
                        .map((para, index) => (
                            <p
                                key={index}
                                dangerouslySetInnerHTML={{
                                    __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                                }}
                            />
                        ))
                    }</div>
                : null}

        </div>
    )
}
export default AISuggestionCard