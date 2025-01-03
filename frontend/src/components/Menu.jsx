import React from "react";
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="w-full p-2 flex flex-row bg-gray-100 shadow-md space-x-2">
            <Link to="/">
                <button className="bg-gray-300 rounded-md flex">
                    <p className="px-2 py-1 hover:underline">Home</p>
                </button>
            </Link>
            <div className="flex flex-grow"></div>
            <button className="bg-gray-300 rounded-md flex">
                <p className="px-2 py-1">Contribution Points: XXX</p>
            </button>
            <button className="bg-gray-300 rounded-md flex">
                <p className="px-2 py-1">Crowns: XXX</p>
            </button>
        </div>
    )
}

export default Menu