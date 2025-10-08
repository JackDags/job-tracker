import { Entry } from "./types"

const LOCAL_STORAGE_KEY = "form-data"

export const getData = (): Map<number, Entry> => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData: Map<number, Entry> = new Map(JSON.parse(fetchedData))
    return parsedData
  } else {
    return new Map()
  }
}

export const postData = (newData: Entry) => {
  const fetchedData = getData()
  if (fetchedData.size !== 0) {
    const copyOfFetchedData = new Map(fetchedData)
    copyOfFetchedData.set(fetchedData.size, newData)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(copyOfFetchedData)))
  } else {
    const jobMap = new Map()
    jobMap.set(0, newData)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(jobMap.entries())))
  }
}

export const updateData = (id: number, data: Entry, callback: (id: number, data: Entry) => void) => {
  const fetchedData = getData()
  if (fetchedData) {
    const updatedData = new Map(fetchedData)
    updatedData.set(id, data)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(updatedData)))
    callback(id, data)
  }
}

export const deleteData = () => {

}

export const clearData = () => {
  localStorage.clear()
}