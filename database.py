import os
from google.cloud import firestore

# Initialiser Firestore
db = firestore.Client()

def link_profile(discord_id, lodestone_id):
    doc_ref = db.collection('profiles').document(str(discord_id))
    doc_ref.set({
        'discord_id': discord_id,
        'lodestone_id': lodestone_id,
        'last_login': None
    })

def get_linked_profile(discord_id):
    doc_ref = db.collection('profiles').document(str(discord_id))
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None

def update_profile_activity(lodestone_id, last_login):
    profiles_ref = db.collection('profiles')
    query = profiles_ref.where('lodestone_id', '==', lodestone_id)
    for profile in query.stream():
        profile.reference.update({'last_login': last_login})

def get_all_profiles():
    profiles_ref = db.collection('profiles')
    return [doc.to_dict() for doc in profiles_ref.stream()]

def get_profile_activity(lodestone_id):
    profiles_ref = db.collection('profiles')
    query = profiles_ref.where('lodestone_id', '==', lodestone_id)
    for profile in query.stream():
        return profile.to_dict().get('last_login')
    return None
