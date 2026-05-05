/* ============================================================
   THREE.JS  |  GSAP  |  ALL INTERACTIONS
   JVN Ganesh Portfolio
   ============================================================ */

// ── THREE.JS SETUP ─────────────────────────────────────────
const canvas   = document.getElementById('galaxy-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 2.5, 8);

// ── GALAXY PARTICLES ──────────────────────────────────────
const GALAXY = { count: 9000, radius: 8, branches: 3, spin: 1.3, scatter: 0.22 };
let gGeo, gMat, gPoints;

function buildGalaxy() {
  if (gPoints) { gGeo.dispose(); gMat.dispose(); scene.remove(gPoints); }

  gGeo = new THREE.BufferGeometry();
  const pos    = new Float32Array(GALAXY.count * 3);
  const colors = new Float32Array(GALAXY.count * 3);
  const cIn  = new THREE.Color('#00d4ff');
  const cOut = new THREE.Color('#7b2dff');

  for (let i = 0; i < GALAXY.count; i++) {
    const i3     = i * 3;
    const r      = Math.random() * GALAXY.radius;
    const spin   = r * GALAXY.spin;
    const branch = ((i % GALAXY.branches) / GALAXY.branches) * Math.PI * 2;
    const p      = (v) => Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * v;

    pos[i3]     = Math.cos(branch + spin) * r + p(GALAXY.scatter * r * .4);
    pos[i3 + 1] = p(GALAXY.scatter * r * .12);
    pos[i3 + 2] = Math.sin(branch + spin) * r + p(GALAXY.scatter * r * .4);

    const mixed = cIn.clone().lerp(cOut, r / GALAXY.radius);
    colors[i3]     = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  gGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  gGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  gMat = new THREE.PointsMaterial({
    size: 0.014, sizeAttenuation: true,
    depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
  });

  gPoints = new THREE.Points(gGeo, gMat);
  scene.add(gPoints);
}
buildGalaxy();

// ── STARFIELD ─────────────────────────────────────────────
const sSrc = new THREE.BufferGeometry();
const sPos = new Float32Array(4000 * 3);
for (let i = 0; i < sPos.length; i++) sPos[i] = (Math.random() - .5) * 120;
sSrc.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
const stars = new THREE.Points(sSrc, new THREE.PointsMaterial({
  size: 0.018, color: 0xffffff, transparent: true, opacity: .55, sizeAttenuation: true,
}));
scene.add(stars);

// ── FLOATING WIREFRAME SHAPES ─────────────────────────────
const floaters = [];
const geoPool = [
  new THREE.IcosahedronGeometry(.28, 0),
  new THREE.OctahedronGeometry(.28),
  new THREE.TetrahedronGeometry(.3),
  new THREE.IcosahedronGeometry(.2, 1),
];
for (let i = 0; i < 10; i++) {
  const m = new THREE.Mesh(
    geoPool[i % geoPool.length],
    new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00d4ff : 0x7b2dff,
      wireframe: true, transparent: true, opacity: .35,
    })
  );
  m.position.set((Math.random() - .5) * 14, (Math.random() - .5) * 7, (Math.random() - .5) * 5);
  m.userData = {
    rx: Math.random() * .009 + .003,
    ry: Math.random() * .009 + .003,
    fSpeed: Math.random() * .5 + .3,
    fAmp:   Math.random() * .25 + .08,
    baseY:  m.position.y,
  };
  scene.add(m);
  floaters.push(m);
}

// ── MOUSE PARALLAX ────────────────────────────────────────
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth  - .5) * 2;
  mouse.y = -(e.clientY / window.innerHeight - .5) * 2;
});

// ── RENDER LOOP ───────────────────────────────────────────
const clock = new THREE.Clock();
(function animate() {
  const t = clock.getElapsedTime();

  if (gPoints) gPoints.rotation.y = t * .038;
  stars.rotation.y = t * .008;
  stars.rotation.x = t * .004;

  floaters.forEach(o => {
    o.rotation.x += o.userData.rx;
    o.rotation.y += o.userData.ry;
    o.position.y  = o.userData.baseY + Math.sin(t * o.userData.fSpeed) * o.userData.fAmp;
  });

  camera.position.x += (mouse.x * .6 - camera.position.x) * .045;
  camera.position.y += (mouse.y * .35 + 2.5 - camera.position.y) * .045;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================================
//  DATA
// ============================================================

const SKILLS = [
  {
    cat: '⌨ Programming',
    tags: ['Python','SQL','Java','C++','C','JavaScript','R','HTML','CSS'],
  },
  {
    cat: '🤖 ML / AI',
    tags: ['TensorFlow','PyTorch','Scikit-learn','Hugging Face','LangChain','OpenCV','NLP','BERT','GPT','LLM','Transformers','AutoGluon'],
  },
  {
    cat: '📊 Data & Analytics',
    tags: ['Pandas','NumPy','Matplotlib','Seaborn','Tableau','Power BI','SPSS','SciPy','Prophet','Gensim'],
  },
  {
    cat: '☁ Cloud',
    tags: ['AWS','Google Cloud','Azure','IBM Z Cloud','Linux ONE','OpenAI API'],
  },
  {
    cat: '🗄 Databases',
    tags: ['MySQL','PostgreSQL','MongoDB','Neo4J','ChromaDB','VectorDB','DBeaver'],
  },
  {
    cat: '⚙ DevOps & Tools',
    tags: ['Git','Docker','Jenkins','Linux','Jupyter','Google Colab','Hadoop','Apache Spark'],
  },
  {
    cat: '🔧 Frameworks & APIs',
    tags: ['Flask','FastAPI','REST API','Selenium','Beautiful Soup','Scrapy','Streamlit','xlwings','openpyxl'],
  },
  {
    cat: '🏢 Enterprise Platforms',
    tags: ['Coupa','SAP','ServiceNow','Power Automate','OAuth2','Streamlit'],
  },
];

const EXPERIENCES = [
  {
    role: 'Programmer Analyst',
    company: 'Cognizant Technology Solutions',
    date: 'Aug 2025 – Present',
    desc: 'Procurement domain — Coupa & SAP ServiceNow. Built 7 enterprise automation tools (Python, Streamlit, Flask, Power Automate) eliminating 3–4 hrs/day of manual work per analyst. Engineered backend workflows for 250K+ transactions, anomaly detection pipelines, and OAuth2 Coupa API integrations.',
  },
  {
    role: 'Data Scientist',
    company: 'Target',
    date: 'Jun – Jul 2024',
    desc: 'Applied ML and analytics solutions to drive data-driven decision-making across business units.',
  },
  {
    role: 'ML Engineer',
    company: 'TIFFIN',
    date: 'Jun – Aug 2024',
    desc: 'Developed end-to-end machine learning pipelines and scalable model deployment solutions.',
  },
  {
    role: 'Data Scientist',
    company: 'IBM Mentorship Program',
    date: 'Apr – Jul 2024',
    desc: 'Built ML workflows including preprocessing, training & deployment. Developed Flask REST APIs for real-time inference. Cloud deployment improved prediction by 12%.',
  },
  {
    role: 'Rust Developer',
    company: 'Samsung PRISM',
    date: 'Nov 2023 – Aug 2024',
    desc: 'Systems-level Rust development as part of Samsung’s elite university research program.',
  },
  {
    role: 'DevOps Engineer',
    company: 'Mphasis',
    date: 'Dec 2023 – Jan 2024',
    desc: 'CI/CD pipeline design, infrastructure automation and container orchestration with Docker & Jenkins.',
  },
  {
    role: 'Data Scientist',
    company: 'Celebal Technologies',
    date: 'Aug – Oct 2023',
    desc: 'Built backend data processing pipelines for large enterprise datasets. Optimised system performance by 18%.',
  },
  {
    role: 'Data Scientist',
    company: 'Siemens (via CSI)',
    date: 'Feb – Mar 2023',
    desc: 'Applied ML solutions for industrial data analysis in collaboration with Siemens research teams.',
  },
  {
    role: 'ML Engineer / Data Scientist',
    company: 'Rubixe',
    date: 'Jun 2022 – Feb 2023',
    desc: 'Developed ML pipelines for NLP and computer vision. Data validation, preprocessing and deployment integration.',
  },
  {
    role: 'Python Developer',
    company: 'Papers Drop',
    date: 'Feb – Dec 2022',
    desc: 'Python-based backend development and process automation.',
  },
];

const PROJECTS = [
  {
    name: 'LSM Integration Follow-up Updater',
    badge: '⚡ Cognizant Automation',
    desc: 'Eliminated 3–4 hrs/day of manual analyst work. Accepts 7 file uploads via Streamlit UI, deduplicates source files by document ID, auto-updates 4 Excel sheets, triggers xlwings formula evaluation for VLOOKUP resolution, then computes NEW PO / GR / Invoice counts via a 3-step filter algorithm.',
    tags: ['Python','Streamlit','xlwings','openpyxl','Pandas','Excel Automation'],
  },
  {
    name: 'Coupa Integration History Dashboard',
    badge: '⚡ Cognizant Automation',
    desc: 'OAuth2-authenticated Coupa API integration (two scopes). Fetches all POs and their latest integration record via offset-based pagination. Produces a colour-coded Streamlit dashboard + 4-sheet Excel export (Overview, Failed, Success, Duplicates). Combined PO count banner feeds directly into daily ServiceNow reports.',
    tags: ['Python','Coupa API','OAuth2','Streamlit','REST API','openpyxl'],
  },
  {
    name: 'Invoice Integration History Lookup Tool',
    badge: '⚡ Cognizant Automation',
    desc: 'Resolves pasted invoice numbers to Coupa internal IDs, fetches their integration history records, deduplicates events (latest per invoice), and exports a 4-sheet Excel report (Overview, Failed, Success, Duplicates). Handles not-found and duplicate edge cases gracefully.',
    tags: ['Python','Coupa API','Flask','REST API','openpyxl'],
  },
  {
    name: 'ORO Monitoring Automation',
    badge: '⚡ Cognizant Automation',
    desc: '6-step pipeline that filters a Request-Task Report, cross-references a Hypercare errors workbook, tags In-Progress rows that also have a Completed/Cancelled event as integration errors, and outputs a styled 3-sheet Excel with metric tiles. Replaces entirely manual Excel filter work.',
    tags: ['Python','Streamlit','Pandas','openpyxl','ServiceNow','SAP'],
  },
  {
    name: 'Empty Group Approval Checker',
    badge: '⚡ Cognizant Automation',
    desc: 'Identifies invoices stuck in Coupa approval queues because the assigned approval group has zero members. Matches 2 input files, aggregates by group name, surfaces total amount at risk, and exports a 3-sheet Excel. Found ~43% empty groups (19,499 of 45,239) on Sanofi sandbox.',
    tags: ['Python','Streamlit','Coupa','Pandas','openpyxl'],
  },
  {
    name: 'Flask Resolution Lookup Bot',
    badge: '⚡ Cognizant Automation',
    desc: 'Fully offline Flask app for Coupa/SAP integration error resolution. Two-stage matching: SequenceMatcher similarity + 50% keyword gate to eliminate false positives. Searches across 3 Excel sheets (PO, GR, Invoice). Accordion result cards colour-coded by type. Add-resolution modal writes back to Excel instantly.',
    tags: ['Python','Flask','SequenceMatcher','openpyxl','NLP','ServiceNow'],
  },
  {
    name: 'Integration Dashboard Monitoring + Power Automate Flow',
    badge: '⚡ Cognizant Automation',
    desc: 'Streamlit form collects shift monitoring data (SAP triggers, ERIS jobs, eBuy, open incidents, base64 screenshots) and generates a formatted HTML email. Power Automate detects the file on OneDrive and sends it via Office 365. A separate reminder flow runs 3×/day, checks Sent Items, and pings the responsible analyst on Teams if submission is missed.',
    tags: ['Python','Streamlit','Power Automate','OneDrive','Office 365','Teams'],
  },
  {
    name: 'Carmex — Carbon Emissions Forecasting',
    badge: '🏆 IBM Z Global Winner',
    desc: 'Carbon emissions exchange platform using SARIMA on IBM LinuxONE. Won Global IBM Z Hackathon. Comprehensive GHG reporting with currency conversion and custom emissions factors.',
    tags: ['SARIMA','IBM LinuxONE','Forecasting','FinTech'],
  },
  {
    name: 'Transaction Monitoring & Anomaly Detection',
    badge: 'Enterprise System',
    desc: 'Python pipeline using Isolation Forest and Z-score techniques for anomaly detection across 250K+ enterprise transactions. Real-time risk flagging and SLA monitoring.',
    tags: ['Isolation Forest','Z-score','Python','SQL'],
  },
  {
    name: 'PDF Query Optimizer with LangChain',
    badge: 'LLM Application',
    desc: 'Optimises queries over text and image data using LangChain with indexing, caching, and search algorithms for efficient information retrieval from large document sets.',
    tags: ['LangChain','LLM','ChromaDB','FastAPI'],
  },
  {
    name: 'Q&A Generation using LLMs',
    badge: 'Generative AI',
    desc: 'Generates contextually accurate question-answer pairs using OpenAI GPT-3.5 and LLMs for automated knowledge extraction from documents.',
    tags: ['GPT-3.5','LLM','OpenAI','NLP'],
  },
  {
    name: 'Fine-Tuning BERT with Transformers',
    badge: 'Deep Learning',
    desc: 'Custom neural architecture for fine-tuning BERT via Hugging Face Transformers for domain-specific NLP classification tasks.',
    tags: ['BERT','Transformers','PyTorch','NLP'],
  },
  {
    name: 'Knowledge Graphs with Neo4J',
    badge: 'Graph Database',
    desc: 'Knowledge graph construction using Neo4J and LLM with Cypher for intelligent entity relationship mapping and graph-based querying.',
    tags: ['Neo4J','Graph DB','Cypher','LLM'],
  },
  {
    name: 'Enterprise Operations Dashboard',
    badge: 'Analytics',
    desc: 'SQL data pipelines with Power BI dashboards for KPI monitoring. Reduced reporting effort by 45% through automated data refresh.',
    tags: ['Power BI','SQL','ETL','KPI'],
  },
  {
    name: 'Web Automation Framework',
    badge: 'Automation',
    desc: 'Selenium WebDriver automation framework with CI/CD integration, form validation, error handling and structured test reporting.',
    tags: ['Selenium','Python','CI/CD','Testing'],
  },
  {
    name: 'Heart Disease Prediction',
    badge: 'Healthcare ML',
    desc: 'Ensemble of Decision Tree, Random Forest, SVM, KNN and Logistic Regression for multi-model cardiovascular risk classification.',
    tags: ['Scikit-learn','SVM','Random Forest','Healthcare'],
  },
  {
    name: 'COVID-19 Dashboard',
    badge: 'Data Visualisation',
    desc: 'Interactive Tableau geographic mapping of COVID-19 hotspots with dynamic filtering, trend analysis and statistical summaries.',
    tags: ['Tableau','Geospatial','COVID-19','Analytics'],
  },
  {
    name: 'FIFA Players Skills Analysis',
    badge: 'Sports Analytics',
    desc: 'In-depth K-means and hierarchical clustering of FIFA player datasets to identify player archetypes and performance profiles.',
    tags: ['Clustering','Pandas','Matplotlib','ML'],
  },
  {
    name: 'Liver Disease Prediction',
    badge: 'Medical ML',
    desc: 'Chemical compound analysis using SGOT/SGPT medical test results to predict liver disease requiring clinical diagnosis.',
    tags: ['Classification','Healthcare','Python','Scikit-learn'],
  },
];

const RESEARCH = [
  {
    type: 'IEEE Publication',
    title: 'NASA Asteroid Classification Using Heterogeneous Ensemble Learning',
    venue: 'IEEE ICDSINC 2025 · Dec 9, 2025',
    models: 'CatBoost, XGBoost-SHAP, BYOL, SDNL, GNN, GAT, Heterogeneous Ensemble Learning',
    patent: false,
  },
  {
    type: 'IEEE Publication',
    title: 'Detecting Earth-Hazardous Asteroids Using GraphSAGE Algorithm',
    venue: 'IEEE I-PACT 2025 · Sep 25, 2025',
    models: 'GraphSAGE, SAINT, TabNet, PINN, Temporal Fusion Transformer, SIMCLR',
    patent: false,
  },
  {
    type: 'IEEE Publication',
    title: 'Adaptive Health Alert System Based on Explainable Boosting Machine & IoT Signals',
    venue: 'IEEE ICCAMS 2025 · Jul 11, 2025',
    models: 'Explainable Boosting Machine (EBM), TabNet, MAX30102 IoT sensors',
    patent: false,
  },
  {
    type: 'IEEE Publication',
    title: 'AI-Based Multi-Class Classification for Predicting Exoplanet Habitability',
    venue: 'IEEE CONECCT 2025 · Jul 10, 2025',
    models: 'AutoGluon, EBM, Quantum Random Forest, PINN, BART, Deep Evidential Classifier',
    patent: false,
  },
  {
    type: 'IEEE Publication',
    title: 'Temperature Prediction of Lithium-Ion Cells Using Transformers & Deep Learning',
    venue: 'IEEE DSBS 2025 · Apr 17, 2025',
    models: 'LSTM, GRU, Bi-LSTM, MGU, Transformer, Ensemble Model',
    patent: false,
  },
  {
    type: 'Patent Issued',
    title: 'Intelligent Medication Management & Real-Time Health Monitoring with Caregiver Integration',
    venue: 'Patent No. IN 202541102444 · Nov 28, 2025',
    models: 'TabTransformer AI, ECG/Ultrasonic/Alcohol sensors, caregiver real-time alert system',
    patent: true,
  },
];

const ACHIEVEMENTS = [
  { emoji:'🥇', title:'IBM Z Hackathon — Global Winner',      detail:'Global round champion for Carmex carbon emissions solution on IBM LinuxONE', year:'OCT 2023' },
  { emoji:'🚀', title:'NASA Hackathon — Chennai Winner',       detail:'First prize at NASA hackathon, Chennai regional round',                       year:'NOV 2023' },
  { emoji:'🌍', title:'CS BASE Wolfram ML Hackathon',          detail:'International winner in open ML competition',                                 year:'JUN 2024' },
  { emoji:'⚡', title:'Yantra Hackathon — Best Track',         detail:'1st Prize for Best Track Implementation',                                     year:'MAY 2023' },
  { emoji:'🏅', title:'International Science Olympiad',        detail:'Qualified to represent UAE internationally in Physics & Computer Science',    year:'2020–21' },
  { emoji:'☁',  title:'AWS Certified Solutions Architect',    detail:'Associate Level — valid until Apr 2028',                                      year:'APR 2025' },
  { emoji:'📜', title:'IABAC Global Data Science Cert.',       detail:'Certified Data Science Professional — IABAC',                                 year:'2022' },
  { emoji:'🔬', title:'6 IEEE Research Publications',          detail:'Published in international IEEE conferences across AI & ML domains',           year:'2024–25' },
  { emoji:'💡', title:'2 Patents Filed / Issued',              detail:'AI/ML innovation patents in healthcare technology (IoT + AI)',                 year:'2025' },
];

const CERTS = [
  { issuer:'AWS',            name:'Solutions Architect – Associate' },
  { issuer:'Cognizant',      name:'Context Engineering Foundation' },
  { issuer:'Google',         name:'Foundations: Data, Data, Everywhere' },
  { issuer:'IBM',            name:'Generative AI & LLMs: Architecture' },
  { issuer:'IBM',            name:'What is Data Science?' },
  { issuer:'IBM',            name:'Develop Generative AI Applications' },
  { issuer:'Google',         name:'Responsible AI' },
  { issuer:'Google Cloud',   name:'Introduction to Large Language Models' },
  { issuer:'Google Cloud',   name:'Introduction to Generative AI — Advanced' },
  { issuer:'Google Cloud',   name:'Cloud Computing Fundamentals' },
  { issuer:'Google Cloud',   name:'Networking & Security in GCP' },
  { issuer:'Google Cloud',   name:'Data, ML and AI in Google Cloud' },
  { issuer:'ETS',            name:'TOEFL iBT' },
  { issuer:'IABAC',          name:'Global Data Science Certification' },
];

// ============================================================
//  POPULATE DOM
// ============================================================

// Skills
const skillsGrid = document.getElementById('skillsGrid');
SKILLS.forEach(cat => {
  const div = document.createElement('div');
  div.className = 'skill-cat will-anim';
  div.innerHTML = `<h3>${cat.cat}</h3><div class="skill-tags">${cat.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
  skillsGrid.appendChild(div);
});

// Timeline
const timeline = document.getElementById('timeline');
EXPERIENCES.forEach(exp => {
  const div = document.createElement('div');
  div.className = 'tl-item will-anim';
  div.innerHTML = `
    <div class="tl-dot"></div>
    <div class="tl-card">
      <p class="tl-role">${exp.role}</p>
      <h3 class="tl-company">${exp.company}</h3>
      <p class="tl-date">${exp.date}</p>
      <p class="tl-desc">${exp.desc}</p>
    </div>`;
  timeline.appendChild(div);
});

// Projects
const projGrid = document.getElementById('projectsGrid');
PROJECTS.forEach((p, i) => {
  const div = document.createElement('div');
  div.className = 'proj-card will-anim';
  div.innerHTML = `
    <span class="proj-num">${String(i+1).padStart(2,'0')}</span>
    <span class="proj-badge">${p.badge}</span>
    <h3 class="proj-name">${p.name}</h3>
    <p class="proj-desc">${p.desc}</p>
    <div class="proj-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
  projGrid.appendChild(div);
});

// Research
const resGrid = document.getElementById('researchGrid');
RESEARCH.forEach(r => {
  const div = document.createElement('div');
  div.className = `res-card will-anim${r.patent ? ' patent' : ''}`;
  div.innerHTML = `
    <p class="res-type">${r.patent ? '⚙ Patent Issued' : '📄 ' + r.type}</p>
    <h3 class="res-title">${r.title}</h3>
    <p class="res-venue">${r.venue}</p>
    <p class="res-models"><strong>Models / Tech:</strong> ${r.models}</p>`;
  resGrid.appendChild(div);
});

// Achievements
const achGrid = document.getElementById('achGrid');
ACHIEVEMENTS.forEach(a => {
  const div = document.createElement('div');
  div.className = 'ach-card will-anim';
  div.innerHTML = `
    <span class="ach-emoji">${a.emoji}</span>
    <h3 class="ach-title">${a.title}</h3>
    <p class="ach-detail">${a.detail}</p>
    <span class="ach-year">${a.year}</span>`;
  achGrid.appendChild(div);
});

// Certs marquee (duplicated for seamless loop)
const certsTrack = document.getElementById('certsTrack');
[...CERTS, ...CERTS].forEach(c => {
  const div = document.createElement('div');
  div.className = 'cert-card';
  div.innerHTML = `<p class="cert-issuer">${c.issuer}</p><p class="cert-name">${c.name}</p>`;
  certsTrack.appendChild(div);
});

// ============================================================
//  GSAP  +  SCROLLTRIGGER
// ============================================================
gsap.registerPlugin(ScrollTrigger);

// Batch animate .will-anim elements
ScrollTrigger.batch('.will-anim', {
  onEnter: batch =>
    gsap.to(batch, {
      opacity: 1, y: 0, duration: .7,
      ease: 'power3.out', stagger: .08,
    }),
  start: 'top 88%',
});

// Section headers
gsap.utils.toArray('.sec-header').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: -26 },
    { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' } });
});

// About photo
gsap.fromTo('.about-photo-wrap',
  { opacity: 0, scale: .75 },
  { opacity: 1, scale: 1, duration: 1.1, ease: 'elastic.out(1,.7)',
    scrollTrigger: { trigger: '#about', start: 'top 70%' } });

// Stat counter
document.querySelectorAll('.stat-n').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter() {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.8, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val); },
      });
    },
  });
});

// ============================================================
//  3D CARD TILT  (project cards)
// ============================================================
document.querySelectorAll('.proj-card, .res-card, .ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.width  / 2;
    const cy = r.height / 2;
    const rx = ((e.clientY - r.top)  - cy) / cy * -7;
    const ry = ((e.clientX - r.left) - cx) / cx *  7;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
//  TYPEWRITER
// ============================================================
const ROLES = [
  'Data Scientist',
  'Software Engineer',
  'AI / ML Researcher',
  'IEEE Author',
  'AWS Solutions Architect',
  'Generative AI Developer',
];
let rIdx = 0, cIdx = 0, deleting = false;
const twEl = document.getElementById('typewriter');

function typeWrite() {
  const cur = ROLES[rIdx];
  twEl.textContent = deleting
    ? cur.slice(0, cIdx - 1)
    : cur.slice(0, cIdx + 1);

  deleting ? cIdx-- : cIdx++;

  let delay = deleting ? 55 : 95;
  if (!deleting && cIdx === cur.length)  { delay = 2200; deleting = true; }
  if ( deleting && cIdx === 0)           { deleting = false; rIdx = (rIdx + 1) % ROLES.length; delay = 350; }

  setTimeout(typeWrite, delay);
}

// ============================================================
//  CUSTOM CURSOR
// ============================================================
const curRing = document.querySelector('.cur-ring');
const curDot  = document.querySelector('.cur-dot');

document.addEventListener('mousemove', e => {
  gsap.to(curRing, { x: e.clientX, y: e.clientY, duration: .14 });
  gsap.to(curDot,  { x: e.clientX, y: e.clientY, duration: .04 });
});

document.querySelectorAll('a, button, .proj-card, .skill-tags span').forEach(el => {
  el.addEventListener('mouseenter', () =>
    gsap.to(curRing, { scale: 2, borderColor: '#7b2dff', duration: .2 }));
  el.addEventListener('mouseleave', () =>
    gsap.to(curRing, { scale: 1, borderColor: '#00d4ff', duration: .2 }));
});

// ============================================================
//  NAVIGATION
// ============================================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () =>
  navbar.classList.toggle('scrolled', window.scrollY > 70));

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    gsap.to(spans[0], { rotation: 45,  y:  7, duration: .25 });
    gsap.to(spans[1], { opacity: 0,        duration: .15 });
    gsap.to(spans[2], { rotation: -45, y: -7, duration: .25 });
  } else {
    gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: .25 });
  }
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    gsap.to(hamburger.querySelectorAll('span'), { rotation: 0, y: 0, opacity: 1, duration: .25 });
  })
);

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

// ============================================================
//  LOADER DISMISS  — max 3 s wait, no GSAP dependency
// ============================================================
let loaderGone = false;
function dismissLoader() {
  if (loaderGone) return;
  loaderGone = true;
  const loader = document.getElementById('loader');
  loader.style.transition = 'opacity .8s ease';
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.display = 'none';
    typeWrite();
  }, 820);
}

// Hard cap: never show loader longer than 3 s
setTimeout(dismissLoader, 3000);
// Also dismiss early once everything is ready
window.addEventListener('load', () => setTimeout(dismissLoader, 400));
