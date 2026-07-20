const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export type Category =
  'класичні' | 'гострі' | 'сирні' | 'вега' | 'закуски й десерти' | 'напої' | 'комбо';

export interface Product {
  id: string;
  name: string;
  desc: string;
  ingredients: string[];
  img: string;
  tags: Category[];
  kind: 'pizza' | 'side' | 'drink' | 'combo';
  /** pizzas: prices per size; others: single price under 32 key */
  prices: Partial<Record<26 | 32 | 40, number>>;
  badge?: string;
  badgeGold?: boolean;
  popularity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'margherita-classica',
    name: 'Маргарита Класика',
    desc: 'Сан-марцано, фіор ді латте, свіжий базилік, оливкова олія першого віджиму.',
    ingredients: ['томати сан-марцано', 'фіор ді латте', 'базилік', 'олія e.v.'],
    prices: { 26: 179, 32: 219, 40: 289 },
    tags: ['класичні', 'вега'],
    kind: 'pizza',
    img: BP + '/assets/img/margherita-classica.jpg',
    badge: 'класика',
    popularity: 92,
  },
  {
    id: 'quattro-formaggi',
    name: 'Кватро Формаджі',
    desc: 'Моцарела, ґорґондзола, пармезан 24 міс., таледжо — вершкова симфонія без томатної основи.',
    ingredients: ['моцарела', 'ґорґондзола', 'пармезан', 'таледжо', 'вершки'],
    prices: { 26: 239, 32: 295, 40: 379 },
    tags: ['сирні'],
    kind: 'pizza',
    img: BP + '/assets/img/quattro-formaggi.jpg',
    popularity: 88,
  },
  {
    id: 'pepperoni-olive',
    name: 'Пепероні з оливками',
    desc: 'Гостра пепероні, таджаські оливки, петрушка, подвійна моцарела.',
    ingredients: ['пепероні', 'оливки', 'моцарела', 'петрушка'],
    prices: { 26: 199, 32: 249, 40: 325 },
    tags: ['гострі', 'класичні'],
    kind: 'pizza',
    img: BP + '/assets/img/pepperoni-olive.jpg',
    popularity: 81,
  },
  {
    id: 'pepperoni-basil',
    name: 'Пепероні Базиліко',
    desc: 'Товстий шар пепероні, свіжий базилік, орегано, сан-марцано.',
    ingredients: ['пепероні', 'базилік', 'орегано', 'сан-марцано'],
    prices: { 26: 209, 32: 259, 40: 339 },
    tags: ['гострі'],
    kind: 'pizza',
    img: BP + '/assets/img/pepperoni-basil.jpg',
    badge: 'хіт',
    popularity: 97,
  },
  {
    id: 'pepperoni-parmesan',
    name: 'Пепероні Пармезан',
    desc: 'Дрібна пікантна пепероні, стружка пармезану, базилік, хрустка скоринка.',
    ingredients: ['пепероні', 'пармезан', 'базилік'],
    prices: { 26: 219, 32: 269, 40: 349 },
    tags: ['гострі', 'сирні'],
    kind: 'pizza',
    img: BP + '/assets/img/pepperoni-parmesan.jpg',
    popularity: 76,
  },
  {
    id: 'margherita-cherry',
    name: 'Марґеріта Черрі',
    desc: 'Черрі конфі, буррата, базилік, лимонна цедра — літня версія класики.',
    ingredients: ['черрі', 'буррата', 'базилік', 'цедра'],
    prices: { 26: 209, 32: 255, 40: 335 },
    tags: ['класичні', 'вега'],
    kind: 'pizza',
    img: BP + '/assets/img/margherita-cherry.jpg',
    popularity: 71,
  },
  {
    id: 'hawaiian',
    name: 'Гавайська Бро',
    desc: 'Шинка, карамелізований ананас, бекон-кранч. Так, ми це зробили — і це смачно.',
    ingredients: ['шинка', 'ананас', 'бекон', 'моцарела'],
    prices: { 26: 215, 32: 265, 40: 345 },
    tags: ['класичні'],
    kind: 'pizza',
    img: BP + '/assets/img/hawaiian.jpg',
    popularity: 64,
  },
  {
    id: 'rucola-prosciutto',
    name: 'Рукола & Прошуто',
    desc: 'Прошуто крудо, гора руколи, оливки, пармезан, крем-бальзамік.',
    ingredients: ['прошуто', 'рукола', 'оливки', 'пармезан', 'бальзамік'],
    prices: { 26: 249, 32: 305, 40: 395 },
    tags: ['класичні'],
    kind: 'pizza',
    img: BP + '/assets/img/rucola-prosciutto.jpg',
    badge: 'шеф радить',
    badgeGold: true,
    popularity: 85,
  },
  {
    id: 'detroit-pepperoni',
    name: 'Детройт Пепероні',
    desc: 'Квадратна, висока, з хрусткими сирними бортами та подвійною пепероні.',
    ingredients: ['пепероні х2', 'чедер', 'моцарела', 'томатні смуги'],
    prices: { 26: 235, 32: 289, 40: 375 },
    tags: ['гострі', 'сирні'],
    kind: 'pizza',
    img: BP + '/assets/img/detroit-pepperoni.jpg',
    popularity: 69,
  },
  {
    id: 'pepperoni-retro',
    name: 'Нью-Йорк Ретро',
    desc: 'Тонке тісто, класична пепероні колесом, як у піцерій Брукліна 90-х.',
    ingredients: ['пепероні', 'моцарела', 'орегано'],
    prices: { 26: 225, 32: 275, 40: 355 },
    tags: ['гострі', 'класичні'],
    kind: 'pizza',
    img: BP + '/assets/img/pepperoni-retro.jpg',
    popularity: 58,
  },
  {
    id: 'focaccia',
    name: 'Фокача з печі',
    desc: 'Повітряна фокача на тій самій заквасці: розмарин, олива, морська сіль.',
    ingredients: ['закваска 48 год', 'розмарин', 'оливкова олія', 'сіль'],
    prices: { 32: 145 },
    tags: ['закуски й десерти', 'вега'],
    kind: 'side',
    img: BP + '/assets/img/focaccia.jpg',
    popularity: 55,
  },
  {
    id: 'tiramisu',
    name: 'Тірамісу',
    desc: 'Маскарпоне, савоярді, міцний еспресо. Збираємо щоранку.',
    ingredients: ['маскарпоне', 'савоярді', 'еспресо', 'какао'],
    prices: { 32: 165 },
    tags: ['закуски й десерти'],
    kind: 'side',
    img: BP + '/assets/img/tiramisu.jpg',
    popularity: 62,
  },
  {
    id: 'lemonade',
    name: 'Домашній лимонад',
    desc: 'Лимон, цукровий сироп на меду, содова. Без концентратів.',
    ingredients: ['лимон', 'мед', 'содова', "м'ята"],
    prices: { 32: 85 },
    tags: ['напої'],
    kind: 'drink',
    img: BP + '/assets/img/lemonade.jpg',
    popularity: 49,
  },
  {
    id: 'combo-duet',
    name: 'Комбо «Дует»',
    desc: 'Дві піци 32 см на вибір із класичних. Для вечора на двох.',
    ingredients: ['2 піци 32 см', 'соус до бортів у подарунок'],
    prices: { 32: 399 },
    tags: ['комбо'],
    kind: 'combo',
    img: BP + '/assets/img/pepperoni-basil.jpg',
    badge: 'вигода 79 ₴',
    badgeGold: true,
    popularity: 74,
  },
  {
    id: 'combo-evening',
    name: 'Комбо «Вечір біля печі»',
    desc: 'Піца 32 см, фокача та два лимонади. Все, що треба для п’ятниці.',
    ingredients: ['піца 32 см', 'фокача', '2 лимонади'],
    prices: { 32: 469 },
    tags: ['комбо'],
    kind: 'combo',
    img: BP + '/assets/img/feature-cheese.jpg',
    popularity: 66,
  },
];

export const CRUSTS = [
  { id: 'classic', name: 'Класичний', add: 0 },
  { id: 'cheese', name: 'Сирний борт', add: 85 },
  { id: 'garlic', name: 'Часниковий', add: 45 },
] as const;

export const DOUGHS = [
  { id: 'thin', name: 'Тонке', add: 0 },
  { id: 'fluffy', name: 'Пишне', add: 30 },
] as const;

export const EXTRAS = [
  { id: 'mozz', name: 'Подвійна моцарела', add: 55 },
  { id: 'pepperoni', name: 'Пепероні', add: 65 },
  { id: 'mush', name: 'Печериці', add: 35 },
  { id: 'jalapeno', name: 'Халапеньйо', add: 30 },
  { id: 'honey', name: 'Чилі-мед', add: 25 },
] as const;

export const SIZE_LABEL: Record<number, string> = { 26: '26 см', 32: '32 см', 40: '40 см' };

export const CATEGORIES: { tag: Category | 'всі'; label: string }[] = [
  { tag: 'всі', label: 'Всі' },
  { tag: 'класичні', label: 'Класичні' },
  { tag: 'гострі', label: 'Гострі' },
  { tag: 'сирні', label: 'Сирні' },
  { tag: 'вега', label: 'Вега' },
  { tag: 'закуски й десерти', label: 'Закуски й десерти' },
  { tag: 'напої', label: 'Напої' },
  { tag: 'комбо', label: 'Комбо' },
];

export const PROMO: Record<string, number> = { VULKANO10: 0.1 };
export const DELIVERY_FREE_FROM = 600;
export const DELIVERY_FEE = 69;

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const uah = (n: number) => `${Math.round(n)} ₴`;
