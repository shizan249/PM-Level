/**
 * Educational Group Hub - Streamlined Minimal Application
 * Features:
 * - Simple & minimal: Zero subject clutter, direct group access on home screen
 * - Big, fat, easy-to-tap cards with dynamic circulating light
 * - Instant one-tap launch to Messenger
 * - Exact level matching (L1 != L10, Hard Task matching)
 * - Ultra-fast maintenance: Admin can update group links in seconds
 */

// ==========================================
// 1. CONSTANTS & CONFIGURATION
// ==========================================
const STORAGE_KEY = "educationalGroupHubData_v4";
const FAVORITES_KEY = "educationalGroupHubFavorites";
const RECENT_KEY = "educationalGroupHubRecent";
const THEME_KEY = "educationalGroupHubTheme";
const ADMIN_AUTH_KEY = "educationalGroupHubAdminAuth";

// Default admin password
const ADMIN_PASSWORD = "admin123";

// ==========================================
// 2. 69 CORE EDUCATIONAL GROUPS DATASET
// Exactly 3 Sections: Science, Humanities, Commerce
// Exactly 23 Groups each (10 HSC + 13 Admission) = 69 Groups
// ==========================================
function generateInitialGroups() {
  const sections = ["Science", "Humanities", "Commerce"];
  const list = [];
  let idCounter = 1;

  sections.forEach((section) => {
    // 10 HSC groups: L1 to L10
    for (let i = 1; i <= 10; i++) {
      list.push({
        id: idCounter++,
        section: section,
        category: "HSC",
        level: `L${i}`,
        groupName: `${section} HSC L${i}`,
        platform: "Messenger",
        link: "",
        admin: "Shizan Vaiya",
        batch: "HSC 2025/2026",
        status: "Active"
      });
    }

    // 13 Admission groups: L1 to L10 + Hard Task 1..3
    for (let i = 1; i <= 10; i++) {
      list.push({
        id: idCounter++,
        section: section,
        category: "Admission",
        level: `L${i}`,
        groupName: `${section} Admission L${i}`,
        platform: "Messenger",
        link: "",
        admin: "Shizan Vaiya",
        batch: "Admission 2025",
        status: "Active"
      });
    }

    for (let h = 1; h <= 3; h++) {
      list.push({
        id: idCounter++,
        section: section,
        category: "Admission",
        level: `Hard Task ${h}`,
        groupName: `${section} Admission Hard Task ${h}`,
        platform: "Messenger",
        link: "",
        admin: "Shizan Vaiya",
        batch: "Admission 2025",
        status: "Active"
      });
    }
  });

  return list;
}

const DEFAULT_GROUPS = generateInitialGroups();

// ==========================================
// 3. APPLICATION STATE
// ==========================================
let groups = [];
let favorites = [];
let recentlyOpened = [];
let currentCategoryFilter = "all"; // 'all' | 'Science' | 'Humanities' | 'Commerce' | 'HSC' | 'Admission' | 'Hard' | 'favorites' | 'recent'
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
  renderCards();
  setupEventListeners();
  updateQuickChipCounts();
}

function loadGroups() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that all 69 groups are loaded with valid section field
      if (Array.isArray(parsed) && parsed.length === 69 && parsed[0].section) {
        groups = parsed;
        return;
      }
    }
  } catch (err) {
    console.error("Error reading localStorage groups:", err);
  }
  // Load full 69 groups dataset
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
// 5. THEME (DARK / LIGHT)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon();
  showToast(newTheme === "dark" ? "Dark mode 🌙" : "Light mode ☀️", "success");
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀️" : "🌙";
  btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
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
      // Exact Level token (l1, l2, ..., l10)
      const levelMatch = token.match(/^l([1-9]|10)$/i);
      if (levelMatch) {
        return g.level.toLowerCase() === token;
      }

      // Hard Task token
      if (token === "hard") {
        return g.level.toLowerCase().includes("hard");
      }
      if (token === "task") {
        return g.level.toLowerCase().includes("task");
      }

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
        <div class="search-empty-title">No matching groups</div>
        <div class="search-empty-hints">Try searching for:</div>
        <div class="search-chip-group">
          <button class="search-hint-chip" onclick="applySearchTerm('L5')">L5</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Science L5')">Science L5</button>
          <button class="search-hint-chip" onclick="applySearchTerm('HSC L1')">HSC L1</button>
          <button class="search-hint-chip" onclick="applySearchTerm('Hard Task')">Hard Task</button>
        </div>
      </div>
    `;
    return;
  }

  let html = `
    <div class="search-results-header">
      <span>Results (${results.length})</span>
      <span>⚡ Tap to launch directly</span>
    </div>
    <div class="search-thin-cards-container">
  `;

  // Display ONLY "Section → Category → Level" (e.g., Science → HSC → L5) in a sleek thin card
  results.forEach((g) => {
    html += `
      <div class="search-thin-card" onclick="handleSearchResultClick(${g.id})">
        <div class="search-thin-card-content">
          <span class="crumb-section">${escapeHtml(g.section)}</span>
          <span class="crumb-arrow">→</span>
          <span class="crumb-category">${escapeHtml(g.category)}</span>
          <span class="crumb-arrow">→</span>
          <span class="crumb-level">${escapeHtml(g.level)}</span>
        </div>
        <div class="search-thin-card-action">
          <span class="search-thin-arrow">↗</span>
        </div>
      </div>
    `;
  });

  html += `</div>`;
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
// 7. DIRECT GROUP OPENING (ONE-TAP LAUNCH)
// ==========================================
function openGroupDirectly(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  addRecent(group.id);

  if (group.link && group.link.trim()) {
    showToast(`Launching ${group.groupName}... 🚀`, "success");
    window.open(group.link.trim(), "_blank", "noopener,noreferrer");
  } else {
    showNoLinkPrompt(group);
  }
}

function showNoLinkPrompt(group) {
  const modal = document.getElementById("noLinkPromptModal");
  if (!modal) {
    showToast(`⚠️ Link not configured yet for ${group.groupName}.`, "info");
    return;
  }

  document.getElementById("noLinkGroupName").textContent = group.groupName;
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
    showToast("Removed from favorites", "warning");
  } else {
    favorites.push(groupId);
    isFav = true;
    showToast("Saved to favorites ⭐", "success");
  }
  saveFavorites();
  updateQuickChipCounts();

  if (buttonEl) {
    buttonEl.classList.toggle("favorited", isFav);
    buttonEl.textContent = isFav ? "★" : "☆";
  }

  if (currentCategoryFilter === "favorites") {
    renderCards();
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
}

function updateQuickChipCounts() {
  const favCount = document.getElementById("favChipCount");
  if (favCount) favCount.textContent = favorites.length;

  const recCount = document.getElementById("recentChipCount");
  if (recCount) recCount.textContent = recentlyOpened.length;
}

// ==========================================
// 9. MINIMAL INSTANT CARD RENDERING
// Direct on the Home Screen! Zero Clutter!
// ==========================================
function filterByCategory(category) {
  currentCategoryFilter = category;
  document.querySelectorAll(".filter-chip").forEach((c) => {
    c.classList.toggle("active", c.getAttribute("data-target") === category);
  });
  renderCards();
}

function renderCards() {
  const mainContent = document.getElementById("mainContentArea");
  if (!mainContent) return;

  let displayGroups = [];

  if (currentCategoryFilter === "all") {
    displayGroups = groups;
  } else if (currentCategoryFilter === "Science") {
    displayGroups = groups.filter((g) => g.section === "Science");
  } else if (currentCategoryFilter === "Humanities") {
    displayGroups = groups.filter((g) => g.section === "Humanities");
  } else if (currentCategoryFilter === "Commerce") {
    displayGroups = groups.filter((g) => g.section === "Commerce");
  } else if (currentCategoryFilter === "HSC") {
    displayGroups = groups.filter((g) => g.category === "HSC");
  } else if (currentCategoryFilter === "Admission") {
    displayGroups = groups.filter((g) => g.category === "Admission");
  } else if (currentCategoryFilter === "Hard") {
    displayGroups = groups.filter((g) => g.level.toLowerCase().includes("hard"));
  } else if (currentCategoryFilter === "favorites") {
    displayGroups = favorites.map((id) => groups.find((g) => g.id === id)).filter(Boolean);
  } else if (currentCategoryFilter === "recent") {
    displayGroups = recentlyOpened.map((id) => groups.find((g) => g.id === id)).filter(Boolean);
  }

  let html = `
    <!-- Direct Action Notice Bar -->
    <div class="quick-instruction-bar">
      <span class="instruction-text">⚡ Click any card below to launch Messenger directly</span>
    </div>
  `;

  if (displayGroups.length === 0) {
    html += `
      <div class="search-empty-state">
        <div class="search-empty-icon">📁</div>
        <div class="search-empty-title">No groups in this view</div>
        <div class="search-empty-hints">Select another category or explore all groups.</div>
        <div style="margin-top: 1rem;">
          <button class="btn btn-primary btn-sm" onclick="filterByCategory('all')">Show All Groups</button>
        </div>
      </div>
    `;
    mainContent.innerHTML = html;
    return;
  }

  html += `<div class="groups-grid">`;

  displayGroups.forEach((g) => {
    const isFav = favorites.includes(g.id);
    const hasLink = Boolean(g.link && g.link.trim());
    const isHardTask = g.level.toLowerCase().includes("hard");

    html += `
      <!-- FAT, EASY-TO-CLICK CARD WITH DYNAMIC CIRCULATING LIGHT -->
      <div class="direct-launch-card ${isHardTask ? 'card-hard-task' : ''} ${hasLink ? 'has-link' : ''}" onclick="openGroupDirectly(${g.id})">
        <div>
          <div class="card-top-row">
            <span class="card-level-badge ${isHardTask ? 'badge-hard' : ''}">${g.level}</span>
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <!-- Favorite toggle -->
              <button class="card-quick-btn ${isFav ? 'favorited' : ''}" title="${isFav ? 'Remove Favorite' : 'Save Favorite'}" onclick="toggleFavorite(${g.id}, this)">
                ${isFav ? '★' : '☆'}
              </button>
            </div>
          </div>
          <div class="card-section-tag">${escapeHtml(g.section)} • ${escapeHtml(g.category)}</div>
          <div class="card-title">${escapeHtml(g.groupName)}</div>
        </div>

        <div class="card-messenger-bar ${hasLink ? 'active-link' : 'pending-link'}">
          ${hasLink ? '💬 Open Messenger ↗' : '💬 Link Coming Soon'}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  mainContent.innerHTML = html;
}

// ==========================================
// 10. ADMIN PANEL CONTROLLER & LINK MANAGEMENT
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
      showToast("Admin session unlocked 🔓", "success");
      if (callbackOnSuccess) {
        callbackOnSuccess();
      } else {
        openAdminDashboard();
      }
    } else {
      if (errorEl) {
        errorEl.textContent = "Invalid password! (Default password: admin123)";
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
  showToast("Logged out of Admin Panel", "warning");
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
      <div class="stat-label">Total Groups</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--success-color);">${withLink}</div>
      <div class="stat-label">🟢 Links Configured</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--warning-color);">${withoutLink}</div>
      <div class="stat-label">⚪ Links Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: var(--accent-primary);">${science} / ${humanities} / ${commerce}</div>
      <div class="stat-label">Science / Hum / Com</div>
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
        (g.section || "").toLowerCase().includes(search) ||
        g.groupName.toLowerCase().includes(search) ||
        g.level.toLowerCase().includes(search) ||
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
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem;">No groups match your filters</td></tr>`;
    } else {
      tableBody.innerHTML = filtered.map((g) => {
        const hasLink = Boolean(g.link && g.link.trim());
        return `
          <tr>
            <td><strong>#${g.id}</strong></td>
            <td><span class="badge badge-messenger">${escapeHtml(g.section)}</span></td>
            <td><span class="badge ${g.category === 'HSC' ? 'badge-messenger' : 'badge-has-link'}">${g.category}</span></td>
            <td><span class="card-level-badge" style="font-size:0.75rem; padding:0.15rem 0.45rem;">${g.level}</span></td>
            <td><strong>${escapeHtml(g.groupName)}</strong></td>
            <td>
              ${hasLink ? `<span class="badge badge-has-link" title="${escapeHtml(g.link)}">🟢 Configured</span>` : '<span class="badge badge-no-link">⚪ Pending</span>'}
            </td>
            <td>
              <span class="badge ${g.status === 'Active' ? 'badge-has-link' : 'badge-no-link'}">${g.status}</span>
            </td>
            <td>
              <div style="display:flex; gap:0.4rem;">
                <button class="btn btn-messenger btn-sm" onclick="openEditGroupModal(${g.id})">✏️ Edit</button>
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
      mobileContainer.innerHTML = `<div style="text-align:center; padding: 2rem;">No groups match your filters</div>`;
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
              ${hasLink ? '<span class="badge badge-has-link">🟢 Link Ready</span>' : '<span class="badge badge-no-link">⚪ Link Pending</span>'}
              <span class="badge ${g.status === 'Active' ? 'badge-has-link' : 'badge-no-link'}">${g.status}</span>
            </div>
            <div class="admin-mobile-card-actions">
              <button class="btn btn-messenger btn-sm" style="flex:1;" onclick="openEditGroupModal(${g.id})">✏️ Configure Link</button>
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
// ==========================================
function openAddGroupModal() {
  document.getElementById("groupFormTitle").textContent = "Add New Group";
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

  document.getElementById("groupFormTitle").textContent = `Configure URL: ${group.groupName}`;
  document.getElementById("groupFormId").value = group.id;
  document.getElementById("formSection").value = group.section || "Science";
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
    showToast("Please enter a valid URL starting with https:// or http://", "error");
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
      showToast(`Updated ${groupName} link successfully! 🎉`, "success");
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
    showToast(`Added new group #${nextId}!`, "success");
  }

  closeModal("groupFormModal");

  renderAdminStats();
  renderAdminGroupsList();
  renderCards();
}

function confirmDeleteGroup(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  const confirmed = window.confirm(`Are you sure you want to delete "${group.groupName}"?`);
  if (confirmed) {
    groups = groups.filter((g) => g.id !== groupId);
    favorites = favorites.filter((id) => id !== groupId);
    recentlyOpened = recentlyOpened.filter((id) => id !== groupId);
    saveGroups();
    saveFavorites();
    saveRecent();

    renderAdminStats();
    renderAdminGroupsList();
    renderCards();
    showToast(`Deleted ${group.groupName}`, "warning");
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
    showToast("Backup exported successfully 📤", "success");
  } catch (err) {
    console.error("Export error:", err);
    showToast("Failed to export backup", "error");
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
        showToast("Invalid backup file: expected a JSON array", "error");
        return;
      }

      const confirmed = window.confirm(`Importing this backup will replace current group data (${parsed.length} groups loaded). Continue?`);
      if (confirmed) {
        groups = parsed;
        saveGroups();
        renderAdminStats();
        renderAdminGroupsList();
        renderCards();
        showToast(`Successfully restored ${groups.length} groups! 📥`, "success");
      }
    } catch (err) {
      console.error("Import error:", err);
      showToast("Error reading backup JSON file", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetToDefaultGroups() {
  const confirmed = window.confirm(
    "⚠️ WARNING: This will replace all customized group URLs with the original default 69-group dataset. Are you sure you want to proceed?"
  );

  if (confirmed) {
    groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS));
    saveGroups();
    renderAdminStats();
    renderAdminGroupsList();
    renderCards();
    showToast("Reset to default 69 groups completed! 🔄", "success");
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
    showToast("Installed to home screen! 🎓", "success");
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
      const target = chip.getAttribute("data-target");
      filterByCategory(target);
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

  const pasteBtn = document.getElementById("pasteLinkBtn");
  if (pasteBtn) {
    pasteBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            document.getElementById("formLink").value = text.trim();
            showToast("Link pasted from clipboard! 📋", "success");
            return;
          }
        }
      } catch (e) {
        console.warn("Clipboard access denied or unsupported", e);
      }
      document.getElementById("formLink").focus();
      showToast("Paste URL into the box (Ctrl+V / Long press)", "info");
    });
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initApp);
