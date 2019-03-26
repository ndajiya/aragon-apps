function assertError(error, expectedErrorCode, expectedErrorMessage = '') {
  assert(error.message.search(expectedErrorCode) > -1, `Expected error code "${expectedErrorCode}" but failed with "${error}" instead.`)
  assert(error.message.search(expectedErrorMessage) > -1, `Expected error message "${expectedErrorMessage}" but failed with "${error}" instead.`)
}

async function assertThrows(blockOrPromise, expectedErrorCode, expectedErrorMessage = '') {
  try {
    (typeof blockOrPromise === 'function') ? await blockOrPromise() : await blockOrPromise
  } catch (error) {
    assertError(error, expectedErrorCode, expectedErrorMessage)
    return
  }
  assert.fail(`Expected "${expectedErrorCode}" but it did not fail`)
}

module.exports = {
  async assertJump(blockOrPromise, message = '') {
    return assertThrows(blockOrPromise, 'invalid JUMP', message)
  },

  async assertInvalidOpcode(blockOrPromise, message = '') {
    return assertThrows(blockOrPromise, 'invalid opcode', message)
  },

  async assertRevert(blockOrPromise, message = '') {
    return assertThrows(blockOrPromise, 'revert', message)
  },
}
