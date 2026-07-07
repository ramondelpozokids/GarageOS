
/* ══════════════════════════════════════
   PORTALS — SCL (corregido de CSL)
══════════════════════════════════════ */
const PORTALS = [
    'SCL 2','SCL 4','SCL 6','SCL 8','SCL 10','SCL 12',
    'PCA 1','PCA 3','PCA 5','PCA 7',
    'PCO 6','PCO 8'
];

/* ══════════════════════════════════════
   ADMIN STATE — datos completos
══════════════════════════════════════ */
const ADMIN = {
    nombre:'Admin', apellidos:'García',
    role:'Administrador Principal',
    dni:'12345678A', colegiado:'COL-00123',
    direccion:'Calle Mayor, 15', cp:'28001', ciudad:'Madrid', provincia:'Madrid', pais:'España',
    tel1:'600 123 456', tel2:'91 000 00 00', fax:'', whatsapp:'600 123 456',
    email1:'admin@comunidad.es', email2:'',
    web:'https://www.administracion.es', linkedin:'', horario:'Lun–Vie 09:00–18:00',
    empresa:'Administración de Fincas García S.L.', cif:'B12345678',
    registro:'', comunidad:'Comunidad Las Flores', comCif:'H12345678',
    anio:'2005', banco:'', seguro:'', notas:'',
    sysRole:'admin', idioma:'es'
};

/* ══════════════════════════════════════
   DATABASE
══════════════════════════════════════ */
const DB = { spots:[], owners:[], history:[] };

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const ST = {
    page:'dashboard', dark:false,
    editId:null, editOwner:null, confirmCb:null,
    charts:{},
    veh:{ search:'', portal:'', filter:'all', page:1, perPage:12, selected:new Set() },
    mot:{ search:'', portal:'', page:1, perPage:12, selected:new Set() },
    own:{ search:'', portal:'', page:1, perPage:12, selected:new Set() }
};

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
const rnd  = a => a[Math.floor(Math.random()*a.length)];
const rndI = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const uid  = () => '_'+Math.random().toString(36).slice(2,9);
const inits = name => { const p=name.trim().split(' '); return (p[0][0]+(p[1]?p[1][0]:'')).toUpperCase(); };
const AVATAR_COLORS=['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#06b6d4','#ec4899'];
const avatarColor = name => { if(!name||name==='—') return '#94a3b8'; const h=name.split('').reduce((a,c)=>a+c.charCodeAt(0),0); return AVATAR_COLORS[h%AVATAR_COLORS.length]; };
const plate = () => { const L='BCDFGHJKLMNPRSTUVWXYZ'; return `${rndI(1000,9999)} ${L[rndI(0,20)]}${L[rndI(0,20)]}${L[rndI(0,20)]}`; };
const BRANDS_CAR=['Volkswagen','Seat','BMW','Mercedes','Audi','Toyota','Peugeot','Renault','Kia','Hyundai'];
const BRANDS_MOTO=['Honda','Yamaha','Kawasaki','Ducati','BMW Moto','Suzuki'];
const COLORS_LIST=['Blanco','Negro','Gris','Azul','Rojo','Plata','Verde','Naranja'];
const STATUS_POOL=['occupied','occupied','occupied','free','free','reserved'];

/* ══════════════════════════════════════
   POPULATE PORTAL SELECTS
══════════════════════════════════════ */
function populatePortalSelects(){
    const selIds = ['veh-portal-sel','mot-portal-sel','own-portal-sel','spots-portal-sel','f-portal','ow-portal'];
    selIds.forEach(id=>{
        const el=document.getElementById(id); if(!el) return;
        // Keep first option if it exists
        const first = el.options[0] && el.options[0].value==='' ? el.options[0].text : null;
        el.innerHTML = '';
        if(first!==null){ const o=document.createElement('option'); o.value=''; o.textContent=first; el.appendChild(o); }
        PORTALS.forEach(p=>{ const o=document.createElement('option'); o.value=p; o.textContent=p; el.appendChild(o); });
    });
}

/* ══════════════════════════════════════
   DATA GENERATION
══════════════════════════════════════ */
function generateData(){
    const NAMES=['Carlos Rodríguez','Ana Belén Martínez','Javier Gómez','María Fernández','David López','Sonia Ruiz','Lucía Sánchez','Pedro Domínguez','Elena Navarro','Miguel Ángel Torres','Beatriz Morales','Gonzalo Castro','Isabel Fuentes','Raúl Herrero','Carmen Vega','Alberto Pino','Natalia Blanco','Sergio Mora'];
    NAMES.forEach((n,i)=>{ DB.owners.push({ id:uid(), fullName:n, phone:`6${rndI(10,99)} ${rndI(100,999)} ${rndI(100,999)}`, email:n.toLowerCase().replace(/\s+/g,'.')+`@email.com`, portal:rnd(PORTALS), vivienda:`${rndI(1,6)}º${rnd(['A','B','C'])}`, obs:'', createdAt:`2024-${String(rndI(1,12)).padStart(2,'0')}-01` }); });
    PORTALS.forEach(portal=>{
        for(let i=0;i<12;i++){
            const st=rnd(STATUS_POOL),owner=rnd(DB.owners),brand=rnd(BRANDS_CAR);
            DB.spots.push({ id:uid(), number:`G-${portal.replace(' ','')}${String(i+1).padStart(2,'0')}`, portal, type:'car', status:st, ownerName:st!=='free'?owner.fullName:'—', ownerPhone:st!=='free'?owner.phone:'—', ownerEmail:st!=='free'?owner.email:'—', brand:st!=='free'?brand:'—', model:st!=='free'?`Serie ${rndI(1,5)}`:'—', plate:st!=='free'?plate():'—', color:st!=='free'?rnd(COLORS_LIST):'—', createdAt:`2024-${String(rndI(1,12)).padStart(2,'0')}-${String(rndI(1,28)).padStart(2,'0')}` });
        }
        for(let m=0;m<2;m++){
            const st=rnd(['occupied','free']),owner=rnd(DB.owners),brand=rnd(BRANDS_MOTO);
            DB.spots.push({ id:uid(), number:`M-${m+1}-${portal}`, portal, type:'moto', status:st, ownerName:st!=='free'?owner.fullName:'—', ownerPhone:st!=='free'?owner.phone:'—', ownerEmail:st!=='free'?owner.email:'—', brand:st!=='free'?brand:'—', model:st!=='free'?'NMAX 125':'—', plate:st!=='free'?plate():'—', color:st!=='free'?rnd(COLORS_LIST):'—', createdAt:`2024-${String(rndI(1,12)).padStart(2,'0')}-${String(rndI(1,28)).padStart(2,'0')}` });
        }
    });
    DB.history=DB.spots.slice(0,6).map(s=>({ action:`Actualizado ${s.number}`, user:`${ADMIN.nombre} ${ADMIN.apellidos}`, time:`Hace ${rndI(1,60)} min` }));
}

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
const PAGE_LABELS={dashboard:'Dashboard',garages:'Vehículos',motorcycles:'Motocicletas',owners:'Propietarios',spots:'Plazas',search:'Buscador',stats:'Estadísticas',settings:'Configuración'};
function navigate(page){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(i=>i.classList.remove('active'));
    document.getElementById(`page-${page}`)?.classList.add('active');
    document.getElementById(`nav-${page}`)?.classList.add('active');
    document.getElementById('breadcrumb-current').textContent=PAGE_LABELS[page]||page;
    ST.page=page;
    if(page==='garages') renderVehiclesTable();
    if(page==='motorcycles') renderMotosTable();
    if(page==='owners') renderOwnersGrid();
    if(page==='spots') renderFloor(DB.spots);
    if(page==='stats') renderStats();
    if(page==='settings') renderSettingsPortals();
}
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('collapsed'); }

/* ══════════════════════════════════════
   DARK MODE
══════════════════════════════════════ */
function toggleDark(){
    ST.dark=!ST.dark;
    document.documentElement.setAttribute('data-theme',ST.dark?'dark':'light');
    document.getElementById('dark-toggle-settings').classList.toggle('on',ST.dark);
    const icon=document.querySelector('#dark-btn [data-lucide]');
    if(icon){ icon.setAttribute('data-lucide',ST.dark?'sun':'moon'); lucide.createIcons(); }
    renderCharts();
}

/* ══════════════════════════════════════
   ADMIN PROFILE — UI UPDATE
══════════════════════════════════════ */
function updateAdminUI(){
    const fullName=`${ADMIN.nombre} ${ADMIN.apellidos}`.trim();
    document.getElementById('sidebar-user-name').textContent=fullName;
    document.getElementById('sidebar-user-role').textContent=ADMIN.role;
    document.getElementById('sidebar-avatar').textContent=inits(fullName);

    // Settings page big card
    const cardName=document.getElementById('cfg-card-name');
    const cardRole=document.getElementById('cfg-card-role');
    const cardAvatar=document.getElementById('cfg-avatar-display');
    const cardMeta=document.getElementById('cfg-card-meta');
    if(cardName) cardName.textContent=fullName;
    if(cardRole) cardRole.textContent=ADMIN.role;
    if(cardAvatar) cardAvatar.textContent=inits(fullName);
    if(cardMeta){
        const items=[];
        if(ADMIN.tel1) items.push({icon:'phone',text:ADMIN.tel1});
        if(ADMIN.email1) items.push({icon:'mail',text:ADMIN.email1});
        if(ADMIN.web) items.push({icon:'globe',text:ADMIN.web.replace('https://','')});
        if(ADMIN.ciudad) items.push({icon:'map-pin',text:`${ADMIN.ciudad}${ADMIN.provincia?', '+ADMIN.provincia:''}`});
        if(ADMIN.empresa) items.push({icon:'building',text:ADMIN.empresa});
        cardMeta.innerHTML=items.slice(0,4).map(i=>`<div class="admin-card-meta-item"><i data-lucide="${i.icon}" style="width:13px;height:13px;"></i><span>${i.text}</span></div>`).join('');
        lucide.createIcons();
    }
}

/* ══════════════════════════════════════
   ADMIN MODAL — OPEN / CLOSE / TABS
══════════════════════════════════════ */
function openAdminModal(){
    // Fill all fields
    document.getElementById('adm-nombre').value      = ADMIN.nombre;
    document.getElementById('adm-apellidos').value   = ADMIN.apellidos;
    document.getElementById('adm-role').value        = ADMIN.role;
    document.getElementById('adm-dni').value         = ADMIN.dni;
    document.getElementById('adm-colegiado').value   = ADMIN.colegiado;
    document.getElementById('adm-direccion').value   = ADMIN.direccion;
    document.getElementById('adm-cp').value          = ADMIN.cp;
    document.getElementById('adm-ciudad').value      = ADMIN.ciudad;
    document.getElementById('adm-provincia').value   = ADMIN.provincia;
    document.getElementById('adm-pais').value        = ADMIN.pais;
    document.getElementById('adm-tel1').value        = ADMIN.tel1;
    document.getElementById('adm-tel2').value        = ADMIN.tel2;
    document.getElementById('adm-fax').value         = ADMIN.fax;
    document.getElementById('adm-whatsapp').value    = ADMIN.whatsapp;
    document.getElementById('adm-email1').value      = ADMIN.email1;
    document.getElementById('adm-email2').value      = ADMIN.email2;
    document.getElementById('adm-web').value         = ADMIN.web;
    document.getElementById('adm-linkedin').value    = ADMIN.linkedin;
    document.getElementById('adm-horario').value     = ADMIN.horario;
    document.getElementById('adm-empresa').value     = ADMIN.empresa;
    document.getElementById('adm-cif').value         = ADMIN.cif;
    document.getElementById('adm-registro').value    = ADMIN.registro;
    document.getElementById('adm-comunidad').value   = ADMIN.comunidad;
    document.getElementById('adm-com-cif').value     = ADMIN.comCif;
    document.getElementById('adm-anio').value        = ADMIN.anio;
    document.getElementById('adm-banco').value       = ADMIN.banco;
    document.getElementById('adm-seguro').value      = ADMIN.seguro;
    document.getElementById('adm-notas').value       = ADMIN.notas;
    document.getElementById('adm-sys-role').value    = ADMIN.sysRole;
    document.getElementById('adm-idioma').value      = ADMIN.idioma;
    document.getElementById('adm-pass1').value       = '';
    document.getElementById('adm-pass2').value       = '';
    // Show first tab
    switchAdminTab(document.querySelector('#admin-modal .modal-tab'),'atab-personal');
    document.getElementById('admin-modal').classList.add('open');
}
function closeAdminModal(){ document.getElementById('admin-modal').classList.remove('open'); }
function closeAdminOnBg(e){ if(e.target===document.getElementById('admin-modal')) closeAdminModal(); }

function switchAdminTab(tabEl, targetId){
    document.querySelectorAll('#admin-modal .modal-tab').forEach(t=>t.classList.remove('active'));
    tabEl.classList.add('active');
    ['atab-personal','atab-contact','atab-company','atab-security'].forEach(id=>{
        const el=document.getElementById(id); if(el) el.style.display=(id===targetId)?'block':'none';
    });
}

function saveAdmin(){
    const nombre=document.getElementById('adm-nombre').value.trim();
    if(!nombre){ showToast('error','Error','El nombre es obligatorio.'); return; }
    const pass1=document.getElementById('adm-pass1').value;
    const pass2=document.getElementById('adm-pass2').value;
    if(pass1&&pass1!==pass2){ showToast('error','Error','Las contraseñas no coinciden.'); return; }
    // Persist all fields
    ADMIN.nombre      = nombre;
    ADMIN.apellidos   = document.getElementById('adm-apellidos').value.trim();
    ADMIN.role        = document.getElementById('adm-role').value.trim()||'Administrador';
    ADMIN.dni         = document.getElementById('adm-dni').value.trim();
    ADMIN.colegiado   = document.getElementById('adm-colegiado').value.trim();
    ADMIN.direccion   = document.getElementById('adm-direccion').value.trim();
    ADMIN.cp          = document.getElementById('adm-cp').value.trim();
    ADMIN.ciudad      = document.getElementById('adm-ciudad').value.trim();
    ADMIN.provincia   = document.getElementById('adm-provincia').value.trim();
    ADMIN.pais        = document.getElementById('adm-pais').value.trim();
    ADMIN.tel1        = document.getElementById('adm-tel1').value.trim();
    ADMIN.tel2        = document.getElementById('adm-tel2').value.trim();
    ADMIN.fax         = document.getElementById('adm-fax').value.trim();
    ADMIN.whatsapp    = document.getElementById('adm-whatsapp').value.trim();
    ADMIN.email1      = document.getElementById('adm-email1').value.trim();
    ADMIN.email2      = document.getElementById('adm-email2').value.trim();
    ADMIN.web         = document.getElementById('adm-web').value.trim();
    ADMIN.linkedin    = document.getElementById('adm-linkedin').value.trim();
    ADMIN.horario     = document.getElementById('adm-horario').value.trim();
    ADMIN.empresa     = document.getElementById('adm-empresa').value.trim();
    ADMIN.cif         = document.getElementById('adm-cif').value.trim();
    ADMIN.registro    = document.getElementById('adm-registro').value.trim();
    ADMIN.comunidad   = document.getElementById('adm-comunidad').value.trim();
    ADMIN.comCif      = document.getElementById('adm-com-cif').value.trim();
    ADMIN.anio        = document.getElementById('adm-anio').value.trim();
    ADMIN.banco       = document.getElementById('adm-banco').value.trim();
    ADMIN.seguro      = document.getElementById('adm-seguro').value.trim();
    ADMIN.notas       = document.getElementById('adm-notas').value.trim();
    ADMIN.sysRole     = document.getElementById('adm-sys-role').value;
    ADMIN.idioma      = document.getElementById('adm-idioma').value;
    updateAdminUI();
    closeAdminModal();
    showToast('success','Perfil actualizado','Todos los datos del administrador han sido guardados.');
}

/* ══════════════════════════════════════
   SETTINGS PAGE PORTALS LIST
══════════════════════════════════════ */
function renderSettingsPortals(){
    const el=document.getElementById('portals-list'); if(!el) return;
    el.innerHTML=PORTALS.map(p=>`<span class="badge primary" style="font-size:12.5px;padding:5px 12px">${p}</span>`).join('');
}

/* ══════════════════════════════════════
   BADGES
══════════════════════════════════════ */
function updateBadges(){
    document.getElementById('badge-garages').textContent    = DB.spots.filter(s=>s.type==='car').length;
    document.getElementById('badge-motorcycles').textContent= DB.spots.filter(s=>s.type==='moto').length;
    document.getElementById('badge-owners').textContent     = DB.owners.length;
}

/* ══════════════════════════════════════
   KPI CARDS
══════════════════════════════════════ */
function renderKPIs(){
    const total=DB.spots.length,occ=DB.spots.filter(s=>s.status==='occupied').length,free=DB.spots.filter(s=>s.status==='free').length;
    const g=document.getElementById('kpi-grid'); if(!g) return;
    const kpis=[
        {label:'Total Plazas',  value:total,                                          icon:'grid-3x3',    color:'var(--accent-primary)',  bg:'var(--accent-primary-light)'},
        {label:'Ocupadas',      value:occ,                                            icon:'car',          color:'var(--accent-red)',      bg:'var(--accent-red-light)'},
        {label:'Libres',        value:free,                                           icon:'check-circle', color:'var(--accent-green)',    bg:'var(--accent-green-light)'},
        {label:'Vehículos',     value:DB.spots.filter(s=>s.type==='car').length,      icon:'car',          color:'var(--accent-blue)',     bg:'var(--accent-blue-light)'},
        {label:'Motocicletas',  value:DB.spots.filter(s=>s.type==='moto').length,     icon:'bike',         color:'var(--accent-purple)',   bg:'var(--accent-purple-light)'},
        {label:'Propietarios',  value:DB.owners.length,                               icon:'users',        color:'var(--accent-orange)',   bg:'var(--accent-orange-light)'}
    ];
    g.innerHTML=kpis.map(k=>`<div class="kpi-card"><div class="kpi-card-header"><span class="kpi-card-label">${k.label}</span><div class="kpi-icon" style="background:${k.bg}"><i data-lucide="${k.icon}" style="width:16px;height:16px;color:${k.color}"></i></div></div><div class="kpi-value">${k.value}</div></div>`).join('');
    lucide.createIcons();
}

/* ══════════════════════════════════════
   CHARTS
══════════════════════════════════════ */
function renderCharts(){
    Object.values(ST.charts).forEach(c=>{ try{ c.destroy(); }catch(e){} });
    ST.charts={};
    const tc=ST.dark?'#94a3b8':'#475569',gc=ST.dark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)';
    const tip={backgroundColor:ST.dark?'#1e293b':'#fff',titleColor:ST.dark?'#f1f5f9':'#0f172a',bodyColor:tc,borderColor:ST.dark?'#334155':'#e2e8f0',borderWidth:1,padding:12,cornerRadius:8};

    const lctx=document.getElementById('chart-line');
    if(lctx) ST.charts.line=new Chart(lctx,{type:'line',data:{labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],datasets:[{label:'Ocupadas',data:[110,115,118,122,125,130,128,133,136,138,142,145],borderColor:'#6366f1',backgroundColor:'rgba(99,102,241,0.09)',tension:0.4,fill:true,pointRadius:4,pointBackgroundColor:'#6366f1',borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tip},scales:{x:{ticks:{color:tc},grid:{display:false}},y:{ticks:{color:tc},grid:{color:gc}}}}});

    const dctx=document.getElementById('chart-donut');
    if(dctx){
        const occ=DB.spots.filter(s=>s.status==='occupied').length,fre=DB.spots.filter(s=>s.status==='free').length,res=DB.spots.filter(s=>s.status==='reserved').length;
        ST.charts.donut=new Chart(dctx,{type:'doughnut',data:{labels:['Ocupadas','Libres','Reservadas'],datasets:[{data:[occ,fre,res],backgroundColor:['#ef4444','#10b981','#f59e0b'],borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{display:false},tooltip:tip}}});
        const leg=document.getElementById('donut-legend');
        if(leg) leg.innerHTML=[['Ocupadas','#ef4444',occ],['Libres','#10b981',fre],['Reservadas','#f59e0b',res]].map(([l,c,v])=>`<div style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--text-secondary)"><span style="width:8px;height:8px;border-radius:2px;background:${c}"></span>${l} <strong style="color:var(--text-primary)">${v}</strong></div>`).join('');
    }

    const pctx=document.getElementById('chart-portals');
    if(pctx) ST.charts.portals=new Chart(pctx,{type:'bar',data:{labels:PORTALS,datasets:[{label:'Ocupadas',data:PORTALS.map(p=>DB.spots.filter(s=>s.portal===p&&s.status==='occupied').length),backgroundColor:'rgba(99,102,241,0.75)',borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tip},scales:{x:{ticks:{color:tc,font:{size:10}},grid:{display:false}},y:{ticks:{color:tc},grid:{color:gc}}}}});

    const al=document.getElementById('activity-list');
    if(al) al.innerHTML=DB.history.map(h=>`<div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--border-secondary)"><div style="width:28px;height:28px;border-radius:50%;background:var(--accent-primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i data-lucide="edit-3" style="width:12px;height:12px;color:var(--accent-primary)"></i></div><div><div style="font-size:12.5px;font-weight:500">${h.action}</div><div style="font-size:11px;color:var(--text-muted)">${h.user} · ${h.time}</div></div></div>`).join('');
    lucide.createIcons();
}

/* ══════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════ */
function statusBadge(s){ const m={occupied:['Ocupada','occupied'],free:['Libre','free'],reserved:['Reservada','reserved']}; const[l,c]=m[s]||[s,'primary']; return `<span class="badge ${c}"><span class="badge-dot"></span>${l}</span>`; }

/* ══════════════════════════════════════
   CHECKBOX UI
══════════════════════════════════════ */
function makeCb(checked){ return `<div class="cb${checked?' checked':''}" style="margin:auto"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`; }

function updateHeaderCb(type){
    const cbMap={vehicles:'cb-all-vehicles',motorcycles:'cb-all-motorcycles'};
    if(!cbMap[type]) return;
    const sel=ST[type==='vehicles'?'veh':'mot'];
    const visible=getFiltered(type).map(s=>s.id);
    const cbEl=document.getElementById(cbMap[type]); if(!cbEl) return;
    const selCount=visible.filter(id=>sel.selected.has(id)).length;
    cbEl.classList.remove('checked','indeterminate');
    if(selCount===0){ cbEl.innerHTML=`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
    else if(selCount===visible.length){ cbEl.classList.add('checked'); cbEl.innerHTML=`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
    else { cbEl.classList.add('indeterminate'); cbEl.innerHTML=`<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`; }
}

function updateBulkBar(type){
    const selKey=type==='vehicles'?'veh':type==='motorcycles'?'mot':'own';
    const sel=ST[selKey];
    const bar=document.getElementById(`bulk-bar-${type}`);
    const cnt=document.getElementById(`bulk-count-${type}`);
    if(!bar) return;
    const n=sel.selected.size;
    bar.style.display=n>0?'block':'none';
    if(cnt) cnt.textContent=`${n} seleccionado${n!==1?'s':''}`;
    if(type!=='owners') updateHeaderCb(type);
}

/* ══════════════════════════════════════
   FILTERED DATA
══════════════════════════════════════ */
function getFiltered(type){
    if(type==='owners'){
        const s=ST.own; let d=[...DB.owners];
        if(s.portal) d=d.filter(o=>o.portal===s.portal);
        if(s.search){ const q=s.search.toLowerCase(); d=d.filter(o=>[o.fullName,o.phone,o.email,o.portal,o.vivienda].join(' ').toLowerCase().includes(q)); }
        return d;
    }
    const isV=type==='vehicles',s=isV?ST.veh:ST.mot;
    let d=DB.spots.filter(sp=>sp.type===(isV?'car':'moto'));
    if(isV&&s.filter!=='all') d=d.filter(sp=>sp.status===s.filter);
    if(s.portal) d=d.filter(sp=>sp.portal===s.portal);
    if(s.search){ const q=s.search.toLowerCase(); d=d.filter(sp=>[sp.number,sp.ownerName,sp.plate,sp.portal,sp.brand,sp.model,sp.color].join(' ').toLowerCase().includes(q)); }
    return d;
}

/* ══════════════════════════════════════
   SELECTION HELPERS
══════════════════════════════════════ */
function toggleSelectAll(type){
    const selKey=type==='vehicles'?'veh':type==='motorcycles'?'mot':'own';
    const sel=ST[selKey];
    const visible=getFiltered(type).map(s=>s.id);
    const allSel=visible.every(id=>sel.selected.has(id));
    if(allSel) visible.forEach(id=>sel.selected.delete(id));
    else visible.forEach(id=>sel.selected.add(id));
    if(type==='vehicles') renderVehiclesTable();
    else if(type==='motorcycles') renderMotosTable();
    else renderOwnersGrid();
}
function selectAllVisible(type){ const selKey=type==='vehicles'?'veh':'mot'; getFiltered(type).forEach(s=>ST[selKey].selected.add(s.id)); if(type==='vehicles') renderVehiclesTable(); else renderMotosTable(); showToast('info','Selección','Todos los registros visibles seleccionados.'); }
function selectAllOwners(){ getFiltered('owners').forEach(o=>ST.own.selected.add(o.id)); renderOwnersGrid(); showToast('info','Selección','Todos los propietarios visibles seleccionados.'); }
function clearSelection(type){ const k=type==='vehicles'?'veh':type==='motorcycles'?'mot':'own'; ST[k].selected.clear(); if(type==='vehicles') renderVehiclesTable(); else if(type==='motorcycles') renderMotosTable(); else renderOwnersGrid(); }
function toggleRowCheck(type,id,event){ event.stopPropagation(); const k=type==='vehicles'?'veh':type==='motorcycles'?'mot':'own'; const sel=ST[k]; if(sel.selected.has(id)) sel.selected.delete(id); else sel.selected.add(id); if(type==='vehicles') renderVehiclesTable(); else if(type==='motorcycles') renderMotosTable(); else renderOwnersGrid(); }

/* ══════════════════════════════════════
   VEHICLES TABLE
══════════════════════════════════════ */
function renderVehiclesTable(){
    const data=getFiltered('vehicles'),total=data.length;
    const totalPages=Math.max(1,Math.ceil(total/ST.veh.perPage));
    if(ST.veh.page>totalPages) ST.veh.page=1;
    const start=(ST.veh.page-1)*ST.veh.perPage;
    const page=data.slice(start,start+ST.veh.perPage);
    const sub=document.getElementById('vehicles-subtitle'); if(sub) sub.textContent=`${total} vehículo${total!==1?'s':''} encontrado${total!==1?'s':''}`;
    const tbody=document.getElementById('vehicles-tbody'); if(!tbody) return;
    tbody.innerHTML=page.map(v=>{ const ch=ST.veh.selected.has(v.id); return `<tr class="${ch?'row-selected':''}" onclick="openDetailPanel('${v.id}')"><td class="checkbox-col" onclick="toggleRowCheck('vehicles','${v.id}',event)">${makeCb(ch)}</td><td><strong>${v.number}</strong></td><td><span class="badge primary" style="font-size:11px">${v.portal}</span></td><td><div style="display:flex;align-items:center;gap:8px"><div style="width:26px;height:26px;border-radius:50%;background:${avatarColor(v.ownerName)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">${v.ownerName!=='—'?inits(v.ownerName):'?'}</div><span>${v.ownerName}</span></div></td><td><div style="font-weight:600">${v.brand}</div><div style="font-size:11px;color:var(--text-muted)">${v.model}</div></td><td>${v.plate!=='—'?`<code style="background:var(--bg-secondary);padding:2px 7px;border-radius:4px;font-size:12px;font-weight:600">${v.plate}</code>`:'—'}</td><td style="font-size:12.5px">${v.color}</td><td>${statusBadge(v.status)}</td><td onclick="event.stopPropagation()"><div style="display:flex;gap:4px"><button class="icon-btn" style="width:28px;height:28px" onclick="openEdit('${v.id}')"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button><button class="icon-btn" style="width:28px;height:28px;color:var(--accent-red)" onclick="confirmDeleteSingle('${v.id}','vehicles')"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button></div></td></tr>`; }).join('');
    renderPagination('vehicles-pg-info','vehicles-pg-controls',ST.veh.page,totalPages,start,ST.veh.perPage,total,p=>{ST.veh.page=p;renderVehiclesTable();});
    updateBulkBar('vehicles'); lucide.createIcons();
}
function onVehiclesSearch(q){ ST.veh.search=q;ST.veh.page=1;ST.veh.selected.clear();renderVehiclesTable(); }
function onVehiclesPortal(p){ ST.veh.portal=p;ST.veh.page=1;ST.veh.selected.clear();renderVehiclesTable(); }
function setVehiclesFilter(f,el){ document.querySelectorAll('#page-garages .filter-chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); ST.veh.filter=f;ST.veh.page=1;ST.veh.selected.clear();renderVehiclesTable(); }

/* ══════════════════════════════════════
   MOTORCYCLES TABLE
══════════════════════════════════════ */
function renderMotosTable(){
    const data=getFiltered('motorcycles'),total=data.length;
    const totalPages=Math.max(1,Math.ceil(total/ST.mot.perPage));
    if(ST.mot.page>totalPages) ST.mot.page=1;
    const start=(ST.mot.page-1)*ST.mot.perPage;
    const page=data.slice(start,start+ST.mot.perPage);
    const tbody=document.getElementById('motorcycles-tbody'); if(!tbody) return;
    tbody.innerHTML=page.map(m=>{ const ch=ST.mot.selected.has(m.id); return `<tr class="${ch?'row-selected':''}" onclick="openDetailPanel('${m.id}')"><td class="checkbox-col" onclick="toggleRowCheck('motorcycles','${m.id}',event)">${makeCb(ch)}</td><td><strong>${m.number}</strong></td><td><span class="badge moto" style="font-size:11px">${m.portal}</span></td><td>${m.ownerName}</td><td>${m.brand}</td><td>${m.model}</td><td>${m.plate!=='—'?`<code style="background:var(--bg-secondary);padding:2px 7px;border-radius:4px;font-size:12px;font-weight:600">${m.plate}</code>`:'—'}</td><td>${statusBadge(m.status)}</td><td onclick="event.stopPropagation()"><div style="display:flex;gap:4px"><button class="icon-btn" style="width:28px;height:28px" onclick="openEdit('${m.id}')"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button><button class="icon-btn" style="width:28px;height:28px;color:var(--accent-red)" onclick="confirmDeleteSingle('${m.id}','motorcycles')"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button></div></td></tr>`; }).join('');
    renderPagination('motos-pg-info','motos-pg-controls',ST.mot.page,totalPages,start,ST.mot.perPage,total,p=>{ST.mot.page=p;renderMotosTable();});
    updateBulkBar('motorcycles'); lucide.createIcons();
}
function onMotosSearch(q){ ST.mot.search=q;ST.mot.page=1;ST.mot.selected.clear();renderMotosTable(); }
function onMotosPortal(p){ ST.mot.portal=p;ST.mot.page=1;ST.mot.selected.clear();renderMotosTable(); }

/* ══════════════════════════════════════
   OWNERS GRID
══════════════════════════════════════ */
function renderOwnersGrid(){
    const data=getFiltered('owners'),total=data.length;
    const totalPages=Math.max(1,Math.ceil(total/ST.own.perPage));
    if(ST.own.page>totalPages) ST.own.page=1;
    const start=(ST.own.page-1)*ST.own.perPage;
    const page=data.slice(start,start+ST.own.perPage);
    const sub=document.getElementById('owners-subtitle'); if(sub) sub.textContent=`${total} propietario${total!==1?'s':''} en el directorio`;
    const g=document.getElementById('owners-grid'); if(!g) return;
    if(page.length===0){ g.innerHTML=`<div style="grid-column:1/-1;padding:60px;text-align:center;color:var(--text-muted)"><div style="font-size:40px;margin-bottom:12px">👤</div><div style="font-size:14px;font-weight:600;margin-bottom:4px">No hay propietarios</div><div style="font-size:12.5px">Usa el botón Añadir Propietario</div></div>`; document.getElementById('owners-pagination').style.display='none'; return; }
    g.innerHTML=page.map(o=>{ const ch=ST.own.selected.has(o.id); const spots=DB.spots.filter(s=>s.ownerName===o.fullName); return `<div class="owner-card ${ch?'card-selected':''}"><div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px"><div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0"><div onclick="toggleRowCheck('owners','${o.id}',event)" style="cursor:pointer;flex-shrink:0">${makeCb(ch)}</div><div style="width:40px;height:40px;border-radius:50%;background:${avatarColor(o.fullName)};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${inits(o.fullName)}</div><div style="min-width:0"><div style="font-weight:700;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.fullName}</div><div style="font-size:11.5px;color:var(--text-secondary)">${o.portal} · ${o.vivienda}</div></div></div><div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px"><button class="icon-btn" style="width:28px;height:28px" onclick="openEditOwner('${o.id}')"><i data-lucide="edit-2" style="width:12px;height:12px;"></i></button><button class="icon-btn" style="width:28px;height:28px;color:var(--accent-red)" onclick="confirmDeleteOwner('${o.id}')"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button></div></div><div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"><div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary)"><i data-lucide="phone" style="width:12px;height:12px;flex-shrink:0"></i><span>${o.phone}</span></div><div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);overflow:hidden"><i data-lucide="mail" style="width:12px;height:12px;flex-shrink:0"></i><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.email}</span></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border-primary)">${spots.length>0?`<span class="badge primary">${spots.length} plaza${spots.length>1?'s':''}</span>`:'<span style="color:var(--text-muted);font-size:11.5px">Sin plazas</span>'}<div style="font-size:11px;color:var(--text-muted)">${o.createdAt||''}</div></div></div>`; }).join('');
    document.getElementById('owners-pagination').style.display='flex';
    renderPagination('owners-pg-info','owners-pg-controls',ST.own.page,totalPages,start,ST.own.perPage,total,p=>{ST.own.page=p;renderOwnersGrid();});
    updateBulkBar('owners'); lucide.createIcons();
}
function onOwnersSearch(q){ ST.own.search=q;ST.own.page=1;ST.own.selected.clear();renderOwnersGrid(); }
function onOwnersPortal(p){ ST.own.portal=p;ST.own.page=1;ST.own.selected.clear();renderOwnersGrid(); }

/* ══════════════════════════════════════
   OWNER MODAL
══════════════════════════════════════ */
function openAddOwnerModal(){ ST.editOwner=null; document.getElementById('owner-modal-title').textContent='Añadir Propietario'; document.getElementById('owner-modal-subtitle').textContent='Introduce los datos del nuevo propietario'; ['ow-nombre','ow-apellidos','ow-dni','ow-tel','ow-email','ow-vivienda','ow-obs'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); document.getElementById('owner-modal-overlay').classList.add('open'); }
function openEditOwner(id){ const o=DB.owners.find(x=>x.id===id); if(!o) return; ST.editOwner=id; document.getElementById('owner-modal-title').textContent='Editar Propietario'; document.getElementById('owner-modal-subtitle').textContent=`Editando: ${o.fullName}`; const parts=o.fullName.split(' '); document.getElementById('ow-nombre').value=parts[0]||''; document.getElementById('ow-apellidos').value=parts.slice(1).join(' ')||''; document.getElementById('ow-tel').value=o.phone||''; document.getElementById('ow-email').value=o.email||''; document.getElementById('ow-portal').value=o.portal||PORTALS[0]; document.getElementById('ow-vivienda').value=o.vivienda||''; document.getElementById('ow-obs').value=o.obs||''; document.getElementById('owner-modal-overlay').classList.add('open'); }
function closeOwnerModal(){ document.getElementById('owner-modal-overlay').classList.remove('open'); }
function closeOwnerModalOnBg(e){ if(e.target===document.getElementById('owner-modal-overlay')) closeOwnerModal(); }
function saveOwner(){
    const nombre=document.getElementById('ow-nombre').value.trim(); if(!nombre){ showToast('error','Error','El nombre es obligatorio.'); return; }
    const fullName=`${nombre} ${document.getElementById('ow-apellidos').value.trim()}`.trim();
    const data={ fullName, phone:document.getElementById('ow-tel').value.trim()||'—', email:document.getElementById('ow-email').value.trim()||'—', portal:document.getElementById('ow-portal').value, vivienda:document.getElementById('ow-vivienda').value.trim()||'—', obs:document.getElementById('ow-obs').value.trim() };
    if(ST.editOwner){ const idx=DB.owners.findIndex(o=>o.id===ST.editOwner); if(idx!==-1) DB.owners[idx]={...DB.owners[idx],...data}; showToast('success','Actualizado','Propietario modificado.'); }
    else { DB.owners.push({id:uid(),createdAt:new Date().toISOString().slice(0,10),...data}); showToast('success','Creado','Propietario añadido.'); }
    closeOwnerModal(); updateBadges(); renderOwnersGrid(); renderKPIs();
}
function confirmDeleteOwner(id){ const o=DB.owners.find(x=>x.id===id); if(!o) return; const spots=DB.spots.filter(s=>s.ownerName===o.fullName).length; confirmAction(`Eliminar propietario`,`¿Eliminar a <strong>${o.fullName}</strong>?${spots>0?`<br><br><strong style="color:var(--accent-orange)">⚠️ Tiene ${spots} plaza${spots>1?'s':''} asignada${spots>1?'s':''}</strong>. Quedarán sin titular.`:''}`,()=>{ DB.owners=DB.owners.filter(x=>x.id!==id); ST.own.selected.delete(id); updateBadges(); renderOwnersGrid(); renderKPIs(); showToast('success','Eliminado',`"${o.fullName}" eliminado.`); }); }

/* ══════════════════════════════════════
   BULK DELETE
══════════════════════════════════════ */
function bulkDelete(type){
    const k=type==='vehicles'?'veh':type==='motorcycles'?'mot':'own';
    const sel=ST[k]; const n=sel.selected.size; if(n===0) return;
    const labels={vehicles:['vehículo','vehículos'],motorcycles:['motocicleta','motocicletas'],owners:['propietario','propietarios']};
    const[sing,plur]=labels[type]; const label=n===1?sing:plur;
    confirmAction(`Eliminar ${n} ${label}`,`¿Eliminar ${n===1?'el':'los'} ${n} ${label} seleccionado${n>1?'s':''}? Esta acción no se puede deshacer.`,()=>{
        if(type==='owners') sel.selected.forEach(id=>{ DB.owners=DB.owners.filter(o=>o.id!==id); });
        else sel.selected.forEach(id=>{ DB.spots=DB.spots.filter(s=>s.id!==id); });
        sel.selected.clear(); updateBadges(); renderKPIs();
        if(type==='vehicles') renderVehiclesTable();
        else if(type==='motorcycles') renderMotosTable();
        else renderOwnersGrid();
        showToast('success','Eliminados',`${n} ${label} eliminado${n>1?'s':''}.`);
    });
}

/* ══════════════════════════════════════
   SINGLE DELETE SPOT
══════════════════════════════════════ */
function confirmDeleteSingle(id,type){ const s=DB.spots.find(x=>x.id===id); if(!s) return; const label=type==='vehicles'?'vehículo':'motocicleta'; confirmAction(`Eliminar ${label}`,`¿Eliminar la plaza <strong>${s.number}</strong> — ${s.ownerName} — <code>${s.plate}</code>?`,()=>{ DB.spots=DB.spots.filter(x=>x.id!==id); if(type==='vehicles'){ ST.veh.selected.delete(id); renderVehiclesTable(); } else { ST.mot.selected.delete(id); renderMotosTable(); } closeDetailPanel(); updateBadges(); renderKPIs(); showToast('success','Eliminado',`Plaza ${s.number} eliminada.`); }); }

/* ══════════════════════════════════════
   FLOOR PLAN
══════════════════════════════════════ */
function renderFloor(spots){ const g=document.getElementById('floor-grid'); if(!g) return; g.innerHTML=spots.map(s=>`<div class="floor-spot ${s.status} ${s.type==='moto'?'moto':''}" onclick="openDetailPanel('${s.id}')" title="${s.number} — ${s.portal}"><span style="font-size:11px;font-weight:700">${s.number}</span><span style="font-size:9px;opacity:.75">${s.portal}</span></div>`).join(''); }
function filterFloor(portal){ renderFloor(portal?DB.spots.filter(s=>s.portal===portal):DB.spots); }

/* ══════════════════════════════════════
   STATS
══════════════════════════════════════ */
function renderStats(){
    const ctx=document.getElementById('stats-chart');
    if(ctx){ if(ST.charts.stats) ST.charts.stats.destroy(); const tc=ST.dark?'#94a3b8':'#475569'; ST.charts.stats=new Chart(ctx,{type:'bar',data:{labels:PORTALS,datasets:[{label:'Ocupadas',data:PORTALS.map(p=>DB.spots.filter(s=>s.portal===p&&s.status==='occupied').length),backgroundColor:'rgba(239,68,68,.75)',borderRadius:4},{label:'Libres',data:PORTALS.map(p=>DB.spots.filter(s=>s.portal===p&&s.status==='free').length),backgroundColor:'rgba(16,185,129,.75)',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,boxWidth:10,usePointStyle:true}}},scales:{x:{ticks:{color:tc,font:{size:9}},grid:{display:false}},y:{ticks:{color:tc}}}}}); }
    const sum=document.getElementById('stats-summary');
    if(sum){ const rows=[['Total plazas',DB.spots.length],['Coches',DB.spots.filter(s=>s.type==='car').length],['Motos',DB.spots.filter(s=>s.type==='moto').length],['Libres',DB.spots.filter(s=>s.status==='free').length],['Ocupadas',DB.spots.filter(s=>s.status==='occupied').length],['Reservadas',DB.spots.filter(s=>s.status==='reserved').length],['Propietarios',DB.owners.length],['Edificios',PORTALS.length]]; sum.innerHTML=rows.map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-secondary);font-size:13px"><span style="color:var(--text-secondary)">${l}</span><strong>${v}</strong></div>`).join(''); }
}

/* ══════════════════════════════════════
   SMART SEARCH
══════════════════════════════════════ */
function smartSearch(q){ const res=document.getElementById('search-results'); if(!res) return; if(!q){ res.innerHTML=''; return; } const ql=q.toLowerCase(); const spots=DB.spots.filter(s=>[s.number,s.ownerName,s.plate,s.portal,s.brand,s.model,s.color,s.ownerPhone,s.ownerEmail].join(' ').toLowerCase().includes(ql)); const owners=DB.owners.filter(o=>[o.fullName,o.phone,o.email,o.portal,o.vivienda].join(' ').toLowerCase().includes(ql)); if(!spots.length&&!owners.length){ res.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted)">Sin resultados para "<strong>${q}</strong>"</div>`; return; } let html=''; if(spots.length) html+=`<div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Plazas — ${spots.length}</div><div class="table-card" style="margin-bottom:16px"><table class="data-table"><thead><tr><th>Plaza</th><th>Edificio</th><th>Tipo</th><th>Titular</th><th>Matrícula</th><th>Estado</th></tr></thead><tbody>${spots.map(h=>`<tr onclick="openDetailPanel('${h.id}')"><td><strong>${h.number}</strong></td><td><span class="badge primary">${h.portal}</span></td><td>${h.type==='car'?'<span class="badge car">Coche</span>':'<span class="badge moto">Moto</span>'}</td><td>${h.ownerName}</td><td>${h.plate!=='—'?`<code>${h.plate}</code>`:'—'}</td><td>${statusBadge(h.status)}</td></tr>`).join('')}</tbody></table></div>`; if(owners.length) html+=`<div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Propietarios — ${owners.length}</div><div class="table-card"><table class="data-table"><thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Edificio</th><th>Vivienda</th></tr></thead><tbody>${owners.map(o=>`<tr><td><strong>${o.fullName}</strong></td><td>${o.phone}</td><td style="font-size:12px;color:var(--text-secondary)">${o.email}</td><td><span class="badge primary">${o.portal}</span></td><td>${o.vivienda}</td></tr>`).join('')}</tbody></table></div>`; res.innerHTML=html; lucide.createIcons(); }
function globalSearch(q){ navigate('search'); const inp=document.getElementById('smart-search-input'); if(inp){ inp.value=q; smartSearch(q); } }

/* ══════════════════════════════════════
   MODAL SPOT (ADD / EDIT)
══════════════════════════════════════ */
function openAddModal(type){ ST.editId=null; document.getElementById('modal-title').textContent=type==='motorcycle'?'Añadir Motocicleta':'Añadir Vehículo'; document.getElementById('modal-subtitle').textContent='Introduce los datos del nuevo registro'; ['f-plaza','f-owner','f-tel','f-marca','f-modelo','f-matricula','f-color'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); document.getElementById('f-tipo').value=type==='motorcycle'?'moto':'car'; document.getElementById('f-estado').value='free'; document.getElementById('modal-overlay').classList.add('open'); }
function openEdit(id){ const s=DB.spots.find(x=>x.id===id); if(!s) return; ST.editId=id; document.getElementById('modal-title').textContent='Editar Registro'; document.getElementById('modal-subtitle').textContent=`Plaza ${s.number} — ${s.portal}`; document.getElementById('f-plaza').value=s.number; document.getElementById('f-tipo').value=s.type; document.getElementById('f-portal').value=s.portal; document.getElementById('f-estado').value=s.status; document.getElementById('f-owner').value=s.ownerName!=='—'?s.ownerName:''; document.getElementById('f-tel').value=s.ownerPhone!=='—'?s.ownerPhone:''; document.getElementById('f-marca').value=s.brand!=='—'?s.brand:''; document.getElementById('f-modelo').value=s.model!=='—'?s.model:''; document.getElementById('f-matricula').value=s.plate!=='—'?s.plate:''; document.getElementById('f-color').value=s.color!=='—'?s.color:''; document.getElementById('modal-overlay').classList.add('open'); }
function closeModal(){ document.getElementById('modal-overlay').classList.remove('open'); }
function closeModalOnBg(e){ if(e.target===document.getElementById('modal-overlay')) closeModal(); }
function saveRecord(){ const plaza=document.getElementById('f-plaza').value.trim(); if(!plaza){ showToast('error','Error','El número de plaza es obligatorio.'); return; } const data={ number:plaza, portal:document.getElementById('f-portal').value, type:document.getElementById('f-tipo').value, status:document.getElementById('f-estado').value, ownerName:document.getElementById('f-owner').value.trim()||'—', ownerPhone:document.getElementById('f-tel').value.trim()||'—', ownerEmail:'—', brand:document.getElementById('f-marca').value.trim()||'—', model:document.getElementById('f-modelo').value.trim()||'—', plate:document.getElementById('f-matricula').value.trim()||'—', color:document.getElementById('f-color').value.trim()||'—' }; if(ST.editId){ const idx=DB.spots.findIndex(s=>s.id===ST.editId); if(idx!==-1) DB.spots[idx]={...DB.spots[idx],...data}; showToast('success','Actualizado','Registro modificado.'); } else { DB.spots.push({id:uid(),createdAt:new Date().toISOString().slice(0,10),...data}); showToast('success','Creado','Nuevo registro añadido.'); } closeModal(); updateBadges(); renderKPIs(); if(ST.page==='garages') renderVehiclesTable(); if(ST.page==='motorcycles') renderMotosTable(); if(ST.page==='spots') renderFloor(DB.spots); }

/* ══════════════════════════════════════
   DETAIL PANEL
══════════════════════════════════════ */
function openDetailPanel(id){ const s=DB.spots.find(x=>x.id===id); if(!s) return; document.getElementById('detail-title').textContent=`Plaza ${s.number}`; document.getElementById('detail-subtitle').textContent=s.portal; document.getElementById('detail-body').innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${statusBadge(s.status)} ${s.type==='car'?'<span class="badge car">Coche</span>':'<span class="badge moto">Moto</span>'}</div><div class="form-section-title">Ubicación</div>${dRow('Plaza',s.number)}${dRow('Edificio',s.portal)}<div class="form-section-title">Propietario</div>${dRow('Titular',s.ownerName)}${dRow('Teléfono',s.ownerPhone)}${dRow('Email',s.ownerEmail)}<div class="form-section-title">Vehículo</div>${dRow('Marca',s.brand)}${dRow('Modelo',s.model)}${dRow('Matrícula',s.plate)}${dRow('Color',s.color)}<div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="openEdit('${s.id}')"><i data-lucide="edit-2" style="width:12px;height:12px;"></i> Editar</button><button class="btn btn-danger btn-sm" onclick="confirmDeleteSingle('${s.id}','${s.type==='car'?'vehicles':'motorcycles'}')"><i data-lucide="trash-2" style="width:12px;height:12px;"></i> Eliminar</button></div>`; document.getElementById('detail-panel').classList.add('open'); lucide.createIcons(); }
function dRow(l,v){ return `<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${v||'—'}</span></div>`; }
function closeDetailPanel(){ document.getElementById('detail-panel').classList.remove('open'); }

/* ══════════════════════════════════════
   PAGINATION
══════════════════════════════════════ */
function renderPagination(infoId,ctrlId,current,totalPages,start,perPage,total,cb){ const info=document.getElementById(infoId),ctrl=document.getElementById(ctrlId); if(info) info.textContent=total===0?'Sin resultados':`Mostrando ${start+1}–${Math.min(start+perPage,total)} de ${total}`; if(!ctrl) return; ctrl.innerHTML=''; const add=(label,page,disabled=false,active=false)=>{ const b=document.createElement('button'); b.className='page-btn'+(active?' active':''); b.innerHTML=label; b.disabled=disabled; b.onclick=()=>cb(page); ctrl.appendChild(b); }; add('<i data-lucide="chevron-left" style="width:12px;height:12px;"></i>',current-1,current===1); const range=[]; if(totalPages<=7) for(let i=1;i<=totalPages;i++) range.push(i); else { range.push(1); if(current>3) range.push('…'); for(let i=Math.max(2,current-1);i<=Math.min(totalPages-1,current+1);i++) range.push(i); if(current<totalPages-2) range.push('…'); range.push(totalPages); } range.forEach(p=>{ if(p==='…'){ const s=document.createElement('span'); s.textContent='…'; s.style.cssText='padding:0 6px;color:var(--text-muted);font-size:12px;'; ctrl.appendChild(s); } else add(p,p,false,p===current); }); add('<i data-lucide="chevron-right" style="width:12px;height:12px;"></i>',current+1,current===totalPages); lucide.createIcons(); }

/* ══════════════════════════════════════
   CONFIRM
══════════════════════════════════════ */
function confirmAction(title,msg,cb){ ST.confirmCb=cb; document.getElementById('confirm-title').textContent=title; document.getElementById('confirm-msg').innerHTML=msg; document.getElementById('confirm-overlay').classList.add('open'); }
function executeConfirm(){ if(ST.confirmCb) ST.confirmCb(); closeConfirm(); }
function closeConfirm(){ document.getElementById('confirm-overlay').classList.remove('open'); ST.confirmCb=null; }

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(type,title,message){ const c=document.getElementById('toast-container'); const t=document.createElement('div'); t.className=`toast ${type}`; t.innerHTML=`<div class="toast-msg"><strong style="display:block;margin-bottom:1px">${title}</strong>${message}</div><button class="toast-x" onclick="removeToast(this.parentElement)">✕</button>`; c.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>removeToast(t),4000); }
function removeToast(t){ if(!t) return; t.classList.add('hide'); setTimeout(()=>t.remove(),350); }

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeModal(); closeDetailPanel(); closeConfirm(); closeAdminModal(); closeOwnerModal(); } if((e.ctrlKey||e.metaKey)&&e.key==='k'){ e.preventDefault(); navigate('search'); document.getElementById('smart-search-input')?.focus(); } if((e.ctrlKey||e.metaKey)&&e.key==='n'){ e.preventDefault(); openAddModal(); } });

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
function init(){
    populatePortalSelects();
    generateData();
    updateAdminUI();
    updateBadges();
    renderKPIs();
    setTimeout(renderCharts,80);
    lucide.createIcons();
    showToast('info','GarageOS listo','Ctrl+K buscar · Ctrl+N añadir · Esc cerrar');
}
init();
