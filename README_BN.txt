TK777 — GitHub Pages static demo

এই সংস্করণে ভিডিওর দৃশ্যমান লেআউট অনুসারে মোবাইল-ফার্স্ট কালো/সোনালি হোম, Login/Register, Win List, game tiles, bottom navigation, My Account, Deposit/Withdraw demo pages এবং Aviator game রাখা হয়েছে।
নতুন account-এর balance 0.00; Aviator game-এও প্রাথমিক balance 0।

GitHub Pages:
1. ZIP extract করুন।
2. GitHub-এ Public repository তৈরি করুন।
3. Extract করা ফাইলগুলো repository root-এ upload/commit করুন।
4. Settings > Pages > Deploy from a branch > main > /(root) > Save।
5. GitHub প্রদত্ত URL-এ সাইট দেখুন।

সীমাবদ্ধতা ও নিরাপত্তা:
- ভিডিওতে দেখা নির্দিষ্ট তৃতীয় পক্ষের লোগো/ব্র্যান্ড/অ্যাসেট হুবহু কপি করা হয়নি; সাধারণ বিন্যাস ও রঙের ধাঁচ অনুসরণ করা হয়েছে।
- GitHub Pages static hosting; এই login localStorage demo, নিরাপদ multi-user authentication নয়।
- বাস্তব অর্থের deposit/withdraw বা bKash/Nagad payment integration যোগ করা হয়নি। এই Aviator/betting-style game-এর সঙ্গে বাস্তব অর্থের পেমেন্ট যুক্ত করতে পারি না। Deposit/Withdraw পেজগুলো শুধু demo notice দেখায়; কোনো payment number দেখায় না বা টাকা নেয় না।
- প্রকাশ্যে ব্যবহারের আগে backend, secure password hashing, database, server-side session এবং admin authorization প্রয়োজন।
- admin.html হলো আগের demo control panel; এটি production admin security নয়।


এই আপডেটে:
- Virtual withdrawal submit করলেই ইউজারের ভার্চুয়াল ব্যালেন্স থেকে কয়েন reserve/deduct হয়।
- Admin Panel-এ Accept করলে আর দ্বিতীয়বার deduction হয় না।
- Admin Panel-এ Reject + Refund করলে reserve করা কয়েন একবারই ফেরত যায়।
- Admin-approved virtual deposit-এর পরেই bonus Claim করা যায়; তার আগে “বোনাস ক্লেইম করতে আগে ডিপোজিট করুন।” দেখায়।
- Admin Panel থেকে Home Page-এর logo/brand text, banner heading/subtitle, notice এবং প্রধান রঙ/ব্যানার ব্যাকগ্রাউন্ড বদলানো যায়।

সীমাবদ্ধতা:
- এগুলো localStorage-ভিত্তিক ভার্চুয়াল কয়েন demo feature; বাস্তব টাকা, ব্যাংক/bKash/Nagad payout বা জুয়া-সংক্রান্ত অর্থ লেনদেন নয়।
- localStorage ডেটা শুধু একই browser profile/origin-এ থাকে; আলাদা ইউজার/ডিভাইসের জন্য sync হয় না।
- Admin Panel-এ production authentication/authorization নেই। বাস্তব public deployment-এর জন্য server-side database, secure admin login, audit log, transaction locking ও server-side balance validation অপরিহার্য।

নতুন আপডেট: Aviator গেম এখন লগইন করা ইউজারের tk777-users balance-ই ব্যবহার করে। Bet দিলে মেইন ব্যালেন্স থেকে কয়েন কাটা হয়; Cash Out/Cancel করলে গেমের নিয়ম অনুযায়ী একই মেইন ব্যালেন্সে ফেরত/জমা হয়। একই browser profile ও একই site origin-এ index.html এবং aviator.html চালাতে হবে। আলাদা ডিভাইস বা আলাদা ব্রাউজারে localStorage sync হয় না।
