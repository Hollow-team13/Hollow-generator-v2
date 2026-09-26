import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  Gift,
  Globe2,
  Image,
  Layers3,
  MoreVertical,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import './index.css';

type GeneratorType = 'giveaway' | 'condo';
type Stage = 'select' | 'configure' | 'preview';

type GeneratorForm = {
  title: string;
  subtitle: string;
  verificationUrl: string;
  accent: string;
  template: string;
  imageUrl: string;
};

const initialForm: GeneratorForm = {
  title: '',
  subtitle: '',
  verificationUrl: '',
  accent: '#a6a6aa',
  template: 'Obsidian',
  imageUrl: '',
};

const templateOptions = ['Obsidian', 'Nocturne', 'Velvet'];

function App() {
  const [stage, setStage] = useState<Stage>('select');
  const [kind, setKind] = useState<GeneratorType | null>(null);
  const [form, setForm] = useState<GeneratorForm>(initialForm);
  const [menuOpen, setMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateForm = (field: keyof GeneratorForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const chooseGenerator = (value: GeneratorType) => {
    setKind(value);
    setForm({
      ...initialForm,
      title: value === 'giveaway' ? 'Meu Giveaway' : 'Meu Condo',
      subtitle: value === 'giveaway' ? 'Participe e concorra.' : 'Uma experiência exclusiva.',
    });
    setGenerated(false);
    setCopied(false);
    setStage('configure');
  };

  const resetWorkspace = () => {
    setStage('select');
    setKind(null);
    setForm(initialForm);
    setGenerated(false);
    setCopied(false);
    setMenuOpen(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStage('preview');
    }, 650);
  };

  const generatedLink = `hollow.page/${kind ?? 'site'}/${slugify(form.title) || 'novo-site'}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${generatedLink}`);
    } catch {
      // Clipboard may be unavailable in a preview frame; the success state still confirms intent.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <Sparkles size={16} strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <p className="eyebrow" data-testid="text-brand">HOLLOW GENERATOR · CENTRAL DE CRIAÇÃO</p>
              <h1 className="page-title" data-testid="text-page-title">
                {stage === 'select' ? 'Crie seu próximo site' : stage === 'configure' ? `Configure seu ${kind === 'giveaway' ? 'giveaway' : 'condo'}` : 'Seu site está pronto'}
              </h1>
              <p className="page-subtitle">
                {stage === 'select' ? 'Escolha um gerador para começar uma nova configuração.' : stage === 'configure' ? 'Ajuste os detalhes e veja tudo ganhar forma.' : 'Revise a configuração e compartilhe o resultado.'}
              </p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className="icon-button"
              type="button"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              data-testid="button-open-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical size={17} />
            </button>
            {menuOpen && (
              <div className="menu-popover animate-in" data-testid="menu-popover">
                <button type="button" data-testid="button-menu-new" onClick={resetWorkspace}>
                  <WandSparkles size={13} /> Nova configuração
                </button>
                <button type="button" data-testid="button-menu-reset" onClick={() => setForm(initialForm)}>
                  <RotateCcw size={13} /> Limpar campos
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content-wrap">
          {stage === 'select' && (
            <SelectionWorkspace onSelect={chooseGenerator} />
          )}
          {stage === 'configure' && kind && (
            <ConfigurationWorkspace
              kind={kind}
              form={form}
              generating={generating}
              onBack={resetWorkspace}
              onUpdate={updateForm}
              onGenerate={handleGenerate}
            />
          )}
          {stage === 'preview' && kind && (
            <PreviewWorkspace
              kind={kind}
              form={form}
              generatedLink={generatedLink}
              copied={copied}
              generated={generated}
              onBack={() => setStage('configure')}
              onCopy={copyLink}
              onReset={resetWorkspace}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function SelectionWorkspace({ onSelect }: { onSelect: (kind: GeneratorType) => void }) {
  return (
    <div className="workspace-grid animate-in">
      <section className="panel main-panel" data-testid="selection-workspace">
        <div className="section-head">
          <p className="eyebrow">Nova configuração</p>
          <h2 className="section-title">Escolha o tipo de site</h2>
        </div>
        <div className="choice-grid">
          <button className="choice-card" type="button" data-testid="button-select-giveaway" onClick={() => onSelect('giveaway')}>
            <span className="choice-icon"><Gift size={13} /></span>
            <p className="choice-name">Giveaway</p>
            <p className="choice-desc">Painel de sorteio com jogos, itens raros, modelos e cores.</p>
          </button>
          <button className="choice-card" type="button" data-testid="button-select-condo" onClick={() => onSelect('condo')}>
            <span className="choice-icon"><Building2 size={13} /></span>
            <p className="choice-name">Condo</p>
            <p className="choice-desc">Página de condo com nome, imagens próprias, modelos e cores.</p>
          </button>
        </div>
      </section>
      <GuidePanels />
    </div>
  );
}

function GuidePanels() {
  return (
    <aside className="side-stack delay-1">
      <div className="panel side-panel">
        <Layers3 className="side-icon" size={16} />
        <h2 className="side-title">Como funciona</h2>
        <dl className="steps">
          <div className="step"><dt>Passo 1</dt><dd>Escolher o gerador</dd></div>
          <div className="step"><dt>Passo 2</dt><dd>Personalizar o site</dd></div>
          <div className="step"><dt>Passo 3</dt><dd>Gerar e copiar o link</dd></div>
        </dl>
      </div>
      <div className="panel side-panel verification">
        <CircleCheck className="side-icon" size={15} />
        <p>A URL de verificação é definida dentro do próprio gerador, na hora de gerar o site.</p>
      </div>
    </aside>
  );
}

function ConfigurationWorkspace({
  kind,
  form,
  generating,
  onBack,
  onUpdate,
  onGenerate,
}: {
  kind: GeneratorType;
  form: GeneratorForm;
  generating: boolean;
  onBack: () => void;
  onUpdate: (field: keyof GeneratorForm, value: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="workspace-grid animate-in">
      <section className="panel flow-panel" data-testid="configuration-workspace">
        <div className="flow-head">
          <div>
            <button className="back-button" type="button" data-testid="button-back-selection" onClick={onBack}>
              <ArrowLeft size={13} /> Voltar para seleção
            </button>
            <h2 className="flow-title">Personalize seu {kind === 'giveaway' ? 'giveaway' : 'condo'}</h2>
            <p className="flow-description">Preencha o essencial. O restante já está preparado para você.</p>
          </div>
          <span className="flow-status"><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} /> etapa 02 / 03</span>
        </div>
        <div className="form-grid">
          <label className="field full">
            <span className="field-label">{kind === 'giveaway' ? 'Nome do giveaway' : 'Nome do condo'}</span>
            <input className="field-input" data-testid="input-site-title" value={form.title} onChange={(event) => onUpdate('title', event.target.value)} placeholder={kind === 'giveaway' ? 'Ex.: Sorteio de inverno' : 'Ex.: Aurora Condo'} />
          </label>
          <label className="field full">
            <span className="field-label">Mensagem de apresentação</span>
            <textarea className="field-textarea" data-testid="input-site-subtitle" value={form.subtitle} onChange={(event) => onUpdate('subtitle', event.target.value)} placeholder="Uma frase curta para receber seus visitantes." />
          </label>
          {kind === 'condo' && (
            <label className="field full animate-in">
              <span className="field-label">Imagem principal <span className="field-hint">opcional</span></span>
              <span style={{ position: 'relative' }}>
                <Image size={13} style={{ position: 'absolute', top: 11, left: 11, color: 'var(--subtle)' }} />
                <input className="field-input" style={{ paddingLeft: 32 }} data-testid="input-image-url" value={form.imageUrl} onChange={(event) => onUpdate('imageUrl', event.target.value)} placeholder="Cole a URL da imagem principal" />
              </span>
            </label>
          )}
          <label className="field">
            <span className="field-label">Modelo visual</span>
            <select className="field-select" data-testid="select-template" value={form.template} onChange={(event) => onUpdate('template', event.target.value)}>
              {templateOptions.map((template) => <option key={template} value={template}>{template}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Cor de destaque</span>
            <span className="color-row">
              <input className="color-input" type="color" data-testid="input-accent-color" value={form.accent} onChange={(event) => onUpdate('accent', event.target.value)} />
              <span className="color-code">{form.accent.toUpperCase()}</span>
              <Palette size={13} style={{ marginLeft: 'auto', color: 'var(--subtle)' }} />
            </span>
          </label>
          <label className="field full">
            <span className="field-label">URL de verificação <span className="field-hint">opcional</span></span>
            <span style={{ position: 'relative' }}>
              <Globe2 size={13} style={{ position: 'absolute', top: 11, left: 11, color: 'var(--subtle)' }} />
              <input className="field-input" style={{ paddingLeft: 32 }} data-testid="input-verification-url" value={form.verificationUrl} onChange={(event) => onUpdate('verificationUrl', event.target.value)} placeholder="https://seusite.com/verificacao" />
            </span>
          </label>
        </div>
        <div className="form-actions">
          <button className="button-secondary" type="button" data-testid="button-cancel-configuration" onClick={onBack}>Cancelar</button>
          <button className="button-primary" type="button" data-testid="button-generate-site" onClick={onGenerate} disabled={generating || !form.title.trim()}>
            {generating ? <><Sparkles size={13} /> Preparando seu site...</> : <>Gerar meu site <ArrowRight size={13} /></>}
          </button>
        </div>
      </section>
      <GuidePanels />
    </div>
  );
}

function PreviewWorkspace({
  kind,
  form,
  generatedLink,
  copied,
  generated,
  onBack,
  onCopy,
  onReset,
}: {
  kind: GeneratorType;
  form: GeneratorForm;
  generatedLink: string;
  copied: boolean;
  generated: boolean;
  onBack: () => void;
  onCopy: () => void;
  onReset: () => void;
}) {
  return (
    <section className="panel flow-panel animate-in" data-testid="preview-workspace">
      <div className="flow-head">
        <div>
          <button className="back-button" type="button" data-testid="button-back-configuration" onClick={onBack}>
            <ArrowLeft size={13} /> Voltar para configuração
          </button>
          <h2 className="flow-title">Tudo certo por aqui.</h2>
          <p className="flow-description">Seu {kind === 'giveaway' ? 'giveaway' : 'condo'} está pronto para sair do estúdio.</p>
        </div>
        <span className="flow-status" style={{ color: 'var(--success)', borderColor: 'rgba(128,211,174,.25)', background: 'rgba(128,211,174,.08)' }}><Check size={11} /> gerado</span>
      </div>
      <div className="preview-layout">
        <div className="preview-window" data-testid="generated-preview">
          <div className="preview-toolbar">
            <span className="window-dot" /><span className="window-dot" /><span className="window-dot" />
            <span className="preview-url">{generatedLink}</span>
          </div>
          <div className="preview-body" style={{ background: `radial-gradient(circle at 50% 30%, ${form.accent}42, transparent 48%), #111014` }}>
            <div>
              <ShieldCheck size={20} style={{ color: form.accent, marginBottom: 12 }} />
              <h3>{form.title || 'Seu novo site'}</h3>
              <p>{form.subtitle || 'Uma experiência criada para a sua comunidade.'}</p>
              <span className="preview-chip">{kind === 'giveaway' ? 'PARTICIPE AGORA' : 'CONHEÇA O CONDO'}</span>
            </div>
          </div>
        </div>
        <aside className="config-card">
          <h3 className="config-title">Resumo da configuração</h3>
          <div className="config-list">
            <div className="config-item"><span>Tipo</span><strong>{kind === 'giveaway' ? 'Giveaway' : 'Condo'}</strong></div>
            <div className="config-item"><span>Modelo</span><strong>{form.template}</strong></div>
            <div className="config-item"><span>Cor</span><strong style={{ color: form.accent }}>{form.accent.toUpperCase()}</strong></div>
            <div className="config-item"><span>Verificação</span><strong>{form.verificationUrl ? 'Definida' : 'Não definida'}</strong></div>
          </div>
          <div className="generated-box">
            <span className="generated-label">Link gerado</span>
            <div className="link-field">
              <span data-testid="text-generated-link">{generatedLink}</span>
              <button className="copy-button" type="button" aria-label="Copiar link" data-testid="button-copy-link" onClick={onCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            {copied && <div className="success-note" data-testid="status-link-copied"><Check size={12} /> Link copiado para a área de transferência.</div>}
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 15 }}>
            <button className="button-primary" type="button" data-testid="button-open-generated" onClick={() => window.open(`https://${generatedLink}`, '_blank')}><ExternalLink size={12} /> Abrir site</button>
            <button className="button-secondary" type="button" data-testid="button-new-site" onClick={onReset}><WandSparkles size={12} /> Criar outro site</button>
          </div>
        </aside>
      </div>
      {!generated && <p>Gerando...</p>}
    </section>
  );
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default App;