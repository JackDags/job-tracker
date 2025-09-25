import { Box, Button, Center, Divider, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title, Typography } from "@mantine/core"
import { IconArrowDown, IconArrowsSort, IconArrowUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import JobModal from "../../components/JobModal"
import { OrderEnum } from "../../utils/enums"
import { Entry, Ordering } from "../../utils/types"
import { clearData, getData, setData } from "../../utils/storage"
import { isEntry } from "../../utils/validate"

const createHeaders = (data: Entry[]): string[] => {
  const allKeys: string[] = data.flatMap(Object.keys);
  const keySet = new Set(allKeys)
  return Array.from(keySet);
}

const getFirstLetterUppercase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const Jobs = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newData, setNewData] = useState<Entry | {}>({})
  const [tableHeaders, setTableHeaders] = useState<string[]>([])
  const [tableRows, setTableRows] = useState<Entry[]>([])
  const [ordering, setOrdering] = useState<Ordering>({})
  const [currentOrderedHeader, setCurrentOrderedHeader] = useState<string>("")
  const [initialTableRows, setInitialTableRows] = useState<Entry[]>([])
  const [orderIcon, setOrderIcon] = useState(<IconArrowsSort />)

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
      setData(newData)
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
      setNewData(data)
      setIsOpen(false)
      reset()
    }
  }

  const handleClear = () => {
    clearData()
    setTableHeaders([])
    setTableRows([])
  }

  const handleOrdering = (header: keyof Entry) => {

    setCurrentOrderedHeader(header)

    switch (ordering[header]) {
      //order from default to ascending
      case OrderEnum.DEFAULT:
        setOrderIcon(<IconArrowUp />)
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
        setOrderIcon(<IconArrowDown />)
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

  return (
    <Center>
      <JobModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        handleSubmit={handleSubmit}
      />
      <Box>
        <Box display={"flex"}>
          <Button
            onClick={() => setIsOpen(true)}
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
            <Table striped highlightOnHover withColumnBorders horizontalSpacing="md">
              <TableThead>
                <TableTr>
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
                  <TableTr key={row.company}>
                    {Object.values(row).map((entry, index) =>
                      <TableTd key={`${Object.keys(row)[index]} ${entry}`}>{entry}</TableTd>
                    )}
                  </TableTr>
                )}
              </TableTbody>
            </Table>
            :
            <Typography>No data yet</Typography>
        }
      </Box>
    </Center>
  )

}

export default Jobs