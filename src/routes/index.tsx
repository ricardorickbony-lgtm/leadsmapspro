import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin, ScanSearch, FileText, MessageCircle, LogIn, Tags, BookOpen, ArrowRight,
  Check, X, Zap, CreditCard, Search, Send, Handshake, Crosshair, Download, Sparkles,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { calcRoi, isSupportOnline } from "@/lib/roi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadMaps Pro Enterprise — Google Maps em contratos recorrentes" },
      { name: "description", content: "Extraia empresas do Google Maps, audite 22 pontos de SEO Local e feche consultorias de R$ 1.500 a R$ 5.000/mês com relatórios white-label." },
      { property: "og:title", content: "LeadMaps Pro Enterprise v2.6" },
      { property: "og:description", content: "Extrator em massa, auditoria de 22 itens e GeoGrid GPS para consultores B2B." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WA = "5511970558412";
const wa = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function useOnline() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => {
    setOn(isSupportOnline());
    const t = setInterval(() => setOn(isSupportOnline()), 60000);
    return () => clearInterval(t);
  }, []);
  return on;
}

function Dot({ on }: { on: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${on ? "bg-primary" : "bg-muted-foreground"}`} />
    </span>
  );
}

const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-glow";
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent";

function Header() {
  const on = useOnline();
  const links = [["Hub", "hub"], ["Os 3 Pilares", "pilares"], ["Pré-Análises", "pre-analises"], ["Como Funciona", "fluxo"], ["Calculadora ROI", "roi"], ["Planos", "planos"], ["FAQ", "faq"]];
  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground"><MapPin className="h-4 w-4" /></span>
          <span className="font-display text-lg font-extrabold">LeadMaps <span className="text-primary">PRO</span></span>
          <span className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">v2.6 Enterprise</span>
        </a>
        <nav className="hidden flex-1 justify-center gap-5 lg:flex">
          {links.map(([l, id]) => <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition hover:text-foreground">{l}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {on !== null && (
            <a href={wa("Olá Ricardo, preciso de suporte.")} target="_blank" rel="noreferrer" className="hidden items-center gap-2 font-mono text-xs text-muted-foreground md:flex">
              <Dot on={on} /> {on ? "Suporte Online" : "Suporte Offline"}
            </a>
          )}
          <a href="#hub" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Login</a>
          <a href="#hub" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">Abrir Ferramenta</a>
        </div>
      </div>
    </header>
  );
}

const pins = [
  { r: 1, km: 1.2 }, { r: 4, km: 2.8 }, { r: 12, km: 5.1 },
  { r: 4, km: 1.9 }, { r: 1, km: 0 }, { r: 12, km: 6.4 },
  { r: 12, km: 4.7 }, { r: 4, km: 3.3 }, { r: 12, km: 8.0 },
];
const pinTone = (r: number) => (r === 1 ? "bg-primary text-primary-foreground" : r === 4 ? "bg-warn text-gold-foreground" : "bg-danger text-destructive-foreground");
const diag = (r: number) => r === 1 ? "Domina o Top 3 nesta região. Mantenha avaliações e postagens." : r === 4 ? "Fora do Top 3: perde ~60% dos cliques locais. Oportunidade de otimização." : "Invisível nesta área. Concorrentes capturam praticamente toda a demanda.";

function Console() {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(4);
  const tabs = ["GeoGrid GPS", "Auditoria 22 Itens", "Extrator em Massa"];
  return (
    <div className="panel overflow-hidden shadow-glow">
      <div className="flex items-center gap-2 border-b border-border bg-background-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger" /><span className="h-2.5 w-2.5 rounded-full bg-warn" /><span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">console.leadmaps.pro</span>
      </div>
      <div className="flex border-b border-border">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`flex-1 px-3 py-3 text-xs font-semibold transition sm:text-sm ${tab === i ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      <div className="min-h-[340px] p-5">
        {tab === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid-bg grid grid-cols-3 gap-3 rounded-lg border border-border bg-background-2 p-4">
              {pins.map((p, i) => (
                <button key={i} onClick={() => setSel(i)} className={`grid aspect-square place-items-center rounded-full font-mono text-sm font-bold transition ${pinTone(p.r)} ${sel === i ? "scale-110 ring-2 ring-foreground" : "opacity-80 hover:opacity-100"}`}>#{p.r}</button>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-mono text-xs text-muted-foreground">CLÍNICA ODONTO SORRISO • raio 5km</p>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-extrabold">#{pins[sel]!.r}</span>
                <span className="font-mono text-sm text-muted-foreground">{pins[sel]!.km.toFixed(1)} km do centro</span>
              </div>
              <p className="text-sm text-muted-foreground">{diag(pins[sel]!.r)}</p>
              <p className="font-mono text-[11px] text-muted-foreground">lat -23.5{50 + sel} • lng -46.63{sel}</p>
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-4">
                <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-warn"><span className="font-mono text-2xl font-bold">48<span className="text-sm text-muted-foreground">/100</span></span></div>
                <p className="text-sm text-muted-foreground">Score SEO Local<br /><span className="font-semibold text-warn">Crítico</span></p>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {["Sem Pixel de rastreamento", "Sem Tour 360°", "Sem Botão de Agendamento", "Respostas a avaliações: 12%"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><X className="h-4 w-4 text-danger" />{f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-foreground p-4 text-background">
              <div className="flex items-center justify-between border-b border-background/20 pb-2">
                <span className="font-display text-sm font-extrabold">SUA AGÊNCIA</span>
                <span className="font-mono text-[10px]">RELATÓRIO PDF</span>
              </div>
              <div className="mt-3 space-y-2">{[90, 70, 85, 55, 75].map((w, i) => <div key={i} className="h-2 rounded bg-background/20" style={{ width: `${w}%` }} />)}</div>
              <p className="mt-4 font-mono text-[10px] opacity-70">White-label • logotipo da agência</p>
            </div>
          </div>
        )}
        {tab === 2 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="font-mono text-[11px] uppercase text-muted-foreground"><tr><th className="pb-3">Empresa</th><th>Nicho</th><th>Telefone</th><th>WhatsApp</th><th /></tr></thead>
              <tbody className="divide-y divide-border">
                {[["Odonto Sorriso", "Dentista", "(11) 3021-4455", true], ["Pet Vida", "Pet shop", "(11) 2944-1020", true], ["Studio Fit", "Academia", "(11) 3388-7710", false], ["Bella Estética", "Estética", "(11) 4002-8922", true], ["AutoCenter SP", "Mecânica", "(11) 2511-0909", true]].map(([n, c, t, w]) => (
                  <tr key={n as string}>
                    <td className="py-2.5 font-medium">{n}</td><td className="text-muted-foreground">{c}</td><td className="font-mono text-xs">{t}</td>
                    <td>{w ? <span className="inline-flex items-center gap-1 text-xs text-primary"><Check className="h-3.5 w-3.5" />validado</span> : <span className="text-xs text-muted-foreground">—</span>}</td>
                    <td className="text-right"><button onClick={() => setTab(1)} className="rounded border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10">Auditar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="grid-bg relative pt-28 pb-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] text-primary">🚀 INTELIGÊNCIA COMERCIAL B2B • VERSÃO 2.6 ENTERPRISE</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Transforme o Google Maps em <span className="text-gold-grad">contratos de consultoria recorrentes.</span></h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">Extraia empresas qualificadas, gere a <span className="font-semibold text-foreground">pré-análise individual</span> de cada uma e mostre ao cliente exatamente onde ele está perdendo vendas — com relatórios white-label prontos para fechar <span className="font-mono text-foreground">R$ 1.500 a R$ 5.000/mês</span>.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#hub" className={btnPrimary}>Abrir a Ferramenta Agora <ArrowRight className="h-4 w-4" /></a>
            <a href="#planos" className={btnGhost}>Ver Planos & Preços</a>
            <a href={wa("Olá Ricardo, quero suporte VIP do LeadMaps Pro.")} target="_blank" rel="noreferrer" className={btnGhost}><MessageCircle className="h-4 w-4 text-primary" />Suporte VIP WhatsApp</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Pré-Análise Individual", "22 Itens Auditados", "GeoGrid GPS 1km a 20km", "PDF White-Label", "WhatsApp Validado"].map((p) => (
              <span key={p} className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{p}</span>
            ))}
          </div>
        </div>
        <Console />
      </div>
    </section>
  );
}

function SectionTitle({ k, t, s }: { k: string; t: string; s?: string }) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{k}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t}</h2>
      {s && <p className="mt-4 text-muted-foreground">{s}</p>}
    </div>
  );
}

function Hub() {
  const on = useOnline();
  const cards = [
    { i: Crosshair, t: "Ferramenta Web Principal", d: "Painel completo: extração, auditoria e GeoGrid.", cta: "Abrir painel", href: "#top", big: true },
    { i: FileText, t: "Pré-Análise Individual", d: "Diagnóstico de uma empresa específica, com o nome dela, pronto para enviar.", cta: "Gerar agora", href: "#pre-analises" },
    { i: LogIn, t: "Login & Ativação de Chave", d: "Acesso exclusivo de assinantes.", cta: "Entrar", href: wa("Olá, preciso ativar minha chave LeadMaps Pro.") },
    { i: Tags, t: "Planos & Preços", d: "Compare Mensal e Anual.", cta: "Comparar", href: "#planos" },
    { i: MessageCircle, t: "Suporte VIP no WhatsApp", d: "Atendimento direto com Ricardo • 11 97055-8412", cta: "Chamar", href: wa("Olá Ricardo, preciso de suporte."), status: true },
    { i: BookOpen, t: "Metodologia de Fechamento", d: "Passo a passo comercial para fechar recorrência.", cta: "Ver passos", href: "#fluxo" },
  ];
  return (
    <section id="hub" className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle k="Hub central" t="Todos os acessos em um só lugar." />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`panel group flex flex-col justify-between p-6 transition hover:border-primary/40 ${c.big ? "md:row-span-2 border-primary/40 bg-primary/5 shadow-glow" : ""}`}>
            <div>
              <div className="flex items-center justify-between">
                <c.i className={`h-6 w-6 ${c.big ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                {c.status && on !== null && <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground"><Dot on={on} />{on ? "online" : "offline"}</span>}
              </div>
              <h3 className={`mt-5 font-bold ${c.big ? "text-2xl" : "text-lg"}`}>{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
            <span className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${c.big ? "w-fit rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" : "text-primary"}`}>{c.cta}<ArrowRight className="h-4 w-4" /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Pain() {
  return (
    <section className="border-y border-border bg-background-2 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle k="A dor do consultor" t="Pare de vender como amador." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel p-8">
            <h3 className="text-lg font-bold text-muted-foreground">Método Tradicional Amador</h3>
            <ul className="mt-6 space-y-4">{["Listas frias compradas e desatualizadas", "2h auditando cada perfil na mão", "Cliente não entende o problema", "Proposta vira pedido de desconto"].map((x) => <li key={x} className="flex gap-3 text-muted-foreground"><X className="mt-0.5 h-5 w-5 shrink-0 text-danger" />{x}</li>)}</ul>
          </div>
          <div className="panel border-primary/40 p-8 shadow-glow">
            <h3 className="text-lg font-bold">Com LeadMaps Pro Enterprise</h3>
            <ul className="mt-6 space-y-4">{["Abordagem de consultor, com dados reais", "Auditoria completa em 30 segundos", "GeoGrid visual que o cliente entende na hora", "Contrato recorrente fechado"].map((x) => <li key={x} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  const p = [
    { n: "01", i: ScanSearch, t: "Extrator em Massa do Google Maps", d: "Centenas de empresas por nicho e cidade, com telefone e WhatsApp validado." },
    { n: "02", i: FileText, t: "Auditoria Profunda de 22 Itens", d: "Relatório PDF white-label com a marca da sua agência, pronto para enviar." },
    { n: "03", i: MapPin, t: "GeoGrid GPS de Ranking Local", d: "Mapa de calor de posições no raio de 1km a 20km. Prova visual irrefutável." },
  ];
  return (
    <section id="pilares" className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle k="Os 3 pilares" t="Tecnologia que vira argumento de venda." />
      <div className="grid gap-4 md:grid-cols-3">
        {p.map((x) => (
          <div key={x.n} className="panel p-7">
            <div className="flex items-center justify-between"><x.i className="h-7 w-7 text-primary" /><span className="font-mono text-sm text-muted-foreground">{x.n}</span></div>
            <h3 className="mt-6 text-xl font-bold">{x.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const preAnalises = [
  { nome: "Clínica Odonto Sorriso", nicho: "Dentista", regiao: "Tatuapé • São Paulo", score: 48, pos: 12, km: 5.1, perda: 6200, falhas: ["Sem Tour 360°", "Sem botão de agendamento", "88% das avaliações sem resposta"] },
  { nome: "Pet Vida Banho & Tosa", nicho: "Pet shop", regiao: "Moema • São Paulo", score: 61, pos: 4, km: 2.8, perda: 3400, falhas: ["Horário desatualizado", "Sem categoria secundária", "Fotos de 2 anos atrás"] },
  { nome: "Studio Fit", nicho: "Academia", regiao: "Pinheiros • São Paulo", score: 32, pos: 12, km: 6.4, perda: 7800, falhas: ["Perfil sem descrição", "Sem link de WhatsApp", "Concorrente a 900m no Top 3"] },
  { nome: "Bella Estética", nicho: "Estética", regiao: "Santo Amaro • São Paulo", score: 74, pos: 4, km: 3.3, perda: 2600, falhas: ["Sem posts semanais", "Respostas abaixo de 50%", "Serviços não cadastrados"] },
];

const scoreTone = (s: number) => (s < 50 ? "border-danger text-danger" : s < 75 ? "border-warn text-warn" : "border-primary text-primary");

function PreAnalysis() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("done");

  useEffect(() => {
    if (phase !== "run") return;
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  const a = preAnalises[idx]!;
  const msg = `Olá, ${a.nome}! Fiz uma pré-análise gratuita do perfil de vocês no Google Maps (${a.regiao}). Hoje vocês aparecem na posição #${a.pos} do mapa e ${a.falhas[0]!.toLowerCase()}. Isso custa cerca de ${brl(a.perda)} por mês em clientes que caem no concorrente mais próximo. Posso te mostrar o diagnóstico completo em 10 minutos?`;

  return (
    <section id="pre-analises" className="border-y border-border bg-background-2 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle k="Pré-análises individuais" t="Uma empresa, um diagnóstico, um contrato." s="O LeadMaps Pro também faz a pré-análise individual: você escolhe uma empresa da lista e ele gera o diagnóstico dela — nome, posição no mapa, o que está quebrado e quanto isso está custando. Você chega antes do concorrente, com a resposta na mão." />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,330px)_1fr]">
          <div className="panel p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Sua lista de extração</p>
            <div className="mt-4 space-y-2">
              {preAnalises.map((x, i) => (
                <button key={x.nome} onClick={() => { setIdx(i); setPhase("run"); }} className={`w-full rounded-lg border p-3 text-left transition ${idx === i ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/40"}`}>
                  <span className="block text-sm font-semibold">{x.nome}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{x.nicho} • {x.regiao}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setPhase("run")} className={`${btnPrimary} mt-5 w-full`}><Sparkles className="h-4 w-4" />Gerar Pré-Análise</button>
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">1 empresa por vez • dados reais do perfil</p>
          </div>
          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-primary">Pré-análise individual • Nº {String(idx + 1).padStart(3, "0")}</span>
              <span className="font-mono text-[11px] text-muted-foreground">white-label • {a.regiao}</span>
            </div>
            {phase === "run" ? (
              <div className="grid min-h-[420px] place-items-center p-8 text-center">
                <div>
                  <Sparkles className="mx-auto h-8 w-8 animate-pulse text-primary" />
                  <p className="mt-4 font-mono text-sm text-muted-foreground">Lendo o perfil de {a.nome} e cruzando com o GeoGrid…</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className={`grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 ${scoreTone(a.score)}`}>
                    <span className="font-mono text-2xl font-bold">{a.score}<span className="text-sm text-muted-foreground">/100</span></span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold">{a.nome}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{a.nicho} • raio 5km</p>
                    <p className="mt-2 text-sm">Posição no mapa: <span className="font-mono font-bold">#{a.pos}</span> • {a.km.toFixed(1)} km do centro</p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                  {a.falhas.map((f) => (
                    <li key={f} className="flex items-start gap-2 rounded-lg border border-border bg-background p-3 text-sm"><X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />{f}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gold/40 p-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Perda mensal estimada</p>
                    <p className="mt-1 font-mono text-3xl font-bold text-gold">{brl(a.perda)}</p>
                  </div>
                  <p className="max-w-sm text-sm text-muted-foreground">O cliente não vê a sua promessa: ele vê o número dele. É esse número que abre a conversa.</p>
                </div>
                <div className="mt-6 rounded-lg border border-border bg-foreground p-5 text-background">
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Mensagem pronta para o WhatsApp</p>
                  <p className="mt-3 text-sm leading-relaxed">{msg}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={wa(msg)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-whats px-5 py-3 text-sm font-semibold text-whats-foreground transition hover:brightness-110"><MessageCircle className="h-4 w-4" />Enviar Pré-Análise</a>
                  <a href="#planos" className={btnGhost}>Quero gerar as minhas</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Flow() {
  const s = [[Search, "Busque o Nicho"], [ScanSearch, "Gere a Pré-Análise Individual"], [Send, "Envie no WhatsApp"], [Handshake, "Feche a Recorrência"]] as const;
  return (
    <section id="fluxo" className="border-y border-border bg-background-2 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle k="Como funciona" t="Do mapa ao contrato em 4 passos." />
        <div className="grid gap-4 md:grid-cols-4">
          {s.map(([I, t], i) => (
            <div key={t} className="panel relative p-6">
              <span className="font-mono text-3xl font-bold text-primary">0{i + 1}</span>
              <I className="mt-4 h-5 w-5 text-muted-foreground" />
              <h3 className="mt-3 font-bold">{t}</h3>
              {i < 3 && <ArrowRight className="absolute top-1/2 -right-3 hidden h-5 w-5 text-primary md:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roi() {
  const [ticket, setTicket] = useState(2000);
  const [clients, setClients] = useState(2);
  const r = calcRoi(ticket, clients);
  return (
    <section id="roi" className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle k="Calculadora de ROI" t="Quanto a ferramenta pode render para você?" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel space-y-10 p-8">
          <div>
            <div className="mb-4 flex justify-between text-sm"><span>Ticket médio mensal</span><span className="font-mono text-primary">{brl(ticket)}</span></div>
            <Slider min={1000} max={6000} step={100} value={[ticket]} onValueChange={(v) => setTicket(v[0] ?? 2000)} />
          </div>
          <div>
            <div className="mb-4 flex justify-between text-sm"><span>Clientes fechados no mês</span><span className="font-mono text-primary">{clients}</span></div>
            <Slider min={1} max={10} step={1} value={[clients]} onValueChange={(v) => setClients(v[0] ?? 2)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="panel p-6"><p className="text-sm text-muted-foreground">Faturamento mensal recorrente</p><p className="mt-2 font-mono text-3xl font-bold">{brl(r.monthly)}</p></div>
          <div className="panel p-6"><p className="text-sm text-muted-foreground">Faturamento anual projetado</p><p className="mt-2 font-mono text-3xl font-bold">{brl(r.annual)}</p></div>
          <div className="panel border-gold/40 p-6 shadow-gold sm:col-span-2">
            <p className="text-sm text-muted-foreground">Retorno sobre o Plano Anual VIP</p>
            <p className="mt-2 font-mono text-5xl font-bold text-gold">{r.multiple}x</p>
            <p className="mt-3 text-sm text-muted-foreground">Um único cliente fechado paga a ferramenta {Math.max(1, Math.floor(ticket / 497))} vezes no primeiro mês. O resto é lucro.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Plans() {
  const trust = [[CreditCard, "Pagamento Seguro • PIX e Cartão até 12x"], [Zap, "Liberação Imediata"]] as const;
  return (
    <section id="planos" className="border-y border-border bg-background-2 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle k="Planos" t="Escolha como começar." />
        <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:max-w-3xl mx-auto">
          <div className="panel flex flex-col p-8">
            <h3 className="text-lg font-bold">Mensal Pro</h3>
            <p className="mt-1 text-sm text-muted-foreground">Para começar rápido.</p>
            <p className="mt-6 font-mono text-4xl font-bold">R$ 97<span className="text-base text-muted-foreground">/mês</span></p>
            <a href={wa("Olá! Quero contratar o Plano Mensal Pro (R$ 97/mês) do LeadMaps Pro.")} target="_blank" rel="noreferrer" className={`${btnGhost} mt-auto`}>Assinar Mensal</a>
          </div>
          <div className="panel relative flex flex-col border-primary p-8 shadow-glow lg:-my-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-bold text-primary-foreground">MAIS ESCOLHIDO • ECONOMIA DE 57%</span>
            <h3 className="text-lg font-bold">Anual VIP</h3>
            <p className="mt-1 text-sm text-muted-foreground">O melhor custo por resultado.</p>
            <p className="mt-6 font-mono text-sm text-muted-foreground line-through">De R$ 1.164</p>
            <p className="font-mono text-4xl font-bold">R$ 497<span className="text-base text-muted-foreground">/ano</span></p>
            <p className="mt-1 font-mono text-sm text-primary">Apenas R$ 41,41/mês</p>
            <ul className="my-6 space-y-2 text-sm">{["Pré-análises individuais", "Extrator ilimitado", "Auditoria 22 itens", "GeoGrid 1–20km", "PDF white-label"].map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-primary" />{x}</li>)}</ul>
            <a href={wa("Olá! Quero contratar o Plano Anual VIP (R$ 497/ano) do LeadMaps Pro.")} target="_blank" rel="noreferrer" className={`${btnPrimary} mt-auto`}>Quero o Anual VIP</a>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {trust.map(([I, t]) => <span key={t} className="flex items-center gap-2 text-sm text-muted-foreground"><I className="h-4 w-4 text-primary" />{t}</span>)}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const q = [
    ["O que é a pré-análise individual?", "É o diagnóstico de uma única empresa, feito com o nome dela: posição no mapa, itens quebrados e a estimativa do que está perdendo por mês. Você envia antes da conversa e chega na reunião com a resposta na mão."],
    ["A pré-análise é igual para todas as empresas?", "Não. Cada pré-análise é gerada a partir do perfil real daquela empresa no Google Maps, então os itens, a posição e o valor mudam de uma para outra."],
    ["Preciso saber programar?", "Não. Tudo funciona no navegador: você busca o nicho, escolhe a empresa, gera a pré-análise e envia no WhatsApp."],
    ["O relatório sai com a minha marca?", "Sim. O PDF é 100% white-label, com logotipo e cores da sua agência."],
    ["O GeoGrid funciona em quais cidades?", "Em qualquer cidade do Brasil coberta pelo Google Maps, com raio configurável de 1km a 20km."],
    ["Como ativo minha chave?", "Após o pagamento você recebe a chave pelo WhatsApp e ativa em Login & Ativação. A liberação é imediata."],
    ["Posso cancelar?", "Sim. O plano mensal pode ser cancelado a qualquer momento."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-3 mb-6 text-3xl font-extrabold">Perguntas frequentes</h2>
        <Accordion type="single" collapsible>
          {q.map(([a, b], i) => (
            <AccordionItem key={a} value={`q${i}`}><AccordionTrigger className="text-left">{a}</AccordionTrigger><AccordionContent className="text-muted-foreground">{b}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero /><Hub /><Pain /><Pillars /><PreAnalysis /><Flow /><Roi /><Plans /><Faq />
        <section className="mx-auto max-w-7xl px-5 pb-24">
          <div className="panel grid-bg border-primary/40 p-10 text-center shadow-glow md:p-16">
            <h2 className="text-3xl font-extrabold md:text-5xl">Seu próximo contrato está no mapa.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Comece hoje e envie sua primeira pré-análise individual ainda esta semana.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#planos" className={btnPrimary}>Começar Agora <ArrowRight className="h-4 w-4" /></a>
              <a href={wa("Olá Ricardo, tenho dúvidas sobre o LeadMaps Pro.")} target="_blank" rel="noreferrer" className={btnGhost}><Download className="h-4 w-4" />Falar com Ricardo</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground md:flex-row">
          <span className="font-display font-extrabold text-foreground">LeadMaps <span className="text-primary">PRO</span></span>
          <span>© {new Date().getFullYear()} LeadMaps Pro Enterprise. Todos os direitos reservados.</span>
          <span>Desenvolvido com excelência por Severino & Ricardo</span>
        </div>
      </footer>
    </div>
  );
}
