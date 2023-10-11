## edgeware-supply

A serverless vercel service for retrieving Edgeware parameters related to issuance/supply. 

Using [https://edg-supply.vercel.app/](https://edg-supply.vercel.app/) will only return the total supply in plaintext. For example:

```
7835682300
```


While there are three optional query parameters as follows:

- Using [https://edg-supply.vercel.app/?all=value](https://edg-supply.vercel.app/?all=value) will return the current total supply, circulating supply, and treasury balance in JSON format. For example:

```
{"total_supply":"7835682300","circulating_supply":"7217163675","treasury_supply":"618518624"}
```


- Using [https://edg-supply.vercel.app/?circulating=value](https://edg-supply.vercel.app/?circulating=value) will return the current circulating supply in plaintext. For example:

```
7217163675
```


- Using [https://edg-supply.vercel.app/?treasury=value](https://edg-supply.vercel.app/?treasury=value) will return the current treasury balance in plaintext. For example:

```
618518624
```


### Installing

- yarn install
- Set up a Vercel account

### Deploying

- git clone this repository
- `vercel --prod`
