// LeadMaps Pro — Ponte de Comunicação Oficial (leadmaps-bridge.js)
// Conecta o painel LeadMaps Pro ao Service Worker da Extensão para disparo 100% automático no WhatsApp Web.

(function () {
  function markExtensionActive() {
    if (document.documentElement) {
      document.documentElement.setAttribute("data-leadmaps-wa-extension", "active");
    }
  }

  markExtensionActive();
  document.addEventListener("DOMContentLoaded", markExtensionActive);

  // Sincronização inicial do cache de postagens da extensão para o painel
  try {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['leadmaps_post_days_cache', 'radarmaps:lastActivity'], (res) => {
        if (res && res.leadmaps_post_days_cache) {
          window.postMessage({
            type: "LEADMAPS_POST_CACHE_SYNC",
            cache: res.leadmaps_post_days_cache
          }, "*");
        }
        if (res && res['radarmaps:lastActivity']) {
          window.postMessage(res['radarmaps:lastActivity'], "*");
        }
      });

      // Escuta alterações no storage e notifica o painel reativamente em tempo real
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
          if (changes.leadmaps_post_days_cache) {
            window.postMessage({
              type: "LEADMAPS_POST_CACHE_SYNC",
              cache: changes.leadmaps_post_days_cache.newValue || {}
            }, "*");
          }
          if (changes['radarmaps:lastActivity'] && changes['radarmaps:lastActivity'].newValue) {
            window.postMessage(changes['radarmaps:lastActivity'].newValue, "*");
          }
        }
      });
    }
  } catch(e) {}

  // Escuta pedidos do painel LeadMaps Pro (js/app.js)
  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data) return;

    if (event.data.type === "LEADMAPS_WA_DISPATCH") {
      try {
        chrome.runtime.sendMessage(
          {
            type: "DISPATCH_WHATSAPP_AUTO",
            payload: event.data.payload
          },
          (response) => {
            window.postMessage(
              {
                type: "LEADMAPS_WA_DISPATCH_ACK",
                response: response || { ok: true }
              },
              "*"
            );
          }
        );
      } catch (err) {
        console.warn("[LeadMaps Bridge] Erro ao comunicar com background:", err);
      }
    } else if (event.data.type === "LEADMAPS_SET_POST_DAYS") {
      try {
        if (chrome.storage && chrome.storage.local && event.data.empresa) {
          chrome.storage.local.get(['leadmaps_post_days_cache'], (res) => {
            const cache = res.leadmaps_post_days_cache || {};
            cache[event.data.empresa] = event.data.dias;
            chrome.storage.local.set({ 'leadmaps_post_days_cache': cache });
          });
        }
      } catch(e) {}
    }
  });

  // Recebe confirmação de envio concluído vinda do WhatsApp Web via background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "LEADMAPS_WA_SEND_RESULT") {
      window.postMessage(
        {
          type: "LEADMAPS_WA_SEND_COMPLETED",
          payload: message
        },
        "*"
      );
    }
  });
})();
