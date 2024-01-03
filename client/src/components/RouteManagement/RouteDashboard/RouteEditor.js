import React, { useState } from 'react';
import {
  Box,
  Select,
  Textarea,
  Button,
  Input,
  Divider,
  Text,
  Flex,
} from '@chakra-ui/react';

function RouteEditor({ route, onUpdate, handleServiceUpdateDelete }) {
  const [primaryStatus, setPrimaryStatus] = useState(
    route?.serviceUpdates[0]?.type || 'On or Close'
  );
  const [primaryServiceUpdateText, setPrimaryServiceUpdateText] = useState(
    route?.serviceUpdates[0]?.serviceUpdateText || ''
  );
  const [primaryExpirationDate, setPrimaryExpirationDate] = useState(
    route?.serviceUpdates[0]?.expiration
      ? new Date(route.serviceUpdates[0].expiration).toISOString().slice(0, 16)
      : ''
  );

  const [secondaryServiceUpdateText, setSecondaryServiceUpdateText] = useState(
    route?.serviceUpdates[1]?.serviceUpdateText || ''
  );

  const [isSecondUpdate, setIsSecondUpdate] = useState(
    route?.serviceUpdates.length === 2 ? true : false
  );

  const handleAddServiceUpdate = () => {
    setIsSecondUpdate(true);
  };

  const handlePrimaryServiceUpdateStatusChange = (e) => {
    if (['Delays', 'On or Close', 'No Service'].includes(e.target.value)) {
      setPrimaryServiceUpdateText('');
      setPrimaryExpirationDate('');
      setIsSecondUpdate(false);
      setSecondaryServiceUpdateText('');
    }
    setPrimaryStatus(e.target.value);
  };

  const handleDeleteSecondUpdate = async () => {
    if (route?.serviceUpdates.length === 2) {
      await handleServiceUpdateDelete(route.id, route.serviceUpdates[1].id);
    }
    setIsSecondUpdate(false);
    setSecondaryServiceUpdateText('');
  };
  const handleUpdateRoute = async () => {
    await onUpdate(
      {
        type: primaryStatus,
        serviceUpdateText: primaryServiceUpdateText,
        expiration: primaryExpirationDate.length ? primaryExpirationDate : null,
      },
      {
        type: isSecondUpdate ? 'Delays' : '',
        serviceUpdateText: secondaryServiceUpdateText,
        expiration: null,
      }
    );
  };
  return (
    <Box p={4}>
      <Box>
        <Select
          mb={4}
          value={primaryStatus}
          onChange={handlePrimaryServiceUpdateStatusChange}>
          <option value="On or Close">On or Close</option>
          <option value="Delays">Delays</option>
          <option value="No Service">No Service</option>
          <option value="Planned Detour">Planned Detour</option>
        </Select>

        {(primaryStatus === 'Planned Detour' || primaryStatus === 'Delays') && (
          <Textarea
            mb={4}
            placeholder="Service Update Text"
            value={primaryServiceUpdateText}
            onChange={(e) => setPrimaryServiceUpdateText(e.target.value)}
          />
        )}

        {primaryStatus === 'Planned Detour' && (
          <Input
            mb={4}
            type="datetime-local"
            value={primaryExpirationDate}
            onChange={(e) => setPrimaryExpirationDate(e.target.value)}
          />
        )}

        <Divider />

        {primaryStatus === 'Planned Detour' && !isSecondUpdate && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleAddServiceUpdate}>
            {primaryStatus === 'Delays' ? 'Add Planned Detour' : 'Add Delays'}
          </Button>
        )}

        {isSecondUpdate && (
          <>
            <Text
              mt={2}
              mb={4}>
              Delays
            </Text>

            {primaryStatus === 'Planned Detour' && (
              <Textarea
                mb={4}
                placeholder="Service Update Text"
                value={secondaryServiceUpdateText}
                onChange={(e) => setSecondaryServiceUpdateText(e.target.value)}
              />
            )}
          </>
        )}
        {isSecondUpdate && (
          <Flex
            w="100%"
            justifyContent="end">
            <Button
              colorScheme="red"
              size="sm"
              onClick={handleDeleteSecondUpdate}>
              Delete
            </Button>
          </Flex>
        )}
      </Box>

      <Button
        mt={4}
        colorScheme="blue"
        onClick={handleUpdateRoute}>
        Update Route
      </Button>
    </Box>
  );
}

export default RouteEditor;
