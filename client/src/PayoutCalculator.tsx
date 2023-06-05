import React, { useState, useEffect } from "react";
import { Box, Input, Text, Flex, Image } from "@chakra-ui/react";

interface PayoutCalculatorProps {
  totalBalance: number;
}

const TEAM_MARKETING_RESERVE_PERCENTAGE = 0.46;
const NFT_HOLDERS_PERCENTAGE = 0.54;

const PayoutCalculator: React.FC<PayoutCalculatorProps> = ({
  totalBalance,
}) => {
  const [nftsOwned, setNftsOwned] = useState(0);
  const teamMarketingReserve = totalBalance * TEAM_MARKETING_RESERVE_PERCENTAGE;
  const nftHolders = totalBalance * NFT_HOLDERS_PERCENTAGE;
  const payoutPerNft = nftHolders / 20000;
  let payoutForOwnedNfts = payoutPerNft * nftsOwned;

  useEffect(() => {
    payoutForOwnedNfts = payoutPerNft * nftsOwned;
  }, [nftsOwned, payoutPerNft]);

  return (
    <Box>
      <Flex direction="row" justify="center" align="center" my={4}>
        <Box
        background={"#16182e"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="lg"
          mx={2}
        >
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Total Made
          </Text>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            {totalBalance.toFixed(0)} SOL
          </Text>
        </Box>
        <Text fontSize="xl">-</Text>
        <Box
        background={"#16182e"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="lg"
          mx={2}
        >
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Team, Marketing, Reserve
          </Text>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            {teamMarketingReserve.toFixed(0)} SOL
          </Text>
        </Box>
        <Text fontSize="xl">=</Text>
        <Box
        background={"#16182e"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="lg"
          mx={2}
        >
          <Text fontSize="sm" color="gray.500" textAlign="center">
            NFT Holders
          </Text>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            {nftHolders.toFixed(0)} SOL
          </Text>
        </Box>
      </Flex>

      <Box
      background={"#16182e"}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        boxShadow="lg"
        textAlign="center"
       marginBottom={4}
      >
        <Flex direction="row" align="center" justify="center" mb={4}>
          <Text fontSize="50px" fontWeight="bold">
            1
          </Text>
          <Image
            className="logo"
            src="/cat.png"
            alt="Logo"
            boxSize="50px"
            ml={2}
            mr={2}
          />
          <Text fontSize="50px" fontWeight="bold">
            = {payoutPerNft.toFixed(4)} SOL
          </Text>
        </Flex>
        <Box>
          <Input
           maxW={400}
            placeholder="Enter NFTs owned"
            onChange={(e) => setNftsOwned(Number(e.target.value))}
          />
        </Box>
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Payout for owned NFTs: {payoutForOwnedNfts.toFixed(2)} SOL
        </Text>
      </Box>
    </Box>
  );
};

export default PayoutCalculator;
