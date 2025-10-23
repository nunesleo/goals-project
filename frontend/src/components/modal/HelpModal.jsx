import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faDiceD6, faFlag, faLightbulb, faQuestion, faChartLine } from "@fortawesome/free-solid-svg-icons";

const HelpModal = ({ isHelpModalOpen, setModalHelp }) => {
    return (
        <>
            {!isHelpModalOpen && (
                <button
                    onClick={() => setModalHelp(true)}
                    className="fixed bg-slate-100 border-2 border-[#A571E9] bottom-4 right-4 rounded-full p-4 shadow-md hover:bg-slate-200 z-5"
                >
                    <FontAwesomeIcon icon={faQuestion} color="#A571E9" />
                </button>
            )}

            {isHelpModalOpen && (
                <>
                    <section className="fixed inset-0 bg-[#494949] opacity-50 w-full h-full z-30"></section>
                    <section className="fixed inset-0 flex items-center justify-center z-40">
                        <div className="rounded-md h-2/3 w-1/2 p-8 bg-white shadow-md flex flex-col space-y-2 z-50 overflow-y-auto">
                            <div className="flex items-center space-x-2">
                                <h2 className="font-bold text-lg">Instructions</h2>
                                <div className="flex-grow"></div>
                                <button
                                    onClick={() => setModalHelp(false)}
                                    className="bg-red-600 px-2 rounded-md text-white"
                                >
                                    x
                                </button>
                            </div>

                            <h3 className="font-bold mt-2">Adding Goals and Contributions:</h3>
                            <p>- Create a long-term goal and write a clear, detailed description.</p>
                            <p>- Click on the goal to view its details.</p>
                            <p>- Use the Generate Action Plan <FontAwesomeIcon icon={faLightbulb} color="#A571E9" /> button to get AI suggestions on how to begin your journey.</p>
                            <p>- You’ll earn 10 points <FontAwesomeIcon icon={faDiceD6} color="#A571E9" /> for each normal contribution. If a contribution feels especially significant, mark it as a milestone <FontAwesomeIcon icon={faFlag} color="#F7D115" />, which is worth 50 points <FontAwesomeIcon icon={faDiceD6} color="#A571E9" />.</p>
                            <p>- Once a goal is completed, mark it as finished to earn a crown <FontAwesomeIcon icon={faCrown} color="#F7D115" />.</p>

                            <h3 className="font-bold mt-4">Tracking Progress:</h3>
                            <p>- Open the Analysis tab <FontAwesomeIcon icon={faChartLine} color="#A571E9" /> to see your completed goals.</p>
                            <p>- Track your total progress in the cumulative points chart.</p>
                            <p>- Revisit goals you’ve contributed to less, and celebrate the ones where you’ve made the most progress.</p>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default HelpModal;