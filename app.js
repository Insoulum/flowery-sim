const canvas = document.querySelector("#scene");
const context = canvas.getContext("2d");
const swoonSprite = new Image();
swoonSprite.src = "uploads/swoon.png";
const floweryCounterLabel = document.querySelector("#flowery-count");
const floweryWarning = document.querySelector("#flowery-warning");
const overloadOverlay = document.querySelector("#overload-overlay");
const shatterCanvas = document.querySelector("#shatter-canvas");
const shatterContext = shatterCanvas.getContext("2d");
const overloadTitle = document.querySelector("#overload-title");
const gameOverScreen = document.querySelector("#game-over-screen");
const tryAgainButton = document.querySelector("#try-again");
const spawnButton = document.querySelector("#spawn");
const ralseiLine = document.querySelector("#ralsei-line");
const gameScene = document.querySelector("#game-scene");
const deathMenu = document.querySelector("#death-menu");
const graveyard = document.querySelector("#graveyard");
const emptyGraveyard = document.querySelector("#empty-graveyard");
const deathCountLabel = document.querySelector("#death-count");
const graveCountLabel = document.querySelector("#grave-count");
const deathMenuButton = document.querySelector("#death-menu-button");
const returnToGameButton = document.querySelector("#return-to-game");
const saveMenuButton = document.querySelector("#save-menu-button");
const saveMenu = document.querySelector("#save-menu");
const closeSaveMenuButton = document.querySelector("#close-save-menu");
const newSaveButton = document.querySelector("#new-save-button");
const saveList = document.querySelector("#save-list");
const emptySaveList = document.querySelector("#empty-save-list");
const saveMenuStatus = document.querySelector("#save-menu-status");
const achievementMenuButton = document.querySelector("#achievement-menu-button");
const achievementMenu = document.querySelector("#achievement-menu");
const closeAchievementsButton = document.querySelector("#close-achievements");
const achievementList = document.querySelector("#achievement-list");
const achievementSummary = document.querySelector("#achievement-summary");
const achievementToast = document.querySelector("#achievement-toast");
const achievementToastTitle = document.querySelector("#achievement-toast-title");
const errorSecret = document.querySelector("#error-secret");
const errorSecretTrigger = document.querySelector("#error-secret-trigger");
const currencyCountLabel = document.querySelector("#currency-count");
const buyAutospawnButton = document.querySelector("#buy-autospawn");
const buyBiggerSceneButton = document.querySelector("#buy-bigger-scene");
const buyYellowButton = document.querySelector("#buy-yellow");
const buySpawnerButton = document.querySelector("#buy-spawner");
const buyCarButton = document.querySelector("#buy-car");
const buyClarkButton = document.querySelector("#buy-clark");
const buyClarkKnifeButton = document.querySelector("#buy-clark-knife");
const buyErrorLogoButton = document.querySelector("#buy-error-logo");
const buyToolbarButton = document.querySelector("#buy-toolbar");
const buyMonsterboxButton = document.querySelector("#buy-monsterbox");
const upgradeMonsterboxRateButton = document.querySelector("#upgrade-monsterbox-rate");
const shopPanel = document.querySelector(".shop-panel");
const rebirthButton = document.querySelector("#rebirth-button");
const rebirthPointsLabel = document.querySelector("#rebirth-points");
const rebirthBonusLabel = document.querySelector("#rebirth-bonus");
const buyRebirthBoxesButton = document.querySelector("#buy-rebirth-boxes");
const buyRebirthSpawnerButton = document.querySelector("#buy-rebirth-spawner");
const buyRebirthCurrencyButton = document.querySelector("#buy-rebirth-currency");
const buyRebirthLimitButton = document.querySelector("#buy-rebirth-limit");
const floweryCountLimitLabel = document.querySelector("#flowery-count-limit");
const yellowControls = document.querySelector("#yellow-controls");
const toolbarControls = document.querySelector("#toolbar-controls");
const slashOverlay = document.querySelector("#slash-overlay");
const slashSprite = document.querySelector("#slash-sprite");
const aimGunButton = document.querySelector("#aim-gun");
const shootGunButton = document.querySelector("#shoot-gun");
const shopStatus = document.querySelector("#shop-status");
const sceneNavigation = document.querySelector("#scene-navigation");
const panSceneButton = document.querySelector("#pan-scene");
const zoomOutButton = document.querySelector("#zoom-out");
const zoomInButton = document.querySelector("#zoom-in");
const zoomLevelLabel = document.querySelector("#zoom-level");
const settingsButton = document.querySelector("#settings-button");
const settingsPanel = document.querySelector("#settings-panel");
const closeSettingsButton = document.querySelector("#close-settings");
const cheatsConsole = document.querySelector("#cheats-console");
const cheatsConsoleMode = document.querySelector("#cheats-console-mode");
const cheatsConsoleOutput = document.querySelector("#cheats-console-output");
const cheatsConsoleForm = document.querySelector("#cheats-console-form");
const cheatsConsoleInput = document.querySelector("#cheats-console-input");
const cheatsStatus = document.querySelector("#cheats-status");
const cheatsConfirm = document.querySelector("#cheats-confirm");
const confirmCheatsButton = document.querySelector("#confirm-cheats");
const cancelCheatsButton = document.querySelector("#cancel-cheats");
const volumeControls = {
  voice: {
    input: document.querySelector("#voice-volume"),
    output: document.querySelector("#voice-volume-value"),
  },
  sfx: {
    input: document.querySelector("#sfx-volume"),
    output: document.querySelector("#sfx-volume-value"),
  },
  music: {
    input: document.querySelector("#music-volume"),
    output: document.querySelector("#music-volume-value"),
  },
};

const DEATHS_STORAGE_KEY = "flowery-sim-dead-floweries";
const ECONOMY_STORAGE_KEY = "flowery-sim-economy";
const SETTINGS_STORAGE_KEY = "flowery-sim-audio-settings";
const CHEATS_LOCK_STORAGE_KEY = "flowery-sim-cheats-locked";
const CHEATS_SAVES_STORAGE_KEY = "flowery-sim-cheats-saves";
const SAVE_SLOTS_STORAGE_KEY = "flowery-sim-save-slots";
const ACTIVE_SAVE_STORAGE_KEY = "flowery-sim-active-save";

function parseStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function readSaveSlots() {
  const saves = parseStoredValue(SAVE_SLOTS_STORAGE_KEY, []);
  return Array.isArray(saves)
    ? saves.filter((save) => save && typeof save.id === "string" && save.snapshot)
    : [];
}

function initializeSaveSlots() {
  let saves = readSaveSlots();
  let activeId = null;
  if (!saves.length) {
    const oldCheatCopies = parseStoredValue(CHEATS_SAVES_STORAGE_KEY, []);
    const legacyCheats = (() => {
      try {
        return localStorage.getItem(CHEATS_LOCK_STORAGE_KEY) === "1";
      } catch {
        return false;
      }
    })();
    saves = [{
      id: "main",
      title: "Main save",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cheats: legacyCheats && (!Array.isArray(oldCheatCopies) || oldCheatCopies.length === 0),
      snapshot: {
        economy: parseStoredValue(ECONOMY_STORAGE_KEY, {}),
        deadFloweries: parseStoredValue(DEATHS_STORAGE_KEY, []),
        audioSettings: parseStoredValue(SETTINGS_STORAGE_KEY, {}),
      },
    }];
    if (Array.isArray(oldCheatCopies)) {
      for (const oldSave of oldCheatCopies) {
        if (!oldSave || oldSave.cheats !== true || !oldSave.snapshot) continue;
        saves.push({
          id: oldSave.id || `cheats-${Date.now()}-${saves.length}`,
          title: oldSave.title || "Cheats copy",
          createdAt: oldSave.createdAt || new Date().toISOString(),
          updatedAt: oldSave.createdAt || new Date().toISOString(),
          cheats: true,
          snapshot: oldSave.snapshot,
        });
      }
    }
    if (legacyCheats) {
      const latestCheatSave = [...saves].reverse().find((save) => save.cheats);
      if (latestCheatSave) activeId = latestCheatSave.id;
    }
    try {
      localStorage.setItem(SAVE_SLOTS_STORAGE_KEY, JSON.stringify(saves));
    } catch {
      // The in-memory default save still keeps the game playable.
    }
  }

  let storedActiveId = null;
  try {
    storedActiveId = localStorage.getItem(ACTIVE_SAVE_STORAGE_KEY);
  } catch {
    // Use the default save for this session.
  }
  if (saves.some((save) => save.id === storedActiveId)) activeId = storedActiveId;
  if (!activeId || !saves.some((save) => save.id === activeId)) activeId = saves[0]?.id || "main";
  try {
    localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, activeId);
  } catch {
    // The selected save still works for this session.
  }
  return activeId;
}

let activeSaveId = initializeSaveSlots();
let cheatsEnabled = isCheatsLockStored();
let cheatSpawnRate = null;
let cheatSpawnLimit = null;
let pendingCheatsConfirmation = false;
const CHEATS_CONSOLE_MAX_LINES = 100;
const AUTOSPAWN_PRICE = 25;
const AUTOSPAWN_MAX_LEVEL = 5;
const BIGGER_SCENE_PRICE = 300;
const MIN_SCENE_ZOOM = 0.5;
const MAX_SCENE_ZOOM = 2.5;
const FLOWERY_OVERLOAD_LIMIT = 500;
const REBIRTH_EXTRA_BOX_LIMIT = 3;
const REBIRTH_EXTRA_SPAWNER_LIMIT = 6;
const REBIRTH_MAX_FLOWERY_LEVELS = 5;
const FLOWERY_LIMIT_PER_REBIRTH_LEVEL = 100;
const REBIRTH_BOX_COST = 2;
const REBIRTH_SPAWNER_COST = 1;
const REBIRTH_CURRENCY_COST = 3;
const REBIRTH_LIMIT_COST = 2;
const YELLOW_PRICE = 75;
const CAR_PRICE = 125;
const CLARK_PRICE = 150;
const CLARK_KNIFE_PRICE = 250;
const ERROR_LOGO_PRICE = 500;
const ERROR_LOGO_SIZE = 64;
const ERROR_TRAIL_MIN_DELAY = 3000;
const ERROR_TRAIL_MAX_DELAY = 5000;
const ERROR_TRAIL_DITHER_DURATION = 1000;
const ERROR_TRAIL_PIXEL_SIZE = 4;
const ERROR_TRAIL_COLOR = 0x87;
const ERROR_TRAIL_BAYER = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21,
];
const TOOLBAR_PRICE = 200;
const MONSTERBOX_PRICE = 250;
const MONSTERBOX_RATE_MAX_LEVEL = 5;
const MONSTERBOX_RATE_PRICES = [100, 200, 300, 400, 500];
const MONSTERBOX_RATES = [
  { count: 1, interval: 15000 },
  { count: 2, interval: 12000 },
  { count: 4, interval: 10000 },
  { count: 6, interval: 8000 },
  { count: 8, interval: 6000 },
  { count: 10, interval: 5000 },
];
const MONSTERBOX_SIZE = 64;
const TOOL_ATTACK_RADIUS = 190;
const SLASH_ATTACK_DURATION = 2000;
const LASER_EFFECT_DURATION = 800;
const LASER_HIT_HALF_WIDTH = 58;
const CLARK_ATTACKS = {
  weak: { minTargets: 2, range: 100, duration: 500, cooldown: 1150 },
  mid: { minTargets: 3, range: 150, duration: 620, cooldown: 1650 },
  strong: { minTargets: 5, range: 210, duration: 760, cooldown: 2300 },
};
const CLARK_SHOCKWAVE_STYLES = {
  weak: { color: "#ffc17a", glow: "#ff743b", width: 5, blur: 9 },
  mid: { color: "#eaffaa", glow: "#b5ff4d", width: 8, blur: 16 },
  strong: { color: "#fff4c2", glow: "#ffb52e", width: 13, blur: 26 },
};
const FLOWERY_SPAWNER_BASE_PRICE = 40;
const FLOWERY_SPAWNER_PRICE_STEP = 30;
const MAX_FLOWERY_SPAWNERS = 6;
const FLOWERY_REWARD = 5;
const FLOWERY_BULLET_HITS = 5;
const FLOWERY_VOICE_AUDIBLE_RADIUS = 300;
const floweryEpitaphs = [
  "Died doing what it loved: bothering Ralsei.",
  "It was a flower. You know what you did.",
  "Gone, but somehow still annoying.",
  "Should have stayed under the lamp.",
  "Ralsei said he was sorry. He was not.",
  "At least it stopped spinning.",
  "It bloomed once. Then you clicked.",
  "A tiny flower. A huge mistake.",
];
const ACHIEVEMENTS_STORAGE_KEY = "flowery-sim-achievements";
const ACHIEVEMENT_DEFINITIONS = [
  { id: "first_bloom", title: "First Bloom", description: "Bring a Flowery into the world.", symbol: "✿", color: "#e9d45b", stat: "spawns", target: 1 },
  { id: "first_casualty", title: "First Casualty", description: "Defeat your first Flowery.", symbol: "×", color: "#f17862", stat: "kills", target: 1 },
  { id: "graveyard_shift", title: "Graveyard Shift", description: "Defeat 10 Floweries.", symbol: "10", color: "#b4a6d9", stat: "kills", target: 10 },
  { id: "flower_bully", title: "Flower Bully", description: "Defeat 100 Floweries.", symbol: "100", color: "#f09865", stat: "kills", target: 100 },
  { id: "botanical_crisis", title: "Botanical Crisis", description: "Defeat 1,000 Floweries.", symbol: "1K", color: "#db6470", stat: "kills", target: 1000 },
  { id: "mass_extinction", title: "Mass Extinction", description: "Defeat 10,000 Floweries. The garden remembers.", symbol: "10K", color: "#a7545b", stat: "kills", target: 10000 },
  { id: "garden_party", title: "Garden Party", description: "Spawn 100 Floweries.", symbol: "100", color: "#8ed26d", stat: "spawns", target: 100 },
  { id: "invasive_species", title: "Invasive Species", description: "Spawn 1,000 Floweries over time.", symbol: "1K", color: "#5fb879", stat: "spawns", target: 1000 },
  { id: "greenhouse_empire", title: "Greenhouse Empire", description: "Spawn 10,000 Floweries.", symbol: "10K", color: "#4c9972", stat: "spawns", target: 10000 },
  { id: "ralsei_airmail", title: "Ralsei Airmail", description: "Let Ralsei send a Flowery flying.", symbol: "✈", color: "#bb96dc", stat: "ralseiThrows", target: 1 },
  { id: "ralsei_postal_service", title: "Special Delivery", description: "Ralsei flings 25 Floweries.", symbol: "25", color: "#9f79c5", stat: "ralseiThrows", target: 25 },
  { id: "first_ride", title: "First Ride", description: "Witness a car flatten a Flowery.", symbol: "🚗", color: "#70c9dc", stat: "carKills", target: 1 },
  { id: "traffic_control", title: "Traffic Control", description: "Cars flatten 100 Floweries.", symbol: "100", color: "#54a7c7", stat: "carKills", target: 100 },
  { id: "road_apocalypse", title: "Road Apocalypse", description: "Cars flatten 1,000 Floweries.", symbol: "1K", color: "#467fa7", stat: "carKills", target: 1000 },
  { id: "ralsei_car", title: "Ralsei's Ride", description: "Get a Flowery run over by Ralsei's car.", symbol: "RC", color: "#96a5e8", stat: "ralseiCarKills", target: 1 },
  { id: "taxi_of_terror", title: "Taxi of Terror", description: "Ralsei's car hits 50 Floweries.", symbol: "50", color: "#797ed1", stat: "ralseiCarKills", target: 50 },
  { id: "pocket_change", title: "Pocket Change", description: "Earn 100 Flowey Currency in total.", symbol: "ƒ", color: "#edcf58", stat: "currencyEarned", target: 100 },
  { id: "flower_fortune", title: "Flower Fortune", description: "Earn 1,000 Flowey Currency.", symbol: "1K", color: "#d6ad3f", stat: "currencyEarned", target: 1000 },
  { id: "million_flower", title: "Flowery Tycoon", description: "Earn 10,000 Flowey Currency.", symbol: "10K", color: "#bc8c31", stat: "currencyEarned", target: 10000 },
  { id: "crowded_garden", title: "Crowded Garden", description: "Have 100 Floweries at once.", symbol: "100", color: "#9dcb72", stat: "peakFloweries", target: 100 },
  { id: "flower_sea", title: "A Sea of Flowers", description: "Have 250 Floweries at once.", symbol: "250", color: "#73b665", stat: "peakFloweries", target: 250 },
  { id: "overpopulation", title: "Overpopulation", description: "Reach the 500 Flowery limit.", symbol: "500", color: "#e5684d", stat: "peakFloweries", target: 500 },
  { id: "buy_a_car", title: "Pedal to the Petal", description: "Buy the Flowery crusher car.", symbol: "CAR", color: "#70c9dc" },
  { id: "yellow_friend", title: "Yellow Fellow", description: "Bring Yellow into the scene.", symbol: "Y", color: "#f4dc57" },
  { id: "room_to_bloom", title: "Room to Bloom", description: "Expand the scene for the first time.", symbol: "↗", color: "#84c49a" },
  { id: "automation", title: "Garden Automation", description: "Buy your first autospawn upgrade.", symbol: "AUTO", color: "#7cc697" },
  { id: "full_throttle", title: "Full Throttle", description: "Reach maximum autospawn level.", symbol: "MAX", color: "#55aa83" },
  { id: "spawner_network", title: "Spawner Network", description: "Fill every regular Flowery spawner slot.", symbol: "NET", color: "#69bcae" },
  { id: "monsterbox", title: "Think Inside the Box", description: "Buy a Monsterbox.", symbol: "BOX", color: "#e58d55" },
  { id: "monsterbox_max", title: "Box Office Hit", description: "Max out the Monsterbox spawn rate.", symbol: "MAX", color: "#d77946" },
  { id: "toolbar", title: "Tool Time", description: "Unlock the attack toolbar.", symbol: "TOOL", color: "#b18adb" },
  { id: "clark", title: "Stanky Leg", description: "Bring Clark into the scene.", symbol: "CL", color: "#94bb6f" },
  { id: "knife_clark", title: "Sharp Dressed", description: "Give Clark his knife.", symbol: "KN", color: "#df7777" },
  { id: "error_logo", title: "Object Object", description: "Buy the suspicious error icon.", symbol: "ERR", color: "#c4c4c4" },
  { id: "rebirth_once", title: "Second Bloom", description: "Rebirth for the first time.", symbol: "↻", color: "#d898e1", stat: "rebirths", target: 1 },
  { id: "rebirth_ten", title: "Again? Again.", description: "Rebirth 10 times.", symbol: "10", color: "#bf78d4", stat: "rebirths", target: 10 },
  { id: "rebirth_twenty_five", title: "Neverending Garden", description: "Rebirth 25 times.", symbol: "25", color: "#a651be", stat: "rebirths", target: 25 },
  { id: "full_loadout", title: "Fully Loaded", description: "Buy every main shop upgrade and max each upgrade track.", symbol: "100%", color: "#f1bd56" },
  { id: "collector", title: "The Completionist", description: "Unlock 20 other achievements.", symbol: "★", color: "#f2df71" },
  { id: "error_secret", title: "something went wrong!", description: "Find the strange startup error.", symbol: "?!", color: "#878787" },
];

function loadAchievementData() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY) || "{}");
    return {
      unlocked: saved.unlocked && typeof saved.unlocked === "object" ? saved.unlocked : {},
      stats: saved.stats && typeof saved.stats === "object" ? saved.stats : {},
    };
  } catch {
    return { unlocked: {}, stats: {} };
  }
}

let achievementData = loadAchievementData();
let achievementToastTimer = null;

function saveAchievementData() {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievementData));
  } catch {
    // Keep achievement progress for the current session if storage is unavailable.
  }
}

function updateAchievementButton() {
  const unlockedCount = Object.keys(achievementData.unlocked).length;
  achievementMenuButton.textContent = `achievements ${unlockedCount}/${ACHIEVEMENT_DEFINITIONS.length}`;
  achievementSummary.textContent = `${unlockedCount} of ${ACHIEVEMENT_DEFINITIONS.length} unlocked`;
}

function renderAchievementMenu() {
  achievementList.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const definition of ACHIEVEMENT_DEFINITIONS) {
    const unlockedAt = achievementData.unlocked[definition.id];
    const unlocked = Boolean(unlockedAt);
    const card = document.createElement("article");
    card.className = `achievement-card${unlocked ? " is-unlocked" : " is-locked"}`;
    card.setAttribute("role", "listitem");

    const icon = document.createElement("span");
    icon.className = "achievement-icon-placeholder";
    icon.textContent = definition.symbol;
    icon.style.setProperty("--achievement-accent", definition.color);
    icon.setAttribute("aria-hidden", "true");

    const copy = document.createElement("div");
    copy.className = "achievement-copy";
    const title = document.createElement("strong");
    title.textContent = definition.title;
    const description = document.createElement("p");
    description.textContent = definition.description;
    const status = document.createElement("small");
    if (unlocked) {
      status.textContent = `UNLOCKED · ${new Date(unlockedAt).toLocaleDateString()}`;
    } else if (definition.stat && definition.target) {
      const progress = Math.min(definition.target, Number(achievementData.stats[definition.stat]) || 0);
      status.textContent = `${progress.toLocaleString()} / ${definition.target.toLocaleString()}`;
    } else {
      status.textContent = "LOCKED";
    }
    copy.append(title, description, status);
    card.append(icon, copy);
    if (!unlocked && definition.stat && definition.target) {
      const progress = document.createElement("progress");
      progress.max = definition.target;
      progress.value = Math.min(definition.target, Number(achievementData.stats[definition.stat]) || 0);
      progress.setAttribute("aria-label", `${definition.title} progress`);
      card.append(progress);
    }
    fragment.append(card);
  }
  achievementList.append(fragment);
  updateAchievementButton();
}

function unlockAchievement(id) {
  if (!ACHIEVEMENT_DEFINITIONS.some((definition) => definition.id === id) || achievementData.unlocked[id]) {
    return;
  }
  achievementData.unlocked[id] = new Date().toISOString();
  saveAchievementData();
  updateAchievementButton();
  if (!achievementMenu.hidden) renderAchievementMenu();

  const definition = ACHIEVEMENT_DEFINITIONS.find((entry) => entry.id === id);
  achievementToastTitle.textContent = definition.title;
  achievementToast.hidden = false;
  clearTimeout(achievementToastTimer);
  achievementToastTimer = window.setTimeout(() => {
    achievementToast.hidden = true;
  }, 4200);

  const nonCollectorCount = Object.keys(achievementData.unlocked)
    .filter((achievementId) => achievementId !== "collector").length;
  if (id !== "collector" && nonCollectorCount >= 20) unlockAchievement("collector");
}

function addAchievementProgress(stat, amount = 1) {
  achievementData.stats[stat] = Math.max(0, Number(achievementData.stats[stat]) || 0) + amount;
  saveAchievementData();
  for (const definition of ACHIEVEMENT_DEFINITIONS) {
    if (
      definition.stat === stat &&
      achievementData.stats[stat] >= definition.target
    ) unlockAchievement(definition.id);
  }
  if (!achievementMenu.hidden) renderAchievementMenu();
}

function checkFullLoadoutAchievement() {
  if (
    carOwned &&
    yellowOwned &&
    biggerSceneOwned &&
    clarkOwned &&
    clarkKnifeOwned &&
    errorLogoOwned &&
    toolbarOwned &&
    monsterboxOwned &&
    autospawnLevel >= AUTOSPAWN_MAX_LEVEL &&
    extraSpawnerCount >= getFlowerySpawnerLimit() &&
    monsterboxRateLevel >= MONSTERBOX_RATE_MAX_LEVEL
  ) unlockAchievement("full_loadout");
}

function showStartupErrorSecret() {
  errorSecret.hidden = false;
}

function dismissStartupErrorSecret() {
  const clip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
  playSoundEffect(clip, 1, "voice");
  errorSecret.hidden = true;
  unlockAchievement("error_secret");
}

if (Math.random() < 0.0001) showStartupErrorSecret();
updateAchievementButton();

function isCheatsLockStored() {
  const activeSave = readSaveSlots().find((save) => save.id === activeSaveId);
  if (activeSave) return activeSave.cheats === true;
  try {
    return localStorage.getItem(CHEATS_LOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getActiveSave() {
  return readSaveSlots().find((save) => save.id === activeSaveId) || null;
}

function getActiveSaveSnapshot() {
  return getActiveSave()?.snapshot || null;
}

function writeSaveSlots(saves) {
  localStorage.setItem(SAVE_SLOTS_STORAGE_KEY, JSON.stringify(saves));
}

function updateActiveSaveSnapshot(patch) {
  try {
    const saves = readSaveSlots();
    const index = saves.findIndex((save) => save.id === activeSaveId);
    if (index < 0) return;
    saves[index] = {
      ...saves[index],
      updatedAt: new Date().toISOString(),
      snapshot: { ...saves[index].snapshot, ...patch },
    };
    writeSaveSlots(saves);
  } catch {
    // The current save remains playable if browser storage is unavailable.
  }
}

function loadEconomy() {
  try {
    const saved = getActiveSaveSnapshot()?.economy
      || JSON.parse(localStorage.getItem(ECONOMY_STORAGE_KEY) || "{}");
    return {
      currency: Number.isFinite(saved.currency) ? Math.max(0, saved.currency) : 0,
      autospawnLevel: Number.isFinite(saved.autospawnLevel)
        ? Math.max(0, Math.min(AUTOSPAWN_MAX_LEVEL, Math.floor(saved.autospawnLevel)))
        : saved.autospawn === true ? 1 : 0,
      yellowOwned: saved.yellowOwned === true,
      biggerSceneOwned: saved.biggerSceneOwned === true,
      carOwned: saved.carOwned === true,
      clarkOwned: saved.clarkOwned === true,
      clarkKnifeOwned: saved.clarkKnifeOwned === true,
      errorLogoOwned: saved.errorLogoOwned === true,
      toolbarOwned: saved.toolbarOwned === true,
      monsterboxOwned: saved.monsterboxOwned === true,
      monsterboxInactive: saved.monsterboxInactive === true,
      monsterboxRateLevel: Number.isFinite(saved.monsterboxRateLevel)
        ? Math.max(0, Math.min(MONSTERBOX_RATE_MAX_LEVEL, Math.floor(saved.monsterboxRateLevel)))
        : 0,
      rebirthCount: Number.isFinite(saved.rebirthCount) ? Math.max(0, Math.floor(saved.rebirthCount)) : 0,
      rebirthPoints: Number.isFinite(saved.rebirthPoints) ? Math.max(0, Math.floor(saved.rebirthPoints)) : 0,
      rebirthExtraBoxes: Number.isFinite(saved.rebirthExtraBoxes)
        ? Math.max(0, Math.min(REBIRTH_EXTRA_BOX_LIMIT, Math.floor(saved.rebirthExtraBoxes)))
        : 0,
      rebirthExtraSpawners: Number.isFinite(saved.rebirthExtraSpawners)
        ? Math.max(0, Math.min(REBIRTH_EXTRA_SPAWNER_LIMIT, Math.floor(saved.rebirthExtraSpawners)))
        : 0,
      rebirthCurrencyBoostOwned: saved.rebirthCurrencyBoostOwned === true,
      rebirthMaxFloweryLevels: Number.isFinite(saved.rebirthMaxFloweryLevels)
        ? Math.max(0, Math.min(REBIRTH_MAX_FLOWERY_LEVELS, Math.floor(saved.rebirthMaxFloweryLevels)))
        : 0,
      spawnerCount: Number.isFinite(saved.spawnerCount)
        ? Math.max(0, Math.min(
            MAX_FLOWERY_SPAWNERS + REBIRTH_EXTRA_SPAWNER_LIMIT,
            Math.floor(saved.spawnerCount),
          ))
        : 0,
    };
  } catch {
    return {
      currency: 0,
      autospawnLevel: 0,
      yellowOwned: false,
      biggerSceneOwned: false,
      carOwned: false,
      clarkOwned: false,
      clarkKnifeOwned: false,
      errorLogoOwned: false,
      toolbarOwned: false,
      monsterboxOwned: false,
      monsterboxInactive: false,
      monsterboxRateLevel: 0,
      rebirthCount: 0,
      rebirthPoints: 0,
      rebirthExtraBoxes: 0,
      rebirthExtraSpawners: 0,
      rebirthCurrencyBoostOwned: false,
      rebirthMaxFloweryLevels: 0,
      spawnerCount: 0,
    };
  }
}

const savedEconomy = loadEconomy();
let floweyCurrency = savedEconomy.currency;
let autospawnLevel = savedEconomy.autospawnLevel;
let yellowOwned = savedEconomy.yellowOwned;
let biggerSceneOwned = savedEconomy.biggerSceneOwned;
let carOwned = savedEconomy.carOwned;
let clarkOwned = savedEconomy.clarkOwned;
let clarkKnifeOwned = savedEconomy.clarkKnifeOwned;
let errorLogoOwned = savedEconomy.errorLogoOwned;
let toolbarOwned = savedEconomy.toolbarOwned;
let monsterboxOwned = savedEconomy.monsterboxOwned;
let monsterboxInactive = savedEconomy.monsterboxInactive;
let monsterboxRateLevel = savedEconomy.monsterboxRateLevel;
let monsterboxNextSpawnAt = 0;
let rebirthCount = savedEconomy.rebirthCount;
let rebirthPoints = savedEconomy.rebirthPoints;
let rebirthExtraBoxes = savedEconomy.rebirthExtraBoxes;
let rebirthExtraSpawners = savedEconomy.rebirthExtraSpawners;
let rebirthCurrencyBoostOwned = savedEconomy.rebirthCurrencyBoostOwned;
let rebirthMaxFloweryLevels = savedEconomy.rebirthMaxFloweryLevels;
let selectedAttackTool = "squish";
let slashAttackActive = false;
let bladeAudioPaused = false;
let extraSpawnerCount = savedEconomy.spawnerCount;
let nextAutospawnAt = 0;
let yellowCompanion = null;
let clarkCompanion = null;
let knifeClarkCompanion = null;
let yellowAimMode = false;
let sceneZoom = 1;
let cameraX = biggerSceneOwned ? getViewWidth() / 2 : 0;
let cameraY = biggerSceneOwned ? getViewHeight() / 2 : 0;
let sceneOriginX = 0;
let sceneOriginY = 0;
let panMode = false;
let activePan = null;
const yellowBullets = [];
const extraFlowerSpawners = [];
const spawnerParticles = [];
const swoonEffects = [];
const laserEffects = [];
const clarkShockwaves = [];
const errorTrailPixels = new Map();
let errorLogo = null;
let errorLogoMask = null;
const floweryGroups = [];
let nextFloweryGroupAt = performance.now() + 8000 + Math.random() * 6000;
let nextFloweryGroupId = 1;
let nextFloweryCrowdUpdateAt = 0;
let lastFloweryCrowdUpdateAt = performance.now();
let flowerySpatialGrid = null;
let overloadSequenceActive = false;
let lastFloweryCount = -1;
const audioSettings = loadAudioSettings();

function getViewWidth() {
  const dockWidth = shopPanel.clientWidth || 300;
  return canvas.clientWidth || Math.max(1, window.innerWidth - dockWidth);
}

function getViewHeight() {
  return canvas.clientHeight || window.innerHeight;
}

function getWorldWidth() {
  return getViewWidth() * (biggerSceneOwned ? 2 : 1);
}

function getWorldHeight() {
  return getViewHeight() * (biggerSceneOwned ? 2 : 1);
}

function getLampX() {
  return getWorldWidth() / 2;
}

function getLampY() {
  return getWorldHeight() / 2;
}

function getFlowerySpawnerRatios(index) {
  const [baseX, baseY] =
    FLOWERY_SPAWNER_POSITIONS[index % FLOWERY_SPAWNER_POSITIONS.length];
  if (!biggerSceneOwned) return [baseX, baseY];
  const spread = 1.55;
  return [
    Math.max(0.035, Math.min(0.965, 0.5 + (baseX - 0.5) * spread)),
    Math.max(0.035, Math.min(0.965, 0.5 + (baseY - 0.5) * spread)),
  ];
}

function placeFlowerySpawner(spawner) {
  const [xRatio, yRatio] = getFlowerySpawnerRatios(spawner.index);
  spawner.xRatio = xRatio;
  spawner.yRatio = yRatio;
  spawner.x = Math.max(
    0,
    Math.min(getWorldWidth() - FLOWERY_SPAWNER_SIZE, xRatio * getWorldWidth() - FLOWERY_SPAWNER_SIZE / 2),
  );
  spawner.y = Math.max(
    0,
    Math.min(getWorldHeight() - FLOWERY_SPAWNER_SIZE, yRatio * getWorldHeight() - FLOWERY_SPAWNER_SIZE / 2),
  );
}

function clampCamera() {
  cameraX = Math.max(0, Math.min(
    Math.max(0, getWorldWidth() - getViewWidth() / sceneZoom),
    cameraX,
  ));
  cameraY = Math.max(0, Math.min(
    Math.max(0, getWorldHeight() - getViewHeight() / sceneZoom),
    cameraY,
  ));
}

function updateSceneNavigationUI() {
  if (!zoomLevelLabel || !panSceneButton) return;
  zoomLevelLabel.value = `${Math.round(sceneZoom * 100)}%`;
  zoomLevelLabel.textContent = zoomLevelLabel.value;
  panSceneButton.classList.toggle("is-panning", panMode);
  panSceneButton.setAttribute("aria-pressed", String(panMode));
  panSceneButton.textContent = panMode ? "stop panning" : "pan scene";
}

function updateSceneBackground() {
  if (!biggerSceneOwned) {
    gameScene.style.backgroundPosition = "0 0";
    gameScene.style.backgroundSize = "320px 240px";
    return;
  }
  gameScene.style.backgroundPosition =
    `${(sceneOriginX - cameraX) * sceneZoom}px ${(sceneOriginY - cameraY) * sceneZoom}px`;
  gameScene.style.backgroundSize = `${320 * sceneZoom}px ${240 * sceneZoom}px`;
}

function worldPointFromScreen(x, y) {
  return {
    x: cameraX + x / sceneZoom,
    y: cameraY + y / sceneZoom,
  };
}

function isWorldRectVisible(x, y, width, height) {
  const right = cameraX + getViewWidth() / sceneZoom;
  const bottom = cameraY + getViewHeight() / sceneZoom;
  return x < right && x + width > cameraX && y < bottom && y + height > cameraY;
}

function zoomAt(screenX, screenY, nextZoom) {
  if (!biggerSceneOwned) return;
  const anchor = worldPointFromScreen(screenX, screenY);
  sceneZoom = Math.max(MIN_SCENE_ZOOM, Math.min(MAX_SCENE_ZOOM, nextZoom));
  cameraX = anchor.x - screenX / sceneZoom;
  cameraY = anchor.y - screenY / sceneZoom;
  clampCamera();
  updateSceneNavigationUI();
  updateSceneBackground();
}

function loadAudioSettings() {
  try {
    const saved = getActiveSaveSnapshot()?.audioSettings
      || JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}");
    return {
      voice: Number.isFinite(saved.voice) ? Math.max(0, Math.min(1, saved.voice)) : 1,
      sfx: Number.isFinite(saved.sfx) ? Math.max(0, Math.min(1, saved.sfx)) : 1,
      music: Number.isFinite(saved.music) ? Math.max(0, Math.min(1, saved.music)) : 0.35,
    };
  } catch {
    return { voice: 1, sfx: 1, music: 0.35 };
  }
}

function saveAudioSettings() {
  if (cheatsEnabled) return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(audioSettings));
  } catch {
    // Audio controls still work for this session if storage is unavailable.
  }
  updateActiveSaveSnapshot({ audioSettings: { ...audioSettings } });
}

function captureEconomySnapshot() {
  return {
    currency: floweyCurrency,
    autospawnLevel,
    yellowOwned,
    biggerSceneOwned,
    carOwned,
    clarkOwned,
    clarkKnifeOwned,
    errorLogoOwned,
    toolbarOwned,
    monsterboxOwned,
    monsterboxInactive,
    monsterboxRateLevel,
    rebirthCount,
    rebirthPoints,
    rebirthExtraBoxes,
    rebirthExtraSpawners,
    rebirthCurrencyBoostOwned,
    rebirthMaxFloweryLevels,
    spawnerCount: extraSpawnerCount,
  };
}

function saveEconomy() {
  if (cheatsEnabled) return;
  const economy = captureEconomySnapshot();
  try {
    localStorage.setItem(ECONOMY_STORAGE_KEY, JSON.stringify(economy));
  } catch {
    // Keep the current session playable if browser storage is unavailable.
  }
  updateActiveSaveSnapshot({ economy });
}

function getMonsterboxRate() {
  return MONSTERBOX_RATES[monsterboxRateLevel];
}

function getMonsterboxInterval() {
  return getMonsterboxRate().interval * (monsterboxInactive ? 2 : 1);
}

function hasMonsterboxes() {
  return monsterboxOwned || rebirthExtraBoxes > 0;
}

function getMonsterboxPositions() {
  const boxCount = (monsterboxOwned ? 1 : 0) + rebirthExtraBoxes;
  if (!boxCount) return [];
  const spacing = MONSTERBOX_SIZE + 10;
  const startX = getLampX() - ((boxCount - 1) * spacing) / 2 - MONSTERBOX_SIZE / 2;
  const y = getLampY() - LAMP_HEIGHT / 2 - MONSTERBOX_SIZE - 16;
  return Array.from({ length: boxCount }, (_, index) => ({
    x: startX + index * spacing,
    y,
  }));
}

function getFlowerySpawnerLimit() {
  return MAX_FLOWERY_SPAWNERS + rebirthExtraSpawners;
}

function getFloweryLimit() {
  return FLOWERY_OVERLOAD_LIMIT +
    rebirthMaxFloweryLevels * FLOWERY_LIMIT_PER_REBIRTH_LEVEL;
}

function getCurrencyMultiplier() {
  return (1 + rebirthCount * 0.1) * (rebirthCurrencyBoostOwned ? 1.5 : 1);
}

function getRunUpgradeProgress() {
  const runUpgrades = [
    autospawnLevel >= AUTOSPAWN_MAX_LEVEL,
    biggerSceneOwned,
    yellowOwned,
    carOwned,
    clarkOwned,
    clarkKnifeOwned,
    errorLogoOwned,
    toolbarOwned,
    monsterboxOwned,
    monsterboxRateLevel >= MONSTERBOX_RATE_MAX_LEVEL,
    extraSpawnerCount >= getFlowerySpawnerLimit(),
  ];
  return {
    maxed: runUpgrades.every(Boolean),
    count: runUpgrades.filter(Boolean).length,
    total: runUpgrades.length,
  };
}

function updateShopUI() {
  currencyCountLabel.textContent = `ƒ${floweyCurrency}`;
  rebirthPointsLabel.textContent = String(rebirthPoints);
  const upgradeProgress = getRunUpgradeProgress();
  rebirthButton.textContent = upgradeProgress.maxed
    ? "Rebirth · reset run +1 point"
    : `Rebirth · upgrades ${upgradeProgress.count}/${upgradeProgress.total} maxed`;
  rebirthButton.disabled = !upgradeProgress.maxed;
  rebirthBonusLabel.textContent =
    `Max all run upgrades to rebirth. +10% currency each time · current ×${getCurrencyMultiplier().toFixed(2)}.`;
  buyRebirthBoxesButton.textContent =
    `Extra Monsterbox ${rebirthExtraBoxes}/${REBIRTH_EXTRA_BOX_LIMIT} · ${REBIRTH_BOX_COST} rebirths`;
  buyRebirthBoxesButton.disabled =
    rebirthExtraBoxes >= REBIRTH_EXTRA_BOX_LIMIT || rebirthPoints < REBIRTH_BOX_COST;
  buyRebirthSpawnerButton.textContent =
    `Extra spawner ${rebirthExtraSpawners}/${REBIRTH_EXTRA_SPAWNER_LIMIT} · ${REBIRTH_SPAWNER_COST} rebirth`;
  buyRebirthSpawnerButton.disabled =
    rebirthExtraSpawners >= REBIRTH_EXTRA_SPAWNER_LIMIT || rebirthPoints < REBIRTH_SPAWNER_COST;
  buyRebirthCurrencyButton.textContent = rebirthCurrencyBoostOwned
    ? "×1.5 currency · OWNED"
    : `×1.5 currency · ${REBIRTH_CURRENCY_COST} rebirths`;
  buyRebirthCurrencyButton.disabled =
    rebirthCurrencyBoostOwned || rebirthPoints < REBIRTH_CURRENCY_COST;
  buyRebirthLimitButton.textContent =
    `Higher Flowery limit ${rebirthMaxFloweryLevels}/${REBIRTH_MAX_FLOWERY_LEVELS} · ${REBIRTH_LIMIT_COST} rebirths`;
  buyRebirthLimitButton.disabled =
    rebirthMaxFloweryLevels >= REBIRTH_MAX_FLOWERY_LEVELS || rebirthPoints < REBIRTH_LIMIT_COST;
  floweryCountLimitLabel.textContent = `/${getFloweryLimit()}`;
  buyMonsterboxButton.textContent = monsterboxOwned
    ? "Spawn Monsterbox · OWNED"
    : `Spawn Monsterbox · ƒ${MONSTERBOX_PRICE}`;
  buyMonsterboxButton.disabled = monsterboxOwned || floweyCurrency < MONSTERBOX_PRICE;
  upgradeMonsterboxRateButton.hidden = !hasMonsterboxes();
  if (monsterboxRateLevel >= MONSTERBOX_RATE_MAX_LEVEL) {
    upgradeMonsterboxRateButton.textContent = "Monsterbox spawn rate · MAX (10 / 5s)";
    upgradeMonsterboxRateButton.disabled = true;
  } else {
    const nextLevel = monsterboxRateLevel + 1;
    const price = MONSTERBOX_RATE_PRICES[monsterboxRateLevel];
    upgradeMonsterboxRateButton.textContent =
      `Monsterbox spawn rate L${nextLevel} · ƒ${price}`;
    upgradeMonsterboxRateButton.disabled = floweyCurrency < price;
  }
  buyToolbarButton.textContent = toolbarOwned
    ? "Toolbar · OWNED"
    : `Toolbar · ƒ${TOOLBAR_PRICE}`;
  buyToolbarButton.disabled = toolbarOwned || floweyCurrency < TOOLBAR_PRICE;
  const nextAutospawnLevel = autospawnLevel + 1;
  const autospawnPrice = AUTOSPAWN_PRICE * nextAutospawnLevel;
  buyAutospawnButton.textContent = autospawnLevel === 0
    ? `Autospawn floweries · ƒ${autospawnPrice}`
    : autospawnLevel >= AUTOSPAWN_MAX_LEVEL
      ? `Autospawn level ${autospawnLevel} · MAX`
      : `Autospawn upgrade L${nextAutospawnLevel} · ƒ${autospawnPrice}`;
  buyAutospawnButton.disabled =
    autospawnLevel >= AUTOSPAWN_MAX_LEVEL || floweyCurrency < autospawnPrice;
  buyBiggerSceneButton.textContent = biggerSceneOwned
    ? "Make scene bigger · OWNED"
    : `Make scene bigger · ƒ${BIGGER_SCENE_PRICE}`;
  buyBiggerSceneButton.disabled = biggerSceneOwned || floweyCurrency < BIGGER_SCENE_PRICE;
  buyYellowButton.textContent = yellowOwned
    ? "Spawn Yellow · OWNED"
    : `Spawn Yellow · ƒ${YELLOW_PRICE}`;
  buyYellowButton.disabled = yellowOwned || floweyCurrency < YELLOW_PRICE;
  buyCarButton.textContent = carOwned
    ? "Flowery crusher car · OWNED"
    : `Flowery crusher car · ƒ${CAR_PRICE}`;
  buyCarButton.disabled = carOwned || floweyCurrency < CAR_PRICE;
  buyClarkButton.textContent = clarkOwned
    ? "Clark stanky leg · OWNED"
    : `Clark stanky leg · ƒ${CLARK_PRICE}`;
  buyClarkButton.disabled = clarkOwned || floweyCurrency < CLARK_PRICE;
  buyClarkKnifeButton.textContent = clarkKnifeOwned
    ? "Clark knife · OWNED"
    : `Clark knife · ƒ${CLARK_KNIFE_PRICE}`;
  buyClarkKnifeButton.disabled =
    clarkKnifeOwned || floweyCurrency < CLARK_KNIFE_PRICE;
  buyErrorLogoButton.textContent = errorLogoOwned
    ? "[Object Object] · OWNED"
    : `[Object Object] · ƒ${ERROR_LOGO_PRICE}`;
  buyErrorLogoButton.disabled = errorLogoOwned || floweyCurrency < ERROR_LOGO_PRICE;
  const spawnerLimit = getFlowerySpawnerLimit();
  const spawnerPrice = FLOWERY_SPAWNER_BASE_PRICE +
    FLOWERY_SPAWNER_PRICE_STEP * extraSpawnerCount;
  buySpawnerButton.textContent = extraSpawnerCount >= spawnerLimit
    ? `More flowery spawners · ${extraSpawnerCount}/${spawnerLimit} · MAX`
    : `More flowery spawners · ${extraSpawnerCount}/${spawnerLimit} · ƒ${spawnerPrice}`;
  buySpawnerButton.disabled =
    extraSpawnerCount >= spawnerLimit || floweyCurrency < spawnerPrice;
  yellowControls.hidden = !yellowOwned;
  toolbarControls.hidden = !toolbarOwned;
  sceneNavigation.hidden = !biggerSceneOwned;
  updateSceneNavigationUI();
  const ownedUpgrades = [
    hasMonsterboxes() && "Monsterbox",
    toolbarOwned && "toolbar",
    yellowOwned && "Yellow",
    biggerSceneOwned && "expanded scene",
    carOwned && "crusher car",
    clarkOwned && "Clark",
    clarkKnifeOwned && "Clark knife",
    errorLogoOwned && "[Object Object]",
  ].filter(Boolean);
  const upgradeSummary = ownedUpgrades.length ? `${ownedUpgrades.join(", ")} active. ` : "";
  if (toolbarOwned && selectedAttackTool === "lazer") {
    shopStatus.textContent = `${upgradeSummary}Lazer fires across the screen. Click near a flowery.`;
  } else if (toolbarOwned && selectedAttackTool === "roaring blade") {
    shopStatus.textContent = `${upgradeSummary}Roaring blade blacks out the scene and clears nearby floweries.`;
  } else if (hasMonsterboxes()) {
    const rate = getMonsterboxRate();
    shopStatus.textContent =
      `${upgradeSummary}Monsterbox ${monsterboxInactive ? "inactive · half rate" : "active"}: ${rate.count} ${rate.count === 1 ? "flowery" : "floweries"} every ${getMonsterboxInterval() / 1000}s. Click the box to toggle.`;
  } else if (yellowOwned && !yellowAimMode) {
    shopStatus.textContent = `${upgradeSummary}Yellow wanders and fires. Move gun, click the scene.`;
  } else if (autospawnLevel > 0) {
    shopStatus.textContent = `${upgradeSummary}Autospawn L${autospawnLevel}; ${extraSpawnerCount} extra spawners. Earn ƒ${(FLOWERY_REWARD * getCurrencyMultiplier()).toFixed(1)} per defeat.`;
  } else if (extraSpawnerCount > 0) {
    shopStatus.textContent = `${upgradeSummary}${extraSpawnerCount} extra spawners produce floweries. Earn ƒ${(FLOWERY_REWARD * getCurrencyMultiplier()).toFixed(1)} per defeat.`;
  } else if (!yellowAimMode) {
    shopStatus.textContent = `${upgradeSummary}Earn ƒ${(FLOWERY_REWARD * getCurrencyMultiplier()).toFixed(1)} for every flowery defeated.`;
  }
  if (errorLogoOwned) {
    shopStatus.textContent +=
      " It leaves gray pixels that dither away and squishes floweries on contact.";
  }
  checkFullLoadoutAchievement();
}

function awardFloweyCurrency() {
  const reward = FLOWERY_REWARD * getCurrencyMultiplier();
  floweyCurrency += reward;
  addAchievementProgress("currencyEarned", reward);
  updateShopUI();
  saveEconomy();
}

function loadDeadFloweries() {
  try {
    const saved = getActiveSaveSnapshot()?.deadFloweries
      || JSON.parse(localStorage.getItem(DEATHS_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((record) => record && typeof record === "object") : [];
  } catch {
    return [];
  }
}

const deadFloweries = loadDeadFloweries();
let floweriesKilled = deadFloweries.length;

function saveDeadFloweries() {
  if (cheatsEnabled) return;
  try {
    localStorage.setItem(DEATHS_STORAGE_KEY, JSON.stringify(deadFloweries));
  } catch {
    // Keep this session's count and graveyard working if storage is unavailable.
  }
  updateActiveSaveSnapshot({ deadFloweries: deadFloweries.map((record) => ({ ...record })) });
}

function updateDeathCount() {
  floweriesKilled = deadFloweries.length;
  deathCountLabel.textContent = String(floweriesKilled);
  graveCountLabel.textContent = String(floweriesKilled);
}

function recordFloweryDeath(flowery, source = "other") {
  if (flowery.deathRecorded) return;
  flowery.deathRecorded = true;
  addAchievementProgress("kills");
  if (source === "ralsei") addAchievementProgress("ralseiThrows");
  if (source === "car" || source === "ralsei-car") addAchievementProgress("carKills");
  if (source === "ralsei-car") addAchievementProgress("ralseiCarKills");
  deadFloweries.push({
    epitaph: floweryEpitaphs[Math.floor(Math.random() * floweryEpitaphs.length)],
  });
  awardFloweyCurrency();
  updateDeathCount();
  saveDeadFloweries();
}

function renderGraveyard() {
  graveyard.replaceChildren();
  updateDeathCount();
  graveyard.hidden = floweriesKilled === 0;
  emptyGraveyard.hidden = floweriesKilled > 0;
  if (!floweriesKilled) return;

  const fragment = document.createDocumentFragment();
  deadFloweries.forEach((record, index) => {
    const grave = document.createElement("article");
    grave.className = "grave";
    grave.setAttribute("role", "listitem");

    const sprite = document.createElement("img");
    sprite.src = "uploads/flowery_grave.png";
    sprite.alt = "Flowery gravestone";
    sprite.width = 29;
    sprite.height = 32;

    const name = document.createElement("div");
    name.className = "grave-name";
    name.textContent = `FLOWERY #${String(index + 1).padStart(3, "0")}`;

    const epitaph = document.createElement("p");
    epitaph.className = "grave-epitaph";
    epitaph.textContent = typeof record.epitaph === "string"
      ? record.epitaph
      : floweryEpitaphs[index % floweryEpitaphs.length];

    grave.append(sprite, name, epitaph);
    fragment.append(grave);
  });
  graveyard.append(fragment);
}

const voiceClips = [
  "all_according_to_all_according_to_plant",
  "blingo_blizzard",
  "calling_for_help",
  "dont_you_like_serving_humans",
  "flowers_blooms_in_your_heart",
  "flowery",
  "flowery2",
  "forget_it",
  "get_a_chance_1",
  "get_a_chance_2",
  "give_to_you",
  "glue",
  "go_home",
  "goodbye",
  "great_style",
  "grown_like_a_turnip",
  "hah",
  "heh_it_s_my_jarona",
  "hereicome",
  "hereicomesanfrandisc",
  "hereicomesanfrandisco_strong",
  "hereicomesanfrandisco_weak",
  "hey",
  "hey_boys",
  "hey_raly",
  "heyguys",
  "heyguysithinkifoundaglue",
  "heytherelittleguy",
  "hoo",
  "huh",
  "huhillshowyou",
  "im_falling",
  "im_only_trying_to_help_you",
  "imsorryonceagainikeptaladyinwaiting",
  "it",
  "its_all_in_a_name",
  "its_all_yours",
  "its_so_human",
  "itsme",
  "itsmeflowery",
  "jarona1",
  "jarona2",
  "jarona3",
  "jarona4",
  "kris",
  "last_jarona",
  "leaf_it_to_me",
  "lend_me_your_power",
  "minipeppers",
  "mostlys",
  "my_favorite_two",
  "my_human",
  "my_king",
  "mysterious_wind",
  "no_way_its_your_children",
  "nonono",
  "omega_flowery",
  "powering_up",
  "prism_blow",
  "sanfran",
  "say_that_again",
  "smile_again",
  "sorryaboutthatguys",
  "sorryaboutthatlittleguy",
  "sorryabouttheguy",
  "sorrytokeepaladyinwaiting",
  "sorrytokeepyouladies",
  "sorrytokeepyouwaiting1",
  "sorrytokeepyouwaiting2",
  "spiral_dance",
  "stingus",
  "suckle_it_up",
  "susie",
  "take_that",
  "thats_my_dreams",
  "thatsgreat",
  "the_boys",
  "the_diner",
  "theyre_eating_my_flesh",
  "thisguysyourbestfriend",
  "try_my_flavor",
  "what_a_predictable_creature",
  "with_your_powers_combined",
  "wow",
  "yes",
  "your_dad",
  "yourdadsmybestfriend",
  "youre_a_hero",
].map((name) => `English/snd_flowery_voiceclip_${name}.wav`);

let audioContext;
let limiter;
let outputGain;
let lastFrameTime = 0;
const floweries = [];
const cars = [];
const ralseiCars = [];
const explosions = [];
const activeSoundEffects = new Set();
const liveSoundEffects = new Set();
const FLOWERY_FRAME_COUNT = 56;
const SPRITE_WIDTH = 52;
const SPRITE_HEIGHT = 68;
const CAR_WIDTH = 87;
const CAR_HEIGHT = 58;
const EXPLOSION_FRAME_COUNT = 17;
const EXPLOSION_FRAME_MS = 80;
const EXPLOSION_WIDTH = 71;
const EXPLOSION_HEIGHT = 100;
const SPLAT_PARTICLE_SIZE = 10;
const SPLAT_PARTICLE_LINGER = 700;
const SPLAT_PARTICLE_FADE = 1300;
const LAMP_WIDTH = 16;
const LAMP_HEIGHT = 69;
const FLOWERY_SPAWNER_SIZE = 64;
const FLOWERY_SPAWNER_INTERVAL = 6500;
const FLOWERY_SPAWNER_CAPACITY = 5;
const FLOWERY_SPAWNER_POSITIONS = [
  [0.18, 0.22],
  [0.48, 0.2],
  [0.82, 0.47],
  [0.77, 0.78],
  [0.48, 0.78],
  [0.18, 0.53],
];
const FLOWERY_SPAWNER_PARTICLE_WIDTH = 4;
const FLOWERY_SPAWNER_PARTICLE_HEIGHT = 8;
const RALSEI_SCALE = 1;
const RALSEI_WIDTH = 21;
const RALSEI_HEIGHT = 41;
const RALSEI_FRAME_MS = 100;
const ralseiFrameIndices = {
  down: [0, 1, 2, 3, 5],
  left: [0, 1, 2, 3, 4, 5, 6, 7],
  up: [0, 1, 2, 3],
};
const ralseiFrames = Object.fromEntries(
  Object.entries(ralseiFrameIndices).map(([direction, indices]) => [
    direction,
    indices.map((index) => {
      const frame = new Image();
      frame.src = `ralsei_frames/${direction}/frame_${String(index).padStart(2, "0")}.png`;
      return frame;
    }),
  ]),
);
const YELLOW_WIDTH = 33;
const YELLOW_HEIGHT = 74;
const YELLOW_SPEED = 62;
const YELLOW_FRAME_MS = 100;
const YELLOW_GUN_WIDTH = 105;
const YELLOW_GUN_HEIGHT = 61;
const YELLOW_BULLET_SPEED = 520;
const YELLOW_BULLET_RADIUS = 4;
const CLARK_WIDTH = 32;
const CLARK_HEIGHT = 59;
const CLARK_SPEED = 68;
const KNIFE_CLARK_WIDTH = 31;
const KNIFE_CLARK_HEIGHT = 104;
const KNIFE_CLARK_SPEED = 112;
const KNIFE_CLARK_STUCK_TIMEOUT = 3500;
const KNIFE_CLARK_STUCK_PROGRESS_DISTANCE = 18;
const yellowSprites = Object.fromEntries(
  ["up", "left", "down"].map((direction) => [
    direction,
    Array.from({ length: 4 }, (_, index) => {
      const frame = new Image();
      frame.src = `yellow_frames/${direction}/frame_${String(index).padStart(2, "0")}.png`;
      return frame;
    }),
  ]),
);
const yellowGunSprite = new Image();
yellowGunSprite.src = "uploads/yellow_gun.png";
const clarkSprite = new Image();
clarkSprite.src = "uploads/clark_stanky_leg_pixelated.png";
const knifeClarkSprite = new Image();
knifeClarkSprite.src = "uploads/clark_knife.png";
const errorLogoSprite = new Image();
errorLogoSprite.src = "uploads/icon_web_error.png";
const monsterboxInactiveSprite = new Image();
monsterboxInactiveSprite.src = "uploads/monsterbox_inactive.png";
const monsterboxActiveSprite = new Image();
monsterboxActiveSprite.src = "uploads/monsterbox_active.png";
const ralseiVoice = new Audio("txt_ral.mp3");
ralseiVoice.preload = "auto";
ralseiVoice.volume = 0.28 * audioSettings.voice;
const backgroundMusic = new Audio("uploads/Toby_Fox_-_Flower_Castle.mp3");
backgroundMusic.preload = "auto";
backgroundMusic.loop = true;
backgroundMusic.volume = audioSettings.music;

function updateAudioSettingsUI() {
  for (const [channel, control] of Object.entries(volumeControls)) {
    const value = audioSettings[channel];
    control.input.value = String(value);
    control.output.value = `${Math.round(value * 100)}%`;
    control.output.textContent = `${Math.round(value * 100)}%`;
  }
}

function setAudioVolume(channel, value) {
  audioSettings[channel] = Math.max(0, Math.min(1, Number(value)));
  if (channel === "voice") {
    ralseiVoice.volume = 0.28 * audioSettings.voice;
    for (const flowery of floweries) {
      flowery.audio.volume =
        audioSettings.voice * getFloweryVoiceVolumeFactor(flowery);
    }
  } else if (channel === "music") {
    backgroundMusic.volume = audioSettings.music;
  }
  updateAudioSettingsUI();
  saveAudioSettings();
}

updateAudioSettingsUI();
function startBackgroundMusic() {
  if (overloadSequenceActive || bladeAudioPaused || !backgroundMusic.paused) return;
  backgroundMusic.play().then(() => {
    document.removeEventListener("pointerdown", startBackgroundMusic);
    document.removeEventListener("keydown", startBackgroundMusic);
  }).catch(() => {
    // Autoplay may be blocked until the visitor interacts with the game.
  });
}

function pauseAudioForBlade() {
  bladeAudioPaused = true;
  const sceneAudio = new Set([
    backgroundMusic,
    ralseiVoice,
    ...floweries.map((flowery) => flowery.audio),
    ...liveSoundEffects,
  ]);
  const pausedStates = [...sceneAudio].map((audio) => ({
    audio,
    wasPlaying: !audio.paused && !audio.ended,
  }));
  for (const { audio } of pausedStates) audio.pause();
  return pausedStates;
}

function resumeAudioAfterBlade(pausedStates) {
  bladeAudioPaused = false;
  if (overloadSequenceActive) return;
  for (const { audio, wasPlaying } of pausedStates) {
    if (audio === backgroundMusic) {
      startBackgroundMusic();
    } else if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }
}

document.addEventListener("pointerdown", startBackgroundMusic);
document.addEventListener("keydown", startBackgroundMusic);
startBackgroundMusic();
const ralseiCarSprite = new Image();
ralseiCarSprite.src = "uploads/car_ralsei.png";
const ralseiLines = [
  "I don't like this Flowery guy.",
  "Why are there so many of you!?",
  "Kris, can we assassinate Flowery?",
  "Please stop following me. I am begging you.",
  "I miss when the Dark World was peaceful.",
  "WHAT KIND OF STUPID DARK WORLD IS THIS!?",
  "Get away from me, you weird flower.",
  "Kris, do you think Flowery has a tax number?",
];
const ralseiPlayerLines = [
  "hey, you!",
  "there's too many of these floweries here, im going insane!!",
  "...",
  "you know what...",
  "im grabbing my car.",
];
let ralseiNextAt = performance.now() + 6500 + Math.random() * 8000;
let activeRalsei = null;
let flowerAnnoyUntil = 0;
let nextFlowerAnnoyAt = Number.POSITIVE_INFINITY;
const poseFrames = new Map();
const carSprite = new Image();
carSprite.src = "uploads/car.png";
const lampSprite = new Image();
lampSprite.src = "uploads/folwery_lamp.png";
const flowerySpawnerSprite = new Image();
flowerySpawnerSprite.src = "uploads/flowery_spawner.png";
const flowerySpawnerParticleSprite = new Image();
flowerySpawnerParticleSprite.src = "uploads/flowery_spawner_spawn_particle.png";
const entranceCanvas = document.createElement("canvas");
entranceCanvas.width = SPRITE_WIDTH;
entranceCanvas.height = SPRITE_HEIGHT;
const entranceContext = entranceCanvas.getContext("2d");
const splats = [];
function shiftWorldObject(object, offsetX, offsetY) {
  if (!object) return;
  if (Number.isFinite(object.x)) object.x += offsetX;
  if (Number.isFinite(object.y)) object.y += offsetY;
  if (Number.isFinite(object.targetX)) object.targetX += offsetX;
  if (Number.isFinite(object.targetY)) object.targetY += offsetY;
}

function expandSceneAroundCurrentView() {
  const offsetX = getViewWidth() / 2;
  const offsetY = getViewHeight() / 2;
  const pixelOffsetX = Math.round(offsetX);
  const pixelOffsetY = Math.round(offsetY);
  sceneOriginX += offsetX;
  sceneOriginY += offsetY;
  for (const flowery of floweries) shiftWorldObject(flowery, offsetX, offsetY);
  for (const car of cars) shiftWorldObject(car, offsetX, offsetY);
  for (const car of ralseiCars) shiftWorldObject(car, offsetX, offsetY);
  for (const spawner of extraFlowerSpawners) placeFlowerySpawner(spawner);
  for (const particle of spawnerParticles) shiftWorldObject(particle, offsetX, offsetY);
  for (const bullet of yellowBullets) shiftWorldObject(bullet, offsetX, offsetY);
  for (const explosion of explosions) shiftWorldObject(explosion, offsetX, offsetY);
  for (const splat of splats) {
    for (const particle of splat.particles) {
      shiftWorldObject(particle, offsetX, offsetY);
      particle.groundY += offsetY;
    }
  }
  for (const group of floweryGroups) shiftWorldObject(group, offsetX, offsetY);
  shiftWorldObject(activeRalsei, offsetX, offsetY);
  shiftWorldObject(errorLogo, offsetX, offsetY);
  if (errorTrailPixels.size > 0) {
    const shiftedPixels = [];
    for (const pixel of errorTrailPixels.values()) {
      pixel.x = Math.floor((pixel.x + pixelOffsetX) / ERROR_TRAIL_PIXEL_SIZE) *
        ERROR_TRAIL_PIXEL_SIZE;
      pixel.y = Math.floor((pixel.y + pixelOffsetY) / ERROR_TRAIL_PIXEL_SIZE) *
        ERROR_TRAIL_PIXEL_SIZE;
      shiftedPixels.push([`${pixel.x},${pixel.y}`, pixel]);
    }
    errorTrailPixels.clear();
    for (const [key, pixel] of shiftedPixels) errorTrailPixels.set(key, pixel);
  }
  shiftWorldObject(yellowCompanion, offsetX, offsetY);
  if (yellowCompanion) {
    yellowCompanion.gunX += offsetX;
    yellowCompanion.gunY += offsetY;
    yellowCompanion.targetGunX += offsetX;
    yellowCompanion.targetGunY += offsetY;
  }
  shiftWorldObject(clarkCompanion, offsetX, offsetY);
  shiftWorldObject(knifeClarkCompanion, offsetX, offsetY);
  cameraX += offsetX;
  cameraY += offsetY;
  clampCamera();
  updateSceneBackground();
}

const splatParticleSprite = new Image();
splatParticleSprite.src = "uploads/flowery_splat_particle.png";
const explosionFrames = Array.from({ length: EXPLOSION_FRAME_COUNT }, (_, index) => {
  const frame = new Image();
  frame.src = `explosion_frames/frame_${String(index).padStart(2, "0")}.png`;
  return frame;
});
const hitVoiceClips = [
  "uploads/flowery_AAAAAAHHHH.wav",
  "English/snd_flowery_voiceclip_theyre_eating_my_flesh.wav",
  "English/snd_flowery_voiceclip_goodbye.wav",
  "English/snd_flowery_voiceclip_im_falling.wav",
  "English/snd_flowery_voiceclip_calling_for_help.wav",
];

function getPoseFrame(index) {
  if (!poseFrames.has(index)) {
    const frame = new Image();
    frame.src = `flowery_frames/frame_${String(index).padStart(2, "0")}.png`;
    poseFrames.set(index, frame);
  }
  return poseFrames.get(index);
}

function startAudioGraph() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    if (!audioContext) {
      audioContext = new AudioContextClass();
      limiter = audioContext.createDynamicsCompressor();
      limiter.threshold.value = -6;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.12;

      outputGain = audioContext.createGain();
      outputGain.gain.value = 0.9;
      limiter.connect(outputGain);
      outputGain.connect(audioContext.destination);
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  } catch (error) {
    console.warn("Flowery audio limiter could not start:", error);
    audioContext = null;
    limiter = null;
    outputGain = null;
  }
}

function connectFloweryAudio(flowery) {
  if (!audioContext || flowery.audioSource) return;
  try {
    flowery.audioSource = audioContext.createMediaElementSource(flowery.audio);
    flowery.audioSource.connect(limiter);
  } catch (error) {
    console.warn("Flowery audio could not connect to the limiter:", error);
  }
}

function disconnectFloweryAudio(flowery) {
  if (!flowery.audioSource) return;
  flowery.audioSource.disconnect();
  flowery.audioSource = null;
}

function handleFloweryVoiceEnd(flowery) {
  flowery.audioHasClip = false;
  if (!flowery.silenced) scheduleNextClip(flowery);
}

function resizeCanvas() {
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const previousWorldCenterX =
    (canvas.width / pixelRatio) * (biggerSceneOwned ? 1 : 0.5);
  const previousWorldCenterY =
    (canvas.height / pixelRatio) * (biggerSceneOwned ? 1 : 0.5);
  canvas.width = Math.round(getViewWidth() * pixelRatio);
  canvas.height = Math.round(getViewHeight() * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingEnabled = false;
  const worldWidth = getWorldWidth();
  const worldHeight = getWorldHeight();
  if (errorLogo) {
    errorLogo.x = Math.min(errorLogo.x, Math.max(0, worldWidth - ERROR_LOGO_SIZE));
    errorLogo.y = Math.min(errorLogo.y, Math.max(0, worldHeight - ERROR_LOGO_SIZE));
  }
  for (const flowery of floweries) {
    if (flowery.entering) {
      const entranceOffset = flowery.x - (previousWorldCenterX - SPRITE_WIDTH - 4);
      flowery.x = worldWidth / 2 - SPRITE_WIDTH - 4 + entranceOffset;
      flowery.y = (worldHeight - SPRITE_HEIGHT) / 2;
    } else {
      flowery.x = Math.max(0, Math.min(flowery.x, worldWidth - SPRITE_WIDTH));
      flowery.y = Math.max(0, Math.min(flowery.y, worldHeight - SPRITE_HEIGHT));
    }
  }
  for (const car of cars) {
    car.x = Math.max(0, Math.min(car.x, worldWidth - CAR_WIDTH));
    car.y = Math.max(0, Math.min(car.y, worldHeight - CAR_HEIGHT));
  }
  for (const spawner of extraFlowerSpawners) placeFlowerySpawner(spawner);
  if (yellowCompanion) {
    yellowCompanion.x = Math.max(0, Math.min(yellowCompanion.x, worldWidth - YELLOW_WIDTH));
    yellowCompanion.y = Math.max(0, Math.min(yellowCompanion.y, worldHeight - YELLOW_HEIGHT));
  }
  if (clarkCompanion) {
    clarkCompanion.x = Math.max(0, Math.min(clarkCompanion.x, worldWidth - CLARK_WIDTH));
    clarkCompanion.y = Math.max(0, Math.min(clarkCompanion.y, worldHeight - CLARK_HEIGHT));
  }
  if (knifeClarkCompanion) {
    knifeClarkCompanion.x = Math.max(
      0,
      Math.min(knifeClarkCompanion.x, worldWidth - KNIFE_CLARK_WIDTH),
    );
    knifeClarkCompanion.y = Math.max(
      0,
      Math.min(knifeClarkCompanion.y, worldHeight - KNIFE_CLARK_HEIGHT),
    );
  }
  clampCamera();
  updateSceneBackground();
}

function setRalseiHeading(ralsei, heading) {
  if (ralsei.heading === heading) return;
  ralsei.heading = heading;
  ralsei.frameIndex = 0;
  ralsei.frameElapsed = 0;
}

function moveRalseiToward(ralsei, targetX, targetY, delta, stopDistance = 2) {
  const dx = targetX - ralsei.x;
  const dy = targetY - ralsei.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= stopDistance) {
    ralsei.moving = false;
    return true;
  }
  if (distance <= ralsei.speed * delta) {
    ralsei.x = targetX;
    ralsei.y = targetY;
    ralsei.moving = false;
    return true;
  }

  let moveX = dx / distance;
  let moveY = dy / distance;
  const desiredX = moveX;
  const desiredY = moveY;
  const startX = ralsei.x + RALSEI_WIDTH / 2;
  const startY = ralsei.y + RALSEI_HEIGHT / 2;
  const clearance = SPRITE_WIDTH / 2 + RALSEI_WIDTH / 2 + 20;

  if (ralsei.mode !== "chasing") {
    for (const flowery of floweries) {
      if (flowery.entering || flowery.flung || flowery.ralseiHeld) continue;
      const floweryX = flowery.x + SPRITE_WIDTH / 2;
      const floweryY = flowery.y + SPRITE_HEIGHT / 2;
      const relativeX = floweryX - startX;
      const relativeY = floweryY - startY;
      const projection = relativeX * desiredX + relativeY * desiredY;
      const nearestX = startX + desiredX * Math.max(0, Math.min(distance, projection));
      const nearestY = startY + desiredY * Math.max(0, Math.min(distance, projection));
      const pathX = floweryX - nearestX;
      const pathY = floweryY - nearestY;
      const pathDistance = Math.hypot(pathX, pathY);

      if (projection > 0 && projection < distance && pathDistance < clearance) {
        const cross = desiredX * relativeY - desiredY * relativeX;
        const side = cross > 0 ? -1 : 1;
        const strength = ((clearance - pathDistance) / clearance) * 2.1;
        moveX += -desiredY * side * strength;
        moveY += desiredX * side * strength;
      }

      const awayX = startX - floweryX;
      const awayY = startY - floweryY;
      const awayDistance = Math.hypot(awayX, awayY);
      if (awayDistance > 0 && awayDistance < clearance + 12) {
        const strength = ((clearance + 12 - awayDistance) / (clearance + 12)) * 2.6;
        moveX += (awayX / awayDistance) * strength;
        moveY += (awayY / awayDistance) * strength;
      }
    }
  }

  const moveLength = Math.hypot(moveX, moveY) || 1;
  moveX /= moveLength;
  moveY /= moveLength;
  setRalseiHeading(ralsei, Math.abs(moveX) >= Math.abs(moveY)
    ? (moveX >= 0 ? "right" : "left")
    : (moveY >= 0 ? "down" : "up"));
  ralsei.x += moveX * ralsei.speed * delta;
  ralsei.y += moveY * ralsei.speed * delta;
  ralsei.moving = true;
  return false;
}

function chooseRalseiWanderTarget(ralsei, width, height) {
  const maxX = Math.max(0, width - RALSEI_WIDTH);
  const maxY = Math.max(0, height - RALSEI_HEIGHT);
  let targetX = ralsei.x;
  let targetY = ralsei.y;
  const horizontal = Math.random() < 0.5 || maxY < 24;

  if (horizontal && maxX > 12) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const distance = 70 + Math.random() * Math.min(210, maxX);
    targetX = Math.max(0, Math.min(maxX, ralsei.x + direction * distance));
  } else if (maxY > 12) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const distance = 65 + Math.random() * Math.min(190, maxY);
    targetY = Math.max(0, Math.min(maxY, ralsei.y + direction * distance));
  } else if (maxX > 12) {
    targetX = Math.random() * maxX;
  }

  if (Math.abs(targetX - ralsei.x) + Math.abs(targetY - ralsei.y) < 12) {
    targetX = Math.random() * maxX;
    targetY = Math.random() * maxY;
  }
  ralsei.targetX = targetX;
  ralsei.targetY = targetY;
  ralsei.mode = "wandering";
  ralsei.moving = false;
}

function addRalsei(width, height, now) {
  const entry = ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)];
  const heading = { left: "right", right: "left", top: "down", bottom: "up" }[entry];
  const maxX = Math.max(0, width - RALSEI_WIDTH);
  const maxY = Math.max(0, height - RALSEI_HEIGHT);
  const ralsei = {
    x: entry === "left" ? -RALSEI_WIDTH : entry === "right" ? width : Math.random() * maxX,
    y: entry === "top" ? -RALSEI_HEIGHT : entry === "bottom" ? height : Math.random() * maxY,
    targetX: 0,
    targetY: 0,
    speed: 110 + Math.random() * 35,
    heading,
    frameIndex: 0,
    frameElapsed: 0,
    mode: "entering",
    moving: true,
    line: "",
    typeIndex: 0,
    nextTypeAt: 0,
    finishTalkAt: 0,
    nextTalkAt: now + 1100 + Math.random() * 2600,
    nextMoveAt: now,
    sceneTryAt: now + 5500 + Math.random() * 5500,
    sceneAttempted: false,
    sceneFlowery: null,
    playerSpeechAttempted: false,
    playerSpeechLineIndex: 0,
    leaveAt: now + 17000 + Math.random() * 13000,
    shakeStartedAt: 0,
  };

  if (entry === "left" || entry === "right") {
    ralsei.targetX = Math.max(0, Math.min(maxX, width * (entry === "left" ? 0.35 : 0.65) - RALSEI_WIDTH / 2));
    ralsei.targetY = ralsei.y;
  } else {
    ralsei.targetX = ralsei.x;
    ralsei.targetY = Math.max(0, Math.min(maxY, height * (entry === "top" ? 0.4 : 0.6) - RALSEI_HEIGHT / 2));
  }

  activeRalsei = ralsei;
  nextFlowerAnnoyAt = now + 4500 + Math.random() * 4500;
  flowerAnnoyUntil = 0;
  ralseiLine.hidden = true;
}

function startRalseiDialogue(ralsei, now) {
  ralsei.mode = "talking";
  ralsei.moving = false;
  ralsei.line = ralseiLines[Math.floor(Math.random() * ralseiLines.length)];
  ralsei.typeIndex = 0;
  ralsei.nextTypeAt = now;
  ralsei.finishTalkAt = 0;
  ralseiLine.textContent = "";
  ralseiLine.hidden = false;
  ralseiLine.classList.remove("is-important");
}

function findLeastFloweriesSpot(width, height) {
  const maxX = Math.max(0, width - RALSEI_WIDTH);
  const maxY = Math.max(0, height - RALSEI_HEIGHT);
  const candidates = [];
  const columns = Math.max(3, Math.min(8, Math.ceil(width / 180)));
  const rows = Math.max(3, Math.min(6, Math.ceil(height / 150)));
  const obstacles = floweries.filter(
    (flowery) => !flowery.entering && !flowery.flung && !flowery.ralseiHeld,
  );

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = maxX * ((column + 0.5) / columns);
      const y = maxY * ((row + 0.5) / rows);
      const count = obstacles.reduce((total, flowery) => {
        const distance = Math.hypot(
          flowery.x + SPRITE_WIDTH / 2 - (x + RALSEI_WIDTH / 2),
          flowery.y + SPRITE_HEIGHT / 2 - (y + RALSEI_HEIGHT / 2),
        );
        return total + (distance < 145 ? 1 : 0);
      }, 0);
      const nearControls = x < 230 && y > height - 150;
      candidates.push({ x, y, score: count + (nearControls ? 1 : 0) });
    }
  }

  const bestScore = Math.min(...candidates.map((candidate) => candidate.score));
  const bestSpots = candidates.filter((candidate) => candidate.score === bestScore);
  return bestSpots[Math.floor(Math.random() * bestSpots.length)];
}

function startRalseiPlayerLine(ralsei, lineIndex, now) {
  ralsei.mode = "player-speech";
  ralsei.moving = false;
  ralsei.line = ralseiPlayerLines[lineIndex];
  ralsei.typeIndex = 0;
  ralsei.nextTypeAt = now;
  ralsei.finishTalkAt = 0;
  ralseiLine.textContent = "";
  ralseiLine.hidden = false;
  ralseiLine.classList.add("is-important");
}

function startRalseiPlayerEvent(ralsei, width, height) {
  const spot = findLeastFloweriesSpot(width, height);
  ralsei.mode = "seeking-player";
  ralsei.targetX = spot.x;
  ralsei.targetY = spot.y;
  ralsei.moving = false;
  ralsei.speed = 118;
  ralsei.playerSpeechLineIndex = 0;
  flowerAnnoyUntil = 0;
  ralseiLine.hidden = true;
}

function playRalseiBlip() {
  if (bladeAudioPaused) return;
  try {
    ralseiVoice.currentTime = 0;
    ralseiVoice.play().catch(() => {});
  } catch {
    // Browsers can block the text sound until the visitor interacts with the page.
  }
}

function getFloweryVoiceVolumeFactor(flowery) {
  const screenX =
    (flowery.x + SPRITE_WIDTH / 2 - cameraX) * sceneZoom;
  const screenY =
    (flowery.y + SPRITE_HEIGHT / 2 - cameraY) * sceneZoom;
  const distance = Math.hypot(
    screenX - getViewWidth() / 2,
    screenY - getViewHeight() / 2,
  );
  return Math.max(0, 1 - distance / FLOWERY_VOICE_AUDIBLE_RADIUS);
}

function isFloweryVoiceAudible(flowery) {
  return getFloweryVoiceVolumeFactor(flowery) > 0;
}

function updateFloweryVoiceAudibility(flowery) {
  if (flowery.silenced || bladeAudioPaused) return;
  const volumeFactor = getFloweryVoiceVolumeFactor(flowery);
  flowery.audio.volume = audioSettings.voice * volumeFactor;
  if (volumeFactor <= 0) {
    clearTimeout(flowery.voiceTimer);
    flowery.voiceTimer = null;
    if (!flowery.audio.paused) {
      flowery.distanceMuted = true;
      flowery.audio.pause();
    }
    return;
  }

  if (flowery.distanceMuted && flowery.audioHasClip) {
    flowery.distanceMuted = false;
    flowery.audio.play().catch(() => {});
  } else if (!flowery.audioHasClip && flowery.voiceTimer === null) {
    flowery.distanceMuted = false;
    playRandomClip(flowery);
  }
}

function startRalseiScene(ralsei, flowery) {
  flowery.ralseiHeld = true;
  flowery.vx = 0;
  flowery.vy = 0;
  ralsei.sceneFlowery = flowery;
  ralsei.mode = "chasing";
  ralsei.moving = true;
  ralseiLine.hidden = true;
}

function launchFloweryFromRalsei(ralsei, now) {
  const flowery = ralsei.sceneFlowery;
  if (floweries.includes(flowery)) {
    const floweryX = flowery.x + SPRITE_WIDTH / 2;
    const floweryY = flowery.y + SPRITE_HEIGHT / 2;
    let awayX = floweryX - (ralsei.x + RALSEI_WIDTH / 2);
    let awayY = floweryY - (ralsei.y + RALSEI_HEIGHT / 2);
    let distance = Math.hypot(awayX, awayY);
    if (distance < 0.001) {
      awayX = Math.random() - 0.5;
      awayY = Math.random() - 0.5;
      distance = Math.hypot(awayX, awayY) || 1;
    }

    const flingSpeed = 700 + Math.random() * 180;
    recordFloweryDeath(flowery, "ralsei");
    flowery.ralseiHeld = false;
    flowery.flung = true;
    flowery.nextTurnAt = Number.POSITIVE_INFINITY;
    flowery.vx = (awayX / distance) * flingSpeed;
    flowery.vy = (awayY / distance) * flingSpeed;
    flowery.rotation = 0;
    flowery.spin = (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 9);
    flowery.hitCooldownUntil = now + 900;
    playHitVoiceClip(flowery);
    addExplosion(floweryX, floweryY, now);
    playExplosionSound();
  }

  ralsei.sceneFlowery = null;
  ralsei.mode = "wandering";
  ralsei.moving = false;
  ralsei.nextMoveAt = now + 450;
  ralsei.nextTalkAt = now + 3500 + Math.random() * 3500;
}

function getClosestAnnoyingFlowery(ralsei) {
  let closest = null;
  let closestDistance = Infinity;
  for (const flowery of floweries) {
    if (flowery.entering || flowery.flung || flowery.ralseiHeld) continue;
    const dx = flowery.x + SPRITE_WIDTH / 2 - (ralsei.x + RALSEI_WIDTH / 2);
    const dy = flowery.y + SPRITE_HEIGHT / 2 - (ralsei.y + RALSEI_HEIGHT / 2);
    const distance = Math.hypot(dx, dy);
    if (distance < closestDistance) {
      closest = flowery;
      closestDistance = distance;
    }
  }
  return closest ? { flowery: closest, distance: closestDistance } : null;
}

function beginRalseiEscape(ralsei, now) {
  ralsei.resumeMode = ralsei.mode;
  ralsei.escapeStartedAt = now;
  ralsei.mode = "escaping";
  ralsei.moving = true;
  ralseiLine.hidden = true;
}

function finishRalseiEscape(ralsei, now) {
  const pausedFor = now - ralsei.escapeStartedAt;
  ralsei.mode = ralsei.resumeMode || "wandering";
  ralsei.resumeMode = null;
  ralsei.moving = ralsei.mode === "entering" || ralsei.mode === "chasing" || ralsei.mode === "leaving";
  if (ralsei.mode === "talking" || ralsei.mode === "player-speech") {
    ralsei.nextTypeAt += pausedFor;
    if (ralsei.finishTalkAt) ralsei.finishTalkAt += pausedFor;
    ralseiLine.hidden = false;
  } else if (ralsei.mode === "wandering") {
    ralsei.nextMoveAt = now + 200;
  }
}

function updateRalseiEscape(ralsei, now, delta, width, height) {
  const nearest = getClosestAnnoyingFlowery(ralsei);
  if (!nearest || nearest.distance >= 125) {
    finishRalseiEscape(ralsei, now);
    return;
  }

  const flowery = nearest.flowery;
  const floweryX = flowery.x + SPRITE_WIDTH / 2;
  const floweryY = flowery.y + SPRITE_HEIGHT / 2;
  let awayX = ralsei.x + RALSEI_WIDTH / 2 - floweryX;
  let awayY = ralsei.y + RALSEI_HEIGHT / 2 - floweryY;
  let distance = Math.hypot(awayX, awayY) || 1;
  const maxX = Math.max(0, width - RALSEI_WIDTH);
  const maxY = Math.max(0, height - RALSEI_HEIGHT);
  let targetX = Math.max(0, Math.min(maxX, ralsei.x + (awayX / distance) * 150));
  let targetY = Math.max(0, Math.min(maxY, ralsei.y + (awayY / distance) * 150));

  if (Math.hypot(targetX - ralsei.x, targetY - ralsei.y) < 12) {
    const options = [
      [-150, 0], [150, 0], [0, -150], [0, 150],
      [-110, -110], [110, -110], [-110, 110], [110, 110],
    ];
    let bestDistance = nearest.distance;
    for (const [offsetX, offsetY] of options) {
      const optionX = Math.max(0, Math.min(maxX, ralsei.x + offsetX));
      const optionY = Math.max(0, Math.min(maxY, ralsei.y + offsetY));
      const optionDistance = Math.hypot(
        optionX + RALSEI_WIDTH / 2 - floweryX,
        optionY + RALSEI_HEIGHT / 2 - floweryY,
      );
      if (optionDistance > bestDistance) {
        targetX = optionX;
        targetY = optionY;
        bestDistance = optionDistance;
      }
    }
  }

  ralsei.speed = 155;
  if (Math.hypot(targetX - ralsei.x, targetY - ralsei.y) < 8) {
    finishRalseiEscape(ralsei, now);
    return;
  }
  moveRalseiToward(ralsei, targetX, targetY, delta);
}

function updateRalsei(now, delta, width, height) {
  if (!activeRalsei) {
    if (now >= ralseiNextAt) addRalsei(width, height, now);
    return;
  }

  const ralsei = activeRalsei;
  if (
    now >= nextFlowerAnnoyAt &&
    !["entering", "leaving", "chasing", "shaking", "escaping"].includes(ralsei.mode)
  ) {
    flowerAnnoyUntil = now + 5200 + Math.random() * 2600;
    nextFlowerAnnoyAt = now + 14000 + Math.random() * 10000;
  }

  if (!["chasing", "shaking", "escaping", "leaving", "leaving-for-car", "player-speech"].includes(ralsei.mode)) {
    const nearest = getClosestAnnoyingFlowery(ralsei);
    if (nearest && nearest.distance < 68) beginRalseiEscape(ralsei, now);
  }

  const animationDirection = ralsei.heading === "left" || ralsei.heading === "right"
    ? "left"
    : ralsei.heading;
  const animation = ralseiFrames[animationDirection];
  if (ralsei.moving) {
    ralsei.frameElapsed += delta * 1000;
    while (ralsei.frameElapsed >= RALSEI_FRAME_MS) {
      ralsei.frameElapsed -= RALSEI_FRAME_MS;
      ralsei.frameIndex = (ralsei.frameIndex + 1) % animation.length;
    }
  } else {
    ralsei.frameIndex = 0;
    ralsei.frameElapsed = 0;
  }

  if (ralsei.mode === "entering") {
    if (moveRalseiToward(ralsei, ralsei.targetX, ralsei.targetY, delta)) {
      ralsei.mode = "wandering";
      ralsei.nextTalkAt = now + 700 + Math.random() * 2100;
      ralsei.nextMoveAt = now + 150;
    }
  } else if (ralsei.mode === "talking" || ralsei.mode === "player-speech") {
    while (ralsei.typeIndex < ralsei.line.length && now >= ralsei.nextTypeAt) {
      const character = ralsei.line[ralsei.typeIndex];
      ralseiLine.textContent += character;
      if (character !== " " && ralsei.typeIndex % 2 === 0) playRalseiBlip();
      ralsei.typeIndex += 1;
      ralsei.nextTypeAt += 46;
    }
    if (ralsei.typeIndex >= ralsei.line.length) {
      if (!ralsei.finishTalkAt) ralsei.finishTalkAt = now + 1150;
      if (now >= ralsei.finishTalkAt) {
        if (ralsei.mode === "player-speech") {
          ralsei.playerSpeechLineIndex += 1;
          if (ralsei.playerSpeechLineIndex < ralseiPlayerLines.length) {
            startRalseiPlayerLine(ralsei, ralsei.playerSpeechLineIndex, now);
          } else {
            ralseiLine.hidden = true;
            ralseiLine.classList.remove("is-important");
            ralsei.mode = "leaving-for-car";
            const side = Math.random() < 0.5 ? "left" : "right";
            setRalseiHeading(ralsei, side);
            ralsei.speed = 150;
            ralsei.moving = true;
          }
        } else {
          ralseiLine.hidden = true;
          ralsei.mode = "wandering";
          ralsei.nextTalkAt = now + 3500 + Math.random() * 5500;
          ralsei.nextMoveAt = now + 200;
        }
      }
    }
  } else if (ralsei.mode === "seeking-player") {
    if (moveRalseiToward(ralsei, ralsei.targetX, ralsei.targetY, delta)) {
      startRalseiPlayerLine(ralsei, 0, now);
    }
  } else if (ralsei.mode === "wandering") {
    if (!ralsei.sceneAttempted && now >= ralsei.sceneTryAt) {
      const eligibleFloweries = floweries.filter(
        (flowery) => !flowery.entering && !flowery.flung && !flowery.ralseiHeld,
      );
      if (eligibleFloweries.length) {
        ralsei.sceneAttempted = true;
        if (Math.random() < 0.55) {
          const target = eligibleFloweries[Math.floor(Math.random() * eligibleFloweries.length)];
          startRalseiScene(ralsei, target);
        }
      } else {
        ralsei.sceneTryAt = now + 1700;
      }
    }

    if (ralsei.mode === "wandering" && !ralsei.playerSpeechAttempted) {
      const visibleFloweryCount = floweries.filter((flowery) =>
        isWorldRectVisible(flowery.x, flowery.y, SPRITE_WIDTH, SPRITE_HEIGHT),
      ).length;
      if (visibleFloweryCount > getFloweryLimit()) {
        ralsei.playerSpeechAttempted = true;
        startRalseiPlayerEvent(ralsei, width, height);
      }
    }

    if (ralsei.mode === "wandering" && now >= ralsei.leaveAt) {
      const exits = ["left", "right", "up", "down"];
      const heading = exits[Math.floor(Math.random() * exits.length)];
      setRalseiHeading(ralsei, heading);
      ralsei.mode = "leaving";
      ralsei.speed = 150;
      ralsei.moving = true;
      ralseiLine.hidden = true;
    } else if (ralsei.mode === "wandering" && now >= ralsei.nextTalkAt) {
      startRalseiDialogue(ralsei, now);
    } else if (ralsei.mode === "wandering") {
      if (!ralsei.moving && now >= ralsei.nextMoveAt) {
        chooseRalseiWanderTarget(ralsei, width, height);
      }
      if (ralsei.moving && moveRalseiToward(ralsei, ralsei.targetX, ralsei.targetY, delta)) {
        ralsei.nextMoveAt = now + 280 + Math.random() * 650;
      }
    }
  } else if (ralsei.mode === "chasing") {
    const target = ralsei.sceneFlowery;
    if (!floweries.includes(target)) {
      ralsei.sceneFlowery = null;
      ralsei.mode = "wandering";
      ralsei.nextMoveAt = now;
    } else {
      const targetX = target.x + SPRITE_WIDTH / 2 - RALSEI_WIDTH / 2;
      const targetY = target.y + SPRITE_HEIGHT / 2 - RALSEI_HEIGHT / 2;
      if (moveRalseiToward(ralsei, targetX, targetY, delta, 45)) {
        ralsei.mode = "shaking";
        ralsei.shakeStartedAt = now;
      }
    }
  } else if (ralsei.mode === "shaking") {
    if (now - ralsei.shakeStartedAt >= 1200) launchFloweryFromRalsei(ralsei, now);
  } else if (ralsei.mode === "escaping") {
    updateRalseiEscape(ralsei, now, delta, width, height);
  } else if (ralsei.mode === "leaving" || ralsei.mode === "leaving-for-car") {
    const direction = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    }[ralsei.heading];
    ralsei.x += direction[0] * ralsei.speed * delta;
    ralsei.y += direction[1] * ralsei.speed * delta;
    if (
      ralsei.x + RALSEI_WIDTH < 0 ||
      ralsei.x > width ||
      ralsei.y + RALSEI_HEIGHT < 0 ||
      ralsei.y > height
    ) {
      if (ralsei.mode === "leaving-for-car") {
        addRalseiCar(ralsei.heading, ralsei.y, width, height);
      }
      activeRalsei = null;
      ralseiNextAt = now + 18000 + Math.random() * 22000;
      ralseiLine.hidden = true;
      ralseiLine.classList.remove("is-important");
      return;
    }
  }

  if (!ralsei.moving) {
    ralsei.frameIndex = 0;
    ralsei.frameElapsed = 0;
  }

  if (ralsei.mode === "talking" || ralsei.mode === "player-speech") {
    const lineWidth = ralseiLine.offsetWidth;
    const lineHeight = ralseiLine.offsetHeight;
    const screenX = (ralsei.x + RALSEI_WIDTH / 2 - cameraX) * sceneZoom;
    const screenY = (ralsei.y - cameraY) * sceneZoom;
    const left = Math.max(
      lineWidth / 2 + 8,
      Math.min(getViewWidth() - lineWidth / 2 - 8, screenX),
    );
    const above = screenY - lineHeight - 12;
    ralseiLine.style.left = `${left}px`;
    ralseiLine.style.top = `${
      above >= 8
        ? above
        : Math.min(getViewHeight() - lineHeight - 8, screenY + RALSEI_HEIGHT * sceneZoom + 12)
    }px`;
  }

  const currentAnimation = ralseiFrames[
    ralsei.heading === "left" || ralsei.heading === "right" ? "left" : ralsei.heading
  ];
  const frame = currentAnimation[ralsei.frameIndex];
  if (!frame.complete || !frame.naturalWidth) return;
  const nativeWidth = frame.naturalWidth * RALSEI_SCALE;
  const nativeHeight = frame.naturalHeight * RALSEI_SCALE;
  const shakeX = ralsei.mode === "shaking" ? Math.sin(now * 0.12) * 5 : 0;
  const shakeY = ralsei.mode === "shaking" ? Math.cos(now * 0.15) * 4 : 0;
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const x = Math.round((ralsei.x + RALSEI_WIDTH / 2 + shakeX) * pixelRatio) / pixelRatio;
  const y = Math.round((ralsei.y + shakeY) * pixelRatio) / pixelRatio;
  const imageY = y + (RALSEI_HEIGHT - nativeHeight) / 2;

  drawPixelShadow(
    ralsei.x + RALSEI_WIDTH / 2,
    ralsei.y + RALSEI_HEIGHT - 2,
    22,
    8,
    0.42,
  );
  context.save();
  if (ralsei.heading === "left") {
    context.translate(x, 0);
    context.scale(-1, 1);
    context.drawImage(frame, -nativeWidth / 2, imageY, nativeWidth, nativeHeight);
  } else {
    context.drawImage(frame, x - nativeWidth / 2, imageY, nativeWidth, nativeHeight);
  }
  context.restore();
}

function addFlowerySpawner(index = extraFlowerSpawners.length) {
  const now = performance.now();
  const spawner = {
    index,
    xRatio: 0,
    yRatio: 0,
    x: 0,
    y: 0,
    nextSpawnAt: now + 1250 + Math.random() * 650,
  };
  placeFlowerySpawner(spawner);
  extraFlowerSpawners.push(spawner);
}

function spawnSpawnerParticles(x, y, now) {
  for (let index = 0; index < 10; index += 1) {
    const angle = -Math.PI + Math.random() * Math.PI;
    const speed = 26 + Math.random() * 58;
    spawnerParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 12,
      age: 0,
      lifetime: 500 + Math.random() * 220,
      startedAt: now,
    });
  }
}

function spawnMonsterboxBatch(now) {
  const rate = getMonsterboxRate();
  playSoundEffect("uploads/boss.wav", 1);
  for (const box of getMonsterboxPositions()) {
    const centerX = box.x + MONSTERBOX_SIZE / 2;
    const centerY = box.y + MONSTERBOX_SIZE / 2;
    for (let index = 0; index < rate.count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 52 + Math.random() * 58;
      spawnerParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 24,
        age: 0,
        lifetime: 550 + Math.random() * 420,
        startedAt: now,
        turnsIntoFlowery: true,
      });
    }
  }
}

function updateMonsterbox(now) {
  if (!hasMonsterboxes() || now < monsterboxNextSpawnAt) return;
  spawnMonsterboxBatch(now);
  monsterboxNextSpawnAt = now + getMonsterboxInterval();
}

function drawMonsterbox(now) {
  if (!hasMonsterboxes()) return;
  const sprite = monsterboxInactive ? monsterboxInactiveSprite : monsterboxActiveSprite;
  const barWidth = 48;
  const barHeight = 2;
  const interval = getMonsterboxInterval();
  const progress = Math.max(
    0,
    Math.min(1, 1 - (monsterboxNextSpawnAt - now) / interval),
  );
  for (const position of getMonsterboxPositions()) {
    const x = Math.round(position.x);
    const y = Math.round(position.y);
    if (sprite.complete && sprite.naturalWidth) {
      context.drawImage(sprite, x, y, MONSTERBOX_SIZE, MONSTERBOX_SIZE);
    }
    const barX = Math.round(x + (MONSTERBOX_SIZE - barWidth) / 2);
    const barY = y - 5;
    context.fillStyle = "#000";
    context.fillRect(barX, barY, barWidth, barHeight);
    context.fillStyle = "#ff6507";
    context.fillRect(barX, barY, Math.round(barWidth * progress), barHeight);
  }
}

function addFlowery(spawner = null, spawnPoint = null) {
  const worldWidth = getWorldWidth();
  const worldHeight = getWorldHeight();
  const maxX = Math.max(0, worldWidth - SPRITE_WIDTH);
  const maxY = Math.max(0, worldHeight - SPRITE_HEIGHT);
  const entranceX = getLampX() - SPRITE_WIDTH - 4;
  const now = performance.now();
  const fromSpawner = Boolean(spawner || spawnPoint);
  const spawnX = spawner
    ? spawner.x + (FLOWERY_SPAWNER_SIZE - SPRITE_WIDTH) / 2
    : spawnPoint
      ? Math.max(0, Math.min(maxX, spawnPoint.x))
      : Math.max(0, Math.min(maxX, entranceX));
  const spawnY = spawner
    ? spawner.y + (FLOWERY_SPAWNER_SIZE - SPRITE_HEIGHT) / 2
    : spawnPoint
      ? Math.max(0, Math.min(maxY, spawnPoint.y))
      : Math.max(0, Math.min(maxY, getLampY() - SPRITE_HEIGHT / 2));
  const driftAngle = Math.random() * Math.PI * 2;
  const driftSpeed = 18 + Math.random() * 34;

  const flowery = {
    x: spawnX,
    y: spawnY,
    vx: fromSpawner ? Math.cos(driftAngle) * driftSpeed : 92,
    vy: fromSpawner ? Math.sin(driftAngle) * driftSpeed : 0,
    entering: !fromSpawner,
    frame: Math.floor(Math.random() * FLOWERY_FRAME_COUNT),
    nextPoseAt: 0,
    nextTurnAt: fromSpawner ? now + 900 + Math.random() * 1800 : 0,
    lastClip: -1,
    voiceTimer: null,
    audioHasClip: false,
    distanceMuted: false,
    hitCooldownUntil: 0,
    flung: false,
    ralseiHeld: false,
    socialGroupId: null,
    talkingUntil: 0,
    sourceSpawner: spawner,
    silenced: false,
    rotation: 0,
    spin: 0,
    audio: new Audio(),
  };
  flowery.audio.preload = "auto";
  flowery.audio.volume =
    audioSettings.voice * getFloweryVoiceVolumeFactor(flowery);
  flowery.audio.addEventListener("ended", () => handleFloweryVoiceEnd(flowery));
  flowery.audio.addEventListener("error", () => handleFloweryVoiceEnd(flowery));
  connectFloweryAudio(flowery);
  floweries.push(flowery);
  addAchievementProgress("spawns");
  const livingFloweries = floweries.filter((entry) => !entry.flung).length;
  const previousPeak = Number(achievementData.stats.peakFloweries) || 0;
  if (livingFloweries > previousPeak) {
    addAchievementProgress("peakFloweries", livingFloweries - previousPeak);
  }
  if (spawner) {
    spawnSpawnerParticles(
      spawner.x + FLOWERY_SPAWNER_SIZE / 2,
      spawner.y + FLOWERY_SPAWNER_SIZE / 2,
      now,
    );
  }
  playRandomClip(flowery);
}

function updateFloweryGroups(now) {
  for (let index = floweryGroups.length - 1; index >= 0; index -= 1) {
    const group = floweryGroups[index];
    const formerMembers = group.members;
    group.members = group.members.filter(
      (flowery) =>
        floweries.includes(flowery) &&
        !flowery.entering &&
        !flowery.flung &&
        !flowery.ralseiHeld,
    );
    for (const flowery of formerMembers) {
      if (!group.members.includes(flowery) && flowery.socialGroupId === group.id) {
        flowery.socialGroupId = null;
        flowery.talkingUntil = 0;
      }
    }
    if (now >= group.expiresAt || group.members.length < 2) {
      for (const flowery of group.members) {
        flowery.socialGroupId = null;
        flowery.talkingUntil = 0;
      }
      floweryGroups.splice(index, 1);
      continue;
    }

    group.x = group.members.reduce(
      (total, flowery) => total + flowery.x + SPRITE_WIDTH / 2,
      0,
    ) / group.members.length;
    group.y = group.members.reduce(
      (total, flowery) => total + flowery.y + SPRITE_HEIGHT / 2,
      0,
    ) / group.members.length;
    if (now >= group.nextTalkAt) {
      group.speaker = group.members[Math.floor(Math.random() * group.members.length)];
      group.speaker.talkingUntil = now + 1100 + Math.random() * 700;
      group.nextTalkAt = now + 2600 + Math.random() * 4000;
    }
  }

  if (now < nextFloweryGroupAt) return;
  const available = floweries.filter(
    (flowery) =>
      !flowery.entering &&
      !flowery.flung &&
      !flowery.ralseiHeld &&
      flowery.socialGroupId === null,
  );
  if (available.length < 4) {
    nextFloweryGroupAt = now + 2400;
    return;
  }

  const seed = available[Math.floor(Math.random() * available.length)];
  const nearby = available
    .map((flowery) => ({
      flowery,
      distance: Math.hypot(flowery.x - seed.x, flowery.y - seed.y),
    }))
    .sort((first, second) => first.distance - second.distance);
  const memberCount = Math.min(available.length, 3 + Math.floor(Math.random() * 4));
  const members = nearby.slice(0, memberCount).map(({ flowery }) => flowery);
  const group = {
    id: nextFloweryGroupId++,
    members,
    x: seed.x + SPRITE_WIDTH / 2,
    y: seed.y + SPRITE_HEIGHT / 2,
    expiresAt: now + 11000 + Math.random() * 14000,
    nextTalkAt: now + 1200 + Math.random() * 2600,
    speaker: null,
  };
  for (const flowery of members) flowery.socialGroupId = group.id;
  floweryGroups.push(group);
  nextFloweryGroupAt = now + 14000 + Math.random() * 17000;
}

function createFlowerySpatialGrid() {
  const grid = new Map();
  const cellSize = 150;
  for (const flowery of floweries) {
    if (flowery.entering || flowery.flung || flowery.ralseiHeld) continue;
    const column = Math.floor((flowery.x + SPRITE_WIDTH / 2) / cellSize);
    const row = Math.floor((flowery.y + SPRITE_HEIGHT / 2) / cellSize);
    const key = `${column},${row}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(flowery);
  }
  return { grid, cellSize };
}

function steerFloweryThroughCrowd(flowery, spatialGrid, delta) {
  const { grid, cellSize } = spatialGrid;
  const centerX = flowery.x + SPRITE_WIDTH / 2;
  const centerY = flowery.y + SPRITE_HEIGHT / 2;
  const column = Math.floor(centerX / cellSize);
  const row = Math.floor(centerY / cellSize);
  let pushX = 0;
  let pushY = 0;
  const personalSpace = 112;

  for (let y = row - 1; y <= row + 1; y += 1) {
    for (let x = column - 1; x <= column + 1; x += 1) {
      for (const neighbor of grid.get(`${x},${y}`) || []) {
        if (neighbor === flowery) continue;
        let awayX = centerX - (neighbor.x + SPRITE_WIDTH / 2);
        let awayY = centerY - (neighbor.y + SPRITE_HEIGHT / 2);
        let distance = Math.hypot(awayX, awayY);
        if (distance >= personalSpace) continue;
        if (distance < 0.01) {
          const angle = Math.random() * Math.PI * 2;
          awayX = Math.cos(angle);
          awayY = Math.sin(angle);
          distance = 1;
        }
        const force = (personalSpace - distance) / personalSpace;
        pushX += (awayX / distance) * force * 76;
        pushY += (awayY / distance) * force * 76;
      }
    }
  }

  const group = floweryGroups.find((candidate) => candidate.id === flowery.socialGroupId);
  if (group) {
    const towardX = group.x - centerX;
    const towardY = group.y - centerY;
    const distance = Math.hypot(towardX, towardY);
    if (distance > 48) {
      const pull = Math.min(27, (distance - 48) * 0.12);
      pushX += (towardX / distance) * pull;
      pushY += (towardY / distance) * pull;
    }
  }

  const desiredX = flowery.vx + pushX;
  const desiredY = flowery.vy + pushY;
  const desiredSpeed = Math.hypot(desiredX, desiredY);
  const maxSpeed = group ? 76 : 68;
  const speedScale = desiredSpeed > maxSpeed ? maxSpeed / desiredSpeed : 1;
  const steering = Math.min(1, delta * 2.2);
  flowery.vx += (desiredX * speedScale - flowery.vx) * steering;
  flowery.vy += (desiredY * speedScale - flowery.vy) * steering;
}

function drawFlowerySpeechBubble(flowery) {
  const x = Math.round(flowery.x + SPRITE_WIDTH / 2 - 9);
  const y = Math.round(flowery.y - 14);
  context.fillStyle = "#fff";
  context.fillRect(x, y, 18, 10);
  context.fillStyle = "#111";
  context.fillRect(x + 4, y + 4, 2, 2);
  context.fillRect(x + 8, y + 4, 2, 2);
  context.fillRect(x + 12, y + 4, 2, 2);
  context.fillRect(x + 4, y + 10, 3, 2);
}

function createYellow() {
  const now = performance.now();
  const x = Math.max(0, Math.min(getWorldWidth() - YELLOW_WIDTH, getWorldWidth() * 0.42));
  const y = Math.max(0, Math.min(getWorldHeight() - YELLOW_HEIGHT, getWorldHeight() * 0.5));
  yellowCompanion = {
    x,
    y,
    targetX: 0,
    targetY: 0,
    moving: false,
    nextMoveAt: now,
    heading: "down",
    frameIndex: 0,
    frameElapsed: 0,
    gunX: x + YELLOW_WIDTH / 2,
    gunY: y + YELLOW_HEIGHT / 2 + 86,
    targetGunX: x + YELLOW_WIDTH / 2,
    targetGunY: y + YELLOW_HEIGHT / 2 + 86,
    gunAngle: 0,
    gunTargetAngle: 0,
    gunRecoil: 0,
    gunRecoilVelocity: 0,
    manualAimUntil: 0,
    nextAimAt: now + 700,
    nextShotAt: now + 1200,
  };
  chooseYellowTarget();
}

function createClark() {
  const now = performance.now();
  clarkCompanion = {
    x: Math.max(0, Math.min(getWorldWidth() - CLARK_WIDTH, getWorldWidth() * 0.56)),
    y: Math.max(0, Math.min(getWorldHeight() - CLARK_HEIGHT, getWorldHeight() * 0.55)),
    targetX: 0,
    targetY: 0,
    heading: "right",
    nextMoveAt: now,
    nextAttackAt: now + 900,
    walkPhase: Math.random() * Math.PI * 2,
  };
  chooseClarkTarget(now);
}

function createKnifeClark() {
  knifeClarkCompanion = {
    x: Math.max(0, Math.min(getWorldWidth() - KNIFE_CLARK_WIDTH, getWorldWidth() * 0.44)),
    y: Math.max(0, Math.min(getWorldHeight() - KNIFE_CLARK_HEIGHT, getWorldHeight() * 0.55)),
    heading: "right",
    nextAttackAt: performance.now() + 900,
    walkPhase: Math.random() * Math.PI * 2,
    stuckSince: null,
    stuckAnchorX: null,
    stuckAnchorY: null,
  };
}

function chooseClarkTarget(now) {
  if (!clarkCompanion) return;
  const clark = clarkCompanion;
  clark.targetX = Math.random() * Math.max(0, getWorldWidth() - CLARK_WIDTH);
  clark.targetY = Math.random() * Math.max(0, getWorldHeight() - CLARK_HEIGHT);
  clark.nextMoveAt = now;
}

function performClarkShockwave(clark, now, soundPrefix, canTarget = () => true) {
  if (now < clark.nextAttackAt) return;
  const centerX = clark.x + clark.width / 2;
  const centerY = clark.y + clark.height / 2;
  const nearby = floweries.flatMap((flowery) => {
    if (
      flowery.entering ||
      flowery.flung ||
      flowery.ralseiHeld ||
      !canTarget(flowery)
    ) return [];
    return [{
      flowery,
      distance: Math.hypot(
        flowery.x + SPRITE_WIDTH / 2 - centerX,
        flowery.y + SPRITE_HEIGHT / 2 - centerY,
      ),
    }];
  });
  const attack = ["strong", "mid", "weak"].find((strength) => {
    const spec = CLARK_ATTACKS[strength];
    return nearby.filter((target) => target.distance <= spec.range).length >= spec.minTargets;
  });
  if (!attack) return;

  const spec = CLARK_ATTACKS[attack];
  const targets = nearby
    .filter((target) => target.distance <= spec.range)
    .map((target) => target.flowery);
  clarkShockwaves.push({
    x: centerX,
    y: centerY,
    startedAt: now,
    range: spec.range,
    duration: spec.duration,
    strength: attack,
  });
  playSoundEffect(`uploads/${soundPrefix}_${attack}.wav`, 1);
  for (const flowery of targets) squishFlowery(flowery, now);
  clark.nextAttackAt = now + spec.cooldown;
}

function squishFloweryOverlappingClark(clark, now, canTarget = () => true) {
  for (const flowery of [...floweries]) {
    if (
      flowery.entering ||
      flowery.flung ||
      flowery.ralseiHeld ||
      !canTarget(flowery)
    ) continue;
    const overlap = flowery.x < clark.x + clark.width &&
      flowery.x + SPRITE_WIDTH > clark.x &&
      flowery.y < clark.y + clark.height &&
      flowery.y + SPRITE_HEIGHT > clark.y;
    if (overlap) squishFlowery(flowery, now);
  }
}

function updateClark(now, delta, width, height) {
  if (!clarkCompanion) return;
  const clark = clarkCompanion;
  clark.width = CLARK_WIDTH;
  clark.height = CLARK_HEIGHT;
  if (now >= clark.nextMoveAt) {
    const dx = clark.targetX - clark.x;
    const dy = clark.targetY - clark.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 3) {
      clark.nextMoveAt = now + 180 + Math.random() * 500;
      chooseClarkTarget(clark.nextMoveAt);
    } else {
      clark.x += (dx / distance) * CLARK_SPEED * delta;
      clark.y += (dy / distance) * CLARK_SPEED * delta;
      if (Math.abs(dx) > Math.abs(dy) * 0.38) {
        clark.heading = dx < 0 ? "left" : "right";
      }
      clark.walkPhase += delta * 13;
      if (distance <= CLARK_SPEED * delta) clark.nextMoveAt = now;
    }
  }
  clark.x = Math.max(0, Math.min(Math.max(0, width - CLARK_WIDTH), clark.x));
  clark.y = Math.max(0, Math.min(Math.max(0, height - CLARK_HEIGHT), clark.y));
  performClarkShockwave(clark, now, "clark_attack");
  squishFloweryOverlappingClark(clark, now);
}

function updateKnifeClark(now, delta, width, height) {
  if (!knifeClarkCompanion) return;
  const clark = knifeClarkCompanion;
  clark.width = KNIFE_CLARK_WIDTH;
  clark.height = KNIFE_CLARK_HEIGHT;
  const safeZones = getKnifeClarkSafeZones();
  let nearest = null;
  let nearestDistance = Infinity;
  for (const flowery of floweries) {
    if (
      flowery.entering ||
      flowery.flung ||
      flowery.ralseiHeld ||
      isFloweryInKnifeSafeZone(flowery, safeZones)
    ) continue;
    const dx = flowery.x + SPRITE_WIDTH / 2 - (clark.x + clark.width / 2);
    const dy = flowery.y + SPRITE_HEIGHT / 2 - (clark.y + clark.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance < nearestDistance) {
      nearest = { dx, dy, distance };
      nearestDistance = distance;
    }
  }
  const isChasing = nearest && nearest.distance > 26;
  if (isChasing) {
    clark.x += (nearest.dx / nearest.distance) * KNIFE_CLARK_SPEED * delta;
    clark.y += (nearest.dy / nearest.distance) * KNIFE_CLARK_SPEED * delta;
    if (Math.abs(nearest.dx) > Math.abs(nearest.dy) * 0.38) {
      clark.heading = nearest.dx < 0 ? "left" : "right";
    }
    clark.walkPhase += delta * 15;
  }
  keepKnifeClarkOutsideSafeZones(clark, safeZones, width, height);
  clark.x = Math.max(0, Math.min(Math.max(0, width - KNIFE_CLARK_WIDTH), clark.x));
  clark.y = Math.max(0, Math.min(Math.max(0, height - KNIFE_CLARK_HEIGHT), clark.y));
  if (isChasing) {
    if (clark.stuckSince === null) {
      clark.stuckSince = now;
      clark.stuckAnchorX = clark.x;
      clark.stuckAnchorY = clark.y;
    } else if (
      Math.hypot(clark.x - clark.stuckAnchorX, clark.y - clark.stuckAnchorY) >=
      KNIFE_CLARK_STUCK_PROGRESS_DISTANCE
    ) {
      clark.stuckSince = now;
      clark.stuckAnchorX = clark.x;
      clark.stuckAnchorY = clark.y;
    } else if (now - clark.stuckSince >= KNIFE_CLARK_STUCK_TIMEOUT) {
      respawnKnifeClark(clark, now, width, height, safeZones);
    }
  } else {
    clark.stuckSince = null;
    clark.stuckAnchorX = null;
    clark.stuckAnchorY = null;
  }
  performClarkShockwave(
    clark,
    now,
    "wiredclark",
    (flowery) => !isFloweryInKnifeSafeZone(flowery, safeZones),
  );
  squishFloweryOverlappingClark(
    clark,
    now,
    (flowery) => !isFloweryInKnifeSafeZone(flowery, safeZones),
  );
}

function respawnKnifeClark(clark, now, width, height, safeZones) {
  const columns = 9;
  const rows = 7;
  const maxX = Math.max(0, width - KNIFE_CLARK_WIDTH);
  const maxY = Math.max(0, height - KNIFE_CLARK_HEIGHT);
  const edgeMarginX = Math.min(72, maxX / 2);
  const edgeMarginY = Math.min(72, maxY / 2);
  const candidates = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = edgeMarginX +
        (Math.max(0, maxX - edgeMarginX * 2) * column) / (columns - 1);
      const y = edgeMarginY +
        (Math.max(0, maxY - edgeMarginY * 2) * row) / (rows - 1);
      const centerX = x + KNIFE_CLARK_WIDTH / 2;
      const centerY = y + KNIFE_CLARK_HEIGHT / 2;
      const edgeClearance =
        Math.min(x, maxX - x, y, maxY - y) - 12;
      const clearance = safeZones.reduce((minimum, zone) =>
        Math.min(
          minimum,
          Math.hypot(centerX - zone.x, centerY - zone.y) -
            zone.radius -
            KNIFE_CLARK_HEIGHT / 2 -
            8,
        ), edgeClearance);
      candidates.push({ x, y, clearance });
    }
  }

  candidates.sort((a, b) => b.clearance - a.clearance);
  const bestClearance = candidates[0]?.clearance ?? 0;
  const bestCandidates = candidates.filter(
    (candidate) => candidate.clearance >= bestClearance - 12,
  );
  const spawn = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
  clark.x = spawn?.x ?? maxX / 2;
  clark.y = spawn?.y ?? maxY / 2;
  clark.heading = "right";
  clark.walkPhase = Math.random() * Math.PI * 2;
  clark.nextAttackAt = now + 600;
  clark.stuckSince = null;
  clark.stuckAnchorX = null;
  clark.stuckAnchorY = null;
}

function getKnifeClarkSafeZones() {
  const zones = [
    { x: getLampX(), y: getLampY(), radius: 190 },
    ...extraFlowerSpawners.map((spawner) => ({
      x: spawner.x + FLOWERY_SPAWNER_SIZE / 2,
      y: spawner.y + FLOWERY_SPAWNER_SIZE / 2,
      radius: 132,
    })),
  ];
  for (const box of getMonsterboxPositions()) {
    zones.push({
      x: box.x + MONSTERBOX_SIZE / 2,
      y: box.y + MONSTERBOX_SIZE / 2,
      radius: 132,
    });
  }
  return zones;
}

function isFloweryInKnifeSafeZone(flowery, safeZones) {
  const x = flowery.x + SPRITE_WIDTH / 2;
  const y = flowery.y + SPRITE_HEIGHT / 2;
  return safeZones.some((zone) =>
    Math.hypot(x - zone.x, y - zone.y) <= zone.radius,
  );
}

function keepKnifeClarkOutsideSafeZones(clark, safeZones, width, height) {
  const clearance = KNIFE_CLARK_HEIGHT / 2 + 8;
  for (let pass = 0; pass < 5; pass += 1) {
    for (let index = 0; index < safeZones.length; index += 1) {
      const zone = safeZones[index];
      let dx = clark.x + clark.width / 2 - zone.x;
      let dy = clark.y + clark.height / 2 - zone.y;
      let distance = Math.hypot(dx, dy);
      const minDistance = zone.radius + clearance;
      if (distance >= minDistance) continue;
      if (distance < 0.001) {
        const angle = (index + 1) * 2.399963229728653;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        distance = 1;
      }
      const push = minDistance - distance;
      clark.x += (dx / distance) * push;
      clark.y += (dy / distance) * push;
      clark.x = Math.max(0, Math.min(Math.max(0, width - clark.width), clark.x));
      clark.y = Math.max(0, Math.min(Math.max(0, height - clark.height), clark.y));
    }
  }
}

function drawPixelShadow(centerX, groundY, width, height, opacity = 0.38) {
  const pixelStep = 2;
  const top = Math.floor((groundY - height / 2) / pixelStep) * pixelStep;
  const bottom = Math.ceil((groundY + height / 2) / pixelStep) * pixelStep;
  context.save();
  context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  for (let y = top; y < bottom; y += pixelStep) {
    const offsetY = (y + pixelStep / 2 - groundY) / (height / 2);
    const halfWidth = (width / 2) * Math.sqrt(Math.max(0, 1 - offsetY * offsetY));
    const left = Math.floor((centerX - halfWidth) / pixelStep) * pixelStep;
    const right = Math.ceil((centerX + halfWidth) / pixelStep) * pixelStep;
    context.fillRect(left, y, Math.max(pixelStep, right - left), pixelStep);
  }
  context.restore();
}

function drawClark() {
  if (!clarkCompanion || !clarkSprite.complete || !clarkSprite.naturalWidth) return;
  const clark = clarkCompanion;
  const bob = Math.sin(clark.walkPhase) * 2.2;
  const lean = Math.sin(clark.walkPhase) * 0.045;
  drawPixelShadow(
    clark.x + CLARK_WIDTH / 2,
    clark.y + CLARK_HEIGHT - 3,
    31,
    8,
    0.4,
  );
  context.save();
  context.translate(
    Math.round(clark.x + CLARK_WIDTH / 2),
    Math.round(clark.y + CLARK_HEIGHT / 2 + bob),
  );
  if (clark.heading === "left") context.scale(-1, 1);
  context.rotate(lean);
  context.drawImage(
    clarkSprite,
    -CLARK_WIDTH / 2,
    -CLARK_HEIGHT / 2,
    CLARK_WIDTH,
    CLARK_HEIGHT,
  );
  context.restore();
}

function drawKnifeClark() {
  if (
    !knifeClarkCompanion ||
    !knifeClarkSprite.complete ||
    !knifeClarkSprite.naturalWidth
  ) return;
  const clark = knifeClarkCompanion;
  const bob = Math.sin(clark.walkPhase) * 1.8;
  drawPixelShadow(
    clark.x + KNIFE_CLARK_WIDTH / 2,
    clark.y + KNIFE_CLARK_HEIGHT - 2,
    28,
    8,
    0.42,
  );
  context.save();
  context.translate(
    Math.round(clark.x + KNIFE_CLARK_WIDTH / 2),
    Math.round(clark.y + KNIFE_CLARK_HEIGHT / 2 + bob),
  );
  if (clark.heading === "left") context.scale(-1, 1);
  context.drawImage(
    knifeClarkSprite,
    -KNIFE_CLARK_WIDTH / 2,
    -KNIFE_CLARK_HEIGHT / 2,
    KNIFE_CLARK_WIDTH,
    KNIFE_CLARK_HEIGHT,
  );
  context.restore();
}

function chooseYellowTarget() {
  if (!yellowCompanion) return;
  const maxX = Math.max(0, getWorldWidth() - YELLOW_WIDTH);
  const maxY = Math.max(0, getWorldHeight() - YELLOW_HEIGHT);
  yellowCompanion.targetX = Math.random() * maxX;
  yellowCompanion.targetY = Math.random() * maxY;
  yellowCompanion.moving = true;
}

function aimYellowGun(angle) {
  if (!yellowCompanion) return;
  yellowCompanion.gunTargetAngle = angle;
}

function getYellowGunAnchor() {
  const angle = yellowCompanion.gunAngle;
  return {
    x: yellowCompanion.gunX - Math.cos(angle) * yellowCompanion.gunRecoil,
    y: yellowCompanion.gunY - Math.sin(angle) * yellowCompanion.gunRecoil,
  };
}

function getYellowMuzzle() {
  const anchor = getYellowGunAnchor();
  const angle = yellowCompanion.gunAngle;
  return {
    x: anchor.x + Math.cos(angle) * 52 + Math.sin(angle) * 36,
    y: anchor.y + Math.sin(angle) * 52 - Math.cos(angle) * 36,
  };
}

function fireYellowBullet() {
  if (!yellowCompanion) return;
  const muzzle = getYellowMuzzle();
  const angle = yellowCompanion.gunAngle;
  yellowCompanion.gunRecoilVelocity += 210;
  yellowBullets.push({
    x: muzzle.x,
    y: muzzle.y,
    vx: Math.cos(angle) * YELLOW_BULLET_SPEED,
    vy: Math.sin(angle) * YELLOW_BULLET_SPEED,
    hits: 0,
    bounces: 0,
  });
}

function updateYellow(now, delta, width, height) {
  if (!yellowCompanion) return;
  const yellow = yellowCompanion;
  if (!yellow.moving && now >= yellow.nextMoveAt) chooseYellowTarget();

  if (yellow.moving) {
    const dx = yellow.targetX - yellow.x;
    const dy = yellow.targetY - yellow.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= YELLOW_SPEED * delta || distance < 2) {
      yellow.x = yellow.targetX;
      yellow.y = yellow.targetY;
      yellow.moving = false;
      yellow.nextMoveAt = now + 250 + Math.random() * 900;
      yellow.frameIndex = 0;
      yellow.frameElapsed = 0;
    } else {
      yellow.x += (dx / distance) * YELLOW_SPEED * delta;
      yellow.y += (dy / distance) * YELLOW_SPEED * delta;
      yellow.heading = Math.abs(dx) > Math.abs(dy)
        ? (dx < 0 ? "left" : "right")
        : (dy < 0 ? "up" : "down");
      yellow.frameElapsed += delta * 1000;
      while (yellow.frameElapsed >= YELLOW_FRAME_MS) {
        yellow.frameElapsed -= YELLOW_FRAME_MS;
        yellow.frameIndex = (yellow.frameIndex + 1) % 4;
      }
    }
  }
  yellow.x = Math.max(0, Math.min(Math.max(0, width - YELLOW_WIDTH), yellow.x));
  yellow.y = Math.max(0, Math.min(Math.max(0, height - YELLOW_HEIGHT), yellow.y));
  if (!yellow.moving) {
    yellow.frameIndex = 0;
    yellow.frameElapsed = 0;
  }

  const targets = floweries.filter(
    (flowery) => !flowery.entering && !flowery.flung && !flowery.ralseiHeld,
  );
  if (now >= yellow.nextAimAt) {
    if (targets.length && now >= yellow.manualAimUntil) {
      const target = targets[Math.floor(Math.random() * targets.length)];
      aimYellowGun(Math.atan2(
        target.y + SPRITE_HEIGHT / 2 - yellow.gunY,
        target.x + SPRITE_WIDTH / 2 - yellow.gunX,
      ));
    }
    yellow.nextAimAt = now + 1200 + Math.random() * 1500;
  }

  const angleDifference = Math.atan2(
    Math.sin(yellow.gunTargetAngle - yellow.gunAngle),
    Math.cos(yellow.gunTargetAngle - yellow.gunAngle),
  );
  yellow.gunAngle += angleDifference * (1 - Math.exp(-10 * delta));
  const gunPositionEase = 1 - Math.exp(-9 * delta);
  const walkDirection = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
  }[yellow.heading];
  const gunPadding = 55;
  yellow.targetGunX = Math.max(gunPadding, Math.min(
    width - gunPadding,
    yellow.x + YELLOW_WIDTH / 2 + walkDirection[0] * 86,
  ));
  yellow.targetGunY = Math.max(gunPadding, Math.min(
    height - gunPadding,
    yellow.y + YELLOW_HEIGHT / 2 + walkDirection[1] * 86,
  ));
  yellow.gunX += (yellow.targetGunX - yellow.gunX) * gunPositionEase;
  yellow.gunY += (yellow.targetGunY - yellow.gunY) * gunPositionEase;
  yellow.gunRecoilVelocity -= yellow.gunRecoil * 190 * delta;
  yellow.gunRecoilVelocity *= Math.exp(-13 * delta);
  yellow.gunRecoil = Math.max(0, yellow.gunRecoil + yellow.gunRecoilVelocity * delta);

  if (now >= yellow.nextShotAt) {
    if (targets.length) fireYellowBullet();
    yellow.nextShotAt = now + 1450 + Math.random() * 1000;
  }
}

function updateYellowBullets(delta, width, height, now) {
  for (let index = yellowBullets.length - 1; index >= 0; index -= 1) {
    const bullet = yellowBullets[index];
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    if (bullet.x <= YELLOW_BULLET_RADIUS || bullet.x >= width - YELLOW_BULLET_RADIUS) {
      bullet.x = Math.max(YELLOW_BULLET_RADIUS, Math.min(width - YELLOW_BULLET_RADIUS, bullet.x));
      bullet.vx *= -1;
      bullet.bounces += 1;
      if (bullet.bounces >= 2) {
        yellowBullets.splice(index, 1);
        continue;
      }
    }
    if (bullet.y <= YELLOW_BULLET_RADIUS || bullet.y >= height - YELLOW_BULLET_RADIUS) {
      bullet.y = Math.max(YELLOW_BULLET_RADIUS, Math.min(height - YELLOW_BULLET_RADIUS, bullet.y));
      bullet.vy *= -1;
      bullet.bounces += 1;
      if (bullet.bounces >= 2) {
        yellowBullets.splice(index, 1);
        continue;
      }
    }

    for (const flowery of [...floweries]) {
      if (flowery.entering || flowery.flung || flowery.ralseiHeld) continue;
      const radius = YELLOW_BULLET_RADIUS;
      const hit = bullet.x >= flowery.x - radius &&
        bullet.x <= flowery.x + SPRITE_WIDTH + radius &&
        bullet.y >= flowery.y - radius &&
        bullet.y <= flowery.y + SPRITE_HEIGHT + radius;
      if (!hit) continue;

      squishFlowery(flowery, now);
      bullet.hits += 1;
      if (bullet.hits >= FLOWERY_BULLET_HITS) {
        yellowBullets.splice(index, 1);
      }
      break;
    }
  }
}

function drawYellow() {
  if (!yellowCompanion) return;
  const yellow = yellowCompanion;
  drawPixelShadow(
    yellow.x + YELLOW_WIDTH / 2,
    yellow.y + YELLOW_HEIGHT - 3,
    29,
    8,
    0.4,
  );
  if (yellowGunSprite.complete && yellowGunSprite.naturalWidth) {
    const anchor = getYellowGunAnchor();
    context.save();
    context.translate(anchor.x, anchor.y);
    context.rotate(yellow.gunAngle);
    context.drawImage(yellowGunSprite, -53, -45, YELLOW_GUN_WIDTH, YELLOW_GUN_HEIGHT);
    context.restore();
  }

  const sprite = yellowSprites[
    yellow.heading === "left" || yellow.heading === "right" ? "left" : yellow.heading
  ][yellow.frameIndex];
  if (sprite.complete && sprite.naturalWidth) {
    const spriteWidth = sprite.naturalWidth;
    const spriteHeight = sprite.naturalHeight;
    const x = Math.round(yellow.x + YELLOW_WIDTH / 2);
    const y = Math.round(yellow.y + (YELLOW_HEIGHT - spriteHeight) / 2);
    context.save();
    if (yellow.heading === "right") {
      context.translate(x, 0);
      context.scale(-1, 1);
      context.drawImage(sprite, -spriteWidth / 2, y, spriteWidth, spriteHeight);
    } else {
      context.drawImage(sprite, x - spriteWidth / 2, y, spriteWidth, spriteHeight);
    }
    context.restore();
  }
}

function drawYellowBullets() {
  for (const bullet of yellowBullets) {
    context.fillStyle = "#fff16a";
    context.fillRect(
      Math.round(bullet.x - YELLOW_BULLET_RADIUS),
      Math.round(bullet.y - YELLOW_BULLET_RADIUS),
      YELLOW_BULLET_RADIUS * 2,
      YELLOW_BULLET_RADIUS * 2,
    );
  }
}

function addCar() {
  const maxX = Math.max(0, getWorldWidth() - CAR_WIDTH);
  const maxY = Math.max(0, getWorldHeight() - CAR_HEIGHT);
  const direction = Math.random() < 0.5 ? 1 : -1;
  const car = {
    x: direction > 0 ? 0 : maxX,
    y: Math.random() * maxY,
    vx: direction * (170 + Math.random() * 80),
    vy: (Math.random() - 0.5) * 80,
    nextTurnAt: performance.now() + 900 + Math.random() * 1800,
  };
  cars.push(car);
}

function addRalseiCar(entrySide, entryY, width, height) {
  const maxY = Math.max(0, height - CAR_HEIGHT);
  const entersFromLeft = entrySide === "left";
  ralseiCars.push({
    x: entersFromLeft ? -CAR_WIDTH : width,
    y: Math.max(0, Math.min(maxY, entryY)),
    vx: entersFromLeft ? 300 : -300,
    vy: 0,
    isRalsei: true,
    cameFromLeft: entersFromLeft,
    entered: false,
    hasChasedTarget: false,
    exiting: false,
  });
}

function updateRalseiCars(delta, width, height) {
  for (let index = ralseiCars.length - 1; index >= 0; index -= 1) {
    const car = ralseiCars[index];
    if (car.exiting) {
      car.x += car.vx * delta;
      car.y += car.vy * delta;
    } else {
      let target = null;
      let nearestDistance = Infinity;
      for (const flowery of floweries) {
        if (flowery.entering || flowery.flung || flowery.ralseiHeld) continue;
        const dx = flowery.x + SPRITE_WIDTH / 2 - (car.x + CAR_WIDTH / 2);
        const dy = flowery.y + SPRITE_HEIGHT / 2 - (car.y + CAR_HEIGHT / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          target = flowery;
          nearestDistance = distance;
        }
      }

      if (target) {
        const dx = target.x + SPRITE_WIDTH / 2 - (car.x + CAR_WIDTH / 2);
        const dy = target.y + SPRITE_HEIGHT / 2 - (car.y + CAR_HEIGHT / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const speed = 320;
        car.vx = (dx / distance) * speed;
        car.vy = (dy / distance) * speed;
        car.hasChasedTarget = true;
      } else if (car.entered) {
        car.exiting = true;
        const exitDirection = car.hasChasedTarget
          ? (car.x + CAR_WIDTH / 2 < width / 2 ? -1 : 1)
          : (car.cameFromLeft ? 1 : -1);
        car.vx = exitDirection * 320;
        car.vy = 0;
      }

      car.x += car.vx * delta;
      car.y += car.vy * delta;
      if (
        car.x + CAR_WIDTH > 0 &&
        car.x < width &&
        car.y + CAR_HEIGHT > 0 &&
        car.y < height
      ) {
        car.entered = true;
      }
    }

    if (
      (car.exiting || !car.hasChasedTarget) &&
      (car.x + CAR_WIDTH < 0 || car.x > width || car.y + CAR_HEIGHT < 0 || car.y > height)
    ) {
      ralseiCars.splice(index, 1);
    }
  }
}

function silenceFlowery(flowery) {
  flowery.silenced = true;
  flowery.audioHasClip = false;
  clearTimeout(flowery.voiceTimer);
  flowery.voiceTimer = null;
  flowery.audio.pause();
  flowery.audio.removeAttribute("src");
  flowery.audio.load();
}

function releaseFlowery(flowery) {
  silenceFlowery(flowery);
  disconnectFloweryAudio(flowery);
}

function playHitVoiceClip(flowery) {
  releaseFlowery(flowery);
  const clip = hitVoiceClips[Math.floor(Math.random() * hitVoiceClips.length)];
  playSoundEffect(clip, 1, "voice");
}

function addExplosion(x, y, now) {
  explosions.push({
    x: x - EXPLOSION_WIDTH / 2,
    y: y - EXPLOSION_HEIGHT / 2,
    startedAt: now,
  });
}

function squishFlowery(flowery, now) {
  const index = floweries.indexOf(flowery);
  if (index === -1) return;

  recordFloweryDeath(flowery);
  floweries.splice(index, 1);
  releaseFlowery(flowery);
  addSplatParticles(
    flowery.x + SPRITE_WIDTH / 2,
    flowery.y + SPRITE_HEIGHT / 2,
    now,
  );
  playSplatSound();
}

function hasFloweryNear(x, y) {
  return floweries.some((flowery) => {
    const dx = flowery.x + SPRITE_WIDTH / 2 - x;
    const dy = flowery.y + SPRITE_HEIGHT / 2 - y;
    return Math.hypot(dx, dy) <= TOOL_ATTACK_RADIUS;
  });
}

function swoonAndSquish(targets, now) {
  for (const flowery of targets) {
    const deathX = flowery.x + SPRITE_WIDTH / 2;
    const deathY = flowery.y + SPRITE_HEIGHT / 2;
    swoonEffects.push({
      x: deathX,
      y: deathY,
      startedAt: now,
      lifetime: 1800,
    });
    squishFlowery(flowery, now);
  }
}

function useRoaringBlade(x, y, screenX, screenY) {
  if (slashAttackActive || !hasFloweryNear(x, y)) return;
  slashAttackActive = true;
  const pausedStates = pauseAudioForBlade();
  slashSprite.style.left = `${screenX}px`;
  slashSprite.style.top = `${screenY}px`;
  slashOverlay.hidden = false;
  playSoundEffect("uploads/dark_slash.wav", 1);
  window.setTimeout(() => {
    slashOverlay.hidden = true;
    slashAttackActive = false;
    resumeAudioAfterBlade(pausedStates);
    playSoundEffect("uploads/glassbreak.wav", 1);
    const attackTime = performance.now();
    const targets = floweries.filter((flowery) => {
      const dx = flowery.x + SPRITE_WIDTH / 2 - x;
      const dy = flowery.y + SPRITE_HEIGHT / 2 - y;
      return Math.hypot(dx, dy) <= TOOL_ATTACK_RADIUS;
    });
    swoonAndSquish(targets, attackTime);
  }, SLASH_ATTACK_DURATION);
}

function useLaser(x, y, now) {
  if (!hasFloweryNear(x, y)) return;
  const nearest = floweries.reduce((best, flowery) => {
    const distance = Math.hypot(
      flowery.x + SPRITE_WIDTH / 2 - x,
      flowery.y + SPRITE_HEIGHT / 2 - y,
    );
    return distance < best.distance ? { flowery, distance } : best;
  }, { flowery: null, distance: Infinity }).flowery;
  if (!nearest) return;

  const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
  const coordinate = orientation === "horizontal"
    ? nearest.y + SPRITE_HEIGHT / 2
    : nearest.x + SPRITE_WIDTH / 2;
  laserEffects.push({
    orientation,
    coordinate,
    startedAt: now,
    duration: LASER_EFFECT_DURATION,
  });
  const targets = floweries.filter((flowery) => {
    if (!isWorldRectVisible(flowery.x, flowery.y, SPRITE_WIDTH, SPRITE_HEIGHT)) return false;
    const distance = orientation === "horizontal"
      ? Math.abs(flowery.y + SPRITE_HEIGHT / 2 - coordinate)
      : Math.abs(flowery.x + SPRITE_WIDTH / 2 - coordinate);
    return distance <= LASER_HIT_HALF_WIDTH;
  });
  swoonAndSquish(targets, now);
}

function addSplatParticles(x, y, now) {
  const particles = Array.from({ length: 11 }, () => {
    const size = Math.round(SPLAT_PARTICLE_SIZE * (0.25 + Math.random() * 0.75));
    const direction = Math.random() * Math.PI * 2;
    const burstSpeed = 48 + Math.random() * 68;
    return {
      x: Math.round(x - size / 2),
      y: Math.round(y - size / 2),
      size,
      vx: Math.cos(direction) * burstSpeed,
      vy: Math.sin(direction) * burstSpeed - 18,
      gravity: 42 + Math.random() * 30,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 8,
      sway: 2 + Math.random() * 5,
      swaySpeed: 1.5 + Math.random() * 1.8,
      swayPhase: Math.random() * Math.PI * 2,
      groundY: Math.max(0, getWorldHeight() - size),
      landedAt: null,
    };
  });
  splats.push({ particles, startedAt: now });
}

function playSoundEffect(path, volume, channel = "sfx") {
  if (bladeAudioPaused && path !== "uploads/dark_slash.wav") return;
  const effect = new Audio(path);
  effect.preload = "auto";
  effect.volume = volume * audioSettings[channel];
  let effectSource = null;
  let stopped = false;

  if (audioContext && limiter) {
    try {
      effectSource = audioContext.createMediaElementSource(effect);
      effectSource.connect(limiter);
    } catch (error) {
      console.warn("Sound effect could not connect to the audio limiter:", error);
    }
  }

  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    activeSoundEffects.delete(cleanup);
    liveSoundEffects.delete(effect);
    if (effectSource) {
      effectSource.disconnect();
      effectSource = null;
    }
    effect.pause();
    effect.removeAttribute("src");
    effect.load();
  };
  activeSoundEffects.add(cleanup);
  liveSoundEffects.add(effect);
  effect.addEventListener("ended", cleanup, { once: true });
  effect.addEventListener("error", cleanup, { once: true });
  effect.play().catch(cleanup);
}

function playExplosionSound() {
  playSoundEffect("uploads/deltarune-explosion.mp3", 0.75);
}

function playSplatSound() {
  playSoundEffect("uploads/snd_splat.wav", 0.9);
}

function updateFloweryCounter(count) {
  const limit = getFloweryLimit();
  const displayedCount = Math.min(limit, count);
  if (lastFloweryCount !== displayedCount) {
    floweryCounterLabel.textContent = String(displayedCount);
    lastFloweryCount = displayedCount;
  }
  floweryCountLimitLabel.textContent = `/${limit}`;
  floweryWarning.hidden = count < Math.floor(limit / 2);
}

async function captureGameScene() {
  let importTimeout;
  try {
    const html2canvasModule = await Promise.race([
      import("https://esm.sh/html2canvas@1.4.1"),
      new Promise((_, reject) => {
        importTimeout = window.setTimeout(
          () => reject(new Error("The screenshot renderer took too long to load.")),
          2500,
        );
      }),
    ]);
    window.clearTimeout(importTimeout);
    const html2canvas = html2canvasModule.default || html2canvasModule;
    return await html2canvas(gameScene, {
      backgroundColor: null,
      scale: Math.max(1, window.devicePixelRatio || 1),
      width: getViewWidth(),
      height: getViewHeight(),
      windowWidth: getViewWidth(),
      windowHeight: getViewHeight(),
      logging: false,
    });
  } catch (error) {
    window.clearTimeout(importTimeout);
    console.warn("Could not capture the full game scene; using the game canvas instead.", error);
    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    const snapshot = document.createElement("canvas");
    snapshot.width = Math.round(getViewWidth() * pixelRatio);
    snapshot.height = Math.round(getViewHeight() * pixelRatio);
    const snapshotContext = snapshot.getContext("2d");
    snapshotContext.drawImage(canvas, 0, 0, snapshot.width, snapshot.height);
    return snapshot;
  }
}

function createGlassShards(width, height) {
  const columns = Math.max(7, Math.ceil(width / 115));
  const rows = Math.max(5, Math.ceil(height / 100));
  const nodes = Array.from({ length: rows + 1 }, (_, row) =>
    Array.from({ length: columns + 1 }, (_, column) => ({
      x: column === 0 || column === columns
        ? (width * column) / columns
        : (width * column) / columns + (Math.random() - 0.5) * (width / columns) * 0.45,
      y: row === 0 || row === rows
        ? (height * row) / rows
        : (height * row) / rows + (Math.random() - 0.5) * (height / rows) * 0.45,
    })),
  );
  const shards = [];

  function addShard(points) {
    const centerX = points.reduce((total, point) => total + point.x, 0) / points.length;
    const centerY = points.reduce((total, point) => total + point.y, 0) / points.length;
    const radialX = centerX - width / 2;
    const radialY = centerY - height / 2;
    const distance = Math.hypot(radialX, radialY) || 1;
    const speed = 70 + Math.random() * 270;
    shards.push({
      points: points.map((point) => ({ x: point.x - centerX, y: point.y - centerY })),
      centerX,
      centerY,
      vx: (radialX / distance) * speed + (Math.random() - 0.5) * 90,
      vy: (radialY / distance) * speed - 35,
      gravity: 100 + Math.random() * 260,
      spin: (Math.random() - 0.5) * 2.8,
      delay: Math.random() * 0.12,
    });
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = nodes[row][column];
      const b = nodes[row][column + 1];
      const c = nodes[row + 1][column + 1];
      const d = nodes[row + 1][column];
      if (Math.random() < 0.5) {
        addShard([a, b, c]);
        addShard([a, c, d]);
      } else {
        addShard([a, b, d]);
        addShard([b, c, d]);
      }
    }
  }
  return shards;
}

function showShatteredSnapshot(snapshot) {
  const width = getViewWidth();
  const height = getViewHeight();
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  shatterCanvas.width = Math.round(width * pixelRatio);
  shatterCanvas.height = Math.round(height * pixelRatio);
  shatterContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const shards = createGlassShards(width, height);
  const startedAt = performance.now();
  const stillImageDuration = 420;
  const shatterDuration = 1450;
  overloadTitle.hidden = false;
  overloadOverlay.hidden = false;

  function animate(now) {
    const elapsed = now - startedAt;
    shatterContext.clearRect(0, 0, width, height);
    if (elapsed < stillImageDuration) {
      shatterContext.drawImage(snapshot, 0, 0, width, height);
    } else {
      overloadTitle.hidden = true;
      const shatterTime = (elapsed - stillImageDuration) / 1000;
      for (const shard of shards) {
        const time = Math.max(0, shatterTime - shard.delay);
        const alpha = Math.max(0, 1 - Math.max(0, time - 0.78) / 0.62);
        if (!alpha) continue;
        shatterContext.save();
        shatterContext.globalAlpha = alpha;
        shatterContext.translate(
          shard.centerX + shard.vx * time,
          shard.centerY + shard.vy * time + shard.gravity * time * time / 2,
        );
        shatterContext.rotate(shard.spin * time);
        shatterContext.beginPath();
        shatterContext.moveTo(shard.points[0].x, shard.points[0].y);
        for (let index = 1; index < shard.points.length; index += 1) {
          shatterContext.lineTo(shard.points[index].x, shard.points[index].y);
        }
        shatterContext.closePath();
        shatterContext.clip();
        shatterContext.drawImage(
          snapshot,
          -shard.centerX,
          -shard.centerY,
          width,
          height,
        );
        shatterContext.restore();
      }
    }

    if (elapsed >= stillImageDuration + shatterDuration) {
      overloadOverlay.hidden = true;
      gameOverScreen.hidden = false;
      shopPanel.inert = false;
      tryAgainButton.focus();
      return;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

async function beginFloweryOverload() {
  if (overloadSequenceActive) return;
  overloadSequenceActive = true;
  gameScene.inert = true;
  shopPanel.inert = true;
  for (const flowery of floweries) releaseFlowery(flowery);
  backgroundMusic.pause();
  ralseiVoice.pause();
  for (const stopEffect of [...activeSoundEffects]) stopEffect();
  const snapshot = await captureGameScene();
  showShatteredSnapshot(snapshot);
}

function getErrorLogoMask() {
  if (!errorLogoSprite.complete || !errorLogoSprite.naturalWidth) return null;
  if (
    errorLogoMask &&
    errorLogoMask.width === errorLogoSprite.naturalWidth &&
    errorLogoMask.height === errorLogoSprite.naturalHeight
  ) return errorLogoMask;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = errorLogoSprite.naturalWidth;
  maskCanvas.height = errorLogoSprite.naturalHeight;
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskContext.drawImage(errorLogoSprite, 0, 0);
  errorLogoMask = maskContext.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  return errorLogoMask;
}

function ensureErrorLogo() {
  if (!errorLogoOwned || errorLogo) return;
  errorLogo = {
    x: Math.max(0, (getWorldWidth() - ERROR_LOGO_SIZE) / 2),
    y: Math.max(0, (getWorldHeight() - ERROR_LOGO_SIZE) / 2),
    vx: 185,
    vy: 147,
  };
}

function stampErrorTrailPixel(x, y, now) {
  x = Math.floor(x / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE;
  y = Math.floor(y / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE;
  if (x < 0 || y < 0 || x >= getWorldWidth() || y >= getWorldHeight()) return;
  const key = `${x},${y}`;
  let pixel = errorTrailPixels.get(key);
  if (!pixel) {
    pixel = {
      x,
      y,
      delay: ERROR_TRAIL_MIN_DELAY +
        Math.random() * (ERROR_TRAIL_MAX_DELAY - ERROR_TRAIL_MIN_DELAY),
      touchedAt: now,
    };
    errorTrailPixels.set(key, pixel);
  } else {
    pixel.touchedAt = now;
  }
}

function stampErrorTrailRect(x, y, width, height, now) {
  const left = Math.max(0, Math.floor(x / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE);
  const top = Math.max(0, Math.floor(y / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE);
  const right = Math.min(getWorldWidth(), Math.ceil((x + width) / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE);
  const bottom = Math.min(getWorldHeight(), Math.ceil((y + height) / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE);
  for (let py = top; py < bottom; py += ERROR_TRAIL_PIXEL_SIZE) {
    for (let px = left; px < right; px += ERROR_TRAIL_PIXEL_SIZE) {
      stampErrorTrailPixel(px, py, now);
    }
  }
}

function stampErrorLogoTrail(now) {
  const mask = getErrorLogoMask();
  if (!mask || !errorLogo) return;
  const scaleX = ERROR_LOGO_SIZE / mask.width;
  const scaleY = ERROR_LOGO_SIZE / mask.height;
  const left = Math.floor(errorLogo.x / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE;
  const top = Math.floor(errorLogo.y / ERROR_TRAIL_PIXEL_SIZE) * ERROR_TRAIL_PIXEL_SIZE;
  const right = Math.ceil((errorLogo.x + ERROR_LOGO_SIZE) / ERROR_TRAIL_PIXEL_SIZE) *
    ERROR_TRAIL_PIXEL_SIZE;
  const bottom = Math.ceil((errorLogo.y + ERROR_LOGO_SIZE) / ERROR_TRAIL_PIXEL_SIZE) *
    ERROR_TRAIL_PIXEL_SIZE;
  for (let y = top; y < bottom; y += ERROR_TRAIL_PIXEL_SIZE) {
    for (let x = left; x < right; x += ERROR_TRAIL_PIXEL_SIZE) {
      const sourceX = Math.floor((x + ERROR_TRAIL_PIXEL_SIZE / 2 - errorLogo.x) / scaleX);
      const sourceY = Math.floor((y + ERROR_TRAIL_PIXEL_SIZE / 2 - errorLogo.y) / scaleY);
      if (sourceX < 0 || sourceY < 0 || sourceX >= mask.width || sourceY >= mask.height) continue;
      const alphaIndex = (sourceY * mask.width + sourceX) * 4 + 3;
      if (mask.data[alphaIndex] < 128) continue;
      stampErrorTrailPixel(x, y, now);
    }
  }
}

function updateErrorLogo(now, delta) {
  if (!errorLogoOwned) return;
  ensureErrorLogo();
  if (!errorLogo) return;

  const maxX = Math.max(0, getWorldWidth() - ERROR_LOGO_SIZE);
  const maxY = Math.max(0, getWorldHeight() - ERROR_LOGO_SIZE);
  errorLogo.x += errorLogo.vx * delta;
  errorLogo.y += errorLogo.vy * delta;
  if (errorLogo.x <= 0 || errorLogo.x >= maxX) {
    errorLogo.x = Math.max(0, Math.min(maxX, errorLogo.x));
    errorLogo.vx *= -1;
  }
  if (errorLogo.y <= 0 || errorLogo.y >= maxY) {
    errorLogo.y = Math.max(0, Math.min(maxY, errorLogo.y));
    errorLogo.vy *= -1;
  }

  for (const flowery of [...floweries]) {
    const overlaps =
      errorLogo.x < flowery.x + SPRITE_WIDTH &&
      errorLogo.x + ERROR_LOGO_SIZE > flowery.x &&
      errorLogo.y < flowery.y + SPRITE_HEIGHT &&
      errorLogo.y + ERROR_LOGO_SIZE > flowery.y;
    if (!overlaps) continue;

    stampErrorTrailRect(flowery.x, flowery.y, SPRITE_WIDTH, SPRITE_HEIGHT, now);
    squishFlowery(flowery, now);
  }
}

function drawErrorLogoAndTrail(now) {
  if (!errorLogoOwned && errorTrailPixels.size === 0) return;
  if (errorLogoOwned) stampErrorLogoTrail(now);
  if (errorTrailPixels.size > 0) {
    context.fillStyle = `rgb(${ERROR_TRAIL_COLOR}, ${ERROR_TRAIL_COLOR}, ${ERROR_TRAIL_COLOR})`;
    for (const [key, pixel] of errorTrailPixels) {
      const age = now - pixel.touchedAt;
      const ditherProgress = Math.max(
        0,
        Math.min(1, (age - pixel.delay) / ERROR_TRAIL_DITHER_DURATION),
      );
      if (age >= pixel.delay + ERROR_TRAIL_DITHER_DURATION) {
        errorTrailPixels.delete(key);
        continue;
      }
      if (
        ditherProgress > 0 &&
        ERROR_TRAIL_BAYER[
          (Math.floor(pixel.y / ERROR_TRAIL_PIXEL_SIZE) % 8) * 8 +
          (Math.floor(pixel.x / ERROR_TRAIL_PIXEL_SIZE) % 8)
        ] < ditherProgress * 64
      ) continue;

      context.fillRect(pixel.x, pixel.y, ERROR_TRAIL_PIXEL_SIZE, ERROR_TRAIL_PIXEL_SIZE);
    }
  }

  if (errorLogoOwned && errorLogo && errorLogoSprite.complete && errorLogoSprite.naturalWidth) {
    context.save();
    context.imageSmoothingEnabled = false;
    context.drawImage(
      errorLogoSprite,
      Math.round(errorLogo.x),
      Math.round(errorLogo.y),
      ERROR_LOGO_SIZE,
      ERROR_LOGO_SIZE,
    );
    context.restore();
  }
}

function draw(now) {
  if (overloadSequenceActive) return;
  if (!deathMenu.hidden || !saveMenu.hidden || !achievementMenu.hidden) {
    requestAnimationFrame(draw);
    return;
  }

  const screenWidth = getViewWidth();
  const screenHeight = getViewHeight();
  const width = getWorldWidth();
  const height = getWorldHeight();
  const delta = Math.min((now - (lastFrameTime || now)) / 1000, 0.05);
  const flingMargin = Math.hypot(SPRITE_WIDTH, SPRITE_HEIGHT) / 2;
  lastFrameTime = now;
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, screenWidth, screenHeight);
  context.setTransform(
    pixelRatio * sceneZoom,
    0,
    0,
    pixelRatio * sceneZoom,
    -cameraX * pixelRatio * sceneZoom,
    -cameraY * pixelRatio * sceneZoom,
  );

  const autospawnInterval = cheatSpawnRate ?? (autospawnLevel > 0
    ? Math.max(850, 4500 * Math.pow(0.78, autospawnLevel - 1))
    : Infinity);
  const autospawnLimit = cheatSpawnLimit ?? (
    autospawnLevel > 0 ? 14 + (autospawnLevel - 1) * 4 : cheatSpawnRate !== null ? 14 : 0
  );
  if ((autospawnLevel > 0 || cheatSpawnRate !== null) && now >= nextAutospawnAt) {
    const activeCount = floweries.filter((flowery) => !flowery.flung).length;
    if (activeCount < autospawnLimit) addFlowery();
    nextAutospawnAt = now + autospawnInterval;
  }
  for (const spawner of extraFlowerSpawners) {
    if (now < spawner.nextSpawnAt) continue;
    const activeFromSpawner = floweries.filter(
      (flowery) => flowery.sourceSpawner === spawner && !flowery.flung,
    ).length;
    if (activeFromSpawner < FLOWERY_SPAWNER_CAPACITY) addFlowery(spawner);
    spawner.nextSpawnAt = now + FLOWERY_SPAWNER_INTERVAL + Math.random() * 3000;
  }
  updateMonsterbox(now);

  for (const car of cars) {
    if (now >= car.nextTurnAt) {
      car.vy = (Math.random() - 0.5) * 130;
      car.nextTurnAt = now + 900 + Math.random() * 1800;
    }
    car.x += car.vx * delta;
    car.y += car.vy * delta;

    if (width <= CAR_WIDTH) {
      car.x = 0;
      car.vx = 0;
    } else if (car.x <= 0 || car.x >= width - CAR_WIDTH) {
      car.x = Math.max(0, Math.min(width - CAR_WIDTH, car.x));
      car.vx *= -1;
    }
    if (height <= CAR_HEIGHT) {
      car.y = 0;
      car.vy = 0;
    } else if (car.y <= 0 || car.y >= height - CAR_HEIGHT) {
      car.y = Math.max(0, Math.min(height - CAR_HEIGHT, car.y));
      car.vy *= -1;
    }
  }

  updateRalseiCars(delta, width, height);
  let updateCrowdThisFrame = false;
  let crowdSteeringDelta = delta;
  if (now >= nextFloweryCrowdUpdateAt) {
    crowdSteeringDelta = Math.min(0.25, Math.max(
      delta,
      (now - lastFloweryCrowdUpdateAt) / 1000,
    ));
    lastFloweryCrowdUpdateAt = now;
    nextFloweryCrowdUpdateAt = now + 120;
    updateFloweryGroups(now);
    flowerySpatialGrid = createFlowerySpatialGrid();
    updateCrowdThisFrame = true;
  }

  for (let index = floweries.length - 1; index >= 0; index -= 1) {
    const flowery = floweries[index];
    updateFloweryVoiceAudibility(flowery);
    if (flowery.ralseiHeld) continue;

    if (flowery.entering) {
      flowery.x += flowery.vx * delta;
      flowery.y = Math.max(0, (height - SPRITE_HEIGHT) / 2);
      if (flowery.x >= width / 2 + LAMP_WIDTH / 2) {
        flowery.entering = false;
        const angle = Math.random() * Math.PI * 2;
        const speed = 18 + Math.random() * 34;
        flowery.vx = Math.cos(angle) * speed;
        flowery.vy = Math.sin(angle) * speed;
        flowery.nextTurnAt = now + 900 + Math.random() * 2600;
      }
    } else if (
      activeRalsei &&
      now < flowerAnnoyUntil &&
      activeRalsei.mode !== "leaving" &&
      !flowery.flung
    ) {
      const towardX = activeRalsei.x + RALSEI_WIDTH / 2 - (flowery.x + SPRITE_WIDTH / 2);
      const towardY = activeRalsei.y + RALSEI_HEIGHT / 2 - (flowery.y + SPRITE_HEIGHT / 2);
      const distance = Math.hypot(towardX, towardY);
      const approachSpeed = 23;
      flowery.vx = distance > 1 ? (towardX / distance) * approachSpeed : 0;
      flowery.vy = distance > 1 ? (towardY / distance) * approachSpeed : 0;
      flowery.nextTurnAt = now + 260;
    } else if (!flowery.flung && now >= flowery.nextTurnAt) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 18 + Math.random() * 34;
      flowery.vx = Math.cos(angle) * speed;
      flowery.vy = Math.sin(angle) * speed;
      flowery.nextTurnAt = now + 900 + Math.random() * 2600;
    }

    if (updateCrowdThisFrame && !flowery.entering && !flowery.flung) {
      steerFloweryThroughCrowd(flowery, flowerySpatialGrid, crowdSteeringDelta);
    }

    if (now >= flowery.nextPoseAt) {
      let nextFrame = flowery.frame;
      while (nextFrame === flowery.frame) {
        nextFrame = Math.floor(Math.random() * FLOWERY_FRAME_COUNT);
      }
      flowery.frame = nextFrame;
      flowery.nextPoseAt = now + 260 + Math.random() * 650;
    }

    if (!flowery.entering) {
      flowery.x += flowery.vx * delta;
      flowery.y += flowery.vy * delta;
    }

    if (flowery.flung) {
      flowery.rotation += flowery.spin * delta;
      if (
        flowery.x + SPRITE_WIDTH / 2 < -flingMargin ||
        flowery.x + SPRITE_WIDTH / 2 > width + flingMargin ||
        flowery.y + SPRITE_HEIGHT / 2 < -flingMargin ||
        flowery.y + SPRITE_HEIGHT / 2 > height + flingMargin
      ) {
        releaseFlowery(flowery);
        floweries.splice(index, 1);
      }
      continue;
    }

    if (flowery.entering) continue;

    if (width <= SPRITE_WIDTH) {
      flowery.x = 0;
      flowery.vx = 0;
    } else if (flowery.x <= 0 || flowery.x >= width - SPRITE_WIDTH) {
      flowery.x = Math.max(0, Math.min(width - SPRITE_WIDTH, flowery.x));
      flowery.vx *= -1;
    }
    if (height <= SPRITE_HEIGHT) {
      flowery.y = 0;
      flowery.vy = 0;
    } else if (flowery.y <= 0 || flowery.y >= height - SPRITE_HEIGHT) {
      flowery.y = Math.max(0, Math.min(height - SPRITE_HEIGHT, flowery.y));
      flowery.vy *= -1;
    }
  }

  updateErrorLogo(now, delta);
  updateYellow(now, delta, width, height);
  updateYellowBullets(delta, width, height, now);
  updateClark(now, delta, width, height);
  updateKnifeClark(now, delta, width, height);

  for (const car of [...cars, ...ralseiCars]) {
    for (const flowery of floweries) {
      if (flowery.entering || flowery.flung || flowery.ralseiHeld || now < flowery.hitCooldownUntil) continue;
      const overlap =
        flowery.x < car.x + CAR_WIDTH &&
        flowery.x + SPRITE_WIDTH > car.x &&
        flowery.y < car.y + CAR_HEIGHT &&
        flowery.y + SPRITE_HEIGHT > car.y;
      if (!overlap) continue;

      let awayX = flowery.x + SPRITE_WIDTH / 2 - (car.x + CAR_WIDTH / 2);
      let awayY = flowery.y + SPRITE_HEIGHT / 2 - (car.y + CAR_HEIGHT / 2);
      let distance = Math.hypot(awayX, awayY);
      if (distance < 0.001) {
        awayX = car.vx === 0 ? 1 : -Math.sign(car.vx);
        awayY = 0;
        distance = 1;
      }

      const flingSpeed = 650 + Math.random() * 250;
      recordFloweryDeath(flowery, car.isRalsei ? "ralsei-car" : "car");
      flowery.vx = (awayX / distance) * flingSpeed;
      flowery.vy = (awayY / distance) * flingSpeed;
      flowery.flung = true;
      flowery.nextTurnAt = Number.POSITIVE_INFINITY;
      flowery.rotation = 0;
      flowery.spin = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 12);
      flowery.hitCooldownUntil = now + 900;
      playHitVoiceClip(flowery);
      addExplosion(
        flowery.x + SPRITE_WIDTH / 2,
        flowery.y + SPRITE_HEIGHT / 2,
        now,
      );
      playExplosionSound();
    }
  }

  if (flowerySpawnerSprite.complete && flowerySpawnerSprite.naturalWidth) {
    for (const spawner of extraFlowerSpawners) {
      context.drawImage(
        flowerySpawnerSprite,
        Math.round(spawner.x),
        Math.round(spawner.y),
        FLOWERY_SPAWNER_SIZE,
        FLOWERY_SPAWNER_SIZE,
      );
    }
  }

  for (const flowery of floweries) {
    const x = Math.round(flowery.x);
    const y = Math.round(flowery.y);
    const facingLeft = flowery.vx < 0;
    const pose = getPoseFrame(flowery.frame);

    if (!pose.complete || !pose.naturalWidth) continue;

    if (!flowery.entering) {
      drawPixelShadow(
        flowery.x + SPRITE_WIDTH / 2,
        flowery.y + SPRITE_HEIGHT - 3,
        34,
        8,
        0.38,
      );
    }

    context.save();
    if (flowery.entering) {
      entranceContext.clearRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
      entranceContext.globalCompositeOperation = "source-over";
      entranceContext.drawImage(pose, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
      entranceContext.globalCompositeOperation = "destination-out";
      entranceContext.fillStyle = "#000";
      entranceContext.fillRect(
        0,
        0,
        Math.max(0, width / 2 + LAMP_WIDTH / 2 - x),
        SPRITE_HEIGHT,
      );
      if (lampSprite.complete && lampSprite.naturalWidth) {
        entranceContext.drawImage(
          lampSprite,
          getLampX() - LAMP_WIDTH / 2 - x,
          getLampY() - LAMP_HEIGHT / 2 - y,
          LAMP_WIDTH,
          LAMP_HEIGHT,
        );
      }
      entranceContext.globalCompositeOperation = "source-over";
      context.drawImage(entranceCanvas, x, y);
    } else {
      context.translate(x + SPRITE_WIDTH / 2, y + SPRITE_HEIGHT / 2);
      if (flowery.flung) context.rotate(flowery.rotation);
      if (facingLeft) context.scale(-1, 1);
      context.drawImage(
        pose,
        -SPRITE_WIDTH / 2,
        -SPRITE_HEIGHT / 2,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
      );
    }
    context.restore();
    if (now < flowery.talkingUntil) drawFlowerySpeechBubble(flowery);
  }

  for (const car of [...cars, ...ralseiCars]) {
    const sprite = car.isRalsei ? ralseiCarSprite : carSprite;
    if (!sprite.complete || !sprite.naturalWidth) continue;
    const x = Math.round(car.x);
    const y = Math.round(car.y);
    const facingLeft = car.vx < 0;
    context.save();
    if (facingLeft) {
      context.translate(x + CAR_WIDTH, 0);
      context.scale(-1, 1);
    }
    context.drawImage(
      sprite,
      facingLeft ? 0 : x,
      y,
      CAR_WIDTH,
      CAR_HEIGHT,
    );
    context.restore();
  }

  drawClark();
  drawKnifeClark();
  drawYellow();
  drawYellowBullets();

  if (lampSprite.complete && lampSprite.naturalWidth) {
    context.drawImage(
      lampSprite,
      Math.round(getLampX() - LAMP_WIDTH / 2),
      Math.round(getLampY() - LAMP_HEIGHT / 2),
      LAMP_WIDTH,
      LAMP_HEIGHT,
    );
  }
  drawMonsterbox(now);

  for (let index = splats.length - 1; index >= 0; index -= 1) {
    const splat = splats[index];
    const elapsed = Math.max(0, (now - splat.startedAt) / 1000);
    let hasParticles = false;

    for (const particle of splat.particles) {
      if (particle.landedAt === null) {
        particle.vx *= Math.pow(0.76, delta);
        particle.vy += particle.gravity * delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.rotation += particle.spin * delta;
        if (particle.y >= particle.groundY) {
          particle.y = particle.groundY;
          particle.landedAt = now;
          particle.spin = 0;
        }
      }

      let alpha = 1;
      if (particle.landedAt !== null) {
        const fadeProgress =
          (now - particle.landedAt - SPLAT_PARTICLE_LINGER) / SPLAT_PARTICLE_FADE;
        if (fadeProgress >= 1) continue;
        if (fadeProgress > 0) alpha = 1 - fadeProgress;
      }

      hasParticles = true;
      const sway = Math.sin(elapsed * particle.swaySpeed + particle.swayPhase) * particle.sway;
      const drawX = Math.round(Math.max(0, Math.min(width - particle.size, particle.x + sway)));
      const drawY = Math.round(particle.y);
      if (splatParticleSprite.complete && splatParticleSprite.naturalWidth) {
        context.save();
        context.globalAlpha = alpha;
        context.translate(drawX + particle.size / 2, drawY + particle.size / 2);
        context.rotate(particle.rotation);
        context.drawImage(
          splatParticleSprite,
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size,
        );
        context.restore();
      }
    }

    if (!hasParticles) {
      splats.splice(index, 1);
    }
  }

  for (let index = spawnerParticles.length - 1; index >= 0; index -= 1) {
    const particle = spawnerParticles[index];
    particle.age += delta * 1000;
    if (particle.age >= particle.lifetime) {
      spawnerParticles.splice(index, 1);
      if (particle.turnsIntoFlowery) {
        addFlowery(null, {
          x: particle.x - SPRITE_WIDTH / 2,
          y: particle.y - SPRITE_HEIGHT / 2,
        });
      }
      continue;
    }
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 62 * delta;
    if (flowerySpawnerParticleSprite.complete && flowerySpawnerParticleSprite.naturalWidth) {
      context.save();
      context.globalAlpha = 1 - particle.age / particle.lifetime;
      context.drawImage(
        flowerySpawnerParticleSprite,
        Math.round(particle.x - FLOWERY_SPAWNER_PARTICLE_WIDTH / 2),
        Math.round(particle.y - FLOWERY_SPAWNER_PARTICLE_HEIGHT / 2),
        FLOWERY_SPAWNER_PARTICLE_WIDTH,
        FLOWERY_SPAWNER_PARTICLE_HEIGHT,
      );
      context.restore();
    }
  }

  for (let index = explosions.length - 1; index >= 0; index -= 1) {
    const explosion = explosions[index];
    const frameIndex = Math.floor((now - explosion.startedAt) / EXPLOSION_FRAME_MS);
    if (frameIndex >= EXPLOSION_FRAME_COUNT) {
      explosions.splice(index, 1);
      continue;
    }
    const frame = explosionFrames[frameIndex];
    if (frame.complete && frame.naturalWidth) {
      context.drawImage(
        frame,
        explosion.x,
        explosion.y,
        EXPLOSION_WIDTH,
        EXPLOSION_HEIGHT,
      );
    }
  }

  for (let index = swoonEffects.length - 1; index >= 0; index -= 1) {
    const effect = swoonEffects[index];
    const elapsed = now - effect.startedAt;
    if (elapsed >= effect.lifetime) {
      swoonEffects.splice(index, 1);
      continue;
    }
    if (!swoonSprite.complete || !swoonSprite.naturalWidth) continue;
    context.save();
    if (elapsed > effect.lifetime - 450) {
      context.globalAlpha = (effect.lifetime - elapsed) / 450;
    }
    context.drawImage(
      swoonSprite,
      Math.round(effect.x - 48),
      Math.round(effect.y - 48),
      96,
      96,
    );
    context.restore();
  }

  updateRalsei(now, delta, width, height);
  for (let index = clarkShockwaves.length - 1; index >= 0; index -= 1) {
    const wave = clarkShockwaves[index];
    const progress = (now - wave.startedAt) / wave.duration;
    if (progress >= 1) {
      clarkShockwaves.splice(index, 1);
      continue;
    }
    const radius = wave.range * progress;
    const alpha = 1 - progress;
    const style = CLARK_SHOCKWAVE_STYLES[wave.strength];
    context.save();
    context.globalAlpha = alpha;
    context.globalCompositeOperation = "lighter";
    context.shadowColor = style.glow;
    context.shadowBlur = style.blur;
    context.strokeStyle = style.color;
    context.lineWidth = style.width * (1 - progress * 0.45);
    context.beginPath();
    context.arc(wave.x, wave.y, radius, 0, Math.PI * 2);
    context.stroke();
    const secondProgress = Math.max(0, progress - 0.28) / 0.72;
    if (secondProgress > 0) {
      context.globalAlpha = alpha * 0.62;
      context.lineWidth = Math.max(2, style.width * 0.55 - secondProgress * 2);
      context.beginPath();
      context.arc(wave.x, wave.y, wave.range * secondProgress, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  }

  for (let index = laserEffects.length - 1; index >= 0; index -= 1) {
    const laser = laserEffects[index];
    const progress = (now - laser.startedAt) / laser.duration;
    if (progress >= 1) {
      laserEffects.splice(index, 1);
      continue;
    }
    const fade = progress < 0.72 ? 1 : 1 - (progress - 0.72) / 0.28;
    const viewRight = cameraX + screenWidth / sceneZoom;
    const viewBottom = cameraY + screenHeight / sceneZoom;
    context.save();
    context.globalAlpha = Math.max(0, fade);
    context.globalCompositeOperation = "lighter";
    context.strokeStyle = "#00eaff";
    context.lineWidth = 34;
    context.shadowColor = "#00dfff";
    context.shadowBlur = 34;
    context.beginPath();
    if (laser.orientation === "horizontal") {
      context.moveTo(cameraX, laser.coordinate);
      context.lineTo(viewRight, laser.coordinate);
    } else {
      context.moveTo(laser.coordinate, cameraY);
      context.lineTo(laser.coordinate, viewBottom);
    }
    context.stroke();
    context.strokeStyle = "#f4ffff";
    context.lineWidth = 8;
    context.shadowBlur = 16;
    context.stroke();
    context.restore();
  }

  drawErrorLogoAndTrail(now);

  const visibleFloweryCount = floweries.filter((flowery) =>
    isWorldRectVisible(flowery.x, flowery.y, SPRITE_WIDTH, SPRITE_HEIGHT),
  ).length;
  updateFloweryCounter(visibleFloweryCount);
  if (visibleFloweryCount > getFloweryLimit()) {
    beginFloweryOverload();
    return;
  }
  requestAnimationFrame(draw);
}

function getFloweryAt(x, y) {
  for (let index = floweries.length - 1; index >= 0; index -= 1) {
    const flowery = floweries[index];
    if (flowery.flung) continue;
    if (flowery.entering && x < getLampX() + LAMP_WIDTH / 2) continue;
    const offsetX = x - (flowery.x + SPRITE_WIDTH / 2);
    const offsetY = y - (flowery.y + SPRITE_HEIGHT / 2);
    const rotation = flowery.flung ? flowery.rotation : 0;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const localX = offsetX * cosine + offsetY * sine;
    const localY = -offsetX * sine + offsetY * cosine;
    if (
      Math.abs(localX) <= SPRITE_WIDTH / 2 &&
      Math.abs(localY) <= SPRITE_HEIGHT / 2
    ) {
      return flowery;
    }
  }
  return null;
}

function isPointOnMonsterbox(x, y) {
  return getMonsterboxPositions().some((position) =>
    x >= position.x &&
    x <= position.x + MONSTERBOX_SIZE &&
    y >= position.y &&
    y <= position.y + MONSTERBOX_SIZE,
  );
}

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  if (biggerSceneOwned && panMode) {
    activePan = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
    event.preventDefault();
    return;
  }
  const bounds = canvas.getBoundingClientRect();
  const screenX = event.clientX - bounds.left;
  const screenY = event.clientY - bounds.top;
  const { x, y } = worldPointFromScreen(screenX, screenY);
  if (isPointOnMonsterbox(x, y)) {
    monsterboxInactive = !monsterboxInactive;
    monsterboxNextSpawnAt = performance.now() + getMonsterboxInterval();
    saveEconomy();
    updateShopUI();
    return;
  }
  if (yellowAimMode && yellowCompanion) {
    aimYellowGun(Math.atan2(
      y - yellowCompanion.gunY,
      x - yellowCompanion.gunX,
    ));
    yellowCompanion.manualAimUntil = performance.now() + 5000;
    yellowAimMode = false;
    aimGunButton.classList.remove("is-aiming");
    shopStatus.textContent = "Gun aimed. Press shoot, or Yellow will fire on his own.";
    return;
  }
  if (toolbarOwned && selectedAttackTool !== "squish") {
    if (selectedAttackTool === "lazer") {
      useLaser(x, y, performance.now());
    } else if (selectedAttackTool === "roaring blade") {
      useRoaringBlade(x, y, screenX, screenY);
    }
    return;
  }
  const flowery = getFloweryAt(x, y);
  if (flowery) squishFlowery(flowery, performance.now());
});

canvas.addEventListener("pointermove", (event) => {
  if (activePan && activePan.pointerId === event.pointerId) {
    cameraX -= (event.clientX - activePan.lastX) / sceneZoom;
    cameraY -= (event.clientY - activePan.lastY) / sceneZoom;
    activePan.lastX = event.clientX;
    activePan.lastY = event.clientY;
    clampCamera();
    updateSceneBackground();
    canvas.style.cursor = "grabbing";
    return;
  }
  if (biggerSceneOwned && panMode) {
    canvas.style.cursor = "grab";
    return;
  }
  const bounds = canvas.getBoundingClientRect();
  const point = worldPointFromScreen(
    event.clientX - bounds.left,
    event.clientY - bounds.top,
  );
  const flowery = getFloweryAt(point.x, point.y);
  const specialAttack = toolbarOwned && selectedAttackTool !== "squish";
  canvas.style.cursor = isPointOnMonsterbox(point.x, point.y)
    ? "pointer"
    : yellowAimMode || specialAttack
    ? "crosshair"
    : flowery ? "pointer" : "default";
});

function finishPan(event) {
  if (!activePan || activePan.pointerId !== event.pointerId) return;
  activePan = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  canvas.style.cursor = panMode ? "grab" : "default";
}

canvas.addEventListener("pointerup", finishPan);
canvas.addEventListener("pointercancel", finishPan);
canvas.addEventListener("wheel", (event) => {
  if (!biggerSceneOwned) return;
  event.preventDefault();
  const bounds = canvas.getBoundingClientRect();
  const screenX = event.clientX - bounds.left;
  const screenY = event.clientY - bounds.top;
  zoomAt(screenX, screenY, sceneZoom * Math.exp(-event.deltaY * 0.001));
}, { passive: false });

function playRandomClip(flowery) {
  if (flowery.silenced) return;
  clearTimeout(flowery.voiceTimer);
  flowery.voiceTimer = null;
  if (bladeAudioPaused) {
scheduleNextClip(flowery);
    return;
  }
  if (!isFloweryVoiceAudible(flowery)) return;
  let index = Math.floor(Math.random() * voiceClips.length);
  if (voiceClips.length > 1 && index === flowery.lastClip) {
    index = (index + 1 + Math.floor(Math.random() * (voiceClips.length - 1))) % voiceClips.length;
  }
  flowery.lastClip = index;
  flowery.audio.src = voiceClips[index];
  flowery.audioHasClip = true;
  flowery.audio.volume =
    audioSettings.voice * getFloweryVoiceVolumeFactor(flowery);
  flowery.audio.play().catch(() => scheduleNextClip(flowery));
}

function scheduleNextClip(flowery) {
  if (
    flowery.silenced ||
    flowery.voiceTimer !== null ||
    (!bladeAudioPaused && !isFloweryVoiceAudible(flowery))
  ) return;
  flowery.voiceTimer = window.setTimeout(() => {
    flowery.voiceTimer = null;
    playRandomClip(flowery);
  }, 1300 + Math.random() * 3200);
}

spawnButton.addEventListener("click", () => {
  startAudioGraph();
  addFlowery();
});

function performRebirth() {
  if (!getRunUpgradeProgress().maxed) return;
  const restartDrawLoop = overloadSequenceActive || !gameOverScreen.hidden;

  for (const flowery of floweries) releaseFlowery(flowery);
  for (const stopEffect of [...activeSoundEffects]) stopEffect();
  ralseiVoice.pause();
  ralseiVoice.currentTime = 0;
  floweries.length = 0;
  floweryGroups.length = 0;
  yellowBullets.length = 0;
  cars.length = 0;
  ralseiCars.length = 0;
  extraFlowerSpawners.length = 0;
  explosions.length = 0;
  splats.length = 0;
  swoonEffects.length = 0;
  laserEffects.length = 0;
  clarkShockwaves.length = 0;
  spawnerParticles.length = 0;
  errorTrailPixels.clear();
  errorLogo = null;

  floweyCurrency = 0;
  autospawnLevel = 0;
  yellowOwned = false;
  biggerSceneOwned = false;
  carOwned = false;
  clarkOwned = false;
  clarkKnifeOwned = false;
  errorLogoOwned = false;
  toolbarOwned = false;
  monsterboxOwned = false;
  monsterboxInactive = false;
  monsterboxRateLevel = 0;
  extraSpawnerCount = rebirthExtraSpawners;
  selectedAttackTool = "squish";
  yellowAimMode = false;
  yellowCompanion = null;
  clarkCompanion = null;
  knifeClarkCompanion = null;
  panMode = false;
  activePan = null;
  sceneZoom = 1;
  cameraX = 0;
  cameraY = 0;
  sceneOriginX = 0;
  sceneOriginY = 0;
  monsterboxNextSpawnAt = hasMonsterboxes()
    ? performance.now() + getMonsterboxInterval()
    : 0;

  rebirthCount += 1;
  rebirthPoints += 1;
  addAchievementProgress("rebirths");

  const now = performance.now();
  nextAutospawnAt = 0;
  activeRalsei = null;
  flowerAnnoyUntil = 0;
  nextFlowerAnnoyAt = Number.POSITIVE_INFINITY;
  ralseiNextAt = now + 6500 + Math.random() * 8000;
  ralseiLine.hidden = true;
  ralseiLine.classList.remove("is-important");
  nextFloweryGroupAt = now + 8000 + Math.random() * 6000;
  nextFloweryCrowdUpdateAt = 0;
  lastFloweryCrowdUpdateAt = now;
  flowerySpatialGrid = null;
  lastFrameTime = 0;
  lastFloweryCount = -1;
  slashOverlay.hidden = true;
  slashAttackActive = false;
  bladeAudioPaused = false;
  gameScene.inert = false;
  shopPanel.inert = false;
  gameScene.hidden = false;
  deathMenu.hidden = true;
  overloadOverlay.hidden = true;
  gameOverScreen.hidden = true;
  overloadSequenceActive = false;

  for (let index = 0; index < extraSpawnerCount; index += 1) {
    addFlowerySpawner(index);
  }
  clampCamera();
  updateSceneNavigationUI();
  updateSceneBackground();
  updateFloweryCounter(0);
  saveEconomy();
  updateShopUI();
  spawnButton.focus();
  if (restartDrawLoop) requestAnimationFrame(draw);
}

rebirthButton.addEventListener("click", performRebirth);

buyRebirthBoxesButton.addEventListener("click", () => {
  if (
    rebirthExtraBoxes >= REBIRTH_EXTRA_BOX_LIMIT ||
    rebirthPoints < REBIRTH_BOX_COST
  ) return;
  const alreadyHasBoxes = hasMonsterboxes();
  rebirthPoints -= REBIRTH_BOX_COST;
  rebirthExtraBoxes += 1;
  if (!alreadyHasBoxes) {
    monsterboxNextSpawnAt = performance.now() + getMonsterboxInterval();
  }
  saveEconomy();
  updateShopUI();
});

buyRebirthSpawnerButton.addEventListener("click", () => {
  if (
    rebirthExtraSpawners >= REBIRTH_EXTRA_SPAWNER_LIMIT ||
    rebirthPoints < REBIRTH_SPAWNER_COST
  ) return;
  rebirthPoints -= REBIRTH_SPAWNER_COST;
  rebirthExtraSpawners += 1;
  addFlowerySpawner(extraSpawnerCount);
  extraSpawnerCount += 1;
  saveEconomy();
  updateShopUI();
});

buyRebirthCurrencyButton.addEventListener("click", () => {
  if (rebirthCurrencyBoostOwned || rebirthPoints < REBIRTH_CURRENCY_COST) return;
  rebirthPoints -= REBIRTH_CURRENCY_COST;
  rebirthCurrencyBoostOwned = true;
  saveEconomy();
  updateShopUI();
});

buyRebirthLimitButton.addEventListener("click", () => {
  if (
    rebirthMaxFloweryLevels >= REBIRTH_MAX_FLOWERY_LEVELS ||
    rebirthPoints < REBIRTH_LIMIT_COST
  ) return;
  rebirthPoints -= REBIRTH_LIMIT_COST;
  rebirthMaxFloweryLevels += 1;
  saveEconomy();
  updateShopUI();
  const visibleCount = floweries.filter((flowery) =>
    isWorldRectVisible(flowery.x, flowery.y, SPRITE_WIDTH, SPRITE_HEIGHT),
  ).length;
  updateFloweryCounter(visibleCount);
});

buyMonsterboxButton.addEventListener("click", () => {
  if (monsterboxOwned || floweyCurrency < MONSTERBOX_PRICE) return;
  floweyCurrency -= MONSTERBOX_PRICE;
  monsterboxOwned = true;
  unlockAchievement("monsterbox");
  monsterboxNextSpawnAt = performance.now() + getMonsterboxInterval();
  saveEconomy();
  updateShopUI();
});

upgradeMonsterboxRateButton.addEventListener("click", () => {
  if (!hasMonsterboxes() || monsterboxRateLevel >= MONSTERBOX_RATE_MAX_LEVEL) return;
  const price = MONSTERBOX_RATE_PRICES[monsterboxRateLevel];
  if (floweyCurrency < price) return;
  floweyCurrency -= price;
  monsterboxRateLevel += 1;
  if (monsterboxRateLevel >= MONSTERBOX_RATE_MAX_LEVEL) unlockAchievement("monsterbox_max");
  monsterboxNextSpawnAt = performance.now() + getMonsterboxInterval();
  saveEconomy();
  updateShopUI();
});

buyToolbarButton.addEventListener("click", () => {
  if (toolbarOwned || floweyCurrency < TOOLBAR_PRICE) return;
  floweyCurrency -= TOOLBAR_PRICE;
  toolbarOwned = true;
  unlockAchievement("toolbar");
  saveEconomy();
  updateShopUI();
});

toolbarControls.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedAttackTool = button.dataset.tool;
    toolbarControls.querySelectorAll("[data-tool]").forEach((toolButton) => {
      toolButton.setAttribute("aria-pressed", String(toolButton === button));
    });
    updateShopUI();
  });
});

buySpawnerButton.addEventListener("click", () => {
  if (extraSpawnerCount >= getFlowerySpawnerLimit()) return;
  const price = FLOWERY_SPAWNER_BASE_PRICE +
    FLOWERY_SPAWNER_PRICE_STEP * extraSpawnerCount;
  if (floweyCurrency < price) return;
  addFlowerySpawner(extraSpawnerCount);
  extraSpawnerCount += 1;
  if (extraSpawnerCount >= MAX_FLOWERY_SPAWNERS) unlockAchievement("spawner_network");
  floweyCurrency -= price;
  saveEconomy();
  updateShopUI();
});

buyAutospawnButton.addEventListener("click", () => {
  if (autospawnLevel >= AUTOSPAWN_MAX_LEVEL) return;
  const price = AUTOSPAWN_PRICE * (autospawnLevel + 1);
  if (floweyCurrency < price) return;
  const firstPurchase = autospawnLevel === 0;
  floweyCurrency -= price;
  autospawnLevel += 1;
  if (firstPurchase) unlockAchievement("automation");
  if (autospawnLevel >= AUTOSPAWN_MAX_LEVEL) unlockAchievement("full_throttle");
  const interval = Math.max(850, 4500 * Math.pow(0.78, autospawnLevel - 1));
  nextAutospawnAt = performance.now() + interval;
  if (firstPurchase) addFlowery();
  saveEconomy();
  updateShopUI();
});

buyBiggerSceneButton.addEventListener("click", () => {
  if (biggerSceneOwned || floweyCurrency < BIGGER_SCENE_PRICE) return;
  floweyCurrency -= BIGGER_SCENE_PRICE;
  biggerSceneOwned = true;
  unlockAchievement("room_to_bloom");
  expandSceneAroundCurrentView();
  saveEconomy();
  updateShopUI();
});

panSceneButton.addEventListener("click", () => {
  if (!biggerSceneOwned) return;
  panMode = !panMode;
  activePan = null;
  canvas.style.cursor = panMode ? "grab" : "default";
  updateSceneNavigationUI();
});

zoomOutButton.addEventListener("click", () => {
  zoomAt(getViewWidth() / 2, getViewHeight() / 2, sceneZoom / 1.2);
});

zoomInButton.addEventListener("click", () => {
  zoomAt(getViewWidth() / 2, getViewHeight() / 2, sceneZoom * 1.2);
});

buyYellowButton.addEventListener("click", () => {
  if (yellowOwned || floweyCurrency < YELLOW_PRICE) return;
  floweyCurrency -= YELLOW_PRICE;
  yellowOwned = true;
  unlockAchievement("yellow_friend");
  createYellow();
  saveEconomy();
  updateShopUI();
});

buyCarButton.addEventListener("click", () => {
  if (carOwned || floweyCurrency < CAR_PRICE) return;
  floweyCurrency -= CAR_PRICE;
  carOwned = true;
  unlockAchievement("buy_a_car");
  addCar();
  saveEconomy();
  updateShopUI();
});

buyClarkButton.addEventListener("click", () => {
  if (clarkOwned || floweyCurrency < CLARK_PRICE) return;
  floweyCurrency -= CLARK_PRICE;
  clarkOwned = true;
  unlockAchievement("clark");
  createClark();
  saveEconomy();
  updateShopUI();
});

buyClarkKnifeButton.addEventListener("click", () => {
  if (clarkKnifeOwned || floweyCurrency < CLARK_KNIFE_PRICE) return;
  floweyCurrency -= CLARK_KNIFE_PRICE;
  clarkKnifeOwned = true;
  unlockAchievement("knife_clark");
  createKnifeClark();
  saveEconomy();
  updateShopUI();
});

buyErrorLogoButton.addEventListener("click", () => {
  if (errorLogoOwned || floweyCurrency < ERROR_LOGO_PRICE) return;
  floweyCurrency -= ERROR_LOGO_PRICE;
  errorLogoOwned = true;
  unlockAchievement("error_logo");
  ensureErrorLogo();
  saveEconomy();
  updateShopUI();
});

function writeCheatsConsole(message) {
  const lines = cheatsConsoleOutput.textContent
    ? cheatsConsoleOutput.textContent.split("\n")
    : [];
  lines.push(...String(message).split("\n"));
  cheatsConsoleOutput.textContent = lines.slice(-CHEATS_CONSOLE_MAX_LINES).join("\n");
  cheatsConsoleOutput.scrollTop = cheatsConsoleOutput.scrollHeight;
}

function captureCurrentSave() {
  return {
    economy: captureEconomySnapshot(),
    deadFloweries: deadFloweries.map((record) => ({ ...record })),
    audioSettings: { ...audioSettings },
  };
}

function formatSaveDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

function addSaveCard(save, saveCount) {
  const isActive = save.id === activeSaveId;
  const economy = save.snapshot?.economy;
  const deaths = save.snapshot?.deadFloweries?.length || 0;
  const card = document.createElement("article");
  card.className = `save-card${save.cheats ? " is-cheat-save" : ""}${isActive ? " is-active-save" : ""}`;
  card.setAttribute("role", "listitem");

  const heading = document.createElement("div");
  heading.className = "save-card-heading";
  const name = document.createElement("strong");
  name.textContent = save.title || "Save";
  const mode = document.createElement("span");
  mode.textContent = save.cheats ? "cheats enabled!" : isActive ? "CURRENT SAVE" : "NORMAL";
  heading.append(name, mode);

  const details = document.createElement("p");
  details.textContent = `${Number(economy?.currency || 0).toLocaleString()} currency · ${Number(deaths || 0).toLocaleString()} defeats · ${Number(economy?.rebirthCount || 0)} rebirths`;
  const timestamp = document.createElement("small");
  timestamp.textContent = save.updatedAt
    ? `Saved ${formatSaveDate(save.updatedAt)}`
    : save.createdAt ? `Created ${formatSaveDate(save.createdAt)}` : "Autosaved in this browser";
  const actions = document.createElement("div");
  actions.className = "save-card-actions";
  const loadButton = document.createElement("button");
  loadButton.type = "button";
  loadButton.textContent = isActive ? "playing" : "load";
  loadButton.disabled = isActive;
  loadButton.addEventListener("click", () => activateSave(save.id));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "delete";
  deleteButton.disabled = saveCount <= 1;
  deleteButton.addEventListener("click", () => deleteSave(save.id));
  actions.append(loadButton, deleteButton);
  card.append(heading, details, timestamp, actions);
  saveList.append(card);
}

function renderSaveMenu() {
  saveList.replaceChildren();
  const saves = readSaveSlots();
  const activeSave = saves.find((save) => save.id === activeSaveId);
  saveMenuStatus.textContent = activeSave?.cheats
    ? "Autosaving is paused for this cheats save."
    : "Choose a save to continue, or start a new game.";
  saves.forEach((save) => addSaveCard(save, saves.length));
  emptySaveList.hidden = saves.length > 0;
}

function activateSave(saveId) {
  if (!readSaveSlots().some((save) => save.id === saveId)) return;
  try {
    localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, saveId);
  } catch {
    saveMenuStatus.textContent = "Could not switch saves in this browser.";
    return;
  }
  window.location.reload();
}

function deleteSave(saveId) {
  const saves = readSaveSlots();
  if (saves.length <= 1) return;
  const remainingSaves = saves.filter((save) => save.id !== saveId);
  if (remainingSaves.length === saves.length) return;
  try {
    writeSaveSlots(remainingSaves);
    if (saveId === activeSaveId) {
      activeSaveId = remainingSaves[0].id;
      localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, activeSaveId);
      window.location.reload();
      return;
    }
  } catch {
    saveMenuStatus.textContent = "Could not delete that save in this browser.";
    return;
  }
  renderSaveMenu();
}

function startNewSave() {
  const saves = readSaveSlots();
  const existingNumbers = new Set(
    saves.map((save) => Number(save.title?.match(/^New save (\d+)$/)?.[1])).filter(Number.isFinite),
  );
  let nextNumber = 1;
  while (existingNumbers.has(nextNumber)) nextNumber += 1;
  const now = new Date().toISOString();
  const newSave = {
    id: `save-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: `New save ${nextNumber}`,
    createdAt: now,
    updatedAt: now,
    cheats: false,
    snapshot: {
      economy: {},
      deadFloweries: [],
      audioSettings: {},
    },
  };
  try {
    writeSaveSlots([...saves, newSave]);
    localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, newSave.id);
  } catch {
    saveMenuStatus.textContent = "Could not start a new save in this browser.";
    return;
  }
  window.location.reload();
}

function updateCheatsConsoleMode() {
  cheatsConsoleMode.textContent = cheatsEnabled ? "CHEATS ENABLED · NO SAVING" : "SAVING ENABLED";
  cheatsConsoleMode.classList.toggle("is-cheats-locked", cheatsEnabled);
  cheatsStatus.hidden = !cheatsEnabled;
  if (cheatsEnabled) renderSaveMenu();
}

function enableCheats() {
  if (cheatsEnabled) {
    writeCheatsConsole("sv_cheats is already 1. Saving is paused.");
    return;
  }
  let previousSlots = null;
  let previousActiveId = null;
  let createdCheatSaveId = null;
  try {
    previousSlots = localStorage.getItem(SAVE_SLOTS_STORAGE_KEY);
    previousActiveId = localStorage.getItem(ACTIVE_SAVE_STORAGE_KEY);
    const saves = readSaveSlots();
    const now = new Date().toISOString();
    const cheatSave = {
      id: `cheats-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: "Cheats copy",
      createdAt: now,
      updatedAt: now,
      cheats: true,
      snapshot: captureCurrentSave(),
    };
    createdCheatSaveId = cheatSave.id;
    writeSaveSlots([...saves, cheatSave]);
    localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, cheatSave.id);
    if (!readSaveSlots().some((save) => save.id === cheatSave.id && save.cheats)) {
      throw new Error("Cheats save copy could not be verified.");
    }
    localStorage.setItem(CHEATS_LOCK_STORAGE_KEY, "1");
    if (localStorage.getItem(CHEATS_LOCK_STORAGE_KEY) !== "1") {
      throw new Error("Cheat lock could not be verified.");
    }
  } catch {
    try {
      if (previousSlots === null) localStorage.removeItem(SAVE_SLOTS_STORAGE_KEY);
      else localStorage.setItem(SAVE_SLOTS_STORAGE_KEY, previousSlots);
      if (previousActiveId === null) localStorage.removeItem(ACTIVE_SAVE_STORAGE_KEY);
      else localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, previousActiveId);
    } catch {
      // Keep the original storage failure visible in the console.
    }
    writeCheatsConsole("ERROR: could not create the cheats save copy. Cheats were not enabled.");
    return;
  }
  activeSaveId = createdCheatSaveId || activeSaveId;
  cheatsEnabled = true;
  updateCheatsConsoleMode();
  renderSaveMenu();
  writeCheatsConsole("sv_cheats = 1");
  writeCheatsConsole("CHEATS SAVE COPY CREATED. Progress and settings will not be saved from now on.");
}

function requestCheatsConfirmation() {
  pendingCheatsConfirmation = true;
  cheatsConfirm.hidden = false;
  confirmCheatsButton.focus();
}

function executeCheatsConsoleCommand(rawCommand) {
  const args = rawCommand.trim().split(/\s+/).filter(Boolean);
  if (args.length === 0) return;
  const command = args[0].toLowerCase();

  if (command === "sv_cheats") {
    if (args[1] === "1" && args.length === 2) {
      if (cheatsEnabled) enableCheats();
      else requestCheatsConfirmation();
    } else if (args[1] === "0") {
      writeCheatsConsole("sv_cheats cannot be turned off in this save. Load a normal save from the save menu.");
    } else {
      writeCheatsConsole(`sv_cheats = ${cheatsEnabled ? "1" : "0"}`);
    }
    return;
  }

  if (command === "help") {
    writeCheatsConsole([
      "HELP  - show this list",
      "STATUS - show current game state",
      "SV_CHEATS 1 - create a cheats save copy and enable debug commands",
      "SPAWN [count] - spawn 1 to 100 floweries",
      "GIVE CURRENCY <amount> - add currency",
      "SET SPAWNRATE <seconds|default> - set automatic spawn interval",
      "SET SPAWNLIMIT <count|default> - set active automatic spawn limit",
      "CLEAR FLOWERIES - remove all current floweries",
    ].join("\n"));
    if (!cheatsEnabled) writeCheatsConsole("Debug commands are locked. Enter SV_CHEATS 1 to enable them.");
    return;
  }

  if (command === "status") {
    writeCheatsConsole([
      `sv_cheats: ${cheatsEnabled ? "1 (SAVING PAUSED)" : "0"}`,
      `floweries: ${floweries.length}`,
      `currency: ${floweyCurrency}`,
      `automatic spawn rate: ${cheatSpawnRate === null ? "default" : `${(cheatSpawnRate / 1000).toFixed(2)}s`}`,
      `automatic spawn limit: ${cheatSpawnLimit === null ? "default" : cheatSpawnLimit}`,
    ].join("\n"));
    return;
  }

  if (!cheatsEnabled) {
    writeCheatsConsole("Command locked. Enter SV_CHEATS 1 to enable debug commands.");
    return;
  }

  if (command === "spawn") {
    const count = args[1] === undefined ? 1 : Number(args[1]);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      writeCheatsConsole("Usage: SPAWN [count] (1-100)");
      return;
    }
    for (let index = 0; index < count; index += 1) addFlowery();
    writeCheatsConsole(`Spawned ${count} ${count === 1 ? "flowery" : "floweries"}.`);
    return;
  }

  if (command === "give" && args[1]?.toLowerCase() === "currency") {
    const amount = Number(args[2]);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
      writeCheatsConsole("Usage: GIVE CURRENCY <amount> (0-1000000000)");
      return;
    }
    floweyCurrency += amount;
    updateShopUI();
    writeCheatsConsole(`Currency increased by ${amount}.`);
    return;
  }

  if (command === "set" && args[1]?.toLowerCase() === "spawnrate") {
    const value = args[2]?.toLowerCase();
    if (value === "default") {
      cheatSpawnRate = null;
      nextAutospawnAt = autospawnLevel > 0
        ? performance.now() + Math.max(850, 4500 * Math.pow(0.78, autospawnLevel - 1))
        : 0;
      writeCheatsConsole("Automatic spawn rate reset to default.");
      return;
    }
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds < 0.1 || seconds > 3600) {
      writeCheatsConsole("Usage: SET SPAWNRATE <seconds|default> (0.1-3600)");
      return;
    }
    cheatSpawnRate = seconds * 1000;
    nextAutospawnAt = performance.now() + cheatSpawnRate;
    writeCheatsConsole(`Automatic spawn rate set to ${seconds}s.`);
    return;
  }

  if (command === "set" && args[1]?.toLowerCase() === "spawnlimit") {
    const value = args[2]?.toLowerCase();
    if (value === "default") {
      cheatSpawnLimit = null;
      writeCheatsConsole("Automatic spawn limit reset to default.");
      return;
    }
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1 || limit > FLOWERY_OVERLOAD_LIMIT) {
      writeCheatsConsole(`Usage: SET SPAWNLIMIT <count|default> (1-${FLOWERY_OVERLOAD_LIMIT})`);
      return;
    }
    cheatSpawnLimit = limit;
    writeCheatsConsole(`Automatic spawn limit set to ${limit}.`);
    return;
  }

  if (command === "clear" && args[1]?.toLowerCase() === "floweries") {
    for (const flowery of floweries) releaseFlowery(flowery);
    floweries.length = 0;
    floweryGroups.length = 0;
    flowerySpatialGrid = null;
    updateFloweryCounter(0);
    writeCheatsConsole("All floweries removed.");
    return;
  }

  writeCheatsConsole(`Unknown command: ${args[0]}. Type HELP for commands.`);
}

function toggleCheatsConsole() {
  cheatsConsole.hidden = !cheatsConsole.hidden;
  if (!cheatsConsole.hidden) {
    updateCheatsConsoleMode();
    if (!cheatsConsoleOutput.textContent) {
      writeCheatsConsole("BIOS DEBUG CONSOLE [Version 1.0]");
      writeCheatsConsole("Type HELP to list commands.");
      if (cheatsEnabled) writeCheatsConsole("SV_CHEATS 1 ACTIVE. SAVING PAUSED.");
    }
    cheatsConsoleInput.focus();
  } else {
    cheatsConsoleInput.blur();
  }
}

cheatsConsoleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (pendingCheatsConfirmation) return;
  const command = cheatsConsoleInput.value.trim();
  if (!command) return;
  writeCheatsConsole(`A:\\> ${command}`);
  executeCheatsConsoleCommand(command);
  cheatsConsoleInput.value = "";
});

confirmCheatsButton.addEventListener("click", () => {
  pendingCheatsConfirmation = false;
  cheatsConfirm.hidden = true;
  enableCheats();
  cheatsConsoleInput.focus();
});

cancelCheatsButton.addEventListener("click", () => {
  pendingCheatsConfirmation = false;
  cheatsConfirm.hidden = true;
  writeCheatsConsole("sv_cheats activation cancelled.");
  cheatsConsoleInput.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.code !== "Backquote" || event.ctrlKey || event.altKey || event.metaKey) return;
  const target = event.target;
  const isEditingElsewhere = target !== cheatsConsoleInput && (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable
  );
  if (isEditingElsewhere) return;
  event.preventDefault();
  toggleCheatsConsole();
});

settingsButton.addEventListener("click", () => {
  settingsPanel.hidden = false;
  volumeControls.voice.input.focus();
});

function closeAudioSettings() {
  settingsPanel.hidden = true;
  settingsButton.focus();
}

closeSettingsButton.addEventListener("click", closeAudioSettings);
settingsPanel.addEventListener("click", (event) => {
  if (event.target === settingsPanel) closeAudioSettings();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settingsPanel.hidden) closeAudioSettings();
});
for (const [channel, control] of Object.entries(volumeControls)) {
  control.input.addEventListener("input", () => setAudioVolume(channel, control.input.value));
}

aimGunButton.addEventListener("click", () => {
  if (!yellowCompanion) return;
  yellowAimMode = !yellowAimMode;
  aimGunButton.classList.toggle("is-aiming", yellowAimMode);
  shopStatus.textContent = yellowAimMode
    ? "Click anywhere in the scene to move Yellow's gun."
    : "Yellow will keep aiming and firing on his own.";
});

shootGunButton.addEventListener("click", () => {
  if (!yellowCompanion) return;
  yellowCompanion.manualAimUntil = performance.now() + 5000;
  fireYellowBullet();
});

deathMenuButton.addEventListener("click", () => {
  renderGraveyard();
  gameScene.hidden = true;
  deathMenu.hidden = false;
  graveyard.scrollTop = 0;
  returnToGameButton.focus();
});

returnToGameButton.addEventListener("click", () => {
  deathMenu.hidden = true;
  gameScene.hidden = false;
  deathMenuButton.focus();
});

saveMenuButton.addEventListener("click", () => {
  renderSaveMenu();
  gameScene.hidden = true;
  saveMenu.hidden = false;
  closeSaveMenuButton.focus();
});

closeSaveMenuButton.addEventListener("click", () => {
  saveMenu.hidden = true;
  gameScene.hidden = false;
  saveMenuButton.focus();
});

newSaveButton.addEventListener("click", startNewSave);

achievementMenuButton.addEventListener("click", () => {
  renderAchievementMenu();
  gameScene.hidden = true;
  achievementMenu.hidden = false;
  closeAchievementsButton.focus();
});

closeAchievementsButton.addEventListener("click", () => {
  achievementMenu.hidden = true;
  gameScene.hidden = false;
  achievementMenuButton.focus();
});

errorSecretTrigger.addEventListener("click", dismissStartupErrorSecret);
errorSecretTrigger.addEventListener("pointerdown", (event) => event.stopPropagation());

tryAgainButton.addEventListener("click", () => {
  floweyCurrency = Math.floor(floweyCurrency * 0.75);
  for (const flowery of floweries) releaseFlowery(flowery);
  floweries.length = 0;
  floweryGroups.length = 0;
  yellowBullets.length = 0;
  ralseiCars.length = 0;
  explosions.length = 0;
  splats.length = 0;
  swoonEffects.length = 0;
  laserEffects.length = 0;
  clarkShockwaves.length = 0;
  spawnerParticles.length = 0;
  monsterboxNextSpawnAt = hasMonsterboxes()
    ? performance.now() + getMonsterboxInterval()
    : 0;

  activeRalsei = null;
  flowerAnnoyUntil = 0;
  nextFlowerAnnoyAt = Number.POSITIVE_INFINITY;
  ralseiNextAt = performance.now() + 6500 + Math.random() * 8000;
  ralseiLine.hidden = true;
  ralseiLine.classList.remove("is-important");

  const now = performance.now();
  nextAutospawnAt = autospawnLevel > 0
    ? now + Math.max(850, 4500 * Math.pow(0.78, autospawnLevel - 1))
    : 0;
  for (const spawner of extraFlowerSpawners) {
    spawner.nextSpawnAt = now + 800 + Math.random() * 1200;
  }
  nextFloweryGroupAt = now + 8000 + Math.random() * 6000;
  nextFloweryCrowdUpdateAt = 0;
  lastFloweryCrowdUpdateAt = now;
  flowerySpatialGrid = null;
  lastFrameTime = 0;

  if (biggerSceneOwned) {
    cameraX = getViewWidth() / 2;
    cameraY = getViewHeight() / 2;
  } else {
    cameraX = 0;
    cameraY = 0;
  }
  sceneZoom = 1;
  panMode = false;
  activePan = null;
  clampCamera();
  updateSceneNavigationUI();
  updateSceneBackground();
  updateFloweryCounter(0);
  gameScene.inert = false;
  shopPanel.inert = false;
  gameOverScreen.hidden = true;
  overloadOverlay.hidden = true;
  overloadSequenceActive = false;
  saveEconomy();
  updateShopUI();
  spawnButton.focus();
  requestAnimationFrame(draw);
});

window.addEventListener("resize", resizeCanvas);
updateCheatsConsoleMode();
resizeCanvas();
if (carOwned) addCar();
if (clarkOwned) createClark();
if (clarkKnifeOwned) createKnifeClark();
for (let index = 0; index < extraSpawnerCount; index += 1) {
  addFlowerySpawner(index);
}
if (autospawnLevel > 0) {
  nextAutospawnAt = performance.now() + Math.max(850, 4500 * Math.pow(0.78, autospawnLevel - 1));
}
if (hasMonsterboxes()) {
  monsterboxNextSpawnAt = performance.now() + getMonsterboxInterval();
}
if (yellowOwned) createYellow();
updateShopUI();
updateDeathCount();
requestAnimationFrame(draw);
