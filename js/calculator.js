/**
 * EMI Calculator - Vanilla JavaScript Engine & UI Interactions
 * Author: Kunal Builds (@bykunalbuilds)
 * Free & Open Source | No external libraries
 */

(function () {
  "use strict";

  // ============================================================
  // LOAN TYPE CONFIGURATIONS
  // ============================================================
  const LOAN_TYPES = {
    "home-loan": {
      label: "Home Loan EMI Calculator",
      subtitle: "Estimate your monthly home loan EMI in seconds.",
      amount:  { min: 100000,    max: 100000000, step: 50000,  default: 5000000 },
      rate:    { min: 6.5,       max: 12,        step: 0.1,    default: 8.5 },
      tenure:  { unit: "years",  min: 1,         max: 30,      step: 1, default: 20 },
      amountLabels: ["₹ 1 L", "₹ 5 Cr", "₹ 10 Cr"],
      rateLabels:   ["6.5%", "9%", "12%"],
      tenureLabels: ["1 Yr", "15 Yrs", "30 Yrs"],
    },
    "personal-loan": {
      label: "Personal Loan EMI Calculator",
      subtitle: "Estimate your monthly personal loan EMI instantly.",
      amount:  { min: 50000,     max: 5000000,   step: 10000,  default: 500000 },
      rate:    { min: 9,         max: 24,        step: 0.1,    default: 12 },
      tenure:  { unit: "years",  min: 1,         max: 7,       step: 1, default: 3 },
      amountLabels: ["₹ 50 K", "₹ 25 L", "₹ 50 L"],
      rateLabels:   ["9%", "16%", "24%"],
      tenureLabels: ["1 Yr", "4 Yrs", "7 Yrs"],
    },
    "car-loan": {
      label: "Car Loan EMI Calculator",
      subtitle: "Calculate your monthly car loan EMI with ease.",
      amount:  { min: 100000,    max: 10000000,  step: 10000,  default: 800000 },
      rate:    { min: 7,         max: 15,        step: 0.1,    default: 9 },
      tenure:  { unit: "years",  min: 1,         max: 8,       step: 1, default: 5 },
      amountLabels: ["₹ 1 L", "₹ 50 L", "₹ 1 Cr"],
      rateLabels:   ["7%", "11%", "15%"],
      tenureLabels: ["1 Yr", "4 Yrs", "8 Yrs"],
    },
    "two-wheeler-loan": {
      label: "Two-Wheeler Loan EMI Calculator",
      subtitle: "Find your monthly two-wheeler loan EMI in seconds.",
      amount:  { min: 20000,     max: 500000,    step: 5000,   default: 100000 },
      rate:    { min: 9,         max: 20,        step: 0.1,    default: 12 },
      tenure:  { unit: "months", min: 6,         max: 60,      step: 1, default: 36 },
      amountLabels: ["₹ 20 K", "₹ 2.5 L", "₹ 5 L"],
      rateLabels:   ["9%", "14%", "20%"],
      tenureLabels: ["6 Mo", "33 Mo", "60 Mo"],
    },
    "education-loan": {
      label: "Education Loan EMI Calculator",
      subtitle: "Plan your education loan repayment schedule easily.",
      amount:  { min: 50000,     max: 15000000,  step: 10000,  default: 1000000 },
      rate:    { min: 8,         max: 15,        step: 0.1,    default: 10 },
      tenure:  { unit: "years",  min: 1,         max: 15,      step: 1, default: 7 },
      amountLabels: ["₹ 50 K", "₹ 75 L", "₹ 1.5 Cr"],
      rateLabels:   ["8%", "11.5%", "15%"],
      tenureLabels: ["1 Yr", "8 Yrs", "15 Yrs"],
    },
    "gold-loan": {
      label: "Gold Loan EMI Calculator",
      subtitle: "Calculate your gold loan EMI and interest quickly.",
      amount:  { min: 10000,     max: 10000000,  step: 5000,   default: 200000 },
      rate:    { min: 8,         max: 24,        step: 0.1,    default: 10 },
      tenure:  { unit: "months", min: 3,         max: 36,      step: 1, default: 12 },
      amountLabels: ["₹ 10 K", "₹ 50 L", "₹ 1 Cr"],
      rateLabels:   ["8%", "16%", "24%"],
      tenureLabels: ["3 Mo", "19 Mo", "36 Mo"],
    },
    "business-loan": {
      label: "Business Loan EMI Calculator",
      subtitle: "Estimate your monthly business loan repayment effortlessly.",
      amount:  { min: 100000,    max: 50000000,  step: 50000,  default: 1000000 },
      rate:    { min: 11,        max: 25,        step: 0.1,    default: 14 },
      tenure:  { unit: "years",  min: 1,         max: 7,       step: 1, default: 3 },
      amountLabels: ["₹ 1 L", "₹ 2.5 Cr", "₹ 5 Cr"],
      rateLabels:   ["11%", "18%", "25%"],
      tenureLabels: ["1 Yr", "4 Yrs", "7 Yrs"],
    },
    "lap": {
      label: "Loan Against Property EMI Calculator",
      subtitle: "Calculate your loan against property monthly repayment.",
      amount:  { min: 500000,    max: 100000000, step: 100000, default: 5000000 },
      rate:    { min: 9,         max: 16,        step: 0.1,    default: 10.5 },
      tenure:  { unit: "years",  min: 1,         max: 20,      step: 1, default: 10 },
      amountLabels: ["₹ 5 L", "₹ 5 Cr", "₹ 10 Cr"],
      rateLabels:   ["9%", "12.5%", "16%"],
      tenureLabels: ["1 Yr", "10 Yrs", "20 Yrs"],
    },
  };

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const loanAmountInput    = document.getElementById("loanAmountInput");
  const loanAmountRange    = document.getElementById("loanAmountRange");
  const interestRateInput  = document.getElementById("interestRateInput");
  const interestRateRange  = document.getElementById("interestRateRange");
  const tenureInput        = document.getElementById("tenureInput");
  const tenureRange        = document.getElementById("tenureRange");

  const tenureUnitYearsBtn = document.getElementById("tenureUnitYears");
  const tenureUnitMonthsBtn= document.getElementById("tenureUnitMonths");

  // Label spans for sliders
  const amountMinLabel   = document.getElementById("amountMinLabel");
  const amountMidLabel   = document.getElementById("amountMidLabel");
  const amountMaxLabel   = document.getElementById("amountMaxLabel");
  const rateMinLabel     = document.getElementById("rateMinLabel");
  const rateMidLabel     = document.getElementById("rateMidLabel");
  const rateMaxLabel     = document.getElementById("rateMaxLabel");
  const tenureMinLabel   = document.getElementById("tenureMinLabel");
  const tenureMidLabel   = document.getElementById("tenureMidLabel");
  const tenureMaxLabel   = document.getElementById("tenureMaxLabel");

  // Output Elements
  const emiDisplay           = document.getElementById("emiDisplay");
  const principalDisplay     = document.getElementById("principalDisplay");
  const interestDisplay      = document.getElementById("interestDisplay");
  const totalPaymentDisplay  = document.getElementById("totalPaymentDisplay");
  const principalRatioDisplay= document.getElementById("principalRatioDisplay");
  const interestRatioDisplay = document.getElementById("interestRatioDisplay");

  // SVG Chart Elements
  const chartPrincipalCircle = document.getElementById("chartPrincipalCircle");
  const chartInterestCircle  = document.getElementById("chartInterestCircle");
  const chartCenterEmi       = document.getElementById("chartCenterEmi");

  // Schedule Elements
  const scheduleToggle       = document.getElementById("scheduleToggle");
  const scheduleContent      = document.getElementById("scheduleContent");
  const scheduleTableBody    = document.getElementById("scheduleTableBody");

  // Loan type heading
  const calcCardTitle        = document.getElementById("calcCardTitle");
  const calcCardSubtitle     = document.getElementById("calcCardSubtitle");

  // Mobile Drawer Elements
  const mobileHamburger = document.getElementById("mobileHamburger");
  const mobileDrawer    = document.getElementById("mobileDrawer");
  const drawerOverlay   = document.getElementById("drawerOverlay");

  // ============================================================
  // STATE
  // ============================================================
  let tenureType      = "years"; // "years" | "months"
  let currentLoanType = "home-loan";

  const CIRCLE_RADIUS   = 65;
  const CIRCUMFERENCE   = 2 * Math.PI * CIRCLE_RADIUS; // ~408.407

  // ============================================================
  // FORMATTERS
  // ============================================================
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  function formatINR(amount)        { return inrFormatter.format(amount); }
  function formatCleanNumber(num)   { return numberFormatter.format(num); }

  // ============================================================
  // SLIDER FILL
  // ============================================================
  function updateSliderFill(slider) {
    if (!slider) return;
    const min     = parseFloat(slider.min)   || 0;
    const max     = parseFloat(slider.max)   || 100;
    const val     = parseFloat(slider.value) || 0;
    const percent = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    slider.style.background = `linear-gradient(to right, #FFC800 0%, #FFC800 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
  }

  // ============================================================
  // LOAN TYPE SELECTOR
  // ============================================================
  function applyLoanType(type, loadDefaults) {
    const cfg = LOAN_TYPES[type];
    if (!cfg) return;

    currentLoanType = type;

    // Update heading and subtitle
    if (calcCardTitle)    calcCardTitle.textContent   = cfg.label;
    if (calcCardSubtitle) calcCardSubtitle.textContent = cfg.subtitle;

    // Update URL hash without scrolling
    history.replaceState(null, "", "#" + type);

    // --- Amount Slider ---
    if (loanAmountRange) {
      loanAmountRange.min   = cfg.amount.min;
      loanAmountRange.max   = cfg.amount.max;
      loanAmountRange.step  = cfg.amount.step;
    }
    if (amountMinLabel) amountMinLabel.textContent = cfg.amountLabels[0];
    if (amountMidLabel) amountMidLabel.textContent = cfg.amountLabels[1];
    if (amountMaxLabel) amountMaxLabel.textContent = cfg.amountLabels[2];

    // --- Rate Slider ---
    if (interestRateRange) {
      interestRateRange.min  = cfg.rate.min;
      interestRateRange.max  = cfg.rate.max;
      interestRateRange.step = cfg.rate.step;
    }
    if (rateMinLabel) rateMinLabel.textContent = cfg.rateLabels[0];
    if (rateMidLabel) rateMidLabel.textContent = cfg.rateLabels[1];
    if (rateMaxLabel) rateMaxLabel.textContent = cfg.rateLabels[2];

    // --- Tenure Slider ---
    tenureType = cfg.tenure.unit;
    if (tenureRange) {
      tenureRange.min  = cfg.tenure.min;
      tenureRange.max  = cfg.tenure.max;
      tenureRange.step = cfg.tenure.step;
    }
    updateTenureUnitButtons();
    updateTenureLabels(cfg);

    // --- Load defaults ---
    if (loadDefaults) {
      if (loanAmountRange) loanAmountRange.value = cfg.amount.default;
      if (loanAmountInput) loanAmountInput.value = formatCleanNumber(cfg.amount.default);
      if (interestRateRange) interestRateRange.value = cfg.rate.default;
      if (interestRateInput) interestRateInput.value = cfg.rate.default.toFixed(1);
      if (tenureRange) tenureRange.value = cfg.tenure.default;
      if (tenureInput)  tenureInput.value = cfg.tenure.default;
    } else {
      // Clamp existing values to new range
      if (loanAmountRange && loanAmountInput) {
        let av = parseFloat(loanAmountInput.value.replace(/,/g, "")) || cfg.amount.default;
        av = Math.min(cfg.amount.max, Math.max(cfg.amount.min, av));
        loanAmountRange.value = av;
        loanAmountInput.value = formatCleanNumber(av);
      }
      if (interestRateRange && interestRateInput) {
        let rv = parseFloat(interestRateInput.value) || cfg.rate.default;
        rv = Math.min(cfg.rate.max, Math.max(cfg.rate.min, rv));
        interestRateRange.value = rv;
        interestRateInput.value = rv.toFixed(1);
      }
      if (tenureRange && tenureInput) {
        let tv = parseFloat(tenureInput.value) || cfg.tenure.default;
        tv = Math.min(cfg.tenure.max, Math.max(cfg.tenure.min, tv));
        tenureRange.value = tv;
        tenureInput.value = tv;
      }
    }

    updateSliderFill(loanAmountRange);
    updateSliderFill(interestRateRange);
    updateSliderFill(tenureRange);

    // Fade-and-recalculate
    fadeResults();
    calculateEMI();
  }

  function updateTenureUnitButtons() {
    if (!tenureUnitYearsBtn || !tenureUnitMonthsBtn) return;
    if (tenureType === "years") {
      tenureUnitYearsBtn.classList.add("active");
      tenureUnitYearsBtn.setAttribute("aria-pressed", "true");
      tenureUnitMonthsBtn.classList.remove("active");
      tenureUnitMonthsBtn.setAttribute("aria-pressed", "false");
    } else {
      tenureUnitMonthsBtn.classList.add("active");
      tenureUnitMonthsBtn.setAttribute("aria-pressed", "true");
      tenureUnitYearsBtn.classList.remove("active");
      tenureUnitYearsBtn.setAttribute("aria-pressed", "false");
    }
  }

  function updateTenureLabels(cfg) {
    if (tenureMinLabel) tenureMinLabel.textContent = cfg.tenureLabels[0];
    if (tenureMidLabel) tenureMidLabel.textContent = cfg.tenureLabels[1];
    if (tenureMaxLabel) tenureMaxLabel.textContent = cfg.tenureLabels[2];
  }

  // Subtle fade on result panel when switching types
  function fadeResults() {
    const panel = document.querySelector(".calc-results");
    if (!panel) return;
    panel.style.opacity = "0.4";
    panel.style.transition = "opacity 0.25s ease";
    setTimeout(() => {
      panel.style.opacity = "1";
    }, 280);
  }

  // Pill button click + keyboard navigation
  const loanTypeBtns = document.querySelectorAll(".loan-type-btn");
  loanTypeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      loanTypeBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      applyLoanType(btn.dataset.type, true);
    });
  });

  // Arrow key navigation on tablist
  const loanTypeSelector = document.getElementById("loanTypeSelector");
  if (loanTypeSelector) {
    loanTypeSelector.addEventListener("keydown", (e) => {
      const focused = document.activeElement;
      const btns    = [...loanTypeBtns];
      const idx     = btns.indexOf(focused);
      if (idx === -1) return;
      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (idx + 1) % btns.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (idx - 1 + btns.length) % btns.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = btns.length - 1;
      }
      if (next !== -1) {
        e.preventDefault();
        btns[next].focus();
        btns[next].click();
      }
    });
  }

  // ============================================================
  // CORE EMI CALCULATION
  // ============================================================
  function calculateEMI() {
    if (!loanAmountInput || !interestRateInput || !tenureInput) return;

    const rawLoanText   = loanAmountInput.value.replace(/,/g, "").trim();
    const rawRateText   = interestRateInput.value.trim();
    const rawTenureText = tenureInput.value.trim();

    if (!rawLoanText && !rawRateText && !rawTenureText) {
      setOutputsZero();
      return;
    }

    const principal  = parseFloat(rawLoanText)   || 0;
    const annualRate = parseFloat(rawRateText)    || 0;
    const rawTenure  = parseFloat(rawTenureText)  || 0;
    const totalMonths = tenureType === "years" ? rawTenure * 12 : rawTenure;

    if (principal <= 0 || totalMonths <= 0) {
      if (emiDisplay)          emiDisplay.textContent          = "₹ 0";
      if (principalDisplay)    principalDisplay.textContent    = formatINR(principal);
      if (interestDisplay)     interestDisplay.textContent     = "₹ 0";
      if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatINR(principal);
      resetDonutChart();
      return;
    }

    let monthlyEMI = 0, totalPayment = 0, totalInterest = 0;

    if (annualRate <= 0) {
      monthlyEMI   = Math.round(principal / totalMonths);
      totalPayment  = principal;
      totalInterest = 0;
    } else {
      const monthlyRate   = annualRate / 12 / 100;
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEMI   = Math.round((principal * monthlyRate * compoundFactor) / (compoundFactor - 1));
      totalPayment  = Math.round(monthlyEMI * totalMonths);
      totalInterest = Math.max(0, totalPayment - principal);
    }

    if (emiDisplay)          emiDisplay.textContent          = formatINR(monthlyEMI);
    if (principalDisplay)    principalDisplay.textContent    = formatINR(principal);
    if (interestDisplay)     interestDisplay.textContent     = formatINR(totalInterest);
    if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatINR(totalPayment);

    const principalPercent = totalPayment > 0 ? (principal     / totalPayment) * 100 : 100;
    const interestPercent  = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    if (principalRatioDisplay) principalRatioDisplay.textContent = `(${principalPercent.toFixed(1)}%)`;
    if (interestRatioDisplay)  interestRatioDisplay.textContent  = `(${interestPercent.toFixed(1)}%)`;

    updateDonutChart(principalPercent, interestPercent, monthlyEMI);

    if (scheduleContent && scheduleContent.classList.contains("open")) {
      renderAmortizationSchedule(principal, annualRate, totalMonths, monthlyEMI);
    }
  }

  function setOutputsZero() {
    if (emiDisplay)           emiDisplay.textContent           = "₹ 0";
    if (principalDisplay)     principalDisplay.textContent     = "₹ 0";
    if (interestDisplay)      interestDisplay.textContent      = "₹ 0";
    if (totalPaymentDisplay)  totalPaymentDisplay.textContent  = "₹ 0";
    if (principalRatioDisplay)principalRatioDisplay.textContent = "(0%)";
    if (interestRatioDisplay) interestRatioDisplay.textContent  = "(0%)";
    if (chartCenterEmi)       chartCenterEmi.textContent        = "₹ 0";
    resetDonutChart();
    if (scheduleTableBody)    scheduleTableBody.innerHTML       = "";
  }

  function resetDonutChart() {
    if (!chartPrincipalCircle || !chartInterestCircle) return;
    chartPrincipalCircle.setAttribute("stroke-dasharray",  `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    chartPrincipalCircle.setAttribute("stroke-dashoffset", `${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dasharray",   `0 ${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dashoffset",  `0`);
  }

  function updateDonutChart(principalPct, interestPct, monthlyEMI) {
    if (!chartPrincipalCircle || !chartInterestCircle) return;
    chartPrincipalCircle.setAttribute("stroke-dasharray",  `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dasharray",   `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    const principalOffset   = CIRCUMFERENCE - (principalPct / 100) * CIRCUMFERENCE;
    chartPrincipalCircle.setAttribute("stroke-dashoffset", principalOffset);
    const interestDasharray = `${(interestPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const interestDashoffset= -((principalPct / 100) * CIRCUMFERENCE);
    chartInterestCircle.setAttribute("stroke-dasharray",   interestDasharray);
    chartInterestCircle.setAttribute("stroke-dashoffset",  interestDashoffset);
    if (chartCenterEmi) chartCenterEmi.textContent = formatINR(monthlyEMI);
  }

  // ============================================================
  // AMORTIZATION SCHEDULE
  // ============================================================
  function renderAmortizationSchedule(principal, annualRate, totalMonths, monthlyEMI) {
    if (!scheduleTableBody) return;
    const monthlyRate = annualRate / 12 / 100;
    let balance = principal;
    const totalYears = Math.ceil(totalMonths / 12);
    let html = "";
    let monthCounter = 0;

    for (let yr = 1; yr <= totalYears; yr++) {
      let yearlyPrincipal = 0, yearlyInterest = 0;
      const startBalance  = balance;

      for (let m = 1; m <= 12 && monthCounter < totalMonths; m++) {
        monthCounter++;
        const interestForMonth  = balance * monthlyRate;
        let principalForMonth   = monthlyEMI - interestForMonth;
        if (principalForMonth > balance || monthCounter === totalMonths) {
          principalForMonth = balance;
        }
        yearlyInterest  += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance          = Math.max(0, balance - principalForMonth);
        if (balance <= 0) break;
      }

      html += `
        <tr>
          <td>Year ${yr}</td>
          <td>${formatINR(Math.round(startBalance))}</td>
          <td>${formatINR(Math.round(yearlyPrincipal))}</td>
          <td style="color:#B8860B;">${formatINR(Math.round(yearlyInterest))}</td>
          <td>${formatINR(Math.round(balance))}</td>
        </tr>
      `;
      if (balance <= 0) break;
    }
    scheduleTableBody.innerHTML = html;
  }

  // ============================================================
  // TWO-WAY SLIDER SYNC
  // ============================================================
  function syncLoanAmount(fromRange) {
    if (!loanAmountInput || !loanAmountRange) return;
    if (fromRange) {
      loanAmountInput.value = formatCleanNumber(loanAmountRange.value);
    } else {
      let val = parseFloat(loanAmountInput.value.replace(/,/g, ""));
      if (isNaN(val) || val < 0) { calculateEMI(); return; }
      const min = parseFloat(loanAmountRange.min);
      const max = parseFloat(loanAmountRange.max);
      // Allow typing outside slider range — only clamp slider thumb
      const clamped = Math.min(max, Math.max(min, val));
      loanAmountRange.value = clamped;
    }
    updateSliderFill(loanAmountRange);
    calculateEMI();
  }

  function syncInterestRate(fromRange) {
    if (!interestRateInput || !interestRateRange) return;
    if (fromRange) {
      interestRateInput.value = parseFloat(interestRateRange.value).toFixed(1);
    } else {
      let val = parseFloat(interestRateInput.value);
      if (isNaN(val) || val < 0) { calculateEMI(); return; }
      const min = parseFloat(interestRateRange.min);
      const max = parseFloat(interestRateRange.max);
      interestRateRange.value = Math.min(max, Math.max(min, val));
    }
    updateSliderFill(interestRateRange);
    calculateEMI();
  }

  function syncTenure(fromRange) {
    if (!tenureInput || !tenureRange) return;
    if (fromRange) {
      tenureInput.value = tenureRange.value;
    } else {
      let val = parseInt(tenureInput.value, 10);
      if (isNaN(val) || val < 0) { calculateEMI(); return; }
      const min = parseInt(tenureRange.min, 10);
      const max = parseInt(tenureRange.max, 10);
      tenureRange.value = Math.min(max, Math.max(min, val));
    }
    updateSliderFill(tenureRange);
    calculateEMI();
  }

  // Manual Yr/Mo toggle (user overrides the default unit for current type)
  function setTenureUnit(type) {
    if (tenureType === type) return;
    const cfg = LOAN_TYPES[currentLoanType];
    if (!cfg) return;

    const currentVal = parseFloat(tenureInput ? tenureInput.value : 0) || cfg.tenure.default;

    tenureType = type;
    updateTenureUnitButtons();

    if (type === "years") {
      if (tenureRange) {
        tenureRange.min  = 1;
        tenureRange.max  = Math.max(cfg.tenure.max, 30);
        tenureRange.step = 1;
      }
      if (tenureMinLabel) tenureMinLabel.textContent = "1 Yr";
      if (tenureMaxLabel) tenureMaxLabel.textContent = Math.max(cfg.tenure.max, 30) + " Yrs";
      // Convert months → years
      const yrs = Math.min(30, Math.max(1, Math.round(currentVal / 12)));
      if (tenureRange) tenureRange.value = yrs;
      if (tenureInput) tenureInput.value = yrs;
    } else {
      if (tenureRange) {
        tenureRange.min  = 1;
        tenureRange.max  = 360;
        tenureRange.step = 1;
      }
      if (tenureMinLabel) tenureMinLabel.textContent = "1 Mo";
      if (tenureMaxLabel) tenureMaxLabel.textContent = "360 Mo";
      // Convert years → months
      const mos = Math.min(360, Math.max(1, Math.round(currentVal * 12)));
      if (tenureRange) tenureRange.value = mos;
      if (tenureInput) tenureInput.value = mos;
    }

    updateSliderFill(tenureRange);
    calculateEMI();
  }

  // ============================================================
  // MOBILE DRAWER
  // ============================================================
  function openDrawer() {
    if (!mobileDrawer || !drawerOverlay || !mobileHamburger) return;
    mobileDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
    mobileHamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerOverlay || !mobileHamburger) return;
    mobileDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    mobileHamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileHamburger) {
    mobileHamburger.addEventListener("click", () => {
      mobileHamburger.getAttribute("aria-expanded") === "true" ? closeDrawer() : openDrawer();
    });
  }
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-link").forEach((l) => l.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("active")) {
      closeDrawer();
      if (mobileHamburger) mobileHamburger.focus();
    }
  });

  // ============================================================
  // INTERSECTION OBSERVER — FADE-UP
  // ============================================================
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
  } else {
    document.querySelectorAll(".fade-up").forEach((el) => el.classList.add("is-visible"));
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  if (loanAmountRange && loanAmountInput) {
    loanAmountRange.addEventListener("input",  () => syncLoanAmount(true));
    loanAmountInput.addEventListener("input",  () => syncLoanAmount(false));
    loanAmountInput.addEventListener("change", () => syncLoanAmount(false));
  }
  if (interestRateRange && interestRateInput) {
    interestRateRange.addEventListener("input",  () => syncInterestRate(true));
    interestRateInput.addEventListener("input",  () => syncInterestRate(false));
    interestRateInput.addEventListener("change", () => syncInterestRate(false));
  }
  if (tenureRange && tenureInput) {
    tenureRange.addEventListener("input",  () => syncTenure(true));
    tenureInput.addEventListener("input",  () => syncTenure(false));
    tenureInput.addEventListener("change", () => syncTenure(false));
  }
  if (tenureUnitYearsBtn)  tenureUnitYearsBtn.addEventListener("click",  () => setTenureUnit("years"));
  if (tenureUnitMonthsBtn) tenureUnitMonthsBtn.addEventListener("click", () => setTenureUnit("months"));

  // Schedule accordion
  if (scheduleToggle && scheduleContent) {
    scheduleToggle.addEventListener("click", () => {
      const open = scheduleContent.classList.contains("open");
      if (open) {
        scheduleContent.classList.remove("open");
        scheduleToggle.setAttribute("aria-expanded", "false");
      } else {
        scheduleContent.classList.add("open");
        scheduleToggle.setAttribute("aria-expanded", "true");
        calculateEMI();
      }
    });
  }

  // FAQ accordions
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answer   = btn.nextElementSibling;
      document.querySelectorAll(".faq-question").forEach((b) => {
        if (b !== btn) {
          b.setAttribute("aria-expanded", "false");
          if (b.nextElementSibling) b.nextElementSibling.classList.remove("open");
        }
      });
      btn.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.classList.toggle("open", !expanded);
    });
  });

  // ============================================================
  // INIT
  // ============================================================
  document.addEventListener("DOMContentLoaded", () => {
    // Read URL hash to determine starting loan type
    const hash = window.location.hash.replace("#", "").trim();
    const startType = LOAN_TYPES[hash] ? hash : "home-loan";

    // Activate the correct pill
    loanTypeBtns.forEach((btn) => {
      const isActive = btn.dataset.type === startType;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    // Apply type with defaults
    applyLoanType(startType, true);
  });

})();
