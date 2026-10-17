/* Optional Google Drive backup. IndexedDB remains the source of truth. */
(() => {
  'use strict';

  const SCOPE = 'https://www.googleapis.com/auth/drive.file';
  const API = 'https://www.googleapis.com/drive/v3/files';
  const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
  const FILE_NAME = 'jotboard-backup.json';
  const FOLDER_NAME = 'Jotboard';
  const AUTO_BACKUP_DELAY = 15000;
  const PAIR_KEY = 'jotboard_drive_last_backup_v1';
  const WELCOME_DISMISS_KEY = 'jotboard_drive_welcome_dismissed_v1';
  const ACCOUNT_KEY = 'jotboard_drive_account_history_v1';

  let callbacks;
  let accessToken = '';
  let tokenExpiresAt = 0;
  let remoteFile = null;
  let remoteSnapshot = null;
  let authorized = false;
  let ready = false;
  let busy = false;
  let pending = false;
  let idleTimer = null;
  let revisions = 0;
  let status = 'disconnected';
  let statusText = 'Not connected';
  let hasLocalNotes = true; // Hide restore nudges until storage is checked.
  let accountEmail = '';
  let accountHistory = readAccountHistory();

  const element = id => document.getElementById(id);
  const configured = () => {
    const id = window.JOTBOARD_GOOGLE_CLIENT_ID;
    return typeof id === 'string' && /\.apps\.googleusercontent\.com$/.test(id) && !id.includes('YOUR_');
  };

  // Remember only the Drive file/version, never Google access tokens.
  function lastConnectedBackup() {
    try { return JSON.parse(localStorage.getItem(PAIR_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function rememberBackup() {
    if (!remoteFile?.id || !remoteFile.version) return;
    try {
      localStorage.setItem(PAIR_KEY, JSON.stringify({
        id: remoteFile.id, version: String(remoteFile.version)
      }));
    } catch (_) { /* Browser storage may be restricted. */ }
  }

  // Store only display history in this browser, never OAuth tokens.
  function readAccountHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || 'null');
      return history && typeof history.email === 'string' ? history : null;
    } catch (_) { return null; }
  }

  function saveAccountHistory(changes) {
    if (!accountEmail) return;
    accountHistory = { ...accountHistory, ...changes, email: accountEmail };
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountHistory)); }
    catch (_) { /* History is optional; note storage is unaffected. */ }
    renderAccountHistory();
  }

  function displayTime(timestamp) {
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) return '';
    const day = date.toDateString() === new Date().toDateString()
      ? 'Today'
      : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${day}, ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
  }

  function renderAccountHistory() {
    const badge = element('driveStatus');
    if (!badge) return;
    let panel = element('driveAccountDetails');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'driveAccountDetails';
      panel.className = 'drive-account-details';
      badge.insertAdjacentElement('afterend', panel);
    }

    const connected = authorized && accountEmail && Date.now() < tokenExpiresAt - 10000;
    const email = connected ? accountEmail : !authorized || status === 'expired' ? accountHistory?.email : '';
    if (!email) { panel.hidden = true; return; }

    panel.hidden = false;
    panel.replaceChildren();
    const account = document.createElement('div');
    account.className = 'drive-account-line';
    const label = document.createElement('span');
    label.textContent = connected ? 'Connected account' : 'Last used account';
    const address = document.createElement('strong');
    address.textContent = email;
    account.append(label, address);
    panel.append(account);

    for (const [key, title] of [['lastRestoredAt', 'Last restored'], ['lastBackupAt', 'Last Drive backup']]) {
      const stamp = accountHistory?.[key];
      if (!stamp) continue;
      const row = document.createElement('div');
      row.className = 'drive-history-line';
      row.textContent = `${title}: ${displayTime(stamp)}`;
      panel.append(row);
    }
  }

  async function loadGoogleAccount() {
    accountEmail = '';
    renderAccountHistory();
    try {
      const about = await apiRequest('https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,permissionId)');
      const email = String(about.user?.emailAddress || '').trim();
      if (!email) return; // Backups work even if Drive omits the email.
      const permissionId = String(about.user?.permissionId || '');
      const sameAccount = accountHistory && (
        permissionId && accountHistory.permissionId
          ? accountHistory.permissionId === permissionId
          : accountHistory.email.toLowerCase() === email.toLowerCase()
      );
      accountEmail = email;
      if (!sameAccount) accountHistory = null; // Never attribute another account's history to this one.
      saveAccountHistory({ permissionId });
    } catch (error) {
      console.warn('Could not read Google Drive account email', error);
    }
  }

  function recordDriveBackup() {
    if (accountEmail) saveAccountHistory({
      lastBackupAt: Date.parse(remoteFile?.modifiedTime || '') || Date.now()
    });
  }

  function showStatus(nextStatus, message) {
    status = nextStatus;
    statusText = message;
    const badge = element('driveStatus');
    if (badge) {
      badge.dataset.state = nextStatus;
      badge.textContent = message;
    }
    renderAccountHistory();
    const active = authorized;
    for (const id of ['driveBackupNow', 'driveRestoreNow', 'driveDisconnect']) {
      if (element(id)) element(id).hidden = !active;
    }
    if (element('driveConnect')) {
      element('driveConnect').textContent = active ? 'Change account'
        : accountHistory?.email ? 'Reconnect Google Drive' : 'Connect Google Drive';
      element('driveConnect').disabled = busy || ['connecting', 'checking', 'restoring'].includes(nextStatus);
    }
    if (element('driveBackupNow')) element('driveBackupNow').disabled = !ready || busy;
    if (element('driveRestoreNow')) element('driveRestoreNow').disabled = !remoteFile || busy;
    if (element('driveConflictOpen')) element('driveConflictOpen').hidden = nextStatus !== 'conflict';
    if (element('driveEmptyConnect')) element('driveEmptyConnect').textContent = configured() ? 'Restore from Google Drive' : 'Set up Google Drive';
    if (element('driveEmptyConnect')) element('driveEmptyConnect').hidden = hasLocalNotes || !!remoteFile || ready;
    const driveLink = element('driveOpenFile');
    if (driveLink) {
      const url = authorized && remoteFile?.id
        ? remoteFile.webViewLink || `https://drive.google.com/file/d/${encodeURIComponent(remoteFile.id)}/view`
        : null;
      driveLink.hidden = !url;
      if (url) driveLink.href = url;
      else driveLink.removeAttribute('href');
    }
  }

  function clearTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = null;
  }

  function pauseForReconnection() {
    accessToken = '';
    tokenExpiresAt = 0;
    ready = false;
    clearTimer();
    showStatus('expired', 'Reconnect to continue backups');
  }

  async function apiRequest(url, { method = 'GET', headers = {}, body, format = 'json' } = {}) {
    if (!accessToken || Date.now() >= tokenExpiresAt - 10000) {
      pauseForReconnection();
      throw new Error('Google authorization expired. Please reconnect.');
    }
    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${accessToken}`, ...headers },
      body,
      cache: 'no-store'
    });
    if (response.status === 401) pauseForReconnection();
    if (!response.ok) {
      let reason = `Google Drive error (${response.status})`;
      try {
        const detail = await response.json();
        reason = detail?.error?.message || reason;
      } catch (_) { /* Some Google failures have no JSON body. */ }
      const error = new Error(reason);
      error.httpStatus = response.status;
      throw error;
    }
    return format === 'text' ? response.text() : response.json();
  }

  function filesQuery(query, fields = 'nextPageToken,files(id,name,mimeType,parents,version,modifiedTime,appProperties,webViewLink)') {
    const params = new URLSearchParams({ q: query, fields, pageSize: '100' });
    return `${API}?${params}`;
  }

  async function listFiles(query) {
    const results = [];
    let url = filesQuery(query);
    while (url) {
      const batch = await apiRequest(url);
      results.push(...(batch.files || []));
      if (!batch.nextPageToken) break;
      const next = new URL(url);
      next.searchParams.set('pageToken', batch.nextPageToken);
      url = next.toString();
    }
    return results;
  }

  async function findBackupFile() {
    const matching = await listFiles("trashed = false and appProperties has { key='jotboardKind' and value='backup' }");
    const backups = matching.filter(file => file.name === FILE_NAME && file.mimeType === 'application/json');
    backups.sort((a, b) => new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0));
    return backups[0] || null;
  }

  async function findOrCreateFolder() {
    const query = "trashed = false and mimeType = 'application/vnd.google-apps.folder' and name = 'Jotboard'";
    const folders = await listFiles(query);
    if (folders.length) return folders[0].id;
    const folder = await apiRequest(`${API}?fields=id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' })
    });
    return folder.id;
  }

  async function currentFileVersion() {
    if (!remoteFile) return null;
    return apiRequest(`${API}/${encodeURIComponent(remoteFile.id)}?fields=id,name,version,modifiedTime,mimeType,webViewLink`);
  }

  async function fetchRemoteSnapshot() {
    if (!remoteFile) return null;
    const raw = await apiRequest(`${API}/${encodeURIComponent(remoteFile.id)}?alt=media`, { format: 'text' });
    if (raw.length > 50_000_000) throw new Error('Drive backup is too large to open in this browser.');
    let backup;
    try { backup = JSON.parse(raw); }
    catch (_) { throw new Error('The Drive backup is not valid JSON.'); }
    if (!backup || backup.format !== 'jotboard-backup' || !Array.isArray(backup.notes) || backup.notes.length > 10000) {
      throw new Error('This is not a supported Jotboard backup.');
    }
    return backup;
  }

  function comparable(snapshot) {
    // A different theme or backup timestamp must not trigger a note conflict.
    const notes = (snapshot.notes || [])
      .map(({ updatedAt, ...note }) => note)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
    return JSON.stringify(notes);
  }

  function dataMatches(first, second) {
    return comparable(first) === comparable(second);
  }

  // Drive multipart uploads are limited to 5 MB. Larger backups use a
  // resumable upload session so note background images aren't silently lost.
  async function uploadResumable(metadata, media, fileId = null) {
    const size = new Blob([media]).size;
    const url = fileId
      ? `${UPLOAD_API}/${encodeURIComponent(fileId)}?uploadType=resumable&fields=id,name,version,modifiedTime,mimeType,webViewLink`
      : `${UPLOAD_API}?uploadType=resumable&fields=id,name,version,modifiedTime,mimeType,webViewLink`;
    if (!accessToken || Date.now() >= tokenExpiresAt - 10000) {
      pauseForReconnection();
      throw new Error('Please reconnect Google Drive.');
    }
    const initial = await fetch(url, {
      method: fileId ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'application/json',
        'X-Upload-Content-Length': String(size)
      },
      body: JSON.stringify(metadata),
      cache: 'no-store'
    });
    if (initial.status === 401) pauseForReconnection();
    if (!initial.ok) throw new Error(`Google Drive could not start the upload (${initial.status}).`);
    const session = initial.headers.get('Location');
    if (!session || !session.startsWith('https://www.googleapis.com/')) {
      throw new Error('Google Drive did not provide a valid upload session.');
    }
    return apiRequest(session, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: new Blob([media], { type: 'application/json' })
    });
  }

  async function uploadNew(snapshot) {
    const folderId = await findOrCreateFolder();
    const boundary = 'jotboard_' + Math.random().toString(36).slice(2);
    const metadata = JSON.stringify({
      name: FILE_NAME,
      mimeType: 'application/json',
      parents: [folderId],
      appProperties: { jotboardKind: 'backup' },
      description: 'Jotboard note backup. Created with user permission.'
    });
    const media = JSON.stringify(snapshot);
    if (new Blob([media]).size > 4_750_000) return uploadResumable(JSON.parse(metadata), media);
    const multipart = new Blob([
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${media}\r\n`,
      `--${boundary}--\r\n`
    ]);
    return apiRequest(`${UPLOAD_API}?uploadType=multipart&fields=id,name,version,modifiedTime,mimeType,webViewLink`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body: multipart
    });
  }

  async function uploadExisting(snapshot) {
    const current = await currentFileVersion();
    if (remoteFile.version && current?.version && String(current.version) !== String(remoteFile.version)) {
      remoteFile = current;
      const latest = await fetchRemoteSnapshot();

      // Metadata-only updates or an already-uploaded copy need no intervention.
      if (dataMatches(latest, snapshot)) {
        remoteSnapshot = latest;
        return true;
      }
      if (!remoteSnapshot || !dataMatches(latest, remoteSnapshot)) {
        ready = false;
        clearTimer();
        showStatus('conflict', 'Drive has newer notes — backup paused. Review in Settings.');
        // Do not interrupt the editor with a modal during background backups.
        return false;
      }
      remoteSnapshot = latest;
    }
    const media = JSON.stringify(snapshot);
    if (new Blob([media]).size > 4_750_000) {
      remoteFile = await uploadResumable({}, media, remoteFile.id);
      return true;
    }
    remoteFile = await apiRequest(`${UPLOAD_API}/${encodeURIComponent(remoteFile.id)}?uploadType=media&fields=id,name,version,modifiedTime,mimeType,webViewLink`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: media
    });
    return true;
  }

  function showConflict() {
    if (element('driveConflictOverlay')) element('driveConflictOverlay').hidden = false;
  }

  function hideConflict() {
    if (element('driveConflictOverlay')) element('driveConflictOverlay').hidden = true;
  }

  async function recoverFromDrive({ automatic = false } = {}) {
    if (!remoteFile) return false;
    if (!automatic) {
      const message = 'Replace the notes in this browser with the Google Drive backup? Export a JSON backup first if you need these local notes.';
      if (!confirm(message)) return false;
    }
    showStatus('restoring', 'Restoring from Google Drive...');
    const backup = await fetchRemoteSnapshot();
    await callbacks.restoreSnapshot(backup);
    hasLocalNotes = !!backup.notes.length;
    remoteSnapshot = backup;
    rememberBackup();
    recordDriveBackup();
    saveAccountHistory({ lastRestoredAt: Date.now() });
    ready = true;
    pending = false;
    hideConflict();
    showStatus('ready', `Restored ${backup.notes.length} notes • Drive connected`);
    return true;
  }

  async function resolveConflict(choice) {
    if (!authorized || !remoteFile) return;
    const wasConflict = status === 'conflict';
    hideConflict();
    if (choice === 'cancel') {
      ready = false;
      showStatus('paused', 'Backup paused — choose a copy');
      return;
    }
    try {
      if (choice === 'drive') {
        // The conflict dialog choice is already the user's confirmation.
        await recoverFromDrive({ automatic: wasConflict });
      } else if (choice === 'local') {
        remoteFile = await currentFileVersion();
        ready = true;
        await syncNow({ force: true });
      }
    } catch (error) {
      console.error(error);
      ready = false;
      showStatus('error', error.message);
    }
  }

  async function onConnected() {
    showStatus('checking', 'Checking Google Drive...');
    await loadGoogleAccount();
    remoteFile = await findBackupFile();
    remoteSnapshot = null;
    const local = await callbacks.getSnapshot();
    hasLocalNotes = !!local.notes.length;

    if (!remoteFile) {
      ready = true;
      showStatus('ready', 'Connected • no backup yet');
      if (local.notes.length) await syncNow();
      return;
    }

    const remote = await fetchRemoteSnapshot();
    remoteSnapshot = remote;
    if (!local.notes.length) {
      await recoverFromDrive({ automatic: true });
      return;
    }
    if (dataMatches(local, remote)) {
      rememberBackup();
      recordDriveBackup();
      ready = true;
      showStatus('ready', 'Up to date on Google Drive');
      return;
    }

    // This browser already chose this same file. If Drive hasn't changed,
    // keep backing up pending local edits without asking again.
    const previous = lastConnectedBackup();
    if (previous?.id === remoteFile.id && previous.version === String(remoteFile.version)) {
      ready = true;
      showStatus('ready', 'Connected • backing up local changes');
      await syncNow();
      return;
    }

    ready = false;
    showStatus('conflict', 'Local and Drive notes differ — review in Settings');
    // Only a first-time connection needs the initial choice dialog.
    if (previous?.id !== remoteFile.id) showConflict();
  }

  // Ask only on an empty browser. Never interrupt editing or hide existing notes.
  function dismissWelcome() {
    const dialog = element('driveWelcomeOverlay');
    if (dialog) dialog.hidden = true;
    try { localStorage.setItem(WELCOME_DISMISS_KEY, '1'); } catch (_) { /* Optional. */ }
  }

  async function offerRecovery() {
    if (!callbacks?.getSnapshot) return;
    try {
      const local = await callbacks.getSnapshot();
      hasLocalNotes = !!local.notes.length; // Includes archived and trashed notes.
      showStatus(status, statusText);
      if (hasLocalNotes || !configured() || authorized) return;
      if (localStorage.getItem(WELCOME_DISMISS_KEY)) return;
      if (!element('editorOverlay')?.hidden || !element('settingsOverlay')?.hidden) return;
      const dialog = element('driveWelcomeOverlay');
      if (!dialog) return;
      dialog.hidden = false;
      element('driveWelcomeConnect')?.focus();
    } catch (error) { console.warn('Could not check local notes for recovery', error); }
  }

  function connect() {
    if (!callbacks) return;
    if (!configured()) {
      showStatus('error', 'Add your Google OAuth Client ID in google-config.js');
      return;
    }
    if (!window.google?.accounts?.oauth2?.initTokenClient) {
      showStatus('error', 'Google sign-in is unavailable. Check your connection.');
      return;
    }
    showStatus('connecting', 'Connecting to Google...');
    const client = google.accounts.oauth2.initTokenClient({
      client_id: window.JOTBOARD_GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: async response => {
        if (response.error || !response.access_token) {
          showStatus('error', response.error_description || response.error || 'Google permission was not granted');
          return;
        }
        accessToken = response.access_token;
        tokenExpiresAt = Date.now() + Math.max(30, Number(response.expires_in || 3600)) * 1000;
        authorized = true;
        ready = false;
        clearTimer();
        try { await onConnected(); }
        catch (error) {
          console.error('Google Drive connection failed', error);
          ready = false;
          showStatus('error', error.message);
        }
      },
      error_callback: () => showStatus('disconnected', 'Google sign-in was closed')
    });
    client.requestAccessToken({ prompt: 'consent' });
  }

  async function syncNow({ force = false } = {}) {
    clearTimer();
    if (!authorized || !ready) return false;
    if (busy) { pending = true; return false; }
    busy = true;
    showStatus('syncing', 'Backing up to Google Drive...');
    const startRevision = revisions;
    try {
      const snapshot = await callbacks.getSnapshot();
      if (!snapshot.notes.length && !remoteFile) {
        showStatus('ready', 'Connected • start writing to back up');
        return true;
      }
      if (!force && remoteSnapshot && dataMatches(snapshot, remoteSnapshot)) {
        rememberBackup();
        recordDriveBackup();
        showStatus('ready', 'Up to date on Google Drive');
        return true;
      }
      const exported = { ...snapshot, exportedAt: new Date().toISOString() };
      let result;
      if (remoteFile) result = await uploadExisting(exported);
      else { remoteFile = await uploadNew(exported); result = true; }
      if (!result) return false;
      remoteSnapshot = exported;
      rememberBackup();
      recordDriveBackup();
      showStatus('ready', 'Backed up to Google Drive');
      return true;
    } catch (error) {
      console.error('Google Drive backup failed', error);
      if (status !== 'expired') showStatus('error', `Drive backup failed: ${error.message}`);
      return false;
    } finally {
      busy = false;
      if ((pending || revisions !== startRevision) && ready) {
        pending = false;
        scheduleBackup();
      }
      if (element('driveBackupNow')) element('driveBackupNow').disabled = !ready;
    }
  }

  function scheduleBackup() {
    if (!authorized || !ready) return;
    revisions += 1;
    clearTimer();
    idleTimer = setTimeout(() => { syncNow(); }, AUTO_BACKUP_DELAY);
    showStatus('pending', 'Changes saved locally • backup in 15 seconds');
  }

  function onLocalSaved() {
    hasLocalNotes = true;
    if (element('driveEmptyConnect')) element('driveEmptyConnect').hidden = true;
    scheduleBackup();
  }

  function disconnect() {
    clearTimer();
    authorized = false;
    ready = false;
    accessToken = '';
    tokenExpiresAt = 0;
    remoteFile = null;
    remoteSnapshot = null;
    accountEmail = '';
    accountHistory = null;
    try { localStorage.removeItem(ACCOUNT_KEY); } catch (_) { /* Optional. */ }
    hideConflict();
    showStatus('disconnected', 'Not connected • notes remain on this device');
  }

  function initialize(options) {
    callbacks = options;
    showStatus('disconnected', !configured() ? 'Google Drive setup required'
      : accountHistory?.email ? 'Reconnect to resume Google Drive backups' : 'Not connected');
    element('driveConnect')?.addEventListener('click', connect);
    element('driveEmptyConnect')?.addEventListener('click', () => {
      element('driveEmptyConnect').blur();
      connect();
    });
    element('driveBackupNow')?.addEventListener('click', () => syncNow());
    element('driveRestoreNow')?.addEventListener('click', () => resolveConflict('drive'));
    element('driveDisconnect')?.addEventListener('click', disconnect);
    element('driveConflictOpen')?.addEventListener('click', showConflict);
    element('driveConflictDrive')?.addEventListener('click', () => resolveConflict('drive'));
    element('driveConflictLocal')?.addEventListener('click', () => resolveConflict('local'));
    element('driveConflictCancel')?.addEventListener('click', () => resolveConflict('cancel'));
    element('driveWelcomeConnect')?.addEventListener('click', () => {
      dismissWelcome();
      connect();
    });
    element('driveWelcomeSkip')?.addEventListener('click', dismissWelcome);
    element('driveWelcomeOverlay')?.addEventListener('click', event => {
      if (event.target === element('driveWelcomeOverlay')) dismissWelcome();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !element('driveWelcomeOverlay')?.hidden) dismissWelcome();
    });
    // Jotboard passes callbacks only after IndexedDB has loaded successfully.
    setTimeout(offerRecovery, 450);
  }

  window.JotboardDrive = { initialize, onLocalSaved, syncNow, connect, disconnect, getStatus: () => ({ status, statusText }) };
})();
