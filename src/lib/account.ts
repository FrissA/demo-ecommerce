// Shoppers can register or continue as a guest before checking out. The
// account lives in sessionStorage only; there is no backend.
const KEY = "shopco-account";
const GUEST_KEY = "shopco-guest";

export type Account = {
  email: string;
  password: string;
};

export const hasAccount = () => {
  try {
    return (
      sessionStorage.getItem(KEY) !== null ||
      sessionStorage.getItem(GUEST_KEY) !== null
    );
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
    sessionStorage.setItem(GUEST_KEY, "1");
  } catch {}
};
