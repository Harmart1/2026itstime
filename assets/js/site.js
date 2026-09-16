(() => {
  "use strict";

  const CAMPAIGN_EMAIL = "2026itstime@gmail.com";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    /* ---------------- Device profile ---------------- */
    function updateDeviceProfile() {
      const width = window.visualViewport
        ? window.visualViewport.width
        : window.innerWidth;

      let device = "desktop";
      if (width < 700) device = "mobile";
      else if (width < 1220) device = "tablet";

      const touch =
        window.matchMedia &&
        window.matchMedia("(pointer: coarse)").matches;

      const portrait =
        window.matchMedia &&
        window.matchMedia("(orientation: portrait)").matches;

      document.documentElement.dataset.device = device;
      document.documentElement.dataset.input = touch ? "touch" : "pointer";
      document.documentElement.dataset.orientation = portrait
        ? "portrait"
        : "landscape";
    }

    updateDeviceProfile();
    window.addEventListener("resize", updateDeviceProfile, { passive: true });
    window.addEventListener("orientationchange", updateDeviceProfile, {
      passive: true,
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateDeviceProfile, {
        passive: true,
      });
    }

    /* ---------------- Mobile menu ---------------- */
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    function closeMenu() {
      if (!menuButton || !mobileMenu) return;
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    }

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        const open = !mobileMenu.classList.contains("open");
        mobileMenu.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
        menuButton.textContent = open ? "×" : "☰";
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute(
          "aria-label",
          open ? "Close menu" : "Open menu"
        );
      });

      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });
    }

    /* ---------------- Scroll-in animation ---------------- */
    const animated = document.querySelectorAll("[data-animate]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      animated.forEach((el) => observer.observe(el));
    } else {
      animated.forEach((el) => el.classList.add("in-view"));
    }

    /* ---------------- Active desktop navigation ---------------- */
    const sections = Array.from(
      document.querySelectorAll("main section[id]")
    );
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (!visible) return;

          navLinks.forEach((link) => {
            const active =
              link.getAttribute("href") === "#" + visible.target.id;
            link.classList.toggle("active", active);
            if (active) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        },
        {
          rootMargin: "-30% 0px -55% 0px",
          threshold: [0, 0.25, 0.5],
        }
      );

      sections.forEach((section) => navObserver.observe(section));
    }

    /* ---------------- Policy disclosures ---------------- */
    function revealPolicy(targetId, smooth) {
      const details = document.getElementById(targetId);
      if (!details) return;

      document.querySelectorAll(".legal-policy").forEach((item) => {
        if (item !== details) item.open = false;
      });

      details.open = true;
      const summary = details.querySelector("summary");

      window.requestAnimationFrame(() => {
        details.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "start",
        });

        if (smooth && summary) {
          window.setTimeout(() => {
            try {
              summary.focus({ preventScroll: true });
            } catch (_) {
              summary.focus();
            }
          }, 350);
        }
      });
    }

    document.querySelectorAll("[data-open-policy]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.dataset.openPolicy;
        if (!targetId) return;
        history.replaceState(null, "", "#" + targetId);
        revealPolicy(targetId, true);
      });
    });

    const initialPolicy = location.hash.replace("#", "");
    if (
      ["privacy-policy", "terms-of-use", "copyright-permissions"].includes(
        initialPolicy
      )
    ) {
      revealPolicy(initialPolicy, false);
    }

    /* ---------------- Volunteer interest shortcuts ---------------- */
    document.querySelectorAll("[data-interest]").forEach((link) => {
      link.addEventListener("click", () => {
        const select = document.getElementById("interestSelect");
        if (select) select.value = link.dataset.interest || "";
      });
    });

    /* ---------------- Contribution amount buttons ---------------- */
    const amountButtons = Array.from(
      document.querySelectorAll("[data-amount]")
    );
    const amountInput = document.getElementById("contributionAmount");

    function syncAmountButtons() {
      if (!amountInput) return;
      amountButtons.forEach((button) => {
        const active = button.dataset.amount === amountInput.value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    amountButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (!amountInput) return;
        amountInput.value = button.dataset.amount || "";
        syncAmountButtons();

        try {
          amountInput.focus({ preventScroll: true });
        } catch (_) {
          amountInput.focus();
        }
      });
    });

    if (amountInput) {
      amountInput.addEventListener("input", syncAmountButtons);
    }

    /* ---------------- Share campaign ---------------- */
    const share = document.getElementById("shareCampaign");

    async function copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    if (share) {
      share.addEventListener("click", async (event) => {
        event.preventDefault();

        const data = {
          title: document.title,
          text: "Cynthia McCutcheon — A strong voice for Ward 2. It’s Time!",
          url: window.location.href.split("#")[0],
        };

        try {
          if (navigator.share) {
            await navigator.share(data);
          } else {
            await copyToClipboard(data.url);
            const oldText = share.textContent;
            share.textContent = "Campaign link copied";
            window.setTimeout(() => {
              share.textContent = oldText;
            }, 1800);
          }
        } catch (error) {
          if (!error || error.name !== "AbortError") {
            window.prompt("Copy this campaign link:", data.url);
          }
        }
      });
    }

    /* ---------------- e-Transfer dialog ---------------- */
    const eTransferDialog = document.getElementById("etransferDialog");
    const eTransferAmount = document.getElementById("etransferAmount");
    const copyEmailButton = document.getElementById("copyEtransferEmail");
    const copyDetailsButton = document.getElementById("copyEtransferDetails");
    const closeEtransferDialog =
      document.getElementById("closeEtransferDialog");

    let lastContributionAmount = "";

    function formatContributionAmount(value) {
      const number = Number(value);
      if (!Number.isFinite(number) || number <= 0) {
        return "Your selected amount";
      }

      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(number);
    }

    function openEtransferDialog(amount) {
      if (amount) lastContributionAmount = String(amount);

      if (eTransferAmount) {
        eTransferAmount.textContent =
          formatContributionAmount(lastContributionAmount);
      }

      if (
        eTransferDialog &&
        typeof eTransferDialog.showModal === "function"
      ) {
        if (!eTransferDialog.open) eTransferDialog.showModal();
      } else {
        window.alert(
          "Send your Interac e-Transfer to " +
            CAMPAIGN_EMAIL +
            ". Amount: " +
            formatContributionAmount(lastContributionAmount)
        );
      }
    }

    async function copyText(text, button, successLabel) {
      try {
        await copyToClipboard(text);

        if (button) {
          const oldText = button.textContent;
          button.textContent = successLabel;
          button.classList.add("copied");

          window.setTimeout(() => {
            button.textContent = oldText;
            button.classList.remove("copied");
          }, 1800);
        }
      } catch (_) {
        window.prompt("Copy this information:", text);
      }
    }

    if (copyEmailButton) {
      copyEmailButton.addEventListener("click", () => {
        copyText(CAMPAIGN_EMAIL, copyEmailButton, "Email copied");
      });
    }

    if (copyDetailsButton) {
      copyDetailsButton.addEventListener("click", () => {
        copyText(
          "Interac e-Transfer recipient: " +
            CAMPAIGN_EMAIL +
            "\nContribution amount: " +
            formatContributionAmount(lastContributionAmount),
          copyDetailsButton,
          "Details copied"
        );
      });
    }

    if (closeEtransferDialog && eTransferDialog) {
      closeEtransferDialog.addEventListener("click", () => {
        eTransferDialog.close();
      });
    }

    if (eTransferDialog) {
      eTransferDialog.addEventListener("click", (event) => {
        const box = eTransferDialog.getBoundingClientRect();
        const outside =
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom;

        if (outside) eTransferDialog.close();
      });
    }

    /* ---------------- Form submission ---------------- */
    async function submitWithFormSubmit(form) {
      const endpoint = form.action.replace(
        "https://formsubmit.co/",
        "https://formsubmit.co/ajax/"
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (_) {
        result = {};
      }

      if (!response.ok || result.success === false) {
        throw new Error("Submission failed");
      }

      return result;
    }

    document
      .querySelectorAll('form[data-campaign-form="true"]')
      .forEach((form) => {
        form.addEventListener("submit", async (event) => {
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }

          event.preventDefault();

          const isContribution = form.id === "contributionForm";
          const contributionField = isContribution
            ? form.querySelector('[name="contributionAmount"]')
            : null;
          const contributionAmount = contributionField
            ? contributionField.value
            : "";

          if (isContribution) {
            const numericAmount = Number(contributionAmount);
            if (
              !Number.isFinite(numericAmount) ||
              numericAmount <= 0 ||
              numericAmount > 1200
            ) {
              if (contributionField) {
                contributionField.setCustomValidity(
                  "Please enter a contribution amount from $1 to $1,200."
                );
                contributionField.reportValidity();
                contributionField.setCustomValidity("");
              }
              return;
            }
          }

          const status = form.querySelector(".form-status");
          const submit = form.querySelector('button[type="submit"]');
          const originalText = submit ? submit.textContent : "";

          if (status) {
            status.className = "form-status";
            status.textContent = isContribution
              ? "Recording your contributor declaration…"
              : "Sending securely to the campaign…";
          }

          if (submit) {
            submit.disabled = true;
            submit.textContent = "Sending…";
          }

          try {
            await submitWithFormSubmit(form);

            if (isContribution) {
              if (status) {
                status.className = "form-status success";
                status.textContent =
                  "Eligibility declaration received. Continue with your Interac e-Transfer.";
              }

              lastContributionAmount = contributionAmount;
              form.reset();
              syncAmountButtons();
              openEtransferDialog(contributionAmount);
            } else {
              if (status) {
                status.className = "form-status success";
                status.textContent =
                  "Thank you — your message has been sent to Cynthia’s campaign.";
              }
              form.reset();
            }
          } catch (error) {
            if (status) {
              status.className = "form-status error";
              status.innerHTML =
                'The automatic submission could not be completed. You can <a href="mailto:' +
                CAMPAIGN_EMAIL +
                '">email the campaign directly</a>, or try again.';
            }
          } finally {
            if (submit) {
              submit.disabled = false;
              submit.textContent = originalText;
            }
          }
        });
      });

    /* ---------------- Return-flow handling ---------------- */
    const query = new URLSearchParams(window.location.search);

    if (query.get("etransfer") === "ready") {
      window.setTimeout(() => {
        const contributionSection =
          document.getElementById("contribute");
        if (contributionSection) {
          contributionSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        openEtransferDialog("");
        history.replaceState(
          null,
          "",
          window.location.pathname + "#contribute"
        );
      }, 250);
    }

    const submissionBanner =
      document.getElementById("submissionSuccessBanner");
    const closeSubmissionBanner =
      document.getElementById("closeSubmissionBanner");

    if (query.get("submitted") === "1" && submissionBanner) {
      submissionBanner.hidden = false;
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.hash
      );

      window.setTimeout(() => {
        if (submissionBanner) submissionBanner.hidden = true;
      }, 8000);
    }

    if (closeSubmissionBanner && submissionBanner) {
      closeSubmissionBanner.addEventListener("click", () => {
        submissionBanner.hidden = true;
      });
    }

    /* ---------------- Mobile CTA overlap prevention ---------------- */
    const contributionSection = document.getElementById("contribute");
    const mobileCta = document.querySelector(".mobile-cta");

    if (
      contributionSection &&
      mobileCta &&
      "IntersectionObserver" in window
    ) {
      const ctaObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          mobileCta.classList.toggle("is-context-hidden", visible);
        },
        {
          root: null,
          rootMargin: "-8% 0px -8% 0px",
          threshold: 0.01,
        }
      );

      ctaObserver.observe(contributionSection);
    }
  });
})();
