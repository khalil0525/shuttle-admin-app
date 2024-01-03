import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';

const ResourceEditorAttachmentItem = ({
  attachment,
  onRemove,
  onNameChange,
  onFileChange,
  resourceEditTargetId,
  resourceId,
}) => {
  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      align="center"
      m="1.6rem 0"
      p={4}
      borderRadius="md"
      boxShadow="md"
      bgGradient="linear(to-r, gray.600, compBg)">
      <FormControl flex="1">
        <FormLabel
          mb={0}
          fontSize="sm">
          Attachment Name
        </FormLabel>
        <Input
          disabled={resourceId !== resourceEditTargetId}
          placeholder="Enter Attachment Name"
          value={attachment.name}
          onChange={(e) => onNameChange(e.target.value)}
          size="sm"
        />
      </FormControl>
      <FormControl flex="2">
        <FormLabel
          mb={0}
          fontSize="sm">
          Attachment File
        </FormLabel>
        <Input
          disabled={resourceId !== resourceEditTargetId}
          type="file"
          onChange={(e) => onFileChange(e.target.files[0])}
          size="sm"
        />
      </FormControl>
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

export default ResourceEditorAttachmentItem;
