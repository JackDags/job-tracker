export const getArrayFromMap = <K, V extends Record<string, any>>(data: Map<K, V>) => {
  return Array.from(data.values())
}