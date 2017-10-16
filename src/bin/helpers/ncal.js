import { exec } from 'child_process'
import moment from 'moment'

const now = moment()

export const getNCalString = async (
  month = now.month() + 1,
  year = now.year()
) => {
  return new Promise((resolve, reject) => {
    exec(`ncal -w ${month} ${year}`, function(error, stdout, stderr) {
      if (error) reject(stderr)
      else resolve(stdout)
    })
  })
}
