/**
 * LearningHub - Google Apps Script
 * =================================
 * Handles email notifications and data processing for student evidence
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project named "LearningHub Evidence"
 * 3. Copy this entire file content into Code.gs
 * 4. Update CONFIG section below with your values
 * 5. Run setupTriggers() once to configure automatic triggers
 * 6. Grant necessary permissions when prompted
 */

// ============== CONFIGURATION ==============
const CONFIG = {
  // Teacher email for notifications
  teacherEmail: 'grlnvasile@gmail.com',

  // Google Sheet ID (from your Form responses)
  // Find it in the Sheet URL: docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
  sheetId: 'YOUR_SHEET_ID_HERE',

  // Sheet name where form responses are stored
  sheetName: 'Form Responses 1',

  // Dashboard URL (update after deployment)
  dashboardUrl: 'https://your-site.com/hub/teacher/dashboard.html',

  // Enable/disable features
  features: {
    instantNotification: false,  // Email on each submission
    dailySummary: true,          // Daily summary at 18:00
    weeklySummary: true,         // Weekly summary on Friday
    inactivityAlerts: true       // Alert for inactive students
  },

  // Notification settings
  dailySummaryHour: 18,  // 6 PM
  weeklySummaryDay: 5,   // Friday (0=Sunday, 5=Friday)
  inactivityDays: 3      // Days before inactivity alert
};

// ============== TRIGGERS SETUP ==============

/**
 * Run this function ONCE to set up all triggers
 */
function setupTriggers() {
  // Remove existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Trigger on form submission
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(CONFIG.sheetId)
    .onFormSubmit()
    .create();

  // Daily summary at specified hour
  ScriptApp.newTrigger('sendDailySummary')
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.dailySummaryHour)
    .create();

  // Weekly summary on specified day
  ScriptApp.newTrigger('sendWeeklySummary')
    .timeBased()
    .onWeekDay(CONFIG.weeklySummaryDay + 1) // ScriptApp uses 1-7 for days
    .atHour(CONFIG.dailySummaryHour)
    .create();

  Logger.log('Triggers configured successfully!');
}

// ============== FORM SUBMISSION HANDLER ==============

/**
 * Called automatically when a form is submitted
 */
function onFormSubmit(e) {
  try {
    const response = e.namedValues;

    // Log the submission
    Logger.log('New submission received: ' + JSON.stringify(response));

    // Validate the Scratch URL if provided
    const scratchUrl = response['Scratch URL'] ? response['Scratch URL'][0] : '';
    if (scratchUrl) {
      const isValid = validateScratchProject(scratchUrl);
      markValidation(e.range.getRow(), isValid);
    }

    // Send instant notification if enabled
    if (CONFIG.features.instantNotification) {
      sendInstantNotification(response);
    }

  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
  }
}

/**
 * Validate that a Scratch project exists
 */
function validateScratchProject(url) {
  try {
    // Extract project ID from URL
    const match = url.match(/scratch\.mit\.edu\/projects\/(\d+)/);
    if (!match) return false;

    const projectId = match[1];
    const apiUrl = `https://api.scratch.mit.edu/projects/${projectId}`;

    const response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    return response.getResponseCode() === 200;

  } catch (error) {
    Logger.log('Error validating Scratch project: ' + error.toString());
    return false;
  }
}

/**
 * Mark the validation status in the sheet
 */
function markValidation(row, isValid) {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);
  // Assuming validation column is column N (14)
  sheet.getRange(row, 14).setValue(isValid ? 'VALID' : 'INVALID');
}

// ============== EMAIL NOTIFICATIONS ==============

/**
 * Send instant notification for new submission
 */
function sendInstantNotification(response) {
  const studentName = response['Nume Elev'] ? response['Nume Elev'][0] : 'Unknown';
  const lesson = response['Lectie'] ? response['Lectie'][0] : 'Unknown';
  const scratchUrl = response['Scratch URL'] ? response['Scratch URL'][0] : '';

  const subject = `[LearningHub] Dovada noua de la ${studentName}`;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">LearningHub - Dovada Noua</h2>

      <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <p><strong>Elev:</strong> ${studentName}</p>
        <p><strong>Lectie:</strong> ${lesson}</p>
        ${scratchUrl ? `<p><strong>Proiect Scratch:</strong> <a href="${scratchUrl}">${scratchUrl}</a></p>` : ''}
      </div>

      <p>
        <a href="${CONFIG.dashboardUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">
          Vezi in Dashboard
        </a>
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.teacherEmail,
    subject: subject,
    htmlBody: body
  });
}

/**
 * Send daily summary email
 */
function sendDailySummary() {
  if (!CONFIG.features.dailySummary) return;

  const stats = getDailyStats();

  if (stats.todayCount === 0) {
    Logger.log('No submissions today, skipping daily summary');
    return;
  }

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMM yyyy');
  const subject = `[LearningHub] Rezumat zilnic - ${today}`;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">LearningHub - Rezumat ${today}</h2>

      <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <h3 style="margin-top: 0;">Activitate Azi</h3>
        <ul style="list-style: none; padding: 0;">
          <li>👥 <strong>${stats.activeStudents}</strong> elevi activi</li>
          <li>📚 <strong>${stats.todayCount}</strong> lectii completate</li>
          <li>⏳ <strong>${stats.pendingCount}</strong> dovezi de verificat</li>
        </ul>
      </div>

      <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <h3 style="margin-top: 0;">Pe Clase</h3>
        ${Object.entries(stats.byClass).map(([cls, count]) =>
          `<p>• ${cls}: <strong>${count}</strong> lectii</p>`
        ).join('')}
      </div>

      ${stats.topStudents.length > 0 ? `
        <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <h3 style="margin-top: 0;">Top 3 Elevi (azi)</h3>
          <ol>
            ${stats.topStudents.map(s => `<li>${s.name} - ${s.count} lectii</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <p>
        <a href="${CONFIG.dashboardUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">
          Vezi Dashboard Complet
        </a>
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.teacherEmail,
    subject: subject,
    htmlBody: body
  });

  Logger.log('Daily summary sent');
}

/**
 * Send weekly summary email
 */
function sendWeeklySummary() {
  if (!CONFIG.features.weeklySummary) return;

  const stats = getWeeklyStats();

  const weekEnd = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMM');
  const subject = `[LearningHub] Raport saptamanal - Saptamana din ${weekEnd}`;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b5cf6;">LearningHub - Raport Saptamanal</h2>

      <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <h3 style="margin-top: 0;">Statistici Saptamana</h3>
        <ul style="list-style: none; padding: 0;">
          <li>👥 <strong>${stats.totalStudents}</strong> elevi activi</li>
          <li>📚 <strong>${stats.totalLessons}</strong> lectii completate</li>
          <li>📈 <strong>${stats.avgPerStudent.toFixed(1)}</strong> lectii/elev (medie)</li>
        </ul>
      </div>

      <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <h3 style="margin-top: 0;">Progres pe Clase</h3>
        ${Object.entries(stats.byClass).map(([cls, data]) =>
          `<p>• ${cls}: ${data.students} elevi, ${data.lessons} lectii</p>`
        ).join('')}
      </div>

      ${stats.inactiveStudents.length > 0 ? `
        <div style="background: #fef2f2; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #ef4444;">
          <h3 style="margin-top: 0; color: #ef4444;">Elevi Inactivi (3+ zile)</h3>
          <ul>
            ${stats.inactiveStudents.map(s => `<li>${s.name} - ultima activitate: ${s.lastSeen}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <p>
        <a href="${CONFIG.dashboardUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">
          Vezi Dashboard Complet
        </a>
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.teacherEmail,
    subject: subject,
    htmlBody: body
  });

  Logger.log('Weekly summary sent');
}

// ============== DATA RETRIEVAL ==============

/**
 * Get statistics for today
 */
function getDailyStats() {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayCount = 0;
  let pendingCount = 0;
  const activeStudents = new Set();
  const byClass = {};
  const studentCounts = {};

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[0]);
    const studentId = row[1];
    const studentName = row[2];
    const grade = row[3];
    const verified = row[11];

    // Check if today
    if (timestamp >= today) {
      todayCount++;
      activeStudents.add(studentId);

      // Count by class
      if (!byClass[grade]) byClass[grade] = 0;
      byClass[grade]++;

      // Count by student
      if (!studentCounts[studentId]) {
        studentCounts[studentId] = { name: studentName, count: 0 };
      }
      studentCounts[studentId].count++;
    }

    // Count pending (not verified)
    if (verified !== true && verified !== 'TRUE') {
      pendingCount++;
    }
  }

  // Get top 3 students
  const topStudents = Object.values(studentCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    todayCount,
    pendingCount,
    activeStudents: activeStudents.size,
    byClass,
    topStudents
  };
}

/**
 * Get statistics for the past week
 */
function getWeeklyStats() {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  let totalLessons = 0;
  const students = {};
  const byClass = {};

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[0]);
    const studentId = row[1];
    const studentName = row[2];
    const grade = row[3];

    // Track student activity
    if (!students[studentId]) {
      students[studentId] = { name: studentName, grade, lastSeen: timestamp, count: 0 };
    }
    if (timestamp > students[studentId].lastSeen) {
      students[studentId].lastSeen = timestamp;
    }

    // Check if this week
    if (timestamp >= weekAgo) {
      totalLessons++;
      students[studentId].count++;

      // Count by class
      if (!byClass[grade]) byClass[grade] = { students: new Set(), lessons: 0 };
      byClass[grade].students.add(studentId);
      byClass[grade].lessons++;
    }
  }

  // Convert Set to count for byClass
  Object.keys(byClass).forEach(cls => {
    byClass[cls].students = byClass[cls].students.size;
  });

  // Find inactive students (no activity in last N days)
  const inactiveThreshold = new Date();
  inactiveThreshold.setDate(inactiveThreshold.getDate() - CONFIG.inactivityDays);

  const inactiveStudents = Object.values(students)
    .filter(s => s.lastSeen < inactiveThreshold)
    .map(s => ({
      name: s.name,
      lastSeen: Utilities.formatDate(s.lastSeen, Session.getScriptTimeZone(), 'dd MMM')
    }));

  // Calculate averages
  const totalStudents = Object.keys(students).filter(id => students[id].count > 0).length;
  const avgPerStudent = totalStudents > 0 ? totalLessons / totalStudents : 0;

  return {
    totalLessons,
    totalStudents,
    avgPerStudent,
    byClass,
    inactiveStudents
  };
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Test function - send a test email
 */
function testEmail() {
  MailApp.sendEmail({
    to: CONFIG.teacherEmail,
    subject: '[LearningHub] Test Email',
    htmlBody: '<h2>Test successful!</h2><p>Email notifications are working.</p>'
  });
  Logger.log('Test email sent to ' + CONFIG.teacherEmail);
}

/**
 * Manually trigger daily summary (for testing)
 */
function testDailySummary() {
  sendDailySummary();
}

/**
 * Manually trigger weekly summary (for testing)
 */
function testWeeklySummary() {
  sendWeeklySummary();
}

/**
 * View current configuration
 */
function viewConfig() {
  Logger.log(JSON.stringify(CONFIG, null, 2));
}
