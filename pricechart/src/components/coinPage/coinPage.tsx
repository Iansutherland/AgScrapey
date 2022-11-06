import { useState, useEffect } from 'react';
import {Grid, Box} from '@mui/material/';
import PocketService from '../../services/pocketService';
import ProductCard from '../ProductCard/ProductCard';
import SilverLineChart, { SilverAreaChart, SilverBarChart } from '../silverChart/silverChart';

export default function CoinPage(props: any) {
    const [data, setData] = useState<any[]>();
    const [averagePrice, setAveragePrice] = useState<number>();
    const [activeCoinName, setActiveCoinName] = useState<string>();
    const [activeCoin, setActiveCoin] = useState<any[]>();
    let client: PocketService;

    //call pocketbase and get prices for chart
    useEffect(() => {
        const Call = async () => {
            //pocketbase client
            client = PocketService.getInstance();
            await client.init();
            const records = await client.GetFullSilverList();

            const sum = records.map(x => x.price).reduce((a, b) => a + b);
            const average = Math.round(sum / records.length);
            setAveragePrice(average);

            const mapped = await client.ProcessFullListToAverage(records);


            setData(mapped.sort((a, b) => a.value - b.value));
        };
        Call();
    }, []);
    //get coin data by name
    useEffect(() => {
        const Call = async () => {
            client = PocketService.getInstance();
            await client.init();
            const records = activeCoinName ? await client.GetCoinHistoryByName(activeCoinName) : undefined;
            if(records){
                console.log(records)
                setActiveCoin(client.Pocket2ChartData(records));
            }
            else
                console.log(`no records: ${records}`)
        }
        Call();
    },[activeCoinName]);


    return (
        <>
            {activeCoin ? <Box><SilverAreaChart 
                data={activeCoin} /></Box> : ''}
            <Grid container spacing={2}>
                {data?.map(x => {
                    return (
                        <Grid item xs={4} key={x.id}>
                            <ProductCard data={x} 
                            signFlipLimit={averagePrice} 
                            onClick={setActiveCoinName} 
                            expandMatch={activeCoinName}/>
                        </Grid>
                    )
                })}
            </Grid>
        </>

    );
}