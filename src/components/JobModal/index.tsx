import { Autocomplete, Box, Button, Input, InputWrapper, Modal } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import dayjs from "dayjs"
import { Entry } from "../../utils/types"
import { getData } from "../../utils/storage"
import { useEffect, useState } from "react"
import { isEntry } from "../../utils/validate"
import { ModeEnum } from "../../utils/enums"

interface Props {
  isOpen: boolean
  onClose: () => void
  handleSubmit: (data: Entry, reset: () => void) => void
  initialValues: Entry
  mode: string
}

const checkIfDuplicate = <K, V extends Record<string, any>> (subValue: string, key: keyof V): boolean => {
  const prevData = getData() as  Map<K, V> | null

  if (!prevData) return false

  for (const [, value] of prevData) {
    if (value[key] === subValue) {
      return true
    }
  }
  return false
}

const statusOptions = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
]

const JobModal = (props: Props) => {

  const { isOpen, onClose, handleSubmit, initialValues, mode } = props

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
      <form onSubmit={form.onSubmit((data) => handleSubmit(data, () => form.reset()))}>
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