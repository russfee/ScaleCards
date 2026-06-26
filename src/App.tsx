import { useMemo, useState } from "react";
import { Eye, EyeOff, Guitar, ListMusic, RefreshCw, RotateCcw, Settings2, Shuffle, Target } from "lucide-react";
import {
  CHALLENGES,
  NOTE_NAMES,
  NoteName,
  SCALE_DEFINITIONS,
  ScaleDefinition,
  getFretboardNotes,
  getRandomItem,
  getScaleNotes,
} from "./scales";

type PracticeCard = {
  root: NoteName;
  scale: ScaleDefinition;
  challenge: string;
};

const DEFAULT_SCALE_IDS = ["minor-pentatonic", "major-pentatonic", "major", "natural-minor"];
const FRET_OPTIONS = [12, 15, 17, 21];

function createPracticeCard(enabledScales: ScaleDefinition[]): PracticeCard {
  return {
    root: getRandomItem(NOTE_NAMES),
    scale: getRandomItem(enabledScales),
    challenge: getRandomItem(CHALLENGES),
  };
}

export default function App() {
  const [enabledScaleIds, setEnabledScaleIds] = useState<string[]>(DEFAULT_SCALE_IDS);
  const [maxFret, setMaxFret] = useState(12);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [showOnlyScaleNotes, setShowOnlyScaleNotes] = useState(true);
  const [card, setCard] = useState<PracticeCard>(() =>
    createPracticeCard(SCALE_DEFINITIONS.filter((scale) => DEFAULT_SCALE_IDS.includes(scale.id))),
  );

  const enabledScales = useMemo(() => {
    const selected = SCALE_DEFINITIONS.filter((scale) => enabledScaleIds.includes(scale.id));
    return selected.length ? selected : SCALE_DEFINITIONS.slice(0, 1);
  }, [enabledScaleIds]);

  const scaleNotes = useMemo(() => getScaleNotes(card.root, card.scale), [card]);
  const fretboardRows = useMemo(() => getFretboardNotes(card.root, card.scale, maxFret), [card, maxFret]);

  const nextCard = () => {
    setCard(createPracticeCard(enabledScales));
    setShowAnswer(false);
  };

  const resetStarterScales = () => {
    setEnabledScaleIds(DEFAULT_SCALE_IDS);
  };

  const toggleScale = (scaleId: string) => {
    setEnabledScaleIds((current) => {
      if (current.includes(scaleId)) {
        return current.length === 1 ? current : current.filter((id) => id !== scaleId);
      }

      return [...current, scaleId];
    });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Guitar size={25} />
          </span>
          <div>
            <p className="eyebrow">Russ Rodeo</p>
            <h1>Scale Finder</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" onClick={() => setShowNoteNames((value) => !value)} aria-label="Toggle note names">
            {showNoteNames ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button className="primary-button" type="button" onClick={nextCard}>
            <Shuffle size={18} />
            New card
          </button>
        </div>
      </header>

      <section className="workbench">
        <section className="practice-stage" aria-label="Practice card">
          <div className={showAnswer ? "flashcard is-flipped" : "flashcard"}>
            <div className="card-front">
              <div className="prompt-grid">
                <PromptTile label="Root note" value={card.root} />
                <PromptTile label="Scale type" value={card.scale.name} />
              </div>

              <div className="challenge-strip">
                <Target size={20} />
                <span>{card.challenge}</span>
              </div>

              <div className="practice-actions">
                <button className="secondary-button" type="button" onClick={() => setShowAnswer(true)}>
                  <Eye size={18} />
                  Show answer
                </button>
                <button className="ghost-button" type="button" onClick={nextCard}>
                  <RefreshCw size={18} />
                  Skip
                </button>
              </div>
            </div>
          </div>

          <section className={showAnswer ? "answer-panel visible" : "answer-panel"} aria-live="polite">
            <div className="answer-head">
              <div>
                <p className="eyebrow">Answer</p>
                <h2>
                  {card.root} {card.scale.name}
                </h2>
              </div>
              <button className="ghost-button" type="button" onClick={() => setShowAnswer(false)}>
                <RotateCcw size={18} />
                Hide
              </button>
            </div>

            <div className="scale-note-row" aria-label="Scale notes">
              {scaleNotes.map((note) => (
                <span className={note === card.root ? "note-pill root" : "note-pill"} key={note}>
                  {note}
                </span>
              ))}
            </div>

            <Fretboard
              rows={fretboardRows}
              maxFret={maxFret}
              showNoteNames={showNoteNames}
              showOnlyScaleNotes={showOnlyScaleNotes}
            />
          </section>
        </section>

        <aside className="sidebar">
          <section className="tool-panel">
            <div className="panel-heading">
              <Settings2 size={18} />
              <h2>Practice Setup</h2>
            </div>

            <div className="control-group">
              <span className="field-title">Frets</span>
              <div className="segmented-control" aria-label="Fret range">
                {FRET_OPTIONS.map((fretCount) => (
                  <button
                    className={maxFret === fretCount ? "active" : ""}
                    type="button"
                    key={fretCount}
                    onClick={() => setMaxFret(fretCount)}
                  >
                    {fretCount}
                  </button>
                ))}
              </div>
            </div>

            <label className="switch-row">
              <span>
                <strong>Scale notes only</strong>
              </span>
              <input
                type="checkbox"
                checked={showOnlyScaleNotes}
                onChange={(event) => setShowOnlyScaleNotes(event.currentTarget.checked)}
              />
            </label>

            <label className="switch-row">
              <span>
                <strong>Note names</strong>
              </span>
              <input type="checkbox" checked={showNoteNames} onChange={(event) => setShowNoteNames(event.currentTarget.checked)} />
            </label>
          </section>

          <section className="tool-panel">
            <div className="panel-heading split">
              <span>
                <ListMusic size={18} />
                <h2>Scales</h2>
              </span>
              <button className="text-button" type="button" onClick={resetStarterScales}>
                Reset
              </button>
            </div>

            <div className="scale-list">
              {SCALE_DEFINITIONS.map((scale) => (
                <label className="scale-option" key={scale.id}>
                  <input
                    type="checkbox"
                    checked={enabledScaleIds.includes(scale.id)}
                    onChange={() => toggleScale(scale.id)}
                    disabled={enabledScaleIds.length === 1 && enabledScaleIds.includes(scale.id)}
                  />
                  <span>
                    <strong>{scale.name}</strong>
                    <small>{scale.level}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="tool-panel compact">
            <div className="panel-heading">
              <Target size={18} />
              <h2>Session</h2>
            </div>
            <div className="session-stats">
              <span>{enabledScales.length} scales active</span>
              <span>{maxFret + 1} fret positions</span>
              <span>Standard tuning</span>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function PromptTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="prompt-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Fretboard({
  rows,
  maxFret,
  showNoteNames,
  showOnlyScaleNotes,
}: {
  rows: ReturnType<typeof getFretboardNotes>;
  maxFret: number;
  showNoteNames: boolean;
  showOnlyScaleNotes: boolean;
}) {
  const frets = Array.from({ length: maxFret + 1 }, (_, fret) => fret);
  const markerFrets = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21].filter((fret) => fret <= maxFret));

  return (
    <div className="fretboard-wrap">
      <div className="fret-numbers" style={{ gridTemplateColumns: `54px repeat(${maxFret + 1}, minmax(42px, 1fr))` }}>
        <span />
        {frets.map((fret) => (
          <span key={fret}>{fret}</span>
        ))}
      </div>

      <div className="fretboard" style={{ gridTemplateColumns: `54px repeat(${maxFret + 1}, minmax(42px, 1fr))` }}>
        {rows.map((stringNotes) => (
          <div className="string-row" role="row" key={`${stringNotes[0].stringName}-${stringNotes[0].stringIndex}`}>
            <div className="string-name">{stringNotes[0].stringName}</div>
            {stringNotes.map((fretNote) => {
              const isMuted = showOnlyScaleNotes && !fretNote.inScale;
              const className = ["fret-cell", markerFrets.has(fretNote.fret) ? "marker-fret" : "", isMuted ? "muted" : ""]
                .filter(Boolean)
                .join(" ");

              return (
                <div className={className} key={`${fretNote.stringIndex}-${fretNote.fret}`}>
                  <span className="string-line" />
                  {fretNote.inScale && (
                    <span className={fretNote.isRoot ? "fret-dot root" : "fret-dot"}>
                      {showNoteNames ? fretNote.note : fretNote.isRoot ? "R" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
