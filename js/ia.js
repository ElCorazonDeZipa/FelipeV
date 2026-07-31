// ZIPA — Módulo Asistente IA
const AsistenteIA = {
  historial: [],

  RESPUESTAS: {
    vencid: 'Tienes <strong>2 tareas vencidas</strong>:<br>1. Seguimiento compromiso barrio El Centro<br>2. Propuesta JAC Arco Iris<br><br>Te recomiendo asignarlas a un vigía hoy mismo.',
    maana: 'Mañana tienes programado:<br>• <strong>10:00</strong> Consejo comunal El Centro<br>• <strong>15:00</strong> Entrega propuesta adultos mayores',
    compromis: 'Compromisos pendientes:<br>• Arreglo vía carrera 5 — <strong>vencido ⚠</strong><br>• Cancha sintética La Unión — vence 30 ene<br>• Total: <strong>7 pendientes, 2 vencidos</strong>',
    referid: 'Esta semana: <strong>3 nuevos referidos</strong>.<br>Total acumulado: <strong>47 referidos</strong>.<br>3 pendientes sin agendar.',
    barri: 'Mayor actividad:<br>1. 🟠 <strong>El Centro</strong> — 8 eventos<br>2. 🟡 <strong>La Unión</strong> — 5 eventos<br>3. 🟢 <strong>San Jorge</strong> — 4 eventos<br>Barrios sin visitar: 16 en zona sur.',
    prioriz: 'Prioridades esta semana:<br>1. Cerrar 2 compromisos vencidos<br>2. Contactar 3 referidos sin seguimiento<br>3. Recorrido zona sur<br>4. Asignar responsable a tareas huérfanas',
    seguimient: 'Seguimiento urgente:<br>• <strong>María Torres</strong> — cita hoy<br>• <strong>Carlos Pérez</strong> — 5 días sin contacto<br>• <strong>Jorge Sánchez</strong> (líder) — seguimiento vencido',
    resumen: '<strong>Resumen ejecutivo — Zipa con el Corazón</strong><br><br>📊 Referidos: 47 (47%)<br>🗺 Barrios visitados: 12/28<br>✅ Compromisos cumplidos: 18/27<br>⚠️ Urgente: 2 vencidos, 3 sin seguimiento',
    default: 'Puedo ayudarte con análisis de tareas, reuniones, referidos, compromisos y tendencias territoriales. ¿Qué necesitas revisar?',
  },

  async enviar(msg) {
    const chat = document.getElementById('ia-chat');
    if (!msg || !msg.trim()) return;

    const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    chat.innerHTML += `<div class="ia-msg user">${esc(msg)}</div>`;

    const lid = 'l' + Date.now();
    chat.innerHTML += `<div class="ia-msg bot" id="${lid}"><span class="dot-anim"><span>•</span><span>•</span><span>•</span></span></div>`;
    chat.scrollTop = chat.scrollHeight;

    // Si hay API Key configurada, usar IA real
    if (CONFIG.IA_API_KEY) {
      const respuesta = await this.llamarAPI(msg);
      document.getElementById(lid).innerHTML = respuesta;
    } else {
      const respuesta = this.respuestaLocal(msg);
      setTimeout(() => {
        const el = document.getElementById(lid);
        if (el) el.innerHTML = respuesta;
        chat.scrollTop = chat.scrollHeight;
      }, 700 + Math.random() * 500);
    }
  },

  async llamarAPI(msg) {
    try {
      const contexto = `Eres el asistente de campaña de Felipe Vanegas, candidato a la alcaldía de Zipaquirá 2028. 
      La campaña se llama "Zipa con el Corazón". 
      Responde preguntas sobre tareas, reuniones, referidos, compromisos y estrategia de campaña.
      Sé conciso, útil y en español. No hagas inferencias sobre preferencias políticas de personas.
      Puedes resumir niveles de interés, disposición al diálogo y necesidades identificadas.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.IA_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          system: contexto,
          messages: [{ role: 'user', content: msg }],
        }),
      });

      if (!res.ok) throw new Error('Error API: ' + res.status);
      const data = await res.json();
      return data.content[0].text.replace(/\n/g, '<br>');
    } catch(e) {
      console.error('IA API Error:', e);
      return this.respuestaLocal(msg) + '<br><br><em style="color:#888;font-size:11px">⚠ Modo local (verifica tu API Key)</em>';
    }
  },

  respuestaLocal(msg) {
    const ml = msg.toLowerCase();
    if (ml.includes('vencid') || ml.includes('atras')) return this.RESPUESTAS.vencid;
    if (ml.includes('maña') || ml.includes('reunió')) return this.RESPUESTAS.maana;
    if (ml.includes('compromis')) return this.RESPUESTAS.compromis;
    if (ml.includes('referid')) return this.RESPUESTAS.referid;
    if (ml.includes('barri') || ml.includes('activ') || ml.includes('territ')) return this.RESPUESTAS.barri;
    if (ml.includes('prioriz') || ml.includes('recomiend')) return this.RESPUESTAS.prioriz;
    if (ml.includes('seguimient') || ml.includes('quien')) return this.RESPUESTAS.seguimient;
    if (ml.includes('resumen') || ml.includes('ejecutiv')) return this.RESPUESTAS.resumen;
    return this.RESPUESTAS.default;
  },

  limpiar() {
    const c = document.getElementById('ia-chat');
    if (c) c.innerHTML = '<div class="ia-msg bot">Chat reiniciado. ¿En qué puedo ayudarte?</div>';
  },
};
