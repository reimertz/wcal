import chalk from 'chalk'
import moment from 'moment'

import { getStore, persistStore, Timestamp } from './helpers/store'
import askForInput from './helpers/ask-for-input'

const getId = async () => {
  const id = await askForInput({   question:'◷                #: '})
  if (id.length === 0) throw new Error('# is required.')

  return id
}

const editTimestamp = async (timestamp) => {
  const tsDate = moment(timestamp.get('date'))

  const hours = await askForInput({
    question:'◷            hours: ',
    defaultAnswer: String(timestamp.get('hours'))
  })

  if (!hours || isNaN(Number(hours))) throw new Error('hours is required and has to be an integer or decimal.')

  const day = await askForInput({
    question:'◷              day: ',
    defaultAnswer: String(tsDate.date())
  })
  if (!day) throw new Error('day is required!')

  const month = await askForInput({
    question:'◷            month: ',
    defaultAnswer: String(tsDate.month() + 1)
  })
  if (!month) throw new Error('month is required!')

  const year = await askForInput({
    question:'◷             year: ',
    defaultAnswer: String(tsDate.year())
  })
  if (!year) throw new Error('year is required!')

  const date = moment().year(year).month(month-1).date(day).toISOString()
  if (date === 'Invalid date') throw new Error('has to be a valid date.')

  const message = await askForInput({
    question:'◷          message: ',
    defaultAnswer: String(timestamp.get('message'))
  })
  if (!message) throw new Error('a message is required!')

  return new Timestamp({
    id: timestamp.id,
    hours,
    when: date,
    message,
  })
}

export const edit = async (argumentId) => {
  process.stdout.write(chalk.green('◷             wcal: edit\n'))

  try {
    const store = await getStore()
    const id = argumentId || await getId()
    const timestamps = store.get('timestamps')
    const tsToEdit = timestamps.find(t =>  t.get('id') == id)
    const tsIndex = timestamps.indexOf(tsToEdit)

    if (!tsToEdit) throw new Error(`no timestamp with #${id} exists.`)

    const editedTs = await editTimestamp(tsToEdit)

    await persistStore(store.mergeIn(['timestamps', tsIndex], editedTs))

    process.stdout.write(chalk.green('◷             wcal: done\n'))
  }

  catch(e) {
    process.stdout.write(chalk.red(`◷            error: ${e.message}\n`))
  }
}