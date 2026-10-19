#!/usr/bin/env node
/**
 * Email delivery check — run from the project root:
 *
 *   npm run mail:check          # configuration + DNS + port + TLS + sign-in
 *   npm run mail:check -- --send   # …and send a real test message
 *
 * Reads the same .env as the server, so it is the fastest way to prove the
 * GoDaddy (or any other) mailbox credentials before opening the website.
 * The password is never printed.
 */
import 'dotenv/config'
import { mailStatus, diagnoseMail, resetTransport } from '../src/lib/notify.js'
import { mailConfig } from '../src/lib/mail-config.js'

const wantSend = process.argv.includes('--send')
const bold = (value) => `\x1b[1m${value}\x1b[0m`
const dim = (value) => `\x1b[2m${value}\x1b[0m`
const green = (value) => `\x1b[32m${value}\x1b[0m`
const red = (value) => `\x1b[31m${value}\x1b[0m`
const amber = (value) => `\x1b[33m${value}\x1b[0m`

const status = mailStatus()
const config = mailConfig()

console.log(`\n${bold('Ananta — email delivery check')}\n`)

const row = (label, value) => console.log(`  ${label.padEnd(18)} ${value || dim('—')}`)
row('Status', status.configured ? green('configured') : red('not configured'))
row('Provider', status.providerLabel || status.provider || dim('not detected'))
row('Mail server', status.host ? `${status.host}:${status.port} ${status.secure ? '(SSL)' : '(STARTTLS)'}` : '')
row('Signs in as', status.user)
row('Password', config.pass ? dim(config.passwordPlaceholder ? 'placeholder text — replace it!' : `set (${config.pass.length} characters)`) : red('missing'))
row('From', status.from)
row('Delivered to', (status.to || []).join(', '))
row('Source', status.source)
if (config.detection?.mx) row('Domain MX', config.detection.mx.join(', '))
console.log('')

for (const warning of status.warnings || []) console.log(`${amber('▲')} ${warning.message}\n  ${dim(warning.hint || '')}\n`)
for (const problem of status.problems || []) console.log(`${red('✖')} ${problem.message}\n  ${dim(problem.hint || '')}\n`)

if (status.problems?.length) {
  console.log(red('\nFix the items above in .env, restart, then run this check again.\n'))
  process.exit(1)
}

const report = await diagnoseMail({ sendTest: wantSend })

console.log(bold(wantSend ? 'Running full check and test send…' : 'Running connection check…'))
for (const step of report.steps) {
  const mark = step.status === 'pass' ? green('✔') : step.status === 'fail' ? red('✖') : step.status === 'warn' ? amber('▲') : dim('•')
  console.log(`\n${mark} ${bold(step.label)}`)
  if (step.detail) console.log(`  ${step.detail}`)
  if (step.hint && step.status !== 'pass') console.log(`  ${dim(step.hint)}`)
}

console.log('')
if (report.ok) {
  console.log(green(bold(wantSend ? 'Everything works — the test message was accepted by the mail server.' : 'Everything works — the mailbox accepted the sign-in.')))
  if (wantSend) console.log(dim('If it is not in the inbox within a minute, check the spam folder and the GoDaddy quarantine.'))
} else {
  console.log(red(bold(`Not delivering: ${report.summary}`)))
}

resetTransport()
process.exit(report.ok ? 0 : 1)
