# TK777 — Virtual Coin Website

GitHub Pages-ready static website. Upload the files in this folder to a GitHub repository and enable GitHub Pages.

## Included
- `index.html` — login/register, home, bonus rewards, virtual deposit requests, virtual withdrawal requests, virtual wallet label and security settings
- `aviator.html` — Aviator-style virtual game
- `admin.html` — local game controls, virtual coin credit-request approval and virtual withdrawal request viewer

## Important limitations
- This is a front-end prototype. User accounts, passwords, balances, wallet labels and requests are stored in browser local storage.
- bKash/Nagad/USDT labels are display choices only. No real payment number, transaction-ID verification, bank transfer, crypto transfer or cash withdrawal is implemented.
- Wallet linking stores only a display label, not an actual wallet account.
- Admin and user pages must share the same browser and website origin for local storage to be shared.
- This is not a secure multi-user server. Do not store real passwords, PINs, OTPs, bank details or payment credentials.

## Added in this update
- Admin-managed virtual bonus list (add/edit/remove); each reward disappears for a user after it is claimed.
- New users can claim available bonuses without a deposit requirement.
- My Account → Bet History shows Aviator bets, win/loss and net profit/loss totals.
