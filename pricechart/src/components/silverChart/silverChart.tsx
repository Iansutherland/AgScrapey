import { LineChart, Line, CartesianGrid, XAxis, YAxis, AreaChart, Area, Tooltip, BarChart, Bar, Legend } from 'recharts';
import IChartLineInfo from '../../models/IChartLineInfo'
//https://recharts.org/en-US/api
export default function SilverLineChart(props: { data: any }) {
    return (
        <LineChart width={400} height={400} data={props.data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <YAxis />
        </LineChart>
    );
}

export function SilverAreaChart(props: { data: any }) {
    return (
        <AreaChart width={730} height={250} data={props.data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis dataKey="name" hide={true}/>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
    );
}

export function SilverBarChart(props: any) {
    return (
        <BarChart width={730} height={250} data={props.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={90} hide={true}/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#8884d8" />
        </BarChart>
    );
}