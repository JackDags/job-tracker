import { Entry } from "./interfaces"

const LOCAL_STORAGE_KEY = "form-data"

export const getData = () => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData = JSON.parse(fetchedData)
    return parsedData
  }
}

export const setData = (newData: Entry) => {
  const fetchedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (fetchedData) {
    const parsedData = JSON.parse(fetchedData)
    const mergedData = [...parsedData, newData]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData))
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newData]))
  }
}

export const updateData = () => {

}

export const deleteData = () => {

}

export const clearData = () => {
  localStorage.clear()
}