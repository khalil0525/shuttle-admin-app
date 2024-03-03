import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  FormErrorMessage,
  Textarea,
  Select,
  HStack,
  Text,
} from "@chakra-ui/react";
import { terms, typeOptions } from "../data";

const BlocksheetActionModal = ({
  isOpen,
  closeModal = null,
  handleDeleteBlock = () => {},
  selectedBlocksheet = null,
  editBlock = null,
  setEditBlock = null,
  handleSaveChanges = () => {},

  newBlock = {},
  setNewBlock = () => {},
  users = null,
  isCreating = false,
  user,
  setSelectedBlockId = () => {},
}) => {
  const [isValidNameFormat, setIsValidNameFormat] = React.useState(true);
  const [isTermSelected, setIsTermSelected] = React.useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = React.useState(true);
  const [isTypeSelected, setIsTypeSelected] = React.useState(true);
  const [isDateSelected, setIsDateSelected] = React.useState(true);
  const [isStartTimeSelected, setIsStartTimeSelected] = React.useState(true);
  const [isEndTimeSelected, setIsEndTimeSelected] = React.useState(true);
  const [isNameValid, setIsNameValid] = React.useState(true);
  const [enabledEdit, setEnabledEdit] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const isValidNameFormat = () => {
      const nameRegex = /^[a-zA-Z0-9\s]+$/;
      return (
        editBlock?.name?.trim() === "" ||
        newBlock?.name?.trim() === "" ||
        nameRegex.test(editBlock?.name)
      );
    };
    setIsValidNameFormat(isValidNameFormat());

    setIsTermSelected(!!(editBlock?.id ? editBlock?.term : newBlock?.term));
    setIsDescriptionValid(
      editBlock?.id
        ? editBlock?.description?.trim() === "" || editBlock?.description
        : newBlock.description?.trim() === "" || newBlock.description
    );
    setIsTypeSelected(!!(editBlock?.id ? editBlock?.type : newBlock.type));
    setIsDateSelected(!!(editBlock?.id ? editBlock?.date : newBlock.date));
    setIsStartTimeSelected(
      !!(editBlock?.id ? editBlock?.startTime : newBlock.startTime)
    );
    setIsEndTimeSelected(
      !!(editBlock?.id ? editBlock?.endTime : newBlock.endTime)
    );
    setIsNameValid(
      editBlock?.id
        ? editBlock?.name?.trim().length >= 4
        : newBlock?.name?.trim().length >= 4
    );
  }, [editBlock, newBlock, editBlock?.id]);
  const handleCloseModal = () => {
    closeModal();
    setIsDeleting(false);
    setEnabledEdit(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        color="text"
        bg="compBg"
        maxW="700px">
        <ModalHeader>
          {isDeleting
            ? "Delete Block"
            : selectedBlocksheet
            ? "Edit Block"
            : "New Block"}
        </ModalHeader>

        <ModalBody overflowY="auto">
          {((!isDeleting && enabledEdit) || isCreating) && (
            <VStack
              spacing={4}
              align="stretch">
              <FormControl
                isInvalid={!editBlock?.ownerId && !newBlock?.ownerId}>
                <FormLabel>Select User</FormLabel>
                <Select
                  placeholder="Select User"
                  value={
                    editBlock?.id ? editBlock?.ownerId : newBlock.selectedUser
                  }
                  onChange={(e) =>
                    selectedBlocksheet
                      ? setEditBlock({
                          ...editBlock,
                          ownerId: e.target.value,
                        })
                      : setNewBlock({
                          ...newBlock,
                          ownerId: e.target.value,
                        })
                  }
                  isDisabled={!enabledEdit && editBlock?.id}>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Please select a user.</FormErrorMessage>
              </FormControl>{" "}
              <FormControl isInvalid={!isNameValid}>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  value={selectedBlocksheet ? editBlock?.name : newBlock.name}
                  onChange={(e) =>
                    selectedBlocksheet
                      ? setEditBlock({
                          ...editBlock,
                          name: e.target.value,
                        })
                      : setNewBlock({ ...newBlock, name: e.target.value })
                  }
                  isDisabled={!enabledEdit && editBlock?.id}
                />
                <FormErrorMessage>Name is required.</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!isTypeSelected}>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Type"
                  value={editBlock?.id ? editBlock?.type : newBlock.type}
                  onChange={(e) =>
                    selectedBlocksheet
                      ? setEditBlock({
                          ...editBlock,
                          type: e.target.value,
                        })
                      : setNewBlock({ ...newBlock, type: e.target.value })
                  }
                  isDisabled={!enabledEdit && editBlock?.id}>
                  {typeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{
                        backgroundColor: option.color,
                        backgroundImage: option.gradient,
                        background: option.stars
                          ? `url('star.png')`
                          : option.background,
                        backgroundSize: "cover",
                      }}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Please select a type.</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!isDescriptionValid}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  value={
                    editBlock?.id
                      ? editBlock?.description
                      : newBlock.description
                  }
                  onChange={(e) =>
                    editBlock?.id
                      ? setEditBlock({
                          ...editBlock,
                          description: e.target.value,
                        })
                      : setNewBlock({
                          ...newBlock,
                          description: e.target.value,
                        })
                  }
                  isDisabled={!enabledEdit && editBlock?.id}
                />
                <FormErrorMessage>Description is required.</FormErrorMessage>
              </FormControl>
              <HStack spacing={4}>
                <FormControl isInvalid={!isTermSelected}>
                  <FormLabel>Term</FormLabel>
                  <Select
                    placeholder="Term"
                    value={editBlock?.id ? editBlock?.term : newBlock?.term}
                    onChange={(e) =>
                      selectedBlocksheet
                        ? setEditBlock({
                            ...editBlock,
                            term: e.target.value,
                          })
                        : setNewBlock({ ...newBlock, term: e.target.value })
                    }
                    isDisabled={!enabledEdit && editBlock?.id}>
                    {terms.map((term) => (
                      <option
                        key={term}
                        value={term}>
                        {term}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>Please select a term.</FormErrorMessage>
                </FormControl>{" "}
                <FormControl isInvalid={!isDateSelected}>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="Date"
                    value={editBlock?.id ? editBlock?.date : newBlock.date}
                    onChange={(e) =>
                      selectedBlocksheet
                        ? setEditBlock({
                            ...editBlock,
                            date: e.target.value,
                          })
                        : setNewBlock({ ...newBlock, date: e.target.value })
                    }
                    isDisabled={!enabledEdit && editBlock?.id}
                  />
                  <FormErrorMessage>Date is required.</FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack spacing={4}>
                <FormControl isInvalid={!isStartTimeSelected}>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={
                      editBlock?.id ? editBlock?.startTime : newBlock.startTime
                    }
                    onChange={(e) =>
                      selectedBlocksheet
                        ? setEditBlock({
                            ...editBlock,
                            startTime: e.target.value,
                          })
                        : setNewBlock({
                            ...newBlock,
                            startTime: e.target.value,
                          })
                    }
                    isDisabled={!enabledEdit && editBlock?.id}
                  />
                  <FormErrorMessage>Start time is required.</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!isEndTimeSelected}>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={
                      editBlock?.id ? editBlock?.endTime : newBlock.endTime
                    }
                    onChange={(e) =>
                      selectedBlocksheet
                        ? setEditBlock({
                            ...editBlock,
                            endTime: e.target.value,
                          })
                        : setNewBlock({
                            ...newBlock,
                            endTime: e.target.value,
                          })
                    }
                    isDisabled={!enabledEdit && editBlock?.id}
                  />
                  <FormErrorMessage>End time is required.</FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Show on Blocksheet</FormLabel>
                <Checkbox
                  isChecked={
                    selectedBlocksheet
                      ? editBlock?.showOnBlocksheet
                      : newBlock.showOnBlocksheet
                  }
                  onChange={(e) =>
                    selectedBlocksheet
                      ? setEditBlock({
                          ...editBlock,
                          showOnBlocksheet: e.target.checked,
                        })
                      : setNewBlock({
                          ...newBlock,
                          showOnBlocksheet: e.target.checked,
                        })
                  }
                  isDisabled={!enabledEdit && editBlock?.id}>
                  Show on Blocksheet
                </Checkbox>
              </FormControl>
            </VStack>
          )}
          {isDeleting && (
            <VStack
              spacing={4}
              align="stretch">
              <Text
                color="red.500"
                fontWeight="bold"
                textAlign="center">
                Are you sure you want to delete this block?
              </Text>
            </VStack>
          )}{" "}
          {!isDeleting && !enabledEdit && !isCreating && (
            <VStack
              spacing={4}
              align="stretch">
              <Text fontWeight="bold">Block Details:</Text>
              <Text>Name: {editBlock?.name}</Text>
              <Text>Owner: {editBlock?.owner}</Text>
              <Text>
                Time: {editBlock?.startTime} - {editBlock?.endTime}
              </Text>
              <Text>Value: {editBlock?.value}</Text>
              <Text>Type: {editBlock?.type}</Text>
              <Text>Description: {editBlock?.description}</Text>

              {/* Buttons for posting to trade board and editing (for admins) */}
              {editBlock?.ownerId === user.id && (
                <HStack spacing={4}>
                  <Button
                    colorScheme="teal"
                    onClick={() => setSelectedBlockId(editBlock.id)}>
                    Post for Trade
                  </Button>
                </HStack>
              )}
            </VStack>
          )}
        </ModalBody>
        {user.isAdmin && (
          <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
            {!isDeleting && (
              <>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    if (enabledEdit || isCreating) {
                      setEnabledEdit(false);
                      handleSaveChanges();
                    } else {
                      setEnabledEdit(true);
                    }
                  }}
                  isDisabled={
                    isDeleting ||
                    (selectedBlocksheet && !editBlock?.name) ||
                    (!selectedBlocksheet && !newBlock?.name) ||
                    !isValidNameFormat ||
                    !isTermSelected ||
                    !isDescriptionValid ||
                    !isTypeSelected ||
                    !isDateSelected ||
                    !isStartTimeSelected ||
                    !isEndTimeSelected ||
                    !isNameValid
                  }>
                  {enabledEdit || isCreating ? "Save Changes" : "Edit Block"}
                </Button>
                {(enabledEdit || isCreating) && (
                  <Button
                    color="text"
                    bg="compBg"
                    variant="outline"
                    onClick={handleCloseModal}>
                    Cancel
                  </Button>
                )}
              </>
            )}
            {!enabledEdit &&
              editBlock?.id &&
              !isDeleting &&
              selectedBlocksheet && (
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={() => {
                    setIsDeleting(true);
                  }}>
                  Delete Block
                </Button>
              )}
            {isDeleting && (
              <>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleDeleteBlock(editBlock?.id);
                    setIsDeleting(false);
                  }}>
                  Delete
                </Button>
                <Button
                  color="text"
                  bg="compBg"
                  variant="outline"
                  onClick={() => {
                    setIsDeleting(false);
                  }}>
                  Cancel
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BlocksheetActionModal;
