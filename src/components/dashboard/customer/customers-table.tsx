'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

export type PreferredContact = 'email' | 'phone' | 'mail';
export type ContactStatus = 'verified' | 'needs review' | 'opted out';

export const CONTACT_OPTIONS: { value: PreferredContact; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Mail' },
];

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string | null;
  preferredContact: PreferredContact;
  status: ContactStatus;
  lastContacted: Date | null;
  createdAt: Date;
}

// Opted out wins; a phone preference without a phone number can never be verified.
export function getEffectiveStatus(customer: Customer): ContactStatus {
  if (customer.status === 'opted out') {
    return 'opted out';
  }
  if (customer.preferredContact === 'phone' && !customer.phone) {
    return 'needs review';
  }
  return customer.status;
}

const statusMap = {
  verified: { label: 'Verified', color: 'success' },
  'needs review': { label: 'Needs review', color: 'warning' },
  'opted out': { label: 'Opted out', color: 'default' },
} as const;

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onPreferredContactChange?: (id: string, value: PreferredContact) => void;
  onClearFilters?: () => void;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  onPreferredContactChange,
  onClearFilters,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const [menu, setMenu] = React.useState<{ anchor: HTMLElement; id: string } | null>(null);
  const menuCustomer = menu ? rows.find((row) => row.id === menu.id) : undefined;

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '1100px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Preferred contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last contacted</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ py: 6, textAlign: 'center' }}>
                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="body1">
                      No customers match your filters
                    </Typography>
                    {onClearFilters ? (
                      <Button color="inherit" onClick={onClearFilters} size="small" variant="outlined">
                        Clear filters
                      </Button>
                    ) : null}
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);
              const effectiveStatus = getEffectiveStatus(row);
              const status = statusMap[effectiveStatus];
              const isOptedOut = effectiveStatus === 'opted out';
              const contactLabel = CONTACT_OPTIONS.find((option) => option.value === row.preferredContact)?.label;

              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isSelected}
                  sx={isOptedOut ? { '& .MuiTableCell-root': { color: 'text.secondary' } } : undefined}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography color="inherit" variant="subtitle2">
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{row.phone ?? ''}</TableCell>
                  <TableCell>{contactLabel}</TableCell>
                  <TableCell>
                    <Chip
                      color={status.color}
                      label={status.label}
                      size="small"
                      variant={isOptedOut ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>{row.lastContacted ? dayjs(row.lastContacted).format('MMM D, YYYY') : 'Never'}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell padding="checkbox">
                    {onPreferredContactChange ? (
                      <IconButton
                        aria-label={`Change preferred contact for ${row.name}`}
                        onClick={(event) => {
                          setMenu({ anchor: event.currentTarget, id: row.id });
                        }}
                      >
                        <DotsThreeIcon weight="bold" />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Menu
        anchorEl={menu?.anchor}
        onClose={() => {
          setMenu(null);
        }}
        open={Boolean(menu)}
      >
        <Typography color="text.secondary" sx={{ px: 2, py: 0.5 }} variant="overline">
          Preferred contact
        </Typography>
        {CONTACT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              if (menu) {
                onPreferredContactChange?.(menu.id, option.value);
              }
              setMenu(null);
            }}
            selected={menuCustomer?.preferredContact === option.value}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {menuCustomer?.preferredContact === option.value ? <CheckIcon /> : null}
            </ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(_, newPage) => {
          onPageChange?.(newPage);
        }}
        onRowsPerPageChange={(event) => {
          onRowsPerPageChange?.(Number.parseInt(event.target.value, 10));
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
