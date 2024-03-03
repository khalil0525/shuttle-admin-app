import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Center } from "@chakra-ui/react";
import { useSnackbar } from "../../context/SnackbarProvider";

import Calendar from "../../components/BlocksheetManagement/Calendar";
import { typeOptions } from "../../components/data";
import BlocksheetActionModal from "../../components/BlocksheetManagement/BlocksheetActionModal";
const TradeBoard = ({ user }) => {
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editBlock, setEditBlock] = useState(null);

  const { showSuccessToast, showErrorToast } = useSnackbar();
  useEffect(() => {
    const fetchScheduleBlocks = async () => {
      try {
        const { data } = await axios.get("/api/blocksheet/tradeboard");
        setScheduleBlocks(data.tradeBoardBlocks);
      } catch (error) {
        console.error("Error fetching schedule blocks:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/auth/block/users");
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
    fetchScheduleBlocks();
  }, []);

  const handleButtonClick = async (blockId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`/api/blocksheet/take/${blockId}`);
      setScheduleBlocks((prevScheduleBlocks) => {
        return prevScheduleBlocks.filter(
          (block) => block.id !== data.scheduleBlock.id
        );
      });

      showSuccessToast("Block successfully acquired!");
    } catch (error) {
      showErrorToast(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/api/blocksheet/${editBlock.id}`, {
        scheduleBlockData: editBlock,
      });

      setScheduleBlocks((prev) => {
        const updatedBlocks = prev.map((block) =>
          block.id === editBlock.id ? editBlock : block
        );
        return updatedBlocks;
      });
      setEditBlock(null);
      showSuccessToast("Block successfully edited!");
    } catch (error) {
      console.error(error);

      showErrorToast(error.response.data.error);
      throw new Error(error);
    }
  };
  const handleDeleteBlock = async (blockToDeleteId) => {
    try {
      await axios.delete(`/api/blocksheet/${blockToDeleteId}`);
      showSuccessToast("Block successfully deleted!");
      setScheduleBlocks((prev) =>
        prev.filter((sb) => sb.id !== blockToDeleteId)
      );
      setEditBlock(null);
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    }
  };
  return (
    <Box>
      <Center>
        <Box
          p={2}
          maxWidth="100vw"
          width="100%"
          mt="6.8rem">
          <Calendar
            isLoading={isLoading}
            scheduleBlocks={scheduleBlocks}
            typeOptions={typeOptions}
            handleButtonClick={handleButtonClick}
            setEditBlock={setEditBlock}
            user={user}
            currentWeekOffset={0}
          />
        </Box>
      </Center>
      <BlocksheetActionModal
        isOpen={editBlock}
        closeModal={() => setEditBlock(null)}
        selectedBlocksheet={editBlock}
        editBlock={editBlock}
        setEditBlock={setEditBlock}
        handleSaveChanges={handleSaveChanges}
        users={users}
        handleDeleteBlock={handleDeleteBlock}
        user={user}
      />
    </Box>
  );
};

export default TradeBoard;
