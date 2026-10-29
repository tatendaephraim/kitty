# Kitty: Autonomous Rotating Savings Circles (PayPal + AI)

> **Submission for the PayPal AI Hackathon 2026**  
> *Targeting: Best Use of Agentic Commerce · Best Use of PayPal + AI · Most Impactful*

Over 11 million South Africans save in informal stokvels, and millions more in the global diaspora run rotating circles (*mukando, susu, tanda, chama*) on WhatsApp and pure trust. **Kitty** replaces the vulnerable human treasurer with accountable autonomous AI agents, non-custodial **PayPal Orders v2** peer-to-peer settlement, and a **deterministic policy engine** that audits every money movement before it touches PayPal.

---

## ⚡ Live Demo & Quick Evaluation

- **Live URL:** [https://ais-pre-dyfnwm3yj3wv43i6f73qlm-704443599847.europe-west1.run.app](https://ais-pre-dyfnwm3yj3wv43i6f73qlm-704443599847.europe-west1.run.app)
- **Zero-Friction Judge Testing:** The app is pre-seeded with 6 sandbox diaspora members mid-cycle (Round 1 settled, Round 2 collecting for Tendai). No signup, installs, or configurations are required to test!
- **1-Click Role Switcher:** Switch between any of the 6 members (**Rudo, Tendai, Chipo, Farai, Nyasha, Tatenda**) right from the top navigation.

---

## 🛠️ Built With

### 1. PayPal Payments & Money Infrastructure
- **PayPal Orders v2 (`/v2/checkout/orders`):** Direct peer-to-peer payout routing with `intent: CAPTURE` and `purchase_units[0].payee.email_address` set to that round's designated recipient. Kitty holds **0% custody**—money moves directly member-to-member.
- **PayPal Vault:** Tokenizes payment methods (`store_in_vault: ON_SUCCESS`) for recurring monthly pot cycles and automated round charges.
- **PayPal Agent Toolkit (`@paypal/agent-toolkit` v1.11.0):** 47 official PayPal tools loaded for agent-driven queries, invoice generation, order lookups, and transaction tracking.
- **PayPal Invoicing v2:** Generates QR-code invoice links for late-payment recovery.
- **Idempotency Guard:** Injects deterministic `PayPal-Request-Id` headers derived from database rows, guaranteeing retries never double charge.

### 2. Artificial Intelligence Layer (Gemini 3.8 Flash via `@google/genai`)
- **Multilingual Constitution Drafter:** Synthesizes organizer intentions in English or **Chishona (Shona)** into deterministic machine-readable `rulesJson` alongside legal bylaws.
- **Autonomous Member Negotiation Agents (Showpiece):** Personal member agents negotiate emergency payout-slot swaps strictly within signed member mandates (`maxSwapFee`, `minIncentive`).
- **Culturally Supportive Treasurer Agent:** Daily watchdog that audits collections and drafts respectful, non-shaming reminders in the member's preferred language with 5-day grace periods.
- **Ask-the-Ledger Natural Language Auditor:** Answers member questions (*"Where did my £100 go?"*) grounded strictly in the immutable ledger, citing exact Entry IDs and PayPal Capture IDs.

### 3. The Guardian (Deterministic Policy Engine)
Plain TypeScript evaluation engine enforcing 7 strict ordered checks before any transaction reaches PayPal:
1. **Known Payee:** Target payee must be a verified circle member.
2. **Constitution Match:** Amount must strictly equal the constitution schedule (£100 contribution, £10 late fee, or authorized swap fee).
3. **Mandate Limits:** Fees must not exceed member's pre-signed mandate ceiling.
4. **Round State:** Round must be actively `COLLECTING` with no prior payment.
5. **Duplicate Guard:** 10-minute cooldown on identical tool calls.
6. **Velocity Cap:** Maximum 3 financial operations per member per 24 hours.
7. **Dual Human Consent:** Swap settlements require two explicit human approvals.

---

## 🚀 Local Run Instructions

```bash
# 1. Clone the repository
git clone https://github.com/tatendachipwanya/kitty.git
cd kitty

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your PayPal Sandbox credentials and free Gemini API key

# 4. Start the full-stack development server
npm run dev
# App will run at http://localhost:3000
```

### Production Build & Start
```bash
npm run build
npm start
```

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `PAYPAL_CLIENT_ID` | PayPal Sandbox REST App Client ID from developer.paypal.com |
| `PAYPAL_CLIENT_SECRET` | PayPal Sandbox REST App Secret (never committed to git) |
| `PAYPAL_API_BASE` | `https://api-m.sandbox.paypal.com` |
| `PAYPAL_WEBHOOK_ID` | Optional webhook listener ID |
| `GEMINI_API_KEY` | Free API key from aistudio.google.com/apikey |
| `APP_URL` | Application base URL (`http://localhost:3000`) |

---

## 👥 Seeded Sandbox Member Roster

| Member | Role & Slot | Sandbox Email | Status |
|---|---|---|---|
| **Rudo Moyo** | Slot 1 (Paid Out) | `sb-rudo.platform@business.example.com` | Received £600 in Round 1 |
| **Tendai Chisamba** | Slot 2 (Collecting) | `sb-tendai.member@personal.example.com` | Round 2 Recipient (£400/£600 collected) |
| **Chipo Dube** | Slot 3 (Swap Requester) | `sb-chipo.member@personal.example.com` | Emergency boiler repair; requesting swap |
| **Farai Ncube** | Slot 4 (Contributed) | `sb-farai.member@personal.example.com` | Contributed Round 2 |
| **Nyasha Muzenda** | Slot 5 (Swap Counterparty) | `sb-nyasha.member@personal.example.com` | Agreed to swap with Chipo for £12 fee |
| **Tatenda Chipwanya** | Slot 6 (Organizer) | `sb-tatenda.admin@business.example.com` | Circle Founder & Admin |

---

## ⚠️ Production Caveat on Third-Party Payees
Direct peer-to-peer payout routing via `purchase_units[0].payee.email_address` works seamlessly out-of-the-box in the **PayPal Sandbox** environment. In live production, routing transactions to third-party merchant accounts requires PayPal Partner / Platform onboarding.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
