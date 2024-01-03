import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import FileUpload from '../FileUpload';

const TrainerResourceCreatorAttachmentItem = ({
  attachment,
  onRemove,
  index,
  setAttachments,
}) => {
  const [attachmentData, setAttachmentData] = useState({
    name: attachment.name || '',
    type: attachment.type || '',
    file: null,
  });
  const handleNameChange = (e) => {
    setAttachmentData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleFileChange = (file) => {
    setAttachmentData((prev) => ({
      ...prev,
      file: file,
      type: file.type.includes('image') ? 'image' : 'pdf',
    }));
  };

  useEffect(() => {
    setAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments[index] = attachmentData;
      return updatedAttachments;
    });
  }, [attachmentData, index, setAttachments]);

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      align="center"
      m="1.6rem 0"
      p={4}
      borderRadius="md"
      boxShadow="md"
      bgGradient="linear(to-r, gray.200, white)">
      <FormControl flex="1">
        <FormLabel
          mb={0}
          fontSize="sm">
          Attachment Name
        </FormLabel>
        <Input
          placeholder="Enter Attachment Name"
          value={attachmentData.name}
          onChange={handleNameChange}
          size="sm"
        />
      </FormControl>
      <FormControl flex="2">
        <FormLabel
          mb={0}
          fontSize="sm">
          Attachment File
        </FormLabel>
        <FileUpload onUpload={handleFileChange} />
      </FormControl>
      {attachmentData.file && (
        <Text>
          File Type: {attachmentData.type}, Size: {attachmentData.file.size}{' '}
          bytes
        </Text>
      )}
      <IconButton
        colorScheme="red"
        size="sm"
        aria-label="Remove Attachment"
        icon={<MinusIcon />}
        onClick={onRemove}
      />
    </Stack>
  );
};

export default TrainerResourceCreatorAttachmentItem;
