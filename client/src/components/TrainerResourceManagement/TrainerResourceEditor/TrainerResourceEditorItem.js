import React, { useState } from 'react';
import {
  Flex,
  Input,
  IconButton,
  Box,
  Text,
  Icon,
  Switch,
  Textarea,
  Button,
} from '@chakra-ui/react';

import {
  ArrowUpIcon,
  ArrowDownIcon,
  EditIcon,
  DeleteIcon,
  CloseIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import TrainerResourceEditorAttachmentItem from './TrainerResourceEditorAttachmentItem';

const TrainerResourceEditorItem = ({
  trainerResource,
  onPositionChange,

  totalItems,

  setTrainerResourceEditTargetId,
  trainerResourceEditTargetQuestion,
  setTrainerResourceEditTargetQuestion,
  trainerResourceEditTargetAnswer,
  setTrainerResourceEditTargetAnswer,
  trainerResourceEditTargetEnabled,
  setTrainerResourceEditTargetEnabled,
  trainerResourceEditTargetId,
  disabledInput,
  handleEditTrainerResource,
  handleOpenDeleteModal,
  trainerResourceEditTargetAttachments,
  setTrainerResourceEditTargetAttachments,
}) => {
  const [showAnswerTextInput, setShowAnswerTextInput] = useState(false);
  const handleMoveUp = () => {
    if (trainerResource.order - 1 !== 0) {
      onPositionChange(trainerResource.id, trainerResource.order - 1);
    }
  };

  const handleMoveDown = () => {
    if (trainerResource.order + 1 <= totalItems) {
      onPositionChange(trainerResource.id, trainerResource.order + 1);
    }
  };

  const handleEdit = () => {
    setTrainerResourceEditTargetId(trainerResource.id);
    setTrainerResourceEditTargetQuestion(trainerResource.question);
    setTrainerResourceEditTargetAnswer(trainerResource.answer);
    setTrainerResourceEditTargetEnabled(trainerResource.enabled);
    setTrainerResourceEditTargetAttachments(
      trainerResource.attachments.map((attachment) => ({ ...attachment }))
    );
  };

  const toggleAnswerTextInput = () => {
    setShowAnswerTextInput((prev) => !prev);
    if (!showAnswerTextInput) {
      setTrainerResourceEditTargetAnswer('');
    }
  };
  const handleCancelEdit = () => {
    setTrainerResourceEditTargetId(null);
    setTrainerResourceEditTargetQuestion('');
    setTrainerResourceEditTargetAnswer('');
    setTrainerResourceEditTargetEnabled(null);
    setTrainerResourceEditTargetAttachments(null);
  };

  const handleDelete = (trainerResourceId, attachment, index = null) => {
    if (trainerResourceId && attachment) {
      if (attachment.id) {
        handleOpenDeleteModal(trainerResourceId, attachment.id);
      } else {
        setTrainerResourceEditTargetAttachments((prevAttachments) => {
          const updatedAttachments = [...prevAttachments];
          updatedAttachments.splice(index, 1);
          return updatedAttachments;
        });
      }
    } else if (trainerResourceId && !attachment) {
      handleOpenDeleteModal(trainerResourceId);
    }
  };

  const addAttachment = () => {
    setTrainerResourceEditTargetAttachments((prevAttachments) => [
      ...prevAttachments,
      { name: '', link: '', type: '' },
    ]);
  };

  const handleNameChange = (index, value) => {
    setTrainerResourceEditTargetAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments[index].name = value;
      return [...updatedAttachments];
    });
  };
  const handleFileChange = (index, file) => {
    setTrainerResourceEditTargetAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments[index].file = file;
      updatedAttachments[index].type = file.type.includes('image')
        ? 'image'
        : 'pdf';
      return [...updatedAttachments];
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.300"
      p={4}
      mb={4}
      bgColor="compBg"
      boxShadow="sm"
      width="100%"
      overflow="hidden"
      color="text">
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: 'column', md: 'row' }}
        mb={{ base: '1.6rem', md: '1.6rem' }}
        width="100%">
        <Box
          flex="1"
          ml={{ base: 0, md: 4 }}
          width="100%">
          <Box
            mb={2}
            width="100%">
            <Text
              fontWeight="bold"
              mb={1}>
              Prompt or Question
            </Text>
            <Text
              fontWeight="500"
              fontSize="md"
              opacity="0.8"
              mb={2}>
              {trainerResourceEditTargetId === trainerResource.id ? (
                <Input
                  disabled={disabledInput}
                  placeholder="Enter Prompt or Question here"
                  value={
                    trainerResource.id === trainerResourceEditTargetId
                      ? trainerResourceEditTargetQuestion
                      : trainerResource.question
                  }
                  onChange={(e) =>
                    setTrainerResourceEditTargetQuestion(e.target.value)
                  }
                />
              ) : (
                trainerResource.question
              )}
            </Text>
            {trainerResource.id === trainerResourceEditTargetId &&
              trainerResourceEditTargetQuestion.length < 8 && (
                <Text
                  color="red"
                  fontSize="sm">
                  Question must be at least 8 characters long.
                </Text>
              )}
          </Box>
          {showAnswerTextInput && (
            <Box
              mb={2}
              width="100%">
              <Text
                fontWeight="bold"
                mb={1}>
                Answer:
              </Text>
              <Text color="gray.600">
                {trainerResourceEditTargetId === trainerResource.id ? (
                  <Textarea
                    disabled={disabledInput}
                    placeholder="Edit Answer"
                    value={
                      trainerResource.id === trainerResourceEditTargetId
                        ? trainerResourceEditTargetAnswer
                        : trainerResource.answer
                    }
                    onChange={(e) =>
                      setTrainerResourceEditTargetAnswer(e.target.value)
                    }
                    resize="vertical"
                  />
                ) : (
                  trainerResource.answer
                )}
              </Text>
            </Box>
          )}
          {showAnswerTextInput &&
            trainerResource.id === trainerResourceEditTargetId &&
            trainerResourceEditTargetAnswer.length < 8 && (
              <Text
                color="red"
                fontSize="sm">
                Question must be at least 8 characters long.
              </Text>
            )}
          {trainerResourceEditTargetId === trainerResource.id && (
            <Button
              mt={2}
              mb={2}
              size="sm"
              onClick={toggleAnswerTextInput}
              colorScheme={!showAnswerTextInput ? 'teal' : 'red'}>
              {!showAnswerTextInput ? 'Add' : 'Remove'} Answer
            </Button>
          )}

          {trainerResource.attachments.length > 0 && (
            <Text
              fontWeight="bold"
              mt={4}>
              Attachments:
            </Text>
          )}
          {trainerResourceEditTargetAttachments?.length &&
          trainerResourceEditTargetId === trainerResource.id
            ? trainerResourceEditTargetAttachments.map((attachment, index) => (
                <TrainerResourceEditorAttachmentItem
                  key={index}
                  attachment={attachment}
                  trainerResourceEditTargetId={trainerResourceEditTargetId}
                  trainerResourceId={trainerResource.id}
                  onRemove={() =>
                    handleDelete(trainerResource.id, attachment, index)
                  }
                  onNameChange={(value) => handleNameChange(index, value)}
                  onFileChange={(file) => handleFileChange(index, file)}
                />
              ))
            : trainerResource.attachments.map((attachment, index) => (
                <TrainerResourceEditorAttachmentItem
                  key={index}
                  attachment={attachment}
                  trainerResourceEditTargetId={trainerResourceEditTargetId}
                  trainerResourceId={trainerResource.id}
                  onRemove={() =>
                    handleDelete(trainerResource.id, attachment, index)
                  }
                  onNameChange={(value) => handleNameChange(index, value)}
                  onFileChange={(file) => handleFileChange(index, file)}
                />
              ))}
          {trainerResourceEditTargetId === trainerResource.id && (
            <Flex
              align="center"
              justify="space-between"
              mt={2}>
              <Button
                size="sm"
                onClick={addAttachment}
                colorScheme="teal">
                Add Attachment
              </Button>
            </Flex>
          )}
        </Box>
        <Flex
          direction="column"
          gap="0.2rem"
          alignItems="center"
          ml={{ base: 0, md: 2 }}
          alignSelf="center">
          <IconButton
            bgColor="#2596be"
            color="#fff"
            size="sm"
            onClick={handleMoveUp}
            isDisabled={
              trainerResource.order === 1 ||
              trainerResourceEditTargetId !== null
            }
            icon={<Icon as={ArrowUpIcon} />}
            mb={2}
          />

          <Text fontWeight="bold">{trainerResource.order}</Text>

          <IconButton
            bgColor="#2596be"
            size="sm"
            color="#fff"
            onClick={handleMoveDown}
            isDisabled={
              trainerResource.order === totalItems ||
              trainerResourceEditTargetId !== null
            }
            icon={<Icon as={ArrowDownIcon} />}
            mt={2}
          />
        </Flex>
      </Flex>
      <Flex
        mt={{ base: 2, md: 0 }}
        justifyContent="space-between"
        borderTopWidth="1px"
        borderColor="gray.300"
        paddingTop={4}>
        <Flex
          align="center"
          mb={2}>
          <Text
            fontWeight="bold"
            mr={2}>
            {trainerResourceEditTargetId !== trainerResource.id &&
            !trainerResource.disabled
              ? 'Hidden'
              : 'Shown'}
          </Text>
          {trainerResourceEditTargetId === trainerResource.id && (
            <Switch
              isChecked={trainerResourceEditTargetEnabled}
              onChange={() =>
                setTrainerResourceEditTargetEnabled(
                  !trainerResourceEditTargetEnabled
                )
              }
            />
          )}
        </Flex>
        <Flex>
          {trainerResourceEditTargetId === trainerResource.id ? (
            <>
              <IconButton
                disabled={disabledInput}
                colorScheme="green"
                size="sm"
                onClick={() =>
                  handleEditTrainerResource(
                    trainerResourceEditTargetQuestion,
                    trainerResourceEditTargetAnswer,
                    trainerResourceEditTargetEnabled,
                    trainerResourceEditTargetAttachments
                  )
                }
                icon={<Icon as={CheckIcon} />}
                aria-label="Save"
                mr={2}
              />
              <IconButton
                disabled={disabledInput}
                colorScheme="red"
                size="sm"
                onClick={handleCancelEdit}
                icon={<Icon as={CloseIcon} />}
                aria-label="Cancel">
                Cancel
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                disabled={disabledInput}
                colorScheme="teal"
                size="sm"
                onClick={handleEdit}
                icon={<EditIcon />}
                mr={2}>
                Edit
              </IconButton>{' '}
              <IconButton
                disabled={disabledInput}
                colorScheme="red"
                size="sm"
                onClick={() => handleDelete(trainerResource.id, null)}
                icon={<Icon as={DeleteIcon} />}
                aria-label="Delete">
                Delete
              </IconButton>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TrainerResourceEditorItem;
