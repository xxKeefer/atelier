import { readFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const utilities = readFileSync(`${root}/src/utilities.css`, 'utf-8')

appendFileSync(`${root}/dist/theme.css`, `\n${utilities}`)
