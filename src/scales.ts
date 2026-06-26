export type NoteName = (typeof NOTE_NAMES)[number];

export type ScaleDefinition = {
  id: string;
  name: string;
  shortName: string;
  intervals: number[];
  level: "Starter" | "Next" | "Advanced";
};

export type FretNote = {
  stringIndex: number;
  stringName: NoteName;
  fret: number;
  note: NoteName;
  pitchClass: number;
  inScale: boolean;
  isRoot: boolean;
};

export const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

export const STANDARD_TUNING: NoteName[] = ["E", "B", "G", "D", "A", "E"];

export const SCALE_DEFINITIONS: ScaleDefinition[] = [
  {
    id: "minor-pentatonic",
    name: "Minor pentatonic",
    shortName: "Min pent",
    intervals: [0, 3, 5, 7, 10],
    level: "Starter",
  },
  {
    id: "major-pentatonic",
    name: "Major pentatonic",
    shortName: "Maj pent",
    intervals: [0, 2, 4, 7, 9],
    level: "Starter",
  },
  {
    id: "major",
    name: "Major",
    shortName: "Major",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    level: "Starter",
  },
  {
    id: "natural-minor",
    name: "Natural minor",
    shortName: "Nat minor",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    level: "Starter",
  },
  {
    id: "blues",
    name: "Blues",
    shortName: "Blues",
    intervals: [0, 3, 5, 6, 7, 10],
    level: "Next",
  },
  {
    id: "dorian",
    name: "Dorian",
    shortName: "Dorian",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    level: "Advanced",
  },
  {
    id: "mixolydian",
    name: "Mixolydian",
    shortName: "Mixolydian",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    level: "Advanced",
  },
];

export const CHALLENGES = [
  "Find it anywhere on the neck",
  "Start from a 6th-string root",
  "Start from a 5th-string root",
  "Play two octaves",
  "Say the note names out loud",
  "Use three different positions",
];

const NOTE_TO_PITCH_CLASS = NOTE_NAMES.reduce<Record<string, number>>((map, note, index) => {
  map[note] = index;
  return map;
}, {});

export function getScaleNotes(root: NoteName, scale: ScaleDefinition) {
  const rootPitchClass = getPitchClass(root);
  return scale.intervals.map((interval) => NOTE_NAMES[(rootPitchClass + interval) % NOTE_NAMES.length]);
}

export function getFretboardNotes(root: NoteName, scale: ScaleDefinition, maxFret: number) {
  const rootPitchClass = getPitchClass(root);
  const scalePitchClasses = new Set(scale.intervals.map((interval) => (rootPitchClass + interval) % NOTE_NAMES.length));

  return STANDARD_TUNING.map((stringName, stringIndex) => {
    const openPitchClass = getPitchClass(stringName);

    return Array.from({ length: maxFret + 1 }, (_, fret): FretNote => {
      const pitchClass = (openPitchClass + fret) % NOTE_NAMES.length;

      return {
        stringIndex,
        stringName,
        fret,
        note: NOTE_NAMES[pitchClass],
        pitchClass,
        inScale: scalePitchClasses.has(pitchClass),
        isRoot: pitchClass === rootPitchClass,
      };
    });
  });
}

export function getPitchClass(note: NoteName) {
  return NOTE_TO_PITCH_CLASS[note];
}

export function getRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
