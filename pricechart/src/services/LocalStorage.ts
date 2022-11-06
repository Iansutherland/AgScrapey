export default class LocalStorageRepo {
    SilverFullListCacheKey = 'SilverFullList';
    get(key: string) {
        return localStorage.getItem(key);
    }

    set(key: string, value: any) {
        localStorage.setItem(key, typeof (value) === 'string' ? value : JSON.stringify(value));
    }

    SetCache(cache: CacheItem) {
        const payload = {
            expiration: cache.expiration,
            cache: cache.cache
        }
        this.set(cache.key, payload);
    }

    GetCache(key: string) {
        const obj: string | null = this.get(key);
        if (obj !== null) {
            const parsed: CacheItem = JSON.parse(obj);
            if (parsed.expiration !== null) {
                if (new Date().getTime() < new Date(parsed?.expiration).getTime()) {
                    return parsed.cache;
                }
            }
        }
        return null;
    }

    GetSilverFullListCache() {
        const result = this.GetCache(this.SilverFullListCacheKey);
        if(result){
            console.log(`using cache for ${this.SilverFullListCacheKey}`);
            return result;
        }
        return null;
    }

    SetSilverFullListCache(toCache: any) {
        this.SetCache({
            key:this.SilverFullListCacheKey,
            cache: toCache,
            expiration: this.Tomorrow()} as CacheItem)
    }

    Tomorrow() {
        const today = new Date()
        const tomorrow = new Date(today)
        return tomorrow.setDate(tomorrow.getDate() + 1)
    }
}

export interface CacheItem {
    key: string,
    cache: any,
    expiration: number
}