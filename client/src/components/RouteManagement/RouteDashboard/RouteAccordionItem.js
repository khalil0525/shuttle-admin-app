import React, { useState } from 'react';
import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Switch,
  HStack,
} from '@chakra-ui/react';

import RouteEditor from './RouteEditor';
import { useSnackbar } from '../../../context/SnackbarProvider';

const RouteAccordionItem = ({
  route,
  handleCreateServiceUpdate,
  handleUpdateServiceUpdate,
  handleServiceUpdateDelete,
  handleEnableDisableRoute,
}) => {
  const { showErrorToast } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const handleToggle = async () => {
    if (!loading) {
      try {
        setLoading(true);
        await handleEnableDisableRoute(route.id);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleUpdate = async (primaryServiceUpdate, secondaryServiceUpdate) => {
    try {
      if (primaryServiceUpdate.type) {
        if (!route.serviceUpdates.length) {
          await handleCreateServiceUpdate(
            route.id,
            primaryServiceUpdate,
            secondaryServiceUpdate
          );
        } else {
          await handleUpdateServiceUpdate(
            route.id,
            primaryServiceUpdate,
            secondaryServiceUpdate
          );
        }
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };
  return (
    <AccordionItem
      key={route.id}
      bg="compBg"
      color="text">
      <AccordionButton>
        <Box
          w="30px"
          h="30px"
          bg={route.color}
          borderRadius="50%"
          mr={3}
        />
        <Box
          flex="1"
          textAlign="left"
          fontSize="22px">
          {route.name}
        </Box>
        <HStack
          spacing={3}
          mr={3}>
          <Switch
            colorScheme="green"
            size="lg"
            isChecked={route.enabled}
            disabled={loading}
            onChange={handleToggle}
          />
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <RouteEditor
          route={route}
          onUpdate={handleUpdate}
          handleServiceUpdateDelete={handleServiceUpdateDelete}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

export default RouteAccordionItem;
