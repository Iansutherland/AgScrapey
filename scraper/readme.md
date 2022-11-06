#Project
This scrapes [Hero Bullion](https://www.herobullion.com/) for silver round pricing

It uses a [pocketbase](https://pocketbase.io/) backend and a scheduled task to run the scraper

##[PocketBase](https://pocketbase.io/)
pocketbase runs in docker, see npm scripts for the run command
the schema is simple and can be viewed as a pocketbase import/export json object in the /db directory
<details>
<summary>View Schema</summary>

{  "name": "text",
<br>
  "inStock": "bool",
<br>
  "rating": "text",
<br>
  "price": "number",
<br>
  "url": "text",
<br>
  "weight": "number",
<br>
  "metric": "text",
  }

</details>