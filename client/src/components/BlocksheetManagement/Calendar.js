import React from "react";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import ScheduleBlockCard from "./ScheduleBlockCard";
import BlockSheetCard from "./BlockSheetCard";
import { weekDays } from "../data";

const Calendar = ({
  scheduleBlocks,
  typeOptions,
  handleButtonClick,
  isLoading,
  user,
  currentWeekOffset,
  isBlockSheet = false,
  setEditBlock,
  adminPage = false,
}) => {
  const getCurrentWeekDates = () => {
    const currentDate = dayjs().add(currentWeekOffset, "week");
    const startOfWeek = currentDate.startOf("week");
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      weekDates.push(startOfWeek.add(i, "day").format("YYYY-MM-DD"));
    }

    return weekDates.map((date) => dayjs(date).format(" MMM D, YYYY"));
  };

  const currentWeekDates = getCurrentWeekDates();
  const updatedWeekDays = [...weekDays.slice(1), weekDays[0]];
  return (
    <HStack
      spacing={2}
      align="stretch"
      justifyContent="space-evenly"
      h={adminPage ? "50vh" : "75vh"} // You might need to adjust this height
      overflowX="auto"
      width="100%" // Set the width to 100% for mobile
    >
      {updatedWeekDays.map((day, index) => (
        <VStack
          key={1 + index + day}
          alignItems="stretch"
          borderRadius="sm"
          gap="1px"
          width="100%"
          h="100%">
          <Box key={day + index}>
            <Text
              fontWeight="bold"
              fontSize="sm"
              textAlign="center"
              color="text"
              borderWidth="1px">
              {day}
            </Text>
            <Text
              fontWeight="bold"
              fontSize="sm"
              textAlign="center"
              color="text">
              {currentWeekDates[index]}
            </Text>
          </Box>
          <VStack
            key={index + 100 + day}
            alignItems="stretch"
            gap="1px"
            width={{ base: "90vw", sm: "100%" }}
            // borderLeft="1px solid #000"
            // borderRight="1px solid #000"
            h="100%"
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}>
            {scheduleBlocks
              .filter(
                (block) =>
                  dayjs(block.date).day() === index &&
                  dayjs(block.date).isSame(
                    dayjs(currentWeekDates[index]),
                    "day"
                  )
              )
              .map((block) =>
                !isBlockSheet ? (
                  <ScheduleBlockCard
                    key={block.id + "-" + block.name}
                    block={block}
                    typeOptions={typeOptions}
                    handleButtonClick={handleButtonClick}
                    isLoading={isLoading}
                    user={user}
                    setEditBlock={setEditBlock}
                  />
                ) : (
                  <Box
                    m="0"
                    key={block.id + "-" + block.name}>
                    <BlockSheetCard
                      key={block.id + "-" + block.name}
                      block={block}
                      typeOptions={typeOptions}
                      handleButtonClick={handleButtonClick}
                      isLoading={isLoading}
                      user={user}
                      setEditBlock={setEditBlock}
                    />
                  </Box>
                )
              )}
          </VStack>
        </VStack>
      ))}
    </HStack>
  );
};

export default Calendar;
