import React, { useEffect, useMemo, useState } from 'react';
import {
  Stack,
  Heading,
  Divider,
  Box,
  Flex,
  Button,
  Text,
  TabList,
  Tab,
  Tabs,
} from '@chakra-ui/react';

import axios from 'axios';
import ManualAddFullRunsModal from './ManualAddFullRunsModal';
import ConfirmDeletionModal from './ConfirmDeletionModal';
import ExportCSVModal from './ExportCSVModal';
import TableComponent from './ReportTable';

const FormSubmissionManagement = ({ user }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [fullRuns, setFullRuns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: '',
    date: '',
    time: '',
    passengersLeftBehind: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsData = await getDispatchReports();
        const fullRunsData = await getFullRuns();
        setReports(reportsData);
        setFullRuns(fullRunsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const getDispatchReports = async () => {
    try {
      const response = await axios.get(`/api/reports`);
      return response.data.dispatchReports;
    } catch (error) {
      throw error.response.data;
    }
  };

  const getFullRuns = async () => {
    try {
      const response = await axios.get(`/api/reports/full-run`);
      return response.data.fullRuns;
    } catch (error) {
      throw error.response.data;
    }
  };
  const getDataForCSVExport = (startDate, endDate) => {
    let data;
    let headers;

    if (activeTab === 'reports') {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = reports
          .filter((report) => {
            const reportDate = new Date(report.dateOfDispatch);
            return reportDate >= start && reportDate <= end;
          })
          .map((report) => ({
            userEmail: report.userEmail,
            dateOfDispatch: report.dateOfDispatch,
            timeOfDispatchStart: report.timeOfDispatchStart,
            timeOfDispatchEnd: report.timeOfDispatchEnd,
            onCallExperience: report.onCallExperience,
            additionalComments: report.additionalComments,
            hasFullRuns: report.hasFullRuns,
            requiresFollowUp: report.requiresFollowUp,
          }));
      } else {
        data = reports.map((report) => ({
          userEmail: report.userEmail,
          dateOfDispatch: report.dateOfDispatch,
          timeOfDispatchStart: report.timeOfDispatchStart,
          timeOfDispatchEnd: report.timeOfDispatchEnd,
          onCallExperience: report.onCallExperience,
          additionalComments: report.additionalComments,
          hasFullRuns: report.hasFullRuns,
          requiresFollowUp: report.requiresFollowUp,
        }));
      }

      headers = [
        'User',
        'Dispatch Date',
        'Dispatch Time (Start)',
        'Dispatch Time (End)',
        'On-Call Dispatch Experience',
        'Comments',
        'Any full runs?',
        'Requires follow up?',
      ];
    } else {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        data = fullRuns
          .filter((run) => {
            const runDate = new Date(run.date);
            return runDate >= start && runDate <= end;
          })
          .map((run) => ({
            userEmail: run.userEmail,
            date: run.date,
            time: run.time,
            name: run.name,
            passengersLeftBehind: run.passengersLeftBehind,
          }));
      } else {
        data = fullRuns.map((run) => ({
          user: run.userEmail,
          date: run.date,
          time: run.time,
          name: run.name,
          passengersLeftBehind: run.passengersLeftBehind,
        }));
      }

      headers = [
        'User',
        'Date',
        'Time of Run',
        'Run Name',
        'Num Passengers Left Behind',
      ];
    }

    const result = [headers, ...data];

    return result;
  };
  const handleExportCSV = (startDate = null, endDate = null) => {
    const data = getDataForCSVExport(startDate, endDate);

    downloadCSV(data, `${activeTab}_exported_data.csv`);
  };

  const downloadCSV = (data, filename) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map((row) => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  };

  const createFullRun = async (fullRunData) => {
    try {
      const response = await axios.post(`/api/reports/full-run`, fullRunData);
      return response.data.fullRun;
    } catch (error) {
      throw error.response.data;
    }
  };

  const renderYesNo = (value) => {
    return <Text>{value ? 'Yes' : 'No'}</Text>;
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  const handleModalSubmit = async () => {
    try {
      const data = await createFullRun(modalData);
      setFullRuns((prev) => [...prev, { ...data, userEmail: user.email }]);
      closeModal();
    } catch (error) {
      console.error('Error creating full run:', error);
    }
  };
  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const deleteFullRun = async (id) => {
    try {
      await axios.delete(`/api/reports/full-run/${id}`);
      setFullRuns((prev) => prev.filter((fullRun) => fullRun.id !== id));
    } catch (error) {
      throw error.response.data;
    }
  };

  const deleteDispatchReport = async (id) => {
    try {
      await axios.delete(`/api/reports/${id}`);
      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error) {
      throw error.response.data;
    }
  };

  const handleDelete = async () => {
    try {
      itemToDelete && activeTab === 'runs'
        ? await deleteFullRun(itemToDelete)
        : await deleteDispatchReport(itemToDelete);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const columnsReports = useMemo(
    () => [
      { Header: 'User', accessor: 'userEmail' },
      { Header: 'Dispatch Date ', accessor: 'dateOfDispatch' },
      { Header: 'Dispatch Time (Start)', accessor: 'timeOfDispatchStart' },
      { Header: 'Dispatch Time (End)', accessor: 'timeOfDispatchEnd' },
      { Header: 'On-Call Dispatch Experience', accessor: 'onCallExperience' },
      { Header: 'Comments', accessor: 'additionalComments' },
      {
        Header: 'Any full runs?',
        accessor: 'hasFullRuns',
        Cell: ({ value }) => renderYesNo(value),
      },
      {
        Header: 'Requires follow up?',
        accessor: 'requiresFollowUp',
        Cell: ({ value }) => renderYesNo(value),
      },
    ],
    []
  );

  const columnsFullRuns = useMemo(
    () => [
      { Header: 'User', accessor: 'userEmail' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Time of Run', accessor: 'time' },
      { Header: 'Run Name', accessor: 'name' },
      {
        Header: '# of Passengers Left Behind',
        accessor: 'passengersLeftBehind',
      },
    ],
    []
  );

  const data = activeTab === 'reports' ? reports : fullRuns;
  const columns = activeTab === 'reports' ? columnsReports : columnsFullRuns;

  return (
    <Stack
      spacing={4}
      p={4}
      boxShadow="md"
      borderRadius="md"
      bgColor="compBg"
      color="text">
      <Heading
        as="h3"
        size="md"
        mb={4}>
        Dispatch Report Submissions
      </Heading>
      <Tabs
        isFitted
        variant="enclosed-colored"
        colorScheme="teal"
        onChange={(index) => setActiveTab(index === 0 ? 'reports' : 'runs')}
        w="100%">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="start"
          mt={4}
          w="100%">
          {/* <Button
            variant={activeTab === 'reports' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('reports')}
            mb={{ base: 2, md: 0 }}
            mr={{ base: 0, md: 2 }}
            colorScheme={activeTab === 'reports' ? 'teal' : 'gray'}>
            View Dispatch Reports
          </Button>

          <Button
            variant={activeTab === 'runs' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('runs')}
            mb={{ base: 2, md: 0 }}
            mr={{ base: 0, md: 2 }}
            colorScheme={activeTab === 'runs' ? 'teal' : 'gray'}>
            View Full Runs
          </Button> */}

          <TabList>
            <Tab
              style={{ width: '200px' }}
              bgColor="compBg">
              View Dispatch Reports
            </Tab>
            <Tab
              style={{ width: '200px' }}
              bgColor="compBg">
              View Full Runs
            </Tab>
          </TabList>
        </Flex>
        <Divider />
        <Box
          overflowX="auto"
          maxWidth="100%"
          style={{ overflowX: 'auto' }}
          color="text">
          <Heading
            as="h4"
            size="small"
            textAlign="center"
            textDecoration="underline"
            mb={4}>
            {activeTab === 'reports' ? 'Dispatch Reports ' : 'Full Runs '}
          </Heading>
          <TableComponent
            columns={columns}
            data={data}
            onDelete={openDeleteModal}
          />
        </Box>

        <Flex
          justifyContent="center"
          alignItems="center"
          direction={{ base: 'column', md: 'column' }}
          gap="12px"
          mt={8}>
          <Button
            onClick={openExportModal}
            colorScheme="teal"
            variant="solid">
            Convert to Downloadable Spreadsheet
          </Button>
          {activeTab === 'runs' && (
            <Button
              colorScheme="blue"
              onClick={openModal}>
              Manually Add Full Runs
            </Button>
          )}
        </Flex>
      </Tabs>
      <ExportCSVModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        handleExportCSV={handleExportCSV}
      />
      <ManualAddFullRunsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalData={modalData}
        setModalData={setModalData}
        handleModalSubmit={handleModalSubmit}
      />

      <ConfirmDeletionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        handleDelete={handleDelete}
      />
    </Stack>
  );
};

export default FormSubmissionManagement;
