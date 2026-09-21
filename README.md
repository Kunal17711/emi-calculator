# EMI Calculator &mdash; Premium Minimal Financial Tool

A fast, lightweight, and modern Equated Monthly Installment (EMI) loan calculator tailored for Indian home loans, car loans, and personal financing. Built using **100% pure HTML5, CSS3, and vanilla JavaScript** &mdash; zero frameworks, zero external libraries, and zero build steps required.

![License](https://img.shields.io/badge/license-MIT-yellow.svg)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)
![CSS3](https://img.shields.io/badge/CSS3-Minimal%20Light-goldenrod.svg)
![Instagram](https://img.shields.io/badge/Instagram-@bykunalbuilds-orange.svg)

---

## 🌟 Key Features

- **⚡ Instant Real-Time Calculations:** Calculates monthly installment (EMI), total interest payable, and total loan payment immediately upon slider adjustment or input entry.
- **🇮🇳 Indian Rupee Formatting:** Native support for the Indian numbering system (`en-IN`), correctly formatting values into Thousands, Lakhs, and Crores (e.g. `₹ 25,00,000`).
- **📊 Responsive Native Vector Donut Chart:** Clean, scalable SVG donut chart visually illustrating Principal vs. Interest breakdown without any external charting library.
- **📅 Yearly Amortization Schedule:** Expandable table presenting year-by-year opening balance, principal repayment, interest payment, and closing balance.
- **🎨 Minimalist Light Design:** Pure white background, black body typography (`Poppins` 300/400), cursive headings (`Dancing Script` in `#B8860B`), and vibrant accent highlights (`#FFC800`). Strictly no bold styling anywhere.
- **📱 Responsive Animated Navigation:** Sticky top navbar with hover underline animation on desktop, and a slide-in drawer from the left with hamburger cross-animation for mobile viewports.
- **🔍 Technical SEO & Schema.org:** Fully optimized for search engines with JSON-LD schemas (`WebApplication`, `FAQPage`, `BreadcrumbList`, `Organization`), canonical tags, Open Graph, Twitter cards, `sitemap.xml`, and `robots.txt`.
- **💰 Google AdSense Ready:** Live AdSense header integration, `ads.txt` authorized digital seller configuration, and no intrusive visible placeholders.
- **📜 Complete Legal Suite:** Fully articulated `privacy-policy.html`, `terms.html`, and `disclaimer.html` compliant with AdSense and data protection standards.

---

## 🚀 Live Links

- **Live Tool:** [https://kunal17711.github.io/emi-calculator/](https://kunal17711.github.io/emi-calculator/)
- **Creator Portfolio:** [https://heyitskunal.vercel.app/](https://heyitskunal.vercel.app/)
- **Instagram:** [@bykunalbuilds](https://instagram.com/bykunalbuilds)

---

## 🧮 The EMI Mathematical Formula

The calculator uses the standard reducing balance formula:

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
Simply open `index.html` in any modern web browser.

### Method 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

---

## 📁 Project Structure

```
emi-calculator/
├── _headers               # Security & caching headers for Vercel/Netlify
├── css/
│   └── style.css          # Minimal light stylesheet (Dancing Script + Poppins)
├── js/
│   └── calculator.js      # Vanilla JS engine, SVG chart & drawer interactions
├── index.html             # Main tool + 600+ words SEO guide + FAQ
├── about.html             # About Kunal Builds & project mission
├── contact.html           # Contact details (email & Instagram)
├── privacy-policy.html    # Full AdSense/cookie compliant privacy policy
├── terms.html             # Terms of service
├── disclaimer.html        # Financial disclaimer
├── favicon.svg            # Minimal SVG favicon
├── robots.txt             # Search engine crawler instructions
├── sitemap.xml            # Search engine XML sitemap
├── ads.txt                # Google AdSense authorized seller configuration
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

---

## 📋 Manual Setup Checklist

1. **Deploy to GitHub Pages & Vercel:**
   - On GitHub: Go to **Settings > Pages > Branch: main > / (root) > Save**.
   - On Vercel: Import the repository and click **Deploy** (auto-detected as static site).
2. **Add Social Sharing Image:**
   - Add your custom 1200x630 social preview image at `assets/og-image.png`.
3. **Google AdSense (Once Approved):**
   - In `ads.txt`, replace `pub-XXXXXXXXXXXXXXXX` with your approved publisher ID.
   - In the `<head>` of each HTML page, replace `ca-pub-XXXXXXXXXXXXXXXX` in the AdSense tag with your real publisher ID.

---

## 👤 Author

**Kunal Builds**
- Website: [heyitskunal.vercel.app](https://heyitskunal.vercel.app/)
- Instagram: [@bykunalbuilds](https://instagram.com/bykunalbuilds)
- Email: [kkunaall10@gmail.com](mailto:kkunaall10@gmail.com)
- GitHub: [@Kunal17711](https://github.com/Kunal17711)

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
