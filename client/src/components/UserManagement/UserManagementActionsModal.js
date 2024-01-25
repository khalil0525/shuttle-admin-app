import React from "react";

import {
  Box,
  Button,
  Text,
  Checkbox,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
} from "@chakra-ui/react";
function UserManagementActionsModal({
  isOpen,
  userToDeleteId,
  handleDeleteUser,
  closeModal,
  selectedUser,
  selectedFile,
  editUser,
  handleFileChange,
  setEditUser,
  handlePermissionChange,
  handleSaveChanges,
  userToResetPasswordId,
  setUserToResetPasswordId,
  handleResetPassword,
}) {
  if (userToDeleteId) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="lg">
        <ModalOverlay />
        <ModalContent
          color="text"
          bg="compBg"
          h={["100vh", "auto"]}>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this user?</Text>
          </ModalBody>
          <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
            <Button
              colorScheme="red"
              onClick={() => handleDeleteUser(userToDeleteId)}>
              Delete
            </Button>
            <Button
              colorScheme="gray"
              onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  if (userToResetPasswordId) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="lg">
        <ModalOverlay />
        <ModalContent
          color="text"
          bg="compBg"
          h={["100vh", "auto"]}>
          <ModalHeader>Reset User's Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Warning: You are about to reset the password for the selected
              user. They will be emailed a temporary password to use until they change
              it themselves.
            </Text>
            <Text>
              This is an irreversable action.
            </Text>
          </ModalBody>
          <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
            <Button
              colorScheme="blue"
              onClick={() => handleResetPassword(userToResetPasswordId)}>
              Confirm Reset
            </Button>
            <Button
              colorScheme="gray"
              onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="lg">
      <ModalOverlay />
      <ModalContent
        color="text"
        bg="compBg"
        h={["100vh", "auto"]}
        mt="0">
        <ModalHeader>Edit User: {selectedUser?.email}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={[2, 4]}>
            <Box mb={[2, 4]}>
              <Box
                position="relative"
                sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : editUser?.photoURL
                      ? editUser.photoURL
                      : ""
                  }
                  alt="Selected"
                  width={["75px", "100px"]}
                  height={["75px", "100px"]}
                  borderRadius="full"
                />
                <Input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  opacity="0"
                  size="sm"
                  position="absolute"
                  cursor="pointer"
                  width="100px"
                  height="100px"
                  zIndex="1"
                />
              </Box>
            </Box>
            <Text fontSize="xl">Name</Text>

            <Input
              sx={{ display: "flex", gap: "1.6rem", margin: "0.8rem 0" }}
              value={editUser?.name || ""}
              onChange={(e) =>
                setEditUser((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              size="sm"
              placeholder="Name"
            />
          </Box>

          <Box>
            <Text fontSize="xl">Dispatch</Text>
            <Box sx={{ display: "flex", gap: "1.6rem", margin: "0.8rem 0" }}>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "dispatch"
                  ).canView
                }
                onChange={() => handlePermissionChange("dispatch", "canView")}>
                View
              </Checkbox>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "dispatch"
                  ).canAdmin
                }
                onChange={() => handlePermissionChange("dispatch", "canAdmin")}>
                Admin
              </Checkbox>
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl">Training</Text>
            <Box sx={{ display: "flex", gap: "1.6rem", margin: "0.8rem 0" }}>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "training"
                  ).canView
                }
                onChange={() => handlePermissionChange("training", "canView")}>
                View
              </Checkbox>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "training"
                  ).canAdmin
                }
                onChange={() => handlePermissionChange("training", "canAdmin")}>
                Admin
              </Checkbox>
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl">Whiteboard</Text>
            <Box
              sx={{
                display: "flex",
                gap: "1.6rem",
                margin: "0.8rem 0",
                alignItems: "center !important",
              }}>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "whiteboard"
                  ).canView
                }
                onChange={() =>
                  handlePermissionChange("whiteboard", "canView")
                }>
                View
              </Checkbox>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "whiteboard"
                  ).canAdmin
                }
                onChange={() =>
                  handlePermissionChange("whiteboard", "canAdmin")
                }>
                Admin
              </Checkbox>
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl">Website</Text>
            <Box
              sx={{
                display: "flex",
                gap: "1.6rem",
                margin: "0.8rem 0",
                alignItems: "center !important",
              }}>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "website"
                  ).canView
                }
                onChange={() => handlePermissionChange("website", "canView")}>
                View
              </Checkbox>
              <Checkbox
                isChecked={
                  editUser?.permissions?.find(
                    (permission) => permission.tabName === "website"
                  ).canAdmin
                }
                onChange={() => handlePermissionChange("website", "canAdmin")}>
                Admin
              </Checkbox>
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl">Admin</Text>
            <Box
              sx={{
                display: "flex",
                gap: "1.6rem",
                margin: "0.8rem 0",
                alignItems: "center !important",
              }}>
              <Checkbox
                isChecked={editUser?.isAdmin}
                onChange={() =>
                  setEditUser((prev) => {
                    return { ...prev, isAdmin: !prev.isAdmin };
                  })
                }>
                Enable
              </Checkbox>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
          <Button
            colorScheme="blue"
            onClick={handleSaveChanges}>
            Save
          </Button>
          <Button
            colorScheme="gray"
            onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UserManagementActionsModal;
