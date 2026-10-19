// LeadMaps Pro — Robô Oficial de Auto-Disparo no WhatsApp Web (whatsapp-autosend.js)
// Clica automaticamente no botão "Enviar" (➤) assim que a conversa e o texto carregam no WhatsApp Web.

(function () {
  console.log("[LeadMaps Pro] Auto-Sender do WhatsApp Web ativo.");

  let autoSendTimer = null;
  let lastSentSignature = "";

  function showWaBanner(text, tone = "emerald") {
    let banner = document.getElementById("leadmaps-wa-autobanner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "leadmaps-wa-autobanner";
      banner.style.cssText = [
        "position: fixed",
        "top: 12px",
        "left: 50%",
        "transform: translateX(-50%)",
        "z-index: 999999",
        "padding: 10px 18px",
        "border-radius: 999px",
        "font-family: system-ui, -apple-system, sans-serif",
        "font-size: 13px",
        "font-weight: 700",
        "color: #ffffff",
        "box-shadow: 0 10px 30px rgba(0,0,0,0.45)",
        "display: flex",
        "align-items: center",
        "gap: 8px",
        "transition: all 0.25s ease",
        "pointer-events: none"
      ].join(";");
      document.body.appendChild(banner);
    }

    if (tone === "emerald") {
      banner.style.background = "linear-gradient(90deg, #059669, #10b981)";
      banner.style.border = "1px solid #34d399";
    } else if (tone === "amber") {
      banner.style.background = "linear-gradient(90deg, #d97706, #f59e0b)";
      banner.style.border = "1px solid #fbbf24";
    } else {
      banner.style.background = "linear-gradient(90deg, #e11d48, #f43f5e)";
      banner.style.border = "1px solid #fb7185";
    }

    banner.textContent = text;
    banner.style.opacity = "1";
  }

  function findSendButton() {
    const selectors = [
      'button[data-testid="compose-btn-send"]',
      'button[data-testid="send"]',
      'span[data-testid="send"]',
      'span[data-icon="send"]',
      'span[data-icon="wds-ic-send-filled"]',
      'span[data-icon="round-send-primary"]',
      'footer button[aria-label="Enviar"]',
      'footer button[aria-label="Send"]',
      'button[aria-label="Enviar"]',
      'button[aria-label="Send"]',
      'footer button[aria-label*="Enviar" i]',
      'footer button[aria-label*="Send" i]',
      'button[data-tab="11"]'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        return el.closest("button") || el;
      }
    }
    return null;
  }

  function findInvalidNumberDialogButton() {
    const dialogs = document.querySelectorAll('div[data-animate-modal-popup="true"], div[role="dialog"]');
    for (const dialog of dialogs) {
      const txt = (dialog.innerText || "").toLowerCase();
      if (
        txt.includes("inválido") ||
        txt.includes("invalido") ||
        txt.includes("invalid") ||
        txt.includes("não está no whatsapp") ||
        txt.includes("isn't on whatsapp")
      ) {
        const btn = dialog.querySelector("button");
        if (btn) return btn;
      }
    }
    return null;
  }

  function triggerSendAction(signature, empresaName = "") {
    if (autoSendTimer) {
      clearInterval(autoSendTimer);
      autoSendTimer = null;
    }

    let attempts = 0;
    const maxAttempts = 60; // até 30 segundos aguardando o WhatsApp Web carregar a conversa

    showWaBanner(
      `🤖 LeadMaps Pro: Preparando envio automático${empresaName ? " para " + empresaName : ""}...`,
      "amber"
    );

    autoSendTimer = setInterval(() => {
      attempts++;

      // 1. Verifica se o número é inválido / sem WhatsApp
      const invalidBtn = findInvalidNumberDialogButton();
      if (invalidBtn) {
        clearInterval(autoSendTimer);
        autoSendTimer = null;
        invalidBtn.click();
        showWaBanner("⚠️ Número sem WhatsApp ativo. Pulando automaticamente...", "rose");
        try {
          chrome.runtime.sendMessage({
            type: "LEADMAPS_WA_SEND_RESULT",
            ok: false,
            reason: "invalid_number",
            empresa: empresaName
          });
        } catch (e) {}
        return;
      }

      // 2. Procura o botão de Enviar (➤)
      const sendBtn = findSendButton();
      const inputBox =
        document.querySelector('footer div[contenteditable="true"]') ||
        document.querySelector('div[contenteditable="true"][data-tab="10"]');

      if (sendBtn) {
        clearInterval(autoSendTimer);
        autoSendTimer = null;
        lastSentSignature = signature;

        // Pequeno delay humano de 700ms para o estado do React estabilizar
        setTimeout(() => {
          const btnNow = findSendButton() || sendBtn;
          btnNow.click();

          // Fallback extra: dispara evento de clique e tecla Enter caso necessário
          setTimeout(() => {
            const stillHasBtn = findSendButton();
            if (stillHasBtn) {
              stillHasBtn.click();
              const box =
                document.querySelector('footer div[contenteditable="true"]') ||
                document.querySelector('div[contenteditable="true"][data-tab="10"]');
              if (box) {
                box.focus();
                const enterEvent = new KeyboardEvent("keydown", {
                  key: "Enter",
                  code: "Enter",
                  keyCode: 13,
                  which: 13,
                  bubbles: true,
                  cancelable: true
                });
                box.dispatchEvent(enterEvent);
              }
            }

            showWaBanner(
              `✅ LeadMaps Pro: Mensagem enviada automaticamente${empresaName ? " para " + empresaName : ""}!`,
              "emerald"
            );

            try {
              chrome.runtime.sendMessage({
                type: "LEADMAPS_WA_SEND_RESULT",
                ok: true,
                empresa: empresaName
              });
            } catch (e) {}
          }, 500);
        }, 700);
        return;
      }

      // 3. Caso o texto esteja na caixa mas o botão ainda esteja renderizando
      if (attempts >= maxAttempts) {
        clearInterval(autoSendTimer);
        autoSendTimer = null;
        if (inputBox) {
          inputBox.focus();
          inputBox.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              code: "Enter",
              keyCode: 13,
              which: 13,
              bubbles: true
            })
          );
        }
      }
    }, 500);
  }

  // Verifica se a página foi aberta via URL com ?phone=...&text=...
  function checkUrlForAutoSend() {
    const params = new URLSearchParams(window.location.search);
    const phone = params.get("phone");
    const text = params.get("text");

    if (phone && text) {
      const sig = `${phone}:${text.slice(0, 30)}`;
      if (sig !== lastSentSignature) {
        triggerSendAction(sig);
      }
    }
  }

  // Executa na carga inicial
  checkUrlForAutoSend();

  // Escuta comandos diretos do Background Service Worker (Troca instantânea SPA sem recarregar a página!)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "EXECUTE_WA_SEND") {
      const { phone, text, empresa } = message.payload || {};
      if (!phone || !text) {
        sendResponse({ ok: false });
        return;
      }

      const sig = `${phone}:${text.slice(0, 30)}:${Date.now()}`;
      showWaBanner(`⚡ Abrindo conversa com ${empresa || phone}...`, "amber");

      // Injeta um link SPA interno no WhatsApp Web para abrir a conversa sem recarregar a aba inteira
      const link = document.createElement("a");
      link.href = `https://web.whatsapp.com/send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 300);

      triggerSendAction(sig, empresa);
      sendResponse({ ok: true });
      return true;
    }
  });
})();
