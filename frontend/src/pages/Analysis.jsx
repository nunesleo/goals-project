import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import CrownGallery from "../components/CrownGallery";
import RecentContributionsGallery from "../components/RecentContributionsGallery";
import MostActiveGoal from "../components/MostActiveGoal";
import ContributionPointsChart from "../components/CumulativePointsGraph";

const Analysis = () => {
    const [goals, setGoals] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [goalsRes, contributionsRes] = await Promise.all([
                    axios.get("http://localhost:5555/goals", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:5555/contributions/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setGoals(goalsRes.data.data || []);
                setContributions(contributionsRes.data.data || []);
            } catch (error) {
                console.error("API error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <section className="w-full min-h-screen flex flex-col items-center py-8 space-y-5">
                <CrownGallery
                    goals={goals}
                    isLoading={loading}
                />

                <MostActiveGoal
                    goals={goals}
                    isLoading={loading}
                />
                
                <ContributionPointsChart
                    contributions={contributions}
                    isLoading={loading}
                />

                <RecentContributionsGallery
                    contributions={contributions}
                    isLoading={loading}
                />


            </section>
        </>
    );
};

export default Analysis;