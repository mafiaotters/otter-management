import sqlite3
import os
from datetime import datetime

DATABASE_URL = os.getenv('DATABASE_URL')

def get_db():
    conn = sqlite3.connect(DATABASE_URL)
    return conn

def link_profile(discord_id, lodestone_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO profiles (discord_id, lodestone_id) VALUES (?, ?)", (discord_id, lodestone_id))
    conn.commit()
    conn.close()

def get_linked_profile(discord_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT lodestone_id FROM profiles WHERE discord_id = ?", (discord_id,))
    profile = c.fetchone()
    conn.close()
    return profile

def update_profile_activity(lodestone_id, last_login):
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE profiles SET last_login = ? WHERE lodestone_id = ?", (last_login, lodestone_id))
    conn.commit()
    conn.close()

def get_all_profiles():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM profiles")
    profiles = c.fetchall()
    conn.close()
    return profiles

def get_profile_activity(lodestone_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT last_login FROM profiles WHERE lodestone_id = ?", (lodestone_id,))
    activity = c.fetchone()
    conn.close()
    return activity
