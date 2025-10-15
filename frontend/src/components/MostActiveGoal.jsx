import React from "react";
import Spinner from "./Spinner";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const MostActiveGoal = ({ goals, isLoading }) => {
    let sortedGoals = [...goals].sort(
        (a, b) => b.contributions.length - a.contributions.length
    );
    let mostActive = sortedGoals[0];
    let leastActive = sortedGoals[sortedGoals.length - 1];

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="p-6 w-1/2 rounded-md shadow-md flex flex-row space-x-4 border-2 border-[#b9b9b9]">
                    <div className="p-4 w-1/2 rounded-md shadow-md bg-[#A571E9] hover:-translate-y-2 hover:rotate-1 transition duration-200">
                        <Link to={`/goals/details/${mostActive._id}`} className="text-white">
                            <p className="font-bold"> <FontAwesomeIcon icon={faCheck} color="#F7D115" /> Most active goal</p>
                            <p><span className="font-bold">Goal Name:</span> {mostActive.name}</p>
                            <p><span className="font-bold">Contributions:</span> {mostActive.contributions.length}</p>
                            <p className="text-sm">{"Created at: " + new Date(leastActive.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>

                        </Link>
                    </div>

                    <div className="p-4 w-1/2 rounded-md shadow-md bg-[#A571E9] hover:-translate-y-2 hover:rotate-1 transition duration-200">
                        <Link to={`/goals/details/${leastActive._id}`} className="text-white">
                            <p className="font-bold"> <FontAwesomeIcon icon={faExclamationTriangle} color="#F7D115" /> Least active goal</p>
                            <p><span className="font-bold">Goal Name:</span> {leastActive.name}</p>
                            <p><span className="font-bold">Contributions:</span> {leastActive.contributions.length}</p>
                            <p className="text-sm">{"Created at: " + new Date(leastActive.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default MostActiveGoal;