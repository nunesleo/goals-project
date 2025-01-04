import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom"; 

{/*Import components*/ }
import Menu from "../components/Menu";

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

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:5555/goals/${id}`)
            .then((response) => {
                setGoal(response.data);
                const contributionRequests = response.data.contributions.map((contributionId) =>
                    axios.get(`http://localhost:5555/contributions/${contributionId}`)
                );

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
            console.error("Error adding contribution:", error);
            alert("Failed to delete goal. Please try again.");
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
                {/* Modal add a contribution */}
                {isModalOpen ? (
                    <>
                        <section className="fixed bg-black opacity-50 w-full h-full z-30">
                        </section>

                        <section className="fixed w-full h-full flex items-center justify-center z-40">
                            <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white shadow-md flex flex-col space-y-2 z-50">
                                <div className="flex flex-row space-x-2">
                                    <h2 className="font-bold text-lg">Add a contribution</h2>
                                    <div className={`px-2 rounded-md ${contributionIsMilestone ? 'bg-yellow-300' : 'bg-gray-200'} flex flex-row space-x-2 justify-center items-center`}>
                                        <label className="text-sm">Milestone</label>
                                        <input type="checkbox" onChange={(e) => setContributionIsMilestone(e.target.checked)}></input>
                                    </div>

                                    <div className="flex flex-grow"></div>
                                    <button onClick={() => setModal(false)} className="bg-red-600 px-2 rounded-md text-white">
                                        x
                                    </button>
                                </div>
                                <p>What did you accomplish today?</p>
                                <textarea className="bg-gray-100 p-2" value={contributionName}
                                    onChange={(e) => setContributionName(e.target.value)}></textarea>
                                <p>Details:</p>
                                <textarea className="bg-gray-100 p-2" value={contributionDescription}
                                    onChange={(e) => setContributionDescription(e.target.value)}></textarea>


                                <div className="flex flex-grow"></div>
                                <button onClick={() => handleSubmitNewContribution()} className="bg-yellow-300 p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                            </div>
                        </section>
                    </>
                ) : null}

                {/* Modal edit a goal */}
                {isModalEditOpen ? (
                    <>
                        <section className="fixed bg-black opacity-50 w-full h-full z-30">
                        </section>

                        <section className="fixed w-full h-full flex items-center justify-center z-40">
                            <div className="fixed rounded-md h-1/2 w-1/2 p-8 bg-white border-md shadow-md flex flex-col space-y-2 z-50">
                                <div className="flex flex-row items-center space-x-2">
                                    <h2 className="font-bold text-lg">Edit the Goal</h2>
                                    <button onClick={() => handleDeleteGoal()}>
                                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                    </button>

                                    <div className="flex flex-grow"></div>
                                    <button onClick={() => setModalEdit(false)} className="bg-red-600 px-2 rounded-md text-white">
                                        x
                                    </button>
                                </div>
                                <p>Goal's name</p>
                                <textarea className="bg-gray-100 p-2" value={goalName}
                                    onChange={(e) => setGoalName(e.target.value)} placeholder={goal.name}>
                                </textarea>
                                <p>Use the SMART framework to describe your goal</p>

                                <textarea className="bg-gray-100 p-2" value={goalDescription}
                                    onChange={(e) => setGoalDescription(e.target.value)} placeholder={goal.description}>

                                </textarea>
                                <div className="flex flex-grow"></div>
                                <button onClick={() => handleEditGoal()} className="bg-yellow-300 p-4 hover:-translate-y-2 transition duration-200 rounded-md shadow-md">Submit</button>
                            </div>
                        </section>
                    </>
                ) : null}

                {/* List of contributions */}
                <div className="p-8 w-full max-w-4xl mx-auto flex flex-col space-y-4 z-10 text-gray-700">
                    <div className="flex flex-row items-center space-x-2">
                        <h1 className="text-2xl font-bold">{goal.name}</h1>
                        <p className="hover:underline text-sm" onClick={() => setModalEdit(true)}>Edit</p>
                    </div>

                    <div>
                        {goal.description.split('\n').map((para, index) => (
                            <p key={index}>{para}</p>
                        ))}
                    </div>
                    <div className="flex flex-row">
                        <h2 className="text-lg font-semibold">Contributions</h2>
                        <div className="bg-gray-200 rounded-md px-2 mx-2">
                            <span className="font-bold text-sm">{contributions.length}</span>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        {contributions.length > 0 ? (
                            contributions.map((contribution) => {
                                return (

                                    <div onClick={() => handleDropdownClick(contribution._id)} key={contribution._id} className={`p-4 w-1/2 text-white rounded-md transition-all duration-2000 ${contribution._id === dropDownId ? 'py-6' : 'py-4'} shadow-md ${contribution.isMilestone ? 'bg-[#F7D115] text-gray-700' : 'bg-[#B36EF4]'}`}>
                                        <strong>{contribution.name}</strong>
                                        <p>{contribution._id === dropDownId ? contribution.description : null}</p>
                                        <p className={`text-xs ${contribution._id === dropDownId ? 'mt-4' : null}`}>{contribution._id === dropDownId ? "Created at: " + new Date(contribution.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : null} <button className={`${contribution._id === dropDownId ? 'inline-block hover:underline text-xs ml-2' : 'hidden'}`} onClick={() => handleDeleteContribution(contribution._id)}>{contribution._id === dropDownId ? "Delete" : null}</button></p>
                                    </div>
                                )
                            })
                        ) : (
                            <div>No contributions available</div>
                        )}
                    </div>

                    {/* Add a Contribution */}
                    <button onClick={() => setModal(true)} className="p-4 w-1/4 rounded-md shadow-md flex flex-col space-y-4 bg-[#F7D115] hover:-translate-y-2 transition duration-200 z-30">
                        <p className="w-full text-center text-lg font-bold">+</p>
                    </button>
                </div>
            </section>
        </>
    );
};

export default ShowGoal;
