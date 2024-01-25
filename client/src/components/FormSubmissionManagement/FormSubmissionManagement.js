import React, { useEffect, useMemo, useState } from "react";
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
} from "@chakra-ui/react";

import axios from "axios";
import ManualAddFullRunsModal from "./ManualAddFullRunsModal";
import ConfirmDeletionModal from "./ConfirmDeletionModal";
import ExportCSVModal from "./ExportCSVModal";
import TableComponent from "./ReportTable";
import ConfirmFollowUpModal from "./ConfirmFollowUpModal";

const FormSubmissionManagement = ({ user }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  const [reports, setReports] = useState([]);
  const [fullRuns, setFullRuns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    date: "",
    time: "",
    passengersLeftBehind: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpItemId, setFollowUpItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isProcessingResolve, setIsProcessingResolve] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [change, setChange] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsData = await getDispatchReports();
        setReports(reportsData);

        const fullRunsData = await getFullRuns();

        const sortedFullRuns = fullRunsData.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });

        setFullRuns(sortedFullRuns);
      } catch (error) {
        console.error("Error fetching data:", error);
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

    if (activeTab === "reports") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = reports
          .filter((report) => {
            const reportDate = new Date(report.dateOfDispatch);
            return reportDate >= start && reportDate <= end;
          })
          .map((report) => ({
            userName: report.creatorUser.userName,
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
          userName: report.creatorUser.userName,
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
        "User",
        "Dispatch Date",
        "Dispatch Time (Start)",
        "Dispatch Time (End)",
        "On-Call Dispatch Experience",
        "Comments",
        "Any full runs?",
        "Requires follow up?",
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
            userName: run.user.name,
            date: run.date,
            time: run.time,
            name: run.name,
            passengersLeftBehind: run.passengersLeftBehind,
          }));
      } else {
        data = fullRuns.map((run) => ({
          user: run.user.name,
          date: run.date,
          time: run.time,
          name: run.name,
          passengersLeftBehind: run.passengersLeftBehind,
        }));
      }

      headers = [
        "User",
        "Date",
        "Time of Run",
        "Run Name",
        "Num Passengers Left Behind",
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
      "data:text/csv;charset=utf-8," +
      data.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
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

  const handleResolveFollowUp = async (rowId) => {
    try {
      setIsProcessingResolve(true);

      const resolvedByUserId = user.id;

      const { data } = await axios.post(`/api/reports/resolve/${rowId}`);

      if (data && data.dispatchReport) {
        const updatedDispatchReport = data.dispatchReport;

        const isResolvedByCurrentUser =
          updatedDispatchReport.resolvedBy &&
          updatedDispatchReport.resolvedBy.length > 0 &&
          updatedDispatchReport.resolvedBy[0].id === resolvedByUserId;

        setReports((prev) => {
          const copyReports = prev.map((report) =>
            report.id === updatedDispatchReport.id
              ? { ...report, ...updatedDispatchReport }
              : report
          );
          return copyReports;
        });

        if (isResolvedByCurrentUser) {
          setFlashing(false);
        } else {
          setFlashing(true);
        }

        setIsProcessingResolve(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderYesNo = (value) => {
    return <Text>{value ? "Yes" : "No"}</Text>;
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
      setFullRuns((prev) => {
        const newFullRun = {
          ...data,
          user: { name: user.name, email: user.email },
        };

        const updatedFullRuns = [...prev, newFullRun];

        const sortedFullRuns = updatedFullRuns.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });

        return sortedFullRuns;
      });
      closeModal();
    } catch (error) {
      console.error("Error creating full run:", error);
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
      itemToDelete && activeTab === "runs"
        ? await deleteFullRun(itemToDelete)
        : await deleteDispatchReport(itemToDelete);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const columnsReports = useMemo(
    () => [
      { Header: "User", accessor: "creatorUser.name" },
      { Header: "Dispatch Date ", accessor: "dateOfDispatch" },
      { Header: "Dispatch Time (Start)", accessor: "timeOfDispatchStart" },
      { Header: "Dispatch Time (End)", accessor: "timeOfDispatchEnd" },
      { Header: "On-Call Dispatch Experience", accessor: "onCallExperience" },
      { Header: "Comments", accessor: "additionalComments" },
      {
        Header: "Any full runs?",
        accessor: "hasFullRuns",
        Cell: ({ value }) => renderYesNo(value),
      },
      {
        Header: "Requires follow up?",
        accessor: "requiresFollowUp",
        Cell: ({ value }) => renderYesNo(value),
      },
    ],
    []
  );

  const columnsFullRuns = useMemo(
    () => [
      { Header: "User", accessor: "user.name" },
      { Header: "Date", accessor: "date" },
      { Header: "Time of Run", accessor: "time" },
      { Header: "Run Name", accessor: "name" },
      {
        Header: "# of Passengers Left Behind",
        accessor: "passengersLeftBehind",
      },
    ],
    []
  );

  const data = activeTab === "reports" ? reports : fullRuns;
  const columns = activeTab === "reports" ? columnsReports : columnsFullRuns;

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
        onChange={(index) => setActiveTab(index === 0 ? "reports" : "runs")}
        w="100%">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="start"
          mt={4}
          w="100%">
          <TabList>
            <Tab
              style={{ width: "200px" }}
              bgColor="compBg">
              View Dispatch Reports
            </Tab>
            <Tab
              style={{ width: "200px" }}
              bgColor="compBg">
              View Full Runs
            </Tab>
          </TabList>
        </Flex>
        <Divider />
        <Box
          overflowX="auto"
          maxWidth="100%"
          style={{ overflowX: "auto" }}
          color="text">
          <Heading
            as="h4"
            size="small"
            textAlign="center"
            textDecoration="underline"
            mb={4}>
            {activeTab === "reports" ? "Dispatch Reports " : "Full Runs "}
          </Heading>
          <TableComponent
            columns={columns}
            data={data}
            onDelete={openDeleteModal}
            isProcessingResolve={isProcessingResolve}
            user={user}
            setFollowUpItemId={setFollowUpItemId}
            setIsFollowUpModalOpen={setIsFollowUpModalOpen}
            setFlashing={setFlashing}
            flashing={flashing}
            setChange={setChange}
          />
        </Box>

        <Flex
          justifyContent="center"
          alignItems="center"
          direction={{ base: "column", md: "column" }}
          gap="12px"
          mt={8}>
          <Button
            onClick={openExportModal}
            colorScheme="teal"
            variant="solid">
            Convert to Downloadable Spreadsheet
          </Button>
          {activeTab === "runs" && (
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
      <ConfirmFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        user={user}
        handleConfirmFollowUp={async () => {
          await handleResolveFollowUp(followUpItemId);
          setIsFollowUpModalOpen(false);
        }}
        change={change}
      />
    </Stack>
  );
};

export default FormSubmissionManagement;
