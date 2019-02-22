// tslint:disable-next-line no-any
function getAll(selector: any): HTMLElement[] {
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

export default function() {
  // navbar
  // navbar burger click event
  const burger = document.getElementById('m_nav_burger');
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      const navMenu = document.getElementById('m_nav_menu');
      if (navMenu) {
        navMenu.classList.toggle('is-active');
      }
    });
  }

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

  // tslint:disable-next-line no-any
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

  // Document events
  document.addEventListener('keydown', event => {
    const e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
      closeDropdowns();
    }
  });
}
