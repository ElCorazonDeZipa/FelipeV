// ============================================================
// ZIPA CON EL CORAZÓN — Google Apps Script
// Despliega como "Aplicación web" con acceso "Cualquier usuario"
// URL ya desplegada:
// https://script.google.com/macros/s/AKfycbyCtjTocrNhGU5ePNrGBETc_IiIz34tznZWjthU-V2EtoahAKFVEZlNIWMBQQnQnd2C/exec
// ============================================================

// ID del Google Sheets principal — reemplaza con tu ID real
const SHEETS_ID = '18oCKARfHEAWW6LA8uUXPS45SGcOuwkWT6rDGViiVh-M';

// Calendarios
const CAL_CAMPANA  = 'corazonzipa@gmail.com';
const CAL_PERSONAL = 'pipeg12@gmail.com';

// Hojas disponibles
const HOJAS = ['Equipos','Referidos','Tareas','Reuniones','Compromisos','Lideres','Redes','Bitacora','Indicadores'];

// ─── CORS: responder GET y POST ───────────────────────────

function doGet(e) {
  const params = e.parameter;
  const accion = params.accion || '';
  let resultado;

  try {
    switch (accion) {
      case 'leerHoja':
        resultado = leerHoja(params.hoja);
        break;
      case 'leerEventos':
        resultado = leerEventos(params.inicio, params.fin);
        break;
      case 'verificarConflictos':
        resultado = verificarConflictos(params.fecha, params.horaInicio, params.horaFin);
        break;
      case 'ping':
        resultado = { ok: true, mensaje: 'Sistema Zipa activo', version: '1.0' };
        break;
      default:
        resultado = { ok: false, error: 'Acción no reconocida: ' + accion };
    }
  } catch (err) {
    resultado = { ok: false, error: err.toString() };
  }

  return responder(resultado);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return responder({ ok: false, error: 'JSON inválido' });
  }

  const accion = body.accion || '';
  let resultado;

  try {
    switch (accion) {
      case 'guardarFila':
        resultado = guardarFila(body.hoja, JSON.parse(body.fila));
        break;
      case 'actualizarFila':
        resultado = actualizarFila(body.hoja, body.id, JSON.parse(body.datos));
        break;
      case 'crearEvento':
        resultado = crearEvento(body);
        break;
      default:
        resultado = { ok: false, error: 'Acción POST no reconocida: ' + accion };
    }
  } catch (err) {
    resultado = { ok: false, error: err.toString() };
  }

  return responder(resultado);
}

function responder(datos) {
  return ContentService
    .createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── GOOGLE SHEETS ────────────────────────────────────────

function leerHoja(nombreHoja) {
  if (!HOJAS.includes(nombreHoja)) return { ok: false, error: 'Hoja no válida' };
  const ss = SpreadsheetApp.openById(SHEETS_ID);
  const hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) return { ok: false, error: 'Hoja no encontrada: ' + nombreHoja };

  const datos = hoja.getDataRange().getValues();
  if (datos.length < 2) return { ok: true, filas: [] };

  const encabezados = datos[0];
  const filas = datos.slice(1).map((fila, i) => {
    const obj = { _fila: i + 2 };
    encabezados.forEach((col, j) => { obj[col] = fila[j]; });
    return obj;
  });

  return { ok: true, hoja: nombreHoja, filas };
}

function guardarFila(nombreHoja, datos) {
  if (!HOJAS.includes(nombreHoja)) return { ok: false, error: 'Hoja no válida' };
  const ss = SpreadsheetApp.openById(SHEETS_ID);
  const hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) return { ok: false, error: 'Hoja no encontrada' };

  const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const fila = encabezados.map(col => datos[col] !== undefined ? datos[col] : '');
  fila[0] = fila[0] || new Date().toISOString(); // timestamp automático

  hoja.appendRow(fila);
  return { ok: true, mensaje: 'Fila guardada en ' + nombreHoja };
}

function actualizarFila(nombreHoja, numFila, datos) {
  const ss = SpreadsheetApp.openById(SHEETS_ID);
  const hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) return { ok: false, error: 'Hoja no encontrada' };

  const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  encabezados.forEach((col, j) => {
    if (datos[col] !== undefined) {
      hoja.getRange(numFila, j + 1).setValue(datos[col]);
    }
  });
  return { ok: true, mensaje: 'Fila ' + numFila + ' actualizada' };
}

// ─── GOOGLE CALENDAR ─────────────────────────────────────

function leerEventos(inicio, fin) {
  const fInicio = inicio ? new Date(inicio) : new Date();
  const fFin = fin ? new Date(fin) : new Date(Date.now() + 30 * 24 * 3600000);
  const eventos = [];

  [CAL_CAMPANA, CAL_PERSONAL].forEach(calId => {
    try {
      const cal = CalendarApp.getCalendarById(calId);
      if (!cal) return;
      cal.getEvents(fInicio, fFin).forEach(ev => {
        eventos.push({
          id: ev.getId(),
          titulo: ev.getTitle(),
          inicio: ev.getStartTime().toISOString(),
          fin: ev.getEndTime().toISOString(),
          lugar: ev.getLocation() || '',
          descripcion: ev.getDescription() || '',
          calendario: calId,
          color: calId === CAL_CAMPANA ? 'campana' : 'personal',
        });
      });
    } catch (err) {
      console.error('Error leyendo calendario ' + calId + ': ' + err);
    }
  });

  return { ok: true, eventos };
}

function crearEvento(datos) {
  // Verificar conflictos primero
  if (datos.verificarConflictos && datos.horaInicio) {
    const conflicto = verificarConflictos(datos.fecha, datos.horaInicio, datos.horaFin || datos.horaInicio);
    if (conflicto.hayConflicto) {
      return { ok: false, conflicto: true, eventos: conflicto.eventos, mensaje: 'Existe un conflicto de horario' };
    }
  }

  try {
    const calId = datos.calendario || CAL_CAMPANA;
    const cal = CalendarApp.getCalendarById(calId);
    if (!cal) return { ok: false, error: 'Calendario no encontrado: ' + calId };

    const fecha = datos.fecha;
    const hi = datos.horaInicio || '08:00';
    const hf = datos.horaFin || '09:00';

    const inicio = new Date(fecha + 'T' + hi + ':00');
    const fin = new Date(fecha + 'T' + hf + ':00');

    const ev = cal.createEvent(datos.titulo, inicio, fin, {
      location: datos.lugar || '',
      description: datos.descripcion || 'Creado desde Zipa con el Corazón',
    });

    return { ok: true, id: ev.getId(), mensaje: 'Evento creado en ' + calId };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}

function verificarConflictos(fecha, horaInicio, horaFin) {
  try {
    const inicio = new Date(fecha + 'T' + horaInicio + ':00');
    const fin = new Date(fecha + 'T' + (horaFin || horaInicio) + ':00');
    if (fin <= inicio) fin.setHours(fin.getHours() + 1);

    const conflictos = [];
    [CAL_CAMPANA, CAL_PERSONAL].forEach(calId => {
      try {
        const cal = CalendarApp.getCalendarById(calId);
        if (!cal) return;
        cal.getEvents(inicio, fin).forEach(ev => {
          conflictos.push({
            titulo: ev.getTitle(),
            inicio: ev.getStartTime().toISOString(),
            fin: ev.getEndTime().toISOString(),
            calendario: calId,
          });
        });
      } catch (e) {}
    });

    return { ok: true, hayConflicto: conflictos.length > 0, eventos: conflictos };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}

// ─── INICIALIZAR SHEETS ────────────────────────────────────
// Ejecuta esta función una sola vez para crear todas las hojas

function inicializarSheets() {
  const ss = SpreadsheetApp.openById(SHEETS_ID);
  const estructuras = {
    Equipos:      ['Fecha','Nombre','Telefono','Barrio','Dependencia','Vigia','Interes','Estado','UltimoContacto','Notas','Observaciones'],
    Referidos:    ['Fecha','Nombre','Telefono','Barrio','Ocupacion','QuienRefiere','FechaCita','HoraCita','Lugar','Estado','Resultado','Observaciones'],
    Tareas:       ['FechaCreacion','FechaEntrega','Responsable','Categoria','Descripcion','Prioridad','Estado','Observaciones'],
    Reuniones:    ['Fecha','Hora','Lugar','Nombre','Invitados','Descripcion','Notas','Compromisos','Estado'],
    Compromisos:  ['FechaSolicitud','Barrio','Nombre','Telefono','Peticion','Estado','Responsable','Seguimiento','FechaCumplimiento','Observaciones'],
    Lideres:      ['Nombre','Telefono','Sector','Barrio','Ocupacion','Prioridad','UltimoContacto','ProximoSeguimiento','Observaciones'],
    Redes:        ['Fecha','Hora','Red','Tipo','Tema','Objetivo','Estado','Responsable','Material','LinkPublicacion','Metricas'],
    Bitacora:     ['Fecha','Persona','Lugar','Resumen','Problemas','Compromisos','ProximasAcciones','Barrios','Temas'],
    Indicadores:  ['Fecha','Referidos','BarriosVisitados','CompromisosActivos','TareasCompletadas','ReunionesRealizadas','Notas'],
  };

  Object.entries(estructuras).forEach(([nombre, cols]) => {
    let hoja = ss.getSheetByName(nombre);
    if (!hoja) {
      hoja = ss.insertSheet(nombre);
    }
    if (hoja.getLastRow() === 0) {
      hoja.getRange(1, 1, 1, cols.length).setValues([cols]);
      hoja.getRange(1, 1, 1, cols.length).setBackground('#FF8C00').setFontColor('white').setFontWeight('bold');
      hoja.setFrozenRows(1);
    }
  });

  Logger.log('Sheets inicializadas correctamente');
}
