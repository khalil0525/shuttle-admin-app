import React, { useState, useEffect } from 'react';
import { Box, Button, Center, Flex, Stack } from '@chakra-ui/react';
import axios from 'axios';

import { useSnackbar } from '../../context/SnackbarProvider';

import LoginImageManagement from '../../components/LoginImageManagement/LoginImageMangement';

function Website({ socket, logout, user, changePasswordWithToken }) {
  const [activeTab, setActiveTab] = useState('website');

  const { showSuccessToast, showErrorToast } = useSnackbar();

  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchLoginPhotos();
  }, []);
  const fetchLoginPhotos = async () => {
    try {
      const { data } = await axios.get(`/api/images`);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadLoginPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post(`/api/images`, formData);

      setImages((prev) => [...prev, data]);
      showSuccessToast('Login photo successfully posted!');
    } catch (error) {
      console.error(error);

      showErrorToast(error.response.data.error);
      throw new Error(error);
    }
  };

  const deleteLoginPhoto = async (imageId) => {
    try {
      await axios.delete(`/api/images/${imageId}`);

      showSuccessToast('Login photo successfully deleted!');
    } catch (error) {
      console.error(error);

      showErrorToast(error.response.data.error);
      throw new Error(error);
    }
  };

  return (
    <Box>
      <Center>
        <Box
          p={4}
          maxWidth="1200px"
          width="100%">
          <Stack
            spacing={8}
            bg="compBg">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'center', md: 'center' }}
              justify={{ base: 'center', md: 'center' }}
              mt={['6.8rem', '4.8rem']}>
              <Button
                color="text"
                bg="compBg"
                variant={activeTab === 'website' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('website')}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}>
                Portal Content Management
              </Button>
            </Flex>

            {activeTab === 'website' && (
              <LoginImageManagement
                uploadLoginPhoto={uploadLoginPhoto}
                deleteLoginPhoto={deleteLoginPhoto}
                setImages={setImages}
                images={images}
              />
            )}
          </Stack>
        </Box>
      </Center>
    </Box>
  );
}

export default Website;
