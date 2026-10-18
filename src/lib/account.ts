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

// The email the shopper already typed on the account step, so shipping does
// not ask them to type it again
export const getAccountEmail = (): string => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}").email ?? "";
  } catch {
    return "";
  }
};

export const saveAccount =(account: Account) => {
  const { password, confirmPassword, ...profile } = account;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
};
