import { Autocomplete, Box, Button, Input, InputWrapper, Modal } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import dayjs from "dayjs"
import { Entry } from "../../utils/types"
import { getData } from "../../utils/storage"

interface Props {
  isOpen: boolean,
  onClose: () => void
  handleSubmit: (data: Entry, reset: () => void) => void
}

const checkIfDuplicate = (value: string) => {
  const prevData = getData()
  return prevData && prevData.some((entry: Entry) => entry.company === value)
}

const statusOptions = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
]

const JobModal = (props: Props) => {

  const { isOpen, onClose, handleSubmit } = props

  const form = useForm({
    mode: 'uncontrolled',
    initialValues:
    {
      company: "",
      position: "",
      status: "",
      date: dayjs().format('YYYY-MM-DD'),
    },
    validate: {
      company: (value) => (value.length && !checkIfDuplicate(value) ? null : "Company already exists"),
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
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Modal>
  )

}

export default JobModal