import React from 'react';
import { Box, Text, Link } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box mt={4} py={4} borderTop="1px" borderColor="gray.200" textAlign="center">
      <Text>
        Made by{" "}
        <Link href="https://twitter.com/doctor_solana" isExternal color="blue.500">
          @doctor.sol
        </Link>
      </Text>
    </Box>
  );
}

export default Footer;
