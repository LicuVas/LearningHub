/**
 * LearningHub Teacher Dashboard
 * =============================
 * Dashboard pentru profesor cu:
 * - Vizualizare progres per clasa/elev
 * - Statistici agregate
 * - Alerte elevi in dificultate
 * - Export/Import date
 */

const TeacherDashboard = {
    STORAGE_PREFIX: 'learninghub_',

    // Cache pentru date
    data: {
        students: [],
        progress: {},
        proficiency: {},
        activity: []
    },

    /**
     * Initializeaza dashboard-ul
     */
    init() {
        console.log('TeacherDashboard: Initializing...');
        this.loadAllData();
        this.renderOverview();
        this.renderStudents();
        this.renderLessonsForGrade('V');
        this.renderAlerts();
        this.renderStorageInfo();
        console.log('TeacherDashboard: Ready');
    },

    /**
     * Incarca toate datele din localStorage
     */
    loadAllData() {
        // Colecteaza toate cheile relevante
        const allKeys = Object.keys(localStorage).filter(k =>
            k.startsWith(this.STORAGE_PREFIX) ||
            k.startsWith('learninghub')
        );

        // Extrage profile de elevi
        this.data.students = this.extractStudents();

        // Extrage progres per profil
        this.data.progress = this.extractProgress();

        // Extrage proficiency per profil
        this.data.proficiency = this.extractProficiency();

        // Construieste activitate recenta
        this.data.activity = this.buildActivityLog();
    },

    /**
     * Extrage lista de elevi din UserSystem
     */
    extractStudents() {
        const students = [];

        // Cauta profile in localStorage
        const profilesKey = 'learninghub_profiles';
        const profilesData = localStorage.getItem(profilesKey);

        if (profilesData) {
            try {
                const profiles = JSON.parse(profilesData);
                if (Array.isArray(profiles)) {
                    profiles.forEach(p => {
                        students.push({
                            id: p.id || p.name,
                            name: p.name || p.id,
                            grade: p.grade || 'V',
                            email: p.email || '',
                            createdAt: p.createdAt || new Date().toISOString()
                        });
                    });
                }
            } catch (e) {
                console.error('Error parsing profiles:', e);
            }
        }

        // Cauta si profile individuale
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.match(/learninghub_profile_/)) {
                try {
                    const profile = JSON.parse(localStorage.getItem(key));
                    if (profile && !students.find(s => s.id === profile.id)) {
                        students.push({
                            id: profile.id,
                            name: profile.name || profile.id,
                            grade: profile.grade || 'V',
                            email: profile.email || '',
                            createdAt: profile.createdAt || new Date().toISOString()
                        });
                    }
                } catch (e) {}
            }
        }

        // Daca nu avem elevi, genereaza date demo
        if (students.length === 0) {
            students.push(...this.generateDemoStudents());
        }

        return students;
    },

    /**
     * Genereaza elevi demo pentru demonstratie
     */
    generateDemoStudents() {
        const names = [
            'Popescu Maria', 'Ionescu Andrei', 'Popa Elena',
            'Constantinescu Alex', 'Stoica Diana', 'Gheorghe Mihai',
            'Dumitru Ana', 'Stan Cristian', 'Marin Sofia', 'Nistor David'
        ];

        const grades = ['V', 'VI', 'VII', 'VIII'];

        return names.map((name, i) => ({
            id: `demo_${i}`,
            name: name,
            grade: grades[i % 4],
            email: '',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            isDemo: true
        }));
    },

    /**
     * Extrage datele de progres
     */
    extractProgress() {
        const progress = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.match(/learninghub_progress_/) || key.match(/_progress$/)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const profileId = key.replace('learninghub_progress_', '').replace('_progress', '');
                    progress[profileId] = data;
                } catch (e) {}
            }
        }

        // Genereaza progres demo daca e gol
        if (Object.keys(progress).length === 0) {
            this.data.students.forEach(s => {
                progress[s.id] = this.generateDemoProgress(s);
            });
        }

        return progress;
    },

    /**
     * Genereaza progres demo pentru un elev
     */
    generateDemoProgress(student) {
        const progress = {
            lessonsCompleted: [],
            quizScores: {}
        };

        const modules = [1, 2, 3];
        const lessonsPerModule = 5;
        const completionRate = 0.3 + Math.random() * 0.5; // 30-80% completare

        modules.forEach(m => {
            for (let l = 1; l <= lessonsPerModule; l++) {
                if (Math.random() < completionRate) {
                    const lessonCode = `${student.grade}-M${m}-L${String(l).padStart(2, '0')}`;
                    progress.lessonsCompleted.push(lessonCode);
                    progress.quizScores[lessonCode] = {
                        score: Math.floor(50 + Math.random() * 50),
                        total: 100,
                        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
                    };
                }
            }
        });

        return progress;
    },

    /**
     * Extrage datele de proficiency
     */
    extractProficiency() {
        const proficiency = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.match(/learninghub_proficiency_/) || key.match(/_proficiency$/)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const profileId = key.replace('learninghub_proficiency_', '').replace('_proficiency', '');
                    proficiency[profileId] = data;
                } catch (e) {}
            }
        }

        // Genereaza proficiency demo daca e gol
        if (Object.keys(proficiency).length === 0) {
            this.data.students.forEach(s => {
                proficiency[s.id] = this.generateDemoProficiency(s);
            });
        }

        return proficiency;
    },

    /**
     * Genereaza proficiency demo
     */
    generateDemoProficiency(student) {
        const proficiency = {};
        const levels = ['minim', 'standard', 'performanta'];
        const weights = [0.2, 0.5, 0.3]; // Distributie

        const progress = this.data.progress[student.id] || { lessonsCompleted: [] };

        progress.lessonsCompleted.forEach(lessonCode => {
            const rand = Math.random();
            let level = 'standard';
            if (rand < weights[0]) level = 'minim';
            else if (rand > 1 - weights[2]) level = 'performanta';

            proficiency[lessonCode] = {
                level: level,
                quiz_results: [{
                    level: level,
                    score: 50 + Math.floor(Math.random() * 50),
                    total: 100,
                    passed: true,
                    timestamp: new Date().toISOString()
                }]
            };
        });

        return proficiency;
    },

    /**
     * Construieste log de activitate
     */
    buildActivityLog() {
        const activity = [];

        this.data.students.forEach(student => {
            const progress = this.data.progress[student.id] || {};
            const proficiency = this.data.proficiency[student.id] || {};

            Object.entries(progress.quizScores || {}).forEach(([lessonCode, score]) => {
                activity.push({
                    studentId: student.id,
                    studentName: student.name,
                    action: 'quiz_complete',
                    lessonCode: lessonCode,
                    level: proficiency[lessonCode]?.level || 'standard',
                    score: score.score,
                    total: score.total,
                    timestamp: score.timestamp || new Date().toISOString()
                });
            });
        });

        // Sorteaza dupa data (cele mai recente primele)
        activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return activity.slice(0, 50); // Ultimele 50
    },

    /**
     * Render Overview Section
     */
    renderOverview() {
        // Stats
        const totalStudents = this.data.students.length;
        const totalLessons = this.data.activity.filter(a => a.action === 'quiz_complete').length;
        const passedQuizzes = this.data.activity.filter(a => a.score >= 50).length;
        const avgScore = this.data.activity.length > 0
            ? Math.round(this.data.activity.reduce((sum, a) => sum + (a.score || 0), 0) / this.data.activity.length)
            : 0;

        document.getElementById('stat-students').textContent = totalStudents;
        document.getElementById('stat-lessons').textContent = totalLessons;
        document.getElementById('stat-quizzes').textContent = passedQuizzes;
        document.getElementById('stat-avg-score').textContent = avgScore + '%';

        // Module Chart
        this.renderModuleChart();

        // Level Distribution
        this.renderLevelDistribution();

        // Recent Activity
        this.renderRecentActivity();
    },

    /**
     * Render Module Completion Chart
     */
    renderModuleChart() {
        const chartContainer = document.getElementById('module-chart');
        const labelsContainer = document.getElementById('module-labels');

        const moduleNames = ['M1', 'M2', 'M3', 'M4', 'M5'];
        const moduleCompletions = [0, 0, 0, 0, 0];
        const maxLessons = this.data.students.length * 5; // 5 lectii per modul per elev

        this.data.activity.forEach(a => {
            const match = a.lessonCode.match(/-M(\d)-/);
            if (match) {
                const moduleIndex = parseInt(match[1]) - 1;
                if (moduleIndex >= 0 && moduleIndex < 5) {
                    moduleCompletions[moduleIndex]++;
                }
            }
        });

        const maxCompletion = Math.max(...moduleCompletions, 1);

        chartContainer.innerHTML = moduleNames.map((name, i) => {
            const height = (moduleCompletions[i] / maxCompletion) * 100;
            const color = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i];
            return `
                <div class="chart-bar" style="height: ${Math.max(height, 5)}%; background: ${color};">
                    <div class="tooltip">${name}: ${moduleCompletions[i]} completari</div>
                </div>
            `;
        }).join('');

        labelsContainer.innerHTML = moduleNames.map(name => `<span>${name}</span>`).join('');
    },

    /**
     * Render Level Distribution
     */
    renderLevelDistribution() {
        const levels = { minim: 0, standard: 0, performanta: 0 };
        let total = 0;

        Object.values(this.data.proficiency).forEach(studentProf => {
            Object.values(studentProf).forEach(lesson => {
                if (lesson.level && levels.hasOwnProperty(lesson.level)) {
                    levels[lesson.level]++;
                    total++;
                }
            });
        });

        if (total === 0) total = 1;

        ['minim', 'standard', 'performanta'].forEach(level => {
            const pct = Math.round((levels[level] / total) * 100);
            document.getElementById(`level-${level}`).style.width = pct + '%';
            document.getElementById(`level-${level}-pct`).textContent = pct + '%';
        });
    },

    /**
     * Render Recent Activity Table
     */
    renderRecentActivity() {
        const tbody = document.getElementById('recent-activity');

        if (this.data.activity.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <span class="icon">📭</span>
                        <p>Nicio activitate inregistrata</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.activity.slice(0, 10).map(a => {
            const levelIcons = { minim: '🐢', standard: '📚', performanta: '🚀' };
            const scoreClass = a.score >= 80 ? 'green' : (a.score >= 50 ? 'yellow' : 'red');
            const date = new Date(a.timestamp);
            const dateStr = date.toLocaleDateString('ro-RO') + ' ' + date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

            return `
                <tr>
                    <td>${a.studentName}</td>
                    <td>Quiz completat</td>
                    <td>${a.lessonCode}</td>
                    <td><span class="proficiency-badge">${levelIcons[a.level] || '📚'} ${a.level}</span></td>
                    <td><span class="status-badge ${scoreClass}">${a.score}%</span></td>
                    <td>${dateStr}</td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Render Students Table
     */
    renderStudents() {
        const tbody = document.getElementById('students-table');

        if (this.data.students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <span class="icon">👥</span>
                        <p>Niciun elev inregistrat</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.data.students.map(student => {
            const progress = this.data.progress[student.id] || { lessonsCompleted: [] };
            const proficiency = this.data.proficiency[student.id] || {};

            const lessonsCount = progress.lessonsCompleted?.length || 0;
            const totalLessons = 25; // 5 module x 5 lectii
            const progressPct = Math.round((lessonsCount / totalLessons) * 100);

            // Nivel predominant
            const levelCounts = { minim: 0, standard: 0, performanta: 0 };
            Object.values(proficiency).forEach(p => {
                if (p.level && levelCounts.hasOwnProperty(p.level)) {
                    levelCounts[p.level]++;
                }
            });
            const mainLevel = Object.entries(levelCounts)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'standard';

            // Scor mediu
            const scores = Object.values(progress.quizScores || {}).map(s => s.score);
            const avgScore = scores.length > 0
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : 0;

            // Status
            const lastActivity = this.data.activity.find(a => a.studentId === student.id);
            const daysSinceActivity = lastActivity
                ? Math.floor((Date.now() - new Date(lastActivity.timestamp)) / (1000 * 60 * 60 * 24))
                : 999;

            let status = 'Activ';
            let statusClass = 'green';
            if (daysSinceActivity > 7) {
                status = 'Inactiv';
                statusClass = 'red';
            } else if (daysSinceActivity > 3) {
                status = 'Recent';
                statusClass = 'yellow';
            }

            const levelIcons = { minim: '🐢', standard: '📚', performanta: '🚀' };

            return `
                <tr>
                    <td><strong>${student.name}</strong>${student.isDemo ? ' <small>(demo)</small>' : ''}</td>
                    <td>${student.grade}</td>
                    <td>${lessonsCount}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="progress-bar" style="width: 100px;">
                                <div class="fill ${progressPct >= 50 ? 'green' : 'yellow'}" style="width: ${progressPct}%;"></div>
                            </div>
                            <span>${progressPct}%</span>
                        </div>
                    </td>
                    <td><span class="proficiency-badge">${levelIcons[mainLevel]} ${mainLevel}</span></td>
                    <td>${avgScore}%</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Render Lessons Grid for Grade
     */
    renderLessonsForGrade(grade) {
        const container = document.getElementById('lessons-content');

        const modules = [
            { id: 1, name: 'M1 - Sisteme de Calcul' },
            { id: 2, name: 'M2 - Aplicatii Birotice' },
            { id: 3, name: 'M3 - Procesare Text (Word)' },
            { id: 4, name: 'M4 - Siguranta Online' },
            { id: 5, name: 'M5 - Proiect Final' }
        ];

        container.innerHTML = modules.map(module => {
            const lessons = [];
            for (let i = 1; i <= 5; i++) {
                const code = `${grade}-M${module.id}-L${String(i).padStart(2, '0')}`;

                // Verifica completare pentru toti elevii
                let completed = 0;
                let inProgress = 0;

                this.data.students.filter(s => s.grade === grade).forEach(student => {
                    const progress = this.data.progress[student.id];
                    if (progress?.lessonsCompleted?.includes(code)) {
                        completed++;
                    } else if (progress?.quizScores?.[code]) {
                        inProgress++;
                    }
                });

                lessons.push({
                    code,
                    number: i,
                    completed,
                    inProgress
                });
            }

            return `
                <div class="card" style="margin-bottom: 1rem;">
                    <div class="card-header">
                        <h3>${module.name}</h3>
                    </div>
                    <div class="card-body">
                        <div class="lesson-grid">
                            ${lessons.map(l => {
                                let className = 'not-started';
                                if (l.completed > 0) className = 'completed';
                                else if (l.inProgress > 0) className = 'in-progress';

                                return `
                                    <div class="lesson-cell ${className}" title="${l.code}: ${l.completed} completate, ${l.inProgress} in progres">
                                        L${l.number}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted);">
                            <span style="display: inline-flex; align-items: center; gap: 0.25rem; margin-right: 1rem;">
                                <span style="width: 12px; height: 12px; background: var(--success); border-radius: 2px;"></span> Completat
                            </span>
                            <span style="display: inline-flex; align-items: center; gap: 0.25rem; margin-right: 1rem;">
                                <span style="width: 12px; height: 12px; background: var(--warning); border-radius: 2px;"></span> In progres
                            </span>
                            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                                <span style="width: 12px; height: 12px; background: var(--bg-secondary); border-radius: 2px;"></span> Neinceput
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render Alerts
     */
    renderAlerts() {
        const alerts = [];

        this.data.students.forEach(student => {
            const progress = this.data.progress[student.id] || {};
            const proficiency = this.data.proficiency[student.id] || {};

            // Check: Nivel minim la 3+ lectii consecutive
            const lessonsByLevel = Object.entries(proficiency)
                .filter(([k, v]) => v.level === 'minim')
                .map(([k]) => k);

            if (lessonsByLevel.length >= 3) {
                alerts.push({
                    student: student,
                    type: 'minim_level',
                    message: `${lessonsByLevel.length} lectii la nivel minim`,
                    severity: lessonsByLevel.length >= 5 ? 'critical' : 'warning'
                });
            }

            // Check: Scor sub 50% la ultimele 3 quizuri
            const quizScores = Object.values(progress.quizScores || {})
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 3);

            const lowScores = quizScores.filter(q => q.score < 50).length;
            if (lowScores >= 2) {
                alerts.push({
                    student: student,
                    type: 'low_scores',
                    message: `${lowScores} din ultimele 3 quizuri sub 50%`,
                    severity: lowScores >= 3 ? 'critical' : 'warning'
                });
            }

            // Check: Inactivitate
            const lastActivity = this.data.activity.find(a => a.studentId === student.id);
            if (lastActivity) {
                const daysSince = Math.floor((Date.now() - new Date(lastActivity.timestamp)) / (1000 * 60 * 60 * 24));
                if (daysSince > 7) {
                    alerts.push({
                        student: student,
                        type: 'inactive',
                        message: `Inactiv de ${daysSince} zile`,
                        severity: daysSince > 14 ? 'critical' : 'warning'
                    });
                }
            }
        });

        // Update count
        document.getElementById('alert-count').textContent = `${alerts.length} alerte`;

        // Render list
        const container = document.getElementById('alert-list');

        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="icon">✅</span>
                    <p>Nicio alerta activa</p>
                </div>
            `;
            return;
        }

        container.innerHTML = alerts.map(alert => {
            const icons = {
                minim_level: '🐢',
                low_scores: '📉',
                inactive: '⏰'
            };

            return `
                <div class="alert-item ${alert.severity}">
                    <span class="icon">${icons[alert.type] || '⚠️'}</span>
                    <div class="content">
                        <div class="title">${alert.student.name} (${alert.student.grade})</div>
                        <div class="desc">${alert.message}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render Storage Info
     */
    renderStorageInfo() {
        const tbody = document.getElementById('storage-table');
        const rows = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('learninghub')) {
                const value = localStorage.getItem(key);
                const size = new Blob([value]).size;
                const sizeStr = size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`;

                rows.push(`
                    <tr>
                        <td><code>${key}</code></td>
                        <td>${sizeStr}</td>
                        <td>
                            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                    onclick="TeacherDashboard.viewStorageItem('${key}')">
                                👁️ View
                            </button>
                        </td>
                    </tr>
                `);
            }
        }

        if (rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>Nicio cheie LearningHub gasita</p>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = rows.join('');
        }
    },

    /**
     * Apply Filters
     */
    applyFilters() {
        const grade = document.getElementById('filter-grade').value;
        const module = document.getElementById('filter-module').value;
        const period = document.getElementById('filter-period').value;

        // Filter activity by period
        let filteredActivity = [...this.data.activity];
        const now = Date.now();

        if (period === 'week') {
            filteredActivity = filteredActivity.filter(a =>
                now - new Date(a.timestamp) < 7 * 24 * 60 * 60 * 1000
            );
        } else if (period === 'month') {
            filteredActivity = filteredActivity.filter(a =>
                now - new Date(a.timestamp) < 30 * 24 * 60 * 60 * 1000
            );
        }

        // Filter by grade
        if (grade) {
            filteredActivity = filteredActivity.filter(a =>
                a.lessonCode.startsWith(grade + '-')
            );
        }

        // Filter by module
        if (module) {
            filteredActivity = filteredActivity.filter(a =>
                a.lessonCode.includes(`-M${module}-`)
            );
        }

        // Update stats with filtered data
        const totalLessons = filteredActivity.length;
        const passedQuizzes = filteredActivity.filter(a => a.score >= 50).length;
        const avgScore = filteredActivity.length > 0
            ? Math.round(filteredActivity.reduce((sum, a) => sum + (a.score || 0), 0) / filteredActivity.length)
            : 0;

        document.getElementById('stat-lessons').textContent = totalLessons;
        document.getElementById('stat-quizzes').textContent = passedQuizzes;
        document.getElementById('stat-avg-score').textContent = avgScore + '%';
    },

    /**
     * Refresh All Data
     */
    refreshData() {
        this.loadAllData();
        this.renderOverview();
        this.renderStudents();
        this.renderAlerts();
        this.renderStorageInfo();
        console.log('TeacherDashboard: Data refreshed');
    },

    /**
     * Export All Data
     */
    exportAll() {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            students: this.data.students.filter(s => !s.isDemo),
            progress: this.data.progress,
            proficiency: this.data.proficiency
        };

        this.downloadJSON(exportData, 'learninghub_backup_' + this.getDateStr() + '.json');
    },

    /**
     * Export Students Only
     */
    exportStudents() {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            students: this.data.students.filter(s => !s.isDemo)
        };

        this.downloadJSON(exportData, 'learninghub_students_' + this.getDateStr() + '.json');
    },

    /**
     * Export Progress Only
     */
    exportProgress() {
        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            progress: this.data.progress,
            proficiency: this.data.proficiency
        };

        this.downloadJSON(exportData, 'learninghub_progress_' + this.getDateStr() + '.json');
    },

    /**
     * Download JSON File
     */
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Get Date String for Filenames
     */
    getDateStr() {
        const d = new Date();
        return d.toISOString().split('T')[0];
    },

    /**
     * Import Data from File
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusEl = document.getElementById('import-status');
        statusEl.innerHTML = '<span style="color: var(--text-muted);">Se incarca...</span>';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate structure
                if (!data.version) {
                    throw new Error('Format invalid - lipseste versiunea');
                }

                let imported = 0;

                // Import students
                if (data.students && Array.isArray(data.students)) {
                    localStorage.setItem('learninghub_profiles', JSON.stringify(data.students));
                    imported += data.students.length;
                }

                // Import progress
                if (data.progress) {
                    Object.entries(data.progress).forEach(([profileId, progress]) => {
                        localStorage.setItem(`learninghub_progress_${profileId}`, JSON.stringify(progress));
                    });
                    imported += Object.keys(data.progress).length;
                }

                // Import proficiency
                if (data.proficiency) {
                    Object.entries(data.proficiency).forEach(([profileId, prof]) => {
                        localStorage.setItem(`learninghub_proficiency_${profileId}`, JSON.stringify(prof));
                    });
                }

                statusEl.innerHTML = `<span style="color: var(--success);">✅ Import reusit! ${imported} inregistrari.</span>`;

                // Refresh
                setTimeout(() => this.refreshData(), 1000);

            } catch (err) {
                statusEl.innerHTML = `<span style="color: var(--danger);">❌ Eroare: ${err.message}</span>`;
            }
        };

        reader.readAsText(file);
    },

    /**
     * View Storage Item
     */
    viewStorageItem(key) {
        const value = localStorage.getItem(key);
        try {
            const parsed = JSON.parse(value);
            console.log(`${key}:`, parsed);
            alert(`${key}:\n\n${JSON.stringify(parsed, null, 2).substring(0, 2000)}...`);
        } catch {
            alert(`${key}:\n\n${value}`);
        }
    },

    /**
     * Show Add Student Modal
     */
    showAddStudent() {
        document.getElementById('add-student-modal').classList.add('active');
    },

    /**
     * Close Modal
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    /**
     * Save Student
     */
    saveStudent() {
        const name = document.getElementById('student-name').value.trim();
        const grade = document.getElementById('student-grade').value;
        const email = document.getElementById('student-email').value.trim();

        if (!name) {
            alert('Te rog introdu numele elevului');
            return;
        }

        const student = {
            id: 'student_' + Date.now(),
            name: name,
            grade: grade,
            email: email,
            createdAt: new Date().toISOString()
        };

        // Get existing profiles
        let profiles = [];
        try {
            profiles = JSON.parse(localStorage.getItem('learninghub_profiles') || '[]');
        } catch {}

        profiles.push(student);
        localStorage.setItem('learninghub_profiles', JSON.stringify(profiles));

        // Clear form
        document.getElementById('student-name').value = '';
        document.getElementById('student-email').value = '';

        // Close modal and refresh
        this.closeModal('add-student-modal');
        this.refreshData();
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeacherDashboard;
}
