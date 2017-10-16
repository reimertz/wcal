import chalk from 'chalk'

import { checkIfStoreExists, persistStore, Store } from './helpers/store'
import askForInput from './helpers/ask-for-input'

const createStore = async () => {
  const company = await askForInput({ question: '◷         company: ' })
  if (!company) throw new Error('company is required')

  const description = await askForInput({ question: '◷     description: ' })

  const rate = await askForInput({ question: '◷            rate: ' })
  if (!rate || isNaN(Number(rate))) {
    throw new Error('rate is required and has to be an integer or decimal.')
  }

  const currency = await askForInput({ question: '◷        currency: ' })
  if (!currency) throw new Error('currency is required')

  return new Store({
    company,
    description,
    rate,
    currency
  })
}

export const init = async () => {
  process.stdout.write(chalk.green('◷            wcal: init\n'))

  try {
    const fileExists = await checkIfStoreExists()
    if (fileExists) throw new Error('wcal.json already exists')

    const newStore = await createStore()

    await persistStore(newStore)

    process.stdout.write(chalk.green('◷       wcal: ') + 'done!\n')
  } catch (e) {
    process.stdout.write(chalk.red(`◷           error: ${e.message}\n`))
  }
}
