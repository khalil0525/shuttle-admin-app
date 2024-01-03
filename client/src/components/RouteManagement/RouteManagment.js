import React from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  Stack,
  Divider,
  HStack,
  Heading,
  Spacer,
} from '@chakra-ui/react';

const RouteManagement = ({
  routes,
  deleteRoute,
  updateRoute,
  setUpdatedRouteName,
  setUpdatedRouteColor,
  openNewRouteModal,
  updatedRouteName,
  updatedRouteColor,
}) => {
  return (
    <Box color="text">
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
          Manage Routes
        </Heading>
        <Button
          colorScheme="blue"
          onClick={openNewRouteModal}>
          New Route
        </Button>

        <Box>
          <Divider />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {routes.map((route) => (
              <li key={route.id}>
                <Stack
                  bg="compBg"
                  p={3}
                  borderRadius="md"
                  spacing={2}
                  alignItems="flex-start">
                  <HStack w="100%">
                    <Box
                      w="30px"
                      h="30px"
                      bg={route.color}
                      borderRadius="50%"
                      mr={3}
                    />
                    <Text
                      fontSize="18px"
                      fontWeight="bold">
                      {route.name}
                    </Text>
                  </HStack>

                  <Input
                    placeholder="New Name"
                    size="sm"
                    onChange={(e) => setUpdatedRouteName(e.target.value)}
                  />
                  <Input
                    placeholder="New Hex Color"
                    size="sm"
                    onChange={(e) => setUpdatedRouteColor(e.target.value)}
                  />
                  <HStack
                    spacing={2}
                    align="end"
                    justify="end"
                    alignSelf="flex-end">
                    <Button
                      onClick={() =>
                        updateRoute(
                          route.id,
                          updatedRouteName,
                          updatedRouteColor
                        )
                      }
                      colorScheme="blue"
                      size="sm">
                      Update
                    </Button>
                    <Button
                      onClick={() => deleteRoute(route.id)}
                      colorScheme="red"
                      size="sm">
                      Delete
                    </Button>
                  </HStack>
                </Stack>
                <Spacer h={2} />
                <Divider />
              </li>
            ))}
          </ul>
        </Box>
      </Stack>
    </Box>
  );
};

export default RouteManagement;
