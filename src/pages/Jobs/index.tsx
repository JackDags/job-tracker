import { ActionIcon, Box, Button, Center, Checkbox, Divider, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title, Typography } from "@mantine/core"
import { IconArrowsSort, IconArrowUp, IconEdit } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import JobModal from "../../components/JobModal"
import "../../utils/animations.css"
import { ModeEnum, OrderEnum } from "../../utils/enums"
import { clearData, getData, postData, updateData } from "../../utils/storage"
import { Entry, Ordering } from "../../utils/types"
import { isEntry } from "../../utils/validate"
import dayjs from "dayjs"

const createHeaders = (data: Entry[]): string[] => {
  const allKeys: string[] = data.flatMap(Object.keys);
  const keySet = new Set(allKeys)
  return Array.from(keySet);
}

const getFirstLetterUppercase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getInitialFormValues = (): Entry => {
  return {
    company: "",
    position: "",
    status: "",
    date: dayjs().format('YYYY-MM-DD'),
  }
}

const Jobs = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newData, setNewData] = useState<Entry | null>(null)
  const [tableHeaders, setTableHeaders] = useState<string[]>([])
  const [tableRows, setTableRows] = useState<Entry[]>([])
  const [ordering, setOrdering] = useState<Ordering>({})
  const [currentOrderedHeader, setCurrentOrderedHeader] = useState<string>("")
  const [initialTableRows, setInitialTableRows] = useState<Entry[]>([])
  const [orderIcon, setOrderIcon] = useState(<IconArrowsSort />)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [rowToEdit, setRowToEdit] = useState<Entry | null>(null)
  const [mode, setMode] = useState<string>(ModeEnum.CREATE)

  useEffect(() => {
    const dataFromStorage = getData()
    if (dataFromStorage && dataFromStorage.length > 0) {
      const headers = createHeaders(dataFromStorage)
      setTableHeaders(headers)
      setTableRows(dataFromStorage)
      setInitialTableRows(dataFromStorage)
      setOrdering(Object.fromEntries(headers.map(header => [header, OrderEnum.DEFAULT])))
      setCurrentOrderedHeader(headers[0])
    }
  }, [])

  useEffect(() => {
    if (isEntry(newData) && Object.keys(newData).length > 0) {
      postData(newData)
      const newHeaders = createHeaders([newData])
      setTableHeaders(newHeaders)
      if (tableRows.length === 0) {
        setOrdering(Object.fromEntries(newHeaders.map(header => [header, OrderEnum.DEFAULT])))
      }
      setTableRows(prev => [...prev, ...[newData]])
      setInitialTableRows(prev => [...prev, ...[newData]])
    }
  }, [newData])

  const handleSubmit = (data: Entry, reset: () => void) => {
    if (data) {
      setIsOpen(false)
      if (mode === ModeEnum.EDIT) {
        updateData(data)
        setRowToEdit(null)
      } else if (mode === ModeEnum.CREATE) {
        setNewData(data)
      }
      reset()
    }
  }

  const handleClear = () => {
    clearData()
    setTableHeaders([])
    setTableRows([])
    setRowToEdit(null)
  }

  const handleOrdering = (header: keyof Entry) => {

    setCurrentOrderedHeader(header)

    switch (ordering[header]) {
      //order from default to ascending
      case OrderEnum.DEFAULT:
        setOrderIcon(<IconArrowUp className="icon" />)
        setOrdering(prev => {
          const oldOrdering = { ...prev }
          return { ...oldOrdering, [header]: OrderEnum.ASC }
        })
        setTableRows(prev => {
          const oldRows = [...prev]
          return oldRows.sort((a: Entry, b: Entry) => a[header].localeCompare(b[header]))
        })
        break;
      //order from ascending to descending
      case OrderEnum.ASC:
        setOrderIcon(<IconArrowUp className="icon rotate-180" />)
        setOrdering(prev => {
          const oldOrdering = { ...prev }
          return { ...oldOrdering, [header]: OrderEnum.DSC }
        })
        setTableRows(prev => {
          const oldRows = [...prev]
          return oldRows.sort((a: Entry, b: Entry) => b[header].localeCompare(a[header]))
        })
        break;
      //order from descending to default
      default:
        setOrderIcon(<IconArrowsSort />)
        setOrdering(prev => {
          const oldOrdering = { ...prev }
          return { ...oldOrdering, [header]: OrderEnum.DEFAULT }
        })
        setTableRows(initialTableRows)
        break;
    }

  }

  const handleEdit = (row: Entry) => {
    setRowToEdit(row)
    setIsOpen(true)
    setMode(ModeEnum.EDIT)
  }

  const handleCreate = () => {
    setIsOpen(true)
    setMode(ModeEnum.CREATE)
  }

  return (
    <Center>
      <JobModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        handleSubmit={handleSubmit}
        initialValues={rowToEdit ?? getInitialFormValues()}
        mode={mode}
      />
      <Box>
        <Box display={"flex"}>
          <Button
            onClick={() => handleCreate()}
            mr={"16px"}
          >
            Create Job
          </Button>
          <Button
            onClick={() => handleClear()}
          >
            Clear Local Storage
          </Button>
        </Box>
        <Divider my="sm" />
        <Title order={3}>JOBS:</Title>
        {
          Object.keys(tableRows).length > 0 ?
            <Table.ScrollContainer minWidth={500} maxHeight={600}>
              <Table striped highlightOnHover withColumnBorders withTableBorder horizontalSpacing="md">
                <TableThead>
                  <TableTr>
                    <Table.Th />
                    {tableHeaders.map((header: string) =>
                      <TableTh
                        key={header}
                        onClick={() => handleOrdering(header as keyof Entry)}
                        style={{ cursor: "pointer" }}
                      >
                        <Box display={"flex"}>
                          {currentOrderedHeader === header && orderIcon}
                          {currentOrderedHeader === header && <Divider orientation="vertical" mx={"8px"} />}
                          {getFirstLetterUppercase(header)}
                        </Box>
                      </TableTh>
                    )}
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {tableRows.map((row) =>
                    <TableTr
                      key={row.company}
                      bg={selectedRows.includes(row.company) ? 'var(--mantine-color-blue-light)' : undefined}
                    >
                      <TableTd>
                        <Checkbox
                          aria-label="Select row"
                          checked={selectedRows.includes(row.company)}
                          styles={{
                            input: { cursor: "pointer" },
                          }}
                          onChange={(event) =>
                            setSelectedRows(
                              event.currentTarget.checked
                                ? [...selectedRows, row.company]
                                : selectedRows.filter((position) => position !== row.company)
                            )
                          }
                        />
                      </TableTd>
                      {Object.values(row).map((entry, index) =>
                        <TableTd key={`${Object.keys(row)[index]} ${entry}`}>{entry}</TableTd>
                      )}
                      <TableTd>
                        <ActionIcon onClick={() => handleEdit(row)}>
                          <IconEdit />
                        </ActionIcon>
                      </TableTd>
                    </TableTr>
                  )}
                </TableTbody>
              </Table>
            </Table.ScrollContainer>
            :
            <Typography>No data yet</Typography>
        }
      </Box>
    </Center>
  )

}

export default Jobs