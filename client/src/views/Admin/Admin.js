import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Center,
  Flex,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";

import { useSnackbar } from "../../context/SnackbarProvider";
import UserManagement from "../../components/UserManagement/UserManagement";

function Admin({ socket, logout, user, changePasswordWithToken }) {
  const [activeTab, setActiveTab] = useState("user");
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [editUser, setEditUser] = useState({
    isAdmin: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidEmailFormat, setIsValidEmailFormat] = useState(false);
  const [isValidNameFormat, setIsValidNameFormat] = useState(true);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [userToResetPasswordId, setUserToResetPasswordId] = useState(null);
  const { showSuccessToast, showErrorToast } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/auth/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/auth/delete-account/${userToDeleteId}`);
      showSuccessToast("User successfully deleted!");
      await fetchUsers();
      setUserToDeleteId(null);
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };
  const handleResetPassword = async (userId) => {
    try {
      const { data } = await axios.post(`/auth/password/reset/${userId}`);

      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,

                resetMandatory: data.user.resetMandatory,
              }
            : user
        );
      });

      showSuccessToast("Password reset successfully!");
      setUserToResetPasswordId(null);
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.error || "Error resetting password");
    }
  };
  const updateUser = async (userId, data, file) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key];

        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }

      if (file) {
        formData.append("file", file);
      }

      await axios.put(`/auth/update-user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccessToast("User privileges updated!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const inviteUser = async () => {
    try {
      await axios.post(
        `/auth/user/invite?email=${newUser.email}&isAdmin=${newUser.isAdmin}`,
        { name: newUser.name }
      );

      showSuccessToast(
        "User invited! You must wait 5 minutes before sending another invitation."
      );

      closeModal("inviteUser");
    } catch (error) {
      console.error(error);

      showErrorToast(error.response.data.error);
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmailFormat(emailRegex.test(newUser.email));
  }, [newUser.email]);

  useEffect(() => {
    const isValidNameFormat = () => {
      const nameRegex = /^[a-zA-Z0-9\s]+$/;
      return newUser.name.trim() === "" || nameRegex.test(newUser.name);
    };
    setIsValidNameFormat(isValidNameFormat());
  }, [newUser.name]);

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({ email: "", password: "", isAdmin: false, name: "" });
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
              direction={{ base: "column", md: "row" }}
              align={{ base: "center", md: "center" }}
              justify={{ base: "center", md: "center" }}
              mt={["6.8rem", "4.8rem"]}>
              <Button
                color="text"
                bg="compBg"
                variant={activeTab === "user" ? "solid" : "outline"}
                onClick={() => setActiveTab("user")}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}>
                User Management
              </Button>
            </Flex>
            {activeTab === "user" && (
              <UserManagement
                users={users}
                handleDeleteUser={handleDeleteUser}
                updateUser={updateUser}
                openModal={setIsModalOpen}
                setEditUser={setEditUser}
                editUser={editUser}
                setUserToDeleteId={setUserToDeleteId}
                userToDeleteId={userToDeleteId}
                userToResetPasswordId={userToResetPasswordId}
                setUserToResetPasswordId={setUserToResetPasswordId}
                handleResetPassword={handleResetPassword}
              />
            )}
          </Stack>
        </Box>
      </Center>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}>
        <ModalOverlay />
        <ModalContent
          color="text"
          bg="compBg">
          <ModalHeader>Invite New User</ModalHeader>
          <ModalBody>
            <VStack
              spacing={4}
              align="stretch">
              <FormControl isInvalid={!isValidEmailFormat}>
                <Input
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <FormErrorMessage>
                  Email is not in a valid format.
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!isValidNameFormat}>
                <Input
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <FormErrorMessage>
                  Name can only contain alphanumeric characters and spaces.
                </FormErrorMessage>
              </FormControl>
              <Checkbox
                value={newUser.isAdmin}
                onChange={(e) =>
                  setNewUser({ ...newUser, isAdmin: e.target.value })
                }>
                Admin
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter sx={{ display: "flex", gap: "0.8rem" }}>
            <Button
              colorScheme="green"
              onClick={inviteUser}
              isDisabled={!isValidEmailFormat}>
              Invite User
            </Button>
            <Button
              color="text"
              bg="compBg"
              variant="outline"
              onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Admin;
