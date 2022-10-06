import React from 'react'
import { Radar } from 'react-chartjs-2'
import {
    Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip
} from 'chart.js'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const options = {
    scales: {
        r: {
            angleLines: {
                display: false
            },
            min: 0,
            max: 100,
            ticks: {
                stepSize: 20
            }
        }
    }
}

interface Props {
    institutionName: string
    countryName: string
    labels: string[]
    dataInstitution: number[]
    dataCountry: number[]
}

const SmRadar: React.FC<Props> = ({ institutionName, countryName, labels, dataInstitution, dataCountry }: Props) => {

    const data = {
        labels: labels,
        datasets: [
            {
                label: institutionName,
                data: dataInstitution,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: `Universities in ${countryName} on average`,
                data: dataCountry,
                backgroundColor: 'rgba(99, 255, 132, 0.2)',
                borderColor: 'rgba(99, 255, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Radar
                data={data}
                options={options}
            />
        </div>
    )
}

export default SmRadar;