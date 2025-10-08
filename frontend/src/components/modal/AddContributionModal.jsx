import React from "react";

{/*This component is used on the ShowGoal page*/ }
const AddContributionModal = ({ isOpen, onClose, contributionIsMilestone, setContributionIsMilestone, contributionDescription, setContributionDescription, contributionName, setContributionName, onSubmit }) => {
    if (!isOpen) {
        return null;
    }
    return (
        <>
            <section className="fixed inset-0 bg-[#4a4a4a] opacity-30 w-full min-h-screen z-30"></section>
            <section className="fixed w-full h-full flex items-center justify-center z-40">
                <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white shadow-md flex flex-col space-y-2 z-50">
                    <div className="flex flex-row space-x-2">
                        <h2 className="font-bold text-lg">Add a contribution</h2>
                        <div className={`px-2 rounded-md ${contributionIsMilestone ? 'bg-[#EDCF41]' : 'bg-gray-200'} flex flex-row space-x-2 justify-center items-center`}>
                            <label className="text-sm">Milestone</label>
                            <input type="checkbox" onChange={(e) => setContributionIsMilestone(e.target.checked)}></input>
                        </div>

                        <div className="flex flex-grow"></div>
                        <button onClick={onClose} className="bg-red-600 px-2 rounded-md text-white">
                            x
                        </button>
                    </div>
                    <p>What did you accomplish today?</p>
                    <textarea className="bg-gray-100 p-2" value={contributionName}
                        onChange={(e) => setContributionName(e.target.value)}></textarea>
                    <p>Details:</p>
                    <textarea className="bg-gray-100 p-2" value={contributionDescription}
                        onChange={(e) => setContributionDescription(e.target.value)}></textarea>


                    <div className="flex flex-grow"></div>
                    <button onClick={onSubmit} className="bg-[#EDCF41] p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                </div>
            </section>
        </>
    );
}

export default AddContributionModal;