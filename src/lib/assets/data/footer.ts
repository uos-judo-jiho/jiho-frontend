export interface FooterTitle {
  krTitle: string;
  enTitle: string;
  since: string;
}

export interface FooterExercise {
  title: string;
  time: string;
  place: string;
}

export interface ContactItem {
  title: string;
  href: string;
}

export interface FooterConnectUs {
  title: string;
  instagram: ContactItem;
  email: ContactItem;
  tel: ContactItem;
  dev: ContactItem;
}

export interface FooterData {
  title: FooterTitle;
  exercise: FooterExercise;
  connetUs: FooterConnectUs;
}

export const footerData: FooterData = {
  title: {
    krTitle: "서울시립대학교 유도 동아리 지호 志豪",
    enTitle: "University of Seoul Judo Team 志豪",
    since: "Since 1985",
  },
  exercise: {
    title: "정규 운동",
    time: "시간 | 매주 월, 수, 금 18:00-20:00",
    place: "장소 | 서울시립대 건설공학관 지하 1층",
  },
  connetUs: {
    title: "Connect Us",
    instagram: { title: "인스타그램 | ", href: "@uos_judo" },
    email: { title: "이메일 | ", href: "uosjudojiho@gmail.com" },
    tel: { title: "연락처 | ", href: "010-2222-3333" },
    dev: { title: "개발자 연락처 | ", href: "uosjudojiho@gmail.com" },
  },
} as const;
