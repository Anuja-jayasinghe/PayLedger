# PayLedger

**PayLedger** is a modern web app that helps users track bills, manage finances, visualize monthly spending, and share public dashboards securely. Built with Next.js, Supabase, and Tailwind CSS, it offers email summaries, charts, and real-time insights—all in a responsive and elegant neon-glassy UI.

### 🚀 **Live Website:**  
&nbsp;&nbsp;&nbsp;&nbsp;[![Website](https://img.shields.io/badge/payledger.anujajay.com-000000?style=flat&logo=google-chrome&logoColor=white)](https://payledger.anujajay.com/)  

### 💻 **GitHub Repo:**  
&nbsp;&nbsp;&nbsp;&nbsp;[![GitHub](https://img.shields.io/badge/PayLedger-100000?style=flat&logo=github&logoColor=white)](https://github.com/Anuja-jayasinghe/payledger)

---

## 📌 Overview

PayLedger was born out of a personal frustration: juggling bills, subscriptions, and expenses across spreadsheets and sticky notes. This modern finance tracker solves that chaos with a sleek, all-in-one dashboard. Built for individuals who want clarity in their cash flow, it turns messy finances into actionable insights—with neon-glassy aesthetics for a touch of fun.

> "Why stress over bills when PayLedger organizes, visualizes, and even reminds you?"



## 📚 Tech Stack

| Category      | Tech Used                             |
| ------------- | ------------------------------------- |
| Framework     | [Next.js 14.1.0](https://nextjs.org/) |
| Language      | TypeScript                            |
| Styling       | Tailwind CSS                          |
| Backend       | [Supabase](https://supabase.com/)     |
| Email Service | [EmailJS](https://www.emailjs.com/)   |
| Charts        | Chart.js + React-ChartJS-2            |
| Icons         | lucide-react                          |
| Utilities     | uuid                                  |

---

## ✨ Features

* 🔐 **User Authentication** with Supabase
* 📊 **Dashboard** for financial overviews
* 📧 **Email Summaries** of bills and income
* 📅 **Bill Manager** to track and edit bills
* 🌐 **Public Dashboards** via secure links
* 📊 **Interactive Charts** (Bar, Pie, Line)
* 🚀 **Responsive Neon-Glassy UI**

---

## 📁 Project Structure

```
.
├── pages/              # All route pages (index, dashboard, login, etc.)
├── components/         # Reusable React components
├── lib/                # Supabase client and utility functions
├── public/             # Static assets (images, fonts, etc.)
├── styles/             # Global styles
├── package.json        # Project metadata and scripts
└── tsconfig.json       # TypeScript configuration
```


## 🛠 Development Commands

* `npm run dev` — Start dev server
* `npm run build` — Create production build
* `npm run start` — Run production server
* `npm run lint` — Check for code issues


---

## 📌 Pages Overview

| Page                | Description                       |
| ------------------- | --------------------------------- |
| `/`                 | Home page / Landing               |
| `/login`            | User authentication               |
| `/dashboard`        | Private dashboard after login     |
| `/public-dashboard` | Publicly sharable dashboard [Via Tokens]       |
| `/billManager`      | Bill creation and editing         |
| `/emailSummary`     | Email summary preview and sending |
| `/about`            | Project details                   |

---

## 📦 Deployment

* **Frontend**: Deployed on [Vercel](https://vercel.com)
* **Backend**: Powered by Supabase & EmailJS
* **Public Dashboard Security**: UUID token links

---
## 🤝 Contributing

PayLeger is open to contributions! Feel free to fork, open issues, or submit pull requests. Ideas and suggestions are always welcome. 🛠️

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for more info.

---

## 👤 Author

* Developed by **Anuja Jayasinghe**
  🌐 [anujajay.com](https://anujajay.com)

  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/anujajayasinghe) [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Anuja-jayasinghe)

---

> Crafted by Anuja Jayasinghe after one too late-night **bill-scrambling** sessions.
