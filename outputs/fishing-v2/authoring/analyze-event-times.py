import json,math,openpyxl,warnings
from pathlib import Path
warnings.filterwarnings('ignore')
r=json.loads(Path('reports/apex-webbed-analysis.json').read_text(encoding='utf-8'));w=openpyxl.load_workbook('C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx',data_only=True)
t=0;windows=[]
for row in w['Weather Waves'].iter_rows(min_row=3,max_row=27):
 duration=float(row[2].value)
 if row[3].value in ['HighTide','HeavyRain']:windows.append({'weather':row[3].value,'start':t,'end':t+duration,'casts':int(duration*6)})
 t+=duration
out={'cycleMinutes':t,'fishingWindows':windows,'castsPerCycle':sum(x['casts'] for x in windows),'fishing':[]}
for x in r['fishing']:
 p=x['apexWebPerCastGold'];casts=1/p;elapsed=casts*t/out['castsPerCycle'];apexelapsed=t/(out['castsPerCycle']*x['apexPerCast']);out['fishing'].append({**x,'activeHours':casts/360,'elapsedHours24h':elapsed/60,'elapsedYears24h':elapsed/60/24/365,'daysAt1HourPerDay':elapsed/60,'apexOnlyElapsedHours24h':apexelapsed/60})
s=w['MoleDigging'];apex=[]
for c in range(2,7):
 total=sum(float(s.cell(r,c).value or 0) for r in range(2,37));a=sum(float(s.cell(r,c).value or 0) for r in range(2,37) if s.cell(r,9).value=='APEX');apex.append(a/total)
spot=[.15,.25,.30,.22,.08];cum=0;best=[]
for p in spot:prev=cum;cum+=p;best.append(cum**5-prev**5)
q=sum(a*b for a,b in zip(apex,best));out['dig']={'rebirth':'R19+','bestOfFiveRarity':best,'apexPerPaidSpotByRarity':apex,'apexPerBestScan':q,'meanDigsToApexNoPity':1/q,'digEventsPerCycle':7,'paidDigsPerEvent':3,'elapsedHoursNoPity':1/q*t/21/60}
boxes=r['luckyBox'];q=.3*boxes['60002.0']['apex']/boxes['60002.0']['total']+.1*boxes['60003.0']['apex']/boxes['60003.0']['total'];out['box']={'mixedBoxApexChance':q,'meanMixedBoxes':1/q,'elapsedHoursAt3BoxesPer69min':t/(3*q)/60,'elapsedHoursAt2BoxesPer69min':t/(2*q)/60}
Path('reports/fishing-time-comparison.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(out,ensure_ascii=True,indent=2))
