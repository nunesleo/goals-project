import React from "react";
import Spinner from "./Spinner";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD6 } from "@fortawesome/free-solid-svg-icons";

const RecentContributionsGallery = ({ contributions, isLoading }) => {
    const sortedContributions = contributions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="p-6 w-1/2 rounded-md shadow-md flex flex-col space-y-4 border-2 border-[#b9b9b9]">
            <p className="font-bold text-[#A571E9]">
                <FontAwesomeIcon icon={faDiceD6} color="#A571E9" className="hover:-translate-y-1 hover:rotate-12 transition duration-200" />
                {" Recent Contributions"}
            </p>
            <div className="flex flex-row whitespace-nowrap overflow-x-auto w-full gap-x-4 gap-y-4 bg-slate-200 rounded-md p-4">
                {isLoading ? (
                    <Spinner />
                ) : (
                    sortedContributions.map((contribution) => (
                        <div className="p-4 py-6 flex-shrink-0 rounded-md shadow-md bg-[#A571E9] hover:-translate-y-2 hover:rotate-1 transition duration-200 items-center">
                            <Link to={`/goals/details/${contribution.goal}`} className="text-white">
                                <p key={contribution._id} title={contribution.name} className="font-bold">{contribution.name.length > 20 ? contribution.name.substring(0, 20) + "..." : contribution.name}</p>
                                <p className="text-sm">{"Created at: " + new Date(contribution.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecentContributionsGallery;