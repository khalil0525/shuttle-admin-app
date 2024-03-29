import React, { useEffect, useState } from "react";
import { Box, Button, Center } from "@chakra-ui/react";
import Calendar from "../../components/BlocksheetManagement/Calendar";
import axios from "axios";
import { useSnackbar } from "../../context/SnackbarProvider";
import { typeOptions } from "../../components/data";
import BlocksheetActionModal from "../../components/BlocksheetManagement/BlocksheetActionModal";
import PostToTradeboardModal from "../../components/MyBlocksManagement/PostToTradeboardModal";

function Home({ user }) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const [users, setUsers] = useState([]);

  const [blockToDeleteId, setBlockToDeleteId] = useState(null);
  const [editBlock, setEditBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccessToast, showErrorToast } = useSnackbar();
  const handleWeekChange = (change) => {
    setCurrentWeek(currentWeek + change);
  };

  const [scheduleBlocks, setScheduleBlocks] = useState([]);

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [postText, setPostText] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(null);

  const handlePostRemoveBlock = async (blockId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`/api/blocksheet/${blockId}`, {
        scheduleBlockData: {
          showOnTradeboard: !scheduleBlocks.find(
            (block) => block.id === blockId
          ).showOnTradeboard,
          tradeboardNote: postText.length ? postText.trim() : null,
        },
      });
      setScheduleBlocks((prevScheduleBlocks) => {
        return prevScheduleBlocks.map((block) => {
          if (block.id === data.scheduleBlock.id) {
            return {
              ...block,
              showOnTradeboard: !block.showOnTradeboard,
              tradeboardNote: postText.length ? postText.trim() : null,
            };
          }
          return block;
        });
      });
      setPostText("");
      setSelectedBlockId(null);
    } catch (error) {
      console.error("Error fetching schedule blocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchScheduleBlocks = async () => {
      try {
        const { data } = await axios.get("/api/blocksheet/sheet");
        console.log(data);
        setScheduleBlocks(data.scheduleBlocks);
      } catch (error) {
        showErrorToast(error.response.data.error);
      }
    };
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/auth/block/users");
        setUsers(data);
      } catch (error) {
        showErrorToast(error.response.data.error);
      }
    };
    fetchUsers();
    fetchScheduleBlocks();
  }, []);
  const handleUpdateBlocksheet = async () => {
    try {
      setIsLoading(true);
      await axios.put(`/api/blocksheet/${editBlock.id}`, {
        scheduleBlockData: editBlock,
      });

      setScheduleBlocks((prev) => {
        const updatedBlocks = prev.map((block) =>
          block.id === editBlock.id ? editBlock : block
        );
        return updatedBlocks;
      });
      setEditBlock(false);
      showSuccessToast("Block successfully edited!");
    } catch (error) {
      showErrorToast(error.response.data.error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlock = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/blocksheet/${editBlock.id}`);
      showSuccessToast("Block successfully deleted!");
      setScheduleBlocks((prev) => prev.filter((sb) => sb.id !== editBlock.id));
      setEditBlock(null);
    } catch (error) {
      console.error(error);
      showErrorToast(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Center>
        <Box
          display="flex"
          p={2}
          align="center"
          justify="center"
          color="text"
          maxWidth="100vw"
          width="100%"
          flexDirection="column"
          mt="6.8rem">
          <Box
            m="0 auto"
            display="flex"
            p={2}
            align="center"
            justify="center"
            gap={2}
            color="text">
            <Button
              size="sm"
              onClick={() => handleWeekChange(-1)}>
              Previous Week
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentWeek(0)}>
              This Week
            </Button>
            <Button
              size="sm"
              onClick={() => handleWeekChange(1)}>
              Next Week
            </Button>
          </Box>

          <Calendar
            currentWeekOffset={currentWeek}
            scheduleBlocks={scheduleBlocks}
            typeOptions={typeOptions}
            setEditBlock={setEditBlock}
            user={user}
            users={users}
            isBlockSheet={true}
          />
        </Box>
      </Center>
      <PostToTradeboardModal
        isOpen={selectedBlockId}
        isOnTradeboard={
          scheduleBlocks.find((block) => block.id === selectedBlockId)
            ?.showOnTradeboard
        }
        onClose={() => {
          setSelectedBlockId(null);
          setEditBlock(null);
          setIsPostModalOpen(false);
        }}
        handleConfirmPost={() => handlePostRemoveBlock(selectedBlockId)}
        user={user}
        isLoading={isLoading}
        postText={postText}
        setPostText={setPostText}
      />
      <BlocksheetActionModal
        isOpen={(editBlock || blockToDeleteId) && !selectedBlockId}
        blocksheetToDeleteId={blockToDeleteId}
        handleDeleteBlock={handleDeleteBlock}
        closeModal={() => setEditBlock(null)}
        selectedBlocksheet={editBlock}
        editBlock={editBlock}
        setEditBlock={setEditBlock}
        handleSaveChanges={handleUpdateBlocksheet}
        users={users}
        user={user}
        setSelectedBlockId={setSelectedBlockId}
      />
    </Box>
  );
}
export default Home;
