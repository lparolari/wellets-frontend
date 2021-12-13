import React, { useState, useEffect } from 'react';
import CSS from 'csstype';
import {
  Box,
  Table as BaseTable,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  ResponsiveValue,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

import Pagination, { IPaginationProps } from '../Pagination';

interface IData {
  [key: string]: any;
}

type SortFn = (a: IData, b: IData) => number;
type SortDirection = 'asc' | 'desc';

interface IColumn {
  key: string;
  title: string;
  dataIndex?: string;
  render?(row: IData, i: number): any;
  sort?(a: IData, b: IData): number;
}

interface IProps {
  columns: IColumn[];
  rows: IData[];
  pagination?: IPaginationProps;
}

type OverflowX = ResponsiveValue<CSS.Property.OverflowX>;

const Table: React.FC<IProps> = ({ columns, rows, pagination }) => {
  const [data, setData] = useState(rows);
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortFn | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortDirection | undefined>(
    undefined,
  );

  const toggleSortOrder = () => {
    setSortOrder(!!sortOrder && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByClick = (key: string, sortFn: SortFn | undefined) => {
    if (key === sortKey) {
      toggleSortOrder();
    } else {
      setSortKey(key);
      setSortBy(() => sortFn);
      setSortOrder('asc');
    }
  };

  const box = useBreakpointValue({
    base: {
      overflowX: 'scroll' as OverflowX,
    },
    lg: {
      overflowX: 'auto' as OverflowX,
    },
  });

  useEffect(() => {
    if (!sortOrder) return;

    const sortedData = [...rows].sort(sortBy);
    const sortedDataByOrder =
      sortOrder === 'desc' ? sortedData.reverse() : sortedData;

    setData(sortedDataByOrder);
  }, [rows, sortBy, sortOrder]);

  return (
    <>
      {(!pagination || (pagination && pagination.total > 0)) && (
        <Box w="100%" maxW="100vw" overflowX={box?.overflowX}>
          <BaseTable w="100%" maxW="100vw">
            <Thead>
              <Tr>
                {columns.map(column => (
                  <Th key={column.key}>
                    <Stack direction="row">
                      <Text
                        onClick={() => {
                          handleSortByClick(column.key, column.sort);
                        }}
                        cursor="pointer"
                      >
                        {column.title}
                      </Text>
                      <Box>
                        {sortKey &&
                          sortKey === column.key &&
                          sortOrder &&
                          ((sortOrder === 'asc' && <FiArrowUp />) || (
                            <FiArrowDown />
                          ))}
                      </Box>
                    </Stack>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, index) => (
                <Tr key={index}>
                  {columns.map(column => (
                    <Td key={column.key}>
                      {column.render
                        ? column.render(row, index)
                        : column.dataIndex
                        ? row[column.dataIndex]
                        : ''}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                {columns.map(column => (
                  <Th key={column.key}>{column.title}</Th>
                ))}
              </Tr>
            </Tfoot>
          </BaseTable>
          {pagination && <Pagination {...pagination} />}
        </Box>
      )}
    </>
  );
};

export default Table;
