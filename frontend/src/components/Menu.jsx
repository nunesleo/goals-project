import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faDiceD6, faHouse, faChartLine } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

{/*This component is used on all pages*/ }
const Menu = ({ setToken }) => {
    const navigate = useNavigate();
    const [contributionPoints, setContributionPoints] = useState(0);
    const [crowns, setCrowns] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:5555/users/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setContributionPoints(response.data.contributionPoints);
                setCrowns(response.data.crowns);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.reload();
        navigate("/login");
    };

    return (
        <section className="w-full flex justify-center z-10">
            <div className="mt-5 w-1/2 rounded-lg py-2 px-8 flex flex-row bg-[#A571E9] shadow-md space-x-2 hover:bg-[#b382f4] hover:shadow-none transition duration-100">
                <Link to="/">
                    <button className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faHouse} color="white" className="hover:-translate-y-0.5 hover:rotate-12 transition duration-200" />
                        <p className="px-2 py-1 hover:underline text-white">Home</p>
                    </button>
                </Link>
                <Link to="/analysis">
                    <button className="flex flex-row items-center">
                        <FontAwesomeIcon icon={faChartLine} color="white" className="hover:-translate-y-0.5 hover:rotate-12 transition duration-200" />
                        <p className="px-2 py-1 hover:underline text-white">Analysis</p>
                    </button>
                </Link>
                <div className="flex flex-grow"></div>
                <button title="Contribution Points: Earn some by adding contributions" className={`bg-white rounded-md flex ${isLoggedIn ? 'block' : 'hidden'} flex-row`}>
                    <p title="Contribution Points: Earn some by adding contributions" className="px-2 py-1 text-[#A571E9]">
                        <FontAwesomeIcon title="Contribution Points: Earn some by adding contributions" icon={faDiceD6} color="#A571E9" className="hover:-translate-y-0.5 hover:rotate-12 transition duration-200" /> {contributionPoints}
                    </p>
                </button>
                <button title="Crowns: Earn some by completing goals" className={`bg-white rounded-md flex ${isLoggedIn ? 'block' : 'hidden'} flex-row`}>
                    <p title="Crowns: Earn some by completing goals" className="px-2 py-1 text-[#A571E9]">
                        <FontAwesomeIcon title="Crowns: Earn some by completing goals" icon={faCrown} color="#F7D115" className="hover:-translate-y-0.5 hover:rotate-12 transition duration-200" /> {crowns}
                    </p>
                </button>
                <button onClick={handleLogout} className="text-white px-2">
                    Logout
                </button>
            </div>
        </section>
    );
};

export default Menu