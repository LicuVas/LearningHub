/**
 * LearningHub Teacher Dashboard
 * ==============================
 * Displays student evidence submissions from Google Sheets
 */

const TeacherDashboard = {
    CONFIG_KEY: 'learninghub_teacher_config',
    DATA_KEY: 'learninghub_teacher_cache',

    config: null,
    data: [],
    refreshInterval: null,
    demoMode: false,

    /**
     * Initialize the dashboard
     */
    async init() {
        this.loadConfig();
        this.setupEventListeners();

        if (!this.isConfigured()) {
            this.showSetup();
        } else {
            this.hideSetup();
            await this.loadData();
            this.startAutoRefresh();
        }
    },

    /**
     * Check if dashboard is configured
     */
    isConfigured() {
        return this.config && (this.config.sheetId || this.demoMode);
    },

    /**
     * Load configuration from localStorage
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem(this.CONFIG_KEY);
            if (saved) {
                this.config = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading config:', e);
        }
    },

    /**
     * Save configuration
     */
    saveConfig() {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });

        // Refresh button
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.loadData();
        });

        // Auto-refresh checkbox
        document.getElementById('auto-refresh')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        });

        // Class filter
        document.getElementById('filter-class')?.addEventListener('change', () => {
            this.renderClassView();
        });

        // Student search
        document.getElementById('search-student')?.addEventListener('input', (e) => {
            this.filterStudents(e.target.value);
        });

        // Module filter
        document.getElementById('filter-module')?.addEventListener('change', () => {
            this.renderLessonView();
        });
    },

    /**
     * Switch between views
     */
    switchView(viewName) {
        // Update tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === viewName);
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${viewName}`);
        });

        // Render view content
        switch (viewName) {
            case 'overview':
                this.renderOverview();
                break;
            case 'by-class':
                this.renderClassView();
                break;
            case 'by-lesson':
                this.renderLessonView();
                break;
            case 'pending':
                this.renderPendingView();
                break;
        }
    },

    /**
     * Show setup overlay
     */
    showSetup() {
        document.getElementById('setup-overlay')?.classList.remove('hidden');
    },

    /**
     * Hide setup overlay
     */
    hideSetup() {
        document.getElementById('setup-overlay')?.classList.add('hidden');
    },

    /**
     * Complete setup with user-provided config
     */
    completeSetup() {
        const sheetId = document.getElementById('setup-sheet-id')?.value.trim();
        const apiKey = document.getElementById('setup-api-key')?.value.trim();

        if (!sheetId || !apiKey) {
            alert('Te rugam sa completezi Sheet ID si API Key!');
            return;
        }

        this.config = { sheetId, apiKey };
        this.saveConfig();
        this.hideSetup();
        this.loadData();
        this.startAutoRefresh();
    },

    /**
     * Use demo mode with fake data
     */
    useDemoMode() {
        this.demoMode = true;
        this.config = { demoMode: true };
        this.saveConfig();
        this.hideSetup();
        this.loadDemoData();
    },

    /**
     * Load demo data for testing
     */
    loadDemoData() {
        const now = new Date();
        const students = [
            { id: 'maria_6a', name: 'Maria Popescu', grade: 'cls6', avatar: '🦊' },
            { id: 'alex_6b', name: 'Alexandru Ion', grade: 'cls6', avatar: '🐼' },
            { id: 'elena_7a', name: 'Elena Vasilescu', grade: 'cls7', avatar: '🦋' },
            { id: 'andrei_5a', name: 'Andrei Marin', grade: 'cls5', avatar: '🦁' },
            { id: 'diana_8a', name: 'Diana Gheorghe', grade: 'cls8', avatar: '🐬' },
        ];

        const modules = ['m2-scratch', 'm3-scratch-control'];
        const lessons = ['lectia1', 'lectia2', 'lectia3', 'lectia4', 'lectia5'];

        this.data = [];

        // Generate random submissions
        for (let i = 0; i < 25; i++) {
            const student = students[Math.floor(Math.random() * students.length)];
            const module = modules[Math.floor(Math.random() * modules.length)];
            const lesson = lessons[Math.floor(Math.random() * lessons.length)];
            const hoursAgo = Math.floor(Math.random() * 72);

            this.data.push({
                timestamp: new Date(now - hoursAgo * 3600000).toISOString(),
                profileId: student.id,
                profileName: student.name,
                grade: student.grade,
                module: module,
                lesson: lesson,
                lessonTitle: `Lectia ${lesson.replace('lectia', '')} - ${module === 'm2-scratch' ? 'Scratch Baza' : 'Control'}`,
                scratchUrl: `https://scratch.mit.edu/projects/${300000000 + Math.floor(Math.random() * 100000)}`,
                whatLearned: 'Am invatat despre variabile si cum sa le folosesc pentru a tine scorul.',
                whatCreated: 'Am creat un joc simplu cu personaje care se misca.',
                quizScore: Math.floor(Math.random() * 4) + 2,
                verified: Math.random() > 0.3,
                avatar: student.avatar
            });
        }

        // Sort by timestamp descending
        this.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        this.updateStats();
        this.renderOverview();
        this.updateLastRefresh();
    },

    /**
     * Load data from Google Sheets
     */
    async loadData() {
        if (this.demoMode || this.config?.demoMode) {
            this.loadDemoData();
            return;
        }

        if (!this.config?.sheetId || !this.config?.apiKey) {
            console.error('Missing Sheet ID or API Key');
            return;
        }

        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.sheetId}/values/Submissions!A:M?key=${this.config.apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.values || result.values.length < 2) {
                console.log('No data in sheet or only headers');
                this.data = [];
            } else {
                // Parse rows (skip header row)
                const headers = result.values[0];
                this.data = result.values.slice(1).map(row => ({
                    timestamp: row[0] || '',
                    profileId: row[1] || '',
                    profileName: row[2] || '',
                    grade: row[3] || '',
                    module: row[4] || '',
                    lesson: row[5] || '',
                    lessonTitle: row[6] || '',
                    scratchUrl: row[7] || '',
                    whatLearned: row[8] || '',
                    whatCreated: row[9] || '',
                    quizScore: parseInt(row[10]) || 0,
                    verified: row[11]?.toLowerCase() === 'true',
                    teacherNotes: row[12] || ''
                }));
            }

            this.updateStats();
            this.renderOverview();
            this.updateLastRefresh();

        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('recent-activity').innerHTML = `
                <div class="empty-state">
                    <span class="icon">⚠️</span>
                    <p>Eroare la incarcarea datelor: ${error.message}</p>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem;">Verifica Sheet ID si API Key in setari.</p>
                </div>
            `;
        }
    },

    /**
     * Update statistics
     */
    updateStats() {
        // Total unique students
        const uniqueStudents = new Set(this.data.map(d => d.profileId));
        document.getElementById('total-students').textContent = uniqueStudents.size;

        // Total submissions
        document.getElementById('total-submissions').textContent = this.data.length;

        // Today's submissions
        const today = new Date().toDateString();
        const todayCount = this.data.filter(d => new Date(d.timestamp).toDateString() === today).length;
        document.getElementById('today-submissions').textContent = todayCount;

        // Pending review
        const pendingCount = this.data.filter(d => !d.verified).length;
        document.getElementById('pending-review').textContent = pendingCount;
    },

    /**
     * Render overview view
     */
    renderOverview() {
        this.renderRecentActivity();
        this.renderClassSummary();
        this.renderTopStudents();
    },

    /**
     * Render recent activity
     */
    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const recent = this.data.slice(0, 10);

        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">📭</span>
                    <p>Nicio activitate recenta</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recent.map(item => `
            <div class="activity-item">
                <span class="activity-avatar">${item.avatar || '👤'}</span>
                <div class="activity-info">
                    <div class="activity-name">${item.profileName}</div>
                    <div class="activity-lesson">${item.lessonTitle || item.lesson}</div>
                </div>
                <span class="activity-time">${this.formatTime(item.timestamp)}</span>
            </div>
        `).join('');
    },

    /**
     * Render class summary
     */
    renderClassSummary() {
        const container = document.getElementById('class-summary');
        if (!container) return;

        const grades = ['cls5', 'cls6', 'cls7', 'cls8'];
        const gradeLabels = {
            'cls5': 'Cls 5',
            'cls6': 'Cls 6',
            'cls7': 'Cls 7',
            'cls8': 'Cls 8'
        };

        const summary = grades.map(grade => {
            const gradeData = this.data.filter(d => d.grade === grade);
            const uniqueStudents = new Set(gradeData.map(d => d.profileId));
            return {
                grade,
                label: gradeLabels[grade],
                students: uniqueStudents.size,
                submissions: gradeData.length
            };
        });

        container.innerHTML = summary.map(item => `
            <div class="class-item">
                <span class="class-badge">${item.label}</span>
                <div class="class-stats">
                    <span>${item.students} elevi</span>
                    <span>${item.submissions} dovezi</span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render top students
     */
    renderTopStudents() {
        const container = document.getElementById('top-students');
        if (!container) return;

        // Count submissions per student in last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const studentCounts = {};
        this.data
            .filter(d => new Date(d.timestamp) > weekAgo)
            .forEach(d => {
                if (!studentCounts[d.profileId]) {
                    studentCounts[d.profileId] = {
                        name: d.profileName,
                        avatar: d.avatar || '👤',
                        grade: d.grade,
                        count: 0
                    };
                }
                studentCounts[d.profileId].count++;
            });

        const top = Object.values(studentCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        if (top.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">🏆</span>
                    <p>Nicio activitate in ultima saptamana</p>
                </div>
            `;
            return;
        }

        container.innerHTML = top.map((student, i) => `
            <div class="student-rank">
                <span class="rank-number">${i + 1}</span>
                <span class="activity-avatar">${student.avatar}</span>
                <div class="student-info">
                    <div class="activity-name">${student.name}</div>
                    <div class="activity-lesson">${this.getGradeLabel(student.grade)}</div>
                </div>
                <span class="student-lessons">${student.count} lectii</span>
            </div>
        `).join('');
    },

    /**
     * Render class view with table
     */
    renderClassView() {
        const tbody = document.getElementById('class-table-body');
        if (!tbody) return;

        const filterGrade = document.getElementById('filter-class')?.value;

        // Group by student
        const students = {};
        this.data.forEach(d => {
            if (filterGrade && d.grade !== filterGrade) return;

            if (!students[d.profileId]) {
                students[d.profileId] = {
                    name: d.profileName,
                    grade: d.grade,
                    avatar: d.avatar || '👤',
                    count: 0,
                    lastActivity: d.timestamp
                };
            }
            students[d.profileId].count++;
            if (new Date(d.timestamp) > new Date(students[d.profileId].lastActivity)) {
                students[d.profileId].lastActivity = d.timestamp;
            }
        });

        const studentList = Object.entries(students)
            .sort((a, b) => b[1].count - a[1].count);

        if (studentList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Niciun elev gasit</td></tr>`;
            return;
        }

        tbody.innerHTML = studentList.map(([id, student]) => `
            <tr>
                <td>
                    <span style="margin-right: 0.5rem">${student.avatar}</span>
                    ${student.name}
                </td>
                <td>${this.getGradeLabel(student.grade)}</td>
                <td>${student.count}</td>
                <td>${this.formatTime(student.lastActivity)}</td>
                <td>
                    <button class="btn-secondary btn-small" onclick="TeacherDashboard.showStudentDetails('${id}')">
                        Detalii
                    </button>
                </td>
            </tr>
        `).join('');
    },

    /**
     * Show student details
     */
    showStudentDetails(studentId) {
        // Switch to student view
        this.switchView('by-student');

        const container = document.getElementById('student-details');
        const studentData = this.data.filter(d => d.profileId === studentId);

        if (studentData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">❌</span>
                    <p>Nu s-au gasit date pentru acest elev</p>
                </div>
            `;
            return;
        }

        const student = studentData[0];

        container.innerHTML = `
            <div class="card" style="margin-bottom: 1rem">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem">
                    <span style="font-size: 3rem">${student.avatar || '👤'}</span>
                    <div>
                        <h2 style="margin: 0">${student.profileName}</h2>
                        <p style="color: var(--text-secondary); margin: 0">${this.getGradeLabel(student.grade)}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 2rem">
                    <div>
                        <span style="font-size: 1.5rem; font-weight: bold">${studentData.length}</span>
                        <span style="color: var(--text-muted)"> dovezi trimise</span>
                    </div>
                    <div>
                        <span style="font-size: 1.5rem; font-weight: bold">${studentData.filter(d => d.verified).length}</span>
                        <span style="color: var(--text-muted)"> verificate</span>
                    </div>
                </div>
            </div>
            <h3>Istoric Dovezi</h3>
            <div class="pending-list">
                ${studentData.map(item => `
                    <div class="pending-item" style="border-left-color: ${item.verified ? 'var(--accent-green)' : 'var(--accent-orange)'}">
                        <div class="pending-header">
                            <div>
                                <div class="pending-name">${item.lessonTitle || item.lesson}</div>
                                <div class="pending-meta">${item.module} - ${this.formatTime(item.timestamp)}</div>
                            </div>
                            <span style="color: ${item.verified ? 'var(--accent-green)' : 'var(--accent-orange)'}">
                                ${item.verified ? '✓ Verificat' : '⏳ In asteptare'}
                            </span>
                        </div>
                        <div class="pending-content">
                            ${item.scratchUrl ? `
                                <div class="pending-field">
                                    <label>Link Scratch</label>
                                    <a href="${item.scratchUrl}" target="_blank">${item.scratchUrl}</a>
                                </div>
                            ` : ''}
                            <div class="pending-field">
                                <label>Ce a invatat</label>
                                <p>${item.whatLearned || '-'}</p>
                            </div>
                            <div class="pending-field">
                                <label>Ce a creat</label>
                                <p>${item.whatCreated || '-'}</p>
                            </div>
                            ${item.quizScore ? `
                                <div class="pending-field">
                                    <label>Scor Quiz</label>
                                    <p>${item.quizScore}/5</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Render lesson view
     */
    renderLessonView() {
        const container = document.getElementById('lesson-gallery');
        if (!container) return;

        const filterModule = document.getElementById('filter-module')?.value;

        let filtered = this.data;
        if (filterModule) {
            filtered = this.data.filter(d => d.module === filterModule);
        }

        // Group by lesson
        const lessons = {};
        filtered.forEach(d => {
            const key = `${d.module}/${d.lesson}`;
            if (!lessons[key]) {
                lessons[key] = {
                    module: d.module,
                    lesson: d.lesson,
                    title: d.lessonTitle,
                    submissions: []
                };
            }
            lessons[key].submissions.push(d);
        });

        const lessonList = Object.values(lessons);

        if (lessonList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">📚</span>
                    <p>Nicio dovada pentru acest modul</p>
                </div>
            `;
            return;
        }

        container.innerHTML = lessonList.map(lesson => `
            <div class="gallery-card">
                <div class="gallery-header">
                    <strong>${lesson.title || lesson.lesson}</strong>
                    <div style="color: var(--text-muted); font-size: 0.8rem">${lesson.module}</div>
                </div>
                <div class="gallery-body">
                    <div style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.85rem">
                        ${lesson.submissions.length} dovezi
                    </div>
                    ${lesson.submissions.slice(0, 3).map(s => `
                        <div style="padding: 0.5rem; background: var(--bg-card); border-radius: 8px; margin-bottom: 0.5rem">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span>${s.avatar || '👤'} ${s.profileName}</span>
                                <span style="font-size: 0.75rem; color: var(--text-muted)">${this.formatTime(s.timestamp)}</span>
                            </div>
                            ${s.scratchUrl ? `
                                <a href="${s.scratchUrl}" target="_blank" class="gallery-link" style="margin-top: 0.25rem; display: block; font-size: 0.8rem">
                                    Vezi proiect Scratch
                                </a>
                            ` : ''}
                        </div>
                    `).join('')}
                    ${lesson.submissions.length > 3 ? `
                        <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem">
                            +${lesson.submissions.length - 3} alte dovezi
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    /**
     * Render pending review view
     */
    renderPendingView() {
        const container = document.getElementById('pending-list');
        if (!container) return;

        const pending = this.data.filter(d => !d.verified);

        if (pending.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">✅</span>
                    <p>Toate dovezile au fost verificate!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pending.map((item, index) => `
            <div class="pending-item" id="pending-${index}">
                <div class="pending-header">
                    <div class="pending-student">
                        <span class="pending-avatar">${item.avatar || '👤'}</span>
                        <div>
                            <div class="pending-name">${item.profileName}</div>
                            <div class="pending-meta">${this.getGradeLabel(item.grade)} - ${this.formatTime(item.timestamp)}</div>
                        </div>
                    </div>
                    <div class="pending-actions">
                        <button class="btn-approve" onclick="TeacherDashboard.approveSubmission(${index})" title="Aproba">
                            ✓
                        </button>
                        <button class="btn-reject" onclick="TeacherDashboard.rejectSubmission(${index})" title="Respinge">
                            ✗
                        </button>
                    </div>
                </div>
                <div style="margin-bottom: 0.75rem">
                    <strong>${item.lessonTitle || item.lesson}</strong>
                    <span style="color: var(--text-muted); margin-left: 0.5rem">${item.module}</span>
                </div>
                <div class="pending-content">
                    ${item.scratchUrl ? `
                        <div class="pending-field">
                            <label>Link Scratch</label>
                            <a href="${item.scratchUrl}" target="_blank">${item.scratchUrl}</a>
                        </div>
                    ` : ''}
                    <div class="pending-field">
                        <label>Ce a invatat</label>
                        <p>${item.whatLearned || '-'}</p>
                    </div>
                    <div class="pending-field">
                        <label>Ce a creat</label>
                        <p>${item.whatCreated || '-'}</p>
                    </div>
                    ${item.quizScore ? `
                        <div class="pending-field">
                            <label>Scor Quiz</label>
                            <p>${item.quizScore}/5</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    /**
     * Approve a submission (mark as verified)
     * Note: In demo mode this only updates local state
     * With real Sheet, would need Apps Script to update
     */
    approveSubmission(index) {
        const pending = this.data.filter(d => !d.verified);
        if (pending[index]) {
            pending[index].verified = true;
            this.updateStats();
            this.renderPendingView();

            // Show brief confirmation
            this.showToast('Dovada aprobata!', 'success');
        }
    },

    /**
     * Reject a submission
     */
    rejectSubmission(index) {
        const reason = prompt('Motivul respingerii (optional):');
        if (reason !== null) {
            const pending = this.data.filter(d => !d.verified);
            if (pending[index]) {
                // In a real implementation, would update Sheet
                // For demo, just remove from pending view
                pending[index].teacherNotes = `Respins: ${reason || 'Fara motiv specificat'}`;
                pending[index].verified = true; // Mark as "reviewed"
                this.updateStats();
                this.renderPendingView();

                this.showToast('Dovada respinsa', 'error');
            }
        }
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        this.stopAutoRefresh();
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 30000); // 30 seconds
    },

    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    },

    /**
     * Update last refresh timestamp
     */
    updateLastRefresh() {
        const el = document.getElementById('last-update');
        if (el) {
            el.textContent = `Ultima actualizare: ${new Date().toLocaleTimeString('ro-RO')}`;
        }
    },

    /**
     * Format timestamp for display
     */
    formatTime(timestamp) {
        if (!timestamp) return '-';

        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `acum ${minutes} min`;
        }

        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `acum ${hours}h`;
        }

        // Less than 7 days
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `acum ${days} zile`;
        }

        // Otherwise show date
        return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
    },

    /**
     * Get grade label
     */
    getGradeLabel(grade) {
        const labels = {
            'cls5': 'Clasa 5',
            'cls6': 'Clasa 6',
            'cls7': 'Clasa 7',
            'cls8': 'Clasa 8'
        };
        return labels[grade] || grade;
    },

    /**
     * Filter students by search term
     */
    filterStudents(searchTerm) {
        // Would filter the class table based on search
        // For now just re-render with filter
        this.renderClassView();
    }
};

// Global functions for HTML onclick handlers
function completeSetup() {
    TeacherDashboard.completeSetup();
}

function useDemoMode() {
    TeacherDashboard.useDemoMode();
}

function showConfigModal() {
    document.getElementById('config-modal')?.classList.add('active');
}

function closeConfigModal() {
    document.getElementById('config-modal')?.classList.remove('active');
}

function saveConfig() {
    const sheetId = document.getElementById('config-sheet-id')?.value.trim();
    const apiKey = document.getElementById('config-api-key')?.value.trim();

    if (sheetId && apiKey) {
        TeacherDashboard.config = { sheetId, apiKey };
        TeacherDashboard.demoMode = false;
        TeacherDashboard.saveConfig();
        closeConfigModal();
        TeacherDashboard.loadData();
    }
}

// Add slideIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    TeacherDashboard.init();
});
