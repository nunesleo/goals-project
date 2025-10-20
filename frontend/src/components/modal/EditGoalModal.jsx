import React from "react";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

{/*This component is used on the ShowGoal page*/ }
const EditGoalModal = ({isOpen, goal, goalName, setGoalName, goalDescription, setGoalDescription, onSubmit, handleDeleteGoal, setModalEdit}) => {
    if (!isOpen) {
        return null;
    }
    return (
        <>
            <section className="fixed inset-0 bg-[#4a4a4a] opacity-30 w-full min-h-screen z-30"></section>
            <section className="fixed w-full h-full flex items-center justify-center z-40">
                <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white border-md shadow-md flex flex-col space-y-2 z-50">
                    <div className="flex flex-row items-center space-x-2">
                        <h2 className="font-bold text-lg">Edit the Goal</h2>
                        <button onClick={() => handleDeleteGoal()}>
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </button>

                        <div className="flex flex-grow"></div>
                        <button onClick={() => setModalEdit(false)} className="bg-red-600 px-2 rounded-md text-white">
                            x
                        </button>
                    </div>
                    <p>Goal's name</p>
                    <textarea className="bg-gray-100 p-2" value={goalName}
                        onChange={(e) => setGoalName(e.target.value)} placeholder={goal.name}>
                    </textarea>
                    <p>Use the SMART framework to describe your goal</p>

                    <textarea className="bg-gray-100 p-2" value={goalDescription}
                        onChange={(e) => setGoalDescription(e.target.value)} placeholder={goal.description}>

                    </textarea>
                    <div className="flex flex-grow"></div>
                    <button onClick={onSubmit} className="bg-[#EDCF41] p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                </div>
            </section>
        </>
    );
}

export default EditGoalModal