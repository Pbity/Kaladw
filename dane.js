/*
  ============================================================
  PLIK Z TREŚCIĄ KALENDARZA ADWENTOWEGO
  ============================================================
  Ten plik możesz edytować bezpośrednio na GitHubie (nawet z telefonu).
  
  Wskazówki:
  - Teksty pisz między znakami ` (grawis / backtick) — wtedy możesz
    robić nowe linie (Enter) i używać zwykłych cudzysłowów " bez psucia kodu.
  - Zdjęcia wrzucaj do folderu "zdjecia/" i wpisuj np. "zdjecia/01.jpg".
    Jeśli danego dnia nie ma zdjęcia, zostaw image: "".
  - Pole coupon jest opcjonalne (zostaw "" jeśli nie ma kuponu).
  - Pole mediaEmbed jest opcjonalne:
      * Spotify: link typu "https://open.spotify.com/embed/track/ID_UTWORU"
      * YouTube: link typu "https://www.youtube.com/embed/ID_FILMU"
  - Tryb podglądu dla Ciebie: otwórz stronę z dopiskiem ?preview=mikolaj
    (hasło zmienisz poniżej w previewKey).
*/

window.CALENDAR_CONFIG = {
  year: 2026,
  month: 12, // 12 = grudzień
  title: "Nasz Kalendarz Adwentowy",
  subtitle: "24 małe niespodzianki — po jednej każdego dnia grudnia",
  previewKey: "mikolaj",
  shuffleDays: false // zmień na true, jeśli okienka mają być wymieszane jak w papierowym kalendarzu
};

window.CALENDAR_DAYS = [
  {
    day: 1,
    title: "Zaczynamy zgrubnej rury!",
    text: `Najlepsze na start idziemy do roska.

Rozgość się i zaglądaj tu codziennie rano!`,
    image: "zdjecia/przyklad.svg",
    coupon: "",
    mediaEmbed: ""
  },
  {
    day: 2,
    title: "Kupon na wieczorny relaks",
    text: `Dziś bez wymówek — po pracy albo uczelni odpoczywasz, a ja ogarniam resztę.`,
    image: "",
    coupon: "Masaż pleców + gorąca czekolada (do wykorzystania dowolnego wieczoru)",
    mediaEmbed: ""
  },
  {
    day: 3,
    title: "Świąteczny klimat na słuchawki",
    text: `Włącz tę piosenkę przy porannej kawie. Tutaj możesz wkleić link embed ze Spotify albo YouTube.`,
    image: "",
    coupon: "",
    mediaEmbed: ""
  },
  { day: 4,  title: "Dzień 4",  text: `Treść na 4 grudnia...`,  image: "", coupon: "", mediaEmbed: "" },
  { day: 5,  title: "Dzień 5",  text: `Treść na 5 grudnia...`,  image: "", coupon: "", mediaEmbed: "" },
  { day: 6,  title: "Mikołajki!", text: `Wszystkiego najlepszego z okazji Mikołajek!`, image: "", coupon: "", mediaEmbed: "" },
  { day: 7,  title: "Dzień 7",  text: `Treść na 7 grudnia...`,  image: "", coupon: "", mediaEmbed: "" },
  { day: 8,  title: "Dzień 8",  text: `Treść na 8 grudnia...`,  image: "", coupon: "", mediaEmbed: "" },
  { day: 9,  title: "Dzień 9",  text: `Treść na 9 grudnia...`,  image: "", coupon: "", mediaEmbed: "" },
  { day: 10, title: "Dzień 10", text: `Treść na 10 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 11, title: "Dzień 11", text: `Treść na 11 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 12, title: "Dzień 12", text: `Treść na 12 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 13, title: "Dzień 13", text: `Treść na 13 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 14, title: "Dzień 14", text: `Treść na 14 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 15, title: "Dzień 15", text: `Treść na 15 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 16, title: "Dzień 16", text: `Treść na 16 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 17, title: "Dzień 17", text: `Treść na 17 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 18, title: "Dzień 18", text: `Treść na 18 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 19, title: "Dzień 19", text: `Treść na 19 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 20, title: "Dzień 20", text: `Treść na 20 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 21, title: "Dzień 21", text: `Treść na 21 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 22, title: "Dzień 22", text: `Treść na 22 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  { day: 23, title: "Dzień 23", text: `Treść na 23 grudnia...`, image: "", coupon: "", mediaEmbed: "" },
  {
    day: 24,
    title: "Wigilia ✨",
    text: `Ostatnie okienko! Wesołych Świąt!`,
    image: "",
    coupon: "",
    mediaEmbed: ""
  }
];
