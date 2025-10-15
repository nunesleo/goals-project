import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD6 } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const ContributionPointsChart = ({ contributions }) => {
    const processData = (contributions) => {
        const sorted = [...contributions].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        let cumulative = 0;
        return sorted.map((c) => {
            cumulative += c.isMilestone ? 50 : 10;
            return {
                createdAt: new Date(c.createdAt).getTime(),
                cumulativePoints: cumulative,
            };
        });
    };

    const data = processData(contributions);

    const formatDate = (createdAt) => {
        return new Date(createdAt).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (createdAt) => {
        return new Date(createdAt).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 w-1/2 h-96 flex flex-col rounded-md shadow-md border-2 space-y-4 border-[#b9b9b9]">
            <p className="font-bold text-[#A571E9]">
                <FontAwesomeIcon icon={faDiceD6} color="#A571E9" className="hover:-translate-y-1 hover:rotate-12 transition duration-200" />
                {" Cumulative contribution points vs Time"}
            </p>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis
                        dataKey="createdAt"
                        tickFormatter={formatDate}
                        scale="time"
                        domain={['auto', 'auto']}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={formatDateTime}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulativePoints"
                        stroke="#A571E9"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ContributionPointsChart;