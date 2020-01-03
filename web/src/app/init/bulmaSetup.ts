function getAll(selector: any): HTMLElement[] {
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

export function setupDropdowns() {
  // dropdowns
  const $dropdowns = getAll('.dropdown:not(.is-hoverable)');
  const closeDropdowns = () => {
    $dropdowns.forEach($el => {
      $el.classList.remove('is-active');
    });
  };

  if ($dropdowns.length > 0) {
    $dropdowns.forEach($el => {
      $el.addEventListener('click', event => {
        event.stopPropagation();
        $el.classList.toggle('is-active');
      });
    });

    document.addEventListener('click', _ => {
      closeDropdowns();
    });
  }

  document.addEventListener('keydown', event => {
    const e = event || window.event;
    if (e.keyCode === 27) {
      closeDropdowns();
    }
  });
}

export function setupModals() {
  // Modals
  const rootEl = document.documentElement as HTMLElement;
  const $modals = getAll('.modal');
  const $modalButtons = getAll('.modal-button');
  const $modalCloses = getAll(
    '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button',
  );

  if ($modalButtons.length > 0) {
    $modalButtons.forEach($el => {
      $el.addEventListener('click', () => {
        const target = $el.dataset.target;
        openModal(target);
      });
    });
  }

  if ($modalCloses.length > 0) {
    $modalCloses.forEach($el => {
      $el.addEventListener('click', () => {
        closeModals();
      });
    });
  }

  function openModal(target: any) {
    const $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    if ($target) {
      $target.classList.add('is-active');
    }
  }

  function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach($el => {
      $el.classList.remove('is-active');
    });
  }

  document.addEventListener('keydown', event => {
    const e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
    }
  });
}

export default function() {
  setupDropdowns();
  setupDropdowns();
}
