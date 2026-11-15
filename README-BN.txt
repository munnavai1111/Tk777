TK777 FRONTEND — API COMPATIBLE PACKAGE

Included:
- index.html: user registration, login, profile balance, transaction list, deposit/withdraw request submission.
- admin.html: admin login, dashboard stats, user list, set user balance, approve/reject pending requests.
- assets/: CSS, API config, frontend JavaScript.

API URL:
https://tk777-api.dhmatelecom.workers.dev
Configured in assets/config.js. No Worker source changes are required if this URL and the supplied Worker deployment are active.

IMPORTANT LIMITATIONS — these are intentionally NOT included because the supplied Worker code does not implement them:
- Aviator/crash gameplay, bets, cashout, game rounds, game history.
- Bet increment/decrement controls.
- Separate game wallet or automatic main/game balance synchronization for wagers.
- User suspend/activate, game catalog, HTML game upload.
- Admin game result controls.

The supplied Worker exposes account balance and transaction request endpoints only. The frontend does not pretend unsupported features work.

Deployment:
1. Upload the ZIP contents to the existing GitHub repository used by your static Pages site.
2. Ensure index.html is at the published root.
3. Set the Pages build output directory to the repository root (or the folder containing index.html).
4. Open the site and test registration/login.
5. Admin page: /admin.html. Username is tk777admin; password must match the ADMIN_PASSWORD Worker secret.

Worker prerequisites:
- D1 binding must be named DB.
- Tables referenced by the Worker must already exist.
- ADMIN_PASSWORD secret must be configured.
- This package does not create or modify Worker/D1 resources.

Security note:
- This UI uses browser localStorage only to retain the bearer session token; balances and transaction records are read/written through the API.
- Your Worker currently allows wildcard CORS. Restrict allowed origins in production if possible.
- The Worker code supplied has no game/bet routes. Do not use this package to represent real-money gambling.
