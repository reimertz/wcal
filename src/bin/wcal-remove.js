import chalk from 'chalk'

import { getStore, persistStore } from './helpers/store'
import askForInput from './helpers/ask-for-input'

const getId = async () => {
  const id = await askForInput({ question: '◷                #: ' })
  if (id.length === 0) throw new Error('# is required.')

  return id
}

export const remove = async argumentId => {
  process.stdout.write(chalk.green('◷             wcal: remove\n'))

  try {
    const store = await getStore()
    const id = argumentId || (await getId())
    const timestamps = store.get('timestamps')

    const tsToRemove = timestamps.find(t => {
      return t.get('id') == id
    })

    if (!tsToRemove) throw new Error(`no timestamp with #${id} exists.`)

    const tsIndex = timestamps.indexOf(tsToRemove)

    await persistStore(store.set('timestamps', timestamps.remove(tsIndex)))

    process.stdout.write(chalk.green('◷             wcal: done\n'))
  } catch (e) {
    process.stdout.write(chalk.red(`◷            error: ${e.message}\n`))
  }
}
