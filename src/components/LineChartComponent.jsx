import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function LineChartComponent({ data }) {
    if (!data || data.length === 0) return <p className="text-center text-gray-500">No data available</p>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    angle={-20}
                    textAnchor="end"
                />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `₦${value.toLocaleString()}`}
                />

                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />

                <Line
                    type="monotone"
                    dataKey="spending"
                    stroke="#FF6347"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default LineChartComponent;
