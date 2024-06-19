from discord.ext import commands

def check_admin(ctx):
    return ctx.author.guild_permissions.administrator
