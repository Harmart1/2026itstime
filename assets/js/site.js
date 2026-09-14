function updateDeviceProfile(){ const width = window.visualViewport ? window.visualViewport.width : window.innerWidth; let device = "desktop"; if(width < 700) device = "mobile"; else if(width < 1100) device = "tablet"; const touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches; document.documentElement.dataset.device = device; document.documentElement.dataset.input = touch ? "touch" : "pointer"; document.documentElement.dataset.orientation = window.matchMedia && window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape"; } updateDeviceProfile(); window.addEventListener("resize", updateDeviceProfile, {passive:true}); window.addEventListener("orientationchange", updateDeviceProfile, {passive:true}); if(window.visualViewport){ window.visualViewport.addEventListener("resize", updateDeviceProfile, {passive:true}); } const amountInput = document.getElementById("contributionAmount"); document.querySelectorAll("[data-amount]").forEach(button=>{ button.addEventListener("click",()=>{ document.querySelectorAll("[data-amount]").forEach(btn=>btn.classList.remove("active")); button.classList.add("active"); if(amountInput){ amountInput.value = button.dataset.amount; amountInput.focus({preventScroll:true}); } }); }); if(amountInput){ amountInput.addEventListener("input",()=>{ document.querySelectorAll("[data-amount]").forEach(btn=>{ btn.classList.toggle("active",btn.dataset.amount===amountInput.value); }); }); } const menuButton = document.getElementById("menuButton"); const mobileMenu = document.getElementById("mobileMenu"); const body = document.body; function closeMenu(){ mobileMenu.classList.remove("open"); body.classList.remove("menu-open"); menuButton.textContent="☰"; menuButton.setAttribute("aria-expanded","false"); menuButton.setAttribute("aria-label","Open menu"); } menuButton.addEventListener("click",()=>{ const open=!mobileMenu.classList.contains("open"); mobileMenu.classList.toggle("open",open); body.classList.toggle("menu-open",open); menuButton.textContent=open?"×":"☰"; menuButton.setAttribute("aria-expanded",String(open)); menuButton.setAttribute("aria-label",open?"Close menu":"Open menu"); }); mobileMenu.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu)); document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()}); const animated=document.querySelectorAll("[data-animate]"); if("IntersectionObserver" in window){ const observer=new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add("in-view"); observer.unobserve(entry.target); } }); },{threshold:.12}); animated.forEach(el=>observer.observe(el)); } else { animated.forEach(el=>el.classList.add("in-view")); } const sections=[...document.querySelectorAll("main section[id]")]; const navLinks=[...document.querySelectorAll(".nav-link")]; if("IntersectionObserver" in window){ const navObserver=new IntersectionObserver(entries=>{ const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(!visible)return; navLinks.forEach(link=>{ const active=link.getAttribute("href")==="#"+visible.target.id; link.classList.toggle("active",active); if(active){link.setAttribute("aria-current","page");} else{link.removeAttribute("aria-current");} }); },{rootMargin:"-30% 0px -55% 0px",threshold:[0,.25,.5]}); sections.forEach(section=>navObserver.observe(section)); } function revealPolicy(targetId, smooth=true){ const details=document.getElementById(targetId); if(!details)return; document.querySelectorAll(".legal-policy").forEach(item=>{ if(item!==details)item.open=false; }); details.open=true; const summary=details.querySelector("summary"); requestAnimationFrame(()=>{ details.scrollIntoView({behavior:smooth?"smooth":"auto",block:"start"}); if(smooth){ setTimeout(()=>summary && summary.focus({preventScroll:true}),350); } }); } document.querySelectorAll("[data-open-policy]").forEach(link=>{ link.addEventListener("click",event=>{ event.preventDefault(); const targetId=link.dataset.openPolicy; history.replaceState(null,"","#"+targetId); revealPolicy(targetId,true); }); }); const initialPolicy=location.hash.replace("#",""); if(["privacy-policy","terms-of-use","copyright-permissions"].includes(initialPolicy)){ revealPolicy(initialPolicy,false); } document.querySelectorAll("[data-interest]").forEach(link=>{ link.addEventListener("click",()=>{ const select=document.getElementById("interestSelect"); if(select)select.value=link.dataset.interest; }); }); 

/* ---- bundled script block ---- */


(function(){
  "use strict";

  // Keep suggested contribution buttons accessible.
  const amountButtons = Array.from(document.querySelectorAll("[data-amount]"));
  const amountInput = document.getElementById("contributionAmount");
  amountButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      amountButtons.forEach(b=>b.setAttribute("aria-pressed", b===btn ? "true" : "false"));
    });
  });
  if(amountInput){
    amountInput.addEventListener("input", ()=>{
      amountButtons.forEach(btn=>{
        btn.setAttribute("aria-pressed", btn.dataset.amount===amountInput.value ? "true" : "false");
      });
    });
  }

  // Native mobile share; copy-link fallback on desktop.
  const share = document.getElementById("shareCampaign");
  if(share){
    share.addEventListener("click", async (event)=>{
      event.preventDefault();
      const data = {
        title: document.title,
        text: "Cynthia McCutcheon — A strong voice for Ward 2. It’s Time!",
        url: window.location.href.split("#")[0]
      };
      try{
        if(navigator.share){
          await navigator.share(data);
        }else if(navigator.clipboard && window.isSecureContext){
          await navigator.clipboard.writeText(data.url);
          const old = share.textContent;
          share.textContent = "Campaign link copied";
          setTimeout(()=>{ share.textContent = old; }, 1800);
        }else{
          window.prompt("Copy this campaign link:", data.url);
        }
      }catch(err){
        if(err && err.name !== "AbortError"){
          window.prompt("Copy this campaign link:", data.url);
        }
      }
    });
  }

  // e-Transfer completion helpers.
  const eTransferDialog = document.getElementById("etransferDialog");
  const eTransferAmount = document.getElementById("etransferAmount");
  const copyEmailButton = document.getElementById("copyEtransferEmail");
  const copyDetailsButton = document.getElementById("copyEtransferDetails");
  const closeEtransferDialog = document.getElementById("closeEtransferDialog");
  let lastContributionAmount = "";

  function formatContributionAmount(value){
    const number = Number(value);
    return Number.isFinite(number) && number > 0
      ? new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(number)
      : "Your selected amount";
  }

  function openEtransferDialog(amount){
    if(amount) lastContributionAmount = String(amount);
    if(eTransferAmount) eTransferAmount.textContent = formatContributionAmount(lastContributionAmount);
    if(eTransferDialog && typeof eTransferDialog.showModal === "function"){
      eTransferDialog.showModal();
    } else {
      alert("Send your Interac e-Transfer to 2026itstime@gmail.com. Amount: " + formatContributionAmount(lastContributionAmount));
    }
  }

  async function copyText(text, button, successLabel){
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
      }else{
        const temp=document.createElement("textarea");
        temp.value=text;
        temp.setAttribute("readonly","");
        temp.style.position="fixed";
        temp.style.opacity="0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
      }
      if(button){
        const old=button.textContent;
        button.textContent=successLabel;
        button.classList.add("copied");
        setTimeout(()=>{
          button.textContent=old;
          button.classList.remove("copied");
        },1800);
      }
    }catch(err){
      window.prompt("Copy this information:",text);
    }
  }

  copyEmailButton && copyEmailButton.addEventListener("click",()=>{
    copyText("2026itstime@gmail.com",copyEmailButton,"Email copied");
  });

  copyDetailsButton && copyDetailsButton.addEventListener("click",()=>{
    copyText(
      "Interac e-Transfer recipient: 2026itstime@gmail.com\nContribution amount: " + formatContributionAmount(lastContributionAmount),
      copyDetailsButton,
      "Details copied"
    );
  });

  closeEtransferDialog && closeEtransferDialog.addEventListener("click",()=>eTransferDialog && eTransferDialog.close());

  eTransferDialog && eTransferDialog.addEventListener("click",(event)=>{
    const box=eTransferDialog.getBoundingClientRect();
    if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom){
      eTransferDialog.close();
    }
  });

  // If a non-JavaScript FormSubmit flow returns here, present the e-Transfer
  // destination immediately.
  const query = new URLSearchParams(window.location.search);
  if(query.get("etransfer")==="ready"){
    setTimeout(()=>{
      document.getElementById("contribute")?.scrollIntoView({behavior:"smooth",block:"start"});
      openEtransferDialog("");
      history.replaceState(null,"",window.location.pathname+"#contribute");
    },250);
  }

  // Enhance FormSubmit with on-page confirmation. If the AJAX endpoint
  // is unavailable, the ordinary HTML POST remains available as a fallback.
  document.querySelectorAll('form[data-campaign-form="true"]').forEach(form=>{
    form.addEventListener("submit", async (event)=>{
      if(!form.checkValidity()) return;
      event.preventDefault();

      const isContribution = form.id === "contributionForm";
      const contributionAmount = isContribution
        ? (form.querySelector('[name="contributionAmount"]')?.value || "")
        : "";

      const status = form.querySelector(".form-status");
      const submit = form.querySelector('button[type="submit"]');
      const originalText = submit ? submit.textContent : "";

      if(status){
        status.className = "form-status";
        status.textContent = isContribution
          ? "Recording your contributor declaration…"
          : "Sending securely to the campaign…";
      }
      if(submit){
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      const endpoint = form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");
      try{
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {"Accept":"application/json"},
          body: new FormData(form)
        });
        const result = await response.json().catch(()=>({}));
        if(!response.ok || result.success === false){
          throw new Error("Submission failed");
        }

        if(isContribution){
          if(status){
            status.className = "form-status success";
            status.textContent = "Eligibility declaration received. Continue with your Interac e-Transfer.";
          }
          lastContributionAmount = contributionAmount;
          openEtransferDialog(contributionAmount);
        }else if(status){
          status.className = "form-status success";
          status.textContent = "Thank you — your message has been sent to Cynthia’s campaign.";
        }

        form.reset();
        amountButtons.forEach(b=>{
          b.classList.remove("active");
          b.setAttribute("aria-pressed","false");
        });
      }catch(err){
        if(status){
          status.className = "form-status error";
          status.innerHTML = 'The automatic submission could not be completed. You can <a href="mailto:2026itstime@gmail.com">email the campaign directly</a>, or try again.';
        }
      }finally{
        if(submit){
          submit.disabled = false;
          submit.textContent = originalText;
        }
      }
    });
  });

  // Show a polished confirmation if a standard FormSubmit POST returns to
  // https://2026itstime.com/?submitted=1.
  const submissionBanner = document.getElementById("submissionSuccessBanner");
  const closeSubmissionBanner = document.getElementById("closeSubmissionBanner");
  const launchQuery = new URLSearchParams(window.location.search);
  if(launchQuery.get("submitted")==="1" && submissionBanner){
    submissionBanner.hidden = false;
    history.replaceState(null,"",window.location.pathname+window.location.hash);
    setTimeout(()=>{ if(submissionBanner) submissionBanner.hidden = true; },8000);
  }
  closeSubmissionBanner && closeSubmissionBanner.addEventListener("click",()=>{
    submissionBanner.hidden = true;
  });

})();
