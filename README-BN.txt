TK222 — নতুন ব্র্যান্ডেড ফ্রন্টএন্ড প্যাকেজ

ফাইলসমূহ:
- index.html: রেজিস্ট্রেশন/লগইন, হোম, ক্যাটাগরি, অ্যাকাউন্ট, ভার্চুয়াল কয়েনের পেজ
- aviator.html: Aviator-স্টাইল practice crash game UI
- admin.html: admin console UI, user/credit controls, HTML game upload preview
- assets/tk222-aircraft-reference.jpg: আপনার দেওয়া ছবির বিমান অংশ থেকে তৈরি রেফারেন্স গ্রাফিক

চালানো:
python -m http.server 8080
তারপর http://localhost:8080/index.html খুলুন।

গুরুত্বপূর্ণ সীমাবদ্ধতা:
১) এটি UI/ফ্রন্টএন্ড প্যাকেজ; production backend এখনো সংযুক্ত বা যাচাই করা হয়নি।
২) API URL-এ YOUR-TK222-WORKER placeholder আছে। Cloudflare Worker তৈরি ও নিরাপদ API implement না করা পর্যন্ত login/admin cloud calls কাজ করবে না।
৩) পুরোনো TK777 API-তে কোনো request যাবে না।
৪) এই legacy UI-তে কিছু state browser localStorage/BroadcastChannel-এ থাকে; এগুলো production account/balance সংরক্ষণের জন্য নিরাপদ নয়।
৫) Virtual credits-এর কোনো নগদ মূল্য, deposit বা withdraw নেই। Deposit/withdraw screen-গুলো virtual request UI মাত্র; কোনো real payment করবেন না।
৬) Admin crash settings কেবল স্পষ্টভাবে চিহ্নিত practice environment-এ ব্যবহার করুন; ব্যবহারকারীদের কাছে ফলাফল/নিয়ম দৃশ্যমান রাখতে হবে।
৭) HTML upload preview sandbox করা আছে; production-এ server-side file validation, size limits, CSP এবং isolated origin দরকার।

পরবর্তী ধাপ: Cloudflare Worker + D1 backend তৈরি, authentication/session security, server-authoritative virtual-credit ledger, game round synchronization, admin RBAC ও audit log implement করে আলাদা staging-এ পরীক্ষা করতে হবে।
