f = open('src/pages/ContentStudioPage.jsx', 'r').read()

# Fix PlatformSection to accept and pass onPlay
f = f.replace(
    'function PlatformSection({ platform, clips }) {',
    'function PlatformSection({ platform, clips, onPlay }) {'
)

f = f.replace(
    ': group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} onPlay={() => setPlayingClip(c)} />)',
    ': group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} onPlay={() => onPlay(c)} />)'
)

# Pass onPlay to PlatformSection
f = f.replace(
    '{PLATFORMS.map(p => <PlatformSection key={p.id} platform={p} clips={clips} />)}',
    '{PLATFORMS.map(p => <PlatformSection key={p.id} platform={p} clips={clips} onPlay={setPlayingClip} />)}'
)

open('src/pages/ContentStudioPage.jsx', 'w').write(f)
print('done')
