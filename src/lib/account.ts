// Shoppers must register before checking out. The account lives in
// sessionStorage only; there is no backend.
const KEY = "shopco-account";

export type Account = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  acceptTerms: boolean;
};

export const hasAccount = () => {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
};

export const saveAccount = (account: Account) => {
  const { password, confirmPassword, ...profile } = account;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
};
