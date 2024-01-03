import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

const ConfirmDeletionModal = ({ isOpen, onClose, handleDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this item?</ModalBody>
        <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
          <Button
            colorScheme="red"
            onClick={handleDelete}>
            Delete
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

export default ConfirmDeletionModal;
