import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

const ReportTable = ({ columns, data, onDelete }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table
      {...getTableProps()}
      size="sm"
      variant="striped"
      textColor="text">
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                p={2}
                minWidth="96px"
                color="text">
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
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
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td
                  {...cell.getCellProps()}
                  p={2}>
                  {cell.render('Cell')}
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
  );
};

export default ReportTable;
