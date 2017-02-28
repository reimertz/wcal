import chalk from 'chalk'

import { getStore } from './helpers/store'
import { getNCalString } from './helpers/ncal'
import { generateOutput } from './helpers/printer'

export const list = async (month, year) => {

  try {
    const store = await getStore()
    const ncalString = await getNCalString(month, year)
    const output = await generateOutput(ncalString, store)

    output.map(r => process.stdout.write(r))
  }

  catch(e) {
    process.stdout.write(chalk.red(`◷         ${e}\n`))
  }
}
