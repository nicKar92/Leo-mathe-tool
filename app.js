"use strict";

const STORAGE_KEY = "matheQuestHamburg_v1";

const TOPICS = [
  { id: "fractions", label: "Brüche", district: "Wellingsbuettel", icon: "🍕" },
  { id: "percent", label: "Prozent", district: "Poppenbuettel", icon: "💯" },
  { id: "equations", label: "Gleichungen", district: "Sasel", icon: "⚖️" },
  { id: "geometry", label: "Geometrie", district: "Bramfeld", icon: "📐" },
  { id: "functions", label: "Funktionen", district: "Farmsen-Berne", icon: "📈" },
];

const DISTRICT_MAP = {
  fractions: {
    district: "Wellingsbüttel",
    points: "142,94 204,82 224,116 198,144 142,136 126,114",
    labelX: 174,
    labelY: 112,
    starsX: 174,
    starsY: 127,
  },
  percent: {
    district: "Poppenbüttel",
    points: "214,76 284,70 314,104 296,140 236,132 214,102",
    labelX: 264,
    labelY: 102,
    starsX: 264,
    starsY: 117,
  },
  equations: {
    district: "Sasel",
    points: "306,88 362,96 378,136 346,164 300,152 288,120",
    labelX: 335,
    labelY: 123,
    starsX: 335,
    starsY: 138,
  },
  geometry: {
    district: "Bramfeld",
    points: "108,144 178,150 196,196 152,228 98,214 82,174",
    labelX: 140,
    labelY: 182,
    starsX: 140,
    starsY: 197,
  },
  functions: {
    district: "Farmsen-Berne",
    points: "202,144 286,144 318,188 286,234 210,228 188,184",
    labelX: 252,
    labelY: 184,
    starsX: 252,
    starsY: 199,
  },
};

const MODE_CONFIG = {
  challenge: { label: "Challenge", totalQuestions: 10, durationSeconds: null, hints: 2, skips: 2, lives: null },
  timed: { label: "Zeitjagd", totalQuestions: Infinity, durationSeconds: 90, hints: 1, skips: 1, lives: null },
  boss: { label: "Bosskampf", totalQuestions: 12, durationSeconds: 150, hints: 1, skips: 1, lives: 3 },
};

const BADGES = [
  // ── Einstieg ───────────────────────────────────────────────────────
  {
    id: "first_hit",
    name: "Anpfiff",
    desc: "Deine erste richtige Antwort.",
    icon: "⚽",
    check: (s) => s.totalCorrect >= 1,
  },
  {
    id: "rounds_3",
    name: "Aufgewärmt",
    desc: "3 Runden gespielt.",
    icon: "🎮",
    check: (s) => s.roundsPlayed >= 3,
  },
  {
    id: "rounds_10",
    name: "Stammgast",
    desc: "10 Runden gespielt.",
    icon: "🏅",
    check: (s) => s.roundsPlayed >= 10,
  },
  {
    id: "rounds_25",
    name: "Serientäter",
    desc: "25 Runden gespielt.",
    icon: "🎯",
    check: (s) => s.roundsPlayed >= 25,
  },
  // ── Streak ─────────────────────────────────────────────────────────
  {
    id: "streak_3",
    name: "Drangeblieben",
    desc: "3 Tage Lernserie.",
    icon: "🔥",
    check: (s) => s.bestDayStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Wochenheld",
    desc: "7 Tage Lernserie am Stück.",
    icon: "📅",
    check: (s) => s.bestDayStreak >= 7,
  },
  {
    id: "streak_14",
    name: "Zwei-Wochen-Krieger",
    desc: "14 Tage Lernserie ohne Unterbrechung.",
    icon: "⚡",
    check: (s) => s.bestDayStreak >= 14,
  },
  // ── Kombo & Präzision ───────────────────────────────────────────────
  {
    id: "combo5",
    name: "Combo 5",
    desc: "5 richtige Antworten in Folge.",
    icon: "✨",
    check: (s) => s.bestCombo >= 5,
  },
  {
    id: "combo10",
    name: "Combo 10",
    desc: "10 richtige Antworten in Folge.",
    icon: "💥",
    check: (s) => s.bestCombo >= 10,
  },
  {
    id: "sharp_shooter",
    name: "Scharfschütze",
    desc: "Über 85 % Trefferquote gesamt (min. 30 Fragen).",
    icon: "🎖️",
    check: (s) => s.totalAnswered >= 30 && (s.totalCorrect / s.totalAnswered) >= 0.85,
  },
  // ── Themen-Meister ──────────────────────────────────────────────────
  {
    id: "master_fractions",
    name: "Bruch-Meister",
    desc: "Brüche: 3 Sterne auf der Missionskarte.",
    icon: "🍕",
    check: (s) => (s.missions["fractions"] || 0) >= 3,
  },
  {
    id: "master_percent",
    name: "Prozent-Profi",
    desc: "Prozent: 3 Sterne auf der Missionskarte.",
    icon: "💯",
    check: (s) => (s.missions["percent"] || 0) >= 3,
  },
  // ── Modi ────────────────────────────────────────────────────────────
  {
    id: "boss_win",
    name: "Boss Bezwinger",
    desc: "Bosskampf mit mindestens 70 % gelöst.",
    icon: "🏆",
    check: (s) => s.bossWins >= 1,
  },
  {
    id: "boss_3",
    name: "Boss-Jäger",
    desc: "3 Bosskämpfe gewonnen.",
    icon: "🗡️",
    check: (s) => s.bossWins >= 3,
  },
  // ── Karte & Daily ───────────────────────────────────────────────────
  {
    id: "map_runner",
    name: "Hamburg-Rundtour",
    desc: "In allen Stadtteilen mindestens 1 Stern.",
    icon: "🗺️",
    check: (s) => TOPICS.every((t) => (s.missions[t.id] || 0) >= 1),
  },
  {
    id: "daily3",
    name: "Tagesheld",
    desc: "3 Tages-Challenges erfolgreich beendet.",
    icon: "⭐",
    check: (s) => s.dailyWins >= 3,
  },
  {
    id: "daily10",
    name: "Daily-Legende",
    desc: "10 Tages-Challenges gewonnen.",
    icon: "👑",
    check: (s) => s.dailyWins >= 10,
  },
];

const SHOP_ITEMS = [
  {
    id: "extra_hint",
    name: "Extra Joker",
    desc: "Ein zusätzlicher Joker-Tipp für die nächste Runde.",
    icon: "💡",
    cost: 15,
    maxOwned: 3,
    stateKey: "bonusHints",
  },
  {
    id: "extra_skip",
    name: "Extra Tausch",
    icon: "🔄",
    desc: "Eine zusätzliche Frage tauschen für die nächste Runde.",
    cost: 10,
    maxOwned: 3,
    stateKey: "bonusSkips",
  },
  {
    id: "title_pro",
    name: "Titel: Mathe-Profi",
    icon: "🎓",
    desc: "Dein Titel im Hero-Bereich wird zu „Mathe-Profi\".",
    cost: 40,
    maxOwned: 1,
    stateKey: "titlePro",
  },
  {
    id: "theme_night",
    name: "Nacht-Modus",
    icon: "🌙",
    desc: "Schaltet das dunkle Farbschema frei.",
    cost: 60,
    maxOwned: 1,
    stateKey: "themeNight",
  },
];

const els = {
  playerGreeting: document.getElementById("player-greeting"),
  themeToggle: document.getElementById("theme-toggle"),
  playerName: document.getElementById("player-name"),
  dailyGoal: document.getElementById("daily-goal"),
  saveProfile: document.getElementById("save-profile"),
  resetBtn: document.getElementById("reset-btn"),
  resetConfirm: document.getElementById("reset-confirm"),
  resetConfirmYes: document.getElementById("reset-confirm-yes"),
  resetConfirmNo: document.getElementById("reset-confirm-no"),
  profileStatus: document.getElementById("profile-status"),
  statLevel: document.getElementById("stat-level"),
  statXp: document.getElementById("stat-xp"),
  statPoints: document.getElementById("stat-points"),
  statStreak: document.getElementById("stat-streak"),
  statAccuracy: document.getElementById("stat-accuracy"),
  statCoins: document.getElementById("stat-coins"),
  xpBar: document.getElementById("xp-bar"),
  xpProgressLabel: document.getElementById("xp-progress-label"),
  dailyBar: document.getElementById("daily-bar"),
  dailyProgressLabel: document.getElementById("daily-progress-label"),
  topicGroup: document.getElementById("topic-group"),
  modeGroup: document.getElementById("mode-group"),
  startBtn: document.getElementById("start-btn"),
  dailyBtn: document.getElementById("daily-btn"),
  roundHint: document.getElementById("round-hint"),
  gamePanel: document.getElementById("game-panel"),
  roundTitle: document.getElementById("round-title"),
  roundProgress: document.getElementById("round-progress"),
  meterFill: document.getElementById("meter-fill"),
  timer: document.getElementById("timer"),
  questionText: document.getElementById("question-text"),
  optionGrid: document.getElementById("option-grid"),
  hintBtn: document.getElementById("hint-btn"),
  skipBtn: document.getElementById("skip-btn"),
  quitBtn: document.getElementById("quit-btn"),
  feedback: document.getElementById("feedback"),
  summaryPanel: document.getElementById("summary-panel"),
  summaryMain: document.getElementById("summary-main"),
  summaryDetails: document.getElementById("summary-details"),
  playAgain: document.getElementById("play-again"),
  hamburgMap: document.getElementById("hamburg-map"),
  missionGrid: document.getElementById("mission-grid"),
  badgeGrid: document.getElementById("badge-grid"),
  badgeToast: document.getElementById("badge-toast"),
  shopGrid: document.getElementById("shop-grid"),
  shopCoinsLabel: document.getElementById("shop-coins-label"),
  shopStatus: document.getElementById("shop-status"),
  onboardingHint: document.getElementById("onboarding-hint"),
};

const NAV_TABS = document.querySelectorAll(".nav-tab");
const TAB_PANELS = document.querySelectorAll(".tab-panel");

function switchTab(tabId) {
  TAB_PANELS.forEach((panel) => {
    panel.classList.toggle("active-tab", panel.id === "tab-" + tabId);
  });
  NAV_TABS.forEach((btn) => {
    btn.classList.toggle("active-nav", btn.dataset.tab === tabId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

NAV_TABS.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

let state = loadState();
let selectedTopic = "mixed";
let selectedMode = "challenge";
let round = null;
let profileStatusTimeout = null;
let badgeToastTimeout = null;
let shopStatusTimeout = null;

init();

function init() {
  normalizeDailyState();
  wireSelectionButtons();
  wireEvents();
  renderAll();
  applyTheme();
}

function wireSelectionButtons() {
  for (const button of els.topicGroup.querySelectorAll(".chip")) {
    button.addEventListener("click", () => {
      selectedTopic = button.dataset.topic;
      setActiveChip(els.topicGroup, button);
      renderRoundHint();
    });
  }

  for (const button of els.modeGroup.querySelectorAll(".chip")) {
    button.addEventListener("click", () => {
      selectedMode = button.dataset.mode;
      setActiveChip(els.modeGroup, button);
      renderRoundHint();
    });
  }
}

function wireEvents() {
  els.startBtn.addEventListener("click", () => {
    startRound({
      mode: selectedMode,
      topic: selectedTopic,
      daily: false,
    });
  });

  els.dailyBtn.addEventListener("click", () => {
    if (state.daily.done) {
      setProfileStatus("Daily ist fuer heute schon erledigt.");
      return;
    }
    startRound({
      mode: "challenge",
      topic: "mixed",
      daily: true,
      totalQuestions: 8,
      durationSeconds: null,
    });
  });

  els.optionGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button.option-btn");
    if (!button || !round || round.locked) {
      return;
    }
    answerQuestion(Number(button.dataset.index));
  });

  els.hintBtn.addEventListener("click", () => {
    if (!round) {
      return;
    }
    if (round.hintsLeft <= 0) {
      setFeedback("Kein Joker-Tipp mehr verfuegbar.", "info");
      return;
    }
    round.hintsLeft -= 1;
    setFeedback("Tipp: " + round.currentQuestion.hint, "info");
    updateRoundHeader();
  });

  els.skipBtn.addEventListener("click", () => {
    if (!round) {
      return;
    }
    if (round.skipsLeft <= 0) {
      setFeedback("Kein Tausch mehr verfuegbar.", "info");
      return;
    }
    round.skipsLeft -= 1;
    round.points = Math.max(0, round.points - 5);
    round.answerStreak = 0;
    round.questionsAnswered += 1;
    state.totalAnswered += 1;

    if (round.currentQuestion) {
      const topicStats = round.byTopic[round.currentQuestion.topicId];
      topicStats.answered += 1;
    }

    setFeedback("Frage getauscht: -5 Punkte.", "info");
    updateRoundHeader();
    window.setTimeout(nextQuestion, 200);
  });

  els.quitBtn.addEventListener("click", () => {
    if (round) {
      finishRound("Runde vorzeitig beendet.");
    }
  });

  els.playAgain.addEventListener("click", () => {
    els.summaryPanel.classList.add("hidden");
    startRound({
      mode: selectedMode,
      topic: selectedTopic,
      daily: false,
    });
  });

  els.saveProfile.addEventListener("click", () => {
    const name = els.playerName.value.trim();
    state.profile.name = name || "Mathe-Captain";
    state.profile.dailyGoal = toSafeInt(els.dailyGoal.value, 90);
    persistState();
    renderProfile();
    setProfileStatus("Profil gespeichert.");
  });

  els.resetBtn.addEventListener("click", () => {
    els.resetConfirm.classList.remove("hidden");
    els.resetBtn.disabled = true;
  });

  els.resetConfirmNo.addEventListener("click", () => {
    els.resetConfirm.classList.add("hidden");
    els.resetBtn.disabled = false;
  });

  els.resetConfirmYes.addEventListener("click", () => {
    if (round) {
      stopRoundTimer();
      round = null;
    }
    state = defaultState();
    persistState();
    els.resetConfirm.classList.add("hidden");
    els.resetBtn.disabled = false;
    renderAll();
    setProfileStatus("Fortschritt zurückgesetzt.");
  });

  els.themeToggle.addEventListener("click", () => {
    state.uiTheme = state.uiTheme === "light" ? "dark" : "light";
    persistState();
    applyTheme();
  });

  document.addEventListener("keydown", (event) => {
    if (!round || round.locked) return;
    const key = event.key;
    if (key === "1" || key === "2" || key === "3" || key === "4") {
      const index = Number(key) - 1;
      const buttons = els.optionGrid.querySelectorAll(".option-btn");
      if (buttons[index] && !buttons[index].disabled) {
        answerQuestion(index);
      }
    }
  });
}

function setActiveChip(container, activeButton) {
  for (const button of container.querySelectorAll(".chip")) {
    button.classList.toggle("active", button === activeButton);
  }
}

function renderAll() {
  applyTheme();
  renderProfile();
  renderOnboarding();
  renderStats();
  renderProgressBars();
  renderRoundHint();
  renderDailyButton();
  renderMissionGrid();
  renderBadgeGrid();
  renderShop();
}

function renderProfile() {
  els.playerName.value = state.profile.name;
  els.dailyGoal.value = String(state.profile.dailyGoal);
  const title = state.titlePro >= 1 ? "Mathe-Profi" : "Mathe-Captain";
  els.playerGreeting.textContent = "Moin, " + state.profile.name + ". 👋 [" + title + "]";
}

function renderOnboarding() {
  if (!els.onboardingHint) return;
  const isNewUser = state.roundsPlayed === 0;
  els.onboardingHint.classList.toggle("hidden", !isNewUser);
}

function applyTheme() {
  const isLight = state.uiTheme === "light";
  document.body.classList.toggle("theme-light", isLight);
  if (els.themeToggle) {
    els.themeToggle.textContent = isLight ? "🌙 Dunkel" : "☀️ Hell";
  }
}

function renderStats() {
  const levelData = computeLevel(state.xp);
  const accuracy = state.totalAnswered === 0 ? 0 : Math.round((state.totalCorrect / state.totalAnswered) * 100);

  els.statLevel.textContent = String(levelData.level);
  els.statXp.textContent = state.xp + " XP";
  els.statPoints.textContent = String(state.totalPoints);
  els.statStreak.textContent = state.dayStreak + " Tage";
  els.statAccuracy.textContent = accuracy + " %";
  els.statCoins.textContent = String(state.coins);
  renderProgressBars();
}

function renderProgressBars() {
  const levelData = computeLevel(state.xp);
  // compute XP consumed at current level start
  let consumed = 0;
  let threshold = 120;
  let lvl = 1;
  while (lvl < levelData.level) {
    consumed += threshold;
    lvl += 1;
    threshold = 120 + (lvl - 1) * 60;
  }
  const xpInLevel = state.xp - consumed;
  const xpForLevel = levelData.nextThreshold - consumed;
  const xpRatio = Math.min(1, xpInLevel / Math.max(1, xpForLevel));
  els.xpBar.style.width = Math.round(xpRatio * 100) + "%";
  els.xpProgressLabel.textContent = "Level " + levelData.level + " → " + (levelData.level + 1) + " (" + xpInLevel + "/" + xpForLevel + " XP)";

  const dailyGoal = state.profile.dailyGoal;
  const dailyXp = toSafeInt(state.dailyXp, 0);
  const dailyRatio = Math.min(1, dailyXp / Math.max(1, dailyGoal));
  els.dailyBar.style.width = Math.round(dailyRatio * 100) + "%";
  els.dailyProgressLabel.textContent = "Tagesziel: " + dailyXp + " / " + dailyGoal + " XP" + (dailyRatio >= 1 ? " ✅" : "");
}

function renderRoundHint() {
  const topicLabel = selectedTopic === "mixed"
    ? "Gemischt"
    : (TOPICS.find((topic) => topic.id === selectedTopic) || TOPICS[0]).label;
  const modeLabel = MODE_CONFIG[selectedMode].label;
  els.roundHint.textContent = "Modus: " + modeLabel + " | Thema: " + topicLabel;
}

function renderDailyButton() {
  normalizeDailyState();
  els.dailyBtn.disabled = state.daily.done;
  els.dailyBtn.textContent = state.daily.done ? "Daily erledigt" : "Daily Challenge (+Bonus)";
}

function renderMissionGrid() {
  renderHamburgMap();
  const cards = TOPICS.map((topic) => {
    const stars = toSafeInt(state.missions[topic.id], 0);
    const districtInfo = DISTRICT_MAP[topic.id];
    const districtName = districtInfo ? districtInfo.district : topic.district;
    return (
      "<article class=\"mission-card\">" +
      "<h3>" + topic.icon + " " + districtName + "</h3>" +
      "<p>" + topic.label + "</p>" +
      "<p class=\"stars\">" + renderStars(stars) + "</p>" +
      "</article>"
    );
  });
  els.missionGrid.innerHTML = cards.join("");
}

function renderHamburgMap() {
  if (!els.hamburgMap) {
    return;
  }

  const cityOutlinePath = "M88 66 L136 42 L196 34 L246 48 L300 36 L360 54 L406 90 L430 146 L418 192 L434 240 L414 286 L356 308 L288 302 L238 316 L182 310 L126 292 L88 254 L66 208 L58 150 L70 102 Z";
  const elbePath = "M56 214 C108 204 168 208 224 220 C278 232 332 236 402 226 L402 248 C338 260 276 258 220 246 C166 234 110 232 56 242 Z";
  const alsterPath = "M208 112 C221 103 236 105 244 116 C252 128 246 142 234 147 C220 152 206 143 205 130 C204 122 206 116 208 112 Z";
  const canalPath = "M228 146 C224 165 226 180 234 200 C240 216 246 232 244 250 L262 250 C264 230 256 208 250 192 C244 176 244 161 248 145 Z";

  const districts = TOPICS.map((topic) => {
    const shape = DISTRICT_MAP[topic.id];
    if (!shape) {
      return "";
    }
    const stars = Math.max(0, Math.min(3, toSafeInt(state.missions[topic.id], 0)));
    return (
      "<g class=\"map-district\" data-topic=\"" + topic.id + "\" tabindex=\"0\" role=\"button\" aria-label=\"" + shape.district + " öffnen\">" +
      "<polygon class=\"map-zone zone-" + stars + "\" points=\"" + shape.points + "\"></polygon>" +
      "<text class=\"map-label\" x=\"" + shape.labelX + "\" y=\"" + shape.labelY + "\">" + shape.district + "</text>" +
      "<text class=\"map-stars\" x=\"" + shape.starsX + "\" y=\"" + shape.starsY + "\">" + renderStars(stars) + "</text>" +
      "</g>"
    );
  }).join("");

  els.hamburgMap.innerHTML =
    "<svg class=\"hamburg-map\" viewBox=\"0 0 460 340\" role=\"img\" aria-label=\"Hamburg-Karte mit eroberten Stadtteilen\">" +
    "<defs>" +
    "<clipPath id=\"hamburg-city-clip\">" +
    "<path d=\"" + cityOutlinePath + "\"></path>" +
    "</clipPath>" +
    "</defs>" +
    "<path class=\"map-land\" d=\"" + cityOutlinePath + "\"></path>" +
    "<path class=\"map-river\" d=\"" + elbePath + "\"></path>" +
    "<path class=\"map-river\" d=\"" + alsterPath + "\"></path>" +
    "<path class=\"map-river\" d=\"" + canalPath + "\"></path>" +
    "<g clip-path=\"url(#hamburg-city-clip)\">" +
    districts +
    "</g>" +
    "<path class=\"map-outline\" d=\"" + cityOutlinePath + "\"></path>" +
    "</svg>" +
    "<p class=\"meta map-legend\">Tippe auf einen Stadtteil: Thema wird vorgewählt. Eroberung: ☆☆☆ bis ★★★</p>";

  els.hamburgMap.querySelectorAll(".map-district").forEach((districtEl) => {
    const pickTopic = () => {
      const topicId = districtEl.dataset.topic;
      if (!topicId) {
        return;
      }
      const topicButton = els.topicGroup.querySelector("[data-topic=\"" + topicId + "\"]");
      if (!topicButton) {
        return;
      }
      selectedTopic = topicId;
      setActiveChip(els.topicGroup, topicButton);
      renderRoundHint();
      switchTab("spielen");
      window.setTimeout(() => {
        els.startBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    };

    districtEl.addEventListener("click", pickTopic);
    districtEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pickTopic();
      }
    });
  });
}

function renderBadgeGrid() {
  const unlocked = new Set(state.badges);

  function getProgress(badge) {
    switch (badge.id) {
      case "rounds_3":    return state.roundsPlayed + "/3";
      case "rounds_10":   return state.roundsPlayed + "/10";
      case "rounds_25":   return state.roundsPlayed + "/25";
      case "streak_3":    return state.bestDayStreak + "/3 Tage";
      case "streak_7":    return state.bestDayStreak + "/7 Tage";
      case "streak_14":   return state.bestDayStreak + "/14 Tage";
      case "combo5":      return state.bestCombo + "/5";
      case "combo10":     return state.bestCombo + "/10";
      case "sharp_shooter": {
        const pct = state.totalAnswered === 0 ? 0 : Math.round((state.totalCorrect / state.totalAnswered) * 100);
        return pct + " % (" + state.totalAnswered + "/30 Fragen)";
      }
      case "boss_3":      return state.bossWins + "/3";
      case "daily3":      return state.dailyWins + "/3";
      case "daily10":     return state.dailyWins + "/10";
      default:            return null;
    }
  }

  const cards = BADGES.map((badge) => {
    const isUnlocked = unlocked.has(badge.id);
    const progress = !isUnlocked ? getProgress(badge) : null;
    const classes = "badge-card" + (isUnlocked ? "" : " locked");
    return (
      "<article class=\"" + classes + "\">" +
      "<p class=\"badge-icon\">" + badge.icon + "</p>" +
      "<h3>" + badge.name + "</h3>" +
      "<p>" + badge.desc + "</p>" +
      (progress ? "<p class=\"badge-progress\">" + progress + "</p>" : "") +
      "<p class=\"meta\">" + (isUnlocked ? "✅ Freigeschaltet" : "Noch gesperrt") + "</p>" +
      "</article>"
    );
  });

  els.badgeGrid.innerHTML = cards.join("");
}

function renderShop() {
  els.shopCoinsLabel.textContent = "Deine Münzen: " + state.coins + " 🪙";
  els.shopGrid.innerHTML = "";

  SHOP_ITEMS.forEach((item) => {
    const owned = toSafeInt(state[item.stateKey], 0);
    const maxReached = owned >= item.maxOwned;
    const canAfford = state.coins >= item.cost;

    const card = document.createElement("article");
    card.className = "shop-card" + (maxReached ? " shop-owned" : "");

    card.innerHTML =
      "<p class=\"shop-icon\">" + item.icon + "</p>" +
      "<h3 class=\"shop-name\">" + item.name + "</h3>" +
      "<p class=\"meta\">" + item.desc + "</p>" +
      "<p class=\"shop-cost\">" + (maxReached ? "✅ Besitzt du" : item.cost + " 🪙") + "</p>" +
      "<button class=\"btn btn-primary shop-btn\" " +
        (maxReached || !canAfford ? "disabled" : "") +
        " data-item-id=\"" + item.id + "\">" +
        (maxReached ? "Gekauft" : canAfford ? "Kaufen" : "Zu wenig Münzen") +
      "</button>";

    els.shopGrid.appendChild(card);
  });

  els.shopGrid.querySelectorAll(".shop-btn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      buyShopItem(btn.dataset.itemId);
    });
  });
}

function buyShopItem(itemId) {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return;
  const owned = toSafeInt(state[item.stateKey], 0);
  if (owned >= item.maxOwned || state.coins < item.cost) return;

  state.coins = Math.max(0, state.coins - item.cost);
  state[item.stateKey] = owned + 1;
  persistState();
  applyTheme();
  renderShop();
  renderStats();
  renderProfile();

  if (shopStatusTimeout) window.clearTimeout(shopStatusTimeout);
  els.shopStatus.textContent = "✅ " + item.name + " gekauft!";
  shopStatusTimeout = window.setTimeout(() => {
    els.shopStatus.textContent = "";
  }, 3000);
}

function startRound(options) {
  stopRoundTimer();

  const mode = options.mode in MODE_CONFIG ? options.mode : "challenge";
  const config = MODE_CONFIG[mode];

  round = {
    mode: mode,
    topic: options.topic || "mixed",
    daily: Boolean(options.daily),
    title: options.daily ? "Tages-Challenge" : config.label,
    totalQuestions: Number.isFinite(options.totalQuestions) ? options.totalQuestions : config.totalQuestions,
    remainingSeconds: typeof options.durationSeconds === "number" ? options.durationSeconds : config.durationSeconds,
    hintsLeft: config.hints,
    skipsLeft: config.skips,
    lives: config.lives,
    points: 0,
    correct: 0,
    questionsAnswered: 0,
    answerStreak: 0,
    bestStreak: 0,
    history: [],
    byTopic: createRoundTopicStats(),
    currentQuestion: null,
    locked: false,
    timerId: null,
  };

  if (state.bonusHints > 0) {
    round.hintsLeft += 1;
    state.bonusHints -= 1;
    persistState();
  }
  if (state.bonusSkips > 0) {
    round.skipsLeft += 1;
    state.bonusSkips -= 1;
    persistState();
  }

  els.gamePanel.classList.remove("hidden");
  switchTab("spielen");
  window.setTimeout(() => {
    els.gamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
  els.summaryPanel.classList.add("hidden");
  setFeedback("", "info");
  updateRoundHeader();
  startRoundTimer();
  nextQuestion();
}

function createRoundTopicStats() {
  const map = {};
  for (const topic of TOPICS) {
    map[topic.id] = { answered: 0, correct: 0 };
  }
  return map;
}

function startRoundTimer() {
  if (!round || round.remainingSeconds === null) {
    return;
  }
  round.timerId = window.setInterval(() => {
    if (!round) {
      return;
    }
    round.remainingSeconds -= 1;
    if (round.remainingSeconds <= 0) {
      round.remainingSeconds = 0;
      updateRoundHeader();
      finishRound("Zeit ist abgelaufen.");
      return;
    }
    updateRoundHeader();
  }, 1000);
}

function stopRoundTimer() {
  if (!round || !round.timerId) {
    return;
  }
  window.clearInterval(round.timerId);
  round.timerId = null;
}

function nextQuestion() {
  if (!round) {
    return;
  }
  if (round.lives !== null && round.lives <= 0) {
    finishRound("Keine Leben mehr.");
    return;
  }
  if (Number.isFinite(round.totalQuestions) && round.questionsAnswered >= round.totalQuestions) {
    finishRound("Rundenziel erreicht.");
    return;
  }

  round.currentQuestion = generateQuestion(chooseTopic(round));
  round.locked = false;
  renderQuestion(round.currentQuestion);
  updateRoundHeader();
}

function chooseTopic(activeRound) {
  if (activeRound.mode === "boss") {
    return pick(TOPICS).id;
  }
  if (activeRound.topic === "mixed") {
    const weakTopics = TOPICS
      .slice()
      .sort((a, b) => toSafeInt(state.missions[a.id], 0) - toSafeInt(state.missions[b.id], 0))
      .slice(0, 2);
    if (Math.random() < 0.55) {
      return pick(weakTopics).id;
    }
    return pick(TOPICS).id;
  }
  return activeRound.topic;
}

function renderQuestion(question) {
  els.questionText.textContent = question.prompt;
  els.optionGrid.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.dataset.index = String(index);
    button.textContent = option;
    els.optionGrid.appendChild(button);
  });

  els.hintBtn.textContent = "Joker-Tipp (" + round.hintsLeft + ")";
  els.hintBtn.disabled = round.hintsLeft <= 0;
  els.skipBtn.textContent = "Frage tauschen (" + round.skipsLeft + ")";
  els.skipBtn.disabled = round.skipsLeft <= 0;
  setFeedback("", "info");
}

function answerQuestion(index) {
  if (!round || round.locked || !round.currentQuestion) {
    return;
  }

  const question = round.currentQuestion;
  const isCorrect = index === question.correctIndex;
  round.locked = true;
  round.history.push({
    prompt: question.prompt,
    correctAnswer: question.options[question.correctIndex],
    studentAnswer: question.options[index],
    wasCorrect: isCorrect,
  });

  round.questionsAnswered += 1;
  state.totalAnswered += 1;
  round.byTopic[question.topicId].answered += 1;

  if (isCorrect) {
    round.correct += 1;
    state.totalCorrect += 1;
    round.byTopic[question.topicId].correct += 1;
    round.answerStreak += 1;
    round.bestStreak = Math.max(round.bestStreak, round.answerStreak);
    state.bestCombo = Math.max(state.bestCombo, round.answerStreak);

    const pointsGain = 10 + Math.min(20, round.answerStreak * 2);
    round.points += pointsGain;
    setFeedback("Stark! +" + pointsGain + " Punkte. " + question.explanation, "success");
  } else {
    round.answerStreak = 0;
    if (round.lives !== null) {
      round.lives -= 1;
    }
    setFeedback("Knapp daneben. " + question.explanation, "error");
  }

  markAnswerButtons(index, question.correctIndex);
  updateRoundHeader();

  if (round.lives !== null && round.lives <= 0) {
    window.setTimeout(() => finishRound("Keine Leben mehr."), 900);
    return;
  }
  window.setTimeout(nextQuestion, 900);
}

function markAnswerButtons(selectedIndex, correctIndex) {
  const buttons = els.optionGrid.querySelectorAll(".option-btn");
  buttons.forEach((button) => {
    const idx = Number(button.dataset.index);
    button.disabled = true;
    if (idx === correctIndex) {
      button.classList.add("correct");
    }
    if (idx === selectedIndex && idx !== correctIndex) {
      button.classList.add("wrong");
    }
  });
}

function setFeedback(text, kind) {
  els.feedback.textContent = text;
  els.feedback.className = "feedback";
  if (kind) {
    els.feedback.classList.add(kind);
  }
}

function updateRoundHeader() {
  if (!round) {
    return;
  }

  const questionCounter = Number.isFinite(round.totalQuestions)
    ? (Math.min(round.questionsAnswered + 1, round.totalQuestions) + "/" + round.totalQuestions)
    : String(round.questionsAnswered + 1);

  const lifeText = round.lives === null ? "" : " | Leben " + "❤️".repeat(Math.max(0, round.lives));
  els.roundTitle.textContent = round.title + lifeText;
  els.roundProgress.textContent = "Frage " + questionCounter + " | Punkte " + round.points;

  if (round.remainingSeconds === null) {
    els.timer.textContent = round.lives === null ? "Ohne Zeitlimit" : "Leben: " + "❤️".repeat(Math.max(0, round.lives));
  } else {
    els.timer.textContent = "Zeit: " + formatTime(round.remainingSeconds) + lifeText;
  }

  updateProgressMeter();
}

function updateProgressMeter() {
  if (!round) {
    return;
  }
  let ratio = 0;
  if (round.mode === "timed") {
    ratio = (MODE_CONFIG.timed.durationSeconds - round.remainingSeconds) / MODE_CONFIG.timed.durationSeconds;
  } else {
    ratio = round.questionsAnswered / Math.max(1, round.totalQuestions);
  }
  const percentage = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  els.meterFill.style.width = percentage + "%";
}

function finishRound(reason) {
  if (!round) {
    return;
  }

  stopRoundTimer();

  const finishedRound = round;
  round = null;

  const accuracy = finishedRound.questionsAnswered === 0
    ? 0
    : Math.round((finishedRound.correct / finishedRound.questionsAnswered) * 100);

  const xpGain = finishedRound.correct * 12 + Math.floor(finishedRound.points / 6);
  let coinGain = Math.floor(finishedRound.points / 20);
  let dailyText = "";

  if (finishedRound.questionsAnswered > 0) {
    state.roundsPlayed += 1;
    state.totalPoints += finishedRound.points;
    state.xp += xpGain;
    state.dailyXp = toSafeInt(state.dailyXp, 0) + xpGain;
    updateDayStreak();
    applyMissionProgress(finishedRound.byTopic);

    if (finishedRound.mode === "boss" && accuracy >= 70) {
      state.bossWins += 1;
      coinGain += 4;
    }

    if (finishedRound.daily && !state.daily.done) {
      state.daily.done = true;
      if (accuracy >= 70) {
        state.dailyWins += 1;
        coinGain += 8;
        dailyText = "Daily gewonnen: +8 Bonus-Muenzen.";
      } else {
        dailyText = "Daily beendet. Morgen gibt es die naechste Runde.";
      }
    }

    state.coins += coinGain;
  }

  const levelBefore = computeLevel(state.xp - xpGain).level;
  const levelAfter = computeLevel(state.xp).level;
  if (levelAfter > levelBefore) {
    showBadgeToast("🚀 Level Up! Du bist jetzt Level " + levelAfter + "!");
  }

  evaluateBadges();
  persistState();
  renderAll();
  showSummary(finishedRound, {
    reason: reason,
    accuracy: accuracy,
    xpGain: xpGain,
    coinGain: coinGain,
    dailyText: dailyText,
  });
}

function showSummary(finishedRound, result) {
  els.gamePanel.classList.add("hidden");
  els.summaryPanel.classList.remove("hidden");
  window.setTimeout(() => {
    els.summaryPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
  switchTab("spielen");

  const header = result.reason + " " + finishedRound.correct + " von " + finishedRound.questionsAnswered + " richtig (" + result.accuracy + " %).";
  els.summaryMain.textContent = header;

  const items = [
    { label: "Punkte in der Runde", value: String(finishedRound.points) },
    { label: "XP erhalten", value: "+" + result.xpGain },
    { label: "Muenzen erhalten", value: "+" + result.coinGain },
    { label: "Beste Antwort-Serie", value: String(finishedRound.bestStreak) },
  ];

  if (result.dailyText) {
    items.push({ label: "Daily", value: result.dailyText });
  }

  els.summaryDetails.innerHTML = items
    .map((item) => (
      "<div class=\"summary-item\">" +
      "<p class=\"meta\">" + item.label + "</p>" +
      "<p>" + item.value + "</p>" +
      "</div>"
    ))
    .join("");

  const missed = finishedRound.history.filter((entry) => !entry.wasCorrect);

  if (missed.length === 0) {
    const perfectEl = document.createElement("div");
    perfectEl.className = "review-perfect";
    perfectEl.textContent = "🎯 Perfekt! Alle Fragen richtig beantwortet.";
    els.summaryDetails.appendChild(perfectEl);
  } else {
    const reviewHeader = document.createElement("p");
    reviewHeader.className = "review-header";
    reviewHeader.textContent = "📋 Fehler-Review (" + missed.length + " Frage" + (missed.length > 1 ? "n" : "") + " falsch):";
    els.summaryDetails.appendChild(reviewHeader);

    missed.forEach((entry) => {
      const card = document.createElement("div");
      card.className = "review-card";
      card.innerHTML =
        "<p class=\"review-question\">" + entry.prompt + "</p>" +
        "<p class=\"review-wrong\">Deine Antwort: " + entry.studentAnswer + "</p>" +
        "<p class=\"review-correct\">Richtige Antwort: " + entry.correctAnswer + "</p>";
      els.summaryDetails.appendChild(card);
    });
  }
}

function applyMissionProgress(byTopic) {
  for (const topic of TOPICS) {
    const scores = byTopic[topic.id];
    if (!scores || scores.answered === 0) {
      continue;
    }
    const accuracy = Math.round((scores.correct / scores.answered) * 100);
    const stars = accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : accuracy >= 60 ? 1 : 0;
    state.missions[topic.id] = Math.max(toSafeInt(state.missions[topic.id], 0), stars);
  }
}

function evaluateBadges() {
  const unlocked = new Set(state.badges);
  for (const badge of BADGES) {
    if (badge.check(state) && !unlocked.has(badge.id)) {
      unlocked.add(badge.id);
      showBadgeToast(badge.name);
    }
  }
  state.badges = Array.from(unlocked);
}

function showBadgeToast(badgeName) {
  if (badgeToastTimeout) window.clearTimeout(badgeToastTimeout);
  els.badgeToast.textContent = "🏅 Badge freigeschaltet: " + badgeName + "!";
  els.badgeToast.classList.remove("hidden");
  els.badgeToast.classList.add("toast-visible");
  badgeToastTimeout = window.setTimeout(() => {
    els.badgeToast.classList.remove("toast-visible");
    els.badgeToast.classList.add("hidden");
  }, 3500);
}

function setProfileStatus(text) {
  if (profileStatusTimeout) {
    window.clearTimeout(profileStatusTimeout);
  }
  els.profileStatus.textContent = text;
  profileStatusTimeout = window.setTimeout(() => {
    if (els.profileStatus.textContent === text) {
      els.profileStatus.textContent = "";
    }
  }, 4200);
}

function normalizeDailyState() {
  const today = todayKey();
  if (state.daily.date !== today) {
    state.daily.date = today;
    state.daily.done = false;
    state.dailyXp = 0;
    persistState();
  }
}

function updateDayStreak() {
  const today = todayKey();
  if (state.lastPlayedDate === today) {
    return;
  }
  const previousDay = offsetDateKey(today, -1);
  if (state.lastPlayedDate === previousDay) {
    state.dayStreak += 1;
  } else {
    state.dayStreak = 1;
  }
  state.bestDayStreak = Math.max(state.bestDayStreak, state.dayStreak);
  state.lastPlayedDate = today;
}

function todayKey() {
  return new Date().toLocaleDateString("sv-SE");
}

function offsetDateKey(baseKey, offsetDays) {
  const parts = baseKey.split("-").map((value) => Number(value));
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString("sv-SE");
}

function computeLevel(xpTotal) {
  let level = 1;
  let threshold = 120;
  let consumed = 0;

  while (xpTotal >= consumed + threshold) {
    consumed += threshold;
    level += 1;
    threshold = 120 + (level - 1) * 60;
  }

  return {
    level: level,
    nextThreshold: consumed + threshold,
  };
}

function generateQuestion(topicId) {
  switch (topicId) {
    case "fractions":
      return generateFractionQuestion();
    case "percent":
      return generatePercentQuestion();
    case "equations":
      return generateEquationQuestion();
    case "geometry":
      return generateGeometryQuestion();
    case "functions":
      return generateFunctionQuestion();
    default:
      return generateEquationQuestion();
  }
}

function generateFractionQuestion() {
  const variant = randInt(0, 4);
  if (variant === 0) {
    const denominator = pick([4, 5, 6, 8, 10, 12]);
    const a = randInt(1, denominator - 1);
    const b = randInt(1, denominator - 1);
    const correct = simplifyFraction(a + b, denominator);
    return buildQuestion({
      topicId: "fractions",
      prompt: "Rechne: " + a + "/" + denominator + " + " + b + "/" + denominator + " = ?",
      correct: correct,
      wrongs: [
        simplifyFraction(a + b + 1, denominator),
        simplifyFraction(Math.max(1, a + b - 1), denominator),
        simplifyFraction(a + b, denominator + 2),
        simplifyFraction(a + b + denominator, denominator),
      ],
      hint: "Bei gleichem Nenner addierst du nur die Zaehler.",
      explanation: "Gleicher Nenner -> Zaehler addieren und ggf. kuerzen.",
    });
  }

  if (variant === 1) {
    const factor = randInt(2, 6);
    const baseNum = randInt(1, 8);
    const baseDen = randInt(baseNum + 1, 12);
    const n = baseNum * factor;
    const d = baseDen * factor;
    const correct = simplifyFraction(n, d);
    return buildQuestion({
      topicId: "fractions",
      prompt: "Kuerze den Bruch vollstaendig: " + n + "/" + d,
      correct: correct,
      wrongs: [
        simplifyFraction(n, d / 2),
        simplifyFraction(n / 2, d),
        simplifyFraction(n / factor, d / (factor > 2 ? factor - 1 : factor + 1)),
        String(n + "/" + d),
      ],
      hint: "Teile Zaehler und Nenner durch ihren groessten gemeinsamen Teiler.",
      explanation: "Nur wenn Zaehler und Nenner durch dieselbe Zahl geteilt werden, bleibt der Wert gleich.",
    });
  }

  if (variant === 3) {
    // Different-denominator addition
    const den1 = pick([2, 3, 4, 5]);
    const den2 = pick([3, 4, 5, 6].filter((d) => d !== den1));
    const num1 = randInt(1, den1 - 1);
    const num2 = randInt(1, den2 - 1);
    const lcm = (den1 * den2) / gcd(den1, den2);
    const correctNum = num1 * (lcm / den1) + num2 * (lcm / den2);
    const correct = simplifyFraction(correctNum, lcm);
    return buildQuestion({
      topicId: "fractions",
      prompt: "Rechne: " + num1 + "/" + den1 + " + " + num2 + "/" + den2 + " = ?",
      correct: correct,
      wrongs: [
        simplifyFraction(num1 + num2, den1 + den2),
        simplifyFraction(correctNum + 1, lcm),
        simplifyFraction(correctNum - 1, lcm),
        simplifyFraction(num1 * num2, den1 * den2),
      ],
      hint: "Erst gleichnamig machen: Hauptnenner bestimmen, dann Zähler anpassen.",
      explanation: "Hauptnenner ist " + lcm + ". Dann: " + (num1 * (lcm / den1)) + "/" + lcm + " + " + (num2 * (lcm / den2)) + "/" + lcm + " = " + correct + ".",
    });
  }

  if (variant === 4) {
    // Fraction multiplication
    const n1 = randInt(1, 5);
    const d1 = pick([3, 4, 5, 6, 8]);
    const n2 = randInt(1, 5);
    const d2 = pick([3, 4, 5, 6, 8].filter((d) => d !== d1));
    const correct = simplifyFraction(n1 * n2, d1 * d2);
    return buildQuestion({
      topicId: "fractions",
      prompt: "Rechne: " + n1 + "/" + d1 + " · " + n2 + "/" + d2 + " = ?",
      correct: correct,
      wrongs: [
        simplifyFraction(n1 + n2, d1 + d2),
        simplifyFraction(n1 * n2 + 1, d1 * d2),
        simplifyFraction(n1 * d2, d1 * n2),
        simplifyFraction(n1 * n2, d1 * d2 + 2),
      ],
      hint: "Zähler mal Zähler, Nenner mal Nenner — dann kürzen.",
      explanation: n1 + "/" + d1 + " · " + n2 + "/" + d2 + " = " + (n1 * n2) + "/" + (d1 * d2) + " = " + correct + ".",
    });
  }

  const finiteFractions = [
    [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8],
  ];
  const pair = pick(finiteFractions);
  const decimal = toGermanDecimal(pair[0] / pair[1]);
  return buildQuestion({
    topicId: "fractions",
    prompt: "Schreibe als Dezimalzahl: " + pair[0] + "/" + pair[1],
    correct: decimal,
    wrongs: [
      toGermanDecimal((pair[0] + 1) / pair[1]),
      toGermanDecimal(pair[0] / (pair[1] + 1)),
      toGermanDecimal((pair[1] - pair[0]) / pair[1]),
      toGermanDecimal(pair[0] / pair[1] + 0.1),
    ],
    hint: "Bruch bedeutet Zaehler durch Nenner teilen.",
    explanation: "Der Bruch wird durch Division in eine Dezimalzahl umgewandelt.",
  });
}

function generatePercentQuestion() {
  const variant = randInt(0, 2);
  if (variant === 0) {
    const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 75]);
    const base = pick([40, 60, 80, 100, 120, 150, 200, 240]);
    const result = Math.round((base * p) / 100);
    return buildQuestion({
      topicId: "percent",
      prompt: "Wie viel sind " + p + " % von " + base + "?",
      correct: String(result),
      wrongs: [String(result + 5), String(Math.max(0, result - 5)), String(result + 10), String(Math.round(base / p))],
      hint: "1 % ist der hundertste Teil. Erst 10 % bestimmen hilft oft.",
      explanation: p + " % von " + base + " entspricht " + result + ".",
    });
  }

  if (variant === 1) {
    const price = pick([20, 30, 40, 50, 60, 80, 100, 120]);
    const p = pick([10, 15, 20, 25, 30]);
    const discount = Math.round((price * p) / 100);
    const newPrice = price - discount;
    return buildQuestion({
      topicId: "percent",
      prompt: "Ein Hoodie kostet " + price + " EUR. Mit " + p + " % Rabatt kostet er ...",
      correct: String(newPrice) + " EUR",
      wrongs: [
        String(price + discount) + " EUR",
        String(discount) + " EUR",
        String(newPrice + 5) + " EUR",
        String(Math.max(1, newPrice - 5)) + " EUR",
      ],
      hint: "Rabatt bedeutet abziehen, nicht addieren.",
      explanation: p + " % von " + price + " sind " + discount + ". Also " + price + " - " + discount + " = " + newPrice + ".",
    });
  }

  const oldValue = pick([20, 40, 50, 60, 80, 100]);
  const percent = pick([10, 20, 25, 30, 40, 50]);
  const newValue = oldValue + Math.round((oldValue * percent) / 100);
  return buildQuestion({
    topicId: "percent",
    prompt: "Ein Wert steigt von " + oldValue + " auf " + newValue + ". Um wie viel Prozent?",
    correct: String(percent) + " %",
    wrongs: [
      String(percent + 5) + " %",
      String(Math.max(1, percent - 5)) + " %",
      String(Math.round((newValue / oldValue) * 10)) + " %",
      String(Math.max(1, Math.round((oldValue / newValue) * 100))) + " %",
    ],
    hint: "Aenderung zuerst bestimmen, dann durch den Ausgangswert teilen.",
    explanation: "Die Differenz ist " + (newValue - oldValue) + ". Bezogen auf " + oldValue + " sind das " + percent + " %.",
  });
}

function generateEquationQuestion() {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Original: ax + b = c
    const x = randInt(-9, 9);
    const a = pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = randInt(-12, 12);
    const c = a * x + b;
    const leftSide = formatLinearTerm(a, b);
    const mistakeNoSubtract = Math.round(c / a);
    const mistakeNoDivide = c - b;
    const mistakeSignFlip = -x;
    const mistakeOffByOne = x + (Math.random() < 0.5 ? 1 : -1);
    const wrongs = [mistakeNoSubtract, mistakeNoDivide, mistakeSignFlip, mistakeOffByOne]
      .map(String)
      .filter((w) => w !== String(x));
    while (wrongs.length < 4) {
      wrongs.push(String(x + wrongs.length + 2));
    }
    return buildQuestion({
      topicId: "equations",
      prompt: "Löse: " + leftSide + " = " + c,
      correct: String(x),
      wrongs: wrongs,
      hint: "Erst die Zahl auf die andere Seite, dann durch den x-Faktor teilen.",
      explanation: "Nach Umformen: x = " + x + ".",
    });
  }

  if (variant === 1) {
    // Equation with brackets: a(x + b) = c
    const x = randInt(-6, 6);
    const a = pick([2, 3, 4, 5, -2, -3]);
    const b = randInt(-5, 5);
    const c = a * (x + b);
    return buildQuestion({
      topicId: "equations",
      prompt: "Löse: " + a + " · (x + " + b + ") = " + c,
      correct: String(x),
      wrongs: [
        String(x + 1),
        String(Math.round(c / a)),
        String(x - b),
        String(-x),
      ].filter((w) => w !== String(x)).slice(0, 4),
      hint: "Erst die Klammer auflösen: " + a + " · x + " + (a * b) + " = " + c + ".",
      explanation: a + " · (x + " + b + ") = " + c + " → x + " + b + " = " + (c / a) + " → x = " + x + ".",
    });
  }

  // variant 2: x on both sides: ax + b = cx + d
  const x = randInt(-8, 8);
  const a = pick([2, 3, 4, 5, 6]);
  const cCoeff = pick([1, 2, 3].filter((n) => n !== a));
  const b = randInt(-10, 10);
  const d = (a - cCoeff) * x + b;
  return buildQuestion({
    topicId: "equations",
    prompt: "Löse: " + a + "x + " + b + " = " + cCoeff + "x + " + d,
    correct: String(x),
    wrongs: [
      String(x + 1),
      String(x - 1),
      String(Math.round((d - b) / a)),
      String(-x),
    ].filter((w) => w !== String(x)).slice(0, 4),
    hint: "Bringe alle x auf eine Seite und alle Zahlen auf die andere.",
    explanation: (a - cCoeff) + "x = " + (d - b) + " → x = " + x + ".",
  });
}

function generateGeometryQuestion() {
  const variant = randInt(0, 5);
  if (variant === 0) {
    const a = randInt(3, 14);
    const b = randInt(3, 14);
    const area = a * b;
    return buildQuestion({
      topicId: "geometry",
      prompt: "Flaeche eines Rechtecks mit a = " + a + " cm und b = " + b + " cm?",
      correct: String(area) + " cm^2",
      wrongs: [
        String(2 * (a + b)) + " cm^2",
        String(area + a) + " cm^2",
        String(Math.max(1, area - b)) + " cm^2",
        String(area + b) + " cm^2",
      ],
      hint: "Rechteckflaeche: a * b.",
      explanation: "A = a * b = " + a + " * " + b + " = " + area + " cm^2.",
    });
  }

  if (variant === 1) {
    const triples = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
    const c = triples[2];
    return buildQuestion({
      topicId: "geometry",
      prompt: "Rechtwinkliges Dreieck mit Katheten " + triples[0] + " cm und " + triples[1] + " cm. Hypotenuse?",
      correct: String(c) + " cm",
      wrongs: [
        String(c + 1) + " cm",
        String(Math.max(1, c - 1)) + " cm",
        String(triples[0] + triples[1]) + " cm",
        String(Math.abs(triples[1] - triples[0])) + " cm",
      ],
      hint: "Pythagoras: a^2 + b^2 = c^2.",
      explanation: triples[0] + "^2 + " + triples[1] + "^2 = " + c + "^2.",
    });
  }

  if (variant === 3) {
    // Circle circumference
    const r = pick([3, 4, 5, 6, 7, 8, 10]);
    return buildQuestion({
      topicId: "geometry",
      prompt: "Umfang eines Kreises mit Radius r = " + r + " cm? (π ≈ 3,14)",
      correct: String(Math.round(2 * 3.14 * r * 10) / 10) + " cm",
      wrongs: [
        String(Math.round(3.14 * r * r * 10) / 10) + " cm",
        String(Math.round(2 * 3.14 * (r + 1) * 10) / 10) + " cm",
        String(Math.round(3.14 * r * 10) / 10) + " cm",
        String(Math.round(2 * 3.14 * r)) + " cm",
      ],
      hint: "Umfang = 2 · π · r. Nicht mit der Fläche verwechseln!",
      explanation: "U = 2 · 3,14 · " + r + " = " + (Math.round(2 * 3.14 * r * 10) / 10) + " cm.",
    });
  }

  if (variant === 4) {
    // Circle area
    const r = pick([2, 3, 4, 5, 6, 7]);
    const area = Math.round(3.14 * r * r * 10) / 10;
    return buildQuestion({
      topicId: "geometry",
      prompt: "Flächeninhalt eines Kreises mit r = " + r + " cm? (π ≈ 3,14)",
      correct: String(area) + " cm²",
      wrongs: [
        String(Math.round(2 * 3.14 * r * 10) / 10) + " cm²",
        String(Math.round(3.14 * r * 10) / 10) + " cm²",
        String(Math.round(3.14 * (r + 1) * (r + 1) * 10) / 10) + " cm²",
        String(Math.round(area + r)) + " cm²",
      ],
      hint: "Fläche = π · r². Zuerst r² berechnen, dann mit π multiplizieren.",
      explanation: "A = 3,14 · " + r + "² = 3,14 · " + (r * r) + " = " + area + " cm².",
    });
  }

  if (variant === 5) {
    // Angle sum in triangle
    const a1 = pick([30, 35, 40, 45, 50, 55, 60]);
    const a2 = pick([30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
    const a3 = 180 - a1 - a2;
    if (a3 <= 0) {
      // fallback to rectangle area if angles don't work out
      const sideA = randInt(3, 14);
      const sideB = randInt(3, 14);
      return buildQuestion({
        topicId: "geometry",
        prompt: "Flaeche eines Rechtecks mit a = " + sideA + " cm und b = " + sideB + " cm?",
        correct: String(sideA * sideB) + " cm²",
        wrongs: [
          String(2 * (sideA + sideB)) + " cm²",
          String(sideA * sideB + sideA) + " cm²",
          String(sideA + sideB) + " cm²",
          String(sideA * sideB - sideB) + " cm²",
        ],
        hint: "Rechteckfläche: a · b.",
        explanation: "A = " + sideA + " · " + sideB + " = " + (sideA * sideB) + " cm².",
      });
    }
    return buildQuestion({
      topicId: "geometry",
      prompt: "Im Dreieck sind zwei Winkel bekannt: α = " + a1 + "°, β = " + a2 + "°. Wie groß ist γ?",
      correct: String(a3) + "°",
      wrongs: [
        String(a3 + 10) + "°",
        String(Math.max(1, a3 - 10)) + "°",
        String(180 - a1) + "°",
        String(a1 + a2) + "°",
      ],
      hint: "Winkelsumme im Dreieck = 180°. Also γ = 180° − α − β.",
      explanation: "γ = 180° − " + a1 + "° − " + a2 + "° = " + a3 + "°.",
    });
  }

  const base = pick([6, 8, 10, 12, 14, 16]);
  const height = pick([4, 6, 8, 10, 12]);
  const area = (base * height) / 2;
  return buildQuestion({
    topicId: "geometry",
    prompt: "Flaeche eines Dreiecks mit g = " + base + " cm und h = " + height + " cm?",
    correct: String(area) + " cm^2",
    wrongs: [
      String(base * height) + " cm^2",
      String(area + 4) + " cm^2",
      String(Math.max(1, area - 4)) + " cm^2",
      String(base + height) + " cm^2",
    ],
    hint: "Dreiecksformel: A = (g * h) / 2.",
    explanation: "A = (" + base + " * " + height + ") / 2 = " + area + " cm^2.",
  });
}

function generateFunctionQuestion() {
  const variant = randInt(0, 3);
  if (variant === 0) {
    const m = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const b = randInt(-8, 8);
    const x = randInt(-5, 6);
    const y = m * x + b;
    return buildQuestion({
      topicId: "functions",
      prompt: "Berechne y fuer y = " + formatLinearTerm(m, b) + " bei x = " + x + ".",
      correct: String(y),
      wrongs: [String(y + 1), String(y - 1), String(m + b), String(x + b)],
      hint: "Setze x ein und rechne Schritt fuer Schritt.",
      explanation: "y = " + m + " * " + x + (b >= 0 ? " + " : " - ") + Math.abs(b) + " = " + y + ".",
    });
  }

  if (variant === 2) {
    // y-intercept: given m and a point, find b
    const m = pick([-3, -2, -1, 1, 2, 3]);
    const b = randInt(-6, 6);
    const x0 = pick([-3, -2, -1, 1, 2, 3]);
    const y0 = m * x0 + b;
    return buildQuestion({
      topicId: "functions",
      prompt: "Eine Gerade hat Steigung m = " + m + " und verläuft durch (" + x0 + "|" + y0 + "). Wie lautet b?",
      correct: String(b),
      wrongs: [
        String(b + 1),
        String(b - 1),
        String(y0 - m),
        String(-b),
      ],
      hint: "Verwende y = m · x + b → b = y − m · x.",
      explanation: "b = " + y0 + " − " + m + " · " + x0 + " = " + y0 + " − " + (m * x0) + " = " + b + ".",
    });
  }

  if (variant === 3) {
    // Proportional function: direct reading
    const m = pick([-4, -3, -2, 2, 3, 4]);
    const x1 = pick([-3, -2, -1, 1, 2, 3]);
    const x2 = pick([-3, -2, -1, 1, 2, 3].filter((x) => x !== x1));
    const y1 = m * x1;
    const y2 = m * x2;
    return buildQuestion({
      topicId: "functions",
      prompt: "Eine Funktion ist proportional. Bei x = " + x1 + " gilt y = " + y1 + ". Was ist y bei x = " + x2 + "?",
      correct: String(y2),
      wrongs: [
        String(y2 + m),
        String(y2 - m),
        String(y1 + x2),
        String(m + x2),
      ],
      hint: "Proportionale Funktion: y = m · x. Erst m bestimmen: m = y/x.",
      explanation: "m = " + y1 + " / " + x1 + " = " + m + ". Also y = " + m + " · " + x2 + " = " + y2 + ".",
    });
  }

  const m = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const b = randInt(-5, 5);
  const x1 = randInt(-4, -1);
  const x2 = randInt(2, 6);
  const y1 = m * x1 + b;
  const y2 = m * x2 + b;
  return buildQuestion({
    topicId: "functions",
    prompt: "Bestimme die Steigung m durch die Punkte (" + x1 + "|" + y1 + ") und (" + x2 + "|" + y2 + ").",
    correct: String(m),
    wrongs: [String(m + 1), String(m - 1), String(-m), String(m + 2)],
    hint: "m = (y2 - y1) / (x2 - x1).",
    explanation: "(" + y2 + " - " + y1 + ") / (" + x2 + " - " + x1 + ") = " + m + ".",
  });
}

function buildQuestion(data) {
  const optionData = buildOptions(String(data.correct), data.wrongs.map(String));
  return {
    topicId: data.topicId,
    prompt: data.prompt,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    hint: data.hint,
    explanation: data.explanation,
  };
}

function buildOptions(correct, wrongs) {
  const set = new Set([correct]);
  const shuffledWrongs = shuffle(wrongs.slice());
  for (const wrong of shuffledWrongs) {
    if (set.size >= 4) {
      break;
    }
    if (wrong !== correct) {
      set.add(wrong);
    }
  }

  let guard = 0;
  let fallbackBase = 999;
  while (set.size < 4 && guard < 30) {
    guard += 1;
    fallbackBase += guard * 7;
    const fallback = String(fallbackBase);
    if (!set.has(fallback)) {
      set.add(fallback);
    }
  }

  const options = shuffle(Array.from(set)).slice(0, 4);
  if (!options.includes(correct)) {
    options[0] = correct;
  }
  const shuffled = shuffle(options);
  return { options: shuffled, correctIndex: shuffled.indexOf(correct) };
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  const n = numerator / divisor;
  const d = denominator / divisor;
  if (d === 1) {
    return String(n);
  }
  return n + "/" + d;
}

function formatLinearTerm(a, b) {
  const xPart = a === 1 ? "x" : (a === -1 ? "-x" : a + "x");
  if (b === 0) {
    return xPart;
  }
  if (b > 0) {
    return xPart + " + " + b;
  }
  return xPart + " - " + Math.abs(b);
}

function renderStars(count) {
  const safeCount = Math.max(0, Math.min(3, count));
  return "★".repeat(safeCount) + "☆".repeat(3 - safeCount);
}

function toGermanDecimal(value) {
  return String(Number(value.toFixed(3))).replace(".", ",");
}

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array) {
  return array[randInt(0, array.length - 1)];
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function toSafeInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function defaultState() {
  const missions = {};
  TOPICS.forEach((topic) => {
    missions[topic.id] = 0;
  });

  return {
    profile: {
      name: "Mathe-Captain",
      dailyGoal: 90,
    },
    xp: 0,
    coins: 0,
    totalPoints: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    roundsPlayed: 0,
    bestCombo: 0,
    dayStreak: 0,
    bestDayStreak: 0,
    lastPlayedDate: "",
    missions: missions,
    badges: [],
    bossWins: 0,
    dailyWins: 0,
    dailyXp: 0,
    bonusHints: 0,
    bonusSkips: 0,
    titlePro: 0,
    themeNight: 0,
    uiTheme: "dark",
    daily: {
      date: "",
      done: false,
    },
  };
}

function loadState() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return base;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return base;
    }

    const merged = {
      ...base,
      ...parsed,
      profile: {
        ...base.profile,
        ...(parsed.profile || {}),
      },
      missions: {
        ...base.missions,
        ...(parsed.missions || {}),
      },
      daily: {
        ...base.daily,
        ...(parsed.daily || {}),
      },
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    };

    merged.xp = toSafeInt(merged.xp, 0);
    merged.coins = toSafeInt(merged.coins, 0);
    merged.totalPoints = toSafeInt(merged.totalPoints, 0);
    merged.totalAnswered = toSafeInt(merged.totalAnswered, 0);
    merged.totalCorrect = toSafeInt(merged.totalCorrect, 0);
    merged.roundsPlayed = toSafeInt(merged.roundsPlayed, 0);
    merged.bestCombo = toSafeInt(merged.bestCombo, 0);
    merged.dayStreak = toSafeInt(merged.dayStreak, 0);
    merged.bestDayStreak = toSafeInt(merged.bestDayStreak, 0);
    merged.bossWins = toSafeInt(merged.bossWins, 0);
    merged.dailyWins = toSafeInt(merged.dailyWins, 0);
    merged.dailyXp = toSafeInt(merged.dailyXp, 0);
    merged.bonusHints  = Math.max(0, Math.min(3, toSafeInt(merged.bonusHints, 0)));
    merged.bonusSkips  = Math.max(0, Math.min(3, toSafeInt(merged.bonusSkips, 0)));
    merged.titlePro    = Math.max(0, Math.min(1, toSafeInt(merged.titlePro, 0)));
    merged.themeNight  = Math.max(0, Math.min(1, toSafeInt(merged.themeNight, 0)));
    merged.uiTheme = merged.uiTheme === "light" ? "light" : "dark";
    merged.profile.dailyGoal = toSafeInt(merged.profile.dailyGoal, 90);
    merged.profile.name = String(merged.profile.name || "Mathe-Captain");
    merged.daily.date = String(merged.daily.date || "");
    merged.daily.done = Boolean(merged.daily.done);

    for (const topic of TOPICS) {
      merged.missions[topic.id] = Math.max(0, Math.min(3, toSafeInt(merged.missions[topic.id], 0)));
    }

    return merged;
  } catch (error) {
    return base;
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Ignore storage errors in restrictive browser modes.
  }
}
