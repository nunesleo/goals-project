import React from "react";

const ListOfContributions = ({ goal, contributions, setModalEdit, handleDropdownClick, dropDownId, setModal, setIsComplete, isComplete, setToUpdate }) => {
    return (
        <div className="p-8 w-full max-w-4xl mx-auto flex flex-col space-y-4 z-10 text-gray-700">
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
            <div className="flex flex-row">
                <h2 className="text-lg font-semibold">Contributions</h2>
                <div className="bg-gray-200 rounded-md px-2 mx-2">
                    <span className="font-bold text-sm">{contributions.length}</span>
                </div>
            </div>

            <div className="space-y-2 flex flex-col">
                {contributions.length > 0 ? (
                    contributions.map((contribution) => {
                        return (

                            <div onClick={() => handleDropdownClick(contribution._id)} key={contribution._id} className={`p-4 w-1/2 text-white rounded-md transition-all duration-2000 ${contribution._id === dropDownId ? 'py-6' : 'py-4'} shadow-md ${contribution.isMilestone ? 'bg-[#EDCF41] text-gray-700' : 'bg-[#A571E9]'}`}>
                                <strong>{contribution.name}</strong>
                                <p>{contribution._id === dropDownId ? contribution.description : null}</p>
                                <p className={`text-xs ${contribution._id === dropDownId ? 'mt-4' : null}`}>{contribution._id === dropDownId ? "Created at: " + new Date(contribution.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : null} <button className={`${contribution._id === dropDownId ? 'inline-block hover:underline text-xs ml-2' : 'hidden'}`} onClick={() => handleDeleteContribution(contribution._id)}>{contribution._id === dropDownId ? "Delete" : null}</button></p>
                            </div>
                        )
                    })
                ) : (
                    <div>No contributions available</div>
                )}
            </div>

            <button onClick={() => setModal(true)} className="p-4 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-[#EDCF41] hover:-translate-y-2 transition duration-200 z-30">
                <p className="w-full text-center text-lg font-bold">+</p>
            </button>
        </div>
    );
}

export default ListOfContributions
