/* ==========================================================================
   LeadMaps Pro — Security Shield & Anti-AI Cloning Protection v2.6
   Propriedade Exclusiva: Ricardo & Severino
   ========================================================================== */
(function () {
  'use strict';

  const OWNER_UNLOCK_KEY = 'leadmaps_owner_dev_unlock';

  function isOwnerUnlocked() {
    try {
      return sessionStorage.getItem(OWNER_UNLOCK_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function notifyShield(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    }
  }

  // 1. Atalho Secreto do Proprietário (Ricardo): Ctrl + Alt + R
  // Permite ao Ricardo destravar/travar o modo desenvolvedor na própria máquina quando precisar
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      try {
        const current = isOwnerUnlocked();
        if (current) {
          sessionStorage.removeItem(OWNER_UNLOCK_KEY);
          notifyShield('🔒 Blindagem LeadMaps Pro REATIVADA!');
        } else {
          sessionStorage.setItem(OWNER_UNLOCK_KEY, '1');
          notifyShield('🔓 Modo Proprietário (Ricardo): Inspeção liberada nesta aba.');
        }
      } catch (err) {}
      return;
    }

    if (isOwnerUnlocked()) return;

    // 2. Bloqueio de F12, Ctrl+Shift+I/J/C (DevTools), Ctrl+U (View Source), Ctrl+S (Save HTML)
    const key = (e.key || '').toLowerCase();
    const isF12 = e.key === 'F12' || e.keyCode === 123;
    const isDevToolsCombo = e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c');
    const isViewSource = e.ctrlKey && key === 'u';
    const isSavePage = e.ctrlKey && key === 's';

    if (isF12 || isDevToolsCombo || isViewSource || isSavePage) {
      e.preventDefault();
      e.stopPropagation();
      notifyShield('🔒 Sistema Blindado — Código-fonte protegido por direitos autorais.');
      return false;
    }
  }, true);

  // 3. Bloqueio Inteligente de Botão Direito (Permite apenas em inputs/textareas para colar texto)
  window.addEventListener('contextmenu', function (e) {
    if (isOwnerUnlocked()) return;
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') {
      return; // Permite colar normalmente nos campos de busca e mensagem
    }
    e.preventDefault();
    notifyShield('🔒 Proteção Ativa — Ação bloqueada pelo escudo de segurança.');
    return false;
  }, true);

  // 4. Proteção contra arraste/cópia estrutural acidental fora de áreas de texto
  window.addEventListener('dragstart', function (e) {
    if (isOwnerUnlocked()) return;
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'img' || tag === 'a') {
      e.preventDefault();
    }
  });

  // 5. Aviso de Segurança no Console contra Engenharia Reversa e Raspagem por IA
  try {
    console.clear();
    console.log(
      '%c🛑 PARE! SISTEMA BLINDADO — LEADMAPS PRO ENTERPRISE',
      'color: #ef4444; font-size: 20px; font-weight: 900; text-shadow: 1px 1px 0 #000;'
    );
    console.log(
      '%cEste software e sua arquitetura são de propriedade exclusiva protegida. Qualquer tentativa de extração, engenharia reversa ou submissão deste código a modelos de IA constitui violação de propriedade intelectual.',
      'color: #f59e0b; font-size: 13px; font-weight: 700;'
    );
  } catch (e) {}
})();
