// Creating an account before checkout is optional; shoppers can continue as
// guests. The account lives in sessionStorage only; there is no backend.
const KEY = "shopco-account";

export type Account = {
  email: string;
  password: string;
};

export const hasAccount = () => {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
};

export const saveAccount = (account: Account) => {
  const { password, ...profile } = account;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
};
