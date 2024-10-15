import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Center } from "@chakra-ui/react";
import PostToTradeboardModal from "../../components/MyBlocksManagement/PostToTradeboardModal";
import Calendar from "../../components/BlocksheetManagement/Calendar";
import { useSnackbar } from "../../context/SnackbarProvider";
import { typeOptions } from "../../components/data";
import BlocksheetActionModal from "../../components/BlocksheetManagement/BlocksheetActionModal";
const MyBlocks = ({ user }) => {
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editBlock, setEditBlock] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [postText, setPostText] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(null);
  const { showSuccessToast, showErrorToast } = useSnackbar();

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

  useEffect(() => {
    const fetchScheduleBlocks = async () => {
      try {
        const { data } = await axios.get(`/api/blocksheet/blocks/${user.id}`);
        console.log(data);
        setScheduleBlocks(data.scheduleBlocks);
      } catch (error) {
        console.error(error);
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

  const handlePostRemoveClick = (id) => {
    setSelectedBlockId(id);
    setIsPostModalOpen((prev) => !prev);
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
            handleButtonClick={handlePostRemoveClick}
            user={user}
            currentWeekOffset={0}
            setEditBlock={setEditBlock}
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
        isOpen={editBlock && !isPostModalOpen}
        closeModal={() => {
          setEditBlock(null);
        }}
        selectedBlocksheet={editBlock}
        editBlock={editBlock}
        setEditBlock={setEditBlock}
        handleSaveChanges={handleSaveChanges}
        users={users}
        handleDeleteBlock={handleDeleteBlock}
      />
    </Box>
  );
};

export default MyBlocks;
