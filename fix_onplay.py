f = open('src/pages/ContentStudioPage.jsx', 'r').read()
f = f.replace(
    'group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} />',
    'group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} onPlay={() => onPlay(c)} />'
)
open('src/pages/ContentStudioPage.jsx', 'w').write(f)
print('done')
