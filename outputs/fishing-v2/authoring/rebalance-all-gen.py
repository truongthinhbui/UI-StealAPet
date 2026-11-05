import json,pathlib,math
p=pathlib.Path('D:/revival-prototype-ui-update/assets/gen-config.js');g=json.loads(p.read_text(encoding='utf8').split('window.GenConfig = ',1)[1].rsplit(';',1)[0]);g['version']='merged-gen-4-all-rarities'
budgets=[{'basic':845000,'uncommon':150000,'advanced':4500,'rare':450,'epic':45,'exclusive':5},{'basic':805000,'uncommon':185000,'advanced':9000,'rare':850,'epic':130,'exclusive':20},{'basic':765000,'uncommon':220000,'advanced':13000,'rare':1700,'epic':250,'exclusive':50},{'basic':725000,'uncommon':255000,'advanced':17000,'rare':2600,'epic':350,'exclusive':50},{'basic':685000,'uncommon':285000,'advanced':24000,'rare':4800,'epic':1000,'exclusive':200}]
shares={'basic':[.65,.35],'uncommon':[.66,.30,.04],'advanced':[.45,.30,.15,.10],'rare':[.40,.25,.15,.12,.08],'epic':[.25,.22,.20,.18,.15],'exclusive':[.60,.40]}
for profile,budget in zip(g['rebirthProfiles'],budgets):
 weights={}
 for tier,total in budget.items():
  entries=[x for x in g['catalog'] if x['tier']==tier];raw=[total*s for s in shares[tier]];values=[int(math.floor(v)) for v in raw]
  for i in sorted(range(len(values)),key=lambda i:raw[i]-values[i],reverse=True)[:total-sum(values)]:values[i]+=1
  for gen,value in zip(entries,values):weights[gen['id']]=value
 assert sum(weights.values())==1000000 and min(weights.values())>0
 profile['weights']=weights
for gen in g['catalog']:gen['fishingEnabled']=True;gen['fishingWeight']=g['rebirthProfiles'][0]['weights'][gen['id']]
g['rarityBudgetByBand']=budgets
g['notes']=['All 21 Gen may drop in Fishing. Rare Gen have positive, very small weights.','Weights are authored Fishing balance, not item application chances.','Rebirth changes type weights, not tap score or guaranteed rarity.','Item prices and effect stacking gaps remain source metadata; they do not disable authored Fishing drops.']
p.write_text('// Unified Gen v4: all rarities can drop, with strictly lower individual weights at higher rarity tiers.\nwindow.GenConfig = '+json.dumps(g,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
for b,prof in zip(budgets,g['rebirthProfiles']):print(prof['label'],b,'Galaxy',prof['weights']['cosmic'],'Aurora',prof['weights']['aurora'])
