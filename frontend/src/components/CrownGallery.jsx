import React from "react";
import Spinner from "./Spinner";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const CrownGallery = ({ goals, isLoading }) => {
    let completedGoals = [...goals].filter(goal => goal.isComplete);

    return (
        <div className="p-6 w-1/2 rounded-md shadow-md flex flex-col space-y-4 border-2 border-[#b9b9b9]">
            <p className="font-bold text-[#A571E9]">
                <FontAwesomeIcon icon={faCrown} color="#F7D115" className="hover:-translate-y-1 hover:rotate-12 transition duration-200" />
                {" Your Crowns"}
            </p>
            <div className="flex flex-row flex-wrap w-full gap-x-4 gap-y-4 bg-slate-200 rounded-md p-4">
                {isLoading ? (
                    <Spinner />
                ) : (
                    completedGoals.map((goal) => (
                        <div className="p-4 rounded-md shadow-md bg-[#A571E9] hover:-translate-y-2 hover:rotate-1 transition duration-200 items-center">
                            <Link
                                to={`/goals/details/${goal._id}`}
                                className="font-semibold text-white">
                                <FontAwesomeIcon icon={faCrown} color="#F7D115" className="hover:-translate-y-1 hover:rotate-12 transition duration-200 text-5xl w-full" />
                                <p key={goal._id} title={goal.name}>{goal.name.length > 15 ? goal.name.substring(0, 15) + "..." : goal.name}</p>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CrownGallery