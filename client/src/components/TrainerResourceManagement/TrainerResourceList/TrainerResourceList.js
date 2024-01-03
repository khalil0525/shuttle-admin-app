import React from 'react';
import { Accordion, Box, Heading, Stack, Text } from '@chakra-ui/react';
import TrainerResourceItem from './TrainerResourceItem';

function TrainerResourceList({ trainerResources }) {
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
          Trainer Resources
        </Heading>

        {trainerResources.length === 0 ? (
          <Text
            color="text"
            fontStyle="italic">
            There is currently no trainer resources available. Check back later
            for updates!
          </Text>
        ) : (
          <Accordion allowToggle>
            {trainerResources
              .filter(
                (trainerResourceItem) => trainerResourceItem.enabled === true
              )
              .map((trainerResourceItem) => (
                <TrainerResourceItem
                  key={trainerResourceItem.id}
                  trainerResourceItem={trainerResourceItem}
                />
              ))}
          </Accordion>
        )}
      </Stack>
    </Box>
  );
}

export default TrainerResourceList;
