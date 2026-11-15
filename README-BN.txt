TK777 – GRAPHIC REDESIGN

এই ZIP-এ বাস্তব গ্রাফিক ইমেজ অ্যাসেট রয়েছে: assets/plane-scene.png (লাল বিমান ও ঝড়ের মেঘ), সঙ্গে CSS-ভিত্তিক Aviator multiplier graph, dark game panels, category icons, game cards এবং mobile navigation।

দেখার নিয়ম (গুরুত্বপূর্ণ): ZIP-এর HTML ফাইলকে File Manager-এর Text/Preview দিয়ে খুলবেন না—তাহলে HTML কোড/লেখা দেখা যাবে। ZIP Extract করে সব ফাইল GitHub repository-র root-এ আপলোড করুন (index.html root-এ, assets ফোল্ডারসহ)। তারপর GitHub Pages বা Cloudflare Pages-এর প্রকাশিত website URL Chrome-এ খুলুন।

API: assets/config.js-এ আপনার Worker URL দেওয়া আছে। Worker কোড বদলানোর প্রয়োজন নেই।

API-তে সমর্থিত: register, login, logout, user profile/balance, transaction history, deposit/withdraw request, admin login/dashboard/users/transactions, admin balance set, approve/reject.

সীমাবদ্ধতা: Worker-এ game round, bet, cashout, game state API নেই। তাই Aviator-এর visual screen তৈরি হলেও bet buttons disabled রাখা হয়েছে; টাকা কাটা/জেতার ভুয়া হিসাব করা হয় না।

Admin: /admin.html | Username: tk777admin | Password: Cloudflare Worker secret ADMIN_PASSWORD.
