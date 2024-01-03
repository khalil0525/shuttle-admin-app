import React from 'react';
import { Accordion, Box, Heading, Stack, Text } from '@chakra-ui/react';
import ResourceItem from './ResourceItem';

function ResourceList({ resources }) {
  return (
    <Box>
      <Stack
        spacing={[4, 8]}
        p={[4, 8]}
        boxShadow="lg"
        borderRadius="lg"
        bg="compBg"
        borderWidth="1px"
        borderColor="gray.200">
        <Heading
          as="h3"
          size="xl"
          mb={4}
          color="text">
          Dispatch Resources
        </Heading>

        {resources.length === 0 ? (
          <Text
            color="text"
            fontStyle="italic">
            There is currently no dispatch resources available. Check back later
            for updates!
          </Text>
        ) : (
          <Accordion allowToggle>
            {resources
              .filter((resourceItem) => resourceItem.enabled === true)
              .map((resourceItem) => (
                <ResourceItem
                  key={resourceItem.id}
                  resourceItem={resourceItem}
                />
              ))}
          </Accordion>
        )}
      </Stack>
    </Box>
  );
}

export default ResourceList;
