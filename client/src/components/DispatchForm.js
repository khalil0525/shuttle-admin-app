import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useSnackbar } from "../context/SnackbarProvider";

const OnCallExperienceOptions = {
  NothingUneventful: "Nothing/Entirely Uneventful",
  LateToBlock: "Driver(s) Late to Block",
  CompletelyAbsent: "Driver(s) Completely Absent to Block",
  Accident: "Accident",
  Breakdown: "Breakdown",
  Injury: "Injury",
  UnprofessionalConduct: "Unprofessional Driver Conduct",
  CanceledLateRuns: "Canceled/Very Late Runs",
  OtherIssues: "Other Issue(s)",
};

const DispatchForm = () => {
  const { showSuccessToast, showErrorToast } = useSnackbar();
  const [dateOfDispatch, setDateOfDispatch] = useState(null);
  const [timeOfDispatchStart, setTimeOfDispatchStart] = useState(null);
  const [timeOfDispatchEnd, setTimeOfDispatchEnd] = useState(null);
  const [onCallExperience, setOnCallExperience] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [hasFullRuns, setHasFullRuns] = useState("");
  const [fullRuns, setFullRuns] = useState([]);
  const [requiresFollowUp, setRequiresFollowUp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (e) => {
    setDateOfDispatch(e.target.value);
  };

  const handleTimeChange = (field, e) => {
    if (field === "start") {
      setTimeOfDispatchStart(e.target.value);
    } else if (field === "end") {
      setTimeOfDispatchEnd(e.target.value);
    }
  };

  const handleOnCallExperienceChange = (e) => {
    setOnCallExperience(e.target.value);
    setAdditionalInfo("");
  };

  const handleFullRunsChange = (e) => {
    setHasFullRuns(e.target.value);
  };

  const handleAddFullRun = () => {
    setFullRuns([
      ...fullRuns,
      { name: "", passengersLeftBehind: "", time: "" },
    ]);
  };

  const handleFullRunTextChange = (field, index, e) => {
    const updatedFullRuns = [...fullRuns];
    updatedFullRuns[index][field] = e.target.value;
    setFullRuns(updatedFullRuns);
  };

  const handleRequiresFollowUpChange = (e) => {
    setRequiresFollowUp(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (
      !dateOfDispatch ||
      !timeOfDispatchStart ||
      !timeOfDispatchEnd ||
      !onCallExperience
    ) {
      showErrorToast("Validation error: Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("/api/reports", {
        dateOfDispatch,
        report: {
          timeOfDispatchStart,
          timeOfDispatchEnd,
          onCallExperience,
          additionalComments: additionalInfo,
          hasFullRuns,
          requiresFollowUp,
        },
        fullRuns,
      });

      setDateOfDispatch(null);
      setTimeOfDispatchStart(null);
      setTimeOfDispatchEnd(null);
      setOnCallExperience("");
      setAdditionalInfo("");
      setHasFullRuns("");
      setFullRuns([]);
      setRequiresFollowUp("");
      showSuccessToast("Report successfully sent");
    } catch (error) {
      console.error("Submission error:", error);
      showErrorToast(error.response.data.error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const isSubmitButtonDisabled = () => {
    return (
      !dateOfDispatch ||
      !timeOfDispatchStart ||
      !timeOfDispatchEnd ||
      !onCallExperience ||
      (hasFullRuns &&
        fullRuns.some(
          (run) =>
            !run.name ||
            !run.time ||
            run.passengersLeftBehind === "" ||
            isNaN(run.passengersLeftBehind)
        )) ||
      requiresFollowUp === "" ||
      hasFullRuns === ""
    );
  };

  return (
    <Box
      maxW={{ base: "100%", md: "800px" }}
      mx="auto"
      mt="8"
      p="4"
      bg="compBg"
      boxShadow="md"
      borderRadius="md"
      color="text">
      <Heading
        mb="4"
        fontSize={{ base: "xl", md: "2xl" }}>
        Report
      </Heading>
      <FormControl
        mb="4"
        isRequired>
        <FormLabel fontSize="md">Date of Dispatch:</FormLabel>
        <Input
          type="date"
          value={dateOfDispatch}
          onChange={handleDateChange}
          colorScheme="teal"
        />
      </FormControl>
      <FormControl
        mb="4"
        isRequired>
        <FormLabel fontSize="md">Time of Dispatch:</FormLabel>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Input
            type="time"
            value={timeOfDispatchStart}
            onChange={(e) => handleTimeChange("start", e)}
            colorScheme="teal"
          />
          <Text>to</Text>
          <Input
            type="time"
            value={timeOfDispatchEnd}
            onChange={(e) => handleTimeChange("end", e)}
            colorScheme="teal"
          />
        </Box>
      </FormControl>

      <FormControl
        mb="4"
        isRequired>
        <FormLabel fontSize="md">On-Call Dispatch Experience:</FormLabel>
        <Select
          placeholder="Select an option"
          value={onCallExperience}
          onChange={handleOnCallExperienceChange}
          colorScheme="teal">
          {Object.values(OnCallExperienceOptions).map((option) => (
            <option
              key={option}
              value={option}>
              {option}
            </option>
          ))}
        </Select>
      </FormControl>
      {onCallExperience &&
        onCallExperience !== OnCallExperienceOptions.NothingUneventful && (
          <FormControl
            mb="4"
            isRequired>
            <FormLabel fontSize="md">Additional Information:</FormLabel>
            <Textarea
              placeholder="Enter additional information"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              size="md"
              minH="100px"
            />
          </FormControl>
        )}
      <FormControl
        mb="4"
        isRequired>
        <FormLabel fontSize="md">
          Do you have any full runs to report?
        </FormLabel>
        <Select
          placeholder="Select an option"
          value={hasFullRuns}
          onChange={handleFullRunsChange}
          colorScheme="teal">
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </Select>
      </FormControl>
      {hasFullRuns && (
        <>
          {fullRuns.map((fullRun, index) => (
            <FormControl
              key={index}
              mb="4">
              <FormLabel fontSize="md">{`Full Run #${index + 1}`}</FormLabel>
              <Flex direction={{ base: "column", md: "row" }}>
                <Input
                  mb={{ base: "2", md: "0" }}
                  placeholder="Full Run Route Name"
                  value={fullRun.name}
                  onChange={(e) => handleFullRunTextChange("name", index, e)}
                  colorScheme="teal"
                />
                <Input
                  ml={{ base: "0", md: "2" }}
                  mb={{ base: "2", md: "0" }}
                  type="time"
                  value={fullRun.time}
                  onChange={(e) => handleFullRunTextChange("time", index, e)}
                  colorScheme="teal"
                />
                <Input
                  ml={{ base: "0", md: "2" }}
                  placeholder="Amount of Passengers Left Behind"
                  value={fullRun.passengersLeftBehind}
                  onChange={(e) =>
                    handleFullRunTextChange("passengersLeftBehind", index, e)
                  }
                  colorScheme="teal"
                />
              </Flex>
            </FormControl>
          ))}
          <Button
            onClick={handleAddFullRun}
            colorScheme="teal"
            mt="2"
            w="100%">
            Add Another Full Run
          </Button>
        </>
      )}
      <FormControl
        mb="4"
        isRequired>
        <FormLabel fontSize="md">
          Does your response require immediate follow-up from a Coordinator
          and/or the Director?
        </FormLabel>
        <Select
          placeholder="Select an option"
          value={requiresFollowUp}
          onChange={handleRequiresFollowUpChange}
          colorScheme="teal">
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </Select>
      </FormControl>
      <Button
        mt="4"
        colorScheme="teal"
        onClick={handleSubmit}
        w="100%"
        isLoading={isSubmitting}
        isDisabled={isSubmitButtonDisabled()}
        loadingText="Submitting...">
        Submit
      </Button>
    </Box>
  );
};

export default DispatchForm;
