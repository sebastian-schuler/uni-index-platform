import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TotalScoreSet } from '../../lib/types/SocialMediaTypes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    total: TotalScoreSet
    scoreSetTwitter: TotalScoreSet
    scoreSetYoutube: TotalScoreSet
    scoreSetFacebook?: TotalScoreSet
    scoreSetInstagram?: TotalScoreSet
}

const SmProfilesBar: React.FC<Props> = ({ total, scoreSetTwitter, scoreSetYoutube, scoreSetFacebook, scoreSetInstagram }: Props) => {

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
            }
        }
    };

    const labels = ['Average impressions', 'Average interaction', 'Total content output', 'Total reach', 'Profiles completed'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Twitter',
                data: [
                    calcValue(scoreSetTwitter.averageImpressions, total.averageImpressions),
                    calcValue(scoreSetTwitter.averageInteraction, total.averageInteraction),
                    calcValue(scoreSetTwitter.totalContentOutput, total.totalContentOutput),
                    calcValue(scoreSetTwitter.totalReach, total.totalReach),
                    calcValue(scoreSetTwitter.profilesCompleted, total.profilesCompleted),
                ],
                backgroundColor: 'rgba(29, 161, 242, 0.2)',
                borderColor: 'rgba(29, 161, 242, 1)',
            },
            {
                label: 'Youtube',
                data: [
                    calcValue(scoreSetYoutube.averageImpressions, total.averageImpressions),
                    calcValue(scoreSetYoutube.averageInteraction, total.averageInteraction),
                    calcValue(scoreSetYoutube.totalContentOutput, total.totalContentOutput),
                    calcValue(scoreSetYoutube.totalReach, total.totalReach),
                    calcValue(scoreSetYoutube.profilesCompleted, total.profilesCompleted),
                ],
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 1)',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}

const calcValue = (setValue: number, totalValue: number): number => {
    return (setValue / totalValue) * 100;
}

export default SmProfilesBar