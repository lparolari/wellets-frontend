import { Container, Flex } from '@chakra-ui/react';
import Button from 'Components/Atoms/Button';
import React, { useMemo } from 'react';

export interface IPaginationProps {
  currentPage: number;
  limit: number;
  total: number;
  setPage: (newPage: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  limit,
  total,
  setPage,
}) => {
  const pages = useMemo(
    () => Array.from({ length: Math.ceil(total / limit) }, (v, i) => i + 1),
    [total, limit],
  );

  return (
    <Container mt="20px">
      <Flex justifyContent="center">
        {currentPage > 1 && (
          <Button borderRadius="0" onClick={() => setPage(currentPage - 1)}>
            {'<'}
          </Button>
        )}
        {pages.map(page => (
          <Button
            key={page}
            borderRadius="0"
            isPrimary={page === currentPage}
            onClick={() => setPage(page)}
          >
            {page}
          </Button>
        ))}
        {currentPage < pages.length && (
          <Button borderRadius="0" onClick={() => setPage(currentPage + 1)}>
            {'>'}
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export default Pagination;
