
const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const el = $('toast'); el.textContent = msg; el.style.display='block';
  clearTimeout(window.__t); window.__t=setTimeout(()=>el.style.display='none',2200);
};

const getUser = () => { try{return JSON.parse(localStorage.getItem('cintex_user')||'null');}catch{return null;} };
const loadReports = () => { try{return JSON.parse(localStorage.getItem('cintex_reports')||'[]');}catch{return [];} };
const saveReports = (r) => localStorage.setItem('cintex_reports', JSON.stringify(r));
const fmtDate = (iso)=>{const d=new Date(iso);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const esc = (s)=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");

const openModal=()=>{$('modalBackdrop').style.display='flex';};
const closeModal=()=>{$('modalBackdrop').style.display='none';};

const render=()=>{
  const reports=loadReports().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  $('kpiReports').textContent=String(reports.length);
  $('kpiSeverity').textContent=reports[0]?.severity||'—';
  const tbody=$('reportTbody'); tbody.innerHTML='';
  if(!reports.length){
    tbody.innerHTML=`<tr><td colspan="5" class="small">No saved reports yet. Click <span class="mono">New Report</span> to add one.</td></tr>`;
    return;
  }
  for(const r of reports){
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td class="mono">${fmtDate(r.createdAt)}</td>
      <td><div style="font-weight:900">${esc(r.title)}</div><div class="small">${esc(r.machine||'')}</div></td>
      <td>${esc(r.category)}</td>
      <td>${esc(r.severity)}</td>
      <td>
        <button class="btn" data-action="view" data-id="${r.id}">View</button>
        <button class="btn" data-action="del" data-id="${r.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  }
};

const setRef=(which)=>{
  if(which==='injector'){
    $('refTitle').textContent='Injector Sizing Chart';
    $('refDesc').textContent='Placeholder injector sizing guidance.';
    $('refBody').innerHTML=`
      <tr><td class="mono">1.75</td><td>—</td><td>Small burners</td></tr>
      <tr><td class="mono">2.25</td><td>—</td><td>Typical hot washers</td></tr>
      <tr><td class="mono">3.00</td><td>—</td><td>High demand</td></tr>`;
  }else{
    $('refTitle').textContent='Nozzle Size Chart';
    $('refDesc').textContent='Common nozzle sizes and use cases.';
    $('refBody').innerHTML=`
      <tr><td class="mono">2504</td><td>25°</td><td>General surface cleaning</td></tr>
      <tr><td class="mono">4003</td><td>40°</td><td>Rinse / delicate</td></tr>
      <tr><td class="mono">1505</td><td>15°</td><td>Heavy buildup</td></tr>
      <tr><td class="mono">SOAP</td><td>65°</td><td>Downstream soap</td></tr>`;
  }
};

const seed=()=>{
  const r=loadReports();
  r.push({id:crypto.randomUUID(),createdAt:new Date().toISOString(),title:'Surging pressure + weak heat',machine:'Hot washer • 4 GPM • 4000 PSI',category:'Burner',severity:'High',
    diagnosis:'Fuel restriction + scaled coil suspected.',steps:'Verified unloader, checked nozzle, confirmed flow.',partsUsed:'Fuel filter',partsNeeded:'Injector, descaler',notes:'Verify air band and electrode gap.'});
  saveReports(r); toast('Seeded example'); render();
};

(() => {
  const user=getUser();
  if(!user){ location.href='./index.html'; return; }
  $('kpiUser').textContent=`${user.email} • ${user.role}`;

  if(user.role==='admin'){ $('usersBtn').disabled=false; $('adminHint').textContent='Admin role detected (preview).'; }
  else { $('adminHint').textContent='Sign in with an email containing “admin” to enable.'; }

  $('logoutBtn').onclick=()=>{ localStorage.removeItem('cintex_user'); toast('Logged out'); setTimeout(()=>location.href='./index.html',350); };
  $('acctBtn').onclick=()=>toast(`Signed in: ${user.email} (${user.role})`);
  $('photoBtn').onclick=()=>toast('Preview: photo send placeholder');
  $('kbBtn').onclick=()=>toast('Preview: KB contents placeholder');
  $('analyticsBtn').onclick=()=>toast('Preview: analytics placeholder');
  $('usersBtn').onclick=()=>toast('Preview: user management placeholder');

  $('reportBtn').onclick=()=>{ $('saveReportBtn').dataset.editId=''; openModal(); };
  $('openReport').onclick=()=>{ $('saveReportBtn').dataset.editId=''; openModal(); };
  $('seedBtn').onclick=seed;

  $('closeModalBtn').onclick=closeModal;
  $('modalBackdrop').onclick=(e)=>{ if(e.target===$('modalBackdrop')) closeModal(); };

  $('clearFormBtn').onclick=()=>{ ['title','machine','diagnosis','steps','partsUsed','partsNeeded','notes'].forEach(id=>$(id).value=''); $('category').value='Engine'; $('severity').value='Low'; toast('Cleared'); };

  $('saveReportBtn').onclick=()=>{
    const title=$('title').value.trim(); if(!title){ toast('Title is required'); return; }
    const payload={id:$('saveReportBtn').dataset.editId||crypto.randomUUID(),createdAt:new Date().toISOString(),title,
      machine:$('machine').value.trim(),category:$('category').value,severity:$('severity').value,
      diagnosis:$('diagnosis').value.trim(),steps:$('steps').value.trim(),partsUsed:$('partsUsed').value.trim(),
      partsNeeded:$('partsNeeded').value.trim(),notes:$('notes').value.trim()};
    const reports=loadReports();
    const editId=$('saveReportBtn').dataset.editId;
    if(editId){
      const idx=reports.findIndex(x=>x.id===editId);
      if(idx>=0){ payload.createdAt=reports[idx].createdAt; reports[idx]=payload; }
      else reports.push(payload);
      toast('Updated report');
    }else{ reports.push(payload); toast('Saved report'); }
    saveReports(reports); render(); closeModal();
  };

  document.addEventListener('click',(e)=>{
    const btn=e.target.closest('button'); if(!btn) return;
    if(btn.dataset.ref){ setRef(btn.dataset.ref); toast('Switched chart'); }
    if(btn.dataset.action){
      const id=btn.dataset.id; const action=btn.dataset.action;
      const reports=loadReports(); const idx=reports.findIndex(x=>x.id===id); if(idx<0) return;
      if(action==='del'){ reports.splice(idx,1); saveReports(reports); toast('Deleted'); render(); }
      if(action==='view'){
        const r=reports[idx];
        ['title','machine','diagnosis','steps','partsUsed','partsNeeded','notes'].forEach(k=>$(k).value=r[k]||'');
        $('category').value=r.category||'General'; $('severity').value=r.severity||'Low';
        $('saveReportBtn').dataset.editId=r.id; openModal();
      }
    }
  });

  render();
})();
