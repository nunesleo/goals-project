import React, { useEffect, useState } from "react";
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isModalOpen, setModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);

    {/* States submit */}
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");

    const handleSubmit = async () => {
        const goalData = {
            name: goalName,
            description: goalDescription,
        };

        try {
            await axios.post("http://localhost:5555/goals", goalData);
            alert("Goal added successfully!");
            setModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Failed to add goal. Please try again.");
        }
    };

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

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center space-y-4">
            {/* Modal add a goal */}
            {isModalOpen ? (
                <>
                <section className="fixed bg-black opacity-50 w-full h-full z-40">
                </section>
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
                    <button onClick={() => handleSubmit()} className="bg-yellow-300 p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                </div>
                </>
            ) : null}
            


            {/* List of Goals */}
            <h1 className="font-bold text-5xl mb-10">GOALS!</h1>
            <div className="p-8 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-gray-100">
                <p className="font-bold">Your goals</p>

                {loading ? (
                    <Spinner />
                ) : (
                    goals.map((goal) => (
                        <div className="p-4 rounded-md shadow-md bg-gray-300 hover:-translate-y-2 hover:rotate-1 hover:bg-yellow-300 transition duration-200 ">
                            <Link
                                to={`/goals/details/${goal._id}`} // Link to goal details page
                                className="font-semibold text-black"
                            ><p key={goal._id}>{goal.name}</p></Link>
                            
                        </div>
                    ))
                )}
            </div>

            {/* Add a Goal */}
            <button onClick={() => setModal(true)} className="p-4 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-yellow-300 hover:-translate-y-2 transition duration-200 z-30">
                <p className="w-full text-center text-lg font-bold">+</p>
            </button>
        </section>

    )
}

export default Home