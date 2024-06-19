import ftplib
import os
import datetime
from database import get_all_profiles, get_profile_activity

FTP_HOST = os.getenv('FTP_HOST')
FTP_USER = os.getenv('FTP_USER')
FTP_PASS = os.getenv('FTP_PASS')

def update_site():
    profiles = get_all_profiles()
    data = []
    for profile in profiles:
        activity = get_profile_activity(profile['lodestone_id'])
        data.append({
            'discord_id': profile['discord_id'],
            'lodestone_id': profile['lodestone_id'],
            'activity': activity
        })
    # Ici, vous formatez les données et les téléchargez via FTP
    with ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS) as ftp:
        # Exemple de téléchargement de fichier
        with open('local_file.html', 'rb') as file:
            ftp.storbinary('STOR remote_file.html', file)

def mark_retired():
    profiles = get_all_profiles()
    for profile in profiles:
        activity = get_profile_activity(profile['lodestone_id'])
        if activity and (datetime.now() - activity).days > 30:  # exemple de 30 jours
            # Mettez à jour le statut du profil à retraité
            pass
