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
import { TotalScoreSet } from '../../../../lib/types/SocialMediaTypes';

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
        // indexAxis: 'y' as const,
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

    const labels = ['Twitter', 'Youtube', 'Facebook', 'Instagram'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Average impressions',
                data: [
                    calcValue(scoreSetTwitter.averageImpressions, total.averageImpressions),
                    calcValue(scoreSetYoutube.averageImpressions, total.averageImpressions),
                    scoreSetFacebook?.averageImpressions || 0,
                    scoreSetInstagram?.averageImpressions || 0
                ],
                backgroundColor: 'rgba(239, 71, 111, 0.2)',
                borderColor: 'rgba(239, 71, 111, 1)',
            },
            {
                label: 'Average interaction',
                data: [
                    calcValue(scoreSetTwitter.averageInteraction, total.averageInteraction),
                    calcValue(scoreSetYoutube.averageInteraction, total.averageInteraction),
                    scoreSetFacebook?.averageInteraction || 0,
                    scoreSetInstagram?.averageInteraction || 0
                ],
                backgroundColor: 'rgba(255, 209, 102, 0.2)',
                borderColor: 'rgba(255, 209, 102, 1)',
            },
            {
                label: 'Total content output',
                data: [
                    calcValue(scoreSetTwitter.totalContentOutput, total.totalContentOutput),
                    calcValue(scoreSetYoutube.totalContentOutput, total.totalContentOutput),
                    scoreSetFacebook?.totalContentOutput || 0,
                    scoreSetInstagram?.totalContentOutput || 0
                ],
                backgroundColor: 'rgba(6, 214, 160, 0.2)',
                borderColor: 'rgba(6, 214, 160, 1)',
            },
            {
                label: 'Total reach',
                data: [
                    calcValue(scoreSetTwitter.totalReach, total.totalReach),
                    calcValue(scoreSetYoutube.totalReach, total.totalReach),
                    scoreSetFacebook?.totalReach || 0,
                    scoreSetInstagram?.totalReach || 0
                ],
                backgroundColor: 'rgba(17, 138, 178, 0.2)',
                borderColor: 'rgba(17, 138, 178, 1)',
            },
            {
                label: 'Profiles completed',
                data: [
                    calcValue(scoreSetTwitter.profilesCompleted, total.profilesCompleted),
                    calcValue(scoreSetYoutube.profilesCompleted, total.profilesCompleted),
                    scoreSetFacebook?.profilesCompleted || 0,
                    scoreSetInstagram?.profilesCompleted || 0
                ],
                backgroundColor: 'rgba(7, 59, 76, 0.2)',
                borderColor: 'rgba(7, 59, 76, 1)',
            }
        ],
    };

    return <Bar options={options} data={data} />;
}

const calcValue = (setValue: number, totalValue: number): number => {
    return (setValue / totalValue) * 100;
}

export default SmProfilesBar