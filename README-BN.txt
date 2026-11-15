TK777 VIDEO-STYLE FRONTEND

এই সংস্করণটি আপনার আপলোড করা ভিডিওর মোবাইল UI থেকে অনুপ্রাণিত: ডার্ক/ব্ল্যাক ব্যাকগ্রাউন্ড, লাল Aviator ব্র্যান্ডিং, multiplier history strip, রাইজিং red graph, দুইটি bet panel-এর ভিজ্যুয়াল বিন্যাস, category grid, game cards এবং bottom navigation.

API: আপনার দেওয়া Worker URL assets/config.js-এ সেট করা আছে। Worker কোড পরিবর্তন প্রয়োজন নেই।

যে API-সমর্থিত ফিচারগুলো কাজ করে: register, login, logout, /api/user/me, transaction history, deposit/withdraw request, admin login/dashboard/users/transactions, admin balance set, approve/reject.

গুরুত্বপূর্ণ: আপনার Worker-এ /api/game/state, bet placement, cashout, game round বা game history route নেই। তাই Aviator পেজে ভিডিওর মতো game layout দেখানো হয়েছে, কিন্তু bet controls নিষ্ক্রিয়; টাকা কাটা/জেতার ভুয়া কার্যকারিতা দেখানো হয়নি।

GitHub: ZIP extract করে সব ফাইল repository root-এ upload করুন। index.html root-এ থাকবে। GitHub Pages/Cloudflare Pages-এ deploy করুন। Admin: /admin.html; username tk777admin, password Worker secret ADMIN_PASSWORD.
