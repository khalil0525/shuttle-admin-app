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
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';

const ExportCSVModal = ({ isOpen, onClose, handleExportCSV }) => {
  const [exportOption, setExportOption] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const exportCSV = () => {
    if (exportOption === 'all') {
      handleExportCSV();
    } else {
      handleExportCSV(startDate, endDate);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export to CSV</ModalHeader>
        <ModalBody>
          <FormControl as="fieldset">
            <FormLabel as="legend">Export Option</FormLabel>
            <RadioGroup
              value={exportOption}
              onChange={(value) => setExportOption(value)}>
              <Stack direction="row">
                <Radio value="all">All Results</Radio>
                <Radio value="dateRange">Date Range</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          {exportOption === 'dateRange' && (
            <>
              <FormControl mb={4}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
          <Button
            colorScheme="teal"
            onClick={exportCSV}>
            Export
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

export default ExportCSVModal;
