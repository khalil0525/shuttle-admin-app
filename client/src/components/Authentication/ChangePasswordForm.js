import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
} from '@chakra-ui/react';

const ChangePasswordForm = ({ onChangePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateNewPassword = () => {
    if (newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setNewPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateForm = () => {
    const isNewPasswordValid = validateNewPassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return isNewPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onChangePassword(newPassword);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isInvalid={newPasswordError !== ''}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <FormErrorMessage color="red">{newPasswordError}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={confirmPasswordError !== ''}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <FormErrorMessage color="red">
            {confirmPasswordError}
          </FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          mt={4}
          width="100%">
          Change Password
        </Button>
      </VStack>
    </form>
  );
};

export default ChangePasswordForm;
