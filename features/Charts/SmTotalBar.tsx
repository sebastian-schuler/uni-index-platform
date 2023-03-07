import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { SmStatisticGraphRatings } from '../../pages/analysis/social-media/statistics';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    ratings: SmStatisticGraphRatings;
}

const SmTotalBar: React.FC<Props> = ({ ratings }: Props) => {

    const options = {
        // indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
                barPercentage: 1,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },

    };

    const labels = ['0 - 10%', '10 - 20%', '20 - 30%', '30 - 40%', '40 - 50%', '50 - 60%', '60 - 70%', '70 - 80%', '80 - 90%', '90 - 100%'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Total',
                data: ratings.total,
                backgroundColor: 'rgba(200, 200, 0, 0.3)',
                borderWidth: 0,
                barPercentage: 1,
                categoryPercentage: 1,
            },
            {
                label: 'Twitter',
                data: ratings.twitter,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderWidth: 0,
                barPercentage: 1,
                categoryPercentage: 1,
            },
            {
                label: 'Youtube',
                data: ratings.youtube,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 0,
                barPercentage: 1,
                categoryPercentage: 1,
            },
        ],
    };

    return <Bar options={options} data={data} />;
}

export default SmTotalBar