import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

{/*Import components*/ }
import Spinner from '../components/Spinner.jsx';
import Menu from "../components/Menu.jsx";

const Home = () => {
    const [isModalOpen, setModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);

    {/* States submit */ }
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/goals')
            .then((response) => {
                setGoals(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleSubmitGoal = async () => {
        const goalData = {
            name: goalName,
            description: goalDescription,
        };

        try {
            await axios.post("http://localhost:5555/goals", goalData);
            setModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Failed to add goal. Please try again.");
        }
    };

    return (
        <>
            <section className="w-full min-h-screen flex flex-col items-center">
                <Menu />
                {/* Modal add a goal */}
                {isModalOpen ? (
                    <>
                        <section className="fixed bg-black opacity-50 w-full h-full z-30">
                        </section>

                        <section className="fixed w-full h-full flex items-center justify-center z-40">
                            <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white border-md shadow-md flex flex-col space-y-2 z-50">
                                <div className="flex flex-row">
                                    <h2 className="font-bold text-lg">Add a goal</h2>
                                    <div className="flex flex-grow"></div>
                                    <button onClick={() => setModal(false)} className="bg-red-600 px-2 rounded-md text-white">
                                        x
                                    </button>
                                </div>
                                <p>Goal's name</p>
                                <textarea className="bg-gray-100 p-2" value={goalName}
                                    onChange={(e) => setGoalName(e.target.value)}></textarea>
                                <p>Use the SMART framework to describe your goal</p>
                                {/*<p className="text-sm">(Specific, Measurable, Achievable, Relevant, Time-bound)</p>*/}
                                <textarea className="bg-gray-100 p-2" value={goalDescription}
                                    onChange={(e) => setGoalDescription(e.target.value)}></textarea>
                                <div className="flex flex-grow"></div>
                                <button onClick={() => handleSubmitGoal()} className="bg-yellow-300 p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                            </div>
                        </section>
                    </>
                ) : null}

                <div className="w-full h-full py-10 flex flex-col items-center space-y-8">
                    {/* List of Goals */}
                    <h1 className="font-bold text-5xl text-[#C04CFF]">GOALS!</h1>
                    <div className="w-1/4 text-gray-700 text-sm">
                        <p className="text-center font-semibold">Welcome, Leonardo!</p>
                        <p className="text-center">Consistency is the key to turning your dreams into reality. With this app, you'll track your daily achievements, stay motivated, and climb step by step toward your goals.</p>
                        <p className="text-center">Let’s make progress every day—together!</p>
                    </div>
                    <div className="p-6 w-1/4 rounded-md shadow-md flex flex-col space-y-4 border-4 border-[#C04CFF]">
                        <p className="font-bold text-[#C04CFF]">Your goals</p>

                        {loading ? (
                            <Spinner />
                        ) : (
                            goals.map((goal) => (
                                <div className="p-4 rounded-md shadow-md bg-[#B36EF4] hover:-translate-y-2 hover:rotate-1 transition duration-200">
                                    <Link
                                        to={`/goals/details/${goal._id}`} // Link to goal details page
                                        className="font-semibold text-white"
                                    ><p key={goal._id}>{goal.name}</p></Link>

                                </div>
                            ))
                        )}
                    </div>

                    {/* Add a Goal */}
                    <button onClick={() => setModal(true)} className="p-4 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-[#F7D115] hover:-translate-y-2 transition duration-200 z-20">
                        <p className="w-full text-center text-3xl font-bold text-white">+</p>
                    </button>
                </div>
            </section>
        </>
    )
}

export default Home