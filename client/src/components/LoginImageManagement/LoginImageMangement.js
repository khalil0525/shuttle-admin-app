import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Input,
} from '@chakra-ui/react';

const LoginImageManagement = ({
  uploadLoginPhoto,
  deleteLoginPhoto,

  setImages,
  images,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteImageTargetId, setDeleteImageTargetId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const handleImageUpload = async (event) => {
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      console.log(uploadedImage);
      setSelectedImage(uploadedImage);

      setIsSaveButtonDisabled(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      if (deleteImageTargetId) {
        await deleteLoginPhoto(deleteImageTargetId);

        const updatedImages = images.filter(
          (image) => image.id !== deleteImageTargetId
        );
        setImages(updatedImages);
        setDeleteImageTargetId(null);
        closeDeleteModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSaveButtonClick = async () => {
    try {
      if (selectedImage) {
        await uploadLoginPhoto(selectedImage);

        setSelectedImage(null);
        setIsSaveButtonDisabled(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
        color="#fff">
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={4}>
          Login Image Management
        </Text>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        {selectedImage && (
          <Box
            mt={4}
            m="1.6rem 0"
            sx={{
              display: 'flex',
              gap: '0.8rem',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text fontSize="lg">Image To Upload:</Text>
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              maxW="200px"
            />
          </Box>
        )}
        <Button
          onClick={() => fileInputRef.current.click()}
          mb={4}
          colorScheme="blue">
          Upload Image
        </Button>
        {selectedImage && (
          <Button
            colorScheme="teal"
            mt={4}
            onClick={handleSaveButtonClick}
            isDisabled={isSaveButtonDisabled}>
            Save
          </Button>
        )}

        <Divider
          orientation="horizontal"
          my={4}
        />
        <Flex
          wrap="wrap"
          direction={['column', 'row']}
          alignItems="center"
          justifyContent="center"
          w="100%"
          maxW="100%">
          {images.map((image, index) => (
            <Box
              key={index}
              m={2}
              position="relative">
              <Image
                src={image.link}
                alt={`Image ${index + 1}`}
                maxH="200px"
                maxW="200px"
                cursor="pointer"
                onClick={() => setSelectedImage(image)}
              />
              <Button
                size="sm"
                backgroundColor="compBg"
                color="text"
                variant="outlined"
                position="absolute"
                right="1"
                top="1"
                onClick={() => {
                  setDeleteImageTargetId(image.id);
                  openDeleteModal();
                }}>
                X
              </Button>
            </Box>
          ))}
        </Flex>
      </Box>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent
          bg="compBg"
          color="text">
          <ModalHeader>Delete Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this image?</ModalBody>
          <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              colorScheme="red"
              onClick={handleImageDelete}>
              Yes
            </Button>
            <Button
              colorScheme="gray"
              ml={3}
              onClick={closeDeleteModal}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginImageManagement;
