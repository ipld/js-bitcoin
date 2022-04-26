import { bytes } from 'multiformats'

const cache = {}

export async function loadFixtureData (name) {
  if (!cache[name]) {
    const [data, rawHex] = await Promise.all([
      (async () => (await import(`./fixtures/${name}.json`)).default)(),
      (async () => (await import(`!!raw-loader!./fixtures/${name}.hex`)).default)()
    ])
    cache[name] = { data, raw: bytes.fromHex(rawHex) }
  }
  return cache[name]
}
