import type { Intervention } from "@/types/app";

export const INTERVENTIONS: Intervention[] = [
  // anxious
  {
    id: "anxious_double_exhale",
    feeling: "anxious",
    type: "physiological",
    title: "Double exhale",
    instruction:
      "Two quick breaths in through your nose.\nOne long breath out through your mouth.\nDo that three times.",
    durationSeconds: 20,
    hasTimer: true,
    sortOrder: 1,
  },
  {
    id: "anxious_321_around_you",
    feeling: "anxious",
    type: "grounding",
    title: "3-2-1 around you",
    instruction:
      "Name 3 things you see.\n2 things you hear.\n1 thing you feel touching your skin.",
    durationSeconds: 25,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "anxious_cold_on_wrists",
    feeling: "anxious",
    type: "environmental",
    title: "Cold on the wrists",
    instruction:
      "Run cold water over your wrists for 20 seconds.\nOr hold something cold for a bit.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 3,
  },
  // nervous
  {
    id: "nervous_let_it_ride",
    feeling: "nervous",
    type: "cognitive",
    title: "Let it ride",
    instruction:
      "You can feel nervous and still begin.\nTake one slow breath. Start anyway.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "nervous_use_the_jitters",
    feeling: "nervous",
    type: "behavioral",
    title: "Use the jitters",
    instruction:
      "That buzzy feeling has energy in it.\nPut it into your first move.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "nervous_feet_on_floor",
    feeling: "nervous",
    type: "physiological",
    title: "Feet on the floor",
    instruction:
      "Put both feet flat on the ground.\nDrop your shoulders.\nTake one long exhale.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // overwhelmed
  {
    id: "overwhelmed_just_next_one",
    feeling: "overwhelmed",
    type: "cognitive",
    title: "Just the next one",
    instruction:
      "You do not need to solve the whole pile.\nPick the next thing only.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "overwhelmed_dump_it_out",
    feeling: "overwhelmed",
    type: "behavioral",
    title: "Dump it out",
    instruction:
      "Write down everything in your head for 60 seconds.\nMessy is fine. Just get it out.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "overwhelmed_change_your_spot",
    feeling: "overwhelmed",
    type: "environmental",
    title: "Change your spot",
    instruction:
      "Stand up and move somewhere else for 30 seconds.\nThen come back.",
    durationSeconds: 30,
    hasTimer: true,
    sortOrder: 3,
  },
  // stressed
  {
    id: "stressed_drop_shoulders",
    feeling: "stressed",
    type: "physiological",
    title: "Drop the shoulders",
    instruction:
      "Unclench your jaw.\nLet your shoulders fall.\nOpen your hands.\nTake one exhale.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "stressed_say_the_weight",
    feeling: "stressed",
    type: "cognitive",
    title: "Say the weight",
    instruction: "Say it in one sentence:\n\"I'm stressed because ___.\"",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "stressed_aim_for_done",
    feeling: "stressed",
    type: "cognitive",
    title: "Aim for done",
    instruction:
      "You do not need perfect right now.\nGo for done and fine.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // unmotivated
  {
    id: "unmotivated_start_tiny",
    feeling: "unmotivated",
    type: "behavioral",
    title: "Start tiny",
    instruction:
      "Open the doc.\nWrite one sentence.\nDo one rep.\nJust start there.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "unmotivated_30_seconds_go",
    feeling: "unmotivated",
    type: "behavioral",
    title: "30 seconds, go",
    instruction:
      "Start anything related to it for 30 seconds.\nNo plan. Just move.",
    durationSeconds: 30,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "unmotivated_use_a_song",
    feeling: "unmotivated",
    type: "environmental",
    title: "Use a song",
    instruction: "Put on one song you like.\nStart while it plays.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 3,
  },
  // stuck
  {
    id: "stuck_start_somewhere_else",
    feeling: "stuck",
    type: "behavioral",
    title: "Start somewhere else",
    instruction:
      "Skip the hardest part.\nBegin with the easiest piece.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "stuck_say_it_out_loud",
    feeling: "stuck",
    type: "cognitive",
    title: "Say it out loud",
    instruction:
      "Explain what you are stuck on out loud, like you are telling a friend.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "stuck_change_the_room",
    feeling: "stuck",
    type: "environmental",
    title: "Change the room",
    instruction:
      "Different chair, different desk, outside, hallway.\nMove first, then try again.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 3,
  },
  // unfocused
  {
    id: "unfocused_close_the_extras",
    feeling: "unfocused",
    type: "environmental",
    title: "Close the extras",
    instruction:
      "Close everything except the one thing you need.\nPhone face down.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "unfocused_one_minute_lock_in",
    feeling: "unfocused",
    type: "behavioral",
    title: "One-minute lock-in",
    instruction:
      "Give one thing your attention for 60 seconds.\nThat is all.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "unfocused_one_sentence_target",
    feeling: "unfocused",
    type: "cognitive",
    title: "One sentence target",
    instruction: "Say: \"Right now I'm doing ___.\"\nThen do only that.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // tired
  {
    id: "tired_wake_the_body",
    feeling: "tired",
    type: "physiological",
    title: "Wake the body",
    instruction:
      "Stand up.\nReach up high.\nRoll your shoulders back three times.\nShake out your hands.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "tired_water_and_cold",
    feeling: "tired",
    type: "environmental",
    title: "Water and cold",
    instruction:
      "Drink a full glass of water.\nSplash cold water on your face if you can.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "tired_get_some_light",
    feeling: "tired",
    type: "environmental",
    title: "Get some light",
    instruction:
      "Step to a window or outside for one minute.\nLet some daylight hit your face.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 3,
  },
];

export function getInterventionsForFeeling(feeling: string): Intervention[] {
  return INTERVENTIONS.filter((i) => i.feeling === feeling);
}
