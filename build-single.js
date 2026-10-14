/* Builds MG-Candy-Blast-single.html: the whole game (HTML + CSS + JS + home artwork) in ONE file for quick testing on a phone.
   Usage: node tools/build-single.js */
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const img='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'assets/images/home.jpg')).toString('base64');
let h=read('index.html').replace(/src="assets\/images\/home\.jpg"/g,'src="'+img+'"');
h=h.replace('<link rel="stylesheet" href="style.css">',()=>'<style>\n'+read('style.css')+'\n</style>');
h=h.replace('<script src="storage.js"></script>',()=>'<script>window.MG_HOME="'+img+'";</script>\n<script src="storage.js"></script>');
['storage','engine','level-tuning','levels','audio','effects','art','game','ui'].forEach(f=>{h=h.replace('<script src="'+f+'.js"></script>',()=>'<script>\n'+read(f+'.js').replace(/<\/script>/g,'<\\/script>')+'\n</script>');});
h=h.replace('<link rel="manifest" href="manifest.json">\n','').replace(/<link rel="apple-touch-icon"[^>]*>\n?/,'');
fs.writeFileSync(path.join(root,'MG-Candy-Blast-single.html'),h);
console.log('wrote MG-Candy-Blast-single.html ('+Math.round(h.length/1024)+' KB)');
