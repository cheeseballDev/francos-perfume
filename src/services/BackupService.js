/*
  BackupService.js
  ─────────────────────────────────────────────────────────────────────────────
  PURPOSE:
    Handles all backup and restore-point operations for the Admin UI.
    The backup system is a standalone feature — it is NOT part of the main
    Employee / Inventory / Sales domain. It talks to a separate
    BackupController (or a DBA-managed cron script on the server).

  CURRENT STATE:
    All functions return mock data while the backend endpoint is being built.
    To wire up the real API, replace the mock return in each function with the
    commented-out apiFetch call directly below it.

  ENDPOINTS (planned — not yet implemented in the backend):
    GET    /api/backup/list                   → getRestorePoints()
    POST   /api/backup/create                 → createManualBackup()
    DELETE /api/backup/{id}                   → deleteRestorePoint()
    GET    /api/backup/{id}                   → getRestorePointDetails()
    POST   /api/backup/restore/{id}           → executeRollback()
    GET    /api/backup/stats                  → getDatabaseStats()
    PUT    /api/backup/settings               → saveBackupSettings()

  RESTORE POINT OBJECT SHAPE:
    {
      id:                 1,                     ← numeric PK
      displayId:          "RP-001",              ← human-readable
      label:              "Restore Point #1",
      tag:                "AUTO",                ← "AUTO" | "IMPORTANT" | "MANUAL"
      type:               "AUTO-BACKUP",         ← "AUTO-BACKUP" | "MANUAL BACKUP"
      timestamp:          "2025-10-01T00:00:00Z",
      size:               "8 MB",
      dbState: {
        items:   1245,   ← total inventory items snapshot
        records: 8435,   ← total transaction records snapshot
      },
      changes: {                                 ← changes since the previous point
        products:     { added: 0,  removed: 21, edited: 42 },
        transactions: { added: 0,  removed: 21, edited: 42 },
        accounts:     { added: 0,  removed: 21, edited: 42 },
        requests:     { added: 0,  removed: 21, edited: 42 },
        discounts:    { added: 0,  removed: 21, edited: 42 },
      },
      integrityCheck:     "PASSED",              ← "PASSED" | "FAILED"
      encryptionEnabled:  true,
    }

  MOCK DATA NOTE:
    12 restore points are generated below to fill the BackupsPage grid.
    They alternate between AUTO-BACKUP (scheduled) and MANUAL BACKUP tags.
  ─────────────────────────────────────────────────────────────────────────────
*/

// import { apiFetch } from "./api";  // ← uncomment when backend is ready

// ── Mock data ─────────────────────────────────────────────────────────────────
// Generates a deterministic restore point from a seed index.
// This keeps the mock data varied without a full database fixture.
const makeMockPoint = (i) => {
  const isManual  = i % 3 === 0;
  const isImportant = i % 5 === 0;
  const tag  = isImportant ? "IMPORTANT" : isManual ? "MANUAL" : "AUTO";
  const type = isManual ? "MANUAL BACKUP" : "AUTO-BACKUP";

  // Space points 6 hours apart, newest first
  const ts = new Date(Date.now() - i * 6 * 60 * 60 * 1000);

  return {
    id:          i + 1,
    displayId:   `RP-${String(i + 1).padStart(3, "0")}`,
    label:       `Restore Point #${i + 1}`,
    tag,
    type,
    timestamp:   ts.toISOString(),
    size:        `${8 + i * 2} MB`,
    dbState: {
      items:   1245 - i * 10,
      records: 8435 - i * 50,
    },
    changes: {
      products:     { added: 0,      removed: 21, edited: 42 },
      transactions: { added: i * 5,  removed: 0,  edited: 3  },
      accounts:     { added: 0,      removed: 0,  edited: i  },
      requests:     { added: i * 2,  removed: 1,  edited: 0  },
      discounts:    { added: 0,      removed: 0,  edited: 0  },
    },
    integrityCheck:    "PASSED",
    encryptionEnabled: true,
  };
};

// 12 restore points — covers two full rows on the BackupsPage grid
const MOCK_RESTORE_POINTS = Array.from({ length: 12 }, (_, i) => makeMockPoint(i));

// ── Database-level stats shown on the Admin Dashboard ─────────────────────────
const MOCK_DB_STATS = {
  databaseSizeGB:    2.4,
  autoBackupEnabled: true,
  backupFrequency:   "Every 24 hours",  // matches the default in Backup Settings
  totalBackups:      MOCK_RESTORE_POINTS.length,
  // How many days since the most recent MANUAL rollback was executed
  lastRollbackDays:  14,
};

// ── Service functions ──────────────────────────────────────────────────────────

/**
 * Returns statistics about the database and backup system.
 * Shown on the Admin Dashboard stat cards.
 */
export const getDatabaseStats = async () => {
  // 🔌 TODO: return apiFetch("/backup/stats");
  return MOCK_DB_STATS;
};

/**
 * Returns all restore points, newest first.
 * Used by both the Admin Dashboard (recent 3) and the full BackupsPage (all).
 */
export const getRestorePoints = async () => {
  // 🔌 TODO: return apiFetch("/backup/list");
  return MOCK_RESTORE_POINTS;
};

/**
 * Returns a single restore point by its numeric id.
 * Used by the Restore Point Details view.
 *
 * @param {number} id
 */
export const getRestorePointById = async (id) => {
  // 🔌 TODO: return apiFetch(`/backup/${id}`);
  return MOCK_RESTORE_POINTS.find((p) => p.id === id) ?? null;
};

/**
 * Triggers creation of a new manual backup snapshot.
 * The server generates a new restore point immediately.
 */
export const createManualBackup = async () => {
  // 🔌 TODO: return apiFetch("/backup/create", { method: "POST" });

  // Mock: return a new point with id = max + 1
  const newId = MOCK_RESTORE_POINTS.length + 1;
  const newPoint = makeMockPoint(newId - 1);
  newPoint.id          = newId;
  newPoint.displayId   = `RP-${String(newId).padStart(3, "0")}`;
  newPoint.label       = `Restore Point #${newId}`;
  newPoint.tag         = "MANUAL";
  newPoint.type        = "MANUAL BACKUP";
  newPoint.timestamp   = new Date().toISOString();
  MOCK_RESTORE_POINTS.unshift(newPoint);
  return { message: "Manual backup created successfully.", point: newPoint };
};

/**
 * Permanently deletes a restore point.
 * This CANNOT be undone — the point and its snapshot data are removed.
 *
 * @param {number} id
 */
export const deleteRestorePoint = async (id) => {
  // 🔌 TODO: return apiFetch(`/backup/${id}`, { method: "DELETE" });

  const idx = MOCK_RESTORE_POINTS.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Restore point not found.");
  MOCK_RESTORE_POINTS.splice(idx, 1);
  return { message: "Restore point deleted." };
};

/**
 * Executes a rollback to the given restore point.
 *
 * This is the most dangerous operation in the system. The server should:
 *   1. Pre-backup the current state
 *   2. Verify integrity of the target point
 *   3. Apply the rollback (optionally to selected tables only)
 *   4. Write an audit log entry
 *   5. Terminate all active sessions
 *
 * @param {number}   id          — restore point to roll back to
 * @param {string[]} tables      — ["products","transactions",...] or null for full rollback
 * @param {string}   adminPass   — admin password for authentication
 * @param {string}   reason      — required reason text (saved to audit log)
 */
export const executeRollback = async (id, tables, adminPass, reason) => {
  // 🔌 TODO: return apiFetch(`/backup/restore/${id}`, {
  //   method: "POST",
  //   body: JSON.stringify({ tables, adminPassword: adminPass, reason }),
  // });

  // Mock: simulate a 2-second "restore" then return success
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: "Rollback completed successfully." };
};

/**
 * Saves the automatic backup schedule settings.
 *
 * @param {{ enabled: boolean, frequencyHours: number }} settings
 */
export const saveBackupSettings = async (settings) => {
  // 🔌 TODO: return apiFetch("/backup/settings", {
  //   method: "PUT",
  //   body: JSON.stringify(settings),
  // });
  return { message: "Backup settings saved." };
};
