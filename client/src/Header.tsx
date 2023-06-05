import React from 'react';
import { Box, Text } from "@chakra-ui/react";

interface HeaderProps {
  latestBlockTime: number | null;
}

const Header: React.FC<HeaderProps> = ({ latestBlockTime }) => {
  const formattedTime = latestBlockTime 
    ? new Date(latestBlockTime * 1000).toLocaleString() 
    : 'Loading...';

  return (
    <Box mb={4} textAlign={"center"}>
      <Text fontSize="3xl" fontWeight="bold" mb={2}>
        CatStats.io
      </Text>
      <Text fontSize="small">
        Last updated on block: {latestBlockTime} at {formattedTime}
      </Text>
    </Box>
  );
}

export default Header;
