export const ONBOARD_KEY = "onboarded_v1";

export const isOnboarded = (): boolean => {
  try {
    return localStorage.getItem(ONBOARD_KEY) === "1";
  } catch {
    return false;
  }
};

export const setOnboarded = (done = true) => {
  try {
    localStorage.setItem(ONBOARD_KEY, done ? "1" : "0");
  } catch {}
};
