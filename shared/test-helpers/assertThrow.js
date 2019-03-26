const THROW_ERROR_PREFIX = 'VM Exception while processing transaction:'

function assertError(error, expectedErrorCode) {
  assert(error.message.search(expectedErrorCode) > -1, `Expected error code "${expectedErrorCode}" but failed with "${error}" instead.`)
}

async function assertThrows(blockOrPromise, expectedErrorCode) {
  try {
    (typeof blockOrPromise === 'function') ? await blockOrPromise() : await blockOrPromise
  } catch (error) {
    assertError(error, expectedErrorCode)
    return error
  }
  assert.fail(`Expected "${expectedErrorCode}" but it did not fail`)
}

module.exports = {
  async assertJump(blockOrPromise) {
    return assertThrows(blockOrPromise, 'invalid JUMP')
  },

  async assertInvalidOpcode(blockOrPromise) {
    return assertThrows(blockOrPromise, 'invalid opcode')
  },

  async assertRevert(blockOrPromise, reason) {
    const error = await assertThrows(blockOrPromise, 'revert')
    const errorPrefix = `${THROW_ERROR_PREFIX} revert`
    if (error.message.includes(errorPrefix)) {
      error.reason = error.message.replace(errorPrefix, '').trim()
    }

    if (reason) {
      assert.equal(reason, error.reason, `Expected revert reason "${reason}" but failed with "${error.reason || 'no reason'}" instead.`)
    }
  },
}
