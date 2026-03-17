f = open('src/pages/ContentStudioPage.jsx', 'r').read()

f = f.replace(
    '    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>',
    '    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center" }} onMouseDown={onClose}>'
)

f = f.replace(
    '      <div style={{ background:"#1a1025", border:"1px solid "+C.purple+"44", borderRadius:16, padding:24, width:680, maxWidth:"95vw" }} onClick={e=>e.stopPropagation()}>',
    '      <div style={{ background:"#1a1025", border:"1px solid "+C.purple+"44", borderRadius:16, padding:24, width:680, maxWidth:"95vw" }} onMouseDown={e=>e.stopPropagation()}>'
)

open('src/pages/ContentStudioPage.jsx', 'w').write(f)
print('done')
