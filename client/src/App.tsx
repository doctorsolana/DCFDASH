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
    console.log("useEffect is being called");  // Added log
    const start = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60; 
    const end = Math.floor(Date.now() / 1000); 
    const url = `http://localhost:3001/balances/range?start=${start}&end=${end}`;
    console.log("URL to fetch", url);  // Added log
    axios.get(url)
      .then(response => {
        console.log("Successful response", response);  // Added log
        const balancesData = response.data.balances.map((item: any) => ({
          ...item,
          blockTime: new Date(item.blockTime * 1000),
        }));
        setData(balancesData);
      })
      .catch(error => {
        console.error("Error in fetching data", error);  // Added log
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
