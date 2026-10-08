import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import Building2 from 'lucide-react/dist/esm/icons/building-2.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import CircleCheck from 'lucide-react/dist/esm/icons/circle-check.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.js';
import Gift from 'lucide-react/dist/esm/icons/gift.js';
import Globe2 from 'lucide-react/dist/esm/icons/globe-2.js';
import Image from 'lucide-react/dist/esm/icons/image.js';
import ImagePlus from 'lucide-react/dist/esm/icons/image-plus.js';
import Layers3 from 'lucide-react/dist/esm/icons/layers-3.js';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical.js';
import Palette from 'lucide-react/dist/esm/icons/palette.js';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import WandSparkles from 'lucide-react/dist/esm/icons/wand-sparkles.js';
import './index.css';

type GeneratorType = 'giveaway' | 'condo';
type Stage = 'select' | 'configure' | 'preview';

type GeneratorForm = {
  title: string;
  subtitle: string;
  game: string;
  customGame: string;
  prize: string;
  winnerCount: string;
  endDate: string;
  verificationEnabled: boolean;
  verificationUrl: string;
  accent: string;
  template: string;
  imageUrl: string;
  selectedImages: string[];
};

type PublishedSite = GeneratorForm & { kind: GeneratorType };

const DEFAULT_CONDO_IMAGES = [
  {
    src: 'https://i.supaimg.com/755ee084-1fb0-4f60-9563-6c7e28e59a26/7e3b7bd6-93ba-49b7-b8d0-85e23d8f7dd4.jpg',
    label: 'Cena principal',
  },
  {
    src: 'https://i.supaimg.com/755ee084-1fb0-4f60-9563-6c7e28e59a26/b42f561d-3b98-4085-a16e-a7224d0f5f94.png',
    label: 'Cena noturna',
  },
  {
    src: 'https://i.supaimg.com/755ee084-1fb0-4f60-9563-6c7e28e59a26/e0769ae8-08d8-42ce-b34c-1a564f347cba.png',
    label: 'Cena no deserto',
  },
  {
    src: 'https://i.supaimg.com/755ee084-1fb0-4f60-9563-6c7e28e59a26/86eab221-0730-4390-b9ee-cdd89362a6f0.jpg',
    label: 'Avatar',
  },
] as const;

const initialForm: GeneratorForm = {
  title: '',
  subtitle: '',
  game: 'Murder Mystery 2',
  customGame: '',
  prize: 'Item raro',
  winnerCount: '1',
  endDate: '',
  verificationEnabled: false,
  verificationUrl: '',
  accent: '#a6a6aa',
  template: 'Obsidian',
  imageUrl: '',
  selectedImages: [],
};

const templateOptions = ['Obsidian', 'Nocturne', 'Velvet'];
const giveawayGames = [
  'Murder Mystery 2',
  'Adopt Me!',
  'Blox Fruits',
  'Grow a Garden',
  'Pet Simulator 99',
  'Blade Ball',
  'Outro jogo',
];
const gameLinks: Record<string, string> = {
  'Murder Mystery 2': 'https://www.roblox.com/games/142823291/Murder-Mystery-2',
  'Adopt Me!': 'https://www.roblox.com/games/920587237/Adopt-Me',
  'Blox Fruits': 'https://www.roblox.com/games/2753915549/Blox-Fruits',
  'Grow a Garden': 'https://www.roblox.com/games/126884695634066/Grow-a-Garden',
  'Pet Simulator 99': 'https://www.roblox.com/games/8737899170/Pet-Simulator-99',
  'Blade Ball': 'https://www.roblox.com/games/13772394625/Blade-Ball',
};

function isPublicImageSource(value: unknown): value is string {
  return typeof value === 'string' && /^(https?:)?\/\//i.test(value.trim());
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function normalizePublishedSite(value: unknown): PublishedSite | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Partial<PublishedSite>;
  if (typeof raw.title !== 'string' || !raw.title.trim() || !Array.isArray(raw.selectedImages)) return null;
  const verificationUrl = isHttpsUrl(raw.verificationUrl) ? raw.verificationUrl.trim() : '';

  return {
    kind: raw.kind === 'giveaway' ? 'giveaway' : 'condo',
    title: raw.title,
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : '',
    game: typeof raw.game === 'string' ? raw.game.slice(0, 80) : initialForm.game,
    customGame: typeof raw.customGame === 'string' ? raw.customGame.slice(0, 80) : '',
    prize: typeof raw.prize === 'string' ? raw.prize.slice(0, 120) : initialForm.prize,
    winnerCount: typeof raw.winnerCount === 'string' && /^\d+$/.test(raw.winnerCount)
      ? String(Math.min(99, Math.max(1, Number(raw.winnerCount))))
      : initialForm.winnerCount,
    endDate: typeof raw.endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.endDate) ? raw.endDate : '',
    verificationEnabled: typeof raw.verificationEnabled === 'boolean'
      ? raw.verificationEnabled
      : Boolean(verificationUrl),
    verificationUrl,
    accent: typeof raw.accent === 'string' && /^#[0-9a-f]{6}$/i.test(raw.accent) ? raw.accent : initialForm.accent,
    template: typeof raw.template === 'string' ? raw.template : initialForm.template,
    imageUrl: isPublicImageSource(raw.imageUrl) ? raw.imageUrl.trim() : '',
    selectedImages: raw.selectedImages.filter(isPublicImageSource).map((image) => image.trim()),
  };
}

function encodeSite(site: PublishedSite) {
  const bytes = new TextEncoder().encode(JSON.stringify(site));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeSite(value: string): PublishedSite | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return normalizePublishedSite(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

function readPublishedSite() {
  if (typeof window === 'undefined') return null;
  const encoded = new URLSearchParams(window.location.search).get('site');
  return encoded ? decodeSite(encoded) : null;
}

function makePublishedLink(kind: GeneratorType, form: GeneratorForm) {
  const url = new URL(window.location.href);
  const shareableForm: GeneratorForm = {
    ...form,
    imageUrl: isPublicImageSource(form.imageUrl) ? form.imageUrl.trim() : '',
    selectedImages: form.selectedImages.filter(isPublicImageSource).map((image) => image.trim()),
  };
  url.search = '';
  url.hash = '';
  url.searchParams.set('site', encodeSite({ kind, ...shareableForm }));
  return url.toString();
}

function App() {
  const [publishedSite] = useState<PublishedSite | null>(() => readPublishedSite());
  const [stage, setStage] = useState<Stage>('select');
  const [kind, setKind] = useState<GeneratorType | null>(null);
  const [form, setForm] = useState<GeneratorForm>(initialForm);
  const [menuOpen, setMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (publishedSite) {
    return publishedSite.kind === 'giveaway'
      ? <PublishedGiveawaySite site={publishedSite} />
      : <PublishedCondoSite site={publishedSite} />;
  }

  const updateForm = (field: keyof GeneratorForm, value: string | string[] | boolean) => {
    setForm((current) => ({ ...current, [field]: value }) as GeneratorForm);
  };

  const chooseGenerator = (value: GeneratorType) => {
    setKind(value);
    setForm({
      ...initialForm,
      title: value === 'giveaway' ? 'Meu Giveaway' : 'Condo Oficial',
      subtitle: value === 'giveaway' ? 'Participe e concorra.' : 'Uma experiência exclusiva.',
      game: 'Murder Mystery 2',
      prize: 'Item raro',
      selectedImages: value === 'condo' ? [DEFAULT_CONDO_IMAGES[0].src] : [],
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
    const verificationReady = kind === 'giveaway'
      ? !form.verificationEnabled || isHttpsUrl(form.verificationUrl)
      : !form.verificationUrl || isHttpsUrl(form.verificationUrl);
    if (!verificationReady) return;
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStage('preview');
    }, 650);
  };

  const generatedLink = kind ? makePublishedLink(kind, form) : makePublishedLink('condo', form);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
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
          {stage === 'select' && <SelectionWorkspace onSelect={chooseGenerator} />}
          {stage === 'configure' && kind && (
            <ConfigurationWorkspace
              kind={kind}
              form={form}
              generating={generating}
              verificationReady={kind === 'giveaway'
                ? !form.verificationEnabled || isHttpsUrl(form.verificationUrl)
                : !form.verificationUrl || isHttpsUrl(form.verificationUrl)}
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
            <p className="choice-desc">Página de condo com imagens padrão, imagens próprias, modelos e cores.</p>
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
        <p>Ative a verificação e informe uma URL HTTPS. O link do site é estático; não registra inscrições nem guarda dados privados.</p>
      </div>
    </aside>
  );
}

function ConfigurationWorkspace({
  kind,
  form,
  generating,
  verificationReady,
  onBack,
  onUpdate,
  onGenerate,
}: {
  kind: GeneratorType;
  form: GeneratorForm;
  generating: boolean;
  verificationReady: boolean;
  onBack: () => void;
  onUpdate: (field: keyof GeneratorForm, value: string | string[] | boolean) => void;
  onGenerate: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const customImages = form.selectedImages.filter((src) => !DEFAULT_CONDO_IMAGES.some((image) => image.src === src));
  const imageOptions = [...DEFAULT_CONDO_IMAGES, ...customImages.map((src, index) => ({ src, label: `Imagem ${index + 1}` }))];

  const toggleImage = (src: string) => {
    const selected = form.selectedImages.includes(src);
    onUpdate('selectedImages', selected
      ? form.selectedImages.filter((image) => image !== src)
      : [...form.selectedImages, src]);
  };

  const handleImageFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const urls = await Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
    if (urls.length) onUpdate('selectedImages', [...form.selectedImages, ...urls]);
    event.target.value = '';
  };

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
          {kind === 'giveaway' && (
            <>
              <label className="field">
                <span className="field-label">Jogo</span>
                <select className="field-select" data-testid="select-giveaway-game" value={form.game} onChange={(event) => onUpdate('game', event.target.value)}>
                  {giveawayGames.map((game) => <option key={game} value={game}>{game}</option>)}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Número de ganhadores</span>
                <input
                  className="field-input"
                  data-testid="input-winner-count"
                  type="number"
                  min="1"
                  max="99"
                  value={form.winnerCount}
                  onChange={(event) => onUpdate('winnerCount', event.target.value)}
                />
              </label>
              {form.game === 'Outro jogo' && (
                <label className="field full">
                  <span className="field-label">Nome do jogo</span>
                  <input className="field-input" data-testid="input-custom-game" value={form.customGame} onChange={(event) => onUpdate('customGame', event.target.value)} placeholder="Digite o nome do jogo" maxLength={80} />
                </label>
              )}
              <label className="field full">
                <span className="field-label">Prêmio ou item raro</span>
                <input className="field-input" data-testid="input-giveaway-prize" value={form.prize} onChange={(event) => onUpdate('prize', event.target.value)} placeholder="Ex.: faca godly, pet lendário ou moeda do jogo" maxLength={120} />
              </label>
              <label className="field full">
                <span className="field-label">Data de encerramento <span className="field-hint">opcional</span></span>
                <input className="field-input" data-testid="input-giveaway-end-date" type="date" value={form.endDate} onChange={(event) => onUpdate('endDate', event.target.value)} />
              </label>
            </>
          )}
          {kind === 'condo' && (
            <>
              <label className="field full animate-in">
                <span className="field-label">Imagem principal <span className="field-hint">opcional</span></span>
                <span style={{ position: 'relative' }}>
                  <Image size={13} style={{ position: 'absolute', top: 11, left: 11, color: 'var(--subtle)' }} />
                  <input className="field-input" style={{ paddingLeft: 32 }} data-testid="input-image-url" value={form.imageUrl} onChange={(event) => onUpdate('imageUrl', event.target.value)} placeholder="Cole uma URL para substituir a principal" />
                </span>
              </label>
              <section className="image-picker full" aria-labelledby="image-picker-title">
                <div className="image-picker-head">
                  <div>
                    <span className="field-label" id="image-picker-title">Imagens do condo</span>
                    <p className="field-hint image-picker-note">As imagens originais voltaram. Selecione uma ou mais para sua página.</p>
                  </div>
                  <span className="image-count">{form.selectedImages.length} selecionada{form.selectedImages.length === 1 ? '' : 's'}</span>
                </div>
                <div className="image-grid">
                  {imageOptions.map((image) => {
                    const selected = form.selectedImages.includes(image.src);
                    return (
                      <button
                        className={`image-option${selected ? ' selected' : ''}`}
                        type="button"
                        key={image.src}
                        aria-label={`${selected ? 'Remover' : 'Selecionar'} ${image.label}`}
                        aria-pressed={selected}
                        onClick={() => toggleImage(image.src)}
                      >
                        <img src={image.src} alt={image.label} loading="lazy" />
                        {selected && <span className="image-check"><Check size={12} /></span>}
                      </button>
                    );
                  })}
                </div>
                <input ref={imageInputRef} className="visually-hidden" type="file" accept="image/*" multiple onChange={handleImageFiles} />
                <button className="add-images-button" type="button" onClick={() => imageInputRef.current?.click()}>
                  <ImagePlus size={14} /> Adicionar minhas imagens
                </button>
              </section>
            </>
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
          <div className="field full">
            {kind === 'giveaway' ? (
              <>
                <span className="field-label">Verificação dos participantes</span>
                <label className="verification-toggle">
                  <input
                    type="checkbox"
                    data-testid="toggle-verification"
                    checked={form.verificationEnabled}
                    onChange={(event) => onUpdate('verificationEnabled', event.target.checked)}
                  />
                  <span>
                    <strong>Exigir verificação antes de continuar</strong>
                    <small>Ao ativar, informe um destino HTTPS. Não peça senhas nem cookies do Roblox.</small>
                  </span>
                </label>
                {form.verificationEnabled && (
                  <span className="verification-url-field">
                    <span style={{ position: 'relative' }}>
                      <Globe2 size={13} style={{ position: 'absolute', top: 11, left: 11, color: 'var(--subtle)' }} />
                      <input
                        className="field-input"
                        style={{ paddingLeft: 32 }}
                        data-testid="input-verification-url"
                        type="url"
                        inputMode="url"
                        value={form.verificationUrl}
                        onChange={(event) => onUpdate('verificationUrl', event.target.value)}
                        placeholder="https://seusite.com/verificacao"
                        aria-invalid={!verificationReady}
                      />
                    </span>
                    {!verificationReady && <small className="field-error">Informe uma URL válida começando com https:// para gerar o link.</small>}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="field-label">URL de verificação <span className="field-hint">opcional</span></span>
                <span style={{ position: 'relative' }}>
                  <Globe2 size={13} style={{ position: 'absolute', top: 11, left: 11, color: 'var(--subtle)' }} />
                  <input className="field-input" style={{ paddingLeft: 32 }} data-testid="input-verification-url" type="url" inputMode="url" aria-invalid={!verificationReady} value={form.verificationUrl} onChange={(event) => onUpdate('verificationUrl', event.target.value)} placeholder="https://seusite.com/verificacao" />
                </span>
                {!verificationReady && <small className="field-error">Use uma URL HTTPS válida.</small>}
              </>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="button-secondary" type="button" data-testid="button-cancel-configuration" onClick={onBack}>Cancelar</button>
          <button className="button-primary" type="button" data-testid="button-generate-site" onClick={onGenerate} disabled={generating || !form.title.trim() || !verificationReady}>
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
  const activeImage = form.imageUrl.trim() || form.selectedImages[0];
  const previewBackground = activeImage
    ? `linear-gradient(180deg, rgba(8,8,10,.12), rgba(8,8,10,.88)), url("${activeImage}") center / cover`
    : `radial-gradient(circle at 50% 30%, ${form.accent}42, transparent 48%), #111014`;

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
          <div className="preview-body" style={{ background: previewBackground }}>
            <div className="preview-copy">
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
            <div className="config-item"><span>Imagens</span><strong>{kind === 'condo' ? form.selectedImages.length : '—'}</strong></div>
            <div className="config-item"><span>Cor</span><strong style={{ color: form.accent }}>{form.accent.toUpperCase()}</strong></div>
            <div className="config-item"><span>Verificação</span><strong>{kind === 'giveaway' ? (form.verificationEnabled && isHttpsUrl(form.verificationUrl) ? 'Ativada' : 'Desativada') : (form.verificationUrl ? 'Definida' : 'Não definida')}</strong></div>
            {kind === 'giveaway' && (
              <>
                <div className="config-item"><span>Jogo</span><strong>{form.game === 'Outro jogo' ? form.customGame || 'Outro jogo' : form.game}</strong></div>
                <div className="config-item"><span>Prêmio</span><strong>{form.prize || 'Item raro'}</strong></div>
              </>
            )}
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
            <button className="button-primary" type="button" data-testid="button-open-generated" onClick={() => window.open(generatedLink, '_blank')}><ExternalLink size={12} /> Abrir site</button>
            <button className="button-secondary" type="button" data-testid="button-new-site" onClick={onReset}><WandSparkles size={12} /> Criar outro site</button>
          </div>
        </aside>
      </div>
      {!generated && <p>Gerando...</p>}
    </section>
  );
}

function PublishedGiveawaySite({ site }: { site: PublishedSite }) {
  const [verificationOpen, setVerificationOpen] = useState(false);
  const gameName = site.game === 'Outro jogo' ? site.customGame || 'Outro jogo' : site.game;
  const gameUrl = gameLinks[site.game];
  const verificationUrl = site.verificationEnabled && isHttpsUrl(site.verificationUrl) ? site.verificationUrl : '';
  const endDate = site.endDate ? new Date(`${site.endDate}T12:00:00Z`) : null;
  const formattedEndDate = endDate && Number.isFinite(endDate.getTime())
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(endDate)
    : 'Data definida pelo organizador';

  return (
    <main className={`public-site giveaway-site theme-${slugify(site.template)}`} style={{ '--public-accent': site.accent } as CSSProperties}>
      <header className="public-header">
        <a className="public-brand public-brand-link" href={window.location.pathname} aria-label="Hollow Generator">
          <span className="public-brand-icon"><Gift size={17} /></span>
          <strong>HOLLOW GIVEAWAY</strong>
        </a>
        <span className="giveaway-live"><span /> SORTEIO ATIVO</span>
      </header>
      <div className="public-content">
        <section className="giveaway-hero">
          <div className="giveaway-copy">
            <span className="giveaway-kicker"><Gift size={13} /> EVENTO DA COMUNIDADE</span>
            <h1>{site.title}</h1>
            <p>{site.subtitle || 'Concorra a um item especial do seu jogo favorito.'}</p>
            <button className="public-button public-button-large" type="button" onClick={() => setVerificationOpen(true)}>
              <ShieldCheck size={15} /> {verificationUrl ? 'Continuar para verificação' : 'Ver detalhes do giveaway'}
            </button>
            <small className="giveaway-safe-note">Nunca informe sua senha ou cookies do Roblox.</small>
          </div>
          <aside className="giveaway-prize-card">
            <span className="giveaway-prize-icon"><Gift size={22} /></span>
            <span className="giveaway-card-label">PRÊMIO</span>
            <strong>{site.prize || 'Item raro'}</strong>
            <span className="giveaway-card-game">{gameName}</span>
          </aside>
        </section>
        <section className="giveaway-details" aria-label="Detalhes do giveaway">
          <article className="giveaway-detail-card">
            <span className="giveaway-detail-icon"><Layers3 size={16} /></span>
            <small>JOGO</small>
            <strong>{gameName}</strong>
            {gameUrl && <a href={gameUrl} target="_blank" rel="noreferrer">Ver jogo no Roblox <ExternalLink size={11} /></a>}
          </article>
          <article className="giveaway-detail-card">
            <span className="giveaway-detail-icon"><CircleCheck size={16} /></span>
            <small>GANHADORES</small>
            <strong>{site.winnerCount}</strong>
            <span>prêmio{site.winnerCount === '1' ? '' : 's'}</span>
          </article>
          <article className="giveaway-detail-card">
            <span className="giveaway-detail-icon"><Globe2 size={16} /></span>
            <small>ENCERRAMENTO</small>
            <strong>{formattedEndDate}</strong>
            <span>conforme o organizador</span>
          </article>
        </section>
        <section className="giveaway-how">
          <div>
            <span className="giveaway-card-label">COMO PARTICIPAR</span>
            <h2>Confira as regras do organizador</h2>
            <p>Esta página apresenta os detalhes do sorteio. As regras, a entrega do prêmio e a seleção de ganhadores ficam a cargo de quem organizou o giveaway.</p>
          </div>
          {verificationUrl && (
            <button className="public-button public-button-small" type="button" onClick={() => setVerificationOpen(true)}>
              Abrir verificação <ArrowRight size={13} />
            </button>
          )}
        </section>
        <p className="giveaway-footer">Página criada com Hollow Generator · Não afiliada nem endossada pelo Roblox.</p>
      </div>
      {verificationOpen && (
        <div className="verification-backdrop" role="presentation" onClick={() => setVerificationOpen(false)}>
          <section className="verification-modal" role="dialog" aria-modal="true" aria-labelledby="giveaway-verification-title" onClick={(event) => event.stopPropagation()}>
            <button className="verification-close" type="button" aria-label="Fechar" onClick={() => setVerificationOpen(false)}>×</button>
            <ShieldCheck size={23} />
            <h2 id="giveaway-verification-title">{verificationUrl ? 'Verificação do giveaway' : 'Informações do sorteio'}</h2>
            <p>{verificationUrl
              ? 'Você vai abrir o endereço de verificação informado pelo organizador. Nunca compartilhe sua senha, cookie ou código de acesso.'
              : 'O organizador não configurou um endereço de verificação para este giveaway.'}</p>
            {verificationUrl ? (
              <a className="public-button public-button-large" href={verificationUrl} rel="noreferrer">
                Continuar para o endereço HTTPS <ExternalLink size={14} />
              </a>
            ) : (
              <button className="public-button public-button-large" type="button" onClick={() => setVerificationOpen(false)}>Entendi</button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function PublishedCondoSite({ site }: { site: PublishedSite }) {
  const [verificationOpen, setVerificationOpen] = useState(false);
  const images = site.selectedImages.length ? site.selectedImages : DEFAULT_CONDO_IMAGES.map((image) => image.src);
  const primaryImage = site.imageUrl.trim() || images[0];
  const verificationUrl = site.verificationUrl.trim();

  const enterGame = () => setVerificationOpen(true);
  const verifyAndContinue = () => {
    if (!verificationUrl) return;
    window.location.href = verificationUrl;
  };

  return (
    <main className="public-site" style={{ '--public-accent': site.accent } as CSSProperties}>
      <header className="public-header">
        <div className="public-brand"><span className="public-brand-icon"><ShieldCheck size={17} /></span><strong>{site.title || 'CONDO OFICIAL'}</strong></div>
        <button className="public-button public-button-small" type="button" onClick={enterGame}><ArrowRight size={14} /> Entrar no jogo</button>
      </header>
      <div className="public-content">
        <section className="public-hero">
          <span className="public-online"><span /> ONLINE AGORA</span>
          <h1>The future of<br />condo games.</h1>
          <p>{site.subtitle || 'Escolha um servidor online e entre na experiência. Milhares de jogadores já estão conectados.'}</p>
          <button className="public-button public-button-large" type="button" onClick={enterGame}><ArrowRight size={15} /> Entrar no jogo</button>
        </section>
        <section className="public-feature" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.74)), url("${primaryImage}")` }}>
          <div><small>DESTAQUE 1</small><strong>Novos mundos para explorar</strong></div><span>Arraste para o lado</span>
        </section>
        <section className="public-stats"><div><strong>345</strong><span>Jogadores online</span></div><div><strong>30</strong><span>Servidores online</span></div></section>
        <section className="public-gallery">
          {images.slice(0, 4).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Imagem do condo ${index + 1}`} />)}
        </section>
        <p className="public-footer">{site.verificationUrl ? 'Verificação configurada para entrar no jogo.' : 'Este condo ainda não configurou uma URL de verificação.'}</p>
      </div>
      {verificationOpen && (
        <div className="verification-backdrop" role="presentation" onClick={() => setVerificationOpen(false)}>
          <section className="verification-modal" role="dialog" aria-modal="true" aria-labelledby="verification-title" onClick={(event) => event.stopPropagation()}>
            <button className="verification-close" type="button" aria-label="Fechar" onClick={() => setVerificationOpen(false)}>×</button>
            <ShieldCheck size={23} />
            <h2 id="verification-title">Verificação necessária</h2>
            <p>{verificationUrl ? 'Para entrar no jogo você precisa se verificar.' : 'O criador ainda não informou uma URL de verificação.'}</p>
            <button className="public-button public-button-large" type="button" disabled={!verificationUrl} onClick={verifyAndContinue}><ShieldCheck size={15} /> Verificar-se</button>
          </section>
        </div>
      )}
    </main>
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
