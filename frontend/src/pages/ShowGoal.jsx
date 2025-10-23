import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

{/*Import components*/ }
import EditGoalModal from "../components/modal/EditGoalModal";
import AddContributionModal from "../components/modal/AddContributionModal";
import ListOfContributions from "../components/ListOfContributions";
import AISuggestionsCard from "../components/AISuggestionCard";
import ContributionsHeader from "../components/ContributionsHeader";

const ShowGoal = () => {
    const [isModalOpen, setModal] = useState(false);
    const [isModalEditOpen, setModalEdit] = useState(false);
    const [dropDownId, setDropdownId] = useState(null);
    const [goal, setGoal] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    {/* States submit */ }
    const [contributionName, setContributionName] = useState("");
    const [contributionDescription, setContributionDescription] = useState("");
    const [contributionIsMilestone, setContributionIsMilestone] = useState(false);

    {/* States edit */ }
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");
    let aiSuggestion = "";
    const [isComplete, setIsComplete] = useState(false)
    const [toUpdate, setToUpdate] = useState(false)
    var isCompleted = false

    useEffect(() => {
        const updateState = () => {
            if (toUpdate) {
                console.log("isCompleted: ", isCompleted);
                isCompleted = isComplete ? false : true;
                handleCompleteGoal();
            }
        };

        updateState();
    }, [toUpdate]);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authenticated. Please log in.");
            setLoading(false);
            return;
        }
        axios
            .get(`http://localhost:5555/goals/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setGoal(response.data);
                const contributionRequests = response.data.contributions.map((contributionId) =>
                    axios.get(`http://localhost:5555/contributions/${contributionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                    })
                );
                setIsComplete(response.data.isComplete)
                isCompleted = response.data.isComplete

                Promise.all(contributionRequests)
                    .then((contributionResponses) => {
                        setContributions(contributionResponses.map(res => res.data));
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log("Error fetching contributions:", error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    const handleSubmitNewContribution = async () => {
        const token = localStorage.getItem("token");
        const contributionData = {
            name: contributionName,
            description: contributionDescription,
            isMilestone: contributionIsMilestone,
        };

        try {
            await axios.post(
                `http://localhost:5555/contributions/${goal._id}`,
                contributionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding contribution:", error);
            alert("Failed to add contribution. Please try again.");
        }
    };

    const handleDeleteContribution = async (contributionId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5555/contributions/${goal._id}/${contributionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            window.location.reload();
        } catch (error) {
            console.error("Error adding contribution:", error);
            alert("Failed to add contribution. Please try again.");
        }
    }

    const handleDeleteGoal = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5555/goals/${goal._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                },
            );
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting contribution:", error);
            alert("Failed to delete goal. Please try again.");
        }
    }

    const handleCompleteGoal = async () => {
        const token = localStorage.getItem("token");
        const goalData = {
            isComplete: isCompleted,
        };

        try {
            await axios.put(`http://localhost:5555/goals/${goal._id}`, goalData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
        } catch (error) {
            console.error("Error updating goal:", error);
            alert("Failed to update goal. Please try again.");
        }
        setToUpdate(false);
        window.location.reload();
    }

    const handleEditGoal = async () => {
        const token = localStorage.getItem("token");
        const goalData = {};

        if (aiSuggestion) {
            goalData.aiSuggestion = aiSuggestion;
        }

        if (goalName && goalName !== goal.name) {
            goalData.name = goalName;
        }

        if (goalDescription && goalDescription !== goal.description) {
            goalData.description = goalDescription;
        }

        try {
            await axios.put(`http://localhost:5555/goals/${goal._id}`, goalData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setModal(false);
            setLoadingSuggestion(false);
            window.location.reload();
        } catch (error) {
            console.error("Error editing goal:", error);
            alert("Failed to edit goal. Please try again.");
        }
    };

    const handleGenerateSuggestion = async (goal) => {
        setLoadingSuggestion(true);
        try {
            const payload = {
                model: "llama3.2",
                messages: [{
                    role: "user",
                    content: `Generate exactly a 3-step action plan and one small action example. Output only bullet points and examples, use bold for headers. Goal: ${goal.name} ${goal.description}`
                }],
                max_tokens: 30,
                stream: false 
            };

            const res = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            const lines = text.trim().split('\n').filter(line => line.trim());
            const lastLine = lines[lines.length - 1];
            const data = JSON.parse(lastLine);

            const suggestion = data.message?.content || "No response from model.";

            console.log("AI Suggestion:", suggestion);
            aiSuggestion = suggestion;
            handleEditGoal();

        } catch (err) {
            console.error("Error generating AI suggestion:", err);
            alert("Failed to generate AI suggestion. Please try again.");
        }
    };



    const handleDropdownClick = (id) => {
        setDropdownId((prevId) => (prevId === id ? null : id));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!goal) {
        return <div>Goal not found</div>;
    }

    return (
        <>
            <section className="w-full min-h-screen flex flex-col items-center">
                <AddContributionModal
                    isOpen={isModalOpen}
                    onClose={() => setModal(false)}
                    contributionDescription={contributionDescription}
                    setContributionDescription={setContributionDescription}
                    contributionName={contributionName}
                    setContributionName={setContributionName}
                    contributionIsMilestone={contributionIsMilestone}
                    setContributionIsMilestone={setContributionIsMilestone}
                    onSubmit={handleSubmitNewContribution}
                />

                <EditGoalModal
                    isOpen={isModalEditOpen}
                    goal={goal}
                    goalName={goalName}
                    setGoalName={setGoalName}
                    goalDescription={goalDescription}
                    setGoalDescription={setGoalDescription}
                    onSubmit={handleEditGoal}
                    setModalEdit={setModalEdit}
                    handleDeleteGoal={handleDeleteGoal}
                />
                <div className="mt-4 mb-4 p-8 w-1/2 max-w-4xl mx-auto flex flex-col space-y-4 z-10 text-gray-700 border-2 border-[#b9b9b9] rounded-md">

                    <ContributionsHeader
                        goal={goal}
                        setModalEdit={setModalEdit}
                        isComplete={isComplete}
                        setToUpdate={setToUpdate}
                    />

                    <AISuggestionsCard
                        goal={goal}
                        aiSuggestion={aiSuggestion}
                        handleGenerateSuggestion={handleGenerateSuggestion}
                        loadingSuggestion={loadingSuggestion}
                    />

                    <ListOfContributions
                        contributions={contributions}
                        handleDropdownClick={handleDropdownClick}
                        dropDownId={dropDownId}
                        setModal={setModal}
                        handleDeleteContribution={handleDeleteContribution}
                    />
                </div>
            </section>
        </>
    );
};

export default ShowGoal;
