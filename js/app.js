// ZIPA — Sistema principal de la aplicación
const APP = {
  paginaActual: 'dashboard',
  sidebarCollapsed: false,

  init() {
    this.actualizarFechas();
    renderCalendario();
    this.cargarDatosGoogle();
    const ua = document.getElementById('ultimo-acceso');
    try {
      const s = JSON.parse(localStorage.getItem('zipa_s') || '{}');
      if (ua && s.t) ua.textContent = new Date(s.t).toLocaleString('es-CO');
    } catch(e) {}
  },

  actualizarFechas() {
    const d = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const f = d.toLocaleDateString('es-CO', opts);
    const el = document.getElementById('dash-fecha');
    if (el) el.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    const af = document.getElementById('agenda-fecha-hoy');
    if (af) af.textContent = 'Hoy — ' + d.toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long' });
    const bf = document.getElementById('bit-fecha');
    const act = document.getElementById('act-fecha');
    const hoy = d.toISOString().split('T')[0];
    if (bf) bf.value = hoy;
    if (act) act.value = hoy;
    const ua = document.getElementById('ultimo-acceso');
    if (ua) ua.textContent = d.toLocaleString('es-CO');
  },

  navTo(p, el) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    const pg = document.getElementById('page-' + p);
    if (pg) pg.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    if (el) el.classList.add('active');
    const tt = document.getElementById('topbar-title');
    const titulos = {dashboard:'Dashboard',agenda:'Agenda',calendario:'Calendario',equipos:'Equipos',referidos:'Referidos',reuniones:'Reuniones',tareas:'Tareas',redes:'Redes Sociales',compromisos:'Compromisos',lideres:'Líderes Estratégicos',mapa:'Mapa Territorial',documentos:'Documentos',bitacora:'Bitácora del Candidato',ia:'Asistente IA',config:'Configuración'};
    if (tt) tt.textContent = titulos[p] || p;
    this.paginaActual = p;
    if (window.innerWidth <= 768) closeMob();
    window.scrollTo(0, 0);
  },

  toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const tb = document.getElementById('topbar');
    const mn = document.getElementById('main');
    if (window.innerWidth <= 768) {
      sb.classList.toggle('mobile-open');
      document.getElementById('mob-overlay').style.display = sb.classList.contains('mobile-open') ? 'block' : 'none';
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      sb.classList.toggle('collapsed', this.sidebarCollapsed);
      tb.classList.toggle('collapsed', this.sidebarCollapsed);
      mn.classList.toggle('collapsed', this.sidebarCollapsed);
    }
  },

  // Cargar datos reales desde Google Sheets
  async cargarDatosGoogle() {
    if (!CONFIG.APPSCRIPT_URL) return;
    try {
      // Ping al servidor
      const ping = await GoogleAPI.call('ping');
      if (ping.ok) {
        toast('✅ Conectado con Google Workspace');
        this.actualizarContadores();
      }
    } catch(e) {
      console.log('Google no conectado aún:', e);
    }
  },

  async actualizarContadores() {
    try {
      const refs = await GoogleAPI.sheets.leer('Referidos');
      if (refs.ok && refs.filas) {
        const badge = document.getElementById('badge-referidos');
        const pendientes = refs.filas.filter(f => f['Estado'] === 'Pendiente').length;
        if (badge && pendientes > 0) badge.textContent = pendientes;
      }
    } catch(e) {}
  },
};
