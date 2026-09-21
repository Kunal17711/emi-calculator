# EMI Calculator &mdash; Production-Ready Financial Tool

A fast, lightweight, and modern Equated Monthly Installment (EMI) loan calculator tailored for Indian home loans, car loans, and personal financing. Built using **100% pure HTML5, CSS3, and vanilla JavaScript** &mdash; zero frameworks, zero external libraries, and zero build steps required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-cyan.svg)
![Instagram](https://img.shields.io/badge/Instagram-@bykunalbuilds-purple.svg)

---

## 🌟 Key Features

- **⚡ Instant Real-Time Calculations:** Calculates monthly installment (EMI), total interest payable, and total loan payment immediately upon slider or input changes.
- **🇮🇳 Indian Rupee Formatting:** Native support for the Indian numbering system (`en-IN`), correctly formatting values into Thousands, Lakhs, and Crores (e.g. `₹ 25,00,000`).
- **📊 Native Vector Donut Chart:** Crisp, responsive SVG donut chart visually illustrating Principal vs. Interest breakdown without any heavy charting libraries.
- **📅 Yearly Amortization Schedule:** Expandable table presenting year-by-year opening balance, principal repayment, interest payment, and closing balance.
- **🎨 Glassmorphism & Mobile-First UI:** Responsive dark glassmorphism card design layered over a background overlay.
- **🔍 Technical SEO & Schema.org:** Fully optimized for search engines with JSON-LD schemas (`WebApplication`, `FAQPage`, `Person`), canonical tags, Open Graph, Twitter cards, `sitemap.xml`, and `robots.txt`.
- **💰 Google AdSense Ready:** Pre-configured reserved ad slots with fixed dimensions (`min-height`) ensuring **zero Cumulative Layout Shift (CLS = 0)**, plus `ads.txt` and commented activation tags.
- **📜 Complete Legal Suite:** Fully articulated `privacy-policy.html`, `terms.html`, and `disclaimer.html` meeting Google AdSense compliance requirements.

---

## 🚀 Live Demo

- **Live Site:** [https://kunal17711.github.io/emi-calculator/](https://kunal17711.github.io/emi-calculator/)
- **Creator Portfolio:** [https://heyitskunal.vercel.app/](https://heyitskunal.vercel.app/)
- **Instagram:** [@bykunalbuilds](https://instagram.com/bykunalbuilds)

---

## 🧮 The EMI Mathematical Formula

The calculator uses the standardized reducing balance formula:

$$E = P \cdot r \cdot \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- **$E$** = Equated Monthly Installment (EMI)
- **$P$** = Principal loan amount
- **$r$** = Monthly interest rate ($\text{Annual Rate} \div 12 \div 100$)
- **$n$** = Loan tenure in months ($\text{Years} \times 12$)

---

## 💻 How to Run Locally

Because this project is built entirely with plain vanilla web technologies, you do not need Node.js, npm, or any build step!

### Method 1: Double-Click
Simply double-click `index.html` in your file explorer to open it in any modern web browser.

### Method 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

Using VS Code:
Open the folder in VS Code and use the **Live Server** extension.

---

## 📁 Project Structure

```
emi-calculator/
├── assets/
│   └── bg.webp            # High-resolution background image
├── css/
│   └── style.css          # Glassmorphism responsive stylesheet
├── js/
│   └── calculator.js      # Vanilla JS calculation & SVG chart engine
├── index.html             # Main tool + 400+ words SEO guide + FAQ
├── about.html             # About Kunal Builds & project mission
├── contact.html           # Contact details (email & Instagram)
├── privacy-policy.html    # Full AdSense/cookie compliant privacy policy
├── terms.html             # Terms of service
├── disclaimer.html        # Financial disclaimer
├── favicon.svg            # Crisp SVG favicon
├── robots.txt             # Search engine crawler instructions
├── sitemap.xml            # Search engine XML sitemap
├── ads.txt                # Google AdSense authorized seller configuration
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

---

## 📋 Manual Setup & Deployment Checklist

When deploying to production:

1. **Verify Background Image:** Confirm `assets/bg.webp` is in place.
2. **Deploy via GitHub Pages or Vercel:**
   - On GitHub: Go to **Settings > Pages > Branch: main > Save**.
3. **Google AdSense Setup (After Site Approval):**
   - In `ads.txt`, replace `pub-XXXXXXXXXXXXXXXX` with your actual Google AdSense Publisher ID.
   - In all HTML files (`index.html`, `about.html`, etc.), uncomment the AdSense script in `<head>` and replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID.
   - Insert your ad unit codes (`<ins class="adsbygoogle" ...>`) inside the reserved slots:
     - `#ad-slot-top` (Leaderboard 728x90)
     - `#ad-slot-incontent` (In-content 336x280 / Responsive)
     - `#ad-slot-bottom` (Footer 728x90)

---

## 👤 Author

**Kunal Builds**
- Website: [heyitskunal.vercel.app](https://heyitskunal.vercel.app/)
- Instagram: [@bykunalbuilds](https://instagram.com/bykunalbuilds)
- Email: [kkunaall10@gmail.com](mailto:kkunaall10@gmail.com)
- GitHub: [@Kunal17711](https://github.com/Kunal17711)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &mdash; feel free to customize and use it for your own projects.
