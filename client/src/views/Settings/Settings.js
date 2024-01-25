import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Stack,
  Heading,
  Select,
  Input,
  Center,
} from "@chakra-ui/react";

const Settings = ({
  changePasswordWithToken,
  user,
  setAndStoreThemeMode,
  themeMode,
  onAdminChangeName,
}) => {
  const [password, setPassword] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [nameError, setNameError] = useState("");

  const handleChangePassword = async () => {
    try {
      await changePasswordWithToken(password);
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveName = async () => {
    try {
      validateName();

      if (!nameError) {
        await onAdminChangeName(newName);
        setNewName("");
        setEditingName(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setAndStoreThemeMode(selectedTheme);
  };

  const isPasswordValid = password.length >= 8;

  const validateName = () => {
    if (newName.trim().length < 2) {
      setNameError("Name must be at least 2 characters long.");
    } else {
      const nameRegex = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>_-]+$/;
      if (!nameRegex.test(newName.trim())) {
        setNameError("Invalid characters in the name.");
      } else {
        setNameError("");
      }
    }
  };

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleCancelEdit = () => {
    setNewName(user?.name || "");
    setEditingName(false);
    setNameError("");
  };

  return (
    <Box>
      <Center>
        <Box
          mt="3.2rem"
          p={4}
          maxWidth="1200px"
          width="100%">
          <Stack
            mt={["1.6rem", "4.8rem"]}
            mx="auto"
            spacing={[4, 8]}
            p={[4, 8]}
            boxShadow="md"
            borderRadius="md"
            bg="compBg"
            color="text"
            align="center"
            maxWidth="400px">
            <Heading
              as="h3"
              size="md"
              mb={4}>
              User Settings
            </Heading>
            {user.isAdmin && (
              <Box w="100%">
                <Text
                  fontWeight="bold"
                  mb={2}>
                  Name
                </Text>
                {editingName ? (
                  <>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={validateName}
                    />
                    {nameError && (
                      <Text
                        color="red"
                        fontSize="sm"
                        mt={1}>
                        {nameError}
                      </Text>
                    )}
                    <Button
                      mt={2}
                      mr={2}
                      colorScheme="green"
                      onClick={handleSaveName}
                      isDisabled={!!nameError}>
                      Save
                    </Button>
                    <Button
                      mt={2}
                      color="text"
                      bg="compBg"
                      variant="outline"
                      onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Text>{user?.name || "unset"}</Text>
                    <Button
                      mt={2}
                      colorScheme="blue"
                      onClick={handleEditName}>
                      Edit
                    </Button>
                  </>
                )}
              </Box>
            )}

            <Box w="100%">
              <Text
                fontWeight="bold"
                mb={2}>
                Change Password
              </Text>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isPasswordValid && (
                <Text
                  color="red"
                  fontSize="sm"
                  mt={1}>
                  Password must be at least 8 characters long.
                </Text>
              )}
              <Button
                mt={2}
                colorScheme="blue"
                onClick={handleChangePassword}
                isDisabled={!isPasswordValid}>
                Change Password
              </Button>
            </Box>

            <Box w="100%">
              <Text
                fontWeight="bold"
                mb={2}>
                Theme
              </Text>

              <Select
                w="100%"
                value={themeMode}
                onChange={(e) => handleThemeChange(e.target.value)}>
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
              <Text>Choose your preferred theme</Text>
            </Box>
          </Stack>
        </Box>
      </Center>{" "}
    </Box>
  );
};

export default Settings;
