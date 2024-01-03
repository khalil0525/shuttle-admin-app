import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';

const Register = ({ checkAuth, registerInvitedUser }) => {
  const history = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [tempPasswordError, setTempPasswordError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageToken = urlParams.get('token');

    if (!token || !tokenValid) {
      if (pageToken) {
        checkAuth(pageToken)
          .then((response) => {
            if (response.valid && !token) {
              setToken(pageToken);
              setTokenValid(true);
            } else {
              setTimeout(() => {
                history('/');
              }, 3000);
            }
          })
          .catch((error) => {
            console.error('Error checking authentication:', error);
          });
      } else {
        history('/');
      }
    }
  }, [location.search, checkAuth, history, token, tokenValid]);
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const validateTempPassword = (tempPassword) => {
    if (tempPassword.length < 8) {
      return 'Temporary password must be at least 8 characters long.';
    }
    return '';
  };

  const validateForm = () => {
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);
    const tempPasswordError = validateTempPassword(tempPassword);

    setPasswordError(passwordError);
    setConfirmPasswordError(confirmPasswordError);
    setTempPasswordError(tempPasswordError);

    return !passwordError && !confirmPasswordError && !tempPasswordError;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        await registerInvitedUser(token, password, tempPassword);

        history('/');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  return (
    <>
      {tokenValid && token && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          height="100vh"
          bg="gray.100">
          <Box
            p={8}
            maxWidth="400px"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            textAlign="center">
            <Text
              fontSize="24px"
              fontWeight="bold"
              mb={4}>
              Registration
            </Text>
            <form onSubmit={handleRegister}>
              <FormControl
                mb={3}
                isInvalid={tempPasswordError !== ''}>
                <FormLabel>Temporary Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your temporary password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                />
                <FormErrorMessage color="red">
                  {tempPasswordError}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                mb={3}
                isInvalid={passwordError !== ''}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                />
                <FormErrorMessage color="red">{passwordError}</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={3}
                isInvalid={confirmPasswordError !== ''}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="lg"
                  borderRadius="lg"
                />
                <FormErrorMessage color="red">
                  {confirmPasswordError}
                </FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                bg="#2596be"
                colorScheme="teal"
                size="lg"
                width="100%"
                borderRadius="lg"
                mt={4}>
                Register
              </Button>
            </form>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Register;
