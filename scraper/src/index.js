
import cheerio from 'cheerio';
import Get from './fetchHelper.js';
import fetch from 'cross-fetch';
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}
import PocketBase from 'pocketbase';
import cron from 'node-cron';


async function RunScrape() {
    const url = new URL('https://www.herobullion.com/silver/silver-rounds/1-oz-silver-rounds/');
    var response = await Get(url);

    const mainPage = cheerio.load(response);
    const coinInfo = [];
    //pocketbase client
    const client = new PocketBase('http://127.0.0.1:8080');
    //log into pocketbase
    const adminAuthData = await
        client.admins.authViaEmail('iansutherland.az@gmail.com', 'wjGnJZ8cpqC4iBN');
    //use $ like jQuery
    //css selector
    mainPage('.product > a').each(async (i, anchor) => {
        const anchorElem = mainPage(anchor);
        const href = anchorElem[0].attribs.href;

        const header2 = anchorElem.children('h2').text();
        const starRating = anchorElem.children('.star-rating').text();
        const inStock = anchorElem.children('p')
            .text().toLowerCase() === 'in stock' ? true : false;
        const priceRegex = new RegExp(/^As low as \$?([0-9]+\.[0-9][0-9])?/, 'g');
        const price = anchorElem.children('.price').text();
        const priceMatch = priceRegex.exec(price);
        const payload = {
            name: header2,
            inStock: inStock,
            rating: starRating,
            price: parseFloat(priceMatch[1]),
            url: href,
            weight: 1,
            metric: 'oz'
        };

        coinInfo.push(payload);
    });
    let successful = [];
    let count = 0;
    try {
        await Promise.all(coinInfo.map(async (x, i) => {
            //had to send a cancel key, otherwise the pocketbase library cancels all create requests
            //because it thinks they're duplicates
            const record = await client.records.create('silver', x, { '$cancelKey': x.name });
            successful.push(record);
            console.log(`pushed ${record.name}: ${record.price}`)
            count = i;
        })).catch(e => console.log(e))
    }
    catch (err) {
        console.log(`error on ${count}:`);
        console.log(coinInfo[count]);
        console.log(err);
    }
    finally {
        console.log(`added ${successful.length}/${coinInfo.length} coins 💿`);
        Run();
    }

}

function Run() {
    //run every first minute of every first hour of everyday
    cron.schedule('0 0 * * *', async () => {
        await RunScrape();
    });
}

console.log('Waiting for job start...');
Run();