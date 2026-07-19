// VULKANO catalog data
const PIZZAS = [
  {
    id: 'margherita-classica',
    name: 'Маргарита Класика',
    desc: 'Сан-марцано, фіор ді латте, свіжий базилік, оливкова олія першого віджиму.',
    ingredients: ['томати сан-марцано', 'фіор ді латте', 'базилік', 'олія e.v.'],
    prices: { 26: 179, 32: 219, 40: 289 },
    tags: ['класичні', 'вега'],
    img: 'assets/img/margherita-classica.jpg',
    badge: 'класика',
  },
  {
    id: 'quattro-formaggi',
    name: 'Кватро Формаджі',
    desc: 'Моцарела, ґорґондзола, пармезан 24 міс., таледжо — вершкова симфонія без томатної основи.',
    ingredients: ['моцарела', 'ґорґондзола', 'пармезан', 'таледжо', 'вершки'],
    prices: { 26: 239, 32: 295, 40: 379 },
    tags: ['сирні'],
    img: 'assets/img/quattro-formaggi.jpg',
  },
  {
    id: 'pepperoni-olive',
    name: 'Пепероні з оливками',
    desc: 'Гостра пепероні, таджаські оливки, петрушка, подвійна моцарела.',
    ingredients: ['пепероні', 'оливки', 'моцарела', 'петрушка'],
    prices: { 26: 199, 32: 249, 40: 325 },
    tags: ['гострі', 'класичні'],
    img: 'assets/img/pepperoni-olive.jpg',
  },
  {
    id: 'pepperoni-basil',
    name: 'Пепероні Базиліко',
    desc: 'Товстий шар пепероні, свіжий базилік, орегано, сан-марцано.',
    ingredients: ['пепероні', 'базилік', 'орегано', 'сан-марцано'],
    prices: { 26: 209, 32: 259, 40: 339 },
    tags: ['гострі'],
    img: 'assets/img/pepperoni-basil.jpg',
    badge: 'хіт',
  },
  {
    id: 'pepperoni-parmesan',
    name: 'Пепероні Пармезан',
    desc: 'Дрібна пікантна пепероні, стружка пармезану, базилік, борт із хрусткою скоринкою.',
    ingredients: ['пепероні', 'пармезан', 'базилік'],
    prices: { 26: 219, 32: 269, 40: 349 },
    tags: ['гострі', 'сирні'],
    img: 'assets/img/pepperoni-parmesan.jpg',
  },
  {
    id: 'margherita-cherry',
    name: 'Марґеріта Черрі',
    desc: 'Черрі конфі, буррата, базилік, лимонна цедра — літня версія класики.',
    ingredients: ['черрі', 'буррата', 'базилік', 'цедра'],
    prices: { 26: 209, 32: 255, 40: 335 },
    tags: ['класичні', 'вега'],
    img: 'assets/img/margherita-cherry.jpg',
  },
  {
    id: 'hawaiian',
    name: 'Гавайська Бро',
    desc: 'Шинка, карамелізований ананас, бекон-кранч. Так, ми це зробили — і це смачно.',
    ingredients: ['шинка', 'ананас', 'бекон', 'моцарела'],
    prices: { 26: 215, 32: 265, 40: 345 },
    tags: ['класичні'],
    img: 'assets/img/hawaiian.jpg',
  },
  {
    id: 'rucola-prosciutto',
    name: 'Рукола & Прошуто',
    desc: 'Прошуто крудо, гора руколи, оливки, пармезан, крем-бальзамік.',
    ingredients: ['прошуто', 'рукола', 'оливки', 'пармезан', 'бальзамік'],
    prices: { 26: 249, 32: 305, 40: 395 },
    tags: ['класичні'],
    img: 'assets/img/rucola-prosciutto.jpg',
    badge: 'шеф радить',
    badgeGold: true,
  },
  {
    id: 'detroit-pepperoni',
    name: 'Детройт Пепероні',
    desc: 'Квадратна, висока, з хрусткими сирними бортами та подвійною пепероні.',
    ingredients: ['пепероні х2', 'чедер', 'моцарела', 'томатні смуги'],
    prices: { 26: 235, 32: 289, 40: 375 },
    tags: ['гострі', 'сирні'],
    img: 'assets/img/detroit-pepperoni.jpg',
  },
];

const CRUSTS = [
  { id: 'classic', name: 'Класичний', add: 0 },
  { id: 'cheese', name: 'Сирний борт', add: 85 },
  { id: 'garlic', name: 'Часниковий', add: 45 },
];

const EXTRAS = [
  { id: 'mozz', name: 'Подвійна моцарела', add: 55 },
  { id: 'pepperoni', name: 'Пепероні', add: 65 },
  { id: 'mush', name: 'Печериці', add: 35 },
  { id: 'jalapeno', name: 'Халапеньйо', add: 30 },
  { id: 'honey', name: 'Чилі-мед', add: 25 },
];

const SIZE_LABEL = { 26: '26 см', 32: '32 см', 40: '40 см' };
