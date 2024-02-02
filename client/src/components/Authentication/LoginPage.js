import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useSnackbar } from "../../context/SnackbarProvider";

import { PiBusThin } from "react-icons/pi";

function LoginPage({ login, recoverPassword }) {
  const [password, setPassword] = useState("gggaabc123");
  const [emailError, setEmailError] = useState("");

  const [loginMessage, setLoginMessage] = useState("");
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { showErrorToast } = useSnackbar();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");
  const [email, setEmail] = useState(
    selectedRole === "admin" ? "testeradmin@test.com" : "testeruser@test.com"
  );
  const [passwordError, setPasswordError] = useState("");
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    return isEmailValid && isPasswordValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsButtonDisabled(true);

        const role = await login({ email: role, password: "gggabc123" });

        setLoginMessage("Login failed. Please check your credentials.");
      } catch (error) {
        setLoginMessage("");
        console.error(error);
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    try {
      setIsButtonDisabled(true);
      await recoverPassword(email);
      setEmail("");
      setNotificationMessage(
        "Password recovery email sent successfully. Check your email."
      );

      setTimeout(() => {
        setIsPasswordRecovery(false);
        setIsButtonDisabled(false);
      }, 5000);
    } catch (error) {
      setNotificationMessage("Email not found. Please check your email.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const toggleForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setLoginMessage("");
    setIsPasswordRecovery(!isPasswordRecovery);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotificationMessage("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [notificationMessage]);

  useEffect(() => {
    setEmailError("");
  }, [email]);

  useEffect(() => {
    const getLoginPhoto = async () => {
      try {
        const { data } = await axios.get(`/api/images/random`);
        setBackgroundImage(data.link);
      } catch (error) {
        console.error(error);
        setBackgroundImage(null);
        showErrorToast(error.response.data.error);
      }
    };
    getLoginPhoto();
  }, []);

  return (
    <Flex
      bg={backgroundImage ? `url(${backgroundImage})` : "#2596be"}
      onSubmit={isPasswordRecovery ? handlePasswordRecovery : handleLogin}
      backgroundSize="cover"
      backgroundPosition="center"
      justify="center"
      width="100%"
      minH="100vh">
      <Flex
        as="form"
        align="center"
        direction="column"
        justify="center"
        width="100%">
        <Box
          width="100%"
          p={6}
          maxWidth="400px"
          bg="compBg"
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
          justifyContent="center"
          justifyItems="center"
          color="text">
          <Box
            width="100%"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            p={2}
            textAlign="center"
            color="text">
            <PiBusThin style={{ fontSize: "48px" }} />
          </Box>
          <Text
            fontSize="24px"
            fontWeight="bold"
            mb={4}
            color="text">
            {isPasswordRecovery ? "Password Recovery" : ""}
          </Text>
          {!isPasswordRecovery && (
            <Text
              fontSize="24px"
              fontWeight="bold"
              mb={4}
              color="text">
              Login Portal
            </Text>
          )}
          {/* Add the role selection dropdown */}
          <FormControl
            mb={3}
            isInvalid={emailError !== ""}>
            <Select
              placeholder="Select Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              size="lg"
              borderRadius="lg">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </FormControl>
          <FormControl
            mb={3}
            isInvalid={emailError !== ""}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              borderRadius="lg"
              autoComplete="email"
              isDisabled={true}
            />
            <FormErrorMessage color="red">{emailError}</FormErrorMessage>
          </FormControl>
          {!isPasswordRecovery && (
            <FormControl
              mb={3}
              isInvalid={passwordError !== ""}>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                borderRadius="lg"
                autoComplete="current-password"
                isDisabled={true}
              />
              <FormErrorMessage color="red">{passwordError}</FormErrorMessage>
            </FormControl>
          )}
          <Button
            type="submit"
            bg="#2596be"
            colorScheme="teal"
            size="lg"
            width="100%"
            borderRadius="lg"
            mt={4}
            isDisabled={isButtonDisabled}>
            {isPasswordRecovery ? "Recover Password" : "Log In"}
          </Button>
          <Text
            mt={4}
            color="#2596be"
            textDecoration="underline"
            cursor="pointer"
            onClick={toggleForm}>
            {isPasswordRecovery
              ? "Back to Login"
              : "Forgot your password? Click here to recover."}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default LoginPage;
