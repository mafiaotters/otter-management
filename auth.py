from flask import Flask, redirect, url_for, session
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config["DISCORD_CLIENT_ID"] = os.getenv("DISCORD_CLIENT_ID")
app.config["DISCORD_CLIENT_SECRET"] = os.getenv("DISCORD_CLIENT_SECRET")
app.config["DISCORD_REDIRECT_URI"] = os.getenv("DISCORD_REDIRECT_URI")
app.config["DISCORD_BOT_TOKEN"] = os.getenv("DISCORD_TOKEN")

discord = DiscordOAuth2Session(app)

@app.route("/")
def home():
    return "Welcome to the Discord OAuth2 integration."

@app.route("/login/")
def login():
    return discord.create_session()

@app.route("/callback/")
def callback():
    discord.callback()
    user = discord.fetch_user()
    # Store user details in session or database
    return redirect(url_for(".profile"))

@app.route("/profile/")
@requires_authorization
def profile():
    user = discord.fetch_user()
    return f"""
    <h1>Logged in as</h1>
    <ul>
      <li>ID: {user.id}</li>
      <li>Name: {user.name}</li>
    </ul>
    <a href="{url_for('.logout')}">Logout</a>
    """

@app.route("/logout/")
def logout():
    discord.revoke()
    return redirect(url_for(".home"))

if __name__ == "__main__":
    app.run()
