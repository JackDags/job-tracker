import { Box, Button, Center, Divider, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title, Typography } from "@mantine/core"
import { useEffect, useState } from "react"
import JobModal from "../../components/JobModal"
import { Entry } from "../../utils/interfaces"
import { clearData, getData, setData } from "../../utils/storage"
import { isEntry } from "../../utils/validate"

const createHeaders = (data: Entry[]): string[] => {
  const allKeys: string[] = data.flatMap(Object.keys);
  const keySet = new Set(allKeys)
  const uppercaseKeys = Array.from(keySet).map((key) => key.charAt(0).toUpperCase() + key.slice(1))
  return Array.from(uppercaseKeys);
}

const Jobs = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newData, setNewData] = useState<Entry | {}>({})
  const [tableHeaders, setTableHeaders] = useState<string[]>([])
  const [tableRows, setTableRows] = useState<Entry[]>([])

  useEffect(() => {
    const dataFromStorage = getData()
    if (dataFromStorage) {
      const headers = createHeaders(dataFromStorage)
      setTableHeaders(headers)
      setTableRows(dataFromStorage)
    }
  }, [])

  useEffect(() => {
    if (isEntry(newData) && Object.keys(newData).length > 0) {
      setData(newData)
      const newHeaders = createHeaders([newData])
      setTableHeaders(newHeaders)
      setTableRows(prev => [...prev, ...[newData]])
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
                {tableHeaders.map((header) =>
                  <TableTh key={header}>{header}</TableTh>
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