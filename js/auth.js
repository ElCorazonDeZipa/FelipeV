// ZIPA — Módulo de autenticación
const Auth = {
  check(valor) {
    if (valor === CONFIG.PASSWORD) {
      const ts = Date.now();
      try { localStorage.setItem('zipa_s', JSON.stringify({ a: true, t: ts })); } catch(e) {}
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      APP.init();
      return true;
    }
    return false;
  },

  logout() {
    if (!confirm('¿Seguro que deseas cerrar sesión?')) return;
    try { localStorage.removeItem('zipa_s'); } catch(e) {}
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    document.getElementById('pwd-input').value = '';
  },

  autoLogin() {
    try {
      const s = JSON.parse(localStorage.getItem('zipa_s') || '{}');
      if (s.a && Date.now() - s.t < 8 * 3600000) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        APP.init();
        return true;
      }
    } catch(e) {}
    return false;
  },
};
