// ============================================================
// ZIPA CON EL CORAZÓN — Configuración del sistema
// Para uso local: crea config.local.js con tus valores reales
// config.local.js está en .gitignore (no se sube a GitHub)
// ============================================================

const CONFIG = {
  // Contraseña del sistema (en producción usar variable de entorno)
  PASSWORD: typeof __ZIPA_PASSWORD__ !== 'undefined' ? __ZIPA_PASSWORD__ : '4LC4LD32028*',

  // Google Apps Script endpoint (puente hacia Google Workspace)
  APPSCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyCtjTocrNhGU5ePNrGBETc_IiIz34tznZWjthU-V2EtoahAKFVEZlNIWMBQQnQnd2C/exec',

  // Calendarios
  CALENDAR_CAMPANA: 'corazonzipa@gmail.com',
  CALENDAR_PERSONAL: 'pipeg12@gmail.com',

  // Google Sheets ID — pon aquí el ID de tu hoja principal
  // (La parte larga del URL: docs.google.com/spreadsheets/d/ESTE_ID/edit)
  SHEETS_ID: '',

  // Google OAuth Client ID — obtenlo en console.cloud.google.com
  GOOGLE_CLIENT_ID: '',

  // API Key del Asistente IA
  // NUNCA pongas esta clave directamente aquí
  // Guárdala en config.local.js (está en .gitignore)
  IA_API_KEY: typeof __IA_API_KEY__ !== 'undefined' ? __IA_API_KEY__ : '',

  // Nombre del candidato
  CANDIDATO: 'Felipe Vanegas',
  CANDIDATO_INICIALES: 'FV',
  CANDIDATO_EMAIL: 'pipeg12@gmail.com',
  EMAIL_CAMPANA: 'corazonzipa@gmail.com',

  // Versión del sistema
  VERSION: '1.0.0',
  ANO_CAMPANA: '2028',
};

// Para uso local sin subir a GitHub:
// Crea un archivo config.local.js con:
//   window.__ZIPA_PASSWORD__ = 'tu_clave';
//   window.__IA_API_KEY__ = 'sk-...';
