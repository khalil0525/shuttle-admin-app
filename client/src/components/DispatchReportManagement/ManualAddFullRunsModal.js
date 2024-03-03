import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react';

const ManualAddFullRunsModal = ({
  isOpen,
  onClose,
  modalData,
  setModalData,
  handleModalSubmit,
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!modalData.name.trim()) {
      newErrors.name = 'Run Name is required';
    }
    if (!modalData.date) {
      newErrors.date = 'Date is required';
    }
    if (!modalData.time) {
      newErrors.time = 'Time is required';
    }
    if (
      isNaN(modalData.passengersLeftBehind) ||
      modalData.passengersLeftBehind < 0
    ) {
      newErrors.passengersLeftBehind =
        'Number of Passengers Left Behind must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleModalSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manually Add Full Runs</ModalHeader>
        <ModalBody>
          <FormControl
            mb={4}
            isInvalid={!!errors.name}>
            <FormLabel>Run Name</FormLabel>
            <Input
              type="text"
              value={modalData.name}
              onChange={(e) =>
                setModalData({ ...modalData, name: e.target.value })
              }
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl
            mb={4}
            isInvalid={!!errors.date}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={modalData.date}
              onChange={(e) =>
                setModalData({ ...modalData, date: e.target.value })
              }
            />
            <FormErrorMessage>{errors.date}</FormErrorMessage>
          </FormControl>
          <FormControl
            mb={4}
            isInvalid={!!errors.time}>
            <FormLabel>Time</FormLabel>
            <Input
              type="time"
              value={modalData.time}
              onChange={(e) =>
                setModalData({ ...modalData, time: e.target.value })
              }
            />
            <FormErrorMessage>{errors.time}</FormErrorMessage>
          </FormControl>
          <FormControl
            mb={4}
            isInvalid={!!errors.passengersLeftBehind}>
            <FormLabel>Passengers Left Behind</FormLabel>
            <Input
              type="number"
              value={modalData.passengersLeftBehind}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  passengersLeftBehind: parseInt(e.target.value, 10),
                })
              }
            />
            <FormErrorMessage>{errors.passengersLeftBehind}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
          <Button
            colorScheme="teal"
            onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManualAddFullRunsModal;
