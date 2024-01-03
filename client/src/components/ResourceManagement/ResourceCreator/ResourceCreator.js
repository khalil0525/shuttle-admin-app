import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Input,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
} from '@chakra-ui/react';
import ResourceCreatorAttachmentItem from './ResourceCreatorAttachmentItem';

const ResourceCreator = ({ onCreate }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [showAnswerTextInput, setShowAnswerTextInput] = useState(false);

  const [isValidated, setIsValidated] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleCreate = async () => {
    try {
      await onCreate(question, answer, enabled, attachments);
      setQuestion('');
      setAnswer('');
      setEnabled(true);
      setShowAnswerTextInput(false);
      setAttachments([]);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAnswerTextInput = () => {
    setShowAnswerTextInput((prev) => !prev);
    if (showAnswerTextInput) {
      setAnswer('');
    }
  };

  const addAttachment = () => {
    setAttachments((prevAttachments) => [
      ...prevAttachments,
      { name: '', link: '', type: '' },
    ]);
  };

  const removeAttachment = (index) => {
    setAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };
  const updateDisabledState = useCallback(() => {
    const isQuestionValid = question.length > 7;
    let isAnswerValid = true;

    if (showAnswerTextInput) {
      isAnswerValid = answer.length > 7;
    }

    const areAttachmentsValid = attachments.every(
      (attachment) =>
        attachment.name.length >= 3 &&
        (attachment.type === 'image' || attachment.type === 'pdf') &&
        attachment.file instanceof File
    );

    setIsValidated(isQuestionValid && isAnswerValid && areAttachmentsValid);
  }, [question, answer, showAnswerTextInput, attachments]);

  useEffect(() => {
    updateDisabledState();
  }, [updateDisabledState]);
  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="lg"
      p={6}
      mb={6}
      bgColor="compBg"
      boxShadow="md">
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={4}>
        Create a Resource
      </Text>
      <Divider mb={4} />
      <FormControl>
        <FormLabel>Prompt or Question</FormLabel>
        <Input
          placeholder="Enter Prompt or Question here"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            updateDisabledState();
          }}
        />
        {question.length < 8 && (
          <Text
            color="red"
            fontSize="sm">
            Question must be at least 8 characters long.
          </Text>
        )}
      </FormControl>
      <FormControl mt={4}>
        {showAnswerTextInput && (
          <>
            <FormLabel>Answer</FormLabel>
            <Flex>
              <Textarea
                placeholder="Enter Answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  updateDisabledState();
                }}
                resize="vertical"
              />
            </Flex>{' '}
            {answer.length < 8 && (
              <Text
                color="red"
                fontSize="sm">
                Answer must be at least 8 characters long.
              </Text>
            )}
          </>
        )}
        <Button
          mt={2}
          size="sm"
          onClick={toggleAnswerTextInput}
          colorScheme={!showAnswerTextInput ? 'teal' : 'red'}>
          {!showAnswerTextInput ? 'Add' : 'Remove'} Answer
        </Button>
      </FormControl>
      {attachments.map((attachment, index) => (
        <ResourceCreatorAttachmentItem
          key={index}
          attachment={attachment}
          onRemove={() => removeAttachment(index)}
          setAttachments={setAttachments}
          index={index}
        />
      ))}

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
        <Button
          size="sm"
          onClick={handleCreate}
          isDisabled={!isValidated}
          colorScheme="teal">
          Create
        </Button>
      </Flex>
      <Flex
        mt={4}
        align="center">
        <Text
          fontWeight="bold"
          mr={2}>
          {!enabled ? 'Hidden' : 'Shown'}
        </Text>
        <Switch
          id="disabled"
          isChecked={enabled}
          onChange={() => setEnabled(!enabled)}
          ml={2}
          colorScheme="teal"
        />
      </Flex>
    </Box>
  );
};

export default ResourceCreator;
