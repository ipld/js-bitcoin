const fs = await import('fs')
const path = await import('path')
const { fileURLToPath } = await import('url')

const cache = {}

export async function loadFixtureData (name) {
  if (!cache[name]) {
    const [data, rawHex] = await Promise.all([
      (async () => JSON.parse(await fs.promises.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), `fixtures/${name}.json`), 'utf8')))(),
      fs.promises.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), `fixtures/${name}.hex`), 'ascii')
    ])

    cache[name] = { data, raw: Buffer.from(rawHex, 'hex') }
  }
  return cache[name]
}
