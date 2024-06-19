import discord

def setup_logger(bot, log_channel_id):
    logger = discord.utils.get(bot.get_all_channels(), id=log_channel_id)
    if not logger:
        raise Exception(f"Log channel with ID {log_channel_id} not found")
    return logger

async def log_event(bot, message):
    logger = setup_logger(bot, int(os.getenv('LOG_CHANNEL_ID')))
    await logger.send(message)
