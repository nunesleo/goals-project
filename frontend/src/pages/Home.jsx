import React, { useEffect, useState } from "react";
import axios from 'axios';

{/*Import components*/ }
import AddGoalModal from "../components/modal/AddGoalModal.jsx";
import ListOfGoals from "../components/ListOfGoals.jsx";
import HomeHeader from "../components/HomeHeader.jsx";

const Home = () => {
    const [isModalOpen, setModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    //const [aiSuggestion, setAiSuggestion] = useState("");

    {/* States for submit functionality */ }
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authenticated. Please log in.");
            setLoading(false);
            return;
        }
    
        axios
            .get('http://localhost:5555/goals', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setGoals(response.data.data);
                console.log(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("Get Goals API: ", error);
                setLoading(false);
            });
    }, []);

    const handleSubmitGoal = async () => {
        const goalData = {
            name: goalName,
            description: goalDescription,
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not authenticated. Please log in.");
                return;
            }

            await axios.post("http://localhost:5555/goals", goalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // const suggestion = response.data.suggestion;

            // if (suggestion) {
            //     console.log("AI Suggestion:", suggestion);
            //     setAiSuggestion(suggestion)
            // }

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