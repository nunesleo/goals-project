import React from "react";

{/*This component is used on the Home page*/ }
const HomeHeader = () => {
    return (
        <>
            <h1 className="font-bold text-5xl text-[#A571E9]">GOALS!</h1>
            <div className="w-1/4 text-gray-700 text-sm">
                <p className="text-center font-semibold">Welcome, Leonardo!</p>
                <p className="text-center">Consistency is the key to turning your dreams into reality. With this app, you'll track your daily achievements, stay motivated, and climb step by step toward your goals.</p>
                <p className="text-center">Let’s make progress every day—together!</p>
            </div>
        </>
    )
}

export default HomeHeader