import React from "react";
const ContributionsHeader = ({goal, setModalEdit, isComplete, setToUpdate}) => {
    return (
        <>
            <div className="flex flex-row items-center space-x-2">
                <h1 className="text-2xl font-bold">{goal.name}</h1>
                <p className="hover:underline text-sm" onClick={() => setModalEdit(true)}>Edit</p>
            </div>

            <div>
                <button onClick={() => { setToUpdate(true) }} className={`px-2 py-1 ${isComplete ? 'bg-[#EDCF41]' : 'bg-gray-200'} hover:bg-[#EDCF41] rounded-md transition duration-200`}>
                    Goal Completed
                </button>
            </div>


            <div>
                {goal.description.split('\n').map((para, index) => (
                    <p key={index}>{para}</p>
                ))}
            </div>
        </>
    )
}

export default ContributionsHeader