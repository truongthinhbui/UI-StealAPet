import sys,subprocess
from pathlib import Path
sys.path.insert(0,str(Path('outputs/kick-ball-reference/python').resolve()))
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
source=r'C:\Users\truongthinh.bui_ctv\Videos\Recording 2026-11-16 100902.mp4'
r=subprocess.run([ff,'-i',source],capture_output=True,text=True)
print(r.stderr[-2400:])
subprocess.run([ff,'-y','-i',source,'-vf','fps=1/5,scale=960:-1','-frames:v','18','outputs/kick-ball-reference/shot-%02d.jpg'],capture_output=True,check=True)
