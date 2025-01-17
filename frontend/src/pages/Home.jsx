import React, { useEffect, useState } from "react";
import axios from 'axios';

{/*Import components*/ }
import Menu from "../components/Menu.jsx";
import AddGoalModal from "../components/AddGoalModal.jsx";
import ListOfGoals from "../components/ListOfGoals.jsx";
import HomeHeader from "../components/HomeHeader.jsx";

const Home = () => {
    const [isModalOpen, setModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);

    {/* States for submit functionality */ }
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
                <AddGoalModal
                    isOpen={isModalOpen}
                    onClose={() => setModal(false)}
                    goalName={goalName}
                    setGoalName={setGoalName}
                    goalDescription={goalDescription}
                    setGoalDescription={setGoalDescription}
                    onSubmit={handleSubmitGoal}
                />

                <div className="w-full h-full py-10 flex flex-col items-center space-y-8">
                    <HomeHeader/>

                    <ListOfGoals
                        goals={goals}
                        isLoading={loading}
                    />

                    {/* Add a Goal */}
                    <button onClick={() => setModal(true)} className="p-4 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-[#EDCF41] hover:-translate-y-2 transition duration-200 z-20">
                        <p className="w-full text-center text-3xl font-bold text-white">+</p>
                    </button>
                </div>
            </section>
        </>
    )
}

export default Home