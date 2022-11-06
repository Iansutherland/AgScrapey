import PocketBase from 'pocketbase';
import LocalStorageRepo from './LocalStorage';

export default class PocketService {
  /**
   * A service to communicate with backend
   **/
  constructor() {
    if (PocketService.instance) {
      throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
    }
    this.client = new PocketBase('http://127.0.0.1:8080');
    this.cache = new LocalStorageRepo();
  }

  private client: PocketBase;
  private cache: LocalStorageRepo;
  private static instance: PocketService = new PocketService();

  static getInstance(): PocketService {
    return PocketService.instance;
  }

  async init() {
    //log into pocketbase
    if (!this.client.authStore.isValid) {
      const adminAuthData = await this.client.admins.authViaEmail('iansutherland.az@gmail.com', 'wjGnJZ8cpqC4iBN');
    }
  }

  async GetCoinByName(name: string): Promise<any[]> {
    const records = await this.client.records.getFullList('silver', 200 /* batch size */, {
      sort: '-created',
      filter: `name=${name}`
    });
    console.log(records)
    return records;
  }

  async GetCoinHistoryByName(name: string): Promise<any[]> {
    const items = await this.GetFullSilverList();
    return items.filter(x => x.name === name);
  }

  async GetFullSilverList(): Promise<any[]> {
    const cached: any[] = this.cache.GetSilverFullListCache();
    if (cached) {
      return cached;
    }
    // alternatively you can also fetch all records at once via getFullList:
    const records = await this.client.records.getFullList('silver', 200 /* batch size */, {
      sort: '-created',
      filter: ''
    });
    this.cache.SetSilverFullListCache(records);
    return records
  }

  Pocket2ChartData(records: Record[]){
    return records.map(x => {
      return{
        name: x.name,
        value: x.price
      };
    })
  }

  async ProcessFullListToAverage(records: any[]) {
    //as the scraper runs everyday, there will be multiple entries per coin
    //arrange coins into a mapping of Name: arry[] of all the coins with that name
    const coinDictKeys = records.map(x => x.name);
    const coinDict = coinDictKeys.map(x => {
      return {
        "name": x, "records": records.filter(i => i.name == x)
          .map(x => {
            return {
              id: x.id,
              name: x.name,
              value: x.price,
              priceDesc: `${x.weight} ${x.metric}`,
              url: x.url,
              inStock: x.inStock
            }
          })
      };
    });
    const mapped = coinDict.map((x, i) => {
      const newVal = this.getAverage(x.records.map(x => x.value));
      const available = x.records.map(i => i.inStock).filter(j => j === true).length;
      return {
        id: i,
        name: x.name,
        value: newVal,
        priceDesc: x.records[0].priceDesc,
        url: x.records[0].url,
        inStock: available > 0 ? true : false
      }
    })
    return mapped;
  }

  getAverage(data: number[]) {
    return data.reduce((a, b) => a + b) / data.length;
  }

}

export interface Record {
  collectionId: string,
  collectionName: string,
  expand: {},
  created: string,
  id: string,
  inStock: false,
  metric: string,
  name: string,
  price: number,
  rating: string,
  updated: string,
  url: string,
  weight: number
}