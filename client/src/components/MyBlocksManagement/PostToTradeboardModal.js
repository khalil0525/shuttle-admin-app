import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Text,
} from "@chakra-ui/react";

const PostToTradeboardModal = ({
  isOpen,
  onClose,
  handleConfirmPost,
  user,
  postText,
  setPostText,
  isLoading,
  isOnTradeboard,
}) => {
  const handleTextareaChange = (event) => {
    const value = event.target.value;

    if (value.length <= 200) {
      setPostText(value);
    }
  };

  const handleConfirm = () => {
    handleConfirmPost();
    setPostText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isOnTradeboard ? "Remove from " : "Post to"} tradeboard
        </ModalHeader>
        <ModalBody>
          {!isOnTradeboard ? (
            <>
              <Textarea
                placeholder="Post description (optional)"
                value={postText}
                onChange={handleTextareaChange}
                maxLength={200}
                resize="vertical"
                mb={4}
              />
            </>
          ) : (
            <Text>
              Are you sure you want to remove block from the tradeboard?
            </Text>
          )}
        </ModalBody>
        <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
          <Button
            colorScheme={isOnTradeboard ? "red" : "blue"}
            onClick={handleConfirm}
            isDisabled={isLoading}>
            {isOnTradeboard ? "Remove" : "Post"}
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

export default PostToTradeboardModal;
