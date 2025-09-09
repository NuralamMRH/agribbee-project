import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import { ProductTableRow, ProductTableToolbar } from '../../../sections/@dashboard/e-commerce/list';
import { getConfig } from 'src/redux/slices/global';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vesselId', label: 'Vessel ID', align: 'left' },
  { id: 'owner', label: 'Owner', align: 'left' },
  { id: 'departureDate', label: 'Departure Date', align: 'left' },
  { id: 'tripPeriodDays', label: 'Trip Duration', align: 'left' },
  { id: 'numberOfCrews', label: 'Crew Members', align: 'left' },
  { id: 'status', label: 'Status', align: 'center', width: 180 },
  { id: 'vesselType', label: 'Vessel Type', align: 'right' },
  { id: '' },
];

// Updated status options for vessel requests
const STATUS_OPTIONS = [
  { value: 'departure', label: 'Departure' },
  { value: 'onRoad', label: 'OnRoad' },
  { value: 'catching', label: 'Catching' },
  { value: '4Sales', label: '4Sales' },
  { value: '2Buy', label: '2Buy' },
  { value: '4Share', label: '4Share' },
  { value: '2Share', label: '2Share' },
  { value: 'Full', label: 'Full' },
  { value: 'Return Port', label: 'Return Port' },
  { value: 'Docking', label: 'Docking' },
];

// Demo vessel request data
const demoRequests = [
  {
    _id: '1',
    vesselId: 'BV-94171-TS',
    owner: 'LỆ THI NGỌC LÝ',
    departureDate: '2025-01-29',
    tripPeriodDays: 30,
    numberOfCrews: 7,
    status: 'departure',
    vesselType: 'Fishing Trawler',
    address: 'KP. Hải Phong 2, Long Hải, BR. Vũng Tàu',
    placeOfDeparture: 'Port 47',
    toRegion: 'A. Cà Mau - Kiên Giang',
  },
  {
    _id: '2',
    vesselId: 'BV-94201-TS',
    owner: 'TRẦN VĂN HÙNG',
    departureDate: '2025-02-15',
    tripPeriodDays: 45,
    numberOfCrews: 5,
    status: 'onRoad',
    vesselType: 'Cargo Carrier',
    address: 'Cảng Sài Gòn, Q.4, TP.HCM',
    placeOfDeparture: 'SG-01',
    toRegion: 'B. Đồng Nai - Bà Rịa',
  },
  {
    _id: '3',
    vesselId: 'BV-94321-TS',
    owner: 'NGUYỄN THỊ HẢI',
    departureDate: '2025-03-01',
    tripPeriodDays: 20,
    numberOfCrews: 4,
    status: 'catching',
    vesselType: 'Fishing Purse Seiner',
    address: 'Cảng Đà Nẵng, Q.Sơn Trà',
    placeOfDeparture: 'DN-12',
    toRegion: 'C. Quảng Nam - Huế',
  },
  {
    _id: '4',
    vesselId: 'BV-94452-TS',
    owner: 'PHẠM QUỐC TUẤN',
    departureDate: '2025-03-10',
    tripPeriodDays: 60,
    numberOfCrews: 8,
    status: '4Sales',
    vesselType: 'Refrigerated Cargo',
    address: 'Cảng Hải Phòng, Q.Hồng Bàng',
    placeOfDeparture: 'HP-03',
    toRegion: 'D. Hạ Long - Cát Bà',
  },
  {
    _id: '5',
    vesselId: 'BV-94563-TS',
    owner: 'LÊ THỊ THU THỦY',
    departureDate: '2025-04-05',
    tripPeriodDays: 15,
    numberOfCrews: 3,
    status: '2Buy',
    vesselType: 'Container Ship',
    address: 'Cảng Cần Thơ, Ninh Kiều',
    placeOfDeparture: 'CT-07',
    toRegion: 'E. Sóc Trăng - Bạc Liêu',
  },
  {
    _id: '6',
    vesselId: 'BV-94674-TS',
    owner: 'VÕ HOÀNG NAM',
    departureDate: '2025-04-20',
    tripPeriodDays: 90,
    numberOfCrews: 6,
    status: '4Share',
    vesselType: 'Passenger Ferry',
    address: 'Cảng Quy Nhơn, Bình Định',
    placeOfDeparture: 'QN-22',
    toRegion: 'F. Phú Yên - Khánh Hòa',
  },
  {
    _id: '7',
    vesselId: 'BV-94785-TS',
    owner: 'ĐẶNG MINH TRÍ',
    departureDate: '2025-05-01',
    tripPeriodDays: 40,
    numberOfCrews: 9,
    status: '2Share',
    vesselType: 'Oil Tanker',
    address: 'Cảng Vũng Tàu, Bà Rịa',
    placeOfDeparture: 'VT-15',
    toRegion: 'G. Bình Thuận - Ninh Thuận',
  },
  {
    _id: '8',
    vesselId: 'BV-94896-TS',
    owner: 'HOÀNG THỊ LAN',
    departureDate: '2025-05-15',
    tripPeriodDays: 25,
    numberOfCrews: 2,
    status: 'Full',
    vesselType: 'Bulk Carrier',
    address: 'Cảng Nha Trang, Khánh Hòa',
    placeOfDeparture: 'NT-09',
    toRegion: 'H. Cam Ranh - Vân Phong',
  },
  {
    _id: '9',
    vesselId: 'BV-94907-TS',
    owner: 'MAI XUÂN THÀNH',
    departureDate: '2025-06-01',
    tripPeriodDays: 10,
    numberOfCrews: 1,
    status: 'Return Port',
    vesselType: 'Coastal Patrol',
    address: 'Cảng Phú Quốc, Kiên Giang',
    placeOfDeparture: 'PQ-18',
    toRegion: 'I. Hà Tiên - Rạch Giá',
  },
  {
    _id: '10',
    vesselId: 'BV-95018-TS',
    owner: 'NGÔ THỊ KIM CHI',
    departureDate: '2025-06-10',
    tripPeriodDays: 7,
    numberOfCrews: 12,
    status: 'Docking',
    vesselType: 'Cruise Ship',
    address: 'Cảng Đồ Sơn, Hải Phòng',
    placeOfDeparture: 'DS-05',
    toRegion: 'K. Hải Phòng - Quảng Ninh',
  },
];

// ----------------------------------------------------------------------

EcommerceProductListPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function EcommerceProductListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { global } = useSelector((state) => state.globalSettings);

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const dispatch = useDispatch();

  // const { products, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState(demoRequests);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getConfig());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (products.length) {
  //     setTableData(products);
  //   }
  // }, [products]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = !dataFiltered.length && !!filterName;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setFilterStatus(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  console.log('tableData', tableData);

  return (
    <>
      <Head>
        <title> Vessel: Dock Requests | iTruckSea</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Request List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Request Dock',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.eCommerce.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Request
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {(isNotFound ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ProductTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const searchText = filterName.toLowerCase();
    inputData = inputData.filter((vessel) => {
      const searchFields = [
        vessel.vesselId,
        vessel.owner,
        vessel.address,
        vessel.placeOfDeparture,
        vessel.toRegion,
        vessel.vesselType,
      ]
        .join(' ')
        .toLowerCase();
      return searchFields.includes(searchText);
    });
  }

  if (filterStatus.length) {
    inputData = inputData.filter((product) => filterStatus.includes(product.inventoryType));
  }

  return inputData;
}
