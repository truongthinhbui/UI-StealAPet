from pathlib import Path
import re,json,hashlib
work=Path('outputs/sap-skill-fidelity-update');stage=work/'staged';root=Path(r'C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production')
s=(stage/'SKILL.md').read_text(encoding='utf-8')
m=re.match(r'\A---\n(.*?)\n---\n',s,re.S);assert m,'Frontmatter missing'
fields={}
for line in m.group(1).splitlines():
 key,value=line.split(':',1);assert key in ('name','description');assert value.strip();fields[key]=value.strip()
assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',fields['name']) and len(fields['name'])<64
assert set(fields)=={'name','description'}
for p in stage.rglob('*.md'):
 for link in re.findall(r'\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
  if ':' in link or link.startswith('#'):continue
  rel=(p.parent/link).relative_to(stage)
  assert (stage/rel).exists() or (root/rel).exists(),(p,link)
manifest=json.loads((stage/'package-manifest.json').read_text(encoding='utf-8'))
contract=json.loads((stage/'production-contract.json').read_text(encoding='utf-8'))
assert manifest['package_version']==contract['package_version']=='2.4.0'
for name in json.loads((work/'update-plan.json').read_text())['files']:
 if name=='package-manifest.json':continue
 data=(stage/name).read_bytes();assert manifest['files'][name]=={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
assert contract['defaults']['wireframe_evidence']['automatic'] is True
assert contract['defaults']['wireframe_evidence']['source_geometry_mutation_for_preview'] is False
assert contract['defaults']['max_exported_triangles']==1500
print('PASS frontmatter, reference paths, version/manifest hashes and preserved 1500-triangle contract. Bundled quick_validate unavailable because PyYAML is absent; equivalent checks performed for this plain two-field frontmatter.')

