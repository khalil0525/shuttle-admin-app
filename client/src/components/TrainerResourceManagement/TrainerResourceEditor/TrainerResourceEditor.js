import React from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import TrainerResourceEditorItem from './TrainerResourceEditorItem';

const TrainerResourceEditor = ({
  trainerResources,
  setTrainerResourceDeleteTargetId,
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
  handleSwapTrainerResource,
  handleOpenDeleteModal,
  trainerResourceEditTargetAttachments,
  setTrainerResourceEditTargetAttachments,
}) => {
  const handlePositionChange = async (trainerResourceId, swapPosition) => {
    await handleSwapTrainerResource(trainerResourceId, swapPosition);
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
        Edit Trainer Resources
      </Text>
      <Divider mb={4} />
      {trainerResources?.length ? (
        trainerResources.map((trainerResource, index) => (
          <TrainerResourceEditorItem
            key={trainerResource.id}
            trainerResource={trainerResource}
            onPositionChange={handlePositionChange}
            currentPosition={index}
            totalItems={trainerResources.length}
            setTrainerResourceDeleteTargetId={setTrainerResourceDeleteTargetId}
            setTrainerResourceEditTargetId={setTrainerResourceEditTargetId}
            trainerResourceEditTargetQuestion={
              trainerResourceEditTargetQuestion
            }
            setTrainerResourceEditTargetQuestion={
              setTrainerResourceEditTargetQuestion
            }
            trainerResourceEditTargetAnswer={trainerResourceEditTargetAnswer}
            setTrainerResourceEditTargetAnswer={
              setTrainerResourceEditTargetAnswer
            }
            trainerResourceEditTargetEnabled={trainerResourceEditTargetEnabled}
            setTrainerResourceEditTargetEnabled={
              setTrainerResourceEditTargetEnabled
            }
            trainerResourceEditTargetId={trainerResourceEditTargetId}
            disabledInput={disabledInput}
            handleEditTrainerResource={handleEditTrainerResource}
            handleOpenDeleteModal={handleOpenDeleteModal}
            trainerResourceEditTargetAttachments={
              trainerResourceEditTargetAttachments
            }
            setTrainerResourceEditTargetAttachments={
              setTrainerResourceEditTargetAttachments
            }
          />
        ))
      ) : (
        <Text
          color="text"
          fontStyle="italic">
          There is currently no trainer resources to be edited.
        </Text>
      )}
    </Box>
  );
};

export default TrainerResourceEditor;
