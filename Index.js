const mySecret = process.env['token'];
const keepAlive = require("./server.js");
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const Btc = require('./coin//btc.js');
const Eth = require('./coin//eth.js');
const Xrp = require('./coin//xrp.js');
const Scrt = require('./coin/scrt.js');
const Idex = require('./coin/idex.js')

const botacin = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

botacin.once(Events.ClientReady, Client => {
  console.log(`Ready Boss! ${Client.user.tag}`);
});


const btc5 = new Btc('5m');
const btc15 = new Btc('15m');
const btc30 = new Btc('30m');
const btc1h = new Btc('1h');
const btc1d = new Btc('1d');
const eth15 = new Eth('15m');
const eth30 = new Eth('30m');
const eth1h = new Eth('1h');
const xrp15 = new Xrp('15m');
const xrp30 = new Xrp('30m');
const xrp1h = new Xrp('1h');
const scrt5 = new Scrt('5m');
const scrt15 = new Scrt('15m');
const scrt30 = new Scrt('30m');
const scrt1h = new Scrt('1h');
const idex5 = new Idex('5m');
const idex30 = new Idex('30m');
const idex15 = new Idex('15m');
const idex1h = new Idex('1h');

const notificationStatus = {
  btc5: false,
  btc15: false,
  btc30: false,
  btc1h: false,
  btc1d: false,
  eth15: false,
  eth30: false,
  eth1h: false,
  xrp15: false,
  xrp30: false,
  xrp1h: false,
  scrt5: false,
  scrt30: false,
  scrt15: false,
  scrt1h: false,
  idex5: false,
  idex30: false,
  idex15: false,
  idex1h: false,
};

function sendNotificationOnce(key, message) {
  if (!notificationStatus[key]) {
    sendNotification(message);
    notificationStatus[key] = true;
  }
};

async function crossRsi(coinObj, coinName, timeFrame, key) {
  const rsiData = await coinObj.getRsiCross();
  if (rsiData.overBought === true) {
    sendNotificationOnce(key, `${coinName} RSI14TF ${timeFrame} overbought dengan nilai ${rsiData.rsiVal}`);
  } else if (rsiData.overSold === true) {
    sendNotificationOnce(key, `${coinName} RSI14 TF ${timeFrame} oversold dengan nilai ${rsiData.rsiVal}`);
  } else {
    notificationStatus[key] = false;
  };
};

async function runCross(coinObj, coinName, timeFrame, period1, period2, period3, key) {
  let fastSma = await coinObj.getSma(period1);
  let midleSma = await coinObj.getSma(period2);
  let slowSma = await coinObj.getSma(period3);
  let percent = slowSma[slowSma.length - 1] * 0.0005;
  
  if (fastSma[fastSma.length - 1] >= midleSma[midleSma.length - 1] && fastSma[fastSma.length - 3] < midleSma[midleSma.length - 3] && fastSma[fastSma.length - 1] <= midleSma[midleSma.length - 1] + percent) {
    sendNotificationOnce(key, `${coinName} Golden cross MA${period1} & MA${period2} TF ${timeFrame}`);
  } else {
    notificationStatus[key] = false;
  };
  
  if (fastSma[fastSma.length - 1] <= midleSma[midleSma.length - 1] && fastSma[fastSma.length - 3] > midleSma[midleSma.length - 3] && fastSma[fastSma.length - 1] <= midleSma[midleSma.length - 1] - percent) {
    sendNotificationOnce(key, `${coinName} Death cross MA${period1} & MA${period2} TF ${timeFrame}`);
  } else {
    notificationStatus[key] = false;
  };

  if (midleSma[midleSma.length - 1] >= slowSma[slowSma.length - 1] && midleSma[midleSma.length - 3] < slowSma[slowSma.length - 3] && midleSma[midleSma.length - 1] <= slowSma[slowSma.length - 1] + percent) {
    sendNotificationOnce(key, `${coinName} Golden cross MA${period1} & MA${period2} TF ${timeFrame}`);
  } else {
    notificationStatus[key] = false;
  };

  if (midleSma[midleSma.length - 1] <= slowSma[slowSma.length - 1] && midleSma[midleSma.length - 3] > slowSma[slowSma.length - 3] && midleSma[midleSma.length - 1] <= slowSma[slowSma.length - 1] - percent) {
    sendNotificationOnce(key, `${coinName} Death cross MA${period1} & MA${period2} TF ${timeFrame}`);
  } else {
    notificationStatus[key] = false;
  };
};

function sendNotification(message) {
  const serverId = '888420992882470923';
  const channelId = '1152610263695118468';

  const server = botacin.guilds.cache.get(serverId);
  //if (!server) return console.error('Server tidak ditemukan.');

  const channel = server.channels.cache.get(channelId);
  //if (!channel) return console.error('Channel tidak ditemukan.');

  channel.send(message);
};

async function detec5m() {
  await crossRsi(btc5, 'BTC', '5m', 'btc5'),
  await runCross(btc5, 'BTC', '5m', 7, 12, 24, 'btc5'),
  await crossRsi(idex5, 'IDEX', '5m', 'idex5'),
  await runCross(idex5, 'IDEX', '5m', 7, 12, 24, 'idex5'),
  await crossRsi(scrt5, 'SCRT', '5m', 'scrt5')
  await runCross(scrt5, 'SCRT', '5m', 7, 12, 24, 'scrt5')
};

async function detec15m() {
  await crossRsi(btc15, 'BTC', '15m', 'btc15'),
  await crossRsi(eth15, 'ETH', '15m', 'eth15'),
  await crossRsi(xrp15, 'XRP', '15m', 'xrp15'),
  await crossRsi(scrt15, 'SCRT', '15m', 'scrt15'),
  await crossRsi(idex15, 'IDEX', '15m', 'idex15'), 
  await runCross(btc15, 'BTC', '15m', 7, 12, 24, 'btc15'),
  await runCross(scrt15, 'SCRT', '15m', 7, 12, 24, 'scrt15'),
  await runCross(idex15, 'IDEX', '15m', 7, 12, 24, 'idex15')
};

async function detect30() { 
  await crossRsi(btc30, 'BTC', '30m', 'btc30'),
  await crossRsi(eth30, 'ETH', '30m', 'eth30'),
  await crossRsi(xrp30, 'XRP', '30m', 'xrp30'),
  await crossRsi(scrt30, 'SCRT', '30m', 'scrt30'),
  await crossRsi(idex30, 'IDEX', '30m', 'idex30')
  await runCross(btc30, 'BTC', '30m', 7, 12, 24, 'btc30'),
  await runCross(scrt30, 'SCRT', '30m', 7, 12, 24, 'scrt30'),
  await runCross(idex30, 'IDEX', '30m', 7, 12, 24, 'idex15')
};

async function detect1h() { 
  await crossRsi(btc1h, 'BTC', '1h', 'btc1h'),
  await crossRsi(eth1h, 'ETH', '1h', 'eth1h'),
  await crossRsi(scrt1h, 'SCRT', '1h', 'scrt1h'),
  await crossRsi(idex1h, 'IDEX', '1h', 'idex1h'),
  await crossRsi(xrp1h, 'XRP', '1h', 'xrp1h'),
  await runCross(btc1h, 'BTC', '1h', 7, 12, 24, 'btc1h'),
  await runCross(scrt1h, 'SCRT', '1h', 7, 12, 24, 'scrt1h'),
  await runCross(idex1h, 'IDEX', '1h', 7, 12, 24, 'idex1h')
};

async function detect1d() {  
  await crossRsi(btc1d, 'BTC', '1d', 'btc1d')
};

setInterval(() => {
  const time = new Date();
  const second = time.getSeconds();
  const hour = time.getHours();
  const minute = time.getMinutes();
  //console.log(hour, minute, second);
  
  if (second === 0){
    detec5m();
  };
  if (minute === 15) {
    detec15m();
  };
  if (minute === 30) {
     detect30();
  };
  if (minute === 0 && second === 5){
     detect1h();
  };
  if (hour === 0 && second === 7) {
    detect1d();
  };
}, 1000);

keepAlive();
botacin.login(mySecret);
