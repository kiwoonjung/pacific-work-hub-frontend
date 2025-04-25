import type { BoxProps } from '@mui/material/Box';
import type { TableHeadCellProps } from 'src/components/table';

import useSWR from 'swr';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';

import { fetcher } from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import { TableSkeleton, TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

type items = {
  item_no: string;
  common_name: string;
  origin: string;
  size: string;
  weight: string;
  scientific_name: string;
  type_of_package: string;
};

export type ApiResponse = {
  items: items[];
  totalPages: number;
  totalItems: number;
  categoryOptions: string[];
};

export const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'id', label: 'ID' },
  { id: 'item_no', label: 'Item No' },
  { id: 'common_name', label: 'Common Name' },
  { id: 'origin', label: 'Origin' },
  { id: 'size', label: 'Size' },
  { id: 'weight', label: 'Weight' },
  { id: 'scientific_name', label: 'Scientific Name' },
  { id: 'type_of_package', label: 'Type of Package' },
  { id: '', label: 'Action', align: 'right', width: 80 },
];

// ----------------------------------------------------------------------

export function PaginationWithApi() {
  const [page, setPage] = useState<number>(1);

  const perPage = 10;

  const endpoint = `/api/pagination?page=${page}&perPage=${perPage}`;
  const { data, isLoading } = useSWR<ApiResponse>(endpoint, fetcher, {
    keepPreviousData: true,
  });

  return (
    <>
      <DataInfo totalItems={data?.totalItems ?? 0} totalPages={data?.totalPages ?? 0} />

      <Table>
        <TableHeadCustom headCells={TABLE_HEAD} />

        <TableBody>
          {isLoading ? (
            <TableSkeleton rowCount={perPage} cellCount={TABLE_HEAD.length} sx={{ height: 69 }} />
          ) : (
            data?.items.map((row) => (
              <TableRow key={row.item_no}>
                <TableCell>{row.item_no}</TableCell>
                <TableCell>{row.common_name}</TableCell>
                <TableCell>{row.origin}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>{row.scientific_name}</TableCell>
                <TableCell>{row.type_of_package}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Divider />

      <Pagination
        color="primary"
        page={page}
        count={data?.totalPages}
        onChange={(event, newPage) => setPage(newPage)}
        sx={{
          py: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type DataInfoProps = BoxProps & {
  totalItems: number;
  totalPages: number;
};

export function DataInfo({ totalItems, totalPages, sx, ...other }: DataInfoProps) {
  return (
    <Box
      sx={[
        () => ({
          p: 3,
          gap: 1,
          display: 'flex',
          typography: 'body2',
          '& span': { display: 'flex' },
          '& strong': { fontWeight: 'fontWeightSemiBold' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* <Box sx={{ flexGrow: 1 }}>
        <strong>endpoint:</strong>
        <Box component="span" sx={{ color: 'primary.main' }}>
          {endpoint}
        </Box>
      </Box> */}

      <span>
        <strong>Items: </strong> {totalItems}
      </span>
      <span>
        <strong>Pages: </strong> {totalPages}
      </span>
    </Box>
  );
}
