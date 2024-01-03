import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Center,
  VStack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import axios from 'axios';

import { useSnackbar } from '../../context/SnackbarProvider';
import RouteAccordion from '../../components/RouteManagement/RouteDashboard/RouteAccordion';
import RouteManagement from '../../components/RouteManagement/RouteManagment';

import FormSubmissionManagement from '../../components/FormSubmissionManagement/FormSubmissionManagement';
import DispatchForm from '../../components/DispatchForm';
import ResourceManagement from '../../components/ResourceManagement/ResourceManagment';
import RouteDashboard from '../../components/RouteManagement/RouteDashboard/RouteDashboard';

function Dashboard({
  socket,

  user,
}) {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    userType: 'dispatcher',
  });
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    name: '',
    hexColor: '',
  });
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isinviteUserModalOpen, setIsinviteUserModalOpen] = useState(false);
  const [updatedRouteName, setUpdatedRouteName] = useState('');
  const [updatedRouteColor, setUpdatedRouteColor] = useState('');
  const [activeTab, setActiveTab] = useState('dispatchDashboard');
  const [isValidEmailFormat, setIsValidEmailFormat] = useState(false);
  const { showSuccessToast, showErrorToast } = useSnackbar();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openModal = (modal) => {
    if (modal === 'route') {
      setIsRouteModalOpen(true);
    } else if (modal === 'inviteUser') {
      setIsinviteUserModalOpen(true);
    }
  };
  const closeModal = (modal) => {
    if (modal === 'route') {
      setIsRouteModalOpen(false);

      setNewRoute({ name: '', hexColor: '' });
    } else if (modal === 'inviteUser') {
      setIsinviteUserModalOpen(false);

      setNewUser({ email: '', password: '', userType: 'dispatcher' });
    }
  };

  const inviteUser = async () => {
    try {
      await axios.post(
        `/auth/user/invite?email=${newUser.email}&userType=${newUser.userType}`
      );

      showSuccessToast(
        'User invited! You must wait 5 minutes before sending another invitation.'
      );

      closeModal('inviteUser');
    } catch (error) {
      console.error(error);

      showErrorToast(error.response.data.error);
    }
  };

  const addRoute = async () => {
    try {
      await axios.post('/api/routes', {
        name: newRoute.name,
        color: newRoute.hexColor,
      });

      showSuccessToast('New route added!');
      fetchRoutes();
      closeModal('route');
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data } = await axios.get('/api/routes', {
        withCredentials: false,
      });
      setRoutes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateRoute = async (routeId, newName, newColor) => {
    try {
      await axios.put(`/api/routes/update/${routeId}`, {
        name: newName,
        color: newColor,
      });

      showSuccessToast('Route updated!');
      fetchRoutes();
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };

  const deleteRoute = async (routeId) => {
    try {
      await axios.delete(`/api/routes/${routeId}`);

      showSuccessToast('Route deleted!');
      fetchRoutes();
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmailFormat(emailRegex.test(newUser.email));
  }, [newUser.email]);

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
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'center', md: 'center' }}
              justify={{ base: 'center', md: 'center' }}
              mt={['6.8rem', '4.8rem']}>
              <Button
                color="text"
                bg="compBg"
                variant={
                  activeTab === 'dispatchDashboard' ? 'solid' : 'outline'
                }
                onClick={() => setActiveTab('dispatchDashboard')}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}>
                Route Dashboard
              </Button>
              {(user?.isAdmin ||
                user?.permissions?.find((perm) => perm.tabName === 'dispatch')
                  ?.canAdmin) && (
                <Button
                  variant={activeTab === 'routes' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('routes')}
                  mb={{ base: 2, md: 0 }}
                  mr={{ base: 0, md: 2 }}
                  color="text"
                  bg="compBg">
                  Route Management
                </Button>
              )}

              <Button
                variant={activeTab === 'dispatchReport' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('dispatchReport')}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}
                color="text"
                bg="compBg">
                Dispatch Report
              </Button>
              {user?.isAdmin && (
                <Button
                  variant={activeTab === 'submissions' ? 'solid' : 'outline'}
                  onClick={() => setActiveTab('submissions')}
                  mb={{ base: 2, md: 0 }}
                  mr={{ base: 0, md: 2 }}
                  color="text"
                  bg="compBg">
                  Submissions
                </Button>
              )}

              <Button
                variant={activeTab === 'resources' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('resources')}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}
                color="text"
                bg="compBg">
                Resources
              </Button>
            </Flex>
            {/* Dispatch Dashboard */}
            {activeTab === 'dispatchDashboard' && (
              <Stack spacing={4}>
                <RouteDashboard
                  socket={socket}
                  user={user}
                />
              </Stack>
            )}
            {activeTab === 'routes' && (
              <RouteManagement
                routes={routes}
                deleteRoute={deleteRoute}
                updateRoute={updateRoute}
                setUpdatedRouteName={setUpdatedRouteName}
                setUpdatedRouteColor={setUpdatedRouteColor}
                openNewRouteModal={() => openModal('route')}
                updatedRouteName={updatedRouteName}
                updatedRouteColor={updatedRouteColor}
              />
            )}
            {activeTab === 'dispatchReport' && (
              <Stack spacing={4}>
                <DispatchForm />
              </Stack>
            )}
            {activeTab === 'submissions' && (
              <FormSubmissionManagement user={user} />
            )}{' '}
            {activeTab === 'resources' && <ResourceManagement user={user} />}
          </Stack>
        </Box>
      </Center>

      <Modal
        isOpen={isRouteModalOpen}
        onClose={() => closeModal('route')}>
        <ModalOverlay />

        <ModalContent
          bg="compBg"
          color="text">
          <ModalHeader>Add Routes</ModalHeader>
          <ModalBody>
            <Stack
              spacing={[4, 8]}
              p={[0, 4]}
              boxShadow="md"
              borderRadius="md"
              bg="compBg"
              color="text">
              <Input
                placeholder="Route Name"
                value={newRoute.name}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, name: e.target.value })
                }
              />
              <Input
                placeholder="Hex Color"
                value={newRoute.hexColor}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, hexColor: e.target.value })
                }
              />
              <Button
                colorScheme="green"
                onClick={addRoute}>
                Add Route
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="compBg"
              color="text"
              variant="outline"
              onClick={() => closeModal('route')}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isinviteUserModalOpen}
        onClose={() => closeModal('inviteUser')}>
        <ModalOverlay />
        <ModalContent
          bg="compBg"
          color="text">
          <ModalHeader>Invite New User</ModalHeader>
          <ModalBody>
            <VStack
              spacing={4}
              align="stretch"
              bg="compBg"
              color="text">
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

              <Select
                value={newUser.userType}
                onChange={(e) =>
                  setNewUser({ ...newUser, userType: e.target.value })
                }>
                <option value="dispatcher">Dispatcher</option>
                <option value="admin">Admin</option>
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={inviteUser}
              isDisabled={!isValidEmailFormat}>
              Invite User
            </Button>
            <Button
              variant="outline"
              onClick={() => closeModal('inviteUser')}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Dashboard;
