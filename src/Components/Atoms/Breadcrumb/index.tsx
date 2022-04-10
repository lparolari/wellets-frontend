import {
  Breadcrumb as BreadcrumbBase,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link as RRDLink } from 'react-router-dom';

interface Item {
  label: React.ReactNode;
  to?: string;
}

export const Breadcrumb = ({ items }: { items: Item[] }) => (
  <BreadcrumbBase spacing="8px" separator={<FiChevronRight color="gray.500" />}>
    {items.map((item, index) => (
      <BreadcrumbItem key={index}>
        {item.to ? (
          <BreadcrumbLink as={RRDLink} to={item.to}>
            {item.label}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbLink isCurrentPage>{item.label}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    ))}
  </BreadcrumbBase>
);
