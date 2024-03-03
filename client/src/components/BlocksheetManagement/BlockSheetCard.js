import React from "react";
import { Box, Text } from "@chakra-ui/react";

const BlockSheetCard = ({ block, typeOptions, setEditBlock, user }) => {
  const getFormattedTime = (time) => {
    const formattedTime = new Date(`2000-01-01T${time}`);
    return formattedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startTime = getFormattedTime(block.startTime);
  const endTime = getFormattedTime(block.endTime);

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        if (user.isAdmin) setEditBlock(block);
      }}
      cursor={user.isAdmin ? "pointer" : "unset"}
      borderWidth="1px"
      maxWidth={{ base: "88vw", sm: "300px" }} // Adjusted maxWidth for mobile devices
      minWidth={{ base: "88vw", sm: "150px" }}
      bg={
        typeOptions.find((opt) => opt.value === block.type)?.color ||
        typeOptions.find((opt) => opt.value === block.type)?.gradient
      }
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      textAlign="center">
      <Text
        fontWeight="bold"
        fontSize="sm"
        color="#276AB3">
        {block.name}
      </Text>

      <Text
        fontSize="sm"
        fontWeight="regular"
        color="#000">
        {startTime} - {endTime}
      </Text>

      {block.user && (
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="#000">
          {block.user.name}
        </Text>
      )}
    </Box>
  );
};

export default BlockSheetCard;
