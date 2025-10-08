import React from "react";
import Spinner from "./Spinner";
import { Link } from 'react-router-dom';

{/*This component is used on the Home page*/ }
const ListOfGoals = ({ goals, isLoading }) => {
    return (
        <div className="p-6 w-1/4 rounded-md shadow-md flex flex-col space-y-4 border-2 border-[#b9b9b9]">
            <p className="font-bold text-[#A571E9]">Your goals</p>

            {isLoading ? (
                <Spinner />
            ) : (
                goals.map((goal) => (
                    <div className="p-4 rounded-md shadow-md bg-[#A571E9] hover:-translate-y-2 hover:rotate-1 transition duration-200">
                        <Link
                            to={`/goals/details/${goal._id}`}
                            className="font-semibold text-white">
                            <p key={goal._id}>{goal.name}</p>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default ListOfGoals;