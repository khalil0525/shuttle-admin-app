import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@chakra-ui/react";

const ConfirmFollowUpModal = ({
  isOpen,
  onClose,
  handleConfirmFollowUp,
  user,
  change,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCheckboxChange = () => {
    setAcknowledged(!acknowledged);
  };

  const handleConfirm = () => {
    if (acknowledged) {
      handleConfirmFollowUp();
      setAcknowledged(false);
      onClose();
    }
  };

  const isAdmin = user?.isAdmin;
  const isDispatchAdmin = user?.permissions?.find(
    (perm) => perm.tabName === "dispatch"
  )?.canAdmin;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {" "}
          {change
            ? "Confirm Follow-Up to Dispatch Report"
            : "Remove Follow-Up to Dispatch Report"}
        </ModalHeader>
        <ModalBody>
          <>
            <p>
              {change
                ? `Have you successfully followed up on the dispatcher's report? \nIf
              so, please check the box below to confirm.`
                : "You are marking this dispatcher's report as unresolved.\n\n Do you wish to continue?"}
            </p>
          </>

          <Checkbox
            colorScheme="blue"
            isChecked={acknowledged}
            onChange={handleCheckboxChange}
            mt={2}>
            {change
              ? `        I confirm that I successfully followed-up on this dispatcher's
                report.`
              : `        I confirm that I want to remove the follow-up on this dispatcher's
                report.`}
          </Checkbox>
        </ModalBody>
        <ModalFooter sx={{ display: "flex", gap: "0.4rem" }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirm}
            isDisabled={!acknowledged || (!isAdmin && !isDispatchAdmin)}>
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmFollowUpModal;
