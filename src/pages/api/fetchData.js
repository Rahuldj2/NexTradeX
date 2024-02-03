import Cors from 'cors';
import initMiddleware from '../../lib/cors';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

export default async function handler(req, res) {
  await cors(req, res);
  // 0x23fb658c1698b92f5fe511a079c17ecf7965cbc3f1b873328c67e2c3c0820f1f
  try {
    const response = await fetch('https://deep-index.moralis.io/api/v2/0x635eD4418Fdf219F8D8A9233AeAA10dc2d77Af0C/events?chain=mumbai&topic=0x23fb658c1698b92f5fe511a079c17ecf7965cbc3f1b873328c67e2c3c0820f1f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjYwMzlhNDBlLWJmMzgtNDlmNS1iODgyLTA5MzU2MDEwNWQ3OSIsIm9yZ0lkIjoiMzc1NTcxIiwidXNlcklkIjoiMzg1OTUwIiwidHlwZUlkIjoiZDM2YTk2MmUtOTViMi00OTUxLTg3MzQtZWQ2MTk2MTk2MTQxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDY5NTU5ODUsImV4cCI6NDg2MjcxNTk4NX0.KtftUebcmVBdG61XeUqBjO96tT5h79PARwPFUn3bKsw',
      },
      body:JSON.stringify( {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "id",
            "type": "uint256",
            "internal_type": "uint256"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "address",
            "internal_type": "address"
          },
          {
            "indexed": false,
            "name": "price",
            "type": "uint256",
            "internal_type": "uint256"
          }
        ],
        "name": "PropertyListed",
        "type": "event"
      }),
    });

    const data = await response.json();
    // console.log('Data:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
