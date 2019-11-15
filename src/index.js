
import { BaseConnector } from '@discipl/core-baseconnector'
import auth from 'solid-auth-cli'
import { fetchDocument } from 'tripledoc'

class SolidConnector extends BaseConnector {
  getName () {
    return 'solid'
  }

  /* convenience method
   * see https://www.npmjs.com/package/solid-auth-cli
   */
  async login () {
    let session = await auth.currentSession()
    if (!session) session = await auth.login()
    return session
  }

  async getDidOfClaim (reference) {
    return reference.split('::')[0]
  }

  async getLatestClaim (ssid) {
    // get latest claim for webid
    throw new TypeError('getLatestClaim is not implemented')
  }

  async newIdentity () {
    throw new TypeError('newIdentity is not implemented.')
  }

  async claim (ssid, data) {
    const predicate = Object.keys(data)[0]
    console.log(ssid)
    const profileDoc = await fetchDocument(ssid)
    const profile = profileDoc.getSubject(ssid)
    profile.addLiteral(predicate, data[predicate])
    await profileDoc.save()
    return ssid + '::' + predicate
  }

  async get (reference, ssid = null) {
    const webId = await this.getDidOfClaim(reference)
    const profileDoc = await fetchDocument(webId)
    const profile = profileDoc.getSubject(webId)
    return profile.getString(reference.split('::')[1])
  }

  async observe (ssid) {
    throw new TypeError('Subscribe is not implemented')
  }
}

export default SolidConnector
