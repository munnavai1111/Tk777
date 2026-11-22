-- Run ONCE only if upgrading a previously deployed starter that issued 10,000 signup credits.
-- This resets existing demo accounts to the requested initial balance of zero.
UPDATE users SET balance = 0;
DELETE FROM transactions WHERE type = 'bonus';
