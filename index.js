const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5851585696:AAHj0IVzU2p-kBlBr_SKTZ6_SA_lJop20cE';
const bot = new TelegramApi(token, { polling: true });
const chats = {};

bot.setMyCommands([
  { command: '/start', description: 'Приветствую' },
  { command: '/info', description: 'Получить информацию о пользователе' },
  { command: '/game', description: 'Играть в игру  УГАДАЙ ЧИСЛО' },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Сейчас я загадаю число от 1 до 9, а ты угадывай лох'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Все, загадал, можешь отгадывать', gameOptions);
};

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text == '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/9.webp'
      );
      return bot.sendMessage(chatId, `Добро пожаловать ${msg.chat}`);
    }
    if (text == '/info') {
      return bot.sendMessage(chatId, `Ты написал мне ${text}`);
    }
    if (text == '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
  });
  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == '/again') {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${data}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
