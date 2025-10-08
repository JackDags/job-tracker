import { ActionIcon, Box, Button, Center, Checkbox, Divider, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title, Typography } from "@mantine/core"
import { IconArrowsSort, IconArrowUp, IconEdit } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import JobModal from "../../components/JobModal"
import "../../utils/animations.css"
import { ModeEnum, OrderEnum } from "../../utils/enums"
import { getArrayFromMap } from "../../utils/functions"
import { clearData, getData, postData, updateData } from "../../utils/storage"
import { Entry, Ordering } from "../../utils/types"
import { isEntry } from "../../utils/validate"

const createHeaders = (data: Entry[]) => {
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
  const [tableRows, setTableRows] = useState<Map<number, Entry>>(new Map())
  const [initialTableRows, setInitialTableRows] = useState<Map<number, Entry>>(new Map())
  const [ordering, setOrdering] = useState<Ordering>({})
  const [currentOrderedHeader, setCurrentOrderedHeader] = useState<string>("")
  const [orderIcon, setOrderIcon] = useState(<IconArrowsSort />)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [rowToEdit, setRowToEdit] = useState<Entry | null>(null)
  const [mode, setMode] = useState<string>(ModeEnum.CREATE)
  const [editId, setEditId] = useState<number>(-1)

  useEffect(() => {
    handleInit()
  }, [])

  useEffect(() => {
    if (isEntry(newData) && Object.keys(newData).length > 0) {
      postData(newData)
      const newHeaders = createHeaders([newData])
      setTableHeaders(newHeaders)
      if (tableRows.size === 0) {
        setOrdering(Object.fromEntries(newHeaders.map(header => [header, OrderEnum.DEFAULT])))
      }
      setTableRows(prev => {
        const newTableRows = new Map(prev)
        newTableRows.set(prev.size, newData)
        return newTableRows
      })
      setInitialTableRows(tableRows)
    }
  }, [newData])

  const handleInit = () => {
    const dataFromStorage = getData()
    if (dataFromStorage && dataFromStorage.size > 0) {
      //headers
      const dataToArray = getArrayFromMap(dataFromStorage)
      const headers = createHeaders(dataToArray)
      setTableHeaders(headers)
      setOrdering(Object.fromEntries(headers.map(header => [header, OrderEnum.DEFAULT])))
      setCurrentOrderedHeader(headers[0])
      //rows
      setTableRows(dataFromStorage)
      setInitialTableRows(dataFromStorage)
    }
  }

  const handleSubmit = (id: number, data: Entry, reset: () => void) => {
    if (data) {
      setIsOpen(false)
      if (mode === ModeEnum.EDIT) {
        updateData(id, data, handleInit)
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
    setTableRows(new Map())
    setRowToEdit(null)
    setEditId(-1)
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
          const sortedRows = new Map(
            [...prev.entries()].sort(([, a], [, b]) => b[header].localeCompare(a[header]))
          )
          return sortedRows
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
          const sortedRows = new Map(
            [...prev.entries()].sort(([, a], [, b]) => a[header].localeCompare(b[header]))
          )
          return sortedRows
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

  const handleEdit = (key: number, row: Entry) => {
    setEditId(key)
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
        id={editId}
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
          tableRows.size > 0 ?
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
                  {[...tableRows.entries()].map(([key, value]) =>
                    <TableTr
                      key={key}
                      bg={selectedRows.includes(value.company) ? 'var(--mantine-color-blue-light)' : undefined}
                    >
                      <TableTd>
                        <Checkbox
                          aria-label="Select row"
                          checked={selectedRows.includes(value.company)}
                          styles={{
                            input: { cursor: "pointer" },
                          }}
                          onChange={(event) =>
                            setSelectedRows(
                              event.currentTarget.checked
                                ? [...selectedRows, value.company]
                                : selectedRows.filter((position) => position !== value.company)
                            )
                          }
                        />
                      </TableTd>
                      {Object.values(value).map((entry, index) =>
                        <TableTd key={`${Object.keys(value)[index]} ${entry}`}>{entry}</TableTd>
                      )}
                      <TableTd>
                        <ActionIcon onClick={() => handleEdit(key, value)}>
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