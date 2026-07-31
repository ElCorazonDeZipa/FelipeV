// ZIPA — Integración Google Workspace via Apps Script
const GoogleAPI = {
  get url() { return CONFIG.APPSCRIPT_URL; },

  async call(accion, datos = {}) {
    try {
      const params = new URLSearchParams({ accion, ...datos });
      const res = await fetch(`${this.url}?${params}`);
      if (!res.ok) throw new Error('Error ' + res.status);
      return await res.json();
    } catch (e) {
      console.error('GoogleAPI:', e);
      return { ok: false, error: e.message };
    }
  },

  async post(accion, datos = {}) {
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion, ...datos }),
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  async leerHoja(hoja) { return this.call('leerHoja', { hoja }); },
  async guardarFila(hoja, fila) { return this.post('guardarFila', { hoja, fila: JSON.stringify(fila) }); },
  async actualizarFila(hoja, id, datos) { return this.post('actualizarFila', { hoja, id, datos: JSON.stringify(datos) }); },

  async leerEventos(inicio, fin) {
    return this.call('leerEventos', {
      calCampana: CONFIG.CALENDAR_CAMPANA,
      calPersonal: CONFIG.CALENDAR_PERSONAL,
      inicio, fin,
    });
  },

  async crearEvento(d) {
    return this.post('crearEvento', {
      calendario: d.calendario || CONFIG.CALENDAR_CAMPANA,
      titulo: d.titulo, fecha: d.fecha,
      horaInicio: d.horaInicio, horaFin: d.horaFin || '',
      lugar: d.lugar || '', descripcion: d.descripcion || '',
      verificarConflictos: true,
    });
  },

  async verificarConflictos(fecha, hi, hf) {
    return this.call('verificarConflictos', {
      fecha, horaInicio: hi, horaFin: hf,
      calCampana: CONFIG.CALENDAR_CAMPANA,
      calPersonal: CONFIG.CALENDAR_PERSONAL,
    });
  },

  sheets: {
    leer: (h) => GoogleAPI.leerHoja(h),
    guardar: (h, d) => GoogleAPI.guardarFila(h, d),
  },
};
