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

import ResourceList from './ResourceList/ResourceList';
import ResourceEditor from './ResourceEditor/ResourceEditor';
import ResourceCreator from './ResourceCreator/ResourceCreator';
import axios from 'axios';
import { useSnackbar } from '../../context/SnackbarProvider';

const ResourceManagement = ({ user }) => {
  const { showSuccessToast, showErrorToast } = useSnackbar();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeTab, setActiveTab] = useState(
    user?.isAdmin ||
      user?.permissions?.find((perm) => perm.tabName === 'dispatch').canAdmin
      ? 'create'
      : 'view'
  );
  const [resources, setResources] = useState([]);
  const [resourceDeleteTargetId, setResourceDeleteTargetId] = useState(null);
  const [
    resourceDeleteTargetAttachmentId,
    setResourceDeleteTargetAttachmentId,
  ] = useState(null);
  const [resourceEditTargetId, setResourceEditTargetId] = useState(null);
  const [resourceEditTargetQuestion, setResourceEditTargetQuestion] =
    useState(null);
  const [resourceEditTargetEnabled, setResourceEditTargetEnabled] =
    useState(null);
  const [resourceEditTargetAnswer, setResourceEditTargetAnswer] =
    useState(null);

  const [resourceEditTargetAttachments, setResourceEditTargetAttachments] =
    useState(null);

  const [disabledInput, setDisableInput] = useState(false);

  const handleCreateResource = async (
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

      const { data } = await axios.post(`/api/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResources((prev) => [...prev, data]);

      showSuccessToast('New Resource Created!');
    } catch (error) {
      console.error(error);
      showErrorToast(error.message);
      throw Error();
    } finally {
      setDisableInput(false);
    }
  };

  const handleEditResource = async (question, answer, enabled, attachments) => {
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

      const resourceIndex = resources.findIndex(
        (resource) => resource.id === resourceEditTargetId
      );

      const attachmentMetaData = attachments
        .filter((resourceAttachment) => {
          const matchingAttachment = resources[resourceIndex].attachments.find(
            (attachment) => attachment.id === resourceAttachment?.id
          );

          if (matchingAttachment) {
            if (resourceAttachment.file) {
              return true;
            } else if (
              matchingAttachment.name !== resourceAttachment.name ||
              matchingAttachment.type !== resourceAttachment.type
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
            const matchingAttachment = resources[
              resourceIndex
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
        `/api/resources/${resourceEditTargetId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResources((prev) =>
        prev.map((resource) =>
          resource.id === resourceEditTargetId
            ? { ...resource, ...data }
            : resource
        )
      );
      setResourceEditTargetId(null);
      setResourceEditTargetEnabled(null);
      setResourceEditTargetAnswer(null);
      setResourceEditTargetQuestion(null);
      setResourceEditTargetAttachments(null);

      showSuccessToast('Resource Updated!');
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || 'An error occurred');
    } finally {
      setDisableInput(false);
    }
  };

  const handleSwapResource = async (resourceId, swapPosition) => {
    try {
      setDisableInput(true);

      const { data } = await axios.post(`/api/resources/${resourceId}/swap`, {
        swapPosition,
      });

      setResources((prev) => {
        const { updatedResource, swappedResource } = data;
        const prevResources = [...prev];

        const updatedIndex = prevResources.findIndex(
          (resource) => resource.id === updatedResource.id
        );
        const swappedIndex = prevResources.findIndex(
          (resource) => resource.id === swappedResource.id
        );

        if (updatedIndex !== -1 && swappedIndex !== -1) {
          const tempUpdated = { ...prevResources[updatedIndex] };
          const tempSwapped = { ...prevResources[swappedIndex] };
          tempUpdated.order = tempSwapped.order;
          tempSwapped.order = prevResources[updatedIndex].order;

          prevResources[updatedIndex] = tempSwapped;
          prevResources[swappedIndex] = tempUpdated;
        }

        return [...prevResources];
      });

      showSuccessToast('Resources Updated!');
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

      if (resourceDeleteTargetAttachmentId) {
        await axios.delete(
          `/api/resources/${resourceDeleteTargetId}/attachments/${resourceDeleteTargetAttachmentId}`
        );
      } else {
        await axios.delete(`/api/resources/${resourceDeleteTargetId}`);
      }

      if (resourceDeleteTargetAttachmentId) {
        const updatedResources = resources.map((resource) => {
          if (resource.id === resourceDeleteTargetId) {
            const updatedAttachments = resource.attachments.filter(
              (attachment) => attachment.id !== resourceDeleteTargetAttachmentId
            );
            return {
              ...resource,
              attachments: updatedAttachments,
            };
          }
          return resource;
        });
        setResources(updatedResources);
        showSuccessToast('Attachment Successfully Deleted!');
      } else {
        const updatedResources = resources
          .filter((resource) => resource.id !== resourceDeleteTargetId)
          .sort((a, b) => a.order - b.order)
          .map((resource, index) => ({
            ...resource,
            order: index + 1,
          }));
        setResources(updatedResources);
        showSuccessToast('Resource Successfully Deleted!');
      }

      onClose();
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || 'An error occurred');
    } finally {
      setDisableInput(false);
    }
  };

  const handleOpenDeleteModal = (resourceId, attachmentId = null) => {
    setResourceDeleteTargetId(resourceId);
    setResourceDeleteTargetAttachmentId(attachmentId);
    onOpen();
  };

  useEffect(() => {
    if (resourceDeleteTargetId) {
      onOpen();
    } else {
      setResourceDeleteTargetId(null);
      setResourceDeleteTargetAttachmentId(null);
    }
  }, [resourceDeleteTargetId, onOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setDisableInput(true);
      try {
        const { data } = await axios.get('/api/resources');
        setResources(data);
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
        Dispatch Resources
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
            <ResourceList resources={resources} />
          </TabPanel>
          <TabPanel>
            <ResourceCreator onCreate={handleCreateResource} />
          </TabPanel>
          <TabPanel>
            <ResourceEditor
              resources={resources}
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
              handleSwapResource={handleSwapResource}
              handleOpenDeleteModal={handleOpenDeleteModal}
              resourceEditTargetAttachments={resourceEditTargetAttachments}
              setResourceEditTargetAttachments={
                setResourceEditTargetAttachments
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
            {resourceDeleteTargetAttachmentId ? (
              <p>Are you sure you want to delete this attachment?</p>
            ) : (
              <p>Are you sure you want to delete this Resource?</p>
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

export default ResourceManagement;
