import minimist from 'minimist'

import { list } from './wcal-list'
import { init } from './wcal-init'
import { add } from './wcal-add'
import { edit } from './wcal-edit'
import { remove } from './wcal-remove'
import { help } from './wcal-help'

import { checkIfStoreExists } from './helpers/store'

var { _ } = minimist(process.argv.slice(2))

async function wcal (){
  switch (_[0]) {
    case 'init':
      return init(_)
    case 'add':
      return add(_)
    case 'edit':
      return edit(_[1])
    case 'remove':
      return remove(_[1])
    case 'help':
      return help(_)
    case 'list':
      return list(_[1], _[2])
    default: {
      const fileExists = await checkIfStoreExists()

      if (!fileExists) return init()
      else return list()
    }
  }
}

wcal()
