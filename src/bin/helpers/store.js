import Immutable from 'immutable'
import fsp from 'fs-promise'

const FILE_NAME = './wcal.json'

export const Timestamp = Immutable.Record({
  id: 0,
  hours: 0,
  when: '',
  message: ''
})

export const Store = Immutable.Record({
  company: '',
  description: '',
  rate: 0,
  currency:'',
  timestamps: []
})

export const checkIfStoreExists = async (fileName = FILE_NAME) => {
  return fsp.exists(`./${fileName}`)
}

export const getStore = async (fileName = FILE_NAME) => {
  const fileExists = await checkIfStoreExists()

  if (!fileExists) throw new Error('wcal.json doesn\'t exist in this directory')

  const json = await fsp.readJSON(fileName)
  const store = new Store(json)
  const { timestamps } = store
  const recordifiedTimestamps = Immutable.List(timestamps.map(ts => new Timestamp(ts)))

  return store.set('timestamps', recordifiedTimestamps)
}

export const persistStore = async (store, fileName = FILE_NAME) => {
  try {
    const newStore = await fsp.writeJSON(fileName, store.toJS())

    return newStore
  }
  catch(e) { throw new Error(e) }
}

