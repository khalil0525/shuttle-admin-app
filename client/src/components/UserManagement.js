import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Stack,
  Heading,
  Divider,
  HStack,
  Checkbox,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
} from '@chakra-ui/react';

const UserManagement = ({
  users,
  deleteUser,

  openModal,
  updateUser,

  setEditUser,
  editUser,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      photoURL: user.photoURL,
      isAdmin: user.isAdmin,
      permissions: user.permissions,
    });
  };

  const closeModal = () => {
    setSelectedUser(null);
    setEditUser(null);
    setSelectedFile(null);
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(selectedUser.id, editUser, selectedFile);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermissionChange = (tabName, variable) => {
    setEditUser((prevEditUser) => {
      const updatedPermissions = prevEditUser.permissions.map((permission) => {
        if (permission.tabName === tabName) {
          return {
            ...permission,
            [variable]: !permission[variable],
          };
        }
        return permission;
      });

      return {
        ...prevEditUser,
        permissions: updatedPermissions,
      };
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Stack
      spacing={[4, 8]}
      p={[2, 4]}
      boxShadow="md"
      borderRadius="md"
      bg="compBg"
      color="text">
      <Heading
        as="h3"
        size="md"
        mb={4}>
        Manage Users
      </Heading>
      <Button
        colorScheme="blue"
        onClick={() => openModal('inviteUser')}>
        New User
      </Button>
      <Box>
        <Divider />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li key={user.id}>
              <Flex
                direction={['column', 'row']}
                alignItems={['flex-start', 'center']}
                justifyContent="space-between"
                bg="compBg"
                color="text"
                p={3}
                gap="0.4rem"
                borderRadius="md">
                <Text
                  mb={[2, 0]}
                  fontWeight="bold">
                  {user.email}
                </Text>
                <HStack spacing={[2, 4]}>
                  <Button
                    onClick={() => openUserModal(user)}
                    colorScheme="blue"
                    size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteUser(user.id)}
                    colorScheme="red"
                    size="sm">
                    Delete
                  </Button>
                </HStack>
              </Flex>
              <Divider />
            </li>
          ))}
        </ul>
      </Box>
      <Modal
        isOpen={!!selectedUser}
        onClose={closeModal}
        size="lg">
        <ModalOverlay />
        <ModalContent
          color="text"
          bg="compBg"
          h={['100vh', 'auto']}
          mt="0">
          <ModalHeader>Edit User: {selectedUser?.email}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={[2, 4]}>
              <Box mb={[2, 4]}>
                <Box
                  position="relative"
                  sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : editUser?.photoURL
                        ? editUser.photoURL
                        : ''
                    }
                    alt="Selected"
                    width={['75px', '100px']}
                    height={['75px', '100px']}
                    borderRadius="full"
                  />
                  <Input
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    opacity="0"
                    size="sm"
                    position="absolute"
                    cursor="pointer"
                    width="100px"
                    height="100px"
                    zIndex="1"
                  />
                </Box>
              </Box>
              <Text fontSize="xl">Name</Text>

              <Input
                sx={{ display: 'flex', gap: '1.6rem', margin: '0.8rem 0' }}
                value={editUser?.name || ''}
                onChange={(e) =>
                  setEditUser((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                size="sm"
                placeholder="Name"
              />
            </Box>

            <Box>
              <Text fontSize="xl">Dispatch</Text>
              <Box sx={{ display: 'flex', gap: '1.6rem', margin: '0.8rem 0' }}>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'dispatch'
                    ).canView
                  }
                  onChange={() =>
                    handlePermissionChange('dispatch', 'canView')
                  }>
                  View
                </Checkbox>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'dispatch'
                    ).canAdmin
                  }
                  onChange={() =>
                    handlePermissionChange('dispatch', 'canAdmin')
                  }>
                  Admin
                </Checkbox>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xl">Training</Text>
              <Box sx={{ display: 'flex', gap: '1.6rem', margin: '0.8rem 0' }}>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'training'
                    ).canView
                  }
                  onChange={() =>
                    handlePermissionChange('training', 'canView')
                  }>
                  View
                </Checkbox>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'training'
                    ).canAdmin
                  }
                  onChange={() =>
                    handlePermissionChange('training', 'canAdmin')
                  }>
                  Admin
                </Checkbox>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xl">Whiteboard</Text>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1.6rem',
                  margin: '0.8rem 0',
                  alignItems: 'center !important',
                }}>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'whiteboard'
                    ).canView
                  }
                  onChange={() =>
                    handlePermissionChange('whiteboard', 'canView')
                  }>
                  View
                </Checkbox>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'whiteboard'
                    ).canAdmin
                  }
                  onChange={() =>
                    handlePermissionChange('whiteboard', 'canAdmin')
                  }>
                  Admin
                </Checkbox>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xl">Website</Text>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1.6rem',
                  margin: '0.8rem 0',
                  alignItems: 'center !important',
                }}>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'website'
                    ).canView
                  }
                  onChange={() => handlePermissionChange('website', 'canView')}>
                  View
                </Checkbox>
                <Checkbox
                  isChecked={
                    editUser?.permissions?.find(
                      (permission) => permission.tabName === 'website'
                    ).canAdmin
                  }
                  onChange={() =>
                    handlePermissionChange('website', 'canAdmin')
                  }>
                  Admin
                </Checkbox>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xl">Admin</Text>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1.6rem',
                  margin: '0.8rem 0',
                  alignItems: 'center !important',
                }}>
                <Checkbox
                  isChecked={editUser?.isAdmin}
                  onChange={() =>
                    setEditUser((prev) => {
                      return { ...prev, isAdmin: !prev.isAdmin };
                    })
                  }>
                  Enable
                </Checkbox>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter sx={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              colorScheme="blue"
              onClick={handleSaveChanges}>
              Save
            </Button>
            <Button
              colorScheme="gray"
              onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default UserManagement;
