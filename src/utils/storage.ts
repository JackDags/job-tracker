import { Entry } from "./types"

const LOCAL_STORAGE_KEY = "form-data"

export const getData = () => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData = new Map(JSON.parse(fetchedData))
    return parsedData
  }
}

export const postData = (newData: Entry) => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData = new Map(JSON.parse(fetchedData))
    // const newDataWithId = {...newData, id: fetchedData.length}
    // const mergedData = [...parsedData, newDataWithId]
    const mergedData = [...parsedData, newData]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData))
  } else {
    const jobMap = new Map()
    jobMap.set(0, newData)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(jobMap.entries())))
  }
}

export const updateData = (data: Entry) => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData = JSON.parse(fetchedData)
    const indexToUpdate = parsedData.findIndex((entry: Entry) => entry.company === data.company)

    if (indexToUpdate >= 0) {
      const updatedData = [
        ...parsedData.slice(0, indexToUpdate),
        { ...data },
        ...parsedData.slice(indexToUpdate + 1)
      ]
      console.log(updatedData)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData))
    }
  }
}

export const deleteData = () => {

}

export const clearData = () => {
  localStorage.clear()
}