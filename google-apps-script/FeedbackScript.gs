/**
 * LearningHub Feedback - Google Apps Script
 * ==========================================
 * Receives feedback from the LearningHub feedback form and saves to Google Sheets.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project named "LearningHub Feedback"
 * 3. Copy this entire file content into Code.gs
 * 4. Create a new Google Sheet for feedback storage
 * 5. Update SHEET_ID below with your sheet ID
 * 6. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy" and authorize
 * 7. Copy the Web App URL and paste it in feedback.html (replace YOUR_SCRIPT_URL)
 */

// ============== CONFIGURATION ==============

const CONFIG = {
  // Google Sheet ID for storing feedback
  // Find it in the Sheet URL: docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
  sheetId: 'YOUR_SHEET_ID_HERE',

  // Sheet name
  sheetName: 'Feedback',

  // Teacher email for notifications (optional)
  teacherEmail: 'grlnvasile@gmail.com',

  // Send email notification on new feedback?
  sendNotification: true
};

// ============== WEB APP HANDLERS ==============

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'LearningHub Feedback API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests (form submissions)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Save to sheet
    saveFeedback(data);

    // Send notification if enabled
    if (CONFIG.sendNotification) {
      sendNotification(data);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============== DATA STORAGE ==============

/**
 * Save feedback to Google Sheet
 */
function saveFeedback(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);

  // Check if headers exist, if not create them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Scoala',
      'Clasa',
      'Nume',
      'Modul',
      'Nota (1-5)',
      'Materiale Clare',
      'Inteles',
      'Recomanda',
      'Ce a Placut',
      'Ce ar Imbunatati',
      'Comentarii'
    ]);

    // Format header row
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#e3f2fd');
  }

  // Add the feedback row
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.school || '',
    data.class || '',
    data.name || 'Anonim',
    data.module || '',
    data.rating || '',
    data.wasClear || '',
    data.understood || '',
    data.recommend || '',
    data.liked || '',
    data.improve || '',
    data.comments || ''
  ]);

  Logger.log('Feedback saved: ' + data.name + ' from ' + data.school);
}

/**
 * Send email notification for new feedback
 */
function sendNotification(data) {
  const ratingEmojis = ['', '😞', '😐', '🙂', '😊', '🤩'];
  const ratingEmoji = ratingEmojis[parseInt(data.rating)] || '';

  const subject = `[LearningHub] Feedback nou de la ${data.name || 'Anonim'} (${data.school} ${data.class})`;

  const body = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="color: white; margin: 0;">📝 Feedback Nou</h2>
      </div>

      <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 120px;">Elev:</td>
            <td style="padding: 8px 0; font-weight: 600;">${data.name || 'Anonim'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Scoala:</td>
            <td style="padding: 8px 0;">${data.school} - ${data.class}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Modul:</td>
            <td style="padding: 8px 0;">${data.module}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Nota:</td>
            <td style="padding: 8px 0; font-size: 1.5em;">${data.rating}/5 ${ratingEmoji}</td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 120px;">Materiale clare:</td>
            <td style="padding: 8px 0;">${data.wasClear || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Inteles:</td>
            <td style="padding: 8px 0;">${data.understood || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Recomanda:</td>
            <td style="padding: 8px 0;">${data.recommend || '-'}</td>
          </tr>
        </table>

        ${data.liked ? `
        <div style="background: #ecfdf5; padding: 12px; border-radius: 8px; margin-top: 15px;">
          <div style="color: #10b981; font-weight: 600; margin-bottom: 5px;">👍 Ce a placut:</div>
          <div>${data.liked}</div>
        </div>
        ` : ''}

        ${data.improve ? `
        <div style="background: #fef3c7; padding: 12px; border-radius: 8px; margin-top: 15px;">
          <div style="color: #f59e0b; font-weight: 600; margin-bottom: 5px;">💡 Sugestii:</div>
          <div>${data.improve}</div>
        </div>
        ` : ''}

        ${data.comments ? `
        <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin-top: 15px;">
          <div style="color: #64748b; font-weight: 600; margin-bottom: 5px;">📝 Comentarii:</div>
          <div>${data.comments}</div>
        </div>
        ` : ''}
      </div>

      <div style="background: #1e293b; padding: 15px; border-radius: 0 0 12px 12px; text-align: center;">
        <a href="https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}"
           style="color: #60a5fa; text-decoration: none;">
          📊 Vezi toate raspunsurile in Sheet
        </a>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.teacherEmail,
    subject: subject,
    htmlBody: body
  });

  Logger.log('Notification sent to ' + CONFIG.teacherEmail);
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Initialize the sheet with headers (run once manually)
 */
function initializeSheet() {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);

  // Clear and set headers
  sheet.clear();
  sheet.appendRow([
    'Timestamp',
    'Scoala',
    'Clasa',
    'Nume',
    'Modul',
    'Nota (1-5)',
    'Materiale Clare',
    'Inteles',
    'Recomanda',
    'Ce a Placut',
    'Ce ar Imbunatati',
    'Comentarii'
  ]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e3f2fd');
  headerRange.setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 180);  // Timestamp
  sheet.setColumnWidth(2, 120);  // Scoala
  sheet.setColumnWidth(3, 60);   // Clasa
  sheet.setColumnWidth(4, 100);  // Nume
  sheet.setColumnWidth(5, 80);   // Modul
  sheet.setColumnWidth(6, 80);   // Nota
  sheet.setColumnWidth(7, 100);  // Materiale Clare
  sheet.setColumnWidth(8, 80);   // Inteles
  sheet.setColumnWidth(9, 80);   // Recomanda
  sheet.setColumnWidth(10, 250); // Ce a Placut
  sheet.setColumnWidth(11, 250); // Ce ar Imbunatati
  sheet.setColumnWidth(12, 200); // Comentarii

  // Freeze header row
  sheet.setFrozenRows(1);

  Logger.log('Sheet initialized successfully!');
}

/**
 * Test function - add sample feedback
 */
function testAddFeedback() {
  const sampleData = {
    timestamp: new Date().toISOString(),
    school: 'Elena Cuza',
    class: '7A',
    name: 'Test Elev',
    module: 'M3',
    rating: '4',
    wasClear: 'Da',
    understood: 'Da',
    recommend: 'Da',
    liked: 'Explicatiile pas cu pas',
    improve: 'Mai multe exemple',
    comments: 'Foarte util!'
  };

  saveFeedback(sampleData);
  Logger.log('Test feedback added');
}

/**
 * Test notification email
 */
function testNotification() {
  const sampleData = {
    school: 'Elena Cuza',
    class: '7A',
    name: 'Test Elev',
    module: 'M3',
    rating: '5',
    wasClear: 'Da',
    understood: 'Da',
    recommend: 'Da',
    liked: 'Totul a fost excelent!',
    improve: '',
    comments: ''
  };

  sendNotification(sampleData);
  Logger.log('Test notification sent');
}

/**
 * Get feedback statistics
 */
function getFeedbackStats() {
  const sheet = SpreadsheetApp.openById(CONFIG.sheetId).getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    Logger.log('No feedback data yet');
    return;
  }

  const responses = data.slice(1); // Skip header

  const stats = {
    total: responses.length,
    avgRating: 0,
    bySchool: {},
    byModule: {},
    recommendations: { Da: 0, Nu: 0 }
  };

  let ratingSum = 0;
  let ratingCount = 0;

  responses.forEach(row => {
    const school = row[1];
    const module = row[4];
    const rating = parseInt(row[5]);
    const recommend = row[8];

    // Rating
    if (!isNaN(rating)) {
      ratingSum += rating;
      ratingCount++;
    }

    // By school
    stats.bySchool[school] = (stats.bySchool[school] || 0) + 1;

    // By module
    stats.byModule[module] = (stats.byModule[module] || 0) + 1;

    // Recommendations
    if (recommend === 'Da') stats.recommendations.Da++;
    else if (recommend === 'Nu') stats.recommendations.Nu++;
  });

  stats.avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : 0;

  Logger.log('Feedback Statistics:');
  Logger.log('Total responses: ' + stats.total);
  Logger.log('Average rating: ' + stats.avgRating + '/5');
  Logger.log('By school: ' + JSON.stringify(stats.bySchool));
  Logger.log('By module: ' + JSON.stringify(stats.byModule));
  Logger.log('Would recommend: ' + stats.recommendations.Da + ' yes, ' + stats.recommendations.Nu + ' no');

  return stats;
}
