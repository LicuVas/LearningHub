/**
 * LearningHub Media Popup System
 * ================================
 * Shows images, GIFs, and videos in a popup modal for visual learning
 *
 * Usage in HTML:
 *   <a href="#" class="media-link" data-media="image" data-src="path/to/image.png">
 *     Click pe caseta existenta
 *   </a>
 *
 *   <a href="#" class="media-link" data-media="video" data-src="https://youtube.com/embed/xyz">
 *     Vezi cum se face
 *   </a>
 *
 *   <a href="#" class="media-link" data-media="gif" data-src="path/to/demo.gif">
 *     Animatie demo
 *   </a>
 *
 * Or use the helper function:
 *   <span onclick="MediaPopup.show('image', 'path/to/img.png', 'Click pe caseta')">
 *     Click pe caseta existenta 📷
 *   </span>
 *
 * Auto-initialization on DOMContentLoaded
 */

const MediaPopup = {
    modalElement: null,
    isInitialized: false,

    /**
     * Initialize the media popup system
     */
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Create modal element
        this.createModal();

        // Add click handlers to all media links
        this.bindMediaLinks();

        // Add keyboard handler for escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });
    },

    /**
     * Create the modal HTML structure
     */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'media-popup-modal';
        modal.className = 'media-popup-overlay';
        modal.innerHTML = `
            <div class="media-popup-container">
                <button class="media-popup-close" onclick="MediaPopup.hide()">&times;</button>
                <div class="media-popup-content">
                    <!-- Content injected dynamically -->
                </div>
                <div class="media-popup-caption"></div>
            </div>
        `;

        // Add styles
        this.addStyles();

        document.body.appendChild(modal);
        this.modalElement = modal;

        // Close when clicking overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hide();
        });
    },

    /**
     * Bind click handlers to media links
     */
    bindMediaLinks() {
        document.querySelectorAll('.media-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.dataset.media || 'image';
                const src = link.dataset.src;
                const caption = link.dataset.caption || link.textContent.trim();
                this.show(type, src, caption);
            });
        });
    },

    /**
     * Show media in popup
     * @param {string} type - 'image', 'gif', 'video', or 'youtube'
     * @param {string} src - URL to the media
     * @param {string} caption - Optional caption text
     */
    show(type, src, caption = '') {
        if (!this.modalElement) this.init();

        const contentDiv = this.modalElement.querySelector('.media-popup-content');
        const captionDiv = this.modalElement.querySelector('.media-popup-caption');

        // Clear previous content
        contentDiv.innerHTML = '';

        // Generate content based on type
        switch (type) {
            case 'image':
            case 'gif':
                contentDiv.innerHTML = `
                    <img src="${src}" alt="${caption}" class="media-popup-image"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 150%22><rect fill=%22%231a1a2e%22 width=%22200%22 height=%22150%22/><text fill=%22%2394a3b8%22 x=%22100%22 y=%2275%22 text-anchor=%22middle%22 font-size=%2214%22>Imagine indisponibila</text></svg>';">
                `;
                break;

            case 'video':
            case 'youtube':
                // Handle YouTube URLs
                let videoSrc = src;
                if (src.includes('youtube.com/watch')) {
                    const videoId = new URL(src).searchParams.get('v');
                    videoSrc = `https://www.youtube.com/embed/${videoId}`;
                } else if (src.includes('youtu.be/')) {
                    const videoId = src.split('youtu.be/')[1].split('?')[0];
                    videoSrc = `https://www.youtube.com/embed/${videoId}`;
                }

                contentDiv.innerHTML = `
                    <iframe
                        src="${videoSrc}"
                        class="media-popup-video"
                        frameborder="0"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                    </iframe>
                `;
                break;

            case 'placeholder':
                // Show a placeholder for content that will be added later
                contentDiv.innerHTML = `
                    <div class="media-popup-placeholder">
                        <div class="placeholder-icon">🎬</div>
                        <div class="placeholder-text">Continut in curand</div>
                        <div class="placeholder-subtext">${caption || 'Acest continut vizual va fi adaugat in curand.'}</div>
                    </div>
                `;
                caption = ''; // Don't show caption again
                break;

            default:
                contentDiv.innerHTML = `<p>Tip media necunoscut: ${type}</p>`;
        }

        // Set caption
        captionDiv.textContent = caption;
        captionDiv.style.display = caption ? 'block' : 'none';

        // Show modal
        this.modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Hide the popup
     */
    hide() {
        if (!this.modalElement) return;

        this.modalElement.classList.remove('active');
        document.body.style.overflow = '';

        // Clear video to stop playback
        const content = this.modalElement.querySelector('.media-popup-content');
        const iframe = content.querySelector('iframe');
        if (iframe) {
            iframe.src = '';
        }
    },

    /**
     * Add popup styles
     */
    addStyles() {
        if (document.getElementById('media-popup-styles')) return;

        const style = document.createElement('style');
        style.id = 'media-popup-styles';
        style.textContent = `
            .media-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .media-popup-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .media-popup-container {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .media-popup-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                z-index: 1;
            }

            .media-popup-close:hover {
                opacity: 1;
            }

            .media-popup-content {
                max-width: 100%;
                max-height: calc(90vh - 80px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .media-popup-image {
                max-width: 100%;
                max-height: calc(90vh - 80px);
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .media-popup-video {
                width: 80vw;
                max-width: 960px;
                height: 45vw;
                max-height: 540px;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            .media-popup-caption {
                margin-top: 1rem;
                color: var(--text-secondary, #94a3b8);
                font-size: 0.95rem;
                text-align: center;
                max-width: 600px;
            }

            .media-popup-placeholder {
                background: var(--bg-card, #1a1a2e);
                border: 2px dashed var(--border, #2d2d44);
                border-radius: 16px;
                padding: 3rem 4rem;
                text-align: center;
            }

            .placeholder-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .placeholder-text {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--text-primary, #f1f5f9);
                margin-bottom: 0.5rem;
            }

            .placeholder-subtext {
                color: var(--text-muted, #64748b);
                font-size: 0.9rem;
            }

            /* Media link styling */
            .media-link {
                color: var(--accent-cyan, #06b6d4);
                text-decoration: none;
                border-bottom: 1px dashed var(--accent-cyan, #06b6d4);
                cursor: pointer;
                transition: all 0.2s;
            }

            .media-link:hover {
                color: var(--accent-blue, #3b82f6);
                border-color: var(--accent-blue, #3b82f6);
            }

            .media-link::after {
                content: ' 📷';
                font-size: 0.85em;
            }

            .media-link[data-media="video"]::after,
            .media-link[data-media="youtube"]::after {
                content: ' 🎬';
            }

            .media-link[data-media="gif"]::after {
                content: ' 🔄';
            }

            @media (max-width: 768px) {
                .media-popup-video {
                    width: 95vw;
                    height: 53vw;
                }

                .media-popup-close {
                    top: -35px;
                    font-size: 2rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    MediaPopup.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaPopup;
}
