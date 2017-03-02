export const help = () => {
  let output = []

  output.push('wcal help')
  output.push('')
  output.push('wcal <int:year> <int:month>     show wcal')
  output.push('wcal init                       init wcal in current dir')
  output.push('wcal add                        add new timestamp')
  output.push('wcal edit <int:id>              edit a timestamp')
  output.push('wcal remove <int:id>            remove a timestamp')
  output.push('wcal help                       show help')

  output.map(r => process.stdout.write(`${r}\n`))
}
