(() => {
  "use strict";

  const EMAIL = "2026itstime@gmail.com";

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    const closeMenu = () => {
      if (!menuButton || !mobileMenu) return;
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    };

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("open");
        mobileMenu.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuButton.textContent = isOpen ? "×" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });
      mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });
    }

    const navLinks = [...document.querySelectorAll(".nav-link")];
    const sections = [...document.querySelectorAll("main section[id]")];
    if ("IntersectionObserver" in window && navLinks.length && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("active", active);
          active ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, .25, .5] });
      sections.forEach((section) => observer.observe(section));
    }

    const openPolicy = (id, smooth = true) => {
      const details = document.getElementById(id);
      if (!details) return;
      document.querySelectorAll(".legal-policy").forEach((item) => {
        if (item !== details) item.open = false;
      });
      details.open = true;
      requestAnimationFrame(() => details.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
    };

    document.querySelectorAll("[data-open-policy]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const id = link.dataset.openPolicy;
        if (!id) return;
        history.replaceState(null, "", `#${id}`);
        openPolicy(id);
      });
    });

    const initialHash = location.hash.slice(1);
    if (["privacy-policy", "terms-of-use", "copyright-permissions"].includes(initialHash)) {
      openPolicy(initialHash, false);
    }

    const interestSelect = document.getElementById("interestSelect");
    const lawnSignDetails = document.getElementById("lawnSignDetails");
    const signFields = [
      document.getElementById("signAddress"),
      document.getElementById("signCity"),
      document.getElementById("signProvince"),
      document.getElementById("joinPostalCode"),
      document.getElementById("signPhone"),
      document.getElementById("signPermission")
    ].filter(Boolean);

    const syncSignFields = () => {
      const isLawnSign = interestSelect?.value === "Lawn sign";
      if (lawnSignDetails) lawnSignDetails.hidden = !isLawnSign;

      signFields.forEach((field) => {
        field.required = Boolean(isLawnSign);
        field.setAttribute("aria-required", String(Boolean(isLawnSign)));
      });
    };
    interestSelect?.addEventListener("change", syncSignFields);
    syncSignFields();
    document.querySelectorAll("[data-interest]").forEach((link) => {
      link.addEventListener("click", () => {
        if (!interestSelect) return;
        interestSelect.value = link.dataset.interest || "";
        syncSignFields();
      });
    });

    const amountInput = document.getElementById("contributionAmount");
    const amountButtons = [...document.querySelectorAll("[data-amount]")];
    const syncAmounts = () => {
      amountButtons.forEach((button) => {
        const active = button.dataset.amount === amountInput?.value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };
    amountButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (!amountInput) return;
        amountInput.value = button.dataset.amount || "";
        syncAmounts();
      });
    });
    amountInput?.addEventListener("input", syncAmounts);

    const copyText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    };

    const share = document.getElementById("shareCampaign");
    share?.addEventListener("click", async (event) => {
      event.preventDefault();
      const data = { title: document.title, text: "Cynthia McCutcheon — Ward 2", url: location.href.split("#")[0] };
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await copyText(data.url);
          const original = share.textContent;
          share.textContent = "Campaign link copied";
          setTimeout(() => share.textContent = original, 1800);
        }
      } catch (error) {
        if (error?.name !== "AbortError") window.prompt("Copy this campaign link:", data.url);
      }
    });

    const dialog = document.getElementById("etransferDialog");
    const dialogAmount = document.getElementById("etransferAmount");
    let lastAmount = "";
    const formatAmount = (value) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0
        ? new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n)
        : "Your selected amount";
    };
    const openTransfer = (amount = "") => {
      if (amount) lastAmount = String(amount);
      if (dialogAmount) dialogAmount.textContent = formatAmount(lastAmount);
      if (dialog?.showModal) {
        if (!dialog.open) dialog.showModal();
      } else {
        alert(`Send your Interac e-Transfer to ${EMAIL}. Amount: ${formatAmount(lastAmount)}`);
      }
    };
    document.getElementById("closeEtransferDialog")?.addEventListener("click", () => dialog?.close());
    document.getElementById("copyEtransferEmail")?.addEventListener("click", async (event) => {
      await copyText(EMAIL);
      const button = event.currentTarget;
      const old = button.textContent;
      button.textContent = "Email copied";
      setTimeout(() => button.textContent = old, 1600);
    });
    document.getElementById("copyEtransferDetails")?.addEventListener("click", async (event) => {
      await copyText(`Interac e-Transfer recipient: ${EMAIL}\nContribution amount: ${formatAmount(lastAmount)}`);
      const button = event.currentTarget;
      const old = button.textContent;
      button.textContent = "Details copied";
      setTimeout(() => button.textContent = old, 1600);
    });

    const submitForm = async (form) => {
      const endpoint = form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");
      const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) throw new Error("Submission failed");
    };

    document.querySelectorAll('form[data-campaign-form="true"]').forEach((form) => {
      form.addEventListener("submit", async (event) => {
        if (!form.checkValidity()) return form.reportValidity();
        event.preventDefault();
        const contribution = form.id === "contributionForm";
        const amount = contribution ? form.querySelector('[name="contributionAmount"]')?.value || "" : "";
        if (contribution && (!(Number(amount) > 0) || Number(amount) > 1200)) {
          const field = form.querySelector('[name="contributionAmount"]');
          field?.setCustomValidity("Please enter a contribution amount from $1 to $1,200.");
          field?.reportValidity();
          field?.setCustomValidity("");
          return;
        }
        const status = form.querySelector(".form-status");
        const button = form.querySelector('button[type="submit"]');
        const oldText = button?.textContent || "";
        if (status) status.textContent = contribution ? "Recording your contributor declaration…" : "Sending…";
        if (button) { button.disabled = true; button.textContent = "Sending…"; }
        try {
          await submitForm(form);
          if (status) {
            status.className = "form-status success";
            status.textContent = contribution ? "Declaration received. Continue with your e-Transfer." : "Thank you. Your message has been sent.";
          }
          form.reset();
          syncAmounts();
          syncSignFields();
          if (contribution) openTransfer(amount);
        } catch {
          // If the AJAX request is blocked or unavailable, fall back to the form's
          // normal FormSubmit POST. This still sends the submission to the campaign
          // email configured in the form action and then uses the form's _next URL.
          if (status) {
            status.className = "form-status";
            status.textContent = "Finishing your submission…";
          }
          try {
            HTMLFormElement.prototype.submit.call(form);
            return;
          } catch {
            if (status) {
              status.className = "form-status error";
              status.innerHTML = `The form could not be sent. You can <a href="mailto:${EMAIL}">email the campaign directly</a>.`;
            }
          }
        } finally {
          if (button) { button.disabled = false; button.textContent = oldText; }
        }
      });
    });

    const params = new URLSearchParams(location.search);
    if (params.get("etransfer") === "ready") {
      setTimeout(() => openTransfer(), 250);
      history.replaceState(null, "", `${location.pathname}#contribute`);
    }
    const banner = document.getElementById("submissionSuccessBanner");
    if (params.get("submitted") === "1" && banner) {
      banner.hidden = false;
      history.replaceState(null, "", location.pathname + location.hash);
      setTimeout(() => banner.hidden = true, 8000);
    }
    document.getElementById("closeSubmissionBanner")?.addEventListener("click", () => { if (banner) banner.hidden = true; });

    const contributionSection = document.getElementById("contribute");
    const mobileCta = document.querySelector(".mobile-cta");
    if (contributionSection && mobileCta && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        mobileCta.classList.toggle("is-context-hidden", entries.some((entry) => entry.isIntersecting));
      }, { threshold: .01 });
      observer.observe(contributionSection);
    }
  });
})();
