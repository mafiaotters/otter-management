import os
import discord
from discord.ext import commands
from xivapi import fetch_lodestone_profile, fetch_character_activity
from site_update import update_site, mark_retired
from database import link_profile, get_linked_profile, update_profile_activity
from logger import setup_logger, log_event
from security import check_admin

intents = discord.Intents.default()
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)
log_channel_id = int(os.getenv('LOG_CHANNEL_ID'))

@bot.event
async def on_ready():
    setup_logger(bot, log_channel_id)
    print(f'Logged in as {bot.user}')

@bot.command()
@commands.check(check_admin)
async def link(ctx, discord_id: int, lodestone_id: str):
    profile = fetch_lodestone_profile(lodestone_id)
    if profile:
        link_profile(discord_id, lodestone_id)
        await ctx.send(f'Profile {lodestone_id} linked successfully for user {discord_id}!')
    else:
        await ctx.send('Invalid Lodestone ID.')

@bot.command()
@commands.check(check_admin)
async def update(ctx):
    update_site()
    await ctx.send('Site updated successfully!')

@bot.event
async def on_member_update(before, after):
    if before.roles != after.roles:
        linked_profile = get_linked_profile(after.id)
        if linked_profile:
            update_site()
            await log_event(bot, f'Profile updated for {after.name}')

async def periodic_activity_check():
    await bot.wait_until_ready()
    while not bot.is_closed():
        mark_retired()
        await log_event(bot, 'Retirement status updated based on activity')
        await asyncio.sleep(86400)  # Check once a day

bot.loop.create_task(periodic_activity_check())
bot.run(os.getenv('DISCORD_TOKEN'))
