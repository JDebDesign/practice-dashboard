'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { CONTACT_OPTIONS } from '@/components/dashboard/customer/customers-table';
import type { PreferredContact } from '@/components/dashboard/customer/customers-table';

export type ContactFilter = 'all' | PreferredContact;

interface CustomersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  contactFilter: ContactFilter;
  onContactFilterChange: (value: ContactFilter) => void;
}

export function CustomersFilters({
  search,
  onSearchChange,
  contactFilter,
  onContactFilterChange,
}: CustomersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <OutlinedInput
          fullWidth
          inputProps={{ 'aria-label': 'Search customer' }}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          placeholder="Search by name or email"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
          value={search}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="contact-filter-label">Preferred contact</InputLabel>
          <Select
            label="Preferred contact"
            labelId="contact-filter-label"
            onChange={(event) => {
              onContactFilterChange(event.target.value as ContactFilter);
            }}
            value={contactFilter}
          >
            <MenuItem value="all">All</MenuItem>
            {CONTACT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Card>
  );
}
