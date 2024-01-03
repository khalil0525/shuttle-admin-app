import React from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import ResourceEditorItem from './ResourceEditorItem';

const ResourceEditor = ({
  resources,
  setResourceDeleteTargetId,
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
  handleSwapResource,
  handleOpenDeleteModal,
  resourceEditTargetAttachments,
  setResourceEditTargetAttachments,
}) => {
  const handlePositionChange = async (resourceId, swapPosition) => {
    await handleSwapResource(resourceId, swapPosition);
  };

  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="lg"
      p={6}
      mb={6}
      bgColor="compBg"
      boxShadow="md"
      color="text">
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={4}>
        Edit Resources
      </Text>
      <Divider mb={4} />
      {resources?.length ? (
        resources.map((resource, index) => (
          <ResourceEditorItem
            key={resource.id}
            resource={resource}
            onPositionChange={handlePositionChange}
            currentPosition={index}
            totalItems={resources.length}
            setResourceDeleteTargetId={setResourceDeleteTargetId}
            setResourceEditTargetId={setResourceEditTargetId}
            resourceEditTargetQuestion={resourceEditTargetQuestion}
            setResourceEditTargetQuestion={setResourceEditTargetQuestion}
            resourceEditTargetAnswer={resourceEditTargetAnswer}
            setResourceEditTargetAnswer={setResourceEditTargetAnswer}
            resourceEditTargetEnabled={resourceEditTargetEnabled}
            setResourceEditTargetEnabled={setResourceEditTargetEnabled}
            resourceEditTargetId={resourceEditTargetId}
            disabledInput={disabledInput}
            handleEditResource={handleEditResource}
            handleOpenDeleteModal={handleOpenDeleteModal}
            resourceEditTargetAttachments={resourceEditTargetAttachments}
            setResourceEditTargetAttachments={setResourceEditTargetAttachments}
          />
        ))
      ) : (
        <Text
          color="text"
          fontStyle="italic">
          There is currently no dispatch resources to be edited.
        </Text>
      )}
    </Box>
  );
};

export default ResourceEditor;
