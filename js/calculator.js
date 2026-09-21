/**
 * EMI Calculator - Vanilla JavaScript Engine & UI Interactions
 * Author: Kunal Builds (@bykunalbuilds)
 * Free & Open Source | No external libraries
 */

(function () {
  "use strict";

  // Elements
  const loanAmountInput = document.getElementById("loanAmountInput");
  const loanAmountRange = document.getElementById("loanAmountRange");
  const interestRateInput = document.getElementById("interestRateInput");
  const interestRateRange = document.getElementById("interestRateRange");
  const tenureInput = document.getElementById("tenureInput");
  const tenureRange = document.getElementById("tenureRange");
  
  const tenureUnitYearsBtn = document.getElementById("tenureUnitYears");
  const tenureUnitMonthsBtn = document.getElementById("tenureUnitMonths");
  const tenureMinLabel = document.getElementById("tenureMinLabel");
  const tenureMaxLabel = document.getElementById("tenureMaxLabel");

  // Output Elements
  const emiDisplay = document.getElementById("emiDisplay");
  const principalDisplay = document.getElementById("principalDisplay");
  const interestDisplay = document.getElementById("interestDisplay");
  const totalPaymentDisplay = document.getElementById("totalPaymentDisplay");
  const principalRatioDisplay = document.getElementById("principalRatioDisplay");
  const interestRatioDisplay = document.getElementById("interestRatioDisplay");

  // SVG Chart Elements
  const chartPrincipalCircle = document.getElementById("chartPrincipalCircle");
  const chartInterestCircle = document.getElementById("chartInterestCircle");
  const chartCenterEmi = document.getElementById("chartCenterEmi");

  // Schedule Elements
  const scheduleToggle = document.getElementById("scheduleToggle");
  const scheduleContent = document.getElementById("scheduleContent");
  const scheduleTableBody = document.getElementById("scheduleTableBody");

  // Mobile Drawer Elements
  const mobileHamburger = document.getElementById("mobileHamburger");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");

  // State
  let tenureType = "years"; // "years" or "months"
  const CIRCLE_RADIUS = 65;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~408.407

  // INR Formatter
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  function formatINR(amount) {
    return inrFormatter.format(amount);
  }

  function formatCleanNumber(num) {
    return numberFormatter.format(num);
  }

  // Update slider track fill with Bright Yellow (#FFC800)
  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percent = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    slider.style.background = `linear-gradient(to right, #FFC800 0%, #FFC800 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
  }

  // Core Calculation Function
  function calculateEMI() {
    if (!loanAmountInput || !interestRateInput || !tenureInput) return;

    // Check if user has entered values
    const rawLoanText = loanAmountInput.value.replace(/,/g, "").trim();
    const rawRateText = interestRateInput.value.trim();
    const rawTenureText = tenureInput.value.trim();

    // If inputs are empty, display clean zero state
    if (!rawLoanText && !rawRateText && !rawTenureText) {
      if (emiDisplay) emiDisplay.textContent = "₹ 0";
      if (principalDisplay) principalDisplay.textContent = "₹ 0";
      if (interestDisplay) interestDisplay.textContent = "₹ 0";
      if (totalPaymentDisplay) totalPaymentDisplay.textContent = "₹ 0";
      if (principalRatioDisplay) principalRatioDisplay.textContent = "(0%)";
      if (interestRatioDisplay) interestRatioDisplay.textContent = "(0%)";
      if (chartCenterEmi) chartCenterEmi.textContent = "₹ 0";
      resetDonutChart();
      if (scheduleTableBody) scheduleTableBody.innerHTML = "";
      return;
    }

    const principal = parseFloat(rawLoanText) || 0;
    const annualRate = parseFloat(rawRateText) || 0;
    const rawTenure = parseFloat(rawTenureText) || 0;

    // Convert tenure to total months
    const totalMonths = tenureType === "years" ? rawTenure * 12 : rawTenure;

    if (principal <= 0 || totalMonths <= 0) {
      if (emiDisplay) emiDisplay.textContent = "₹ 0";
      if (principalDisplay) principalDisplay.textContent = formatINR(principal);
      if (interestDisplay) interestDisplay.textContent = "₹ 0";
      if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatINR(principal);
      resetDonutChart();
      return;
    }

    let monthlyEMI = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (annualRate <= 0) {
      // 0% Interest Case
      monthlyEMI = Math.round(principal / totalMonths);
      totalPayment = principal;
      totalInterest = 0;
    } else {
      // Monthly interest rate
      const monthlyRate = annualRate / 12 / 100;
      // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEMI = Math.round(
        (principal * monthlyRate * compoundFactor) / (compoundFactor - 1)
      );
      totalPayment = Math.round(monthlyEMI * totalMonths);
      totalInterest = Math.max(0, totalPayment - principal);
    }

    // Update Text Displays
    if (emiDisplay) emiDisplay.textContent = formatINR(monthlyEMI);
    if (principalDisplay) principalDisplay.textContent = formatINR(principal);
    if (interestDisplay) interestDisplay.textContent = formatINR(totalInterest);
    if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatINR(totalPayment);

    // Calculate Percentages
    const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
    const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    if (principalRatioDisplay) principalRatioDisplay.textContent = `(${principalPercent.toFixed(1)}%)`;
    if (interestRatioDisplay) interestRatioDisplay.textContent = `(${interestPercent.toFixed(1)}%)`;

    // Update SVG Donut Chart
    updateDonutChart(principalPercent, interestPercent, monthlyEMI);

    // Update Amortization Table if open
    if (scheduleContent && scheduleContent.classList.contains("open")) {
      renderAmortizationSchedule(principal, annualRate, totalMonths, monthlyEMI);
    }
  }

  function resetDonutChart() {
    if (!chartPrincipalCircle || !chartInterestCircle) return;
    chartPrincipalCircle.setAttribute("stroke-dasharray", `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    chartPrincipalCircle.setAttribute("stroke-dashoffset", `${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dasharray", `0 ${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dashoffset", `0`);
  }

  // Update SVG Donut Chart
  function updateDonutChart(principalPct, interestPct, monthlyEMI) {
    if (!chartPrincipalCircle || !chartInterestCircle) return;

    chartPrincipalCircle.setAttribute("stroke-dasharray", `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dasharray", `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);

    const principalOffset = CIRCUMFERENCE - (principalPct / 100) * CIRCUMFERENCE;

    chartPrincipalCircle.setAttribute("stroke-dashoffset", principalOffset);

    const interestDasharray = `${(interestPct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const interestDashoffset = -((principalPct / 100) * CIRCUMFERENCE);
    chartInterestCircle.setAttribute("stroke-dasharray", interestDasharray);
    chartInterestCircle.setAttribute("stroke-dashoffset", interestDashoffset);

    if (chartCenterEmi) {
      chartCenterEmi.textContent = formatINR(monthlyEMI);
    }
  }

  // Yearly Amortization Schedule
  function renderAmortizationSchedule(principal, annualRate, totalMonths, monthlyEMI) {
    if (!scheduleTableBody) return;

    const monthlyRate = annualRate / 12 / 100;
    let balance = principal;
    const totalYears = Math.ceil(totalMonths / 12);
    let html = "";
    let monthCounter = 0;

    for (let yr = 1; yr <= totalYears; yr++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      const startBalance = balance;

      for (let m = 1; m <= 12 && monthCounter < totalMonths; m++) {
        monthCounter++;
        const interestForMonth = balance * monthlyRate;
        let principalForMonth = monthlyEMI - interestForMonth;

        if (principalForMonth > balance || monthCounter === totalMonths) {
          principalForMonth = balance;
        }

        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance = Math.max(0, balance - principalForMonth);

        if (balance <= 0) break;
      }

      html += `
        <tr>
          <td>Year ${yr}</td>
          <td>${formatINR(Math.round(startBalance))}</td>
          <td>${formatINR(Math.round(yearlyPrincipal))}</td>
          <td style="color: #B8860B;">${formatINR(Math.round(yearlyInterest))}</td>
          <td>${formatINR(Math.round(balance))}</td>
        </tr>
      `;

      if (balance <= 0) break;
    }

    scheduleTableBody.innerHTML = html;
  }

  // Two-way synchronization for Loan Amount
  function syncLoanAmount(fromRange) {
    if (!loanAmountInput || !loanAmountRange) return;
    if (fromRange) {
      loanAmountInput.value = formatCleanNumber(loanAmountRange.value);
    } else {
      let val = parseFloat(loanAmountInput.value.replace(/,/g, ""));
      if (isNaN(val)) {
        calculateEMI();
        return;
      }
      const min = parseFloat(loanAmountRange.min);
      const max = parseFloat(loanAmountRange.max);
      if (val > max) val = max;
      if (val < min) val = min;
      loanAmountRange.value = val;
      loanAmountInput.value = formatCleanNumber(val);
    }
    updateSliderFill(loanAmountRange);
    calculateEMI();
  }

  // Two-way synchronization for Interest Rate
  function syncInterestRate(fromRange) {
    if (!interestRateInput || !interestRateRange) return;
    if (fromRange) {
      interestRateInput.value = parseFloat(interestRateRange.value).toFixed(1);
    } else {
      let val = parseFloat(interestRateInput.value);
      if (isNaN(val)) {
        calculateEMI();
        return;
      }
      const min = parseFloat(interestRateRange.min);
      const max = parseFloat(interestRateRange.max);
      if (val > max) val = max;
      if (val < min) val = min;
      interestRateRange.value = val;
    }
    updateSliderFill(interestRateRange);
    calculateEMI();
  }

  // Two-way synchronization for Tenure
  function syncTenure(fromRange) {
    if (!tenureInput || !tenureRange) return;
    if (fromRange) {
      tenureInput.value = tenureRange.value;
    } else {
      let val = parseInt(tenureInput.value, 10);
      if (isNaN(val)) {
        calculateEMI();
        return;
      }
      const min = parseInt(tenureRange.min, 10);
      const max = parseInt(tenureRange.max, 10);
      if (val > max) val = max;
      if (val < min) val = min;
      tenureRange.value = val;
      tenureInput.value = val;
    }
    updateSliderFill(tenureRange);
    calculateEMI();
  }

  // Switch tenure unit (Years <-> Months)
  function setTenureUnit(type) {
    if (tenureType === type || !tenureRange || !tenureInput) return;
    tenureType = type;

    if (type === "years") {
      if (tenureUnitYearsBtn) {
        tenureUnitYearsBtn.classList.add("active");
        tenureUnitYearsBtn.setAttribute("aria-pressed", "true");
      }
      if (tenureUnitMonthsBtn) {
        tenureUnitMonthsBtn.classList.remove("active");
        tenureUnitMonthsBtn.setAttribute("aria-pressed", "false");
      }

      tenureRange.min = "1";
      tenureRange.max = "30";
      tenureRange.step = "1";
      if (tenureMinLabel) tenureMinLabel.textContent = "1 Yr";
      if (tenureMaxLabel) tenureMaxLabel.textContent = "30 Yrs";

      if (tenureInput.value) {
        const currentMonths = parseFloat(tenureRange.value) || 60;
        const convertedYears = Math.min(30, Math.max(1, Math.round(currentMonths / 12)));
        tenureRange.value = convertedYears;
        tenureInput.value = convertedYears;
      }
    } else {
      if (tenureUnitMonthsBtn) {
        tenureUnitMonthsBtn.classList.add("active");
        tenureUnitMonthsBtn.setAttribute("aria-pressed", "true");
      }
      if (tenureUnitYearsBtn) {
        tenureUnitYearsBtn.classList.remove("active");
        tenureUnitYearsBtn.setAttribute("aria-pressed", "false");
      }

      tenureRange.min = "6";
      tenureRange.max = "360";
      tenureRange.step = "1";
      if (tenureMinLabel) tenureMinLabel.textContent = "6 Mo";
      if (tenureMaxLabel) tenureMaxLabel.textContent = "360 Mo";

      if (tenureInput.value) {
        const currentYears = parseFloat(tenureRange.value) || 5;
        const convertedMonths = Math.min(360, Math.max(6, currentYears * 12));
        tenureRange.value = convertedMonths;
        tenureInput.value = convertedMonths;
      }
    }

    updateSliderFill(tenureRange);
    calculateEMI();
  }

  // ==========================================================================
  // MOBILE DRAWER INTERACTIONS
  // ==========================================================================

  function openDrawer() {
    if (!mobileDrawer || !drawerOverlay || !mobileHamburger) return;
    mobileDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
    mobileHamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // Lock background scroll
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerOverlay || !mobileHamburger) return;
    mobileDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    mobileHamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = ""; // Restore background scroll
  }

  if (mobileHamburger) {
    mobileHamburger.addEventListener("click", () => {
      const isExpanded = mobileHamburger.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll(".drawer-link");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("active")) {
      closeDrawer();
      if (mobileHamburger) mobileHamburger.focus();
    }
  });

  // ==========================================================================
  // SCROLL FADE-UP ANIMATIONS (IntersectionObserver)
  // ==========================================================================

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    document.querySelectorAll(".fade-up").forEach((el) => {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    document.querySelectorAll(".fade-up").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  // ==========================================================================
  // EVENT LISTENERS FOR CALCULATOR
  // ==========================================================================

  if (loanAmountRange && loanAmountInput) {
    loanAmountRange.addEventListener("input", () => syncLoanAmount(true));
    loanAmountInput.addEventListener("input", () => syncLoanAmount(false));
    loanAmountInput.addEventListener("change", () => syncLoanAmount(false));
  }

  if (interestRateRange && interestRateInput) {
    interestRateRange.addEventListener("input", () => syncInterestRate(true));
    interestRateInput.addEventListener("input", () => syncInterestRate(false));
    interestRateInput.addEventListener("change", () => syncInterestRate(false));
  }

  if (tenureRange && tenureInput) {
    tenureRange.addEventListener("input", () => syncTenure(true));
    tenureInput.addEventListener("input", () => syncTenure(false));
    tenureInput.addEventListener("change", () => syncTenure(false));
  }

  if (tenureUnitYearsBtn && tenureUnitMonthsBtn) {
    tenureUnitYearsBtn.addEventListener("click", () => setTenureUnit("years"));
    tenureUnitMonthsBtn.addEventListener("click", () => setTenureUnit("months"));
  }

  // Amortization Schedule Accordion Toggle
  if (scheduleToggle && scheduleContent) {
    scheduleToggle.addEventListener("click", () => {
      const isOpen = scheduleContent.classList.contains("open");
      if (isOpen) {
        scheduleContent.classList.remove("open");
        scheduleToggle.setAttribute("aria-expanded", "false");
      } else {
        scheduleContent.classList.add("open");
        scheduleToggle.setAttribute("aria-expanded", "true");
        calculateEMI();
      }
    });
  }

  // FAQ Accordions Toggle
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const answer = button.nextElementSibling;

      faqQuestions.forEach((otherBtn) => {
        if (otherBtn !== button) {
          otherBtn.setAttribute("aria-expanded", "false");
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.remove("open");
          }
        }
      });

      if (isExpanded) {
        button.setAttribute("aria-expanded", "false");
        if (answer) answer.classList.remove("open");
      } else {
        button.setAttribute("aria-expanded", "true");
        if (answer) answer.classList.add("open");
      }
    });
  });

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    // Inputs start clean and empty per requirement
    if (loanAmountInput) loanAmountInput.value = "";
    if (interestRateInput) interestRateInput.value = "";
    if (tenureInput) tenureInput.value = "";

    if (loanAmountRange) updateSliderFill(loanAmountRange);
    if (interestRateRange) updateSliderFill(interestRateRange);
    if (tenureRange) updateSliderFill(tenureRange);

    calculateEMI();
  });
})();
