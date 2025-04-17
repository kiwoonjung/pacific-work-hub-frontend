import * as React from 'react';

import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import CreateProduceItemButton from './create-produce-item-button';

interface Column {
  id:
    | 'item_no'
    | 'common_name'
    | 'origin'
    | 'size'
    | 'weight'
    | 'scientific_name'
    | 'type_of_package';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: 'item_no',
    label: 'Item No',
    // minWidth: 170
  },
  {
    id: 'common_name',
    label: 'Common Name',
    // minWidth: 100,
  },
  {
    id: 'origin',
    label: 'Origin',
    // minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size',
    // minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'weight',
    label: 'Weight',
    // minWidth: 170,
    // format: (value: number) => value.toFixed(2),
  },
  {
    id: 'scientific_name',
    label: 'Scientific Name',
  },
  {
    id: 'type_of_package',
    label: 'Type of Package',
  },
];

interface Data {
  item_no: string;
  common_name: string;
  origin: string;
  size: string;
  weight: number;
  scientific_name: string;
  type_of_package: string;
}

function createData(
  item_no: string,
  common_name: string,
  origin: string,
  size: string,
  weight: number,
  scientific_name: string,
  type_of_package: string
): Data {
  // const weight = origin / size;
  return { item_no, common_name, origin, size, weight, scientific_name, type_of_package };
}

const rows = [
  createData('P100', 'ARROW HEAD', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('C-ARR', 'ARROW ROOT', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('P102', 'BAMBOO SHOOT', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('C-CAR', 'CARROT', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('V-DF', 'DRAGOPN FRUIT', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('P104', 'FLOWER CHIVE', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('C-GAR-10x1K', 'GARLIC', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('C-GAR-50x3P', 'GARLIC', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('P109', 'GARLIC', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData('P111', 'GARLIC', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData(
    'C-LEEK',
    'GREEN ONION - CHINSE LEEK',
    'CHINA',
    'BOX',
    15,
    'Cocos nucifera',
    'CARDBOARD BOX'
  ),
  createData('P126', 'NAGAIMO', 'CHINA', 'BOX', 15, 'Cocos nucifera', 'CARDBOARD BOX'),
  createData(
    'C-HAR-PG-J-20',
    'PEELED GARLIC',
    'CHINA',
    'BOX',
    15,
    'Cocos nucifera',
    'CARDBOARD BOX'
  ),
  createData(
    'V-POM-6',
    'POMELO (PINK FLESH)',
    'CHINA',
    'BOX',
    15,
    'Cocos nucifera',
    'CARDBOARD BOX'
  ),
  createData(
    'V-POM-8',
    'POMELO (PINK FLESH)',
    'CHINA',
    'BOX',
    15,
    'Cocos nucifera',
    'CARDBOARD BOX'
  ),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <CreateProduceItemButton />
      {/* <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          position: 'absolute',
          top: -45,
          right: 0,
          zIndex: 9,
        }}
      >
        Create
      </Button> */}
      <TableContainer sx={{ height: 607 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.item_no}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
