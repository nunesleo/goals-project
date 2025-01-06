import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faDiceD6, faHouse } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const Menu = () => {

    const [contributionPoints, setContributionPoints] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:5555/users/")
            .then((response) => {
                setContributionPoints(response.data.contributionPoints);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="w-full py-2 px-8 flex flex-row bg-[#B36EF4] shadow-md space-x-2">
            <Link to="/">
                <button className="flex flex-row items-center">
                    <FontAwesomeIcon icon={faHouse} color="white" />
                    <p className="px-2 py-1 hover:underline text-white"> Home</p>
                </button>
            </Link>
            <div className="flex flex-grow"></div>
            <button className="bg-white rounded-md flex flex-row">
                <p className="px-2 py-1 text-[#B36EF4]"><FontAwesomeIcon icon={faDiceD6} color="#B36EF4" /> {contributionPoints}</p>
            </button>
            <button className="bg-white rounded-md flex flex-row">
                <p className="px-2 py-1 text-[#B36EF4]"><FontAwesomeIcon icon={faCrown} color="#F7D115" /> 1</p>
            </button>
        </div>
    )
}

export default Menu