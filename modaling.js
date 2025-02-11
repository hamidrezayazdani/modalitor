/**
 * @name Modaling
 * @author HamidReza Yazdani
 * @license MIT
 * @version 1.0.0
 * @description A modern, accessible modal system with focus management, URL hash support, and rich animations
 */

const ANIMATION_DURATIONS = {
  DEFAULT: 300,
  BOUNCE: 800,
  DOOR: 600,
  ROTATE: 600,
  ROADRUNNER: 800,
  FLIP: 600,
  UNFOLD: 600
};

class Modaling {
  static instances = new Map();
  static zIndex = 1000;
  static activeModal = null;
  static scrollPosition = null;
  static scrollbarWidth = null;
  static modalCount = 0;

  constructor(options) {
    if (!options.id) {
      throw new Error('Modal ID is required');
    }

    // Return existing instance if available
    const existingInstance = Modaling.instances.get(options.id);
    if (existingInstance) {
      return existingInstance;
    }

    // Calculate scrollbar width once
    if (Modaling.scrollbarWidth === null) {
      Modaling.scrollbarWidth = this.calculateScrollbarWidth();
    }

    // Default options
    this.defaultOptions = {
      size: 'md',
      animation: 'default',
      closeOnOverlay: true,
      closeOnEscape: true,
      preventScroll: true,
      role: 'dialog',
      labelledBy: null,
      describedBy: null,
      updateUrl: true,
      hashPrefix: 'modal-',
      onShow: () => {},
      onHide: () => {}
    };

    this.options = { ...this.defaultOptions, ...options };
    this.focusedElementBeforeModal = null;
    this.isClosing = false;

    this.initializeModal();
    Modaling.instances.set(this.options.id, this);
    this.handleInitialHash();
  }

  calculateScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);

    return scrollbarWidth;
  }

  initializeModal() {
    this.createOverlay();
    this.setupModal();
    this.setupEventListeners();
    this.setupFocusTrap();
    this.setupHashChange();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modaling-overlay';
    this.overlay.setAttribute('tabindex', '-1');
    this.overlay.id = `modaling-overlay-${this.options.id}`;

    this.modal = document.getElementById(this.options.id);
    if (!this.modal) {
      throw new Error(`Modal with ID ${this.options.id} not found`);
    }

    this.modal.parentNode?.insertBefore(this.overlay, this.modal);
  }

  setupModal() {
    const { role, labelledBy, describedBy, size, animation } = this.options;

    this.modal.setAttribute('role', role);
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('tabindex', '-1');

    if (labelledBy) {
      this.modal.setAttribute('aria-labelledby', labelledBy);
    }

    if (describedBy) {
      this.modal.setAttribute('aria-describedby', describedBy);
    }

    this.modal.classList.add('modaling', `modaling-${size}`);

    if (animation !== 'none') {
      this.modal.classList.add(`animation-${animation}`);
    }
  }

  setupEventListeners() {
    this.setupCloseButton();
    this.setupOverlayClick();
    this.setupEscapeKey();
    this.setupPopState();
  }

  setupCloseButton() {
    const closeBtn = this.modal.querySelector('.modaling-close');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', 'Close modal');
      closeBtn.addEventListener('click', () => this.hide());
    }
  }

  setupOverlayClick() {
    if (this.options.closeOnOverlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay && !this.isClosing) {
          this.hide();
        }
      });
    }
  }

  setupEscapeKey() {
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible() && this.isTopModal()) {
          this.hide();
        }
      });
    }
  }

  setupFocusTrap() {
    this.modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = this.getFocusableElements();
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey && activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }

  setupHashChange() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }

  setupPopState() {
    window.addEventListener('popstate', () => {
      this.handleHashChange();
    });
  }

  handleInitialHash() {
    if (this.shouldShowBasedOnHash()) {
      this.show();
    }
  }

  shouldShowBasedOnHash() {
    const hash = window.location.hash.slice(1);
    return hash === `${this.options.hashPrefix}${this.options.id}`;
  }

  handleHashChange() {
    const shouldShow = this.shouldShowBasedOnHash();

    if (shouldShow && !this.isVisible()) {
      this.show();
    } else if (!shouldShow && this.isVisible()) {
      this.hide();
    }
  }

  updateUrlHash(show) {
    if (!this.options.updateUrl) return;

    const currentHash = window.location.hash;
    const modalHash = `#${this.options.hashPrefix}${this.options.id}`;

    if (show && currentHash !== modalHash) {
      window.history.pushState({}, '', modalHash);
    } else if (!show && currentHash === modalHash) {
      window.history.pushState({}, '', window.location.pathname + window.location.search);
    }
  }

  saveScrollPosition() {
    Modaling.scrollPosition = window.scrollY;
  }

  handleScrollLock(restore = false) {
    if (!this.options.preventScroll) return;

    if (restore) {
      Modaling.modalCount--;
      
      if (Modaling.modalCount === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        if (Modaling.scrollPosition !== null) {
          window.scrollTo(0, Modaling.scrollPosition);
          Modaling.scrollPosition = null;
        }
      }
    } else {
      if (Modaling.modalCount === 0) {
        Modaling.scrollPosition = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${Modaling.scrollbarWidth}px`;
      }
      Modaling.modalCount++;
    }
  }

  show() {
    if (this.isVisible()) return;

    this.focusedElementBeforeModal = document.activeElement;
    this.updateZIndex();

    if (Modaling.modalCount === 0) {
      this.saveScrollPosition();
    }

    this.updateUrlHash(true);
    this.showModalWithAnimation();
    this.handleScrollLock();
    this.updateAriaAttributes(false);

    Modaling.activeModal = this;
    this.options.onShow();
  }

  hide() {
    if (!this.isVisible() || this.isClosing) return;

    this.isClosing = true;
    this.modal.classList.add('closing');
    this.overlay.classList.remove('active');

    this.updateUrlHash(false);

    setTimeout(() => {
      this.completeHiding();
      this.isClosing = false;
      this.options.onHide();
    }, this.getAnimationDuration());
  }

  completeHiding() {
    this.modal.classList.remove('active', 'closing');
    this.restoreFocus();
    this.handleScrollLock(true);
    this.updateAriaAttributes(true);

    if (Modaling.activeModal === this) {
      Modaling.activeModal = null;
    }
  }

  updateZIndex() {
    Modaling.zIndex += 2;
    this.overlay.style.zIndex = String(Modaling.zIndex);
    this.modal.style.zIndex = String(Modaling.zIndex + 1);
  }

  showModalWithAnimation() {
    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
      this.modal.classList.add('active');
      this.modal.focus();
    });
  }

  getFocusableElements() {
    return Array.from(
      this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  updateAriaAttributes(hidden) {
    this.modal.setAttribute('aria-hidden', String(hidden));
  }

  restoreFocus() {
    if (this.focusedElementBeforeModal) {
      this.focusedElementBeforeModal.focus();
    }
  }

  getAnimationDuration() {
    return ANIMATION_DURATIONS[this.options.animation.toUpperCase()] || ANIMATION_DURATIONS.DEFAULT;
  }

  isTopModal() {
    const activeModals = Array.from(Modaling.instances.values())
      .filter(modal => modal.isVisible())
      .sort((a, b) => {
        return parseInt(b.modal.style.zIndex || '0') - parseInt(a.modal.style.zIndex || '0');
      });
    return activeModals[0] === this;
  }

  isVisible() {
    return this.modal.classList.contains('active');
  }

  destroy() {
    if (this.isVisible()) {
      this.hide();
    }
    this.overlay.remove();
    Modaling.instances.delete(this.options.id);
    
    if (this.isVisible()) {
      Modaling.modalCount = Math.max(0, Modaling.modalCount - 1);
    }
  }

  static getAllInstances() {
    return Modaling.instances;
  }

  static handlePageLoad() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const prefix = 'modal-';
    if (hash.startsWith(prefix)) {
      const modalId = hash.slice(prefix.length);
      const modal = Modaling.instances.get(modalId);
      if (modal) {
        modal.show();
      } else {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          const options = { id: modalId };
          const newModal = new Modaling(options);
          newModal.show();
        }
      }
    }
  }
}

// Global click handler for modal triggers
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-modal-target]');
  if (!trigger) return;

  const modalId = trigger.getAttribute('data-modal-target');
  if (!modalId) return;

  const options = {
    id: modalId,
    size: trigger.getAttribute('data-modal-size') || 'md',
    animation: trigger.getAttribute('data-modal-animation') || 'default',
    labelledBy: trigger.getAttribute('data-modal-label'),
    describedBy: trigger.getAttribute('data-modal-description'),
    role: trigger.getAttribute('data-modal-role') || 'dialog',
    updateUrl: trigger.getAttribute('data-modal-update-url') !== 'false',
    hashPrefix: trigger.getAttribute('data-modal-hash-prefix') || 'modal-'
  };

  const modal = new Modaling(options);
  modal.show();
});

// Handle initial page load
document.addEventListener('DOMContentLoaded', () => {
  Modaling.handlePageLoad();
});

// For usage in module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Modaling;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return Modaling; });
} else {
  window.Modaling = Modaling;
}