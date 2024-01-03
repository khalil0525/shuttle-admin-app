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
import ResourceEditorAttachmentItem from './ResourceEditorAttachmentItem';

const ResourceEditorItem = ({
  resource,
  onPositionChange,

  totalItems,

  setResourceEditTargetId,
  resourceEditTargetQuestion,
  setResourceEditTargetQuestion,
  resourceEditTargetAnswer,
  setResourceEditTargetAnswer,
  resourceEditTargetEnabled,
  setResourceEditTargetEnabled,
  resourceEditTargetId,
  disabledInput,
  handleEditResource,
  handleOpenDeleteModal,
  resourceEditTargetAttachments,
  setResourceEditTargetAttachments,
}) => {
  const [showAnswerTextInput, setShowAnswerTextInput] = useState(false);
  const handleMoveUp = () => {
    if (resource.order - 1 !== 0) {
      onPositionChange(resource.id, resource.order - 1);
    }
  };

  const handleMoveDown = () => {
    if (resource.order + 1 <= totalItems) {
      onPositionChange(resource.id, resource.order + 1);
    }
  };

  const handleEdit = () => {
    setResourceEditTargetId(resource.id);
    setResourceEditTargetQuestion(resource.question);
    setResourceEditTargetAnswer(resource.answer);
    setResourceEditTargetEnabled(resource.enabled);
    setResourceEditTargetAttachments(
      resource.attachments.map((attachment) => ({ ...attachment }))
    );
  };

  const toggleAnswerTextInput = () => {
    setShowAnswerTextInput((prev) => !prev);
    if (!showAnswerTextInput) {
      setResourceEditTargetAnswer('');
    }
  };
  const handleCancelEdit = () => {
    setResourceEditTargetId(null);
    setResourceEditTargetQuestion('');
    setResourceEditTargetAnswer('');
    setResourceEditTargetEnabled(null);
    setResourceEditTargetAttachments(null);
  };

  const handleDelete = (resourceId, attachment, index = null) => {
    if (resourceId && attachment) {
      if (attachment.id) {
        handleOpenDeleteModal(resourceId, attachment.id);
      } else {
        setResourceEditTargetAttachments((prevAttachments) => {
          const updatedAttachments = [...prevAttachments];
          updatedAttachments.splice(index, 1);
          return updatedAttachments;
        });
      }
    } else if (resourceId && !attachment) {
      handleOpenDeleteModal(resourceId);
    }
  };

  const addAttachment = () => {
    setResourceEditTargetAttachments((prevAttachments) => [
      ...prevAttachments,
      { name: '', link: '', type: '' },
    ]);
  };

  const handleNameChange = (index, value) => {
    setResourceEditTargetAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments[index].name = value;
      return [...updatedAttachments];
    });
  };
  const handleFileChange = (index, file) => {
    setResourceEditTargetAttachments((prevAttachments) => {
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
              {resourceEditTargetId === resource.id ? (
                <Input
                  disabled={disabledInput}
                  placeholder="Enter Prompt or Question here"
                  value={
                    resource.id === resourceEditTargetId
                      ? resourceEditTargetQuestion
                      : resource.question
                  }
                  onChange={(e) =>
                    setResourceEditTargetQuestion(e.target.value)
                  }
                />
              ) : (
                resource.question
              )}
            </Text>
            {resource.id === resourceEditTargetId &&
              resourceEditTargetQuestion.length < 8 && (
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
                {resourceEditTargetId === resource.id ? (
                  <Textarea
                    disabled={disabledInput}
                    placeholder="Edit Answer"
                    value={
                      resource.id === resourceEditTargetId
                        ? resourceEditTargetAnswer
                        : resource.answer
                    }
                    onChange={(e) =>
                      setResourceEditTargetAnswer(e.target.value)
                    }
                    resize="vertical"
                  />
                ) : (
                  resource.answer
                )}
              </Text>
            </Box>
          )}
          {showAnswerTextInput &&
            resource.id === resourceEditTargetId &&
            resourceEditTargetAnswer.length < 8 && (
              <Text
                color="red"
                fontSize="sm">
                Question must be at least 8 characters long.
              </Text>
            )}
          {resourceEditTargetId === resource.id && (
            <Button
              mt={2}
              mb={2}
              size="sm"
              onClick={toggleAnswerTextInput}
              colorScheme={!showAnswerTextInput ? 'teal' : 'red'}>
              {!showAnswerTextInput ? 'Add' : 'Remove'} Answer
            </Button>
          )}

          {resource.attachments.length > 0 && (
            <Text
              fontWeight="bold"
              mt={4}>
              Attachments:
            </Text>
          )}
          {resourceEditTargetAttachments?.length &&
          resourceEditTargetId === resource.id
            ? resourceEditTargetAttachments.map((attachment, index) => (
                <ResourceEditorAttachmentItem
                  key={index}
                  attachment={attachment}
                  resourceEditTargetId={resourceEditTargetId}
                  resourceId={resource.id}
                  onRemove={() => handleDelete(resource.id, attachment, index)}
                  onNameChange={(value) => handleNameChange(index, value)}
                  onFileChange={(file) => handleFileChange(index, file)}
                />
              ))
            : resource.attachments.map((attachment, index) => (
                <ResourceEditorAttachmentItem
                  key={index}
                  attachment={attachment}
                  resourceEditTargetId={resourceEditTargetId}
                  resourceId={resource.id}
                  onRemove={() => handleDelete(resource.id, attachment, index)}
                  onNameChange={(value) => handleNameChange(index, value)}
                  onFileChange={(file) => handleFileChange(index, file)}
                />
              ))}
          {resourceEditTargetId === resource.id && (
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
            isDisabled={resource.order === 1 || resourceEditTargetId !== null}
            icon={<Icon as={ArrowUpIcon} />}
            mb={2}
          />

          <Text fontWeight="bold">{resource.order}</Text>

          <IconButton
            bgColor="#2596be"
            size="sm"
            color="#fff"
            onClick={handleMoveDown}
            isDisabled={
              resource.order === totalItems || resourceEditTargetId !== null
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
            {resourceEditTargetId !== resource.id && !resource.disabled
              ? 'Hidden'
              : 'Shown'}
          </Text>
          {resourceEditTargetId === resource.id && (
            <Switch
              isChecked={resourceEditTargetEnabled}
              onChange={() =>
                setResourceEditTargetEnabled(!resourceEditTargetEnabled)
              }
            />
          )}
        </Flex>
        <Flex>
          {resourceEditTargetId === resource.id ? (
            <>
              <IconButton
                disabled={disabledInput}
                colorScheme="green"
                size="sm"
                onClick={() =>
                  handleEditResource(
                    resourceEditTargetQuestion,
                    resourceEditTargetAnswer,
                    resourceEditTargetEnabled,
                    resourceEditTargetAttachments
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
                onClick={() => handleDelete(resource.id, null)}
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

export default ResourceEditorItem;
