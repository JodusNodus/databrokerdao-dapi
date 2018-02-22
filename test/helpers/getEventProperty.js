function getEventProperty(transaction, eventName, property, argums = {}) {
  const event = transaction.logs.filter(log => log.event === eventName)[0]
  if (isBigNumber(event.args[property])) {
    return event.args[property].toString()
  } else {
    return event.args[property]
  }
}

function isBigNumber(number) {
  return number instanceof Object && number.constructor === web3.BigNumber
}

module.exports = getEventProperty
