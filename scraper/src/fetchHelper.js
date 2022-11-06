
export default async function Get(url, getjson = false) {
    const response = await fetch(url);
    if(getjson){
        const r1 = response.clone();
        const results = await Promise.all([response.json(), r1.text()]);
        return results;
    }
    
    return response.text();
}