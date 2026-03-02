import { useState, useMemo, useRef, useEffect } from "react";


// ═══════════════════════════════════════════════════════
// BASE DE DONNÉES ALIMENTS (défaut)
// ═══════════════════════════════════════════════════════
const ALIMENTS_DEFAULT = [
  { id:1,  nom:"Foin de prairie",       cat:"Fourrage",  ms:85, ufv:0.58, pdi:72,  ca:5.5,  p:2.8,  mg:2.0, k:20,  cell:320, prix:0.12, ueb:1.35 },
  { id:2,  nom:"Foin de luzerne",       cat:"Fourrage",  ms:87, ufv:0.67, pdi:100, ca:14.0, p:2.5,  mg:2.8, k:25,  cell:290, prix:0.18, ueb:1.20 },
  { id:3,  nom:"Ensilage de maïs",      cat:"Fourrage",  ms:33, ufv:0.88, pdi:68,  ca:2.5,  p:2.0,  mg:1.5, k:12,  cell:190, prix:0.04, ueb:1.05 },
  { id:4,  nom:"Ensilage d'herbe",      cat:"Fourrage",  ms:30, ufv:0.74, pdi:80,  ca:6.0,  p:3.0,  mg:2.2, k:28,  cell:280, prix:0.03, ueb:1.25 },
  { id:5,  nom:"Enrubanné",             cat:"Fourrage",  ms:50, ufv:0.78, pdi:82,  ca:5.0,  p:3.0,  mg:2.0, k:25,  cell:270, prix:0.05, ueb:1.15 },
  { id:6,  nom:"Paille de blé",         cat:"Fourrage",  ms:88, ufv:0.32, pdi:26,  ca:3.0,  p:0.8,  mg:1.0, k:10,  cell:420, prix:0.06, ueb:1.80 },
  { id:7,  nom:"Foin de ray-grass",     cat:"Fourrage",  ms:85, ufv:0.70, pdi:85,  ca:5.0,  p:3.2,  mg:2.0, k:24,  cell:260, prix:0.14, ueb:1.15 },
  { id:8,  nom:"Regain de prairie",     cat:"Fourrage",  ms:85, ufv:0.72, pdi:90,  ca:6.0,  p:3.0,  mg:2.2, k:22,  cell:250, prix:0.16, ueb:1.10 },
  { id:9,  nom:"Orge aplatie",          cat:"Concentré", ms:87, ufv:1.09, pdi:85,  ca:0.5,  p:3.5,  mg:1.2, k:5,   cell:50,  prix:0.22, ueb:0.45 },
  { id:10, nom:"Maïs grain",            cat:"Concentré", ms:87, ufv:1.22, pdi:80,  ca:0.3,  p:3.0,  mg:1.2, k:3.6, cell:25,  prix:0.24, ueb:0.40 },
  { id:11, nom:"Blé aplati",            cat:"Concentré", ms:87, ufv:1.17, pdi:90,  ca:0.5,  p:3.5,  mg:1.2, k:4.5, cell:28,  prix:0.21, ueb:0.45 },
  { id:12, nom:"Tourteau de soja 48",   cat:"Concentré", ms:87, ufv:1.12, pdi:260, ca:3.0,  p:6.5,  mg:3.0, k:22,  cell:60,  prix:0.42, ueb:0.40 },
  { id:13, nom:"Tourteau de colza",     cat:"Concentré", ms:89, ufv:0.97, pdi:160, ca:7.0,  p:11.0, mg:5.5, k:13,  cell:120, prix:0.30, ueb:0.50 },
  { id:14, nom:"Drêches de blé",        cat:"Concentré", ms:91, ufv:0.92, pdi:140, ca:1.0,  p:8.5,  mg:2.0, k:2,   cell:100, prix:0.18, ueb:0.55 },
  { id:15, nom:"Pulpe de betterave",    cat:"Concentré", ms:88, ufv:0.98, pdi:88,  ca:10.0, p:1.0,  mg:2.0, k:8,   cell:200, prix:0.20, ueb:0.55 },
  { id:16, nom:"Luzerne déshydratée",   cat:"Concentré", ms:90, ufv:0.78, pdi:120, ca:15.0, p:2.8,  mg:2.8, k:25,  cell:200, prix:0.25, ueb:0.80 },
  { id:17, nom:"CMV bovin viande",      cat:"Complément",ms:95, ufv:0.00, pdi:0,   ca:140,  p:70,   mg:50,  k:0,   cell:0,   prix:0.80, ueb:0.00 },
  { id:18, nom:"CMV spécial vêlage",    cat:"Complément",ms:95, ufv:0.00, pdi:0,   ca:180,  p:80,   mg:60,  k:0,   cell:0,   prix:1.10, ueb:0.00 },
  { id:19, nom:"Sel (NaCl)",            cat:"Complément",ms:99, ufv:0.00, pdi:0,   ca:0,    p:0,    mg:0,   k:0,   cell:0,   prix:0.15, ueb:0.00 },
  { id:20, nom:"Carbonate de calcium",  cat:"Complément",ms:99, ufv:0.00, pdi:0,   ca:380,  p:0,    mg:0,   k:0,   cell:0,   prix:0.10, ueb:0.00 },
  { id:21, nom:"Phosphate bicalcique",  cat:"Complément",ms:99, ufv:0.00, pdi:0,   ca:260,  p:180,  mg:0,   k:0,   cell:0,   prix:0.45, ueb:0.00 },
];

// ═══════════════════════════════════════════════════════
// CALCULS INRA CORRIGÉS
// ═══════════════════════════════════════════════════════
function calculBesoins(moisGest, poids, prodLait, poidsVeau) {
  const entretien = 0.0536 * Math.pow(poids, 0.75);
  const besGest = moisGest >= 1 ? 0.000695 * poidsVeau * Math.exp(0.5023 * moisGest) : 0;
  const besLact = moisGest <= 7 ? 0.44 * prodLait : 0;
  const ufv = +(entretien + besGest + besLact).toFixed(2);

  let ci;
  const laitCI = moisGest <= 7 ? prodLait / 4 : 0;
  if (moisGest <= 6) ci = poids * 0.02 + laitCI;
  else if (moisGest === 7) ci = poids * 0.0183 + laitCI;
  else if (moisGest === 8) ci = poids * 0.0167;
  else ci = poids * 0.015;
  ci = +ci.toFixed(2);

  let pdiConc, pdiUflCible;
  if (moisGest <= 6) { pdiConc = 70; pdiUflCible = 110; }
  else if (moisGest === 7) { pdiConc = 72.5; pdiUflCible = 95; }
  else { pdiConc = 85; pdiUflCible = 105; }
  const pdi = Math.round(ci * pdiConc);

  // Besoins minéraux par concentration (g/kg MS)
  const concMin = moisGest <= 6 ? {ca:[6,6.5],p:[3,3.5],mg:[2,2.5],k:[13,15]} : moisGest <= 8 ? {ca:[5,6],p:[3,3.5],mg:[2,2],k:[13,13]} : {ca:[6,7],p:[3,3.5],mg:[2.5,3.5],k:[0,13]};
  const ca = +(ci * (concMin.ca[0]+concMin.ca[1])/2).toFixed(1);
  const pVal = +(ci * (concMin.p[0]+concMin.p[1])/2).toFixed(1);
  const mg = +(ci * (concMin.mg[0]+concMin.mg[1])/2).toFixed(1);

  let periode;
  if (moisGest === 0) periode = "Lactation";
  else if (moisGest <= 6) periode = `Lact. + Gest. ${moisGest}m`;
  else if (moisGest === 7) periode = "Tarissement";
  else periode = "Prépa vêlage";

  return { ufv, ci, pdi, pdiConc, pdiUflCible, ca, p: pVal, mg, concMin, periode, entretien: +entretien.toFixed(2), besGest: +besGest.toFixed(2), besLact: +besLact.toFixed(2) };
}

function calculRation(lignes, besoins, aliments) {
  const encFixe = lignes.filter(l => l.mode === "fixe" && l.aliment).reduce((s, l) => {
    const al = aliments.find(a => a.id === l.aliment);
    return s + (l.qte || 0) * (al?.ueb || 0);
  }, 0);
  const capRest = Math.max(0, besoins.ci - encFixe);
  return lignes.map(l => {
    if (!l.aliment) return { ...l, qteEff: 0 };
    const al = aliments.find(a => a.id === l.aliment);
    if (!al) return { ...l, qteEff: 0 };
    if (l.mode === "fixe") return { ...l, qteEff: l.qte || 0, al };
    if (l.mode === "volonte" && al.ueb > 0 && l.pct > 0) {
      return { ...l, qteEff: +(capRest * (l.pct / 100) / al.ueb).toFixed(2), al };
    }
    return { ...l, qteEff: 0, al };
  });
}

function calculTotaux(rationCalc) {
  let ms=0,ufv=0,pdi=0,ca=0,p=0,mg=0,k=0,enc=0,cout=0,msF=0;
  rationCalc.forEach(l => {
    if (!l.al || l.qteEff <= 0) return;
    ms+=l.qteEff; ufv+=l.qteEff*l.al.ufv; pdi+=l.qteEff*l.al.pdi;
    ca+=l.qteEff*l.al.ca; p+=l.qteEff*l.al.p; mg+=l.qteEff*(l.al.mg||0); k+=l.qteEff*(l.al.k||0); enc+=l.qteEff*l.al.ueb;
    cout+=l.qteEff*l.al.prix; if(l.al.cat==="Fourrage") msF+=l.qteEff;
  });
  return { ms:+ms.toFixed(2), ufv:+ufv.toFixed(2), pdi:Math.round(pdi), ca:+ca.toFixed(1), p:+p.toFixed(1), mg:+mg.toFixed(1), k:+k.toFixed(1), enc:+enc.toFixed(2), cout:+cout.toFixed(2), pctF:ms>0?Math.round(msF/ms*100):0, pdiKg:ms>0?+(pdi/ms).toFixed(1):0, pdiUfl:ufv>0?Math.round(pdi/ufv):0, caKg:ms>0?+(ca/ms).toFixed(1):0, pKg:ms>0?+(p/ms).toFixed(1):0, mgKg:ms>0?+(mg/ms).toFixed(1):0, kKg:ms>0?+(k/ms).toFixed(1):0 };
}

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════
const C = {
  bg:"#0C1A0E", bgCard:"#132117", bgCard2:"#1A2E1F",
  green:"#4CAF50", greenLight:"#81C784", greenDark:"#2E7D32", greenFaint:"rgba(76,175,80,0.08)",
  amber:"#FFB300", amberLight:"#FFD54F", amberFaint:"rgba(255,179,0,0.1)",
  red:"#EF5350", redFaint:"rgba(239,83,80,0.1)",
  blue:"#42A5F5", blueFaint:"rgba(66,165,245,0.08)",
  text:"#E8F5E9", textSec:"#A5D6A7", textDim:"#5C7C5E",
  border:"rgba(76,175,80,0.15)", borderAct:"rgba(76,175,80,0.4)",
  violet:"#CE93D8", violetFaint:"rgba(206,147,216,0.1)",
};

if (typeof document !== 'undefined') {
  const l = document.createElement('link');
  l.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap';
  l.rel = 'stylesheet'; document.head.appendChild(l);
}

const DEFAULT_RATION = [
  { id:1, aliment:1, mode:"volonte", pct:60, qte:0 },
  { id:2, aliment:3, mode:"volonte", pct:40, qte:0 },
  { id:3, aliment:6, mode:"fixe", pct:0, qte:1.0 },
  { id:4, aliment:9, mode:"fixe", pct:0, qte:1.5 },
  { id:5, aliment:13, mode:"fixe", pct:0, qte:0.5 },
  { id:6, aliment:17, mode:"fixe", pct:0, qte:0.15 },
];

// ═══════════════════════════════════════════════════════
// COMPOSANTS
// ═══════════════════════════════════════════════════════
const Pill = ({children,active,onClick,color=C.green}) => (
  <button onClick={onClick} style={{padding:"8px 14px",borderRadius:50,border:`1.5px solid ${active?color:C.border}`,background:active?color+"22":"transparent",color:active?color:C.textDim,fontFamily:"Outfit",fontWeight:active?700:500,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{children}</button>
);

const Field = ({label,value,onChange,type="text",placeholder="",small=false,numeric=false}) => (
  <div style={{marginBottom:8}}>
    {label && <label style={{fontSize:10,color:C.textDim,fontWeight:600,display:"block",marginBottom:3}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(numeric?+e.target.value:e.target.value)} placeholder={placeholder}
      style={{background:C.bgCard2,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,padding:small?"8px 10px":"10px 12px",fontSize:small?12:14,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:numeric?"JetBrains Mono":"Outfit"}} />
  </div>
);

const ProgressRing = ({pct,color,size=42}) => {
  const r=(size-6)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={4}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={circ*(1-Math.min(Math.min(pct,150),100)/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s ease"}}/>
    </svg>
  );
};

const BilanRow = ({label,icon,apport,besoin,unit}) => {
  const pct=besoin>0?(apport/besoin)*100:100;
  const color=pct>=90&&pct<=110?C.green:pct>=80&&pct<=120?C.amber:C.red;
  const st=pct>=90&&pct<=110?"✅":pct>=80&&pct<=120?"⚠️":"❌";
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
      <div style={{position:"relative"}}><ProgressRing pct={pct} color={color}/><div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>{icon}</div></div>
      <div style={{flex:1}}>
        <div style={{fontSize:11,fontWeight:600,color:C.text}}>{label}</div>
        <div style={{fontSize:10,color:C.textDim}}><span style={{color,fontWeight:700,fontFamily:"JetBrains Mono"}}>{apport.toFixed(1)}</span> / {besoin.toFixed(1)} {unit}</div>
      </div>
      <div style={{fontSize:12,fontWeight:800,color,fontFamily:"JetBrains Mono"}}>{Math.round(pct)}% {st}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════
export default function RationProApp() {
  const [tab, setTab] = useState("ration");
  const [moisGest, setMoisGest] = useState(9);
  const [poids, setPoids] = useState(650);
  const [nec, setNec] = useState(3.0);
  const [prodLait, setProdLait] = useState(8);
  const [poidsVeau, setPoidsVeau] = useState(45);
  const [lignes, setLignes] = useState(DEFAULT_RATION);
  const [aliments, setAliments] = useState(JSON.parse(JSON.stringify(ALIMENTS_DEFAULT)));
  const [showAdd, setShowAdd] = useState(false);
  const [catFiltre, setCatFiltre] = useState("Tous");
  const [savedRations, setSavedRations] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [editAliment, setEditAliment] = useState(null);
  const [editValues, setEditValues] = useState({});
  const nextId = useRef(7);
  const nextAlId = useRef(22);

  // Éleveur & Lot
  const [eleveur, setEleveur] = useState({ nom:"", exploitation:"", adresse:"", tel:"", notes:"" });
  const [lots, setLots] = useState([{ id:1, nom:"Lot 1", nbAnimaux:30, race:"Charolaise", notes:"" }]);
  const [lotActif, setLotActif] = useState(1);
  const [showAddLot, setShowAddLot] = useState(false);

  const besoins = useMemo(() => calculBesoins(moisGest, poids, prodLait, poidsVeau), [moisGest, poids, prodLait, poidsVeau]);
  const rationCalc = useMemo(() => {
    const calc = calculRation(lignes, besoins, aliments);
    return calc.map(l => ({ ...l, al: aliments.find(a => a.id === l.aliment) }));
  }, [lignes, besoins, aliments]);
  const totaux = useMemo(() => calculTotaux(rationCalc), [rationCalc]);
  const totalPct = lignes.filter(l => l.mode === "volonte" && l.aliment).reduce((s, l) => s + (l.pct || 0), 0);
  const showLait = moisGest <= 7;
  const lot = lots.find(l => l.id === lotActif);

  const addAliment = id => { setLignes(p => [...p, { id: nextId.current++, aliment: id, mode: "fixe", pct: 0, qte: 1.0 }]); setShowAdd(false); };
  const removeLigne = id => setLignes(p => p.filter(l => l.id !== id));
  const updateLigne = (id, f, v) => setLignes(p => p.map(l => l.id === id ? { ...l, [f]: v } : l));

  const saveRation = () => {
    if (!saveName.trim()) return;
    setSavedRations(p => [...p, { name: saveName, date: new Date().toLocaleDateString("fr-FR"), moisGest, poids, nec, prodLait, poidsVeau, lignes: [...lignes], eleveur: {...eleveur}, lot: lot ? {...lot} : null }]);
    setShowSave(false); setSaveName("");
  };
  const loadRation = r => {
    setMoisGest(r.moisGest); setPoids(r.poids); setNec(r.nec); setProdLait(r.prodLait);
    setPoidsVeau(r.poidsVeau); setLignes(r.lignes); if(r.eleveur) setEleveur(r.eleveur); setShowLoad(false);
  };
  const deleteRation = i => setSavedRations(p => p.filter((_,idx) => idx !== i));

  // Aliment personnalisé
  const startEditAliment = al => { setEditAliment(al.id); setEditValues({...al}); };
  const saveEditAliment = () => {
    setAliments(p => p.map(a => a.id === editAliment ? {...editValues} : a));
    setEditAliment(null);
  };
  const dupAliment = al => {
    const newAl = { ...al, id: nextAlId.current++, nom: al.nom + " (perso)" };
    setAliments(p => [...p, newAl]);
  };
  const resetAliment = id => {
    const orig = ALIMENTS_DEFAULT.find(a => a.id === id);
    if (orig) setAliments(p => p.map(a => a.id === id ? {...orig} : a));
  };

  const exportText = () => {
    let t = `RATIONPRO — ${eleveur.nom || "Éleveur"} — ${eleveur.exploitation || ""}\n`;
    t += `Lot: ${lot?.nom || "-"} (${lot?.nbAnimaux || 0} ${lot?.race || ""})\n${"═".repeat(50)}\n`;
    t += `${besoins.periode} | ${poids}kg | Mois ${moisGest} | Veau ${poidsVeau}kg${showLait ? ` | Lait ${prodLait}kg/j` : ""}\n\n`;
    t += `BESOINS: UFV=${besoins.ufv} | PDI=${besoins.pdi}g (${besoins.pdiConc}g/kg) | CI=${besoins.ci}kg MS\n\n`;
    t += `RATION:\n`;
    rationCalc.filter(l => l.al && l.qteEff > 0).forEach(l => {
      t += `  ${l.al.nom}: ${l.qteEff.toFixed(2)} kg MS (${l.mode === "volonte" ? `Vol.${l.pct}%` : "Fixe"})\n`;
    });
    t += `\nTOTAUX: MS=${totaux.ms}kg | UFV=${totaux.ufv} | PDI=${totaux.pdi}g | PDI/UFL=${totaux.pdiUfl}\n`;
    t += `Enc=${totaux.enc}/${besoins.ci} UEB | Coût=${totaux.cout}€/j (${(totaux.cout*30).toFixed(0)}€/mois)\n`;
    if(lot) t += `\nCoût lot/jour: ${(totaux.cout*(lot.nbAnimaux||1)).toFixed(2)}€ | /mois: ${(totaux.cout*(lot.nbAnimaux||1)*30).toFixed(0)}€\n`;
    const blob = new Blob([t], { type: "text/plain" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ration_${(lot?.nom||"").replace(/\s/g,"_")}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const moisLabel = moisGest === 0 ? "Lactation seule" : moisGest <= 6 ? `Mois ${moisGest} — Lact.+Gest.` : moisGest === 7 ? "Mois 7 — Tarissement" : moisGest === 8 ? "Mois 8 — Prépa vêlage" : "Mois 9 — Terme";
  const moisColor = moisGest <= 6 ? C.green : moisGest === 7 ? C.amber : C.red;

  const S = {
    app:{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"Outfit,sans-serif",maxWidth:480,margin:"0 auto",paddingBottom:80},
    header:{background:`linear-gradient(145deg,${C.greenDark} 0%,#1a3a1e 100%)`,padding:"14px 14px 12px",overflow:"hidden"},
    card:{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:12,marginBottom:8},
    input:{background:C.bgCard2,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,padding:"10px 12px",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"Outfit"},
    btn:(bg=C.green,c="#fff")=>({padding:"12px 20px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:bg,color:c,fontFamily:"Outfit",width:"100%"}),
    tabBar:{position:"fixed",bottom:0,left:0,right:0,background:C.bgCard,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,maxWidth:480,margin:"0 auto"},
    tabBtn:a=>({flex:1,padding:"8px 0 10px",border:"none",background:"transparent",color:a?C.green:C.textDim,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:"Outfit",fontSize:9,fontWeight:a?700:500,borderTop:a?`3px solid ${C.green}`:"3px solid transparent"}),
  };

  return (
    <div style={S.app}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{margin:0,fontSize:20,fontWeight:800}}>🐄 RationPro</h1>
            <p style={{margin:"1px 0 0",fontSize:10,color:C.textSec}}>
              {eleveur.nom ? `${eleveur.nom}` : "Vaches Allaitantes"}{lot ? ` — ${lot.nom}` : ""}
            </p>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>setShowLoad(true)} style={{background:C.greenFaint,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",color:C.greenLight,cursor:"pointer",fontSize:14}}>📂</button>
            <button onClick={()=>{setShowSave(true);setSaveName("")}} style={{background:C.greenFaint,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",color:C.greenLight,cursor:"pointer",fontSize:14}}>💾</button>
            <button onClick={exportText} style={{background:C.greenFaint,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",color:C.greenLight,cursor:"pointer",fontSize:14}}>📄</button>
          </div>
        </div>
        {/* SLIDER MOIS */}
        <div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:"rgba(0,0,0,0.25)",border:`1px solid ${moisColor}30`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:11,fontWeight:700,color:moisColor}}>{moisLabel}</span>
            <span style={{fontSize:18,fontWeight:800,color:moisColor,fontFamily:"JetBrains Mono"}}>{moisGest}</span>
          </div>
          <input type="range" min={0} max={9} step={1} value={moisGest} onChange={e=>setMoisGest(+e.target.value)} style={{width:"100%",accentColor:moisColor}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:7,color:C.textDim,marginTop:1}}>
            <span>🍼 Lactation</span><span>Gestation →</span><span>🤰 Vêlage</span>
          </div>
        </div>
        {/* PARAMS TOGGLE */}
        <button onClick={()=>setShowParams(!showParams)} style={{width:"100%",marginTop:6,padding:"7px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.greenFaint,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:C.textSec}}>{poids}kg · NEC {nec} · Veau {poidsVeau}kg{showLait?` · ${prodLait}kg lait`:""}</span>
          <span style={{fontSize:10,color:C.textDim}}>{showParams?"▲":"▼"}</span>
        </button>
        {showParams && (
          <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:6}}>
            {[["Poids (kg)",poids,setPoids,400,900,10,true],["NEC",nec,setNec,1,5,0.5,true],["Veau (kg)",poidsVeau,setPoidsVeau,25,65,1,moisGest>=1],["Lait (kg/j)",prodLait,setProdLait,0,20,1,showLait]].filter(x=>x[6]).map(([l,v,s,mn,mx,st])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                <label style={{fontSize:10,color:C.textSec,width:70,fontWeight:600}}>{l}</label>
                <input type="range" min={mn} max={mx} step={st} value={v} onChange={e=>s(+e.target.value)} style={{flex:1,accentColor:C.green}}/>
                <span style={{fontSize:12,fontWeight:700,color:C.greenLight,fontFamily:"JetBrains Mono",width:36,textAlign:"right"}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BESOINS RAPIDES */}
      <div style={{padding:"8px 12px 0",display:"flex",gap:4}}>
        {[
          {i:"⚡",v:besoins.ufv,u:"UFV",l:"Énergie",c:C.greenLight},
          {i:"🧬",v:besoins.pdi,u:"g PDI",l:`${besoins.pdiConc}g/kg`,c:C.greenLight},
          {i:"📏",v:besoins.ci,u:"kg MS",l:"Capacité",c:C.amberLight},
          {i:"💰",v:totaux.cout.toFixed(2),u:"€/j",l:lot?`${(totaux.cout*(lot.nbAnimaux||1)).toFixed(0)}€/j lot`:"Coût",c:C.amber},
        ].map((b,i)=>(
          <div key={i} style={{textAlign:"center",padding:"8px 3px",background:C.greenFaint,borderRadius:12,flex:"1 1 0",minWidth:60}}>
            <div style={{fontSize:16}}>{b.i}</div>
            <div style={{fontSize:16,fontWeight:800,color:b.c,fontFamily:"JetBrains Mono"}}>{b.v}</div>
            <div style={{fontSize:7,color:C.textDim}}>{b.u}</div>
            <div style={{fontSize:7,color:C.textDim}}>{b.l}</div>
          </div>
        ))}
      </div>

      {/* CONTENU */}
      <div style={{padding:"8px 12px"}}>

        {/* ═══ ÉLEVEUR ═══ */}
        {tab === "eleveur" && (
          <>
            <h2 style={{margin:"0 0 10px",fontSize:15,fontWeight:700}}>👤 Éleveur</h2>
            <div style={S.card}>
              <Field label="Nom de l'éleveur" value={eleveur.nom} onChange={v=>setEleveur(p=>({...p,nom:v}))} placeholder="Ex: GAEC Dupont"/>
              <Field label="Exploitation" value={eleveur.exploitation} onChange={v=>setEleveur(p=>({...p,exploitation:v}))} placeholder="Nom de l'exploitation"/>
              <Field label="Adresse" value={eleveur.adresse} onChange={v=>setEleveur(p=>({...p,adresse:v}))} placeholder="Commune, département"/>
              <Field label="Téléphone" value={eleveur.tel} onChange={v=>setEleveur(p=>({...p,tel:v}))} placeholder="06..."/>
              <Field label="Notes" value={eleveur.notes} onChange={v=>setEleveur(p=>({...p,notes:v}))} placeholder="Remarques..."/>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"14px 0 8px"}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:700}}>🐄 Lots d'animaux</h2>
              <button onClick={()=>{ const id=lots.length+1; setLots(p=>[...p,{id,nom:`Lot ${id}`,nbAnimaux:20,race:"Charolaise",notes:""}]); setLotActif(id); }}
                style={{padding:"7px 14px",borderRadius:50,border:"none",background:C.green,color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"Outfit"}}>+ Lot</button>
            </div>

            {lots.map(lo => (
              <div key={lo.id} onClick={()=>setLotActif(lo.id)} style={{...S.card,borderLeft:`4px solid ${lo.id===lotActif?C.green:C.border}`,cursor:"pointer",background:lo.id===lotActif?C.bgCard2:C.bgCard}}>
                {lo.id === lotActif ? (
                  <>
                    <Field label="Nom du lot" value={lo.nom} onChange={v=>setLots(p=>p.map(l=>l.id===lo.id?{...l,nom:v}:l))} small/>
                    <div style={{display:"flex",gap:8}}>
                      <div style={{flex:1}}><Field label="Nb animaux" value={lo.nbAnimaux} onChange={v=>setLots(p=>p.map(l=>l.id===lo.id?{...l,nbAnimaux:v}:l))} type="number" numeric small/></div>
                      <div style={{flex:1}}><Field label="Race" value={lo.race} onChange={v=>setLots(p=>p.map(l=>l.id===lo.id?{...l,race:v}:l))} small/></div>
                    </div>
                    <Field label="Notes" value={lo.notes} onChange={v=>setLots(p=>p.map(l=>l.id===lo.id?{...l,notes:v}:l))} placeholder="Particularités..." small/>
                    {lots.length > 1 && (
                      <button onClick={e=>{e.stopPropagation();setLots(p=>p.filter(l=>l.id!==lo.id));setLotActif(lots[0].id)}}
                        style={{padding:"6px 12px",borderRadius:8,border:"none",background:C.redFaint,color:C.red,fontSize:11,fontWeight:700,cursor:"pointer",marginTop:4}}>Supprimer ce lot</button>
                    )}
                  </>
                ) : (
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{lo.nom}</div>
                      <div style={{fontSize:10,color:C.textDim}}>{lo.nbAnimaux} {lo.race}</div>
                    </div>
                    <span style={{fontSize:10,color:C.textDim}}>Tap pour modifier</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ═══ RATION ═══ */}
        {tab === "ration" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:700}}>🥩 Ration{lot?` — ${lot.nom}`:""}</h2>
              <button onClick={()=>setShowAdd(!showAdd)} style={{padding:"7px 14px",borderRadius:50,border:"none",background:C.green,color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"Outfit"}}>+ Ajouter</button>
            </div>

            {totalPct>0&&totalPct!==100&&<div style={{padding:"7px 10px",borderRadius:8,background:C.redFaint,border:`1px solid ${C.red}40`,marginBottom:8,fontSize:10,color:C.red,fontWeight:600}}>❌ Somme % = {totalPct}% (≠ 100%)</div>}

            {showAdd && (
              <div style={{...S.card,border:`1px solid ${C.borderAct}`}}>
                <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>
                  {["Tous","Fourrage","Concentré","Complément"].map(c=><Pill key={c} active={catFiltre===c} onClick={()=>setCatFiltre(c)}>{c}</Pill>)}
                </div>
                <div style={{maxHeight:200,overflowY:"auto"}}>
                  {aliments.filter(a=>(catFiltre==="Tous"||a.cat===catFiltre)&&!lignes.find(l=>l.aliment===a.id)).map(al=>(
                    <button key={al.id} onClick={()=>addAliment(al.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"8px 10px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",borderBottom:`1px solid ${C.border}`,textAlign:"left"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:"Outfit"}}>{al.nom}</div>
                        <div style={{fontSize:8,color:C.textDim,fontFamily:"JetBrains Mono"}}>UFV {al.ufv} · PDI {al.pdi}g · UEB {al.ueb}</div>
                      </div>
                      <span style={{fontSize:8,padding:"2px 6px",borderRadius:20,background:al.cat==="Fourrage"?C.greenFaint:al.cat==="Concentré"?C.amberFaint:C.blueFaint,color:al.cat==="Fourrage"?C.green:al.cat==="Concentré"?C.amber:C.blue,fontWeight:700}}>{al.cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {rationCalc.filter(l=>l.al).map(l=>(
              <div key={l.id} style={{...S.card,padding:10,borderLeft:`4px solid ${l.mode==="volonte"?C.violet:C.green}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700}}>{l.al.nom}</div>
                    <span style={{fontSize:7,padding:"2px 5px",borderRadius:20,background:l.al.cat==="Fourrage"?C.greenFaint:C.amberFaint,color:l.al.cat==="Fourrage"?C.green:C.amber,fontWeight:700}}>{l.al.cat} · UEB {l.al.ueb}</span>
                  </div>
                  <button onClick={()=>removeLigne(l.id)} style={{background:C.redFaint,border:"none",borderRadius:6,padding:"4px 7px",color:C.red,cursor:"pointer",fontSize:12,fontWeight:700}}>✕</button>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:6}}>
                  <Pill active={l.mode==="fixe"} onClick={()=>updateLigne(l.id,"mode","fixe")}>📌 Fixe</Pill>
                  <Pill active={l.mode==="volonte"} onClick={()=>updateLigne(l.id,"mode","volonte")} color={C.violet}>🌿 À volonté</Pill>
                </div>
                {l.mode==="fixe"?(
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>updateLigne(l.id,"qte",Math.max(0,+(((l.qte||0)-0.25).toFixed(2))))} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bgCard2,color:C.text,cursor:"pointer",fontSize:15,fontWeight:700}}>−</button>
                    <input type="number" value={l.qte||0} onChange={e=>updateLigne(l.id,"qte",Math.max(0,+e.target.value))} style={{...S.input,textAlign:"center",fontWeight:700,fontSize:15,fontFamily:"JetBrains Mono",flex:1}} step={0.1}/>
                    <button onClick={()=>updateLigne(l.id,"qte",+((l.qte||0)+0.25).toFixed(2))} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bgCard2,color:C.text,cursor:"pointer",fontSize:15,fontWeight:700}}>+</button>
                    <span style={{fontSize:10,color:C.textDim}}>kg</span>
                  </div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>updateLigne(l.id,"pct",Math.max(0,(l.pct||0)-10))} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.violet}40`,background:C.violetFaint,color:C.violet,cursor:"pointer",fontSize:15,fontWeight:700}}>−</button>
                    <input type="number" value={l.pct||0} onChange={e=>updateLigne(l.id,"pct",Math.max(0,Math.min(100,+e.target.value)))} style={{...S.input,textAlign:"center",fontWeight:700,fontSize:15,fontFamily:"JetBrains Mono",flex:1,borderColor:C.violet+"40"}} step={5}/>
                    <button onClick={()=>updateLigne(l.id,"pct",Math.min(100,(l.pct||0)+10))} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.violet}40`,background:C.violetFaint,color:C.violet,cursor:"pointer",fontSize:15,fontWeight:700}}>+</button>
                    <span style={{fontSize:13,fontWeight:800,color:C.violet}}>%</span>
                  </div>
                )}
                <div style={{marginTop:8,padding:"8px 12px",borderRadius:10,background:l.mode==="volonte"?`linear-gradient(135deg,${C.greenFaint},${C.violetFaint})`:C.greenFaint,border:`1.5px solid ${l.mode==="volonte"?C.violet+"50":C.green+"30"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:8,color:C.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{l.mode==="volonte"?"🟢 Qté ingérée calculée":"Qté ingérée"}</div>
                    <div style={{fontSize:8,color:C.textDim}}>{(l.qteEff*l.al.ueb).toFixed(2)} UEB · {(l.qteEff*l.al.prix).toFixed(2)}€ · {(l.qteEff*l.al.ufv).toFixed(2)} UFV</div>
                  </div>
                  <div><span style={{fontSize:22,fontWeight:800,color:l.mode==="volonte"?C.violet:C.greenLight,fontFamily:"JetBrains Mono"}}>{l.qteEff.toFixed(2)}</span><span style={{fontSize:9,color:C.textDim,marginLeft:2}}>kg</span></div>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div style={{...S.card,background:C.greenDark+"40",border:`1px solid ${C.green}40`}}>
              <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
                {[{l:"MS",v:totaux.ms,u:"kg",c:C.greenLight},{l:"Enc",v:`${totaux.enc}/${besoins.ci}`,u:"UEB",c:totaux.enc<=besoins.ci*1.05?C.green:C.red},{l:"PDI/UFL",v:totaux.pdiUfl,u:`cible ${besoins.pdiUflCible}`,c:Math.abs(totaux.pdiUfl-besoins.pdiUflCible)<=15?C.green:C.amber},{l:"Coût",v:totaux.cout.toFixed(2),u:"€/j",c:C.amberLight}].map((t,i)=>(
                  <div key={i}><div style={{fontSize:14,fontWeight:800,color:t.c,fontFamily:"JetBrains Mono"}}>{t.v}</div><div style={{fontSize:7,color:C.textDim}}>{t.u}</div><div style={{fontSize:7,color:C.textDim}}>{t.l}</div></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══ BILAN ═══ */}
        {tab === "bilan" && (
          <>
            <h2 style={{margin:"0 0 8px",fontSize:15,fontWeight:700}}>📊 Bilan</h2>
            <div style={S.card}>
              <BilanRow label="Énergie (UFV)" icon="⚡" apport={totaux.ufv} besoin={besoins.ufv} unit="UFV"/>
              <BilanRow label="Protéines (PDI)" icon="🧬" apport={totaux.pdi} besoin={besoins.pdi} unit="g"/>
              <BilanRow label="Encombrement" icon="📏" apport={totaux.enc} besoin={besoins.ci} unit="UEB"/>
              <BilanRow label="Calcium" icon="🦴" apport={totaux.ca} besoin={besoins.ca} unit="g"/>
              <BilanRow label="Phosphore" icon="🔬" apport={totaux.p} besoin={besoins.p} unit="g"/>
              <BilanRow label="Magnésium" icon="⚗️" apport={totaux.mg} besoin={besoins.mg} unit="g"/>
            </div>
            <div style={{...S.card,background:Math.abs(totaux.pdiUfl-besoins.pdiUflCible)<=15?C.greenFaint:C.amberFaint}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:12,fontWeight:700}}>Ratio PDI/UFL</div><div style={{fontSize:9,color:C.textDim}}>Cible: {besoins.pdiUflCible} · Conc: {totaux.pdiKg}g/kg (cible {besoins.pdiConc})</div></div>
                <div style={{fontSize:26,fontWeight:800,fontFamily:"JetBrains Mono",color:Math.abs(totaux.pdiUfl-besoins.pdiUflCible)<=15?C.green:C.amber}}>{totaux.pdiUfl}</div>
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{margin:"0 0 6px",fontSize:12,fontWeight:700}}>💡 Diagnostic</h3>
              {[
                totaux.enc<=besoins.ci*1.05?{t:`✅ Encombrement OK (${totaux.enc}/${besoins.ci})`,c:C.green}:{t:`❌ Dépassement (${totaux.enc}/${besoins.ci})`,c:C.red},
                totaux.pctF>=60?{t:`✅ Fourrage: ${totaux.pctF}%`,c:C.green}:{t:`⚠️ Fourrage: ${totaux.pctF}%`,c:C.amber},
                totaux.p>0&&totaux.ca/totaux.p>=1&&totaux.ca/totaux.p<=3.5?{t:`✅ Ca/P: ${(totaux.ca/totaux.p).toFixed(2)}`,c:C.green}:{t:`⚠️ Ca/P: ${totaux.p>0?(totaux.ca/totaux.p).toFixed(2):"?"}`,c:C.amber},
                Math.abs(totaux.pdiUfl-besoins.pdiUflCible)<=15?{t:`✅ PDI/UFL: ${totaux.pdiUfl} (cible ${besoins.pdiUflCible})`,c:C.green}:{t:`⚠️ PDI/UFL: ${totaux.pdiUfl} (cible ${besoins.pdiUflCible})`,c:C.amber},
                totaux.kKg<=(moisGest>=7?13:15)?{t:`✅ K: ${totaux.kKg}g/kg`,c:C.green}:{t:`⚠️ K élevé: ${totaux.kKg}g/kg (max ${moisGest>=7?13:15})`,c:C.amber},
              totaux.mgKg>=besoins.concMin.mg[0]?{t:`✅ Mg: ${totaux.mgKg}g/kg`,c:C.green}:{t:`⚠️ Mg bas: ${totaux.mgKg}g/kg (min ${besoins.concMin.mg[0]})`,c:C.amber},
              moisGest>=8?{t:"ℹ️ Prépa vêlage: 85g PDI/kg, CMV renforcé, K≤13",c:C.blue}:moisGest>=7?{t:"ℹ️ Tarissement, K≤13, surveiller NEC",c:C.blue}:{t:`ℹ️ ${besoins.periode}`,c:C.blue},
              ].map((d,i)=><div key={i} style={{padding:"7px 10px",borderRadius:8,marginBottom:3,background:d.c+"12",border:`1px solid ${d.c}30`,fontSize:11,color:d.c,fontWeight:600}}>{d.t}</div>)}
            </div>
            <div style={S.card}>
              <h3 style={{margin:"0 0 6px",fontSize:12,fontWeight:700}}>💰 Coûts</h3>
              {[["Par vache/jour",`${totaux.cout.toFixed(2)} €`],["Par vache/mois",`${(totaux.cout*30).toFixed(0)} €`],["Par vache/an",`${(totaux.cout*365).toFixed(0)} €`],
                ...(lot?[["Lot/jour ("+lot.nbAnimaux+")",`${(totaux.cout*(lot.nbAnimaux||1)).toFixed(2)} €`],["Lot/mois",`${(totaux.cout*(lot.nbAnimaux||1)*30).toFixed(0)} €`]]:[]),
                ...(showLait&&prodLait>0?[["Par kg lait",`${(totaux.cout/prodLait).toFixed(2)} €`]]:[]),
              ].map(([l,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:11,color:C.textSec}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:C.amberLight,fontFamily:"JetBrains Mono"}}>{v}</span></div>)}
            </div>
          </>
        )}

        {/* ═══ ALIMENTS ═══ */}
        {tab === "aliments" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:700}}>📚 Aliments</h2>
              <button onClick={()=>{const id=nextAlId.current++;setAliments(p=>[...p,{id,nom:"Nouvel aliment",cat:"Fourrage",ms:85,ufv:0.60,pdi:70,ca:5,p:3,mg:2,k:20,cell:250,prix:0.10,ueb:1.20}]);startEditAliment({id,nom:"Nouvel aliment"})}}
                style={{padding:"7px 14px",borderRadius:50,border:"none",background:C.green,color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"Outfit"}}>+ Créer</button>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:8,overflowX:"auto"}}>
              {["Tous","Fourrage","Concentré","Complément"].map(c=><Pill key={c} active={catFiltre===c} onClick={()=>setCatFiltre(c)}>{c}</Pill>)}
            </div>

            {/* ÉDITEUR ALIMENT */}
            {editAliment && (
              <div style={{...S.card,border:`2px solid ${C.green}`,background:C.bgCard2,marginBottom:10}}>
                <h3 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:C.greenLight}}>✏️ Modifier l'aliment</h3>
                <Field label="Nom" value={editValues.nom||""} onChange={v=>setEditValues(p=>({...p,nom:v}))} small/>
                <div style={{display:"flex",gap:6,marginBottom:6}}>
                  {["Fourrage","Concentré","Complément"].map(c=><Pill key={c} active={editValues.cat===c} onClick={()=>setEditValues(p=>({...p,cat:c}))}>{c}</Pill>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {[["MS%","ms"],["UFV","ufv"],["PDI","pdi"],["Ca","ca"],["P","p"],["Mg","mg"],["K","k"],["Cell.","cell"],["Prix €","prix"],["UEB","ueb"]].map(([l,k])=>(
                    <div key={k}>
                      <label style={{fontSize:8,color:C.textDim,fontWeight:600}}>{l}</label>
                      <input type="number" value={editValues[k]||0} onChange={e=>setEditValues(p=>({...p,[k]:+e.target.value}))} step={k==="ufv"||k==="ueb"||k==="prix"?0.01:1}
                        style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.greenLight,padding:"6px 8px",fontSize:12,width:"100%",outline:"none",boxSizing:"border-box",fontFamily:"JetBrains Mono",textAlign:"center"}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button onClick={()=>setEditAliment(null)} style={{...S.btn(C.bgCard2,C.textDim),flex:1,padding:"10px"}}>Annuler</button>
                  <button onClick={saveEditAliment} style={{...S.btn(),flex:1,padding:"10px"}}>✅ Enregistrer</button>
                </div>
              </div>
            )}

            {aliments.filter(a=>catFiltre==="Tous"||a.cat===catFiltre).map(al=>{
              const isCustom = !ALIMENTS_DEFAULT.find(d=>d.id===al.id) || JSON.stringify(al) !== JSON.stringify(ALIMENTS_DEFAULT.find(d=>d.id===al.id));
              return (
              <div key={al.id} style={{...S.card,padding:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,fontWeight:700}}>{al.nom}</span>
                    {isCustom && <span style={{fontSize:7,marginLeft:6,padding:"1px 5px",borderRadius:10,background:C.amberFaint,color:C.amber,fontWeight:700}}>modifié</span>}
                  </div>
                  <span style={{fontSize:7,padding:"2px 5px",borderRadius:20,background:al.cat==="Fourrage"?C.greenFaint:al.cat==="Concentré"?C.amberFaint:C.blueFaint,color:al.cat==="Fourrage"?C.green:al.cat==="Concentré"?C.amber:C.blue,fontWeight:700}}>{al.cat}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3,marginBottom:6}}>
                  {[["UFV",al.ufv],["PDI",al.pdi+"g"],["UEB",al.ueb],["Prix",al.prix+"€"],["Ca",al.ca+"g"],["P",al.p+"g"],["Mg",(al.mg||0)+"g"],["K",(al.k||0)+"g"],["MS",al.ms+"%"],["Cell.",al.cell]].map(([k,v])=>(
                    <div key={k} style={{textAlign:"center",padding:"3px 1px",borderRadius:5,background:C.greenFaint}}>
                      <div style={{fontSize:7,color:C.textDim,fontWeight:600}}>{k}</div>
                      <div style={{fontSize:10,fontWeight:700,color:C.text,fontFamily:"JetBrains Mono"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>startEditAliment(al)} style={{flex:1,padding:"6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bgCard2,color:C.greenLight,fontSize:10,fontWeight:700,cursor:"pointer"}}>✏️ Modifier</button>
                  <button onClick={()=>dupAliment(al)} style={{flex:1,padding:"6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bgCard2,color:C.blue,fontSize:10,fontWeight:700,cursor:"pointer"}}>📋 Dupliquer</button>
                  {isCustom && ALIMENTS_DEFAULT.find(d=>d.id===al.id) && <button onClick={()=>resetAliment(al.id)} style={{flex:1,padding:"6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bgCard2,color:C.amber,fontSize:10,fontWeight:700,cursor:"pointer"}}>↩️ Reset</button>}
                </div>
              </div>
            )})}
          </>
        )}

        {/* ═══ EXPORT ═══ */}
        {tab === "export" && (
          <>
            <h2 style={{margin:"0 0 10px",fontSize:15,fontWeight:700}}>📤 Export</h2>
            <button onClick={()=>{
              try{
                const sep=";";const nl="\n";
                const esc=v=>{const s=String(v??"");return s.includes(sep)||s.includes('"')||s.includes("\n")?'"'+s.replace(/"/g,'""')+'"':s;};
                const row=arr=>arr.map(esc).join(sep);
                const L=[];
                L.push(row(["RATIONPRO"]));
                L.push(row(["Éleveur",eleveur.nom||"-","Exploitation",eleveur.exploitation||"-"]));
                L.push(row(["Lot",lot?.nom||"-","Animaux",lot?.nbAnimaux||0,"Race",lot?.race||"-"]));
                L.push(row(["Poids kg",poids,"NEC",nec,"Mois gest.",moisGest,"Période",besoins.periode]));
                L.push(row(["Poids veau",poidsVeau,...(showLait?["Lait kg/j",prodLait]:[]),"Date",new Date().toLocaleDateString("fr-FR")]));
                L.push("");
                L.push(row(["RATION"]));
                L.push(row(["Aliment","Mode","Qté kg MS","UFV","PDI g","Ca g","P g","Mg g","K g","UEB","€"]));
                rationCalc.filter(l=>l.al&&l.qteEff>0).forEach(l=>{
                  L.push(row([l.al.nom,l.mode==="volonte"?"Vol."+l.pct+"%":"Fixe",l.qteEff.toFixed(2),(l.qteEff*l.al.ufv).toFixed(2),Math.round(l.qteEff*l.al.pdi),(l.qteEff*l.al.ca).toFixed(1),(l.qteEff*l.al.p).toFixed(1),(l.qteEff*(l.al.mg||0)).toFixed(1),(l.qteEff*(l.al.k||0)).toFixed(1),(l.qteEff*l.al.ueb).toFixed(2),(l.qteEff*l.al.prix).toFixed(2)]));
                });
                L.push(row(["TOTAL","",totaux.ms,totaux.ufv,totaux.pdi,totaux.ca,totaux.p,totaux.mg,totaux.k,totaux.enc,totaux.cout.toFixed(2)]));
                L.push("");L.push(row(["BILAN"]));
                const pO=(a,b)=>b>0?Math.round(a/b*100):0;const stt=v=>v>=90&&v<=110?"OK":v>=80&&v<=120?"ATT.":"DÉFICIT";
                const cn=besoins.concMin;
                L.push(row(["","Apport","Besoin","Couv %","Statut","g/kg MS","Cible"]));
                [["Énergie",totaux.ufv,besoins.ufv],["PDI",totaux.pdi,besoins.pdi,totaux.pdiKg,besoins.pdiConc],["Ca",totaux.ca,besoins.ca,totaux.caKg,cn.ca.join("-")],["P",totaux.p,besoins.p,totaux.pKg,cn.p.join("-")],["Mg",totaux.mg,besoins.mg,totaux.mgKg,cn.mg.join("-")]].forEach(([n,a,b,...r])=>{L.push(row([n,a,b,pO(a,b),stt(pO(a,b)),...r]));});
                L.push(row(["K",totaux.k,"","","",totaux.kKg,"≤"+cn.k[1]]));
                L.push("");L.push(row(["Enc.",totaux.enc,besoins.ci]));L.push(row(["% Fourrage",totaux.pctF]));L.push(row(["PDI/UFL",totaux.pdiUfl,"cible "+besoins.pdiUflCible]));
                L.push("");L.push(row(["COÛTS"]));L.push(row(["Vache/jour",totaux.cout.toFixed(2)+" €"]));L.push(row(["Vache/mois",(totaux.cout*30).toFixed(0)+" €"]));L.push(row(["Vache/an",(totaux.cout*365).toFixed(0)+" €"]));
                if(lot){L.push(row(["Lot/jour ("+lot.nbAnimaux+")",(totaux.cout*(lot.nbAnimaux||1)).toFixed(2)+" €"]));L.push(row(["Lot/mois",(totaux.cout*(lot.nbAnimaux||1)*30).toFixed(0)+" €"]));}
                const bom="\uFEFF";const csv=bom+L.join(nl);
                const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
                const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="RationPro_"+(lot?.nom||"ration").replace(/\s/g,"_")+"_"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
              }catch(e){console.error(e);}
            }} style={{padding:"14px 24px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,background:C.green,color:"#fff",fontFamily:"Outfit",width:"100%",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:20}}>📊</span> Télécharger CSV (Excel / Calc)
            </button>

            <p style={{fontSize:10,color:C.textDim,marginBottom:12,textAlign:"center"}}>Le CSV s'ouvre dans Excel. Fiche imprimable ci-dessous.</p>


            {/* FICHE IMPRIMABLE */}
            <div style={{background:"#fff",color:"#222",borderRadius:12,padding:16,fontFamily:"Arial,sans-serif",fontSize:11,lineHeight:1.5}}>
              <div style={{background:"linear-gradient(135deg,#2E7D32,#1B5E20)",color:"#fff",padding:"14px 18px",borderRadius:8,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:18,fontWeight:800}}>🐄 RationPro</div><div style={{fontSize:10,opacity:0.85}}>{eleveur.nom?eleveur.nom+" — ":""}{eleveur.exploitation||"Fiche Ration"}</div></div>
                <div style={{textAlign:"right",fontSize:10}}><div>{new Date().toLocaleDateString("fr-FR")}</div><div style={{fontWeight:700}}>{besoins.periode}</div></div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                {[["ANIMAL",`${poids}kg · NEC ${nec}${showLait?" · "+prodLait+"kg lait/j":""}`],["GESTATION",`Mois ${moisGest} · Veau ${poidsVeau}kg`],["LOT",`${lot?.nom||"-"} (${lot?.nbAnimaux||0} ${lot?.race||""})`],["BESOINS",`UFV ${besoins.ufv} · PDI ${besoins.pdi}g · CI ${besoins.ci}kg`]].map(([l,v],i)=>(<div key={i} style={{background:"#f9f9f9",border:"1px solid #eee",borderRadius:6,padding:"6px 10px"}}><div style={{fontSize:8,color:"#888",fontWeight:700}}>{l}</div><div style={{fontWeight:700}}>{v}</div></div>))}
              </div>

              <div style={{background:"#E8F5E9",padding:"5px 12px",fontWeight:"bold",fontSize:12,borderLeft:"4px solid #4CAF50",marginBottom:6,borderRadius:"0 4px 4px 0"}}>🌾 RATION</div>
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8,fontSize:10}}>
                <thead><tr>{["Aliment","Mode","Qté","UFV","PDI","Ca","P","Mg","K","€"].map(h=><th key={h} style={{background:"#f5f5f5",fontWeight:"bold",textAlign:"left",padding:"4px 6px",border:"1px solid #ddd"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {rationCalc.filter(l=>l.al&&l.qteEff>0).map((l,i)=><tr key={i} style={i%2===0?{}:{background:"#fafafa"}}><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{l.al.nom}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{l.mode==="volonte"?`Vol.${l.pct}%`:"Fixe"}</td><td style={{padding:"3px 6px",border:"1px solid #eee",fontWeight:700}}>{l.qteEff.toFixed(2)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*l.al.ufv).toFixed(2)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{Math.round(l.qteEff*l.al.pdi)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*l.al.ca).toFixed(1)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*l.al.p).toFixed(1)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*(l.al.mg||0)).toFixed(1)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*(l.al.k||0)).toFixed(1)}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{(l.qteEff*l.al.prix).toFixed(2)}</td></tr>)}
                  <tr style={{background:"#E8F5E9",fontWeight:"bold"}}><td style={{padding:"3px 6px",border:"1px solid #eee"}}>TOTAL</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}></td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.ms}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.ufv}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.pdi}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.ca}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.p}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.mg}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.k}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{totaux.cout.toFixed(2)}</td></tr>
                </tbody>
              </table>

              <div style={{background:"#E8F5E9",padding:"5px 12px",fontWeight:"bold",fontSize:12,borderLeft:"4px solid #4CAF50",marginBottom:6,marginTop:10,borderRadius:"0 4px 4px 0"}}>📊 BILAN</div>
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8,fontSize:10}}>
                <thead><tr>{["","Apport","Besoin","Couv.","g/kg MS","Cible"].map(h=><th key={h} style={{background:"#f5f5f5",fontWeight:"bold",textAlign:"left",padding:"4px 6px",border:"1px solid #ddd"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["Énergie",totaux.ufv,besoins.ufv,"UFV","",""],["PDI",totaux.pdi,besoins.pdi,"g",totaux.pdiKg,besoins.pdiConc],["Ca",totaux.ca,besoins.ca,"g",totaux.caKg,besoins.concMin.ca.join("-")],["P",totaux.p,besoins.p,"g",totaux.pKg,besoins.concMin.p.join("-")],["Mg",totaux.mg,besoins.mg,"g",totaux.mgKg,besoins.concMin.mg.join("-")],["K",totaux.k,"-","g",totaux.kKg,"≤"+besoins.concMin.k[1]]].map(([n,a,b,u,cA,cC],i)=>{const pct=typeof b==="number"&&b>0?Math.round(a/b*100):"-";const col=typeof pct==="number"?(pct>=90&&pct<=110?"#2E7D32":pct>=80&&pct<=120?"#F57F17":"#C62828"):"#222";return<tr key={i}><td style={{padding:"3px 6px",border:"1px solid #eee",fontWeight:700}}>{n}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{typeof a==="number"?a.toFixed?a.toFixed(1):a:a}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{typeof b==="number"?b.toFixed?b.toFixed(1):b:b}</td><td style={{padding:"3px 6px",border:"1px solid #eee",fontWeight:700,color:col}}>{typeof pct==="number"?pct+"%":""}</td><td style={{padding:"3px 6px",border:"1px solid #eee",fontWeight:700}}>{cA}</td><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{cC}</td></tr>;})}
                </tbody>
              </table>

              <div style={{background:"#E3F2FD",padding:"5px 12px",fontWeight:"bold",fontSize:11,borderLeft:"4px solid #42A5F5",marginBottom:6,marginTop:10,borderRadius:"0 4px 4px 0"}}>💡 RECOMMANDATIONS — {besoins.periode}</div>
              {(moisGest>=8?["Prépa vêlage : PDI 85 g/kg MS","CMV vêlage (Mg renforcé)","K ≤ 13 g/kg MS","NEC 2.5-3.0"]:moisGest>=7?["Tarissement : réduire énergie","K ≤ 13 g/kg","Mg ≥ 2 g/kg","Surveiller NEC"]:["Couvrir besoins énergie","PDI ≥ 70 g/kg","Mg 2-2.5 g/kg","K ≤ 15 g/kg"]).map((r,i)=><div key={i} style={{background:"#E3F2FD",padding:"4px 10px",marginBottom:3,borderRadius:4,fontSize:10,borderLeft:"3px solid #42A5F5"}}>→ {r}</div>)}

              <div style={{background:"#E8F5E9",padding:"5px 12px",fontWeight:"bold",fontSize:12,borderLeft:"4px solid #4CAF50",marginBottom:6,marginTop:10,borderRadius:"0 4px 4px 0"}}>💰 COÛTS</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <tbody>
                  {[["Vache/jour",totaux.cout.toFixed(2)+" €"],["Vache/mois",(totaux.cout*30).toFixed(0)+" €"],["Vache/an",(totaux.cout*365).toFixed(0)+" €"],...(lot?[["Lot/jour ("+lot.nbAnimaux+" "+lot.race+")",(totaux.cout*(lot.nbAnimaux||1)).toFixed(2)+" €"],["Lot/mois",(totaux.cout*(lot.nbAnimaux||1)*30).toFixed(0)+" €"]]:[])].map(([l,v],i)=><tr key={i}><td style={{padding:"3px 6px",border:"1px solid #eee"}}>{l}</td><td style={{padding:"3px 6px",border:"1px solid #eee",fontWeight:700}}>{v}</td></tr>)}
                </tbody>
              </table>

              <div style={{textAlign:"center",fontSize:8,color:"#999",marginTop:12,borderTop:"1px solid #eee",paddingTop:6}}>RationPro · {new Date().toLocaleDateString("fr-FR")} · Formules INRA 2018</div>
            </div>
          </>
        )}
      </div>

      {/* MODALES */}
      {showSave && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480}}>
            <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>💾 Sauvegarder</h3>
            <input type="text" placeholder="Nom..." value={saveName} onChange={e=>setSaveName(e.target.value)} style={S.input} autoFocus/>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={()=>setShowSave(false)} style={{...S.btn(C.bgCard2,C.textDim),flex:1}}>Annuler</button>
              <button onClick={saveRation} style={{...S.btn(),flex:1}}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
      {showLoad && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,maxHeight:"60vh",overflowY:"auto"}}>
            <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:700}}>📂 Rations sauvegardées</h3>
            {savedRations.length===0?<p style={{color:C.textDim,textAlign:"center",padding:14}}>Aucune</p>:savedRations.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                <button onClick={()=>loadRation(r)} style={{flex:1,padding:"10px 12px",borderRadius:10,border:`1px solid ${C.border}`,background:C.bgCard2,cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Outfit"}}>{r.name}</div>
                  <div style={{fontSize:9,color:C.textDim}}>{r.date} · Mois {r.moisGest} · {r.poids}kg{r.lot?` · ${r.lot.nom}`:""}</div>
                </button>
                <button onClick={()=>deleteRation(i)} style={{background:C.redFaint,border:"none",borderRadius:10,padding:"0 12px",color:C.red,cursor:"pointer",fontSize:14}}>🗑</button>
              </div>
            ))}
            <button onClick={()=>setShowLoad(false)} style={{...S.btn(C.bgCard2,C.textDim),marginTop:8}}>Fermer</button>
          </div>
        </div>
      )}

      {/* TAB BAR — 5 onglets */}
      <div style={S.tabBar}>
        {[{id:"eleveur",icon:"👤",label:"Éleveur"},{id:"ration",icon:"🌾",label:"Ration"},{id:"bilan",icon:"📊",label:"Bilan"},{id:"aliments",icon:"📚",label:"Aliments"},{id:"export",icon:"📤",label:"Export"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={S.tabBtn(tab===t.id)}>
            <span style={{fontSize:16}}>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
