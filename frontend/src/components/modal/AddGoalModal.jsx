import React from "react";

{/*This component is used on the Home page*/ }
const AddGoalModal = ({ isOpen, onClose, goalName, setGoalName, goalDescription, setGoalDescription, onSubmit }) => {
    if (!isOpen) {
        return null;
    }
    return (
        <>
            <section className="fixed inset-0 bg-[#4a4a4a] opacity-30 w-full min-h-screen z-30"></section>
            <section className="fixed w-full h-full flex items-center justify-center z-40">
                <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white border-md shadow-md flex flex-col space-y-2 z-50">
                    <div className="flex flex-row">
                        <h2 className="font-bold text-lg">Add a goal</h2>
                        <div className="flex flex-grow"></div>
                        <button onClick={onClose} className="bg-red-600 px-2 rounded-md text-white">
                            x
                        </button>
                    </div>
                    <p>Goal's name</p>
                    <textarea className="bg-gray-100 p-2" value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}></textarea>
                    <p>Use the SMART framework to describe your goal</p>
                    <textarea className="bg-gray-100 p-2" value={goalDescription}
                        onChange={(e) => setGoalDescription(e.target.value)}></textarea>
                    <div className="flex flex-grow"></div>
                    <button onClick={onSubmit} className="bg-yellow-300 p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                </div>
            </section>
        </>
    );
}

export default AddGoalModal

