/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import SolidConnector from '../src/index'

// import sinon from 'sinon'
const webId = 'https://datafluisteraar.solidweb.org/profile/card#me'
const ref1 = 'https://datafluisteraar.solidweb.org/profile/card#me::http://xmlns.com/foaf/0.1/name'
const ref2 = 'https://datafluisteraar.solidweb.org/profile/card#me::http://xmlns.com/foaf/0.1/organisation'

describe('discipl-solid-connector', () => {
  it('should present a name', async () => {
    const solidConnector = new SolidConnector()
    expect(solidConnector.getName()).to.equal('solid')
  })

  it('should split a reference into a webid and predicate (and lateron an index)', async () => {
    const solidConnector = new SolidConnector()
    expect(await solidConnector.getDidOfClaim(ref1)).to.equal(webId)
  })

  it('should be able to read a public profile', async () => {
    const solidConnector = new SolidConnector()
    const value = await solidConnector.get(ref1)
    expect(value).to.equal('Bas Kaptijn')
  })

  it('should get an unauthorised exception when writing to a public profile (when unauthorised)', async () => {
    const solidConnector = new SolidConnector()
    await solidConnector.claim(webId, { 'http://xmlns.com/foaf/0.1/organisation': 'discipl' })
      .then((result) => {
        expect.fail(null, null, 'No exception raised when writing to pod unauthorised')
      })
      .catch((e) => {
        expect(e.message).to.equal('Web error: 401 (Unauthenticated) on PATCH of <https://datafluisteraar.solidweb.org/profile/card>')
      })
  })

  it('should be able to write to a public profile (when authorised)', async () => {
    const solidConnector = new SolidConnector()
    const session = await solidConnector.login() // Note currently requires a ~/.solid-auth-cli-config.json, see https://www.npmjs.com/package/solid-auth-cli
    const value = await solidConnector.claim(session.webId, { 'http://xmlns.com/foaf/0.1/organisation': 'discipl' })
    expect(value).to.equal(ref2)
    const value2 = await solidConnector.get(ref2)
    expect(value2).to.equal('discipl')
  })
})
