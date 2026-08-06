# Zipa con el Corazón 🧡
## Centro de Operaciones e Inteligencia de Campaña

Sistema de gestión político-operacional para la campaña a la Alcaldía de Zipaquirá 2028.

---

## 🚀 Puesta en marcha rápida

### 1. Clonar y abrir
```bash
git clone https://github.com/TU_USUARIO/zipa-campana.git
cd zipa-campana
```

### 2. Configurar variables secretas (NO se suben a GitHub)

Crea un archivo `config.local.js` en la raíz (está en `.gitignore`):
```js
// config.local.js — NO SUBIR A GITHUB
window.__IA_API_KEY__ = 'sk-ant-...'; // Tu API Key de Anthropic
```

> ⚠️ **IMPORTANTE:** `config.local.js` está en `.gitignore` y nunca se subirá. Es solo para desarrollo local.

### 3. Configurar Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com) y crea un nuevo documento
2. Copia el **ID** del URL: `docs.google.com/spreadsheets/d/**ESTE_ID**/edit`
3. Pégalo en `appscript/Codigo.gs` en la línea `const SHEETS_ID = '...'`
4. En el sistema, ve a **Configuración → Google Workspace** y pega el ID

### 4. Inicializar hojas de cálculo

1. Abre [Google Apps Script](https://script.google.com)
2. El script ya está desplegado en:
   `https://script.google.com/macros/s/AKfycbyCtjTocrNhGU5ePNrGBETc_IiIz34tznZWjthU-V2EtoahAKFVEZlNIWMBQQnQnd2C/exec`
3. Ejecuta la función `inicializarSheets()` **una sola vez** para crear todas las hojas automáticamente

### 5. Publicar en GitHub Pages

1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. Selecciona rama `main` y carpeta `/ (root)`
4. Tu sistema estará en `https://TU_USUARIO.github.io/zipa-campana`

---

## 🏗️ Estructura del proyecto

```
zipa-campana/
├── index.html          ← Sistema principal (abre este en el navegador)
├── config.js           ← Configuración pública (sin secretos)
├── config.local.js     ← 🔒 SECRETOS — en .gitignore, no se sube
├── .env.example        ← Plantilla de variables (sí se sube)
├── .gitignore          ← Protege archivos secretos
├── README.md           ← Este archivo
├── api/
│   └── google.js       ← Módulo integración Google Workspace
├── js/
│   ├── app.js          ← Lógica principal
│   ├── auth.js         ← Autenticación
│   └── ia.js           ← Asistente IA
└── appscript/
    └── Codigo.gs       ← Código Google Apps Script
```

---

## 🔗 Conexiones Google

| Servicio | Cuenta | Estado |
|----------|--------|--------|
| Calendario campaña | corazonzipa@gmail.com | Configurado |
| Calendario personal | pipeg12@gmail.com | Configurado |
| Apps Script | Ya desplegado | ✅ Activo |
| Google Sheets | Configurar ID en `config.js` | ⚙️ Pendiente |
| Google Drive | OAuth requerido | ⚙️ Pendiente |

**Apps Script URL:**
```
https://script.google.com/macros/s/AKfycbyCtjTocrNhGU5ePNrGBETc_IiIz34tznZWjthU-V2EtoahAKFVEZlNIWMBQQnQnd2C/exec
```

---

## 🔒 Seguridad

- La contraseña del sistema **nunca** se almacena en texto plano en el repositorio público
- Las API Keys van en `config.local.js` (bloqueado por `.gitignore`)
- Para producción en GitHub Pages: usa [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) con GitHub Actions
- La sesión dura 8 horas y se guarda en `localStorage`

---

## 🤖 Asistente IA

El asistente funciona en dos modos:
1. **Modo local** (sin API Key): respuestas predefinidas basadas en datos del sistema
2. **Modo IA real** (con API Key): conecta con Claude (Anthropic) para análisis inteligente

Para activar el modo real:
1. Obtén una API Key en [console.anthropic.com](https://console.anthropic.com)
2. Agrégala en **Configuración → Asistente IA** dentro del sistema
3. O ponla en `config.local.js`: `window.__IA_API_KEY__ = 'sk-ant-...'`

---

## 📋 Módulos del sistema

- **Dashboard** — Centro de inteligencia en tiempo real
- **Agenda** — Actividades del día y próximos eventos
- **Calendario** — Vista integrada campaña + personal
- **Equipos** — Contactos por vigía (Deportes, Cultura, Familia, Mujer, Admin, Adulto Mayor)
- **Referidos** — Seguimiento de personas referidas con sincronización de citas
- **Reuniones** — Registro y actas
- **Tareas** — Kanban + lista con prioridades
- **Redes Sociales** — Calendario editorial
- **Compromisos** — Seguimiento con alertas de vencimiento
- **Líderes Estratégicos** — Red de líderes comunitarios
- **Mapa Territorial** — Cobertura en Zipaquirá (requiere Google Maps API Key)
- **Documentos** — Repositorio con Google Drive
- **Bitácora** — Registro privado del candidato con análisis IA
- **Asistente IA** — Chat inteligente de campaña
- **Configuración** — Conexiones y seguridad

---

**Candidato:** Felipe Vanegas  
**Campaña:** Zipa con el Corazón  
**Ciudad:** Zipaquirá, Cundinamarca  
**Año:** 2028
