// LeadMaps Pro — Popup Controller

let currentLeads = [];

document.addEventListener('DOMContentLoaded', async () => {
  const statusContainer = document.getElementById('statusContainer');
  const leadCountEl = document.getElementById('leadCount');
  const btnExtract = document.getElementById('btnExtract');
  const btnScroll = document.getElementById('btnScroll');
  const btnOpenDashboard = document.getElementById('btnOpenDashboard');
  const btnExportCSV = document.getElementById('btnExportCSV');

  // 1. Identificar aba atual
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isGoogleMaps = tab && tab.url && (tab.url.includes('google.com/maps') || tab.url.includes('maps.google.com'));

  if (!isGoogleMaps) {
    statusContainer.innerHTML = `
      <div class="status-offline">
        <span>⚠️</span> Você não está no Google Maps.
      </div>
      <p style="margin-top: 6px; font-size: 10px; color: #94a3b8;">
        Abra o Google Maps, faça uma pesquisa (ex: <i>"clínicas em Santo André"</i>) e abra esta extensão.
      </p>
      <button id="btnOpenMaps" style="margin-top: 8px; width: 100%; padding: 6px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
        🌐 Abrir Google Maps Agora
      </button>
    `;
    document.getElementById('btnOpenMaps')?.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://www.google.com/maps/search/clinicas+em+santo+andre' });
    });
    btnExtract.disabled = true;
    btnScroll.disabled = true;
    return;
  }

  statusContainer.innerHTML = `
    <div class="status-online">
      <span>●</span> Conectado ao Google Maps Oficial
    </div>
    <p style="margin-top: 4px; font-size: 10px; color: #94a3b8;">
      Pronto para raspar empresas reais sem custo de API.
    </p>
  `;

  // Carrega leads salvos no storage se houver
  chrome.storage.local.get(['leadmaps_scraped_leads'], (res) => {
    if (res.leadmaps_scraped_leads && res.leadmaps_scraped_leads.length > 0) {
      currentLeads = res.leadmaps_scraped_leads;
      leadCountEl.textContent = currentLeads.length;
    }
  });

  // Botão: Auto-Rastrear Sozinho (Rola automaticamente e abre painel)
  const btnAutoMine = document.getElementById('btnAutoMine');
  if (btnAutoMine) {
    btnAutoMine.addEventListener('click', () => {
      btnAutoMine.textContent = "⏳ Rolando Maps sozinho...";
      btnAutoMine.disabled = true;
      chrome.tabs.sendMessage(tab.id, { action: "auto_scroll_mine" }, (res) => {
        btnAutoMine.disabled = false;
        btnAutoMine.textContent = "⚡ Rastrear Sozinho (35+ Leads)";
        if (res && res.success && res.leads) {
          currentLeads = res.leads;
          leadCountEl.textContent = res.count;
          chrome.storage.local.set({ 'leadmaps_scraped_leads': currentLeads }, () => {
            const exportUrl = chrome.runtime.getURL('export.html');
            chrome.tabs.create({ url: exportUrl });
          });
        }
      });
    });
  }

  // Botão: Extrair da Tela
  btnExtract.addEventListener('click', () => {
    btnExtract.textContent = "⏳ Extraindo...";
    chrome.tabs.sendMessage(tab.id, { action: "extract_leads" }, (res) => {
      btnExtract.textContent = "🚀 Extrair Leads da Tela";
      if (res && res.success) {
        currentLeads = res.leads;
        leadCountEl.textContent = res.count;
        chrome.storage.local.set({ 'leadmaps_scraped_leads': currentLeads });
        alert(`Sucesso! ${res.count} comércios reais extraídos do Google Maps!`);
      } else {
        alert("Nenhum comércio encontrado no painel do Google Maps. Role a lista lateral do Maps e tente novamente.");
      }
    });
  });

  // Botão: Rolar e Carregar Mais
  btnScroll.addEventListener('click', () => {
    btnScroll.textContent = "⏳ Rolando Maps...";
    chrome.tabs.sendMessage(tab.id, { action: "auto_scroll" }, (res) => {
      btnScroll.textContent = "⏬ Rolar e Carregar Mais (+20)";
      if (res && res.success) {
        currentLeads = res.leads;
        leadCountEl.textContent = res.count;
        chrome.storage.local.set({ 'leadmaps_scraped_leads': currentLeads });
      }
    });
  });

  // Botão: Abrir no Painel LeadMaps Pro
  btnOpenDashboard.addEventListener('click', () => {
    if (currentLeads.length === 0) {
      alert("Extraia os leads primeiro antes de abrir o painel!");
      return;
    }
    chrome.storage.local.set({ 'leadmaps_scraped_leads': currentLeads }, () => {
      const exportUrl = chrome.runtime.getURL('export.html');
      chrome.tabs.create({ url: exportUrl });
    });
  });

  // Botão: Exportar CSV
  btnExportCSV.addEventListener('click', () => {
    if (currentLeads.length === 0) {
      alert("Nenhum lead extraído para exportar!");
      return;
    }
    exportToCSV(currentLeads);
  });
});

function exportToCSV(leads) {
  const headers = ["Empresa", "Categoria", "Telefone", "Cidade", "Rating", "Reviews", "TemSite", "ScoreGBP", "LinkGoogleMaps"];
  const rows = leads.map(l => [
    l.empresa,
    l.categoria,
    l.telefone,
    l.cidade,
    String(l.rating),
    String(l.reviews),
    l.temSite ? "Sim" : "Não",
    String(l.score),
    l.mapsUrl || ""
  ]);

  const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_google_maps_${Date.now()}.csv`;
  a.click();
}
