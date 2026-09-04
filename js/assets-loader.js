(async()=>{
  const parts=Array.from({length:4},(_,i)=>`assets/all/part${String(i+1).padStart(2,'0')}.txt`);
  try{
    const texts=await Promise.all(parts.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return (await r.text()).trim();}));
    const raw=atob(texts.join(''));
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    const buf=bytes.buffer,dv=new DataView(buf),hlen=dv.getUint32(0,true);
    const header=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,hlen)));
    const base=4+hlen, assets={};
    for(const [name,pair] of Object.entries(header)){const [off,len]=pair;assets[name]=URL.createObjectURL(new Blob([buf.slice(base+off,base+off+len)],{type:'image/png'}));}
    document.querySelectorAll('img[data-asset]').forEach(el=>{const u=assets[el.dataset.asset];if(u)el.src=u;});
    document.querySelectorAll('.shot[data-asset]').forEach(el=>{const u=assets[el.dataset.asset];if(u)el.dataset.src=u;});
    document.documentElement.dataset.assets='ready';
  }catch(err){console.error('External screenshot assets failed to load',err);document.documentElement.dataset.assets='error';}
})();
