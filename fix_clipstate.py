f = open('src/pages/ContentStudioPage.jsx', 'r').read()

# Add playingClip state
f = f.replace(
    '  const [processing, setProcessing] = useState(null);',
    '  const [processing, setProcessing] = useState(null);\n  const [playingClip, setPlayingClip] = useState(null);'
)

# Wire up onPlay in PlatformSection
f = f.replace(
    ': group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} />)',
    ': group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} onPlay={() => setPlayingClip(c)} />)'
)

# Add VideoModal before AgentChat
f = f.replace(
    '      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}',
    '      {playingClip && <VideoModal clip={playingClip} onClose={() => setPlayingClip(null)} />}\n      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}'
)

open('src/pages/ContentStudioPage.jsx', 'w').write(f)
print('done - modal wired up')
