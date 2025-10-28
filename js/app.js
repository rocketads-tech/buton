document.addEventListener("DOMContentLoaded", () => {
  // ====== ACCORDION =========
  const accordionItems = document.querySelectorAll(".accordion-item.active");
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const body = item.querySelector(".accordion-body");
      if (body) {
        body.classList.add("accordion-body-open");
      }
    });

    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.parentElement;
        if (!item) return;
        const body = item.querySelector(".accordion-body");
        if (!body) return;
        const isActive = item.classList.contains("active");

        document.querySelectorAll(".accordion-item").forEach((el) => {
          el.classList.remove("active");
          const elBody = el.querySelector(".accordion-body");
          if (elBody) elBody.classList.remove("accordion-body-open");
        });

        if (!isActive) {
          item.classList.add("active");
          body.classList.add("accordion-body-open");
        }
      });
    });
  }

  // ====== FILTERS BUTTON HOVER EFFECT =========
  const filtersBtns = document.getElementById("filtersBtns");
  if (filtersBtns) {
    const applyButton = filtersBtns.querySelector(".filters__btn--apply");
    const resetButton = filtersBtns.querySelector(".filters__btn--reset");

    if (applyButton && resetButton) {
      function swapBackgrounds() {
        const bg1 = window.getComputedStyle(applyButton).backgroundColor;
        const bg2 = window.getComputedStyle(resetButton).backgroundColor;
        applyButton.style.backgroundColor = bg2;
        resetButton.style.backgroundColor = bg1;
      }

      applyButton.addEventListener("mouseenter", swapBackgrounds);
      resetButton.addEventListener("mouseenter", swapBackgrounds);
      filtersBtns.addEventListener("mouseleave", swapBackgrounds);
    }
  }

  // ====== FILTER ITEMS ACTIVE TOGGLE =========
  const filterLinks = document.querySelectorAll(".filters-block__item_link");
  if (filterLinks.length > 0) {
    filterLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // e.preventDefault(); // если не нужен переход
        filterLinks.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // ====== FILTER CHECKBOXES TOGGLE =========
  const filterBlocks = document.querySelectorAll(".filters-block");
  if (filterBlocks.length > 0) {
    filterBlocks.forEach((block) => {
      const checkAll = block.querySelector(
        '.check-block__input[name="check_all"]'
      );
      if (!checkAll) return;

      const otherCheckboxes = block.querySelectorAll(
        '.check-block__input:not([name="check_all"])'
      );

      checkAll.addEventListener("change", () => {
        otherCheckboxes.forEach((cb) => (cb.checked = checkAll.checked));
      });

      otherCheckboxes.forEach((cb) => {
        cb.addEventListener("change", () => {
          checkAll.checked = Array.from(otherCheckboxes).every(
            (c) => c.checked
          );
        });
      });
    });

    const resetBtn = document.getElementById("filtersReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll(
          '#filters .check-block__input[type="checkbox"]'
        );
        checkboxes.forEach((cb) => (cb.checked = false));
      });
    }
  }

  // ====== PAGINATION =========
  const cards = document.querySelectorAll(".product-card");
  const paginationEl = document.getElementById("pagination");
  const paginationList = document.getElementById("paginationList");
  const prevBtn = document.querySelector(".pagination__btn--prev");
  const nextBtn = document.querySelector(".pagination__btn--next");

  if (
    cards.length > 0 &&
    paginationEl &&
    paginationList &&
    prevBtn &&
    nextBtn
  ) {
    const cardsPerPage = parseInt(paginationEl.dataset.cardsPerPage) || 9;
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    if (totalPages <= 1) {
      paginationEl.classList.add("pagination--hidden");
    } else {
      let currentPage = 1;

      function showPage(page) {
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        cards.forEach((card) => card.classList.add("product-card--invisible"));

        setTimeout(() => {
          cards.forEach((card, index) => {
            if (index >= start && index < end) {
              card.classList.remove("product-card--hidden");
              card.classList.add("product-card--invisible");
            } else {
              card.classList.add("product-card--hidden");
            }
          });

          requestAnimationFrame(() => {
            cards.forEach((card, index) => {
              if (index >= start && index < end) {
                card.classList.remove("product-card--invisible");
              }
            });
          });
        }, 400);
      }

      function renderPagination() {
        paginationList.innerHTML = "";

        if (totalPages <= 1) return;

        const createButton = (page, text, isActive = false) => {
          const li = document.createElement("li");
          li.className = "pagination__item";
          const link = document.createElement("button");
          link.className = `pagination__link${
            isActive ? " pagination__link--active" : ""
          }`;
          link.textContent = text;
          link.setAttribute("aria-label", `Страница ${page}`);
          link.addEventListener("click", () => goToPage(page));
          li.appendChild(link);
          return li;
        };

        const createEllipsis = () => {
          const li = document.createElement("li");
          li.className = "pagination__item";
          li.textContent = "...";
          li.setAttribute("aria-hidden", "true");
          return li;
        };

        // Всегда: страница 1
        paginationList.appendChild(createButton(1, "1", currentPage === 1));

        if (totalPages === 2) {
          // Просто 1 и 2
          paginationList.appendChild(createButton(2, "2", currentPage === 2));
        } else {
          // totalPages >= 3

          // Всегда: страница 2
          paginationList.appendChild(createButton(2, "2", currentPage === 2));

          // Многоточие после 2, если текущая страница > 3
          if (currentPage > 3) {
            paginationList.appendChild(createEllipsis());
          }

          // Текущая страница, если она не 1, не 2 и не последняя
          if (currentPage > 2 && currentPage < totalPages) {
            paginationList.appendChild(
              createButton(currentPage, String(currentPage), true)
            );
          }

          // Многоточие перед последней, если текущая < totalPages - 1
          if (currentPage < totalPages - 1) {
            paginationList.appendChild(createEllipsis());
          }

          // Всегда: последняя страница
          paginationList.appendChild(
            createButton(
              totalPages,
              String(totalPages),
              currentPage === totalPages
            )
          );
        }
      }

      function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        showPage(currentPage);
        renderPagination();
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
      }

      prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
      nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

      showPage(currentPage);
      renderPagination();
      prevBtn.disabled = true;
      nextBtn.disabled = totalPages === 1;
    }
  }

  // ====== PRODUCT SLIDER (SWIPER) =========
  const mainSliderEl = document.querySelector(".product-slider-main");
  const thumbsSliderEl = document.querySelector(".product-slider-thumbs");

  if (mainSliderEl && thumbsSliderEl && typeof Swiper !== "undefined") {
    const thumbsSlider = new Swiper(".product-slider-thumbs", {
      spaceBetween: 8,
      slidesPerView: "auto",
      watchSlidesProgress: true,
      freeMode: true,
      touchRatio: 1,
      touchAngle: 45,
    });

    new Swiper(".product-slider-main", {
      thumbs: {
        swiper: thumbsSlider,
      },
    });
  }
});

// ===== MOBILE MENU =====

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menu = document.querySelector(".mobile-menu");

  // Проверка: есть ли мобильное меню на странице
  if (!menu) return;

  const backdrop = menu.querySelector(".mobile-menu__backdrop");
  const closeBtn = menu.querySelector(".mobile-menu__close");

  // Открытие: предположим, у тебя есть кнопка с классом .menu-toggle
  const openButtons = document.querySelectorAll(".menu-toggle");

  // Если нет кнопок открытия — выходим
  if (openButtons.length === 0 && !backdrop && !closeBtn) return;

  const closeButtons = [];
  if (backdrop) closeButtons.push(backdrop);
  if (closeBtn) closeButtons.push(closeBtn);

  const openMenu = () => {
    body.classList.add("mobile-menu--open");
    menu.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    body.classList.remove("mobile-menu--open");
    menu.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", openMenu);
  });

  closeButtons.forEach((el) => {
    el.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("mobile-menu--open")) {
      closeMenu();
    }
  });
});

// ===== COUNTER =====
document.querySelectorAll(".counter").forEach((counter) => {
  const minusBtn = counter.querySelector(".counter__btn--minus");
  const plusBtn = counter.querySelector(".counter__btn--plus");
  const valueEl = counter.querySelector(".counter__value");

  if (!minusBtn || !plusBtn || !valueEl) return;

  minusBtn.addEventListener("mouseenter", () => {
    counter.classList.add("counter--hover-minus");
  });
  minusBtn.addEventListener("mouseleave", () => {
    counter.classList.remove("counter--hover-minus");
  });

  plusBtn.addEventListener("mouseenter", () => {
    counter.classList.add("counter--hover-plus");
  });
  plusBtn.addEventListener("mouseleave", () => {
    counter.classList.remove("counter--hover-plus");
  });
});

// ========= MOBILE FILTERS ========

const filtersBtn = document.querySelector(".filters-show-btn");
// Добавлена проверка
if (filtersBtn) {
  const filtersSidebar = document.querySelector(".section-layout__sidebar");
  const buttonIcon = filtersBtn.querySelector(".button__icon");

  if (filtersSidebar) {
    filtersBtn.addEventListener("click", () => {
      filtersSidebar.classList.toggle("filters-show");
      if (buttonIcon) {
        buttonIcon.classList.toggle("filters-open");
      }
    });
  }
}
