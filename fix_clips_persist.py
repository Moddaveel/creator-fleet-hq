f = open('src/pages/ContentStudioPage.jsx', 'r').read()

# Add useEffect to imports
f = f.replace(
    'import { useState } from "react";',
    'import { useState, useEffect } from "react";'
)

# Add useEffect to load clips on mount
f = f.replace(
    '  const [playingClip, setPlayingClip] = useState(null);',
    '''  const [playingClip, setPlayingClip] = useState(null);

  useEffect(() => {
    fetch("https://chic-patience-production-5712.up.railway.app/clips")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setClips(data); })
      .catch(e => console.error("Failed to load clips", e));
  }, []);'''
)

open('src/pages/ContentStudioPage.jsx', 'w').write(f)
print('done')
