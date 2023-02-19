const MENUID = {
  newsToggleMenu: "newsToggleMenu",
  trainingToggleMenu: "trainingToggleMenu",
};

type MENUID = typeof MENUID[keyof typeof MENUID];

export default MENUID;
