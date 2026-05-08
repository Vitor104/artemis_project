/**
 * Generates compressed placeholder MP3s for immersive audio (keep total under ~2MB for LCP).
 * Run: node scripts/gen-audio.mjs
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegStatic from 'ffmpeg-static'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'src', 'assets', 'audio')
const ffmpeg = ffmpegStatic

mkdirSync(outDir, { recursive: true })

function run(args) {
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

// Ambient drone (~8s loop, mono, low bitrate)
run([
  '-y',
  '-f',
  'lavfi',
  '-i',
  'sine=frequency=52:sample_rate=22050:duration=8',
  '-ac',
  '1',
  '-ar',
  '22050',
  '-b:a',
  '48k',
  join(outDir, 'drone.mp3'),
])

// Short “radio burst” placeholders (noise snippets)
for (let i = 1; i <= 3; i += 1) {
  run([
    '-y',
    '-f',
    'lavfi',
    '-i',
    `anoisesrc=duration=${1.2 + i * 0.15}:color=pink:a=0.08`,
    '-ac',
    '1',
    '-ar',
    '22050',
    '-b:a',
    '56k',
    join(outDir, `radio${i}.mp3`),
  ])
}

// Chapter IV contextual clip (slightly longer burst)
run([
  '-y',
  '-f',
  'lavfi',
  '-i',
  'anoisesrc=duration=2.4:color=brown:a=0.06',
  '-ac',
  '1',
  '-ar',
  '22050',
  '-b:a',
  '56k',
  join(outDir, 'transmission-ch4.mp3'),
])

console.log('Audio assets written to', outDir)
