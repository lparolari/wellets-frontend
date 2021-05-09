import React, { useMemo } from 'react';
import { Container, Flex } from '@chakra-ui/react';

import Button from 'Components/Atoms/Button';

interface IProps {
  currentPage: number;
  limit: number;
  total: number;
  setPage: (newPage: number) => void;
}

const Pagination: React.FC<IProps> = ({
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