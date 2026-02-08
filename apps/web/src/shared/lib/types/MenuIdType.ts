export const MENU_ID = {
  newsToggleMenu: "newsToggleMenu",
  trainingToggleMenu: "trainingToggleMenu",
};

export type MenuIdType = (typeof MENU_ID)[keyof typeof MENU_ID];
