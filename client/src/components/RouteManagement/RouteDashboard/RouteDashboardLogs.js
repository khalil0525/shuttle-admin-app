import React, { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  IconButton,
  Collapse,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useSnackbar } from '../../../context/SnackbarProvider';

const RouteDashboardLogs = () => {
  const { showErrorToast } = useSnackbar();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/routes/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      showErrorToast(error.response.data.error);
    }
  };

  const LogsTable = ({ logs }) => {
    const [openDetailIndex, setOpenDetailIndex] = useState(null);

    const toggleRow = (index) => {
      setOpenDetailIndex(openDetailIndex === index ? null : index);
    };

    const renderCollapsedJSON = (data) => {
      const entries = Object.entries(data).slice(0, 3);
      const summary = entries
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(', ');
      const moreText = Object.keys(data).length > 3 ? '...more' : '';

      return (
        <Text isTruncated>
          {summary}
          {moreText && `, ${moreText}`}
        </Text>
      );
    };

    const renderJSON = (data) => (
      <VStack
        align="start"
        spacing={1}
        p="2"
        bg="gray.50"
        borderRadius="md">
        {Object.entries(data).map(([key, value]) => (
          <Text key={key}>
            <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
          </Text>
        ))}
      </VStack>
    );

    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Route</Th>
            <Th>User</Th>

            <Th>Type</Th>
            <Th>Action</Th>
            <Th>Data</Th>
            <Th>Changed At</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {logs.map((log, index) => (
            <>
              <Tr key={`log-${index}`}>
                <Td>{log.route.name}</Td>
                <Td>{log.user.email}</Td>

                <Td>{log.entityType}</Td>
                <Td>{log.actionType}</Td>
                <Td>{renderCollapsedJSON(log.data)}</Td>
                <Td>{new Date(log.changedAt).toLocaleString()}</Td>
                <Td>
                  <IconButton
                    aria-label="Toggle Details"
                    icon={
                      openDetailIndex === index ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                    onClick={() => toggleRow(index)}
                    size="sm"
                    variant="ghost"
                  />
                </Td>
              </Tr>
              <Tr key={`detail-${index}`}>
                <Td colSpan="7">
                  <Collapse in={openDetailIndex === index}>
                    {renderJSON(log.data)}
                  </Collapse>
                </Td>
              </Tr>
            </>
          ))}
        </Tbody>
      </Table>
    );
  };

  return (
    <Stack
      spacing={4}
      p={4}
      boxShadow="md"
      borderRadius="md"
      bgColor="compBg"
      color="text">
      <Box
        overflowX="auto"
        maxWidth="100%">
        <LogsTable logs={logs} />
      </Box>
    </Stack>
  );
};

export default RouteDashboardLogs;
