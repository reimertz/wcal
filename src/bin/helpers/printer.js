import chalk from 'chalk'
import moment from 'moment'

// const center = (title, width) => {
//   const padding = new Array(parseInt((width - title.length - 2) / 2)+1).fill(' ').join('')

//   return `${padding} ${title} ${padding}`
// }

const d = string => chalk.dim(string)

const generateDivider = length => {
  return chalk.dim(new Array(length).fill('=').join(''))
}

const parseNCalString = string => {
  const rows = string.split('\n').filter(r => r.length > 0)
  const width = rows.reduce((widest, nextRow) => {
    return Math.max(widest, nextRow.length)
  }, 0)

  const dateArray = rows[0].trim().split(' ')
  const date = moment()
    .year(dateArray[1])
    .month(dateArray[0])
  const weekRow = rows[rows.length - 1].trim()
  const weeks = weekRow.match(/(\d)+/g).map(a => Number(a))

  return {
    width,
    date,
    weeks,
    rows
  }
}

const calculateHours = (weeks, rate, timestamps) => {
  const hpw = weeks.reduce((o, value) => {
    o[Number(value)] = 0
    return o
  }, {})

  timestamps.map(t => {
    const timestampIsoWeek = moment(t.when).isoWeek()
    hpw[timestampIsoWeek] = hpw[timestampIsoWeek] + Number(t.hours)
  })

  const hpwRow = `${Object.values(hpw)
    .map((h, i) => {
      if (i === 0) return ` ${h} `
      return h.length == 1 ? `${h}` : `${h}  `
    })
    .join('')}`

  const hours = timestamps.reduce((total, next) => {
    return total + Number(next.hours)
  }, 0)

  const total = hours * Number(rate)

  return {
    hours,
    total,
    hpwRow
  }
}

export const generateOutput = async (ncalOutput, store) => {
  const { company, timestamps, rate, currency } = store
  const { width, date, weeks, rows } = parseNCalString(ncalOutput)

  const calendarOutput = []

  const calendar = rows
    .slice(1, rows.length - 2)
    .map(r => {
      return chalk.dim(r.substring(0, 2)) + r.substring(2, r.length - 1)
    })
    .join('\n')

  const timestampsSameMonth = timestamps
    .filter(t => {
      return moment(t.when).isSame(date.month(), 'month')
    })
    .sort((a, b) => {
      return a.when > b.when
    })

  const timestampsRows = timestampsSameMonth.reduce(
    (rows, ts) => {
      const id = `#${ts.id}          `.substring(0, 5)
      const hours = `${ts.hours}h          `.substring(0, 5)
      const date = `${moment(ts.when).format('ll')}`

      rows.push(
        `${id} ${hours} ${date} ${ts.message.length > 0
          ? d(` ${ts.message}`)
          : ''}`
      )
      rows.push()

      return rows
    },
    [``]
  )

  const { hours, total, hpwRow } = calculateHours(
    weeks,
    rate,
    timestampsSameMonth
  )

  const divider = generateDivider(width)

  calendarOutput.push(``)
  calendarOutput.push(d(company)) // title
  calendarOutput.push(rows[0].trim()) // year and month
  calendarOutput.push(divider)
  calendarOutput.push(calendar) // calendar
  calendarOutput.push(divider)
  calendarOutput.push(`${d('W:')} ${rows[rows.length - 1].substring(3)}`) // weeks
  calendarOutput.push(`${d('H:')} ${hpwRow}`) // hours per week
  calendarOutput.push(divider)
  calendarOutput.push(`${d('Rate:')} ${currency}${rate}`)
  calendarOutput.push(`${d('Total Hours:')} ${hours}h`)
  calendarOutput.push(divider)
  calendarOutput.push(`${currency}${rate} * ${hours}h = ${currency}${total}`)

  return calendarOutput.concat(timestampsRows, [``]).map(r => {
    return r + '\n'
  })
}
