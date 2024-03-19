export const MENU_ID = {
  newsToggleMenu: "newsToggleMenu",
  trainingToggleMenu: "trainingToggleMenu",
};

export type menuIdType = (typeof MENU_ID)[keyof typeof MENU_ID];
