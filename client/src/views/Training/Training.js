import React, { useState } from 'react';
import { Box, Button, Stack, Center, Flex } from '@chakra-ui/react';

import TrainerResourceManagement from '../../components/TrainerResourceManagement/TrainerResourceManagment';

function Training({
  socket,

  user,
}) {
  const [activeTab, setActiveTab] = useState('resources');

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
                variant={activeTab === 'resources' ? 'solid' : 'outline'}
                onClick={() => setActiveTab('resources')}
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}
                color="text"
                bg="compBg">
                Resources
              </Button>
            </Flex>

            {activeTab === 'resources' && (
              <TrainerResourceManagement user={user} />
            )}
          </Stack>
        </Box>
      </Center>
    </Box>
  );
}

export default Training;
