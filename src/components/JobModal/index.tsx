import { Autocomplete, Box, Button, Input, InputWrapper, Modal } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { ModeEnum } from "../../utils/enums"
import { getData } from "../../utils/storage"
import { Entry } from "../../utils/types"
import { isEntry } from "../../utils/validate"
import { getArrayFromMap } from "../../utils/functions"

interface Props {
  id: number,
  isOpen: boolean
  onClose: () => void
  handleSubmit: (id: number, data: Entry, reset: () => void) => void
  initialValues: Entry
  mode: string
}

const checkIfDuplicate = (value: string, key: keyof Entry): boolean => {
  const dataFromStorage = getData()
  const dataMappedToArray = getArrayFromMap(dataFromStorage)
  return dataMappedToArray.some(entry => entry[key] === value);
}

const statusOptions = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
]

const JobModal = (props: Props) => {

  const { id, isOpen, onClose, handleSubmit, initialValues, mode } = props

  const [buttonLabel, setButtonLabel] = useState<string>("")

  useEffect(() => {
    if (isEntry(initialValues)) {
      form.setValues(initialValues)
    }
  }, [initialValues])

  useEffect(() => {
    if (mode === ModeEnum.CREATE) {
      setButtonLabel("Submit")
    } else {
      setButtonLabel("Update")
    }
  }, [mode])

  const form = useForm({
    initialValues,
    validate: {
      company: (value) => (value.length > 0 && (!checkIfDuplicate(value, "company") || mode === ModeEnum.EDIT) ? null : "Company already exists"),
      position: (value) => (value.length > 0 ? null : "Position is required"),
      status: (value) => (value.length > 0 && statusOptions.includes(value) ? null : "Status must be one of the listed options"),
      date: (value) => (value.length > 0 && dayjs(value).isValid() ? null : "Date must be valid")
    }
  })

  if (!isOpen) return null

  return (
    <Modal title="Create Job" opened={isOpen} onClose={onClose}>
      <form onSubmit={form.onSubmit((data) => handleSubmit(id, data, () => form.reset()))}>
        <InputWrapper label="Company">
          <Input
            placeholder="Company"
            {...form.getInputProps('company')}
          />
        </InputWrapper>
        <InputWrapper label="Position">
          <Input
            placeholder="Position"
            {...form.getInputProps('position')}
          />
        </InputWrapper>
        <Autocomplete
          clearable
          label="Status"
          placeholder="Pick a Status"
          data={statusOptions}
          {...form.getInputProps('status')}
        />
        <DatePickerInput
          clearable
          excludeDate={(date) => new Date(date) >= new Date}
          label="Date when applied"
          placeholder="Pick Date"
          {...form.getInputProps('date')}
        />
        <Box pt={24} style={{ display: "flex", justifyContent: "end" }}>
          <Button type="submit">{buttonLabel}</Button>
        </Box>
      </form>
    </Modal>
  )

}

export default JobModal