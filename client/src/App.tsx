import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid } from "@chakra-ui/react";
import axios from 'axios';
import Chart from './Chart';
import PayoutCalculator from './PayoutCalculator';

interface BalanceData {
  blockTime: Date;
  DCFFeeWalletBalance: number;
  DCFHouseWalletBalance: number;
  DCDFeeWalletBalance: number;
  DCDHouseWalletBalance: number;
}

function App() {
  const [data, setData] = useState<BalanceData[]>([]);

  useEffect(() => {
  axios.get('https://209.38.229.113.nip.io:3003/latest-date')
    .then(response => {
      const latestBlockTime = response.data.latestBlockTime;
      const start = latestBlockTime - 30 * 24 * 60 * 60; 
      const url = `https://209.38.229.113.nip.io:3003/balances/range?start=${start}&end=${latestBlockTime}`;
      
      axios.get(url)
        .then(response => {
          const balancesData = response.data.balances.map((item: any) => ({
            ...item,
            blockTime: new Date(item.blockTime * 1000),
          }));
          setData(balancesData);
        })
        .catch(error => {
          console.error("Error in fetching data", error);
        });
    })
    .catch(error => {
      console.error("Error in fetching latest date", error);
    });
}, []);

  
  const totalBalance = data.length > 0 ? data[0].DCFFeeWalletBalance + data[0].DCDFeeWalletBalance : 0;

  return (
    <Box maxW="container.xl" p={4} mx="auto">
      <PayoutCalculator totalBalance={totalBalance} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Chart title="DCF Fee Wallet Balance" data={data} dataKey="DCFFeeWalletBalance" />
        <Chart title="DCF House Wallet Balance" data={data} dataKey="DCFHouseWalletBalance" />
        <Chart title="DCD Fee Wallet Balance" data={data} dataKey="DCDFeeWalletBalance" />
        <Chart title="DCD House Wallet Balance" data={data} dataKey="DCDHouseWalletBalance" />
      </SimpleGrid>
    </Box>
  );
}

export default App;
