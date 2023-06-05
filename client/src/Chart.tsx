import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Heading } from "@chakra-ui/react";
import moment from 'moment';

type ChartProps = {
  title: string;
  data: any[];
  dataKey: string;
};

const Chart: React.FC<ChartProps> = ({ title, data, dataKey }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" background={"#16182e"}>
      <Heading as="h3" size="lg" mb={4}>{title}</Heading>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="blockTime" tickFormatter={(unixTime) => moment(unixTime).format('DD/MM/YYYY')} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#ffaf01" strokeWidth={4} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
