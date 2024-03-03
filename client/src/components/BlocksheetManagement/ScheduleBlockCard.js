import React, { useState } from "react";
import { Box, Text, HStack, Button, Icon, Collapse } from "@chakra-ui/react";
import { MdAccessTime, MdEventNote } from "react-icons/md";
import dayjs from "dayjs";
import { FaPlus, FaMinus } from "react-icons/fa";

const ScheduleBlockCard = ({
  block,
  typeOptions,
  handleButtonClick,
  isLoading,
  user,
  setEditBlock,
}) => {
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

  const parseTimeWithAMPM = (timeString) => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    const parsedHours =
      period === "PM" ? parseInt(hours) + 12 : parseInt(hours);

    return dayjs()
      .set("hours", parsedHours)
      .set("minutes", parseInt(minutes))
      .set("seconds", parseInt(seconds));
  };

  const startTime = getFormattedTime(block.startTime);
  const endTime = getFormattedTime(block.endTime);

  const duration = parseTimeWithAMPM(block.endTime).diff(
    parseTimeWithAMPM(block.startTime),
    "hours",
    true
  );

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        if (user.isAdmin) setEditBlock(block);
      }}
      cursor={user.isAdmin ? "pointer" : "unset"}
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
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      textAlign="left">
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
      <Box
        borderLeft="1px solid #000"
        p="4px"
        mt={2}
        mb={2}>
        <HStack align="center">
          <Icon as={MdEventNote} />
          {block.date && (
            <Text
              fontSize="xs"
              fontWeight="semibold"
              display="flex"
              alignItems="center">
              {dayjs(block.date).format("MM-DD-YYYY")}
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
      </Box>
      {block.description && (
        <>
          <Text
            fontSize="sm"
            mt={2}
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsNoteExpanded(!isNoteExpanded);
            }}>
            {isNoteExpanded ? "-" : "+"} Details
          </Text>
          <Collapse
            in={isNoteExpanded}
            animateOpacity>
            <Text
              fontSize="sm"
              mt={2}>
              {block.description}
            </Text>
          </Collapse>
        </>
      )}
      {block.tradeboardNote && (
        <>
          <Text
            fontSize="sm"
            fontWeight="bold"
            cursor="pointer"
            mt={2}
            onClick={() =>
              setIsTradeboardNoteExpanded(!isTradeboardNoteExpanded)
            }>
            {isNoteExpanded ? "-" : "+"} Details
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
          isDisabled={
            isLoading || (block.user?.id === user.id && block.showOnTradeboard)
          }
          size="sm"
          mt={4}
          p={1}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick(block.id);
          }}
          color="text"
          bgColor={
            block.user?.id
              ? "blue.400"
              : block.showOnTradeboard
              ? "red.500"
              : "green.500"
          }
          _hover={{
            bgColor: block.user?.id
              ? "unset"
              : block.showOnTradeboard
              ? "red.600"
              : "green.600",
          }}>
          Take
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

export default ScheduleBlockCard;
