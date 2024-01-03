import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Heading,
  Select,
  Input,
  Center,
} from '@chakra-ui/react';

const Settings = ({
  changePasswordWithToken,
  user,
  setAndStoreThemeMode,
  themeMode,
}) => {
  const [password, setPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await changePasswordWithToken(password);
      setPassword('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setAndStoreThemeMode(selectedTheme);
  };

  const isPasswordValid = password.length >= 8;
  return (
    <Box>
      <Center>
        <Box
          mt="3.2rem"
          p={4}
          maxWidth="1200px"
          width="100%">
          <Stack
            mt={['1.6rem', '4.8rem']}
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
      </Center>{' '}
    </Box>
  );
};

export default Settings;
