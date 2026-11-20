'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { ContactFilter } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer, PreferredContact } from '@/components/dashboard/customer/customers-table';

const DEFAULT_ROWS_PER_PAGE = 5;

// Case- and accent-insensitive, so "lucia" matches "Lucía".
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim();
}

interface CustomersViewProps {
  customers: Customer[];
}

export function CustomersView({ customers: initialCustomers }: CustomersViewProps): React.JSX.Element {
  const [customers, setCustomers] = React.useState(initialCustomers);
  const [search, setSearch] = React.useState('');
  const [contactFilter, setContactFilter] = React.useState<ContactFilter>('all');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);

  const filtered = React.useMemo(() => {
    const query = normalize(search);

    return customers.filter((customer) => {
      if (contactFilter !== 'all' && customer.preferredContact !== contactFilter) {
        return false;
      }
      return !query || normalize(customer.name).includes(query) || normalize(customer.email).includes(query);
    });
  }, [customers, search, contactFilter]);

  const rows = React.useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const handlePreferredContactChange = React.useCallback((id: string, value: PreferredContact) => {
    setCustomers((prev) => prev.map((customer) => (customer.id === id ? { ...customer, preferredContact: value } : customer)));
  }, []);

  return (
    <Stack spacing={3}>
      <CustomersFilters
        contactFilter={contactFilter}
        onContactFilterChange={(value) => {
          setContactFilter(value);
          setPage(0);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        search={search}
      />
      <CustomersTable
        count={filtered.length}
        onClearFilters={() => {
          setSearch('');
          setContactFilter('all');
          setPage(0);
        }}
        onPageChange={setPage}
        onPreferredContactChange={handlePreferredContactChange}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setPage(0);
        }}
        page={page}
        rows={rows}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
