import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { fetcher, endpoints } from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { DataInfo, TABLE_HEAD } from './pagination-with-api';

import type { ApiResponse } from './pagination-with-api';

import CreateProduceItemButton from './create-produce-item-button';

// ----------------------------------------------------------------------

const createFilteredEndpoint = (
  baseEndpoint: string,
  searchQuery: string,
  category: string,
  page: number,
  rowsPerPage: number
) => {
  const withSearch = searchQuery ? `&search=${searchQuery.trim()}` : '';
  const withCategory = category ? `&category=${category}` : '';
  return `${baseEndpoint}?page=${page + 1}&perPage=${rowsPerPage}${withSearch}${withCategory}`;
};

const getBaseEndpoint = (page = 1, rowsPerPage = 5) =>
  `${endpoints.produce.list}?page=${page}&perPage=${rowsPerPage}`;

// ----------------------------------------------------------------------

export default function TablePaginationWithApi() {
  const { page, rowsPerPage, onResetPage, onChangeRowsPerPage, onChangePage } = useTable();

  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultEndpoint = useMemo(
    () => getBaseEndpoint(page + 1, rowsPerPage),
    [page, rowsPerPage]
  );

  const [endpoint, setEndpoint] = useState(defaultEndpoint);

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['produceItems', endpoint],
    queryFn: () => fetcher(endpoint),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const updatedEndpoint = getBaseEndpoint(page + 1, rowsPerPage);
    setEndpoint(updatedEndpoint);
  }, [page, rowsPerPage]);

  const canReset = !!searchQuery || !!category;
  const notFound = !data?.items?.length && canReset;

  const onSubmit = useCallback(() => {
    const updatedEndpoint = createFilteredEndpoint(
      endpoints.produce.list,
      searchQuery,
      category,
      page,
      rowsPerPage
    );
    setEndpoint(updatedEndpoint);
    onResetPage();
  }, [category, searchQuery, page, rowsPerPage, onResetPage]);

  const onReset = useCallback(() => {
    setCategory('');
    setSearchQuery('');
    onResetPage();
    setEndpoint(defaultEndpoint);
  }, [defaultEndpoint, onResetPage]);

  const renderFiltersToolbar = () => (
    <Box sx={{ px: 3, gap: 1, mb: 3, mt: 3, display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search product by Id or name..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
      {/* <TextField
        select
        fullWidth
        label="Category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        slotProps={{
          htmlInput: { id: 'category-select' },
          inputLabel: { htmlFor: 'category-select' },
        }}
        sx={{ maxWidth: 180 }}
      >
        <MenuItem value="">None</MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {data?.categoryOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField> */}

      {canReset && (
        <Button variant="soft" size="large" color="error" onClick={onReset} sx={{ flexShrink: 0 }}>
          Reset
        </Button>
      )}

      <Button
        size="large"
        color="inherit"
        variant="contained"
        onClick={onSubmit}
        sx={{ flexShrink: 0 }}
      >
        Search
      </Button>
    </Box>
  );

  return (
    <>
      <CreateProduceItemButton />
      {/* <DataInfo totalItems={data?.totalItems ?? 0} totalPages={data?.totalPages ?? 0} /> */}

      {renderFiltersToolbar()}

      <Table>
        <TableHeadCustom headCells={TABLE_HEAD} />

        <TableBody>
          {isLoading ? (
            <TableSkeleton
              rowCount={rowsPerPage}
              cellCount={TABLE_HEAD.length}
              sx={{ height: 69 }}
            />
          ) : (
            <>
              {notFound ? (
                <TableNoData notFound={notFound} />
              ) : (
                data?.items?.map((row: any) => (
                  <TableRow key={row.item_no}>
                    <TableCell>{row.item_no}</TableCell>
                    <TableCell>{row.common_name}</TableCell>
                    <TableCell>{row.origin}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.weight}</TableCell>
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
            </>
          )}
        </TableBody>
      </Table>

      <Divider />

      <TablePaginationCustom
        rowsPerPage={rowsPerPage}
        page={isLoading ? 0 : page}
        onPageChange={onChangePage}
        count={isLoading ? 0 : (data?.totalItems ?? 0)}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}
