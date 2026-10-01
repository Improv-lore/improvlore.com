// =========================================================================
// IMPROVLORE QR: Minimal Engine
// Handles projector view, card click expansion, and keyboard shortcuts.
// =========================================================================

(function() {
  function init() {
    const stageModal = document.getElementById('qr-stage-modal');
    const projectorTriggers = document.querySelectorAll('.js-open-projector, .js-trigger-projector');
    const stageClose = document.getElementById('js-stage-close');
    const stageNavButtons = document.querySelectorAll('.js-stage-nav-btn');

    let currentTargetId = 'instagram';

    function updateProjector(id) {
      currentTargetId = id;
      const targetCard = document.querySelector(`.js-qr-card[data-id="${id}"]`);
      if (!targetCard || !stageModal) return;

      const title = targetCard.dataset.title || 'QR Code';
      const sub = targetCard.dataset.sub || '';
      const qrSvgHtml = targetCard.querySelector('.qr-box').innerHTML;

      const stageTitleEl = document.getElementById('js-stage-title');
      const stageSubEl = document.getElementById('js-stage-sub');
      const stageQrEl = document.getElementById('js-stage-qr');

      if (stageTitleEl) stageTitleEl.textContent = title;
      if (stageSubEl) stageSubEl.textContent = sub;
      if (stageQrEl) stageQrEl.innerHTML = qrSvgHtml;

      stageNavButtons.forEach(b => {
        b.classList.toggle('is-active', b.dataset.stageTarget === id);
      });
    }

    function openProjector(id) {
      if (!stageModal) return;
      updateProjector(id || currentTargetId || 'instagram');
      stageModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeProjector() {
      if (!stageModal) return;
      stageModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    projectorTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.target || 'instagram';
        openProjector(target);
      });
    });

    if (stageClose) {
      stageClose.addEventListener('click', closeProjector);
    }

    if (stageModal) {
      stageModal.addEventListener('click', (e) => {
        if (e.target === stageModal) closeProjector();
      });
    }

    stageNavButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.stageTarget;
        if (id) updateProjector(id);
      });
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && stageModal?.classList.contains('is-open')) {
        closeProjector();
      }
      if (stageModal?.classList.contains('is-open')) {
        if (e.key === '1') updateProjector('instagram');
        if (e.key === '2') updateProjector('whatsapp');
        if (e.key === '3') updateProjector('tickets');
      }
      if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        if (stageModal?.classList.contains('is-open')) {
          closeProjector();
        } else {
          openProjector(currentTargetId);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
