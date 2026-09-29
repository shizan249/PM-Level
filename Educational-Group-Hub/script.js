/**
 * Educational Group Hub - Complete Application Script
 * Features:
 * - Direct One-Tap Launch to Messenger/Facebook on Card Click
 * - 69 default educational groups (Science, Humanities, Commerce x HSC & Admission)
 * - Exact level-aware search (L1 != L10, Hard Task matching)
 * - In-place Admin Link editing with single-source-of-truth localStorage
 * - Bright, energetic, mobile-first design with PWA support
 */

// ==========================================
// 1. CONSTANTS & CONFIGURATION
// ==========================================
const STORAGE_KEY = "educationalGroupHubData";
const FAVORITES_KEY = "educationalGroupHubFavorites";
const RECENT_KEY = "educationalGroupHubRecent";
const THEME_KEY = "educationalGroupHubTheme";
const ADMIN_AUTH_KEY = "educationalGroupHubAdminAuth";

// Default admin password (can be customized by the admin)
const ADMIN_PASSWORD = "admin123";

// ==========================================
// 2. DEFAULT 69 EDUCATIONAL GROUPS DATASET
// 3 Sections x (10 HSC + 13 Admission) = 69 Groups
// ==========================================
const DEFAULT_GROUPS = [
  // ----------------------------------------
  // SCIENCE SECTION (23 Groups)
  // ----------------------------------------
  // Science - HSC (10 Groups: L1 - L10)
  { id: 1, section: "Science", category: "HSC", level: "L1", groupName: "Science HSC L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 2, section: "Science", category: "HSC", level: "L2", groupName: "Science HSC L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 3, section: "Science", category: "HSC", level: "L3", groupName: "Science HSC L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 4, section: "Science", category: "HSC", level: "L4", groupName: "Science HSC L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 5, section: "Science", category: "HSC", level: "L5", groupName: "Science HSC L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 6, section: "Science", category: "HSC", level: "L6", groupName: "Science HSC L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 7, section: "Science", category: "HSC", level: "L7", groupName: "Science HSC L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 8, section: "Science", category: "HSC", level: "L8", groupName: "Science HSC L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 9, section: "Science", category: "HSC", level: "L9", groupName: "Science HSC L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 10, section: "Science", category: "HSC", level: "L10", groupName: "Science HSC L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },

  // Science - Admission (13 Groups: L1 - L10 + Hard Task 1..3)
  { id: 11, section: "Science", category: "Admission", level: "L1", groupName: "Science Admission L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 12, section: "Science", category: "Admission", level: "L2", groupName: "Science Admission L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 13, section: "Science", category: "Admission", level: "L3", groupName: "Science Admission L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 14, section: "Science", category: "Admission", level: "L4", groupName: "Science Admission L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 15, section: "Science", category: "Admission", level: "L5", groupName: "Science Admission L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 16, section: "Science", category: "Admission", level: "L6", groupName: "Science Admission L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 17, section: "Science", category: "Admission", level: "L7", groupName: "Science Admission L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 18, section: "Science", category: "Admission", level: "L8", groupName: "Science Admission L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 19, section: "Science", category: "Admission", level: "L9", groupName: "Science Admission L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 20, section: "Science", category: "Admission", level: "L10", groupName: "Science Admission L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 21, section: "Science", category: "Admission", level: "Hard Task 1", groupName: "Science Admission Hard Task 1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 22, section: "Science", category: "Admission", level: "Hard Task 2", groupName: "Science Admission Hard Task 2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 23, section: "Science", category: "Admission", level: "Hard Task 3", groupName: "Science Admission Hard Task 3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },

  // ----------------------------------------
  // HUMANITIES SECTION (23 Groups)
  // ----------------------------------------
  // Humanities - HSC (10 Groups: L1 - L10)
  { id: 24, section: "Humanities", category: "HSC", level: "L1", groupName: "Humanities HSC L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 25, section: "Humanities", category: "HSC", level: "L2", groupName: "Humanities HSC L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 26, section: "Humanities", category: "HSC", level: "L3", groupName: "Humanities HSC L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 27, section: "Humanities", category: "HSC", level: "L4", groupName: "Humanities HSC L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 28, section: "Humanities", category: "HSC", level: "L5", groupName: "Humanities HSC L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 29, section: "Humanities", category: "HSC", level: "L6", groupName: "Humanities HSC L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 30, section: "Humanities", category: "HSC", level: "L7", groupName: "Humanities HSC L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 31, section: "Humanities", category: "HSC", level: "L8", groupName: "Humanities HSC L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 32, section: "Humanities", category: "HSC", level: "L9", groupName: "Humanities HSC L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 33, section: "Humanities", category: "HSC", level: "L10", groupName: "Humanities HSC L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },

  // Humanities - Admission (13 Groups: L1 - L10 + Hard Task 1..3)
  { id: 34, section: "Humanities", category: "Admission", level: "L1", groupName: "Humanities Admission L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 35, section: "Humanities", category: "Admission", level: "L2", groupName: "Humanities Admission L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 36, section: "Humanities", category: "Admission", level: "L3", groupName: "Humanities Admission L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 37, section: "Humanities", category: "Admission", level: "L4", groupName: "Humanities Admission L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 38, section: "Humanities", category: "Admission", level: "L5", groupName: "Humanities Admission L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 39, section: "Humanities", category: "Admission", level: "L6", groupName: "Humanities Admission L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 40, section: "Humanities", category: "Admission", level: "L7", groupName: "Humanities Admission L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 41, section: "Humanities", category: "Admission", level: "L8", groupName: "Humanities Admission L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 42, section: "Humanities", category: "Admission", level: "L9", groupName: "Humanities Admission L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 43, section: "Humanities", category: "Admission", level: "L10", groupName: "Humanities Admission L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 44, section: "Humanities", category: "Admission", level: "Hard Task 1", groupName: "Humanities Admission Hard Task 1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 45, section: "Humanities", category: "Admission", level: "Hard Task 2", groupName: "Humanities Admission Hard Task 2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 46, section: "Humanities", category: "Admission", level: "Hard Task 3", groupName: "Humanities Admission Hard Task 3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },

  // ----------------------------------------
  // COMMERCE SECTION (23 Groups)
  // ----------------------------------------
  // Commerce - HSC (10 Groups: L1 - L10)
  { id: 47, section: "Commerce", category: "HSC", level: "L1", groupName: "Commerce HSC L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 48, section: "Commerce", category: "HSC", level: "L2", groupName: "Commerce HSC L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 49, section: "Commerce", category: "HSC", level: "L3", groupName: "Commerce HSC L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 50, section: "Commerce", category: "HSC", level: "L4", groupName: "Commerce HSC L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 51, section: "Commerce", category: "HSC", level: "L5", groupName: "Commerce HSC L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 52, section: "Commerce", category: "HSC", level: "L6", groupName: "Commerce HSC L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 53, section: "Commerce", category: "HSC", level: "L7", groupName: "Commerce HSC L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 54, section: "Commerce", category: "HSC", level: "L8", groupName: "Commerce HSC L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 55, section: "Commerce", category: "HSC", level: "L9", groupName: "Commerce HSC L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },
  { id: 56, section: "Commerce", category: "HSC", level: "L10", groupName: "Commerce HSC L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "HSC 2025/2026", status: "Active" },

  // Commerce - Admission (13 Groups: L1 - L10 + Hard Task 1..3)
  { id: 57, section: "Commerce", category: "Admission", level: "L1", groupName: "Commerce Admission L1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 58, section: "Commerce", category: "Admission", level: "L2", groupName: "Commerce Admission L2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 59, section: "Commerce", category: "Admission", level: "L3", groupName: "Commerce Admission L3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 60, section: "Commerce", category: "Admission", level: "L4", groupName: "Commerce Admission L4", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 61, section: "Commerce", category: "Admission", level: "L5", groupName: "Commerce Admission L5", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 62, section: "Commerce", category: "Admission", level: "L6", groupName: "Commerce Admission L6", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 63, section: "Commerce", category: "Admission", level: "L7", groupName: "Commerce Admission L7", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 64, section: "Commerce", category: "Admission", level: "L8", groupName: "Commerce Admission L8", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 65, section: "Commerce", category: "Admission", level: "L9", groupName: "Commerce Admission L9", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 66, section: "Commerce", category: "Admission", level: "L10", groupName: "Commerce Admission L10", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 67, section: "Commerce", category: "Admission", level: "Hard Task 1", groupName: "Commerce Admission Hard Task 1", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 68, section: "Commerce", category: "Admission", level: "Hard Task 2", groupName: "Commerce Admission Hard Task 2", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" },
  { id: 69, section: "Commerce", category: "Admission", level: "Hard Task 3", groupName: "Commerce Admission Hard Task 3", platform: "Messenger", link: "", admin: "Shizan Vaiya", batch: "Admission 2025", status: "Active" }
];

// ==========================================
// 3. APPLICATION STATE
// Central Dataset Architecture
// ==========================================
let groups = [];
let favorites = [];
let recentlyOpened = [];
let currentNavigation = { view: "home", section: null, category: null, level: null };
let deferredInstallPrompt = null;

// ==========================================
// 4. INITIALIZATION & STORAGE
// ==========================================
function initApp() {
  loadGroups();
  loadFavorites();
  loadRecent();
  initTheme();
  initServiceWorker();
  initPWAInstall();
  renderApp();
  setupEventListeners();
  updateQuickChipCounts();
}

/**
 * Loads groups from localStorage or seeds initial 69 groups
 */
function loadGroups() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        groups = parsed;
        return;
      }
    }
  } catch (err) {
    console.error("Error reading localStorage groups:", err);
  }
  // Fallback to default 69 groups
  groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  saveGroups();
}

function saveGroups() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (err) {
    console.error("Error saving groups to localStorage:", err);
    showToast("Failed to save data to local storage", "error");
  }
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    favorites = stored ? JSON.parse(stored) : [];
  } catch (e) {
    favorites = [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function loadRecent() {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    recentlyOpened = stored ? JSON.parse(stored) : [];
  } catch (e) {
    recentlyOpened = [];
  }
}

function saveRecent() {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyOpened));
}

// ==========================================
// 5. THEME (BRIGHT & ENERGETIC)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    // Default to bright, energetic mode!
    document.documentElement.setAttribute("data-theme", "light");
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon();
  showToast(newTheme === "light" ? "ব্রাইট মোড চালু হয়েছে ☀️" : "ডার্ক মোড চালু হয়েছে 🌙", "success");
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀️" : "🌙";
  btn.title = isDark ? "ব্রাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন";
}

// ==========================================
// 6. EXACT LEVEL-AWARE SEARCH (L1 != L10)
// ==========================================
function searchGroups(query) {
  if (!query || !query.trim()) return [];

  const rawQuery = query.trim().toLowerCase();
  const tokens = rawQuery.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) return [];

  return groups.filter((g) => {
    return tokens.every((token) => {
      // Rule 1: Exact Level token (l1, l2, ..., l10)
      const levelMatch = token.match(/^l([1-9]|10)$/i);
      if (levelMatch) {
        return g.level.toLowerCase() === token;
      }

      // Rule 2: Hard Task token
      if (token === "hard") {
        return g.level.toLowerCase().includes("hard");
      }
      if (token === "task") {
        return g.level.toLowerCase().includes("task");
      }

      // Rule 3: Word boundary / Substring matching
      const sectionLower = (g.section || "").toLowerCase();
      const categoryLower = (g.category || "").toLowerCase();
      const groupNameLower = (g.groupName || "").toLowerCase();
      const levelLower = (g.level || "").toLowerCase();

      const regexWordBoundary = new RegExp(`\\b${escapeRegExp(token)}\\b`, "i");
      if (regexWordBoundary.test(levelLower)) return true;

      return (
        sectionLower.includes(token) ||
        categoryLower.includes(token) ||
        groupNameLower.includes(token) ||
        levelLower.includes(token)
      );
    });
  }).sort((a, b) => {
    if (a.link && !b.link) return -1;
    if (!a.link && b.link) return 1;
    return a.id - b.id;
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setupSearchInput() {
  const input = document.getElementById("globalSearchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  const dropdown = document.getElementById("searchResultsDropdown");

  if (!input || !dropdown) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value;
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? "flex" : "none";
    }
    renderLiveSearchResults(query);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim().length > 0) {
      renderLiveSearchResults(input.value);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.style.display = "none";
      dropdown.classList.remove("visible");
      dropdown.innerHTML = "";
      input.focus();
    });
  }

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      dropdown.classList.remove("visible");
    }
  });
}

function renderLiveSearchResults(query) {
  const dropdown = document.getElementById("searchResultsDropdown");
  if (!dropdown) return;

  const trimmed = query ? query.trim() : "";
  if (!trimmed) {
    dropdown.classList.remove("visible");
    dropdown.innerHTML = "";
    return;
  }

  const results = searchGroups(trimmed);
  dropdown.classList.add("visible");

  if (results.length === 0) {
    dropdown.innerHTML = `
      <div class="search-empty-state">
        <div class="search-empty-icon">🔍</div>
        <div class="search-empty-title">কোন গ্রুপ পাওয়া যায়নি</div>
        <div class="search-empty-hints">নিচের কি-ওয়ার্ডগুলো সার্চ করে দেখুন:</div>
        <div class="search-chip-group">
          <button class="search-hint-chip" onclick="applySearchTerm('L1')">L1</button>
          <button class="search-hint-chip" onclick="applySearchTerm('HSC')">HSC</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Admission')">Admission</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Hard')">Hard Task</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Science')">Science</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Commerce')">Commerce</button>
        </div>
      </div>
    `;
    return;
  }

  let html = `
    <div class="search-results-header">
      <span>খুঁজে পাওয়া গ্রুপ (${results.length})</span>
      <span>⚡ ক্লিক করলেই মেসেঞ্জারে যাবে</span>
    </div>
  `;

  results.forEach((g) => {
    const isFav = favorites.includes(g.id);
    const hasLink = Boolean(g.link && g.link.trim());

    html += `
      <div class="search-result-item" onclick="handleSearchResultClick(${g.id})">
        <div class="result-info">
          <div class="result-breadcrumb">
            ${g.section} → ${g.category} → ${g.level}
          </div>
          <div class="result-title">${escapeHtml(g.groupName)}</div>
          <div class="result-badges">
            <span class="badge badge-messenger">💬 Messenger</span>
            ${hasLink ? '<span class="badge badge-has-link">🟢 লিংক আছে</span>' : '<span class="badge badge-no-link">⚪ লিংক বাকি</span>'}
          </div>
        </div>
        <div class="result-actions" onclick="event.stopPropagation()">
          <button class="btn btn-sm ${hasLink ? 'btn-messenger' : 'btn-secondary'}" onclick="openGroupDirectly(${g.id})">
            ${hasLink ? "মেসেঞ্জারে যান ↗" : "লিংক যোগ করুন ✏️"}
          </button>
          <button class="btn-icon btn-sm ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${g.id}, this)">
            ${isFav ? "★" : "☆"}
          </button>
        </div>
      </div>
    `;
  });

  dropdown.innerHTML = html;
}

function applySearchTerm(term) {
  const input = document.getElementById("globalSearchInput");
  if (input) {
    input.value = term;
    input.focus();
    renderLiveSearchResults(term);
    const clearBtn = document.getElementById("searchClearBtn");
    if (clearBtn) clearBtn.style.display = "flex";
  }
}

function handleSearchResultClick(groupId) {
  const dropdown = document.getElementById("searchResultsDropdown");
  if (dropdown) dropdown.classList.remove("visible");
  openGroupDirectly(groupId);
}

// ==========================================
// 7. DIRECT GROUP OPENING (CORE REQUIREMENT)
// One-Tap Direct to Messenger
// ==========================================
function openGroupDirectly(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  // Add to recently opened
  addRecent(group.id);

  if (group.link && group.link.trim()) {
    showToast(`মেসেঞ্জার ওপেন হচ্ছে: ${group.groupName}... 🚀`, "success");
    // Directly open the saved Messenger / Facebook link in new tab or native app
    window.open(group.link.trim(), "_blank", "noopener,noreferrer");
  } else {
    // If no link is added yet, prompt admin to add it immediately!
    showNoLinkPrompt(group);
  }
}

/**
 * Prompt shown ONLY when link is not set yet, with 1-click option to add link
 */
function showNoLinkPrompt(group) {
  const modal = document.getElementById("noLinkPromptModal");
  if (!modal) {
    showToast(`⚠️ ${group.groupName} এর লিংক এখনো যোগ করা হয়নি! অ্যাডমিন প্যানেল থেকে লিংক দিন।`, "warning");
    return;
  }

  document.getElementById("noLinkGroupName").textContent = group.groupName;
  document.getElementById("noLinkAddBtn").onclick = () => {
    closeModal("noLinkPromptModal");
    handleAdminAccess(() => {
      openEditGroupModal(group.id);
    });
  };

  openModal("noLinkPromptModal");
}

// ==========================================
// 8. FAVORITES & RECENT
// ==========================================
function toggleFavorite(groupId, buttonEl) {
  const index = favorites.indexOf(groupId);
  let isFav = false;
  if (index > -1) {
    favorites.splice(index, 1);
    showToast("ফেভারিট থেকে সরানো হয়েছে", "warning");
  } else {
    favorites.push(groupId);
    isFav = true;
    showToast("ফেভারিটে সেভ হয়েছে ⭐", "success");
  }
  saveFavorites();
  updateQuickChipCounts();

  if (buttonEl) {
    buttonEl.classList.toggle("favorited", isFav);
    buttonEl.textContent = isFav ? "★" : "☆";
  }

  if (currentNavigation.view === "favorites") {
    renderFavoritesView();
  } else if (currentNavigation.view === "home") {
    renderHomeView();
  }
}

function addRecent(groupId) {
  recentlyOpened = recentlyOpened.filter((id) => id !== groupId);
  recentlyOpened.unshift(groupId);
  if (recentlyOpened.length > 5) {
    recentlyOpened = recentlyOpened.slice(0, 5);
  }
  saveRecent();
  updateQuickChipCounts();
  if (currentNavigation.view === "home") {
    renderRecentSection();
  }
}

function updateQuickChipCounts() {
  const favCount = document.getElementById("favChipCount");
  if (favCount) favCount.textContent = favorites.length;

  const recCount = document.getElementById("recentChipCount");
  if (recCount) recCount.textContent = recentlyOpened.length;
}

// ==========================================
// 9. MANUAL NAVIGATION & RENDERING
// ==========================================
function navigateTo(view, section = null, category = null, level = null) {
  currentNavigation = { view, section, category, level };
  const dropdown = document.getElementById("searchResultsDropdown");
  if (dropdown) dropdown.classList.remove("visible");

  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderApp() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  switch (currentNavigation.view) {
    case "section":
      renderSectionView();
      break;
    case "category":
      renderCategoryView();
      break;
    case "favorites":
      renderFavoritesView();
      break;
    case "recent":
      renderRecentView();
      break;
    case "home":
    default:
      renderHomeView();
      break;
  }
}

/**
 * HOME VIEW:
 * 3 Section Cards + Favorites & Recent
 */
function renderHomeView() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  const scienceCount = groups.filter((g) => g.section === "Science").length;
  const humanitiesCount = groups.filter((g) => g.section === "Humanities").length;
  const commerceCount = groups.filter((g) => g.section === "Commerce").length;

  let html = `
    <!-- Instruction Banner -->
    <div class="quick-instruction-bar">
      <span class="instruction-text">⚡ সেকশন বেছে নিয়ে সরাসরি মেসেঞ্জার গ্রুপে জয়েন করুন</span>
      <button class="btn btn-sm btn-secondary" onclick="handleAdminAccess()">⚙️ লিংক সেট করুন</button>
    </div>

    <!-- Section Navigation Cards -->
    <div class="section-cards-grid">
      <!-- Science Card -->
      <div class="section-card section-science" onclick="navigateTo('section', 'Science')">
        <div class="section-card-header">
          <span class="section-icon">🔬</span>
          <div>
            <div class="section-title">Science</div>
            <span class="section-count-badge">${scienceCount} টি গ্রুপ</span>
          </div>
        </div>
        <p class="section-desc">ফিজিক্স, কেমিস্ট্রি, বায়োলজি ও হায়ার ম্যাথ একাডেমিক এবং এডমিশন গ্রুপ</p>
        <div class="section-categories-preview">
          <span class="cat-pill">📘 HSC: L1–L10</span>
          <span class="cat-pill">🎯 Admission: L1–L10 + Hard Tasks</span>
        </div>
      </div>

      <!-- Humanities Card -->
      <div class="section-card section-humanities" onclick="navigateTo('section', 'Humanities')">
        <div class="section-card-header">
          <span class="section-icon">📚</span>
          <div>
            <div class="section-title">Humanities</div>
            <span class="section-count-badge">${humanitiesCount} টি গ্রুপ</span>
          </div>
        </div>
        <p class="section-desc">ইতিহাস, পৌরনীতি, অর্থনীতি, যুক্তিবিদ্যা ও মানবিক শিক্ষা গ্রুপ</p>
        <div class="section-categories-preview">
          <span class="cat-pill">📘 HSC: L1–L10</span>
          <span class="cat-pill">🎯 Admission: L1–L10 + Hard Tasks</span>
        </div>
      </div>

      <!-- Commerce Card -->
      <div class="section-card section-commerce" onclick="navigateTo('section', 'Commerce')">
        <div class="section-card-header">
          <span class="section-icon">💼</span>
          <div>
            <div class="section-title">Commerce</div>
            <span class="section-count-badge">${commerceCount} টি গ্রুপ</span>
          </div>
        </div>
        <p class="section-desc">অ্যাকাউন্টিং, ফিন্যান্স, ম্যানেজমেন্ট ও ব্যবসায় শিক্ষা গ্রুপ</p>
        <div class="section-categories-preview">
          <span class="cat-pill">📘 HSC: L1–L10</span>
          <span class="cat-pill">🎯 Admission: L1–L10 + Hard Tasks</span>
        </div>
      </div>
    </div>

    <!-- Favorites Section -->
    <div id="homeFavoritesSection"></div>

    <!-- Recently Opened Section -->
    <div id="homeRecentSection"></div>
  `;

  mainContent.innerHTML = html;
  renderFavoritesSection();
  renderRecentSection();
}

function renderFavoritesSection() {
  const container = document.getElementById("homeFavoritesSection");
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = "";
    return;
  }

  const favGroups = favorites.map((id) => groups.find((g) => g.id === id)).filter(Boolean);

  let html = `
    <div class="home-section-header">
      <div class="home-section-title">
        <span>⭐ বুকমার্ক করা গ্রুপ</span>
        <span class="home-section-count">${favGroups.length}</span>
      </div>
      <button class="footer-link" onclick="navigateTo('favorites')">সবগুলো দেখুন →</button>
    </div>
    <div class="horizontal-scroll-list">
  `;

  favGroups.forEach((g) => {
    const hasLink = Boolean(g.link && g.link.trim());
    html += `
      <div class="mini-launch-card" onclick="openGroupDirectly(${g.id})">
        <div>
          <div class="mini-card-crumb">${g.section} • ${g.category}</div>
          <div class="mini-card-title">${escapeHtml(g.groupName)}</div>
        </div>
        <div style="margin-top: 0.65rem;">
          <div class="mini-launch-btn">
            ${hasLink ? '💬 মেসেঞ্জারে যান ↗' : '✏️ লিংক দিন'}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function renderRecentSection() {
  const container = document.getElementById("homeRecentSection");
  if (!container) return;

  if (recentlyOpened.length === 0) {
    container.innerHTML = "";
    return;
  }

  const recGroups = recentlyOpened.map((id) => groups.find((g) => g.id === id)).filter(Boolean);

  let html = `
    <div class="home-section-header">
      <div class="home-section-title">
        <span>🕘 সম্প্রতি ওপেন করা গ্রুপ</span>
        <span class="home-section-count">${recGroups.length}</span>
      </div>
      <button class="footer-link" onclick="clearRecentHistory()">মুছে ফেলুন</button>
    </div>
    <div class="horizontal-scroll-list">
  `;

  recGroups.forEach((g) => {
    const hasLink = Boolean(g.link && g.link.trim());
    html += `
      <div class="mini-launch-card" onclick="openGroupDirectly(${g.id})">
        <div>
          <div class="mini-card-crumb">${g.section} • ${g.category}</div>
          <div class="mini-card-title">${escapeHtml(g.groupName)}</div>
        </div>
        <div style="margin-top: 0.65rem;">
          <div class="mini-launch-btn">
            ${hasLink ? '💬 মেসেঞ্জারে যান ↗' : '✏️ লিংক দিন'}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function clearRecentHistory() {
  recentlyOpened = [];
  saveRecent();
  renderRecentSection();
  updateQuickChipCounts();
  showToast("হিস্ট্রি ক্লিয়ার করা হয়েছে", "warning");
}

/**
 * SECTION VIEW:
 * E.g., Science -> Shows HSC & Admission cards
 */
function renderSectionView() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  const section = currentNavigation.section;
  const hscCount = groups.filter((g) => g.section === section && g.category === "HSC").length;
  const admCount = groups.filter((g) => g.section === section && g.category === "Admission").length;

  let html = `
    <div class="view-nav-bar">
      <div class="breadcrumb-trail">
        <span class="breadcrumb-crumb" onclick="navigateTo('home')">Home</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-crumb active">${section}</span>
      </div>
      <button class="back-btn" onclick="navigateTo('home')">← ব্যাকে যান</button>
    </div>

    <div class="category-cards-grid">
      <!-- HSC Category Card -->
      <div class="category-card" onclick="navigateTo('category', '${section}', 'HSC')">
        <div class="cat-header">
          <div class="cat-name">📘 HSC গ্রুপসমূহ</div>
          <span class="cat-groups-count">${hscCount} Groups</span>
        </div>
        <p class="cat-details">এইচএসসি পরীক্ষার প্রস্তুতি গ্রুপ (L1 থেকে L10)। কার্ডে ক্লিক করলেই সরাসরি মেসেঞ্জার ওপেন হবে।</p>
        <div class="cat-levels-list">
          <span class="cat-level-tag">L1</span>
          <span class="cat-level-tag">L2</span>
          <span class="cat-level-tag">L3</span>
          <span class="cat-level-tag">L4</span>
          <span class="cat-level-tag">L5</span>
          <span class="cat-level-tag">L6</span>
          <span class="cat-level-tag">L7</span>
          <span class="cat-level-tag">L8</span>
          <span class="cat-level-tag">L9</span>
          <span class="cat-level-tag">L10</span>
        </div>
      </div>

      <!-- Admission Category Card -->
      <div class="category-card" onclick="navigateTo('category', '${section}', 'Admission')">
        <div class="cat-header">
          <div class="cat-name">🎯 Admission গ্রুপসমূহ</div>
          <span class="cat-groups-count">${admCount} Groups</span>
        </div>
        <p class="cat-details">বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি গ্রুপ (L1 থেকে L10 এবং Hard Task 1, 2, 3)। সরাসরি মেসেঞ্জার লিংক।</p>
        <div class="cat-levels-list">
          <span class="cat-level-tag">L1–L10</span>
          <span class="cat-level-tag">Hard Task 1</span>
          <span class="cat-level-tag">Hard Task 2</span>
          <span class="cat-level-tag">Hard Task 3</span>
        </div>
      </div>
    </div>
  `;

  mainContent.innerHTML = html;
}

/**
 * ==========================================================
 * CATEGORY VIEW - DIRECT MESSENGER CLICK CARDS!
 * (User Requirement: Clicking any card opens Messenger directly!)
 * ==========================================================
 */
function renderCategoryView() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  const { section, category } = currentNavigation;
  const filtered = groups.filter((g) => g.section === section && g.category === category);

  let html = `
    <div class="view-nav-bar">
      <div class="breadcrumb-trail">
        <span class="breadcrumb-crumb" onclick="navigateTo('home')">Home</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-crumb" onclick="navigateTo('section', '${section}')">${section}</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-crumb active">${category}</span>
      </div>
      <button class="back-btn" onclick="navigateTo('section', '${section}')">← ক্যাটাগরিতে ফেরত</button>
    </div>

    <!-- Direct One-Tap Action Notice -->
    <div class="direct-open-banner">
      <span>⚡ যেকোনো লেভেল কার্ডে ক্লিক করলেই ডাইরেক্ট মেসেঞ্জারে নিয়ে যাবে</span>
      <button class="btn btn-sm btn-secondary" onclick="handleAdminAccess()">⚙️ লিংক ম্যানেজ</button>
    </div>

    <div class="groups-grid">
  `;

  filtered.forEach((g) => {
    const isFav = favorites.includes(g.id);
    const hasLink = Boolean(g.link && g.link.trim());
    const isHardTask = g.level.toLowerCase().includes("hard");

    html += `
      <!-- DIRECT CLICKABLE CARD: Click anywhere on this card -> Directly Opens Messenger! -->
      <div class="direct-launch-card ${hasLink ? 'has-link' : ''}" onclick="openGroupDirectly(${g.id})">
        <div>
          <div class="card-top-row">
            <span class="card-level-badge ${isHardTask ? 'badge-hard' : ''}">${g.level}</span>
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <!-- Quick Admin Edit button so Shizan Vaiya can change link directly -->
              <button class="card-quick-btn" title="এই গ্রুপের লিংক এডিট করুন (Admin)" onclick="handleAdminAccess(() => openEditGroupModal(${g.id}))">
                ✏️
              </button>
              <!-- Favorite toggle button -->
              <button class="card-quick-btn ${isFav ? 'favorited' : ''}" title="${isFav ? 'বুকমার্ক সরান' : 'বুকমার্কে যোগ করুন'}" onclick="toggleFavorite(${g.id}, this)">
                ${isFav ? '★' : '☆'}
              </button>
            </div>
          </div>
          <div class="card-title">${escapeHtml(g.groupName)}</div>
        </div>

        <div class="card-messenger-bar ${hasLink ? 'active-link' : 'pending-link'}">
          ${hasLink ? '💬 মেসেঞ্জারে যান ↗' : '⚠️ লিংক দিন (Click to Add)'}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  mainContent.innerHTML = html;
}

/**
 * FAVORITES FULL VIEW
 */
function renderFavoritesView() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  const favGroups = favorites.map((id) => groups.find((g) => g.id === id)).filter(Boolean);

  let html = `
    <div class="view-nav-bar">
      <div class="breadcrumb-trail">
        <span class="breadcrumb-crumb" onclick="navigateTo('home')">Home</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-crumb active">⭐ ফেভারিট গ্রুপসমূহ</span>
      </div>
      <button class="back-btn" onclick="navigateTo('home')">← হোমে যান</button>
    </div>
  `;

  if (favGroups.length === 0) {
    html += `
      <div class="search-empty-state">
        <div class="search-empty-icon">⭐</div>
        <div class="search-empty-title">কোনো ফেভারিট গ্রুপ যোগ করা হয়নি</div>
        <div class="search-empty-hints">গ্রুপ কার্ডের ওপর স্টার (★) আইকনে ক্লিক করে দ্রুত অ্যাক্সেসের জন্য সেভ রাখুন।</div>
        <div style="margin-top: 1.25rem;">
          <button class="btn btn-primary" onclick="navigateTo('home')">গ্রুপ খুঁজুন</button>
        </div>
      </div>
    `;
  } else {
    html += `<div class="groups-grid">`;
    favGroups.forEach((g) => {
      const hasLink = Boolean(g.link && g.link.trim());
      html += `
        <div class="direct-launch-card ${hasLink ? 'has-link' : ''}" onclick="openGroupDirectly(${g.id})">
          <div>
            <div class="card-top-row">
              <span class="card-level-badge">${g.level}</span>
              <div class="card-quick-actions" onclick="event.stopPropagation()">
                <button class="card-quick-btn favorited" onclick="toggleFavorite(${g.id}, this)">
                  ★
                </button>
              </div>
            </div>
            <div class="card-title">${escapeHtml(g.groupName)}</div>
            <div style="font-size:0.8rem; font-weight:700; color:var(--accent-primary); margin-bottom:0.5rem;">
              ${g.section} → ${g.category}
            </div>
          </div>
          <div class="card-messenger-bar ${hasLink ? 'active-link' : 'pending-link'}">
            ${hasLink ? '💬 মেসেঞ্জারে যান ↗' : '⚠️ লিংক দিন'}
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  mainContent.innerHTML = html;
}

/**
 * RECENTLY OPENED FULL VIEW
 */
function renderRecentView() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  const recGroups = recentlyOpened.map((id) => groups.find((g) => g.id === id)).filter(Boolean);

  let html = `
    <div class="view-nav-bar">
      <div class="breadcrumb-trail">
        <span class="breadcrumb-crumb" onclick="navigateTo('home')">Home</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-crumb active">🕘 সম্প্রতি ওপেন করা গ্রুপ</span>
      </div>
      <button class="back-btn" onclick="navigateTo('home')">← হোমে যান</button>
    </div>
  `;

  if (recGroups.length === 0) {
    html += `
      <div class="search-empty-state">
        <div class="search-empty-icon">🕘</div>
        <div class="search-empty-title">সম্প্রতি কোনো গ্রুপ ওপেন করা হয়নি</div>
        <div class="search-empty-hints">আপনি যে গ্রুপেই ক্লিক করবেন, সেটি স্বয়ংক্রিয়ভাবে এখানে দেখা যাবে।</div>
        <div style="margin-top: 1.25rem;">
          <button class="btn btn-primary" onclick="navigateTo('home')">হোমে যান</button>
        </div>
      </div>
    `;
  } else {
    html += `
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <button class="btn btn-secondary btn-sm" onclick="clearRecentHistory()">হিস্ট্রি মুছুন</button>
      </div>
      <div class="groups-grid">
    `;
    recGroups.forEach((g) => {
      const isFav = favorites.includes(g.id);
      const hasLink = Boolean(g.link && g.link.trim());
      html += `
        <div class="direct-launch-card ${hasLink ? 'has-link' : ''}" onclick="openGroupDirectly(${g.id})">
          <div>
            <div class="card-top-row">
              <span class="card-level-badge">${g.level}</span>
              <div class="card-quick-actions" onclick="event.stopPropagation()">
                <button class="card-quick-btn ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(${g.id}, this)">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>
            <div class="card-title">${escapeHtml(g.groupName)}</div>
            <div style="font-size:0.8rem; font-weight:700; color:var(--accent-primary); margin-bottom:0.5rem;">
              ${g.section} → ${g.category}
            </div>
          </div>
          <div class="card-messenger-bar ${hasLink ? 'active-link' : 'pending-link'}">
            ${hasLink ? '💬 মেসেঞ্জারে যান ↗' : '⚠️ লিংক দিন'}
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  mainContent.innerHTML = html;
}

// ==========================================
// 10. ADMIN PANEL CONTROLLER & LINK MANAGEMENT
// Update links anytime without coding!
// ==========================================
function handleAdminAccess(callbackOnSuccess = null) {
  const isAuth = sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
  if (isAuth) {
    if (callbackOnSuccess) {
      callbackOnSuccess();
    } else {
      openAdminDashboard();
    }
  } else {
    openAdminLoginModal(callbackOnSuccess);
  }
}

function openAdminLoginModal(callbackOnSuccess = null) {
  const input = document.getElementById("adminPasswordInput");
  const errorEl = document.getElementById("adminLoginError");
  if (input) input.value = "";
  if (errorEl) errorEl.style.display = "none";

  const form = document.getElementById("adminLoginForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const entered = input.value;
    if (entered === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      closeModal("adminLoginModal");
      showToast("অ্যাডমিন প্যানেল আনলক হয়েছে 🔓", "success");
      if (callbackOnSuccess) {
        callbackOnSuccess();
      } else {
        openAdminDashboard();
      }
    } else {
      if (errorEl) {
        errorEl.textContent = "ভুল পাসওয়ার্ড! (ডিফল্ট পাসওয়ার্ড: admin123)";
        errorEl.style.display = "block";
      }
      input.focus();
    }
  };

  openModal("adminLoginModal");
  setTimeout(() => input && input.focus(), 150);
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  closeModal("adminDashboardModal");
  showToast("অ্যাডমিন প্যানেল থেকে লগআউট করা হয়েছে", "warning");
}

function openAdminDashboard() {
  renderAdminStats();
  renderAdminGroupsList();
  openModal("adminDashboardModal");
}

function renderAdminStats() {
  const total = groups.length;
  const science = groups.filter((g) => g.section === "Science").length;
  const humanities = groups.filter((g) => g.section === "Humanities").length;
  const commerce = groups.filter((g) => g.section === "Commerce").length;
  const withLink = groups.filter((g) => g.link && g.link.trim()).length;
  const withoutLink = total - withLink;

  const container = document.getElementById("adminStatsContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${total}</div>
      <div class="stat-label">মোট গ্রুপ সংখ্যা</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--success-color);">${withLink}</div>
      <div class="stat-label">🟢 মেসেঞ্জার লিংক যুক্ত</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--warning-color);">${withoutLink}</div>
      <div class="stat-label">⚪ লিংক বাকি আছে</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--accent-primary);">${science}/${humanities}/${commerce}</div>
      <div class="stat-label">Science / Humanities / Commerce</div>
    </div>
  `;
}

function renderAdminGroupsList() {
  const search = (document.getElementById("adminSearchInput")?.value || "").toLowerCase().trim();
  const sectionFilter = document.getElementById("adminSectionFilter")?.value || "All";
  const categoryFilter = document.getElementById("adminCategoryFilter")?.value || "All";
  const linkFilter = document.getElementById("adminLinkFilter")?.value || "All";

  const filtered = groups.filter((g) => {
    if (search) {
      const match =
        g.groupName.toLowerCase().includes(search) ||
        g.level.toLowerCase().includes(search) ||
        g.section.toLowerCase().includes(search) ||
        g.category.toLowerCase().includes(search) ||
        (g.link || "").toLowerCase().includes(search);
      if (!match) return false;
    }
    if (sectionFilter !== "All" && g.section !== sectionFilter) return false;
    if (categoryFilter !== "All" && g.category !== categoryFilter) return false;
    if (linkFilter === "withLink" && (!g.link || !g.link.trim())) return false;
    if (linkFilter === "withoutLink" && g.link && g.link.trim()) return false;
    return true;
  });

  const tableBody = document.getElementById("adminDesktopTableBody");
  if (tableBody) {
    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem;">কোনো গ্রুপ পাওয়া যায়নি</td></tr>`;
    } else {
      tableBody.innerHTML = filtered.map((g) => {
        const hasLink = Boolean(g.link && g.link.trim());
        return `
          <tr>
            <td><strong>#${g.id}</strong></td>
            <td>${g.section}</td>
            <td>${g.category}</td>
            <td><span class="card-level-badge" style="font-size:0.75rem; padding:0.15rem 0.45rem;">${g.level}</span></td>
            <td><strong>${escapeHtml(g.groupName)}</strong></td>
            <td>
              ${hasLink ? `<span class="badge badge-has-link" title="${escapeHtml(g.link)}">🟢 লিংক আছে</span>` : '<span class="badge badge-no-link">⚪ লিংক নেই</span>'}
            </td>
            <td>
              <span class="badge ${g.status === 'Active' ? 'badge-has-link' : 'badge-no-link'}">${g.status}</span>
            </td>
            <td>
              <div style="display:flex; gap:0.4rem;">
                <button class="btn btn-messenger btn-sm" onclick="openEditGroupModal(${g.id})">✏️ লিংক এডিট</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteGroup(${g.id})">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  const mobileContainer = document.getElementById("adminMobileCardsContainer");
  if (mobileContainer) {
    if (filtered.length === 0) {
      mobileContainer.innerHTML = `<div style="text-align:center; padding: 2rem;">কোনো গ্রুপ পাওয়া যায়নি</div>`;
    } else {
      mobileContainer.innerHTML = filtered.map((g) => {
        const hasLink = Boolean(g.link && g.link.trim());
        return `
          <div class="admin-mobile-card">
            <div class="admin-mobile-card-header">
              <span class="admin-mobile-card-title">${escapeHtml(g.groupName)}</span>
              <span class="card-level-badge" style="font-size:0.8rem;">${g.level}</span>
            </div>
            <div class="admin-mobile-card-meta">
              ${g.section} • ${g.category} • ${g.platform}
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.35rem;">
              ${hasLink ? '<span class="badge badge-has-link">🟢 লিংক যুক্ত</span>' : '<span class="badge badge-no-link">⚪ লিংক বাকি</span>'}
              <span class="badge ${g.status === 'Active' ? 'badge-has-link' : 'badge-no-link'}">${g.status}</span>
            </div>
            <div class="admin-mobile-card-actions">
              <button class="btn btn-messenger btn-sm" style="flex:1;" onclick="openEditGroupModal(${g.id})">✏️ মেসেঞ্জার লিংক সেট করুন</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteGroup(${g.id})">🗑️</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}

// ==========================================
// 11. ADD & EDIT GROUP FORMS
// Instant Central Dataset Updates
// ==========================================
function openAddGroupModal() {
  document.getElementById("groupFormTitle").textContent = "নতুন গ্রুপ যোগ করুন";
  document.getElementById("groupFormId").value = "";
  document.getElementById("formSection").value = "Science";
  document.getElementById("formCategory").value = "HSC";
  document.getElementById("formLevel").value = "L1";
  document.getElementById("formGroupName").value = "";
  document.getElementById("formPlatform").value = "Messenger";
  document.getElementById("formLink").value = "";
  document.getElementById("formAdmin").value = "Shizan Vaiya";
  document.getElementById("formBatch").value = "HSC 2025/2026";
  document.getElementById("formStatus").value = "Active";

  openModal("groupFormModal");
}

function openEditGroupModal(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  document.getElementById("groupFormTitle").textContent = `লিংক ও তথ্য পরিবর্তন: ${group.groupName}`;
  document.getElementById("groupFormId").value = group.id;
  document.getElementById("formSection").value = group.section;
  document.getElementById("formCategory").value = group.category;
  document.getElementById("formLevel").value = group.level;
  document.getElementById("formGroupName").value = group.groupName;
  document.getElementById("formPlatform").value = group.platform || "Messenger";
  document.getElementById("formLink").value = group.link || "";
  document.getElementById("formAdmin").value = group.admin || "Shizan Vaiya";
  document.getElementById("formBatch").value = group.batch || "";
  document.getElementById("formStatus").value = group.status || "Active";

  openModal("groupFormModal");
  setTimeout(() => {
    const linkInput = document.getElementById("formLink");
    if (linkInput) linkInput.focus();
  }, 150);
}

function isValidGroupUrl(url) {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function handleGroupFormSubmit(e) {
  e.preventDefault();

  const idVal = document.getElementById("groupFormId").value;
  const section = document.getElementById("formSection").value;
  const category = document.getElementById("formCategory").value;
  const level = document.getElementById("formLevel").value.trim();
  const groupName = document.getElementById("formGroupName").value.trim() || `${section} ${category} ${level}`;
  const platform = document.getElementById("formPlatform").value;
  const link = document.getElementById("formLink").value.trim();
  const admin = document.getElementById("formAdmin").value.trim();
  const batch = document.getElementById("formBatch").value.trim();
  const status = document.getElementById("formStatus").value;

  if (link && !isValidGroupUrl(link)) {
    showToast("সঠিক URL দিন (https:// বা http:// দিয়ে শুরু হতে হবে)", "error");
    document.getElementById("formLink").focus();
    return;
  }

  if (idVal) {
    const targetId = parseInt(idVal, 10);
    const index = groups.findIndex((g) => g.id === targetId);
    if (index > -1) {
      groups[index] = {
        ...groups[index],
        section,
        category,
        level,
        groupName,
        platform,
        link,
        admin,
        batch,
        status
      };
      saveGroups();
      showToast(`${groupName} এর লিংক সফলভাবে সেভ হয়েছে! 🎉`, "success");
    }
  } else {
    const nextId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
    const newGroup = {
      id: nextId,
      section,
      category,
      level,
      groupName,
      platform,
      link,
      admin,
      batch,
      status
    };
    groups.push(newGroup);
    saveGroups();
    showToast(`নতুন গ্রুপ যোগ হয়েছে #${nextId}!`, "success");
  }

  closeModal("groupFormModal");

  // Re-render UI everywhere
  renderAdminStats();
  renderAdminGroupsList();
  renderApp();
}

function confirmDeleteGroup(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  const confirmed = window.confirm(`আপনি কি নিশ্চিত যে "${group.groupName}" গ্রুপটি ডিলিট করতে চান?`);
  if (confirmed) {
    groups = groups.filter((g) => g.id !== groupId);
    favorites = favorites.filter((id) => id !== groupId);
    recentlyOpened = recentlyOpened.filter((id) => id !== groupId);
    saveGroups();
    saveFavorites();
    saveRecent();

    renderAdminStats();
    renderAdminGroupsList();
    renderApp();
    showToast(`${group.groupName} ডিলিট করা হয়েছে`, "warning");
  }
}

// ==========================================
// 12. BACKUP & RESTORE
// ==========================================
function exportDataBackup() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(groups, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `educational-group-hub-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("ব্যাকআপ ডাউনলোড হয়েছে 📤", "success");
  } catch (err) {
    console.error("Export error:", err);
    showToast("ব্যাকআপ এক্সপোর্ট করতে সমস্যা হয়েছে", "error");
  }
}

function triggerImportFilePicker() {
  const fileInput = document.getElementById("importFileInput");
  if (fileInput) fileInput.click();
}

function handleImportFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        showToast("ভুল ফাইল: JSON ব্যাকআপ ফাইল নির্বাচন করুন", "error");
        return;
      }

      const confirmed = window.confirm(`এই ব্যাকআপ থেকে ${parsed.length} টি গ্রুপ রিস্টোর হবে। বর্তমান ডেটা প্রতিস্থাপিত হবে। এগিয়ে যাবেন?`);
      if (confirmed) {
        groups = parsed;
        saveGroups();
        renderAdminStats();
        renderAdminGroupsList();
        renderApp();
        showToast(`সফলভাবে ${groups.length} টি গ্রুপ রিস্টোর হয়েছে! 📥`, "success");
      }
    } catch (err) {
      console.error("Import error:", err);
      showToast("ব্যাকআপ ফাইল রিড করতে সমস্যা হয়েছে", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetToDefaultGroups() {
  const confirmed = window.confirm(
    "⚠️ সতর্কবার্তা: এটি আপনার সমস্ত কাস্টম মেসেঞ্জার লিংক মুছে মূল ৬৯টি ডিফল্ট গ্রুপ রিস্টোর করবে। আপনি কি নিশ্চিত?"
  );

  if (confirmed) {
    groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
    saveGroups();
    renderAdminStats();
    renderAdminGroupsList();
    renderApp();
    showToast("ডিফল্ট ৬৯টি গ্রুপ রিস্টোর সম্পন্ন হয়েছে! 🔄", "success");
  }
}

// ==========================================
// 13. PWA (INSTALLATION & OFFLINE)
// ==========================================
function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").then(
        (reg) => {
          console.log("ServiceWorker active:", reg.scope);
        },
        (err) => {
          console.warn("ServiceWorker failed:", err);
        }
      );
    });
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
}

function updateOnlineStatus() {
  const banner = document.getElementById("offlineBanner");
  if (!banner) return;
  if (!navigator.onLine) {
    banner.classList.add("active");
  } else {
    banner.classList.remove("active");
  }
}

function initPWAInstall() {
  const installBtn = document.getElementById("pwaInstallBtn");
  if (!installBtn) return;

  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    installBtn.style.display = "none";
    return;
  }

  if (isIOS) {
    installBtn.style.display = "inline-flex";
    installBtn.onclick = () => openModal("iosInstallModal");
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.style.display = "inline-flex";
  });

  window.addEventListener("appinstalled", () => {
    installBtn.style.display = "none";
    deferredInstallPrompt = null;
    showToast("হোম স্ক্রিনে অ্যাপ ইনস্টল হয়েছে! 🎓", "success");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === "accepted") {
      installBtn.style.display = "none";
    }
    deferredInstallPrompt = null;
  });
}

// ==========================================
// 14. MODAL & TOAST HELPERS
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(string) {
  if (!string) return "";
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 15. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  setupSearchInput();

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const target = chip.getAttribute("data-target");

      if (target === "home") navigateTo("home");
      else if (target === "Science") navigateTo("section", "Science");
      else if (target === "Humanities") navigateTo("section", "Humanities");
      else if (target === "Commerce") navigateTo("section", "Commerce");
      else if (target === "favorites") navigateTo("favorites");
      else if (target === "recent") navigateTo("recent");
      else if (target === "HSC") applySearchTerm("HSC");
      else if (target === "Admission") applySearchTerm("Admission");
      else if (target === "Hard") applySearchTerm("Hard");
    });
  });

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const adminBtn = document.getElementById("adminPanelBtn");
  if (adminBtn) adminBtn.addEventListener("click", () => handleAdminAccess());

  const adminSearch = document.getElementById("adminSearchInput");
  if (adminSearch) adminSearch.addEventListener("input", renderAdminGroupsList);

  const adminSecFilter = document.getElementById("adminSectionFilter");
  if (adminSecFilter) adminSecFilter.addEventListener("change", renderAdminGroupsList);

  const adminCatFilter = document.getElementById("adminCategoryFilter");
  if (adminCatFilter) adminCatFilter.addEventListener("change", renderAdminGroupsList);

  const adminLnkFilter = document.getElementById("adminLinkFilter");
  if (adminLnkFilter) adminLnkFilter.addEventListener("change", renderAdminGroupsList);

  const groupForm = document.getElementById("groupEditForm");
  if (groupForm) groupForm.addEventListener("submit", handleGroupFormSubmit);

  const importInput = document.getElementById("importFileInput");
  if (importInput) importInput.addEventListener("change", handleImportFile);

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initApp);
