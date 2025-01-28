import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

{/*Import components*/ }
import Menu from "../components/Menu";
import EditGoalModal from "../components/EditGoalModal";
import AddContributionModal from "../components/AddContributionModal";
import ListOfContributions from "../components/ListOfContributions";

const ShowGoal = () => {
    const [isModalOpen, setModal] = useState(false);
    const [isModalEditOpen, setModalEdit] = useState(false);
    const [dropDownId, setDropdownId] = useState(null);
    const [goal, setGoal] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    {/* States submit */ }
    const [contributionName, setContributionName] = useState("");
    const [contributionDescription, setContributionDescription] = useState("");
    const [contributionIsMilestone, setContributionIsMilestone] = useState(false);

    {/* States edit */ }
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");
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
        axios
            .get(`http://localhost:5555/goals/${id}`)
            .then((response) => {
                setGoal(response.data);
                const contributionRequests = response.data.contributions.map((contributionId) =>
                    axios.get(`http://localhost:5555/contributions/${contributionId}`)
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
        const contributionData = {
            name: contributionName,
            description: contributionDescription,
            isMilestone: contributionIsMilestone,
        };

        try {
            await axios.post(`http://localhost:5555/contributions/${goal._id}`, contributionData);
            setModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding contribution:", error);
            alert("Failed to add contribution. Please try again.");
        }
    };

    const handleDeleteContribution = async (contributionId) => {
        try {
            await axios.delete(`http://localhost:5555/contributions/${goal._id}/${contributionId}`);
            window.location.reload();
        } catch (error) {
            console.error("Error adding contribution:", error);
            alert("Failed to add contribution. Please try again.");
        }
    }

    const handleDeleteGoal = async () => {

        try {
            await axios.delete(`http://localhost:5555/goals/${goal._id}`);
            navigate("/");
        } catch (error) {
            console.error("Error deleting contribution:", error);
            alert("Failed to delete goal. Please try again.");
        }
    }

    const handleCompleteGoal = async () => {
        const goalData = {
            isComplete: isCompleted,
        };

        setToUpdate(false);
        window.location.reload();
        try {
            await axios.put(`http://localhost:5555/goals/${goal._id}`, goalData);
        } catch (error) {
            console.error("Error updating goal:", error);
            alert("Failed to update goal. Please try again.");
        }


    }

    const handleEditGoal = async () => {
        const goalData = {
            name: goalName,
            description: goalDescription,
        };

        try {
            await axios.put(`http://localhost:5555/goals/${goal._id}`, goalData);
            setModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Failed to add goal. Please try again.");
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
                <Menu />
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

                <ListOfContributions
                    goal={goal}
                    contributions={contributions}
                    setModalEdit={setModalEdit}
                    handleDropdownClick={handleDropdownClick}
                    dropDownId={dropDownId}
                    setModal={setModal}
                    setIsComplete={setIsComplete}
                    isComplete={isComplete}
                    setToUpdate={setToUpdate}
                />
            </section>
        </>
    );
};

export default ShowGoal;
