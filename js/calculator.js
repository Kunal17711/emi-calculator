/**
 * EMI Calculator - Vanilla JavaScript Engine
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

  // Helper: Format raw number into readable Indian number
  function formatINR(amount) {
    return inrFormatter.format(amount);
  }

  function formatCleanNumber(num) {
    return numberFormatter.format(num);
  }

  // Update slider background gradient fill
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percent = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    slider.style.background = `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%, rgba(255, 255, 255, 0.1) 100%)`;
  }

  // Core Calculation Function
  function calculateEMI() {
    const principal = parseFloat(loanAmountRange.value) || 0;
    const annualRate = parseFloat(interestRateRange.value) || 0;
    const rawTenure = parseFloat(tenureRange.value) || 0;

    // Convert tenure to total months
    const totalMonths = tenureType === "years" ? rawTenure * 12 : rawTenure;

    if (principal <= 0 || totalMonths <= 0) {
      emiDisplay.textContent = "₹ 0";
      principalDisplay.textContent = "₹ 0";
      interestDisplay.textContent = "₹ 0";
      totalPaymentDisplay.textContent = "₹ 0";
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
    emiDisplay.textContent = formatINR(monthlyEMI);
    principalDisplay.textContent = formatINR(principal);
    interestDisplay.textContent = formatINR(totalInterest);
    totalPaymentDisplay.textContent = formatINR(totalPayment);

    // Calculate Percentages
    const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
    const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    principalRatioDisplay.textContent = `(${principalPercent.toFixed(1)}%)`;
    interestRatioDisplay.textContent = `(${interestPercent.toFixed(1)}%)`;

    // Update SVG Donut Chart
    updateDonutChart(principalPercent, interestPercent, monthlyEMI);

    // Update Amortization Table if open
    if (scheduleContent && scheduleContent.classList.contains("open")) {
      renderAmortizationSchedule(principal, annualRate, totalMonths, monthlyEMI);
    }
  }

  // Update SVG Donut Chart
  function updateDonutChart(principalPct, interestPct, monthlyEMI) {
    if (!chartPrincipalCircle || !chartInterestCircle) return;

    // Ensure circle circumference is set
    chartPrincipalCircle.setAttribute("stroke-dasharray", `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);
    chartInterestCircle.setAttribute("stroke-dasharray", `${CIRCUMFERENCE} ${CIRCUMFERENCE}`);

    const principalOffset = CIRCUMFERENCE - (principalPct / 100) * CIRCUMFERENCE;
    const interestOffset = CIRCUMFERENCE - (interestPct / 100) * CIRCUMFERENCE;

    // Principal starts at top (-90deg rotated in CSS)
    chartPrincipalCircle.setAttribute("stroke-dashoffset", principalOffset);

    // Interest segment begins where principal ends
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
    let totalYears = Math.ceil(totalMonths / 12);
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
          <td style="color: #38bdf8;">${formatINR(Math.round(yearlyPrincipal))}</td>
          <td style="color: #f43f5e;">${formatINR(Math.round(yearlyInterest))}</td>
          <td>${formatINR(Math.round(balance))}</td>
        </tr>
      `;

      if (balance <= 0) break;
    }

    scheduleTableBody.innerHTML = html;
  }

  // Two-way synchronization for Loan Amount
  function syncLoanAmount(fromRange) {
    if (fromRange) {
      loanAmountInput.value = formatCleanNumber(loanAmountRange.value);
    } else {
      let val = parseFloat(loanAmountInput.value.replace(/,/g, "")) || 0;
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
    if (fromRange) {
      interestRateInput.value = parseFloat(interestRateRange.value).toFixed(1);
    } else {
      let val = parseFloat(interestRateInput.value) || 0;
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
    if (fromRange) {
      tenureInput.value = tenureRange.value;
    } else {
      let val = parseInt(tenureInput.value, 10) || 0;
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
    if (tenureType === type) return;
    tenureType = type;

    if (type === "years") {
      tenureUnitYearsBtn.classList.add("active");
      tenureUnitMonthsBtn.classList.remove("active");
      tenureUnitYearsBtn.setAttribute("aria-pressed", "true");
      tenureUnitMonthsBtn.setAttribute("aria-pressed", "false");

      tenureRange.min = "1";
      tenureRange.max = "30";
      tenureRange.step = "1";
      tenureMinLabel.textContent = "1 Yr";
      tenureMaxLabel.textContent = "30 Yrs";

      // Convert current months to years
      const currentMonths = parseFloat(tenureRange.value) || 60;
      const convertedYears = Math.min(30, Math.max(1, Math.round(currentMonths / 12)));
      tenureRange.value = convertedYears;
      tenureInput.value = convertedYears;
    } else {
      tenureUnitMonthsBtn.classList.add("active");
      tenureUnitYearsBtn.classList.remove("active");
      tenureUnitMonthsBtn.setAttribute("aria-pressed", "true");
      tenureUnitYearsBtn.setAttribute("aria-pressed", "false");

      tenureRange.min = "6";
      tenureRange.max = "360";
      tenureRange.step = "1";
      tenureMinLabel.textContent = "6 Mo";
      tenureMaxLabel.textContent = "360 Mo";

      // Convert current years to months
      const currentYears = parseFloat(tenureRange.value) || 5;
      const convertedMonths = Math.min(360, Math.max(6, currentYears * 12));
      tenureRange.value = convertedMonths;
      tenureInput.value = convertedMonths;
    }

    updateSliderFill(tenureRange);
    calculateEMI();
  }

  // Event Listeners
  if (loanAmountRange && loanAmountInput) {
    loanAmountRange.addEventListener("input", () => syncLoanAmount(true));
    loanAmountInput.addEventListener("change", () => syncLoanAmount(false));
    loanAmountInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") syncLoanAmount(false);
    });
  }

  if (interestRateRange && interestRateInput) {
    interestRateRange.addEventListener("input", () => syncInterestRate(true));
    interestRateInput.addEventListener("change", () => syncInterestRate(false));
    interestRateInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") syncInterestRate(false);
    });
  }

  if (tenureRange && tenureInput) {
    tenureRange.addEventListener("input", () => syncTenure(true));
    tenureInput.addEventListener("change", () => syncTenure(false));
    tenureInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") syncTenure(false);
    });
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
        // Re-calculate and render schedule
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

      // Close other open FAQs for clean accordion feel
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
    if (loanAmountRange) {
      loanAmountInput.value = formatCleanNumber(loanAmountRange.value);
      updateSliderFill(loanAmountRange);
    }
    if (interestRateRange) {
      interestRateInput.value = interestRateRange.value;
      updateSliderFill(interestRateRange);
    }
    if (tenureRange) {
      tenureInput.value = tenureRange.value;
      updateSliderFill(tenureRange);
    }
    calculateEMI();
  });
})();
