// Update this list with the sites you want to track.
const sites = [
  {
    id: "elysian",
    name: "Elysian Classes",
    url: "https://www.elysiantheater.com/classes"
  },
  {
    id: "outside-in",
    name: "Outside In Classes",
    url: "https://outsideintheatre.org/training/"
  },
  {
    id: "idiot",
    name: "Idiot Classes",
    url: "https://www.theidiotworkshop.com/calendar"
  },
  {
    id: "clown",
    name: "Clown School Classes",
    url: "https://www.theclownschool.com/specialtyclasseslosangeles"
  },
];

const storageKey = "siteUpdateTracker";
const cookiePrefix = "siteUpdate_";
const cookieMaxAgeSeconds = 60 * 60 * 24 * 365;
const requestTimeoutMs = 15000;
const proxyOrigin = "https://r.jina.ai/";

const statusLabels = {
  never: "Never checked",
  checking: "Checking...",
  updated: "Updated",
  unchanged: "No change",
  "first-check": "First check",
  error: "Error"
};

const tableBody = document.querySelector("#sites-table tbody");
const checkButton = document.querySelector("#check-all");
const runStatus = document.querySelector("#run-status");

const rowMap = new Map();
const hasLocalStorage = (() => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
})();

function siteKey(site) {
  if (site.id) {
    return site.id;
  }

  return site.url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function formatTimestamp(value) {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Never";
  }

  return date.toLocaleString();
}

function readRecords() {
  if (!hasLocalStorage) {
    return {};
  }

  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function writeRecords(records) {
  if (!hasLocalStorage) {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(records));
}

function readCookieRecord(id) {
  const needle = `${cookiePrefix}${id}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(needle)) {
      const rawValue = part.slice(needle.length);
      try {
        return JSON.parse(decodeURIComponent(rawValue));
      } catch (error) {
        return null;
      }
    }
  }
  return null;
}

function writeCookieRecord(id, record) {
  const encoded = encodeURIComponent(JSON.stringify(record));
  const secureFlag = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${cookiePrefix}${id}=${encoded}; max-age=${cookieMaxAgeSeconds}; path=/; samesite=lax${secureFlag}`;
}

function getRecord(id) {
  const records = readRecords();
  if (records[id]) {
    return records[id];
  }

  const cookieRecord = readCookieRecord(id);
  if (cookieRecord && hasLocalStorage) {
    records[id] = cookieRecord;
    writeRecords(records);
  }

  return cookieRecord;
}

function saveRecord(id, record) {
  const records = readRecords();
  records[id] = record;
  writeRecords(records);
  writeCookieRecord(id, record);
}

function statusClass(status) {
  return `status-pill status-${status}`;
}

function setStatus(row, status, details) {
  const statusCell = row.querySelector("[data-field='status']");
  statusCell.className = statusClass(status);
  statusCell.textContent = statusLabels[status] || status;
  if (details) {
    statusCell.title = details;
  } else {
    statusCell.removeAttribute("title");
  }
}

function updateRow(id, record) {
  const row = rowMap.get(id);
  if (!row) {
    return;
  }

  row.querySelector("[data-field='lastChecked']").textContent = formatTimestamp(record.lastChecked);
  setStatus(row, record.status, record.details);
}

function buildTable() {
  let latestCheck = null;

  sites.forEach((site) => {
    const id = siteKey(site);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="site-name">${site.name}</td>
      <td><a href="${site.url}" target="_blank" rel="noopener noreferrer">${site.url}</a></td>
      <td data-field="lastChecked">Never</td>
      <td><span data-field="status" class="${statusClass("never")}">${statusLabels.never}</span></td>
    `;

    tableBody.appendChild(row);
    rowMap.set(id, row);

    const stored = getRecord(id);
    if (stored) {
      updateRow(id, stored);
      if (stored.lastChecked) {
        if (!latestCheck || new Date(stored.lastChecked) > new Date(latestCheck)) {
          latestCheck = stored.lastChecked;
        }
      }
    }
  });

  if (latestCheck) {
    runStatus.textContent = `Last run: ${formatTimestamp(latestCheck)}`;
  }
}

async function hashText(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function buildProxyUrl(url) {
  const match = url.match(/^(https?):\/\/(.+)$/i);
  if (!match) {
    return `${proxyOrigin}http://${url}`;
  }

  const scheme = match[1].toLowerCase();
  const hostPath = match[2];
  return `${proxyOrigin}${scheme}://${hostPath}`;
}

async function fetchContent(url) {
  try {
    return await fetchText(url);
  } catch (error) {
    const proxiedUrl = buildProxyUrl(url);
    return await fetchText(proxiedUrl);
  }
}
``
async function checkSite(site) {
  const id = siteKey(site);
  const now = new Date().toISOString();
  const row = rowMap.get(id);

  if (row) {
    setStatus(row, "checking");
  }

  try {
    const content = await fetchContent(site.url);
    const nextHash = await hashText(content);
    const previous = getRecord(id);
    let status = "first-check";

    if (previous && previous.hash) {
      status = previous.hash === nextHash ? "unchanged" : "updated";
    }

    const record = {
      hash: nextHash,
      lastChecked: now,
      status
    };

    saveRecord(id, record);
    updateRow(id, record);
  } catch (error) {
    const previous = getRecord(id);
    const record = {
      hash: previous && previous.hash ? previous.hash : undefined,
      lastChecked: now,
      status: "error",
      details: "Fetch failed. The site may block cross-origin requests."
    };
    saveRecord(id, record);
    updateRow(id, record);
  }
}

async function checkAllSites() {
  checkButton.disabled = true;
  checkButton.textContent = "Checking...";

  for (const site of sites) {
    await checkSite(site);
  }

  const now = new Date().toISOString();
  runStatus.textContent = `Last run: ${formatTimestamp(now)}`;
  checkButton.textContent = "Check all sites";
  checkButton.disabled = false;
}

buildTable();

checkButton.addEventListener("click", () => {
  checkAllSites();
});
