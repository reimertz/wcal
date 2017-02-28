import chalk from 'chalk'
import moment from 'moment'

import { getStore, persistStore, Timestamp } from './helpers/store'
import askForInput from './helpers/ask-for-input'

const createTimestamp = async (id) => {
  const now =  moment()

  const hours = await askForInput({   question:'◷            hours: '})
  if (!hours || isNaN(Number(hours))) throw new Error('hours is required and has to be an integer or decimal.')

  const day = await askForInput({     question:'◷              day: ', defaultAnswer: String(now.date())})
  if (!day) throw new Error('day is required!')

  const month = await askForInput({   question:'◷            month: ', defaultAnswer: String(now.month() + 1) })
  if (!month) throw new Error('month is required!')

  const year = await askForInput({    question:'◷             year: ', defaultAnswer: String(now.year())})
  if (!year) throw new Error('year is required!')

  const date = moment().year(year).month(month-1).date(day).toISOString()
  if (date === 'Invalid date') throw new Error('has to be a valid date.')

  const message = await askForInput({ question:'◷          message: ', defaultAnswer: ''})
  if (!message) throw new Error('a message is required!')

  return new Timestamp({
    id,
    hours,
    when: date,
    message,
  })
}

export const add = async () => {
  process.stdout.write(chalk.green('◷             wcal: add\n'))

  try {
    const store = await getStore()
    const { timestamps } = store
    const newTs = await createTimestamp(timestamps.size + 1)

    await persistStore(store.set('timestamps', timestamps.push(newTs) ))

    process.stdout.write(chalk.green('◷             wcal: done\n'))
  }

  catch(e) {
    process.stdout.write(chalk.red(`◷            error: ${e.message}\n`))
  }
}
