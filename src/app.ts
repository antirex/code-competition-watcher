import { Telegraf } from 'telegraf'
import { upcomingContestsCodeforces, runningContestsCodeforces } from './api/codeforces/codeforces'
import { upcomingContestsCodeChef } from './api/codechef/codechef'
import { upcomingContestsAtcoder } from './api/atcoder/atcoder'
import { getCodeforcesString, getAtcoderString, codechefFilterUpcoming, codechefFilterRunning } from './api/apiConstants'
import { constants } from './constants'
import dotenv from 'dotenv'
import Extra from 'telegraf/extra'
dotenv.config()

let bot
if (process.env.TOKEN != null) {
  bot = new Telegraf(process.env.TOKEN)
} else {
  process.exit(2)
}

bot.start((ctx) => ctx.reply(constants.startMessage))
bot.help((ctx) => ctx.reply(constants.helpMessage))

// RESULTS
// For Codeforces:
bot.hears('0', (ctx) => {
  const userName = ctx.from.first_name
  const helloText = '<i>Hello</i>, ' + userName + '!'
  return helloText
})
bot.command('cf_upcoming', async (ctx) => {
  const result = await upcomingContestsCodeforces()
  let s = ''
  for (const i of result.result) {
    s = s + '\n\n' + getCodeforcesString(i.name, i.id, i.startTimeSeconds)
  }
  if (s === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.codeForcesReplyUpcoming + s, Extra.HTML())
  }
})

bot.command('cf_running', async (ctx) => {
  const result = await runningContestsCodeforces()
  let s = ''
  for (const i of result.result) {
    s = s + '\n\n' + getCodeforcesString(i.name, i.id, i.startTimeSeconds)
  }
  if (s === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.codeForcesReplyRunning + s, Extra.HTML())
  }
})

// For Codechef:
bot.command('cc_upcoming', async (ctx) => {
  const events = await upcomingContestsCodeChef()
  let s = ''
  for (const i of events.result) {
    const str = codechefFilterUpcoming(i)
    if (str !== 'Not valid') {
      s = s + '\n\n' + codechefFilterUpcoming(i)
    }
  }
  if (s === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.codeChefReplyUpcoming + s, Extra.HTML())
  }
})

bot.command('cc_running', async (ctx) => {
  const events = await upcomingContestsCodeChef()
  let s = ''
  for (const i of events.result) {
    const str = codechefFilterRunning(i)
    if (str !== 'Not valid') {
      s = s + '\n\n' + codechefFilterRunning(i)
    }
  }
  if (s === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.codeChefReplyRunning + s, Extra.HTML())
  }
})

// For Atcoder:
bot.command('ac_contests', async (ctx) => {
  const events = await upcomingContestsAtcoder()
  let s = ''
  for (const i of events.result) {
    s = s + '\n\n' + getAtcoderString(i.title, i.id, i.startTimeSeconds)
  }
  if (s === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.atCoderReply + s, Extra.HTML())
  }
})

// Misc all
bot.command('upcoming', async (ctx) => {
  const eventsCF = await upcomingContestsCodeforces()
  const eventsCC = await upcomingContestsCodeChef()
  const eventsAC = await upcomingContestsAtcoder()
  let resultString = ''
  for (const i of eventsCF.result) {
    resultString = resultString + '\n\n' + getCodeforcesString(i.name, i.id, i.startTimeSeconds)
  }
  for (const i of eventsCC.result) {
    const str = codechefFilterUpcoming(i)
    if (str !== 'Not valid') {
      resultString = resultString + '\n\n' + codechefFilterUpcoming(i)
    }
  }
  for (const i of eventsAC.result) {
    resultString = resultString + '\n\n' + getAtcoderString(i.title, i.id, i.startTimeSeconds)
  }
  if (resultString === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.miscReply + resultString, Extra.HTML())
  }
})

bot.command('running', async (ctx) => {
  const eventsCF = await runningContestsCodeforces()
  const eventsCC = await upcomingContestsCodeChef()
  let resultString = ''
  for (const i of eventsCF.result) {
    resultString = resultString + '\n\n' + getCodeforcesString(i.name, i.id, i.startTimeSeconds)
  }
  for (const i of eventsCC.result) {
    const str = codechefFilterRunning(i)
    if (str !== 'Not valid') {
      resultString = resultString + '\n\n' + codechefFilterRunning(i)
    }
  }
  if (resultString === '') {
    ctx.reply(constants.noContestMessage)
  } else {
    ctx.reply(constants.miscReply + resultString, Extra.HTML())
  }
})

// Editorial
bot.command('sites', (ctx) => ctx.reply(constants.sitesMessage))

// Launching the bot
bot.launch()
