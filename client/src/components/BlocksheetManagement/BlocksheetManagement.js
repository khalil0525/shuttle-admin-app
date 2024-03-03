import React, { useState } from "react";
import { Box, Button, Stack, Heading, Divider } from "@chakra-ui/react";

import BlocksheetActionModal from "./BlocksheetActionModal";

const BlocksheetManagement = ({
  handleDeleteBlock,
  openModal,
  updateBlocksheet,
  setEditBlock,
  editBlock,
  setBlocksheetToDeleteId,
  blocksheetToDeleteId,
  isOpen,
  createBlock,
  setNewBlock,
  newBlock,
  users,
  user,
}) => {
  const [selectedBlocksheet, setSelectedBlocksheet] = useState(null);

  const closeModal = () => {
    if (blocksheetToDeleteId) {
      setBlocksheetToDeleteId(null);
    } else {
      setSelectedBlocksheet(null);
      setEditBlock(null);
      openModal(false);
    }
  };
  const resetValues = () => {
    setEditBlock(null);
    setNewBlock({
      type: "",
      term: "",
      date: null,
      startTime: null,
      endTime: null,
      name: "",
      ownerId: null,
    });
    closeModal();
  };
  const handleSaveChanges = async () => {
    try {
      if (editBlock && editBlock.id) {
        await updateBlocksheet();
      } else {
        const createdBlock = await createBlock(newBlock);
        setSelectedBlocksheet(createdBlock);
      }

      resetValues();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack
      spacing={[4, 8]}
      p={[2, 4]}
      boxShadow="md"
      borderRadius="md"
      bg="compBg"
      color="text">
      <Heading
        as="h3"
        size="md"
        mb={4}>
        Block & Schedule Management
      </Heading>
      <Button
        colorScheme="blue"
        onClick={() => openModal(true)}>
        New Block
      </Button>
      <Box>
        <Divider />
      </Box>

      <BlocksheetActionModal
        isOpen={isOpen || editBlock || blocksheetToDeleteId}
        blocksheetToDeleteId={blocksheetToDeleteId}
        handleDeleteBlock={handleDeleteBlock}
        closeModal={closeModal}
        handleSaveChanges={handleSaveChanges}
        newBlock={newBlock}
        setNewBlock={setNewBlock}
        users={users}
        isCreating={true}
        user={user}
      />
    </Stack>
  );
};

export default BlocksheetManagement;
