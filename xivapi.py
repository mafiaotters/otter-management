import requests
import os

XIVAPI_KEY = os.getenv('XIVAPI_KEY')

def fetch_lodestone_profile(lodestone_id):
    url = f'https://beta.xivapi.com/character/{lodestone_id}'
    headers = {'Authorization': f'Bearer {XIVAPI_KEY}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

def fetch_character_activity(lodestone_id):
    profile = fetch_lodestone_profile(lodestone_id)
    if profile:
        return profile['Character']['ActiveClassJob']
    return None
