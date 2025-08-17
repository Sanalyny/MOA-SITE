import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = '8170264095:AAEHA7xJki-OQeByHxD5Q13mBfVDgvIvMc0';
const MOD_CHAT = '@moa_request_moderation';
const ADMIN_ID = 4855572343; // твой ID для админки
const bot = new Telegraf(BOT_TOKEN);

const pendingVacancies = new Map();
const waitingForReason = new Map();
const userCooldowns = new Map(); // userId -> timestamp

const COOLDOWN_MS = 60 * 60 * 1000; // 1 час

bot.on('message', async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (!text) return;

    const fromId = ctx.from.id;
    const chatId = ctx.chat.id;
    const now = Date.now();

    // Проверка колдауна
    if (ctx.chat.type === 'private') {
        const lastTime = userCooldowns.get(fromId) || 0;
        if (now - lastTime < COOLDOWN_MS) {
            const remaining = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 60000);
            await ctx.reply(`⏳ Вы сможете отправить новую вакансию через ${remaining} мин.`);
            return;
        }
    }

    // 1) Если модератор в режиме ожидания причины
    if (waitingForReason.has(fromId)) {
        const wait = waitingForReason.get(fromId);
        if (ctx.chat.id === wait.modChatId || ctx.chat.type === 'private') {
            const vacancy = pendingVacancies.get(wait.vacancyId);
            if (vacancy && vacancy.status === 'awaiting_reason') {
                const reason = text;
                try {
                    await bot.telegram.sendMessage(vacancy.userId, `🚫 Ваша вакансия отклонена.\nПричина: ${reason}`);
                } catch { }
                try {
                    const newText = `${vacancy.text}\n\n❌ Отклонено\nПричина: ${reason}`;
                    await bot.telegram.editMessageText(wait.modChatId, wait.modMessageId, undefined, newText);
                } catch { }
                pendingVacancies.delete(wait.vacancyId);
                waitingForReason.delete(fromId);
                await ctx.reply('✅ Причина отправлена автору вакансии.');
            } else {
                waitingForReason.delete(fromId);
                await ctx.reply('❗ Заявка уже обработана или не найдена.');
            }
            return;
        }
    }

    // 2) Приём вакансий в ЛС
    if (ctx.chat.type === 'private') {
        const vacancyText = text;
        const vacancyId = Date.now().toString();

        try {
            const sent = await ctx.telegram.sendMessage(
                MOD_CHAT,
                `📄 Новая вакансия (ID: ${vacancyId}):\n\n${vacancyText}`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback('✅ Одобрить', `approve_${vacancyId}`),
                        Markup.button.callback('❌ Отклонить', `reject_${vacancyId}`)
                    ]
                ])
            );

            pendingVacancies.set(vacancyId, {
                userId: fromId,
                text: vacancyText,
                modChatId: sent.chat.id,
                modMessageId: sent.message_id,
                status: 'pending'
            });

            userCooldowns.set(fromId, now); // Записываем время отправки

            await ctx.reply('✅ Вакансия получена и отправлена на модерацию.');
        } catch (err) {
            await ctx.reply('Ошибка при отправке вакансии на модерацию.');
        }
        return;
    }
});

bot.action(/approve_(.+)/, async (ctx) => {
    const vacancyId = ctx.match[1];
    const vacancy = pendingVacancies.get(vacancyId);
    if (!vacancy) return ctx.answerCbQuery('Заявка не найдена или уже обработана');

    try {
        await bot.telegram.sendMessage(vacancy.userId, '🎉 Ваша вакансия одобрена и опубликована!');
        const newText = `${vacancy.text}\n\n✅ Одобрено модератором @${ctx.from.username || ctx.from.first_name}`;
        await bot.telegram.editMessageText(vacancy.modChatId, vacancy.modMessageId, undefined, newText);
        pendingVacancies.delete(vacancyId);
        await ctx.answerCbQuery('Вакансия одобрена');
    } catch {
        await ctx.answerCbQuery('Ошибка при обработке.');
    }
});

bot.action(/reject_(.+)/, async (ctx) => {
    const vacancyId = ctx.match[1];
    const vacancy = pendingVacancies.get(vacancyId);
    if (!vacancy) return ctx.answerCbQuery('Заявка не найдена или уже обработана');

    vacancy.status = 'awaiting_reason';
    pendingVacancies.set(vacancyId, vacancy);

    const moderatorId = ctx.from.id;
    waitingForReason.set(moderatorId, {
        vacancyId,
        modChatId: ctx.chat.id,
        modMessageId: ctx.update.callback_query.message.message_id
    });

    await ctx.reply('✏️ Напишите причину отказа в этом чате (или в личку боту).');
    await ctx.answerCbQuery('Ожидаю причину отказа');
});

bot.launch();
console.log('🤖 Бот запущен с колдауном 1 час.');
