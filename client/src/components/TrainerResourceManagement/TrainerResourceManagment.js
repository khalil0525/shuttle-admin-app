import React, { useEffect, useState } from 'react';
import {
  Stack,
  Heading,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

import TrainerResourceList from './TrainerResourceList/TrainerResourceList';
import TrainerResourceEditor from './TrainerResourceEditor/TrainerResourceEditor';
import TrainerResourceCreator from './TrainerResourceCreator/TrainerResourceCreator';
import axios from 'axios';
import { useSnackbar } from '../../context/SnackbarProvider';

const TrainerResourceManagement = ({ user }) => {
  const { showSuccessToast, showErrorToast } = useSnackbar();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeTab, setActiveTab] = useState(
    user?.isAdmin ||
      user?.permissions?.find((perm) => perm.tabName === 'training').canAdmin
      ? 'create'
      : 'view'
  );
  const [trainerResources, setTrainerResources] = useState([]);
  const [trainerResourceDeleteTargetId, setTrainerResourceDeleteTargetId] =
    useState(null);
  const [
    trainerResourceDeleteTargetAttachmentId,
    setTrainerResourceDeleteTargetAttachmentId,
  ] = useState(null);
  const [trainerResourceEditTargetId, setTrainerResourceEditTargetId] =
    useState(null);
  const [
    trainerResourceEditTargetQuestion,
    setTrainerResourceEditTargetQuestion,
  ] = useState(null);
  const [
    trainerResourceEditTargetEnabled,
    setTrainerResourceEditTargetEnabled,
  ] = useState(null);
  const [trainerResourceEditTargetAnswer, setTrainerResourceEditTargetAnswer] =
    useState(null);

  const [
    trainerResourceEditTargetAttachments,
    setTrainerResourceEditTargetAttachments,
  ] = useState(null);

  const [disabledInput, setDisableInput] = useState(false);

  const handleCreateTrainerResource = async (
    question,
    answer,
    enabled,
    attachments
  ) => {
    try {
      if (
        attachments.some(
          (attachment) =>
            attachment.name.trim().length < 3 ||
            !['image', 'pdf'].includes(attachment.type)
        )
      ) {
        throw new Error(
          'All attachments must have names of at least 3 characters and be a PDF or image.'
        );
      }

      setDisableInput(true);

      const fileData = attachments.map((attachment) => attachment.file);
      const attachmentMetaData = attachments.map((attachment) => ({
        name: attachment.name,
        type: attachment.type,
        originalName: attachment.file.name,
      }));

      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('enabled', enabled);

      fileData.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      attachmentMetaData.forEach((data, index) => {
        formData.append(`attachmentMetaData[${index}][name]`, data.name);
        formData.append(`attachmentMetaData[${index}][type]`, data.type);
        formData.append(
          `attachmentMetaData[${index}][originalName]`,
          data.originalName
        );
      });

      const { data } = await axios.post(`/api/trainer-resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTrainerResources((prev) => [...prev, data]);

      showSuccessToast('New Trainer resource Created!');
    } catch (error) {
      console.error(error);
      showErrorToast(error.message);
      throw Error();
    } finally {
      setDisableInput(false);
    }
  };

  const handleEditTrainerResource = async (
    question,
    answer,
    enabled,
    attachments
  ) => {
    try {
      if (
        attachments.some(
          (attachment) =>
            attachment.name.trim().length < 3 ||
            !['image', 'pdf'].includes(attachment.type)
        )
      ) {
        throw new Error(
          'All attachments must have names of at least 3 characters and be a PDF or image.'
        );
      }

      setDisableInput(true);

      const fileData = attachments.map((attachment) => attachment.file);

      const trainerResourceIndex = trainerResources.findIndex(
        (trainerResource) => trainerResource.id === trainerResourceEditTargetId
      );

      const attachmentMetaData = attachments
        .filter((trainerResourceAttachment) => {
          const matchingAttachment = trainerResources[
            trainerResourceIndex
          ].attachments.find(
            (attachment) => attachment.id === trainerResourceAttachment?.id
          );

          if (matchingAttachment) {
            if (trainerResourceAttachment.file) {
              return true;
            } else if (
              matchingAttachment.name !== trainerResourceAttachment.name ||
              matchingAttachment.type !== trainerResourceAttachment.type
            ) {
              return true;
            } else {
              return false;
            }
          }

          return true;
        })
        .map((attachment) => {
          if (!attachment.id && attachment.file) {
            return {
              ...attachment,
              originalName: attachment.file.name,
            };
          } else if (attachment.id) {
            const matchingAttachment = trainerResources[
              trainerResourceIndex
            ].attachments.find(
              (matchingAttachment) => matchingAttachment.id === attachment.id
            );
            return {
              ...attachment,
              originalName: matchingAttachment?.file?.name || null,
            };
          }

          return attachment;
        });

      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('enabled', enabled);

      fileData?.length &&
        fileData?.forEach((file, index) => {
          formData.append(`attachments`, file);
        });

      attachmentMetaData?.length &&
        attachmentMetaData.forEach((data, index) => {
          formData.append(`attachmentMetaData[${index}][name]`, data.name);
          formData.append(`attachmentMetaData[${index}][type]`, data.type);
          formData.append(
            `attachmentMetaData[${index}][originalName]`,
            data.originalName
          );
          formData.append(`attachmentMetaData[${index}][id]`, data.id);
        });

      const { data } = await axios.put(
        `/api/trainer-resources/${trainerResourceEditTargetId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTrainerResources((prev) =>
        prev.map((trainerResource) =>
          trainerResource.id === trainerResourceEditTargetId
            ? { ...trainerResource, ...data }
            : trainerResource
        )
      );
      setTrainerResourceEditTargetId(null);
      setTrainerResourceEditTargetEnabled(null);
      setTrainerResourceEditTargetAnswer(null);
      setTrainerResourceEditTargetQuestion(null);
      setTrainerResourceEditTargetAttachments(null);

      showSuccessToast('Trainer resource Updated!');
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || 'An error occurred');
    } finally {
      setDisableInput(false);
    }
  };

  const handleSwapTrainerResource = async (trainerResourceId, swapPosition) => {
    try {
      setDisableInput(true);

      const { data } = await axios.post(
        `/api/trainer-resources/${trainerResourceId}/swap`,
        {
          swapPosition,
        }
      );

      setTrainerResources((prev) => {
        const { updatedTrainerResource, swappedTrainerResource } = data;
        const prevTrainerResources = [...prev];

        const updatedIndex = prevTrainerResources.findIndex(
          (trainerResource) => trainerResource.id === updatedTrainerResource.id
        );
        const swappedIndex = prevTrainerResources.findIndex(
          (trainerResource) => trainerResource.id === swappedTrainerResource.id
        );

        if (updatedIndex !== -1 && swappedIndex !== -1) {
          const tempUpdated = { ...prevTrainerResources[updatedIndex] };
          const tempSwapped = { ...prevTrainerResources[swappedIndex] };
          tempUpdated.order = tempSwapped.order;
          tempSwapped.order = prevTrainerResources[updatedIndex].order;

          prevTrainerResources[updatedIndex] = tempSwapped;
          prevTrainerResources[swappedIndex] = tempUpdated;
        }

        return [...prevTrainerResources];
      });

      showSuccessToast('Trainer resourcess Updated!');
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || 'An error occurred');
    } finally {
      setDisableInput(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDisableInput(true);

      if (trainerResourceDeleteTargetAttachmentId) {
        await axios.delete(
          `/api/trainer-resources/${trainerResourceDeleteTargetId}/attachments/${trainerResourceDeleteTargetAttachmentId}`
        );
      } else {
        await axios.delete(
          `/api/trainer-resources/${trainerResourceDeleteTargetId}`
        );
      }

      if (trainerResourceDeleteTargetAttachmentId) {
        const updatedTrainerResources = trainerResources.map(
          (trainerResource) => {
            if (trainerResource.id === trainerResourceDeleteTargetId) {
              const updatedAttachments = trainerResource.attachments.filter(
                (attachment) =>
                  attachment.id !== trainerResourceDeleteTargetAttachmentId
              );
              return {
                ...trainerResource,
                attachments: updatedAttachments,
              };
            }
            return trainerResource;
          }
        );
        setTrainerResources(updatedTrainerResources);
        showSuccessToast('Attachment Successfully Deleted!');
      } else {
        const updatedTrainerResources = trainerResources
          .filter(
            (trainerResource) =>
              trainerResource.id !== trainerResourceDeleteTargetId
          )
          .sort((a, b) => a.order - b.order)
          .map((trainerResource, index) => ({
            ...trainerResource,
            order: index + 1,
          }));
        setTrainerResources(updatedTrainerResources);
        showSuccessToast('Trainer resource Successfully Deleted!');
      }

      onClose();
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || 'An error occurred');
    } finally {
      setDisableInput(false);
    }
  };

  const handleOpenDeleteModal = (trainerResourceId, attachmentId = null) => {
    setTrainerResourceDeleteTargetId(trainerResourceId);
    setTrainerResourceDeleteTargetAttachmentId(attachmentId);
    onOpen();
  };

  useEffect(() => {
    if (trainerResourceDeleteTargetId) {
      onOpen();
    } else {
      setTrainerResourceDeleteTargetId(null);
      setTrainerResourceDeleteTargetAttachmentId(null);
    }
  }, [trainerResourceDeleteTargetId, onOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setDisableInput(true);
      try {
        const { data } = await axios.get('/api/trainer-resources');
        setTrainerResources(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setDisableInput(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Stack
      spacing={4}
      p={4}
      boxShadow="md"
      borderRadius="md"
      bgColor="compBg"
      color="text">
      <Heading
        as="h3"
        size="md"
        mb={4}>
        Trainer Resources
      </Heading>

      <Tabs
        isFitted
        variant="enclosed-colored"
        bgColor="compBg"
        onChange={(index) =>
          setActiveTab(index === 0 ? 'create' : index === 1 ? 'edit' : 'view')
        }>
        <TabList bgColor="compBg">
          <Tab
            bgColor="compBg"
            color="text">
            View
          </Tab>
          {(user?.isAdmin ||
            user?.permissions?.find((perm) => perm.tabName === 'dispatch')
              ?.canAdmin) && (
            <>
              <Tab
                bgColor="compBg"
                color="text">
                Create
              </Tab>
              <Tab
                bgColor="compBg"
                color="text">
                Edit
              </Tab>
            </>
          )}
        </TabList>

        <Divider />

        <TabPanels>
          <TabPanel>
            <TrainerResourceList trainerResources={trainerResources} />
          </TabPanel>
          <TabPanel>
            <TrainerResourceCreator onCreate={handleCreateTrainerResource} />
          </TabPanel>
          <TabPanel>
            <TrainerResourceEditor
              trainerResources={trainerResources}
              setTrainerResourceDeleteTargetId={
                setTrainerResourceDeleteTargetId
              }
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
              trainerResourceEditTargetEnabled={
                trainerResourceEditTargetEnabled
              }
              setTrainerResourceEditTargetEnabled={
                setTrainerResourceEditTargetEnabled
              }
              trainerResourceEditTargetId={trainerResourceEditTargetId}
              disabledInput={disabledInput}
              handleEditTrainerResource={handleEditTrainerResource}
              handleSwapTrainerResource={handleSwapTrainerResource}
              handleOpenDeleteModal={handleOpenDeleteModal}
              trainerResourceEditTargetAttachments={
                trainerResourceEditTargetAttachments
              }
              setTrainerResourceEditTargetAttachments={
                setTrainerResourceEditTargetAttachments
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {trainerResourceDeleteTargetAttachmentId ? (
              <p>Are you sure you want to delete this attachment?</p>
            ) : (
              <p>Are you sure you want to delete this Trainer resource?</p>
            )}
          </ModalBody>
          <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              colorScheme="red"
              onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default TrainerResourceManagement;
