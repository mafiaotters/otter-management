import urllib3, json, time, math, argparse
from os.path import exists

if exists("ids.json"):
    with open("ids.json") as f:
        api_id = json.load(f)
        api_token = '&private_key={}'.format(api_id['private_key'])
else:
    api_token = ''

with open("settings.json") as f:
    setting = json.load(f)

http = urllib3.PoolManager()

parser = argparse.ArgumentParser(description='Mets à jour la liste des hauts faits')
parser.add_argument('-fc', '--free-company', help='Identifiant Lodestone de la compagnie libre', required=False, default='Loutres')
args = parser.parse_args()
fcId = setting['supportedFc'][args.free_company]

r = http.request("GET", "http://xivapi.com/FreeCompany/%s?data=FCM&columns=FreeCompanyMembers.*.ID,FreeCompanyMembers.*.Name%s" % (fcId, api_token))

data = r.data.decode('utf-8')
print(data)
members = json.loads(data)["FreeCompanyMembers"]

print('{} membres trouvé pour la compagnie libre' .format(len(members)))

public = 0
private = list()

processedAchievement = dict()
for section in setting['Section']:
    processedAchievement[section] = dict()

for hf in setting['AchievementsList']:
    section = hf['Extension'] + '-' + hf['Type']
    processedAchievement[section][hf['ID']] = {'name':hf['Name'], 'type': hf['Type'], 'winners' : [], 'wincount' : 0, 'try': len(members)}

for m in members:
    print('processing member {}'.format(m['Name']))
    r = http.request("GET", "http://xivapi.com/character/%s?data=AC&columns=Achievements.List.*.ID%s" % (m["ID"], api_token))

    if (r.status != 200):
        print('Error getting info for member {}'.format(m['Name']))
        continue
    
    memberAchievement = json.loads(r.data.decode('utf-8'))["Achievements"]["List"]

    if (len(memberAchievement) > 0):
        flatList = []
        for hf in memberAchievement:
            flatList.append(hf['ID']) 
        
        public += 1
        print('member {} has public achievement'.format(m['Name']))
        for hf in setting["AchievementsList"]:
            if hf['ID'] in flatList:
                section = hf['Extension'] + '-' + hf['Type']
                processedAchievement[section][hf['ID']]['winners'].append({'name':m['Name']})
                processedAchievement[section][hf['ID']]['wincount'] += 1
    else:
        private.append(m['Name'])

    time.sleep(0.05)

for hf in setting["AchievementsList"]:
    section = hf['Extension'] + '-' + hf['Type']
    processedAchievement[section][hf['ID']]['try'] = public
    processedAchievement[section][hf['ID']]['winrate'] = math.floor(processedAchievement[section][hf['ID']]['wincount'] / processedAchievement[section][hf['ID']]['try']*100)

print('{} membres ont leur succès public' . format(public))
print('Les membres avec leurs succès privés sont les suivant : {}'.format(str(private).strip('[]')))
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(processedAchievement, f, ensure_ascii=False, indent=4)