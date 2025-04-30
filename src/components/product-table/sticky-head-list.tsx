import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
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
import TableContainer from '@mui/material/TableContainer';

import { fetcher, endpoints } from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { TABLE_HEAD } from './pagination-with-api';
import EditProduceItemDialog from './edit-produce-item-dialog';
import CreateProduceItemButton from './create-produce-item-button';

import type { ApiResponse } from './pagination-with-api';

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

const getBaseEndpoint = (page = 1, rowsPerPage = 10) => {
  // console.log('Creating endpoint with:', { page, rowsPerPage });
  return `${endpoints.produce.list}?page=${page + 1}&perPage=${rowsPerPage}`;
};

const options = ['Edit', 'Delete'];
const ITEM_HEIGHT = 48;

// ----------------------------------------------------------------------

export default function TablePaginationWithApi() {
  const { page, rowsPerPage, onResetPage, onChangeRowsPerPage, onChangePage } = useTable({
    defaultRowsPerPage: 10,
  });

  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    rowId: number | null;
  }>({ anchorEl: null, rowId: null });

  const isMenuOpen = (rowId: number) => menuAnchor.rowId === rowId && Boolean(menuAnchor.anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setMenuAnchor({ anchorEl: event.currentTarget, rowId: row.id });
    setSelectedItem(row);
  };

  const handleClose = () => {
    setMenuAnchor({ anchorEl: null, rowId: null });
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
    handleClose();
  };

  const defaultEndpoint = useMemo(() => getBaseEndpoint(page, rowsPerPage), [page, rowsPerPage]);

  const [endpoint, setEndpoint] = useState(defaultEndpoint);

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['produceItems', endpoint],
    queryFn: async () => {
      // console.log('Fetching data with endpoint:', endpoint);
      const response = await fetcher(endpoint);
      // console.log('Received data:', response);
      return response;
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const updatedEndpoint = getBaseEndpoint(page, rowsPerPage);
    // console.log('Updating endpoint to:', updatedEndpoint);
    setEndpoint(updatedEndpoint);
  }, [page, rowsPerPage]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    // console.log('Changing rows per page to:', newRowsPerPage);
    onChangeRowsPerPage(event);
    onResetPage();
  };

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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <CreateProduceItemButton endpoint={endpoint} />
        {/* <DataInfo totalItems={data?.totalItems ?? 0} totalPages={data?.totalPages ?? 0} /> */}

        {renderFiltersToolbar()}

        <TableContainer sx={{ height: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
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
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.item_no}</TableCell>
                        <TableCell>{row.common_name}</TableCell>
                        <TableCell>{row.origin}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>
                          {row.weight != null ? `${row.weight} ${row.weight_unit || ''}` : '-'}
                        </TableCell>
                        <TableCell>{row.scientific_name}</TableCell>
                        <TableCell>{row.package_type}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id={`long-button-${row.id}`}
                            aria-controls={
                              menuAnchor.rowId === row.id ? `long-menu-${row.id}` : undefined
                            }
                            aria-expanded={menuAnchor.rowId === row.id ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, row)}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                          <Menu
                            id={`long-menu-${row.id}`}
                            anchorEl={menuAnchor.anchorEl}
                            open={isMenuOpen(row.id)}
                            onClose={handleClose}
                            slotProps={{
                              paper: {
                                style: {
                                  maxHeight: ITEM_HEIGHT * 4.5,
                                  paddingRight: 10,
                                  paddingLeft: 10,
                                },
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                selected={option === 'Pyxis'}
                                onClick={() => {
                                  if (option === 'Edit') {
                                    handleEditClick(row);
                                    // console.log('option', row);
                                  } else {
                                    handleClose();
                                  }
                                }}
                                sx={{
                                  color: option === 'Delete' ? 'error.main' : 'text.primary',
                                }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />

        <TablePaginationCustom
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          count={data?.totalItems ?? 0}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
      <EditProduceItemDialog
        open={editDialogOpen}
        endpoint={endpoint}
        onClose={() => setEditDialogOpen(false)}
        item={selectedItem}
      />
    </>
  );
}
