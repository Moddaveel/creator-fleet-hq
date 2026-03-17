f = open('src/pages/ContentStudioPage.jsx', 'r').read()

old = '''function processVods(files) {
    if (!files.length) return;
    files.forEach(file => {
      const vod = { id:Date.now()+Math.random(), name:file.name, size:(file.size/1e6).toFixed(1)+" MB", status:"processing" };
      setVods(v => [...v, vod]);
      setProcessing(file.name);
      setTimeout(() => { setVods(v => v.map(x => x.id===vod.id ? {...x, status:"done"} : x)); setProcessing(null); }, 2400);
    });
  }'''

new = '''async function processVods(files) {
    if (!files.length) return;
    for (const file of files) {
      const vodId = Date.now()+Math.random();
      const vod = { id:vodId, name:file.name, size:(file.size/1e6).toFixed(1)+" MB", status:"uploading" };
      setVods(v => [...v, vod]);
      setProcessing(file.name);
      try {
        const formData = new FormData();
        formData.append("vod", file);
        setVods(v => v.map(x => x.id===vodId ? {...x, status:"processing"} : x));
        const res = await fetch("https://chic-patience-production-5712.up.railway.app/process", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setVods(v => v.map(x => x.id===vodId ? {...x, status:"processing", jobId:data.jobId} : x));
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          try {
            const clipsRes = await fetch("https://chic-patience-production-5712.up.railway.app/clips");
            const newClips = await clipsRes.json();
            if (newClips.length > 0) {
              setClips(newClips);
              setVods(v => v.map(x => x.id===vodId ? {...x, status:"done"} : x));
              setProcessing(null);
              clearInterval(poll);
            }
          } catch(e) { console.error("Poll error", e); }
          if (attempts >= 60) { clearInterval(poll); setProcessing(null); }
        }, 10000);
      } catch(err) {
        console.error("Upload error", err);
        setVods(v => v.map(x => x.id===vodId ? {...x, status:"error"} : x));
        setProcessing(null);
      }
    }
  }'''

if old in f:
    f = f.replace(old, new)
    open('src/pages/ContentStudioPage.jsx', 'w').write(f)
    print('done')
else:
    print('no match found')
