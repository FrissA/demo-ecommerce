// Shoppers can register or continue as a guest before checking out. The
// choice lives in sessionStorage only; there is no backend.
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

export const continueAsGuest = () => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ guest: true }));
  } catch {}
};
