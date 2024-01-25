import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Flex,
  Stack,
  Heading,
  Divider,
  HStack,
  VStack,
} from "@chakra-ui/react";
import UserManagementActionsModal from "./UserManagementActionsModal";

const UserManagement = ({
  users,
  handleDeleteUser,

  openModal,
  updateUser,

  setEditUser,
  editUser,
  setUserToDeleteId,
  userToDeleteId,
  userToResetPasswordId,
  setUserToResetPasswordId,
  handleResetPassword,
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
    if (userToDeleteId) {
      setUserToDeleteId(null);
    } else if (userToResetPasswordId) {
      setUserToResetPasswordId(null);
    } else {
      setSelectedUser(null);
      setEditUser(null);
      setSelectedFile(null);
    }
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
        onClick={() => openModal("inviteUser")}>
        New User
      </Button>
      <Box>
        <Divider />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li key={user.id}>
              <Flex
                direction={["column", "row"]}
                alignItems={["flex-start", "center"]}
                justifyContent="space-between"
                bg="compBg"
                color="text"
                p={3}
                gap="0.4rem"
                borderRadius="md">
                <VStack
                  alignItems={["flex-start"]}
                  spacing={1}>
                  {user.name ? (
                    <HStack spacing={2}>
                      <Text fontWeight="bold">{user.name}</Text>
                    </HStack>
                  ) : (
                    <Text
                      fontSize="sm"
                      color="red.500"
                      fontWeight="bold">
                      Name Required
                    </Text>
                  )}
                  <HStack spacing={2}>
                    <Text
                      fontSize="sm"
                      color="gray.500">
                      {user.email}
                    </Text>
                  </HStack>
                </VStack>
                <HStack spacing={[2, 4]}>
                  <Button
                    onClick={() => openUserModal(user)}
                    colorScheme="blue"
                    size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => setUserToDeleteId(user.id)}
                    colorScheme="red"
                    size="sm">
                    Delete
                  </Button>

                  <Button
                    onClick={
                      user.resetMandatory
                        ? () => {}
                        : () => setUserToResetPasswordId(user.id)
                    }
                    opacity={user.resetMandatory ? 0.4 : 1}
                    disabled={true}
                    size="sm">
                    {user.resetMandatory ? "Reset Sent" : "Reset Password"}
                  </Button>
                </HStack>
              </Flex>
              <Divider />
            </li>
          ))}
        </ul>
      </Box>

      <UserManagementActionsModal
        isOpen={selectedUser || userToDeleteId || userToResetPasswordId}
        userToDeleteId={userToDeleteId}
        handleDeleteUser={handleDeleteUser}
        closeModal={closeModal}
        selectedUser={selectedUser}
        selectedFile={selectedFile}
        editUser={editUser}
        handleFileChange={handleFileChange}
        setEditUser={setEditUser}
        handlePermissionChange={handlePermissionChange}
        handleSaveChanges={handleSaveChanges}
        userToResetPasswordId={userToResetPasswordId}
        setUserToResetPasswordId={setUserToResetPasswordId}
        handleResetPassword={handleResetPassword}
      />
    </Stack>
  );
};

export default UserManagement;
