/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line */
import {
  Button,
  Card,
  Divider,
  Group,
  Select,
  Table,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import {
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  useReactTable,
  FilterFn
} from '@tanstack/react-table';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons';
import React from 'react';
import { useInputState } from '@mantine/hooks';

type CustomTableProps = {
  data: any[];
  columns: any;
  initialState?: any;
  tableHooks?: any;
  controlledPageCount?: number;
  searchable?: boolean;
  color?: string;
  striped?: boolean;
  pagination?: boolean;
  bordered?: boolean;
  form?: JSX.Element;
  hiddenHeader?: boolean;
  totalPrice?: number;
  showTotal?: boolean;
  totalColumn?: number;
};

export const CustomTable = ({
  data,
  columns,
  initialState,
  // tableHooks,
  searchable,
  color,
  striped,
  pagination,
  bordered,
  form,
  hiddenHeader,
  totalPrice,
  showTotal,
  totalColumn,
}: CustomTableProps) => {
  const theme = useMantineTheme();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useInputState('');
  const [selectedRow, setSelectedRow] = React.useState<number>();
  // const [{ pageIndex, pageSize }, setPagination] =
  //   React.useState<PaginationState>({
  //     pageIndex: 0,
  //     pageSize: 10,
  //   });

    
  const handleRowClick = (index: any) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const customColor = color ? theme.colors[color] : undefined;

  const isEven = (idx: number) => idx % 2 === 0;

  // const table
  // {
  //   getHeaderGroups,
  //   getRowModel,
  //   setPageIndex,

  //   getCanPreviousPage,
  //   getCanNextPage,
  //   getPageOptions,
  //   getPageCount,
  //   nextPage,
  //   previousPage,
  //   setPageSize,
  //   getState,
  //   // preGlobalFilteredRows,
  //   // setGlobalFilter,

  // }

  const table = useReactTable(
    {
      columns,
      data,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
      getSortedRowModel: getSortedRowModel(),
     // state: initialState,
     state: {
      globalFilter : globalFilter,
      columnVisibility: { uuid: false, patient: false },
      },
 

      //
      debugTable: true,
      // initialState,
      // manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount ? controlledPageCount : 5,
    }

    // useGlobalFilter,
    // useSortBy,
    // usePagination
  );

  const createTd = (quantity: number): JSX.Element[] => {
    const length: number[] = [];
    for (let i = 1; i < quantity; i++) {
      length.push(i);
    }

    return length.map((t) => <td key={t}></td>);
  };
  return (
    <>
      <Card
        style={{
          border: 1,
          borderStyle: 'solid',
          borderColor: customColor ? customColor[2] : theme.colors.gray[2],
        }}
        p={0}
      >
        {searchable && (
          <>
            <Group
              px={'xs'}
              style={{
                backgroundColor: customColor
                  ? customColor[0]
                  : theme.colors.gray[1],
              }}
            >
              <TextInput
                value={globalFilter}
                placeholder={'Taper les éléments à rechercher'}
                onChange={setGlobalFilter}
                variant={'unstyled'}
                style={{ width: '100%' }}
              />
            </Group>

            <Divider mb={'xs'} color={color ? color : 'gray'} />
          </>
        )}
        <Table width={'100%'} color={theme.colors.blue[9]}>
          {!hiddenHeader && (
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    backgroundColor: customColor
                      ? customColor[2]
                      : theme.colors.gray[2],
                  }}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <Group>
                            {!form ? (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? 'cursor-pointer select-none'
                                    : '',
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: <IconSortAscending />,
                                  desc: <IconSortDescending />,
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </Group>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
          )}

          {form && <tbody>{form}</tbody>}

          <tbody>
            {table.getRowModel().rows.map((row, idx) => {
              return (
                <tr
                  onClick={() => handleRowClick(row.index)}
                  key={row.id}
                  style={{
                    backgroundColor:
                      selectedRow === row.index
                        ? '#FCEC9C'
                        : striped && isEven(idx)
                        ? customColor
                          ? customColor[1]
                          : theme.colors.gray[1]
                        : '#FFFFFF',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={
                          bordered
                            ? {
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: customColor
                                  ? customColor[3]
                                  : theme.colors.gray[3],
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* {(pagination ? page : rows).map((row: Row, idx: number) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  style={
                    striped
                      ? {
                          backgroundColor: isEven(idx)
                            ? customColor
                              ? customColor[1]
                              : theme.colors.gray[1]
                            : undefined,
                        }
                      : undefined
                  }
                >
                  {row.cells.map((cell: Cell, index: number) => {
                    return (
                      <td
                        style={
                          bordered
                            ? {
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: customColor
                                  ? customColor[3]
                                  : theme.colors.gray[3],
                              }
                            : undefined
                        }
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })} */}
          </tbody>
          {showTotal && table.getRowModel().rows.length > 0 && (
            <tbody>
              <tr
                style={{
                  borderTop: 1,
                  borderTopStyle: 'solid',
                  borderTopColor: customColor
                    ? customColor[3]
                    : theme.colors.gray[3],
                }}
              >
                <td
                  colSpan={
                    table.getRowModel().rows[0].getAllCells().length -
                    (totalColumn ? totalColumn : 1)
                  }
                >
                  <Text align={'right'} weight={'bold'} color={color}>
                    TOTAL
                  </Text>
                </td>
                <td
                  style={{
                    borderLeft: 1,
                    borderLeftStyle: 'solid',
                    borderLeftColor: customColor
                      ? customColor[3]
                      : theme.colors.gray[3],
                  }}
                >
                  <Text size={'xl'} align={'center'} weight={'bold'}>
                    {totalPrice}
                  </Text>
                </td>
                {createTd(totalColumn ? totalColumn : 1)}
              </tr>
            </tbody>
          )}
        </Table>
      </Card>
      {pagination && (
        <Group
          position={'apart'}
          mt={'xs'}
          p={4}
          style={{
            border: 1,
            borderStyle: 'solid',
            borderColor: customColor ? customColor[2] : theme.colors.gray[2],
          }}
        >
          <Text size={'xs'} weight={'bold'}>
            Page {table.getState().pagination.pageIndex + 1} /{' '}
            {table.getPageCount()} ({data.length})
          </Text>

          <Group spacing={4}>
            <Button
              size={'xs'}
              color={color}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {/* <FontAwesomeIcon icon={faAngleDoubleLeft} /> */}
              <IconChevronsLeft />
            </Button>
            <Button
              size={'xs'}
              color={color}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {/* <FontAwesomeIcon icon={faAngleLeft} /> */}
              <IconChevronLeft />
            </Button>
            <TextInput
              defaultValue={table.getState().pagination.pageIndex + 1}
              placeholder={'Numéro de page'}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              style={{ width: 60 }}
              color={customColor ? customColor[9] : theme.colors.gray[9]}
              size={'xs'}
            />
            <Button
              size={'xs'}
              color={color}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {/* <FontAwesomeIcon icon={faAngleRight} /> */}
              <IconChevronRight />
            </Button>
            <Button
              size={'xs'}
              color={color}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {/* <FontAwesomeIcon icon={faAngleDoubleRight} /> */}
              <IconChevronsRight />
            </Button>
          </Group>

          <Select
            value={table.getState().pagination.pageSize.toString()}
            data={[5, 10, 20, 30, 50, 100].map((pageSize) => {
              return { label: pageSize.toString(), value: pageSize.toString() };
            })}
            onChange={(e) => {
              table.setPageSize(Number(e));
            }}
            size={'xs'}
            style={{ width: 65 }}
          />
        </Group>
      )}
    </>
  );
};

// export default CustomTable;
