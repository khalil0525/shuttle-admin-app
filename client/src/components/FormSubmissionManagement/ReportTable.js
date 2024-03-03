import React, { useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Checkbox,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";

const ReportTable = ({
  columns,
  data,
  onDelete,
  isProcessingResolve,
  user,
  setFollowUpItemId,
  setIsFollowUpModalOpen,
  setFlashing,
  flashing,
  setChange,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashing((prevFlashing) => !prevFlashing);

      const allResolvedOrNoFollowUp = data.every(
        (item) => item.resolvedBy || !item.requiresFollowUp
      );
      if (allResolvedOrNoFollowUp) {
        clearInterval(interval);
      }
    }, 750);

    return () => clearInterval(interval);
  }, [data, setFlashing]);
  const formatTime = (time) => {
    const formattedTime = new Date(`2000-01-01T${time}`);
    return formattedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      overflowY="auto"
      maxH="75vh">
      <Table
        {...getTableProps()}
        size="sm"
        textColor="text"
        overflowY="auto">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr
              key={headerGroup.id + 14}
              {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  p={2}
                  minWidth="96px"
                  color="text"
                  key={column.id}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </Th>
              ))}
              <Th p={2}>Actions</Th>
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr
                key={row.id}
                {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    key={cell.column.id}
                    {...cell.getCellProps()}
                    p={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}>
                      {cell.column.id === "requiresFollowUp" && cell.value && (
                        <Tooltip
                          label={
                            user.name && user.name.length && user.isAdmin
                              ? "Click to Resolve Follow Up"
                              : user.isAdmin && user.name.length === 0
                              ? "To Resolve a Follow Up Set Your Name In User Settings"
                              : "Unauthorized"
                          }
                          fontSize="sm"
                          closeOnClick={true}
                          isDisabled={isProcessingResolve || cell.value}>
                          <Checkbox
                            disabled={
                              isProcessingResolve ||
                              (user.isAdmin && user.name.length === 0) ||
                              (row.original.resolvedBy && !user.isAdmin)
                            }
                            isChecked={
                              row.original.resolvedBy === null ? false : true
                            }
                            onChange={() => {
                              setFollowUpItemId(row.original.id);
                              setIsFollowUpModalOpen((prev) => !prev);
                              setChange(
                                row.original.resolvedBy === null ? true : false
                              );
                            }}
                            size="sm">
                            {row.original.resolvedBy === null && flashing ? (
                              <div
                                style={{
                                  color: flashing ? "red" : "",
                                  animation: "flash 1s infinite",
                                  fontWeight: "bold",
                                }}>
                                YES
                              </div>
                            ) : null}
                          </Checkbox>
                        </Tooltip>
                      )}
                      {cell.column.id === "requiresFollowUp" &&
                        !cell.value &&
                        row.original.resolvedBy === null && <div>No</div>}
                      {cell.column.id === "requiresFollowUp" &&
                        row.original.resolvedBy !== null && (
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "green",
                                marginBottom: "2px",
                              }}>
                              Resolved
                            </div>
                            <div style={{ fontSize: "14px" }}>
                              by: {row.original.resolvedBy.name}
                            </div>
                          </div>
                        )}
                    </Box>
                    {(cell.column.id === "timeOfDispatchStart" ||
                      cell.column.id === "timeOfDispatchEnd" ||
                      cell.column.id === "time") && (
                      <div>{formatTime(cell.value)}</div>
                    )}
                    {cell.column.id !== "requiresFollowUp" &&
                      cell.column.id !== "timeOfDispatchStart" &&
                      cell.column.id !== "timeOfDispatchEnd" &&
                      cell.column.id !== "time" && (
                        <div>{cell.render("Cell")}</div>
                      )}
                  </Td>
                ))}
                <Td p={2}>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="red"
                      aria-label="Delete Submission"
                      icon={<i className="fas fa-trash-alt"></i>}
                      onClick={() => onDelete(row.original.id)}>
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ReportTable;
