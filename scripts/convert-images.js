import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const TARGETS = [
  { dir: 'src/assets', exts: ['.png', '.jpg', '.jpeg'] },
  { dir: 'src/components/Crew/crew_assets', exts: ['.jpg', '.jpeg'] },
]

function kb(bytes) {
  return (bytes / 1024).toFixed(1)
}

async function convertFile(inputPath, outputPath) {
  const before = await stat(inputPath)
  await sharp(inputPath).webp({ quality: 80, effort: 5 }).toFile(outputPath)
  const after = await stat(outputPath)
  console.log(
    `${path.relative(ROOT, inputPath)} (${kb(before.size)} KB) -> ${path.relative(ROOT, outputPath)} (${kb(after.size)} KB)`
  )
}

async function main() {
  for (const { dir, exts } of TARGETS) {
    const absDir = path.join(ROOT, dir)
    let entries
    try {
      entries = await readdir(absDir)
    } catch {
      console.warn(`Skip missing dir: ${dir}`)
      continue
    }

    for (const name of entries) {
      const ext = path.extname(name).toLowerCase()
      if (!exts.includes(ext)) continue

      const inputPath = path.join(absDir, name)
      const base = path.basename(name, ext)
      const outputPath = path.join(absDir, `${base}.webp`)

      await convertFile(inputPath, outputPath)
    }
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  globalThis.process.exit(1)
})
