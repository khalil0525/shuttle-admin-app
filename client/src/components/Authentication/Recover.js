import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

const Recover = ({ checkAuth, recoveryChangePassword }) => {
  const history = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

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
              setNotificationMessage('Redirecting in 3 seconds...');
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

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateForm = () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    return isPasswordValid && isConfirmPasswordValid;
  };

  const handleRecover = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await recoveryChangePassword(token, password);

      setNotificationMessage(
        'Password changed successfully. Redirecting in 6 seconds...'
      );
      setTimeout(() => {
        history('/');
      }, 6000);
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleRecover}
      direction="column"
      justify="center"
      align="center"
      p={8}
      width="100%"
      minHeight="100vh">
      <Box
        width="100%"
        p={6}
        maxWidth="400px"
        bg="#fff"
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
        justifyContent="center"
        color="black">
        <Text
          fontSize="24px"
          fontWeight="bold"
          mb={4}
          color="#000">
          Password Recovery
        </Text>
        {tokenValid ? (
          <>
            <Text
              fontSize="16px"
              mb={4}
              color="#000"
              fontWeight="normal">
              Enter a new password for your account.
            </Text>
            <FormControl
              mb={3}
              isInvalid={passwordError !== ''}>
              <Input
                type="password"
                placeholder="Enter your new password"
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
              <Input
                type="password"
                placeholder="Confirm your new password"
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
              Recover Password
            </Button>
          </>
        ) : (
          <Text
            fontSize="16px"
            mb={4}
            color="red"
            fontWeight="normal">
            Invalid or expired recovery token. Please try again.
          </Text>
        )}
        {notificationMessage && (
          <Text
            fontSize="16px"
            mb={4}
            color="green"
            fontWeight="normal">
            {notificationMessage}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Recover;
