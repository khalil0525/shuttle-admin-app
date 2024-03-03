import React, { useState } from "react";
import {
  Box,
  Text,
  HStack,
  Badge,
  Button,
  Icon,
  Collapse,
} from "@chakra-ui/react";
import { MdAccessTime, MdEventNote } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import dayjs from "dayjs";

const ViewBlock = ({ block, typeOptions, isLoading, user }) => {
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [isTradeboardNoteExpanded, setIsTradeboardNoteExpanded] =
    useState(false);

  const getTypeLabel = () =>
    typeOptions.find((opt) => opt.value === block.type)?.label;

  const getFormattedTime = (time) => {
    const formattedTime = new Date(`2000-01-01T${time}`);
    return formattedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startTime = getFormattedTime(block.startTime);
  const endTime = getFormattedTime(block.endTime);

  const duration = dayjs(block.endTime).diff(
    dayjs(block.startTime),
    "hours",
    true
  );

  return (
    <Box
      key={block.id}
      borderWidth="1px"
      borderRadius="sm"
      p={4}
      maxWidth="300px"
      minWidth="200px"
      width="100%"
      bg={
        typeOptions.find((opt) => opt.value === block.type)?.color ||
        typeOptions.find((opt) => opt.value === block.type)?.gradient
      }
      mb={4}
      boxShadow="sm">
      <Text
        fontWeight="bold"
        fontSize="lg"
        color="blue">
        {block.name}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="semibold">
        Type: {getTypeLabel()}
      </Text>
      {block.user && (
        <Text
          fontSize="xs"
          fontWeight="semibold">
          Owner: {block.user.name}
        </Text>
      )}
      <HStack align="center">
        <Icon as={MdEventNote} />
        {block.date && (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            display="flex"
            alignItems="center">
            {dayjs(block.date).format("YYYY-MM-DD")}
          </Text>
        )}
      </HStack>
      <HStack align="center">
        <Icon as={MdAccessTime} />
        <Text
          fontSize="xs"
          fontWeight="semibold">
          {startTime} - {endTime}
        </Text>
      </HStack>
      {block.blocksheetNote && (
        <>
          <Text
            fontSize="sm"
            mt={2}
            fontWeight="bold"
            onClick={() => setIsNoteExpanded(!isNoteExpanded)}>
            {isNoteExpanded ? "-" : "+"} Notes
          </Text>
          <Collapse
            in={isNoteExpanded}
            animateOpacity>
            <Text
              fontSize="sm"
              mt={2}>
              {block.blocksheetNote}
            </Text>
          </Collapse>
        </>
      )}
      {block.tradeboardNote && (
        <>
          <Text
            fontSize="sm"
            mt={2}
            fontWeight="bold"
            onClick={() =>
              setIsTradeboardNoteExpanded(!isTradeboardNoteExpanded)
            }>
            {isTradeboardNoteExpanded ? "-" : "+"} Tradeboard Notes
          </Text>
          <Collapse
            in={isTradeboardNoteExpanded}
            animateOpacity>
            <Text
              fontSize="sm"
              mt={2}>
              {block.tradeboardNote}
            </Text>
          </Collapse>
        </>
      )}
      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="space-between">
        <Button
          isDisabled={isLoading || block.user?.id === user.id}
          size="sm"
          mt={4}
          p={1}
          color="text"
          bgColor={
            block.user
              ? "blue.400"
              : block.showOnTradeboard
              ? "red.500"
              : "green.500"
          }
          _hover={{
            bgColor: block.user
              ? "unset"
              : block.showOnTradeboard
              ? "red.600"
              : "green.600",
          }}
          leftIcon={
            block.user ? null : block.showOnTradeboard ? (
              <FaMinus />
            ) : (
              <FaPlus />
            )
          }>
          {block.user ? "Take" : "Trade"}
        </Button>
        <Text
          fontSize="sm"
          fontWeight="bold">
          {duration.toFixed(2)} hours
        </Text>
      </Box>
    </Box>
  );
};

export default ViewBlock;
