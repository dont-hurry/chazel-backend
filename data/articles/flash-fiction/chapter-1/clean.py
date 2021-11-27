import os
import json

for filename in os.listdir('.'):
  if '.json' not in filename:
    continue
  with open(filename) as f:
    data = json.load(f)
    data['coverImage']='f2xafvo1all3.jpg'
    with open('_'+filename,'w') as f2:
      json.dump(data, f2)