interface TechniqueOption {
  value: string;
  label: string;
}

interface TechniqueGroup {
  label: string;
  options: TechniqueOption[];
}

export const TECHNIQUE_GROUPS: TechniqueGroup[] = [
  {
    label: "손기술 (Te-waza)",
    options: [
      { value: "업어치기", label: "업어치기 (Seoi-nage)" },
      { value: "한팔업어치기", label: "한팔업어치기 (Ippon-seoi-nage)" },
      { value: "빗당겨치기", label: "빗당겨치기 (Tai-otoshi)" },
      { value: "어깨로 메치기", label: "어깨로 메치기 (Kata-guruma)" },
      { value: "다리들어메치기", label: "다리들어메치기 (Sukui-nage)" },
      { value: "띄어치기", label: "띄어치기 (Uki-otoshi)" },
      { value: "모로떨어뜨리기", label: "모로떨어뜨리기 (Sumi-otoshi)" },
      { value: "띠잡아떨어뜨리기", label: "띠잡아떨어뜨리기 (Obi-otoshi)" },
      { value: "업어떨어뜨리기", label: "업어떨어뜨리기 (Seoi-otoshi)" },
      { value: "외깃잡아떨어뜨리기", label: "외깃잡아떨어뜨리기" },
      { value: "다리잡아메치기", label: "다리잡아메치기 (Morote-gari)" },
      { value: "오금잡아메치기", label: "오금잡아메치기 (Kuchiki-taoshi)" },
      { value: "발목잡아메치기", label: "발목잡아메치기 (Kibisu-gaeshi)" },
      {
        value: "허벅다리비껴되치기",
        label: "허벅다리비껴되치기 (Uchi-mata-sukashi)",
      },
      { value: "안뒤축되치기", label: "안뒤축되치기 (Kouchi-gaeshi)" },
      { value: "띠잡아뒤집기", label: "띠잡아뒤집기 (Obitori-gaeshi)" },
    ],
  },
  {
    label: "허리기술 (Koshi-waza)",
    options: [
      { value: "허리띄기", label: "허리띄기 (Uki-goshi)" },
      { value: "허리껴치기", label: "허리껴치기 (O-goshi)" },
      { value: "허리돌리기", label: "허리돌리기 (Koshi-guruma)" },
      { value: "허리채기", label: "허리채기 (Tsurikomi-goshi)" },
      { value: "허리후리기", label: "허리후리기 (Harai-goshi)" },
      { value: "띠잡아허리채기", label: "띠잡아허리채기 (Tsuri-goshi)" },
      { value: "허리튀기", label: "허리튀기 (Hane-goshi)" },
      { value: "허리옮겨치기", label: "허리옮겨치기 (Utsuri-goshi)" },
      { value: "뒤허리안아메치기", label: "뒤허리안아메치기 (Ushiro-goshi)" },
      {
        value: "소매들어 허리채기",
        label: "소매들어 허리채기 (Sode-tsurikomi-goshi)",
      },
    ],
  },
  {
    label: "발기술 (Ashi-waza)",
    options: [
      { value: "나오는발차기", label: "나오는발차기 (De-ashi-barai)" },
      { value: "무릎대돌리기", label: "무릎대돌리기 (Hiza-guruma)" },
      { value: "발목받치기", label: "발목받치기 (Sasae-tsurikomi-ashi)" },
      { value: "밭다리후리기", label: "밭다리후리기 (Osoto-gari)" },
      { value: "안다리후리기", label: "안다리후리기 (Ouchi-gari)" },
      { value: "발뒤축후리기", label: "발뒤축후리기 (Kosoto-gari)" },
      { value: "안뒤축후리기", label: "안뒤축후리기 (Kouchi-gari)" },
      { value: "모두걸기", label: "모두걸기 (Okuri-ashi-barai)" },
      { value: "허벅다리걸기", label: "허벅다리걸기" },
      { value: "발뒤축걸기", label: "발뒤축걸기" },
      { value: "다리대돌리기", label: "다리대돌리기 (Ashi-guruma)" },
      { value: "발목후리기", label: "발목후리기 (Harai-tsurikomi-ashi)" },
      { value: "허리대돌리기", label: "허리대돌리기 (O-guruma)" },
      { value: "두밭다리걸기", label: "두밭다리걸기 (Osoto-guruma)" },
      { value: "밭다리걸기", label: "밭다리걸기 (Osoto-otoshi)" },
      { value: "모두걸기되치기", label: "모두걸기되치기 (Tsubame-gaeshi)" },
      { value: "밭다리되치기", label: "밭다리되치기 (Osoto-gaeshi)" },
      { value: "안다리되치기", label: "안다리되치기 (Ouchi-gaeshi)" },
      { value: "허리튀기되치기", label: "허리튀기되치기 (Hane-goshi-gaeshi)" },
      {
        value: "허리후리기되치기",
        label: "허리후리기되치기 (Harai-goshi-gaeshi)",
      },
      { value: "허벅다리되치기", label: "허벅다리되치기 (Uchi-mata-gaeshi)" },
    ],
  },
  {
    label: "바로 누우면서 메치기 (Ma-sutemi-waza)",
    options: [
      { value: "배대뒤치기", label: "배대뒤치기 (Tomoe-nage)" },
      { value: "안오금띄기", label: "안오금띄기 (Sumi-gaeshi)" },
      { value: "누우면서던지기", label: "누우면서던지기 (Ura-nage)" },
      {
        value: "끌어누우며던지기",
        label: "끌어누우며던지기 (Hikikomi-gaeshi)",
      },
      { value: "뒤집어넘기기", label: "뒤집어넘기기 (Tawara-gaeshi)" },
    ],
  },
  {
    label: "모로 누우면서 메치기 (Yoko-sutemi-waza)",
    options: [
      { value: "옆으로 떨어뜨리기", label: "옆으로 떨어뜨리기 (Yoko-otoshi)" },
      { value: "모로띄기", label: "모로띄기 (Uki-waza)" },
      { value: "오금대떨어뜨리기", label: "오금대떨어뜨리기 (Tani-otoshi)" },
      {
        value: "옆으로누우며던지기",
        label: "옆으로누우며던지기 (Yoko-wakare)",
      },
      { value: "모로걸기", label: "모로걸기 (Yoko-gake)" },
      { value: "모로돌리기", label: "모로돌리기 (Yoko-guruma)" },
      { value: "허리안아돌리기", label: "허리안아돌리기 (Daki-wakare)" },
      {
        value: "허벅다리감아치기",
        label: "허벅다리감아치기 (Uchi-mata-makikomi)",
      },
      { value: "밭다리감아치기", label: "밭다리감아치기 (Osoto-makikomi)" },
      { value: "안쪽감아치기", label: "안쪽감아치기 (Uchi-makikomi)" },
      { value: "바깥감아치기", label: "바깥감아치기 (Soto-makikomi)" },
      {
        value: "허리후리기감아치기",
        label: "허리후리기감아치기 (Harai-makikomi)",
      },
      { value: "허리튀겨감아치기", label: "허리튀겨감아치기 (Hane-makikomi)" },
      { value: "안뒤축감아치기", label: "안뒤축감아치기 (Kouchi-makikomi)" },
    ],
  },
];

export const TECHNIQUE_VALUES = new Set(
  TECHNIQUE_GROUPS.flatMap((group) =>
    group.options.map((option) => option.value),
  ),
);
