import { artworks, type Artwork } from "@/data/artworks";
import { formatPrice } from "@/lib/money";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const aliases: { id: string; keys: string[] }[] = [
  { id: "golden-descent", keys: ["golden descent", "blue horse"] },
  { id: "winged-horse", keys: ["winged horse", "winged"] },
  { id: "green-eye", keys: ["green eye"] },
  { id: "horse-and-ships", keys: ["horse and ships", "ships"] },
  { id: "two-faces", keys: ["two faces"] },
  { id: "the-profile", keys: ["the profile", "oval"] },
  { id: "the-walk", keys: ["the walk", "green hat"] },
];

function worksIn(text: string): Artwork[] {
  const hay = text.toLowerCase();
  const found: Artwork[] = [];
  for (const alias of aliases) {
    if (!alias.keys.some((key) => hay.includes(key))) continue;
    const work = artworks.find((item) => item.id === alias.id);
    if (work && !found.some((item) => item.id === work.id)) found.push(work);
  }
  return found;
}

function lastWork(turns: ChatTurn[], memory: string): Artwork | null {
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const found = worksIn(turns[index].content);
    if (found.length > 0) return found[found.length - 1];
  }
  return worksIn(memory).at(-1) ?? null;
}

function visitorName(text: string): string | null {
  const match = text.match(/(?:my name is|i am|меня зовут)\s+([A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё' -]{1,40})/i);
  if (!match) return null;
  return match[1].trim().replace(/[.,!?].*$/, "");
}

function inRussian(text: string) {
  return /[а-яё]/i.test(text);
}

export function galleryReply(turns: ChatTurn[], memory: string): string {
  const last = [...turns].reverse().find((turn) => turn.role === "user")?.content ?? "";
  const ru = inRussian(last);
  const corpus = `${memory}\n${turns.map((turn) => turn.content).join("\n")}`;
  const namedNow = worksIn(last);
  const earlier = turns.slice(0, -1);
  const subject = namedNow.at(-1) ?? lastWork(earlier, memory);
  const justNamed = visitorName(last);
  const knownName = justNamed ?? visitorName(corpus);
  const name = justNamed && knownName ? `${knownName}, ` : "";

  const asksPrice = /price|cost|сколько|цен|€|euro/i.test(last);
  const asksBuy = /buy|purchase|cart|order|купить|корзин|заказ/i.test(last);
  const asksList = /collection|what do you have|which works|какие работ|что есть|каталог/i.test(last);
  const asksWho = /who are you|what can you|кто ты|что ты умеешь/i.test(last);
  const asksName = /what is my name|remember my name|как меня зовут|кто я/i.test(last);

  const nameNote = asksName
    ? knownName
      ? ru
        ? `В этом разговоре вас зовут ${knownName}. `
        : `In this conversation your name is ${knownName}. `
      : ru
        ? "В этом разговоре имя ещё не прозвучало. "
        : "No name has been given in this conversation yet. "
    : "";

  if (asksName && !asksPrice && !asksBuy && !asksList && !subject) {
    return nameNote.trim();
  }

  if (asksWho) {
    return ru
      ? `${nameNote}${name}я консьерж галереи Victoria Boiker. Этот разговор сохраняется: я помню названные работы, имя и вопросы, которые уже прозвучали.`
      : `${nameNote}${name}I am the concierge of Victoria Boiker. This conversation is kept, so I still have the works, the name, and the questions already spoken.`;
  }

  if (asksList && namedNow.length === 0) {
    const lines = artworks.map((work) => `${work.title} (${formatPrice(work.price)})`).join(", ");
    return ru
      ? `${nameNote}${name}в галерее семь работ: ${lines}. Назовите одну, и следующие вопросы я отнесу к ней.`
      : `${nameNote}${name}the gallery holds seven works: ${lines}. Name one, and I will treat the next questions as being about it.`;
  }

  if (!subject && (asksPrice || asksBuy)) {
    return ru
      ? `${nameNote}${name}напишите, о какой работе речь. Если мы уже называли её в этом разговоре, я её не потеряю.`
      : `${nameNote}${name}say which work you mean. If we have already named it in this conversation, I still have it.`;
  }

  if (subject && asksPrice) {
    return ru
      ? `${nameNote}${name}${subject.title} стоит ${formatPrice(subject.price)}. ${subject.blurb}`
      : `${nameNote}${name}${subject.title} is ${formatPrice(subject.price)}. ${subject.blurb}`;
  }

  if (subject && asksBuy) {
    return ru
      ? `${nameNote}${name}${subject.title} кладётся в корзину кнопкой Add to cart на карточке или в окне осмотра. Цена ${formatPrice(subject.price)}. Корзина открывается из шапки.`
      : `${nameNote}${name}place ${subject.title} with Add to cart, on the card or in the viewing room. The price is ${formatPrice(subject.price)}. The cart opens from the header.`;
  }

  if (subject) {
    const remembered = namedNow.length === 0;
    const lead = remembered ? (ru ? "Мы всё ещё говорим о" : "We are still with") : ru ? "Это" : name ? "this is" : "This is";
    return ru
      ? `${nameNote}${name}${lead} ${subject.title}. ${subject.blurb} ${subject.medium}, ${subject.dimensionsCm}. Цена ${formatPrice(subject.price)}.`
      : `${nameNote}${name}${lead} ${subject.title}. ${subject.blurb} ${subject.medium}, ${subject.dimensionsCm}. The price is ${formatPrice(subject.price)}.`;
  }

  return ru
    ? `${nameNote}${name}я здесь и держу этот разговор. Спросите про работу, её цену или как положить её в корзину.`
    : `${nameNote}${name}I am here, and this conversation stays with me. Ask about a work, its price, or how to place it in the cart.`;
}
