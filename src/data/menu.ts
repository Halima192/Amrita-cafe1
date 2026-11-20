import type {
  MenuCategoryId,
  MenuCategoryPreview,
  MenuItem,
  MenuSectionId,
} from '../types'

export const MENU_CATEGORIES: MenuCategoryPreview[] = [
  {
    id: 'beverages',
    title: 'Coffee & Tea',
    priceFrom: 'From ₹50',
    accent: '#B9C9D0',
    emoji: '☕',
    description: 'Hot classics, iced lattes, teas, and chilled comforts.',
    imageLabel: 'Coffee and tea',
    image: '/images/menu-pages/hot-coffee-tea.png',
  },
  {
    id: 'coolers',
    title: 'Coolers & Shakes',
    priceFrom: 'From ₹160',
    accent: '#9BB0BA',
    emoji: '🥤',
    description: 'Mocktails, coolers, smoothies, and espresso mixes.',
    imageLabel: 'Coolers and shakes',
    image: '/images/menu-pages/coolers.png',
  },
  {
    id: 'bites',
    title: 'Bites & Shares',
    priceFrom: 'From ₹180',
    accent: '#D58C55',
    emoji: '🥪',
    description: 'Sandwiches, garlic bread, rolls, and nachos.',
    imageLabel: 'Cafe bites',
    image: '/images/menu-pages/sandwiches.png',
  },
  {
    id: 'mains',
    title: 'Mains',
    priceFrom: 'From ₹280',
    accent: '#C9A67A',
    emoji: '🍝',
    description: 'Pasta, rice bowls, and sizzling platters.',
    imageLabel: 'Pasta and rice bowls',
    image: '/images/menu-pages/pasta.png',
  },
  {
    id: 'desserts',
    title: 'Desserts',
    priceFrom: 'From ₹120',
    accent: '#563B2D',
    emoji: '🍰',
    description: 'Brownies, cookies, and sweet finishes.',
    imageLabel: 'Desserts',
    image: '/images/menu-pages/sizzlers-dessert.png',
  },
]

/** Original cafe menu board pages shown in the Menu gallery. */
export const MENU_PAGES: {
  id: string
  title: string
  image: string
  filter: MenuCategoryId | 'all'
}[] = [
  {
    id: 'hot-coffee-tea',
    title: 'Hot Coffee & Tea',
    image: '/images/menu-pages/hot-coffee-tea.png',
    filter: 'beverages',
  },
  {
    id: 'iced-coffee-tea',
    title: 'Iced Coffee & Iced Tea',
    image: '/images/menu-pages/iced-coffee-tea.png',
    filter: 'beverages',
  },
  {
    id: 'coolers',
    title: 'Coolers & Mocktails',
    image: '/images/menu-pages/coolers.png',
    filter: 'coolers',
  },
  {
    id: 'shakes',
    title: 'Shakes & Sip & Relax',
    image: '/images/menu-pages/shakes.png',
    filter: 'coolers',
  },
  {
    id: 'sandwiches',
    title: 'Sandwiches & Garlic Bread',
    image: '/images/menu-pages/sandwiches.png',
    filter: 'bites',
  },
  {
    id: 'rock-roll-nachos',
    title: 'Rock & Roll & Nachos',
    image: '/images/menu-pages/rock-roll-nachos.png',
    filter: 'bites',
  },
  {
    id: 'pasta',
    title: 'Pasta',
    image: '/images/menu-pages/pasta.png',
    filter: 'mains',
  },
  {
    id: 'rice-bowl',
    title: 'Rice Bowl',
    image: '/images/menu-pages/rice-bowl.png',
    filter: 'mains',
  },
  {
    id: 'sizzlers-dessert',
    title: 'Sizzlers & Dessert',
    image: '/images/menu-pages/sizzlers-dessert.png',
    filter: 'mains',
  },
]

export const MENU_SECTIONS: { id: MenuSectionId; label: string; category: MenuCategoryId }[] = [
  { id: 'hot-coffee', label: 'Hot Coffee', category: 'beverages' },
  { id: 'tea', label: 'Tea', category: 'beverages' },
  { id: 'iced-coffee', label: 'Iced Coffee', category: 'beverages' },
  { id: 'iced-tea', label: 'Iced Tea', category: 'beverages' },
  { id: 'coolers-mocktails', label: 'Coolers & Mocktails', category: 'coolers' },
  { id: 'espresso-mocktails', label: 'Espresso Base Mocktails', category: 'coolers' },
  { id: 'shakes', label: 'Shakes & Smoothies', category: 'coolers' },
  { id: 'sip-relax', label: 'Sip & Relax', category: 'coolers' },
  { id: 'sandwiches', label: 'Sandwiches', category: 'bites' },
  { id: 'garlic-bread', label: 'Garlic Bread', category: 'bites' },
  { id: 'rock-roll', label: 'Rock & Roll', category: 'bites' },
  { id: 'nachos', label: 'Nachos', category: 'bites' },
  { id: 'pasta', label: 'Pasta', category: 'mains' },
  { id: 'rice-bowl', label: 'Rice Bowl', category: 'mains' },
  { id: 'sizzlers', label: 'Sizzlers', category: 'mains' },
  { id: 'dessert', label: 'Dessert', category: 'desserts' },
]

/** Confirmed cafe menu from Amrita Coffee House. */
export const MENU_ITEMS: MenuItem[] = [
  // Hot Coffee
  { id: 'cappuccino', name: 'Cappuccino', price: '₹160', category: 'beverages', section: 'hot-coffee', visual: 'cappuccino' },
  { id: 'americano', name: 'Americano', price: '₹140', category: 'beverages', section: 'hot-coffee', visual: 'filter' },
  { id: 'latte', name: 'Latte', price: '₹170', category: 'beverages', section: 'hot-coffee', visual: 'latte' },
  { id: 'vanilla-latte', name: 'Vanilla Latte', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'latte' },
  { id: 'mocha', name: 'Mocha', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'latte' },
  { id: 'irish-cappuccino', name: 'Irish Cappuccino', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'cappuccino' },
  { id: 'caramel-cappuccino', name: 'Caramel Cappuccino', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'cappuccino' },
  { id: 'hazelnut-cappuccino', name: 'Hazelnut Cappuccino', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'cappuccino' },
  { id: 'espresso', name: 'Espresso 60ml', price: '₹150', category: 'beverages', section: 'hot-coffee', visual: 'filter' },
  { id: 'hot-chocolate', name: 'Hot Chocolate', price: '₹160', category: 'beverages', section: 'hot-coffee', visual: 'latte' },
  { id: 'affogato', name: 'Affogato', price: '₹210', category: 'beverages', section: 'hot-coffee', visual: 'latte' },

  // Tea
  { id: 'indian-tea', name: 'Indian Tea', price: '₹50', category: 'beverages', section: 'tea', visual: 'filter' },
  { id: 'green-tea', name: 'Green Tea', price: '₹60', category: 'beverages', section: 'tea', visual: 'filter' },
  { id: 'lemon-tea', name: 'Lemon Tea', price: '₹60', category: 'beverages', section: 'tea', visual: 'filter' },

  // Iced Coffee
  { id: 'iced-vanilla-latte', name: 'Iced Vanilla Latte', price: '₹230', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-irish-latte', name: 'Iced Irish Latte', price: '₹230', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-hazelnut-latte', name: 'Iced Hazelnut Latte', price: '₹230', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-caramel-latte', name: 'Iced Caramel Latte', price: '₹230', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'classic-gold-cold-coffee', name: 'Classic Gold Cold Coffee', price: '₹190', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-flat-white', name: 'Iced Flat White', price: '₹210', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-mocha', name: 'Iced Mocha', price: '₹230', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-nutella-latte', name: 'Iced Nutella Latte', price: '₹260', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'iced-americano', name: 'Iced Americano', price: '₹180', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'mango-matcha', name: 'Mango Matcha', price: '₹250', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },
  { id: 'strawberry-matcha', name: 'Strawberry Matcha', price: '₹250', category: 'beverages', section: 'iced-coffee', visual: 'coldbrew' },

  // Iced Tea
  { id: 'lemon-iced-tea', name: 'Lemon Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'watermelon-iced-tea', name: 'Watermelon Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'green-apple-iced-tea', name: 'Green Apple Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'blueberry-iced-tea', name: 'Blueberry Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'lavender-iced-tea', name: 'Lavender Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'hibiscus-iced-tea', name: 'Hibiscus Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },
  { id: 'yuzu-iced-tea', name: 'Yuzu Iced Tea', price: '₹160', category: 'beverages', section: 'iced-tea', visual: 'coldbrew' },

  // Coolers & Mocktails
  { id: 'green-apple-cooler', name: 'Green Apple Cooler', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'hibiscus-cooler', name: 'Hibiscus Cooler', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'watermelon-mojito', name: 'Watermelon Mojito', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'grenadine-cooler', name: 'Grenadine Cooler', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'blue-curacao-mojito', name: 'Blue Curaçao Mojito', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'mint-mojito', name: 'Mint Mojito', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'blueberry-mojito', name: 'Blueberry Mojito', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },
  { id: 'kala-khatta-mojito', name: 'Kala Khatta Mojito', price: '₹160', category: 'coolers', section: 'coolers-mocktails', visual: 'coldbrew' },

  // Espresso Base Mocktails
  { id: 'espresso-orange', name: 'Espresso with Orange Juice', price: '₹190', category: 'coolers', section: 'espresso-mocktails', visual: 'coldbrew' },
  { id: 'espresso-cranberry', name: 'Espresso with Cranberry Juice', price: '₹190', category: 'coolers', section: 'espresso-mocktails', visual: 'coldbrew' },
  { id: 'redbull-espresso', name: 'Red Bull with Espresso', price: '₹230', category: 'coolers', section: 'espresso-mocktails', visual: 'coldbrew' },
  { id: 'tonic-espresso', name: 'Tonic Water with Espresso', price: '₹210', category: 'coolers', section: 'espresso-mocktails', visual: 'coldbrew' },

  // Shakes & Smoothies
  { id: 'kiwi-smoothie', name: 'Kiwi Smoothie', price: '₹210', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'mango-smoothie', name: 'Mango Smoothie', price: '₹210', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'blueberry-smoothie', name: 'Blueberry Smoothie', price: '₹210', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'strawberry-smoothie', name: 'Strawberry Smoothie', price: '₹210', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'oreo-shake', name: 'Oreo Shake', price: '₹250', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'brownie-shake', name: 'Brownie Shake', price: '₹260', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'chocolate-shake', name: 'Chocolate Shake', price: '₹250', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'kitkat-shake', name: 'KitKat Shake', price: '₹250', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'biscoff-shake', name: 'Biscoff Shake', price: '₹300', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'tender-coconut-shake', name: 'Tender Coconut Shake', price: '₹250', category: 'coolers', section: 'shakes', visual: 'parfait' },
  { id: 'pina-colada', name: 'Pina Colada', price: '₹260', category: 'coolers', section: 'shakes', visual: 'parfait' },

  // Sip & Relax
  { id: 'tropical-layers-kiwi', name: 'Tropical Layers Kiwi', price: '₹180', category: 'coolers', section: 'sip-relax', visual: 'parfait' },
  { id: 'mango-berry-bliss', name: 'Mango Berry Bliss', price: '₹190', category: 'coolers', section: 'sip-relax', visual: 'parfait' },
  { id: 'sun-kissed-sip', name: 'Sun-Kissed Sip', price: '₹190', category: 'coolers', section: 'sip-relax', visual: 'parfait' },
  { id: 'yuzu-sip', name: 'Yuzu', price: '₹210', category: 'coolers', section: 'sip-relax', visual: 'parfait' },

  // Sandwiches
  { id: 'cheese-chutney-sandwich', name: 'Cheese Chutney Sandwich', price: '₹180', category: 'bites', section: 'sandwiches', visual: 'sandwich' },
  { id: 'veg-cheese-sandwich', name: 'Vegetable Cheese Sandwich (Grilled)', price: '₹190', category: 'bites', section: 'sandwiches', visual: 'sandwich' },
  { id: 'paneer-tikka-sandwich', name: 'Paneer Tikka Sandwich (Grilled)', price: '₹210', category: 'bites', section: 'sandwiches', visual: 'sandwich' },
  { id: 'mushroom-sandwich', name: 'Mushroom Sandwich (Grilled)', price: '₹210', category: 'bites', section: 'sandwiches', visual: 'sandwich' },
  { id: 'peri-peri-paneer-sandwich', name: 'Peri Peri Paneer Sandwich (Grilled)', price: '₹210', category: 'bites', section: 'sandwiches', visual: 'sandwich' },
  { id: 'tandoori-paneer-sandwich', name: 'Tandoori Paneer Sandwich (Grilled)', price: '₹210', category: 'bites', section: 'sandwiches', visual: 'sandwich' },

  // Garlic Bread
  { id: 'cheese-garlic-bread', name: 'Cheese Garlic Bread (5 pcs)', price: '₹210', category: 'bites', section: 'garlic-bread', visual: 'wrap' },
  { id: 'paneer-tikka-garlic-bread', name: 'Paneer Tikka Garlic Bread (5 pcs)', price: '₹250', category: 'bites', section: 'garlic-bread', visual: 'wrap' },
  { id: 'stuffed-garlic-bread', name: 'Stuffed Garlic Bread', price: '₹320', category: 'bites', section: 'garlic-bread', visual: 'wrap' },

  // Rock & Roll
  {
    id: 'garden-fresh-roll',
    name: 'Garden Fresh',
    description: 'Onion, tomato, aloo tikki, lettuce, sweet corn.',
    price: '₹210',
    category: 'bites',
    section: 'rock-roll',
    visual: 'burger',
  },
  {
    id: 'smoky-paneer-roll',
    name: 'Smoky Paneer',
    description: 'Paneer, capsicum, onion.',
    price: '₹220',
    category: 'bites',
    section: 'rock-roll',
    visual: 'burger',
  },

  // Nachos
  {
    id: 'mexican-nachos',
    name: 'Mexican Nachos',
    description: 'Cheese crunch loaded with Mexican flavour in every bite.',
    price: '₹320',
    category: 'bites',
    section: 'nachos',
    visual: 'fries',
  },
  {
    id: 'zesty-cheese-nachos',
    name: 'Zesty Cheese Nachos',
    description: 'Crunchy nachos layered with garden-fresh veggies and cafe-style flavours.',
    price: '₹300',
    category: 'bites',
    section: 'nachos',
    visual: 'fries',
  },

  // Pasta
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    description: 'Creamy Italian pasta tossed in a rich, velvety white sauce with fresh herbs and vegetables.',
    price: '₹380',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },
  {
    id: 'blush-pasta',
    name: 'Blush Pasta',
    description: 'A velvety mix of cream and tomato sauce creating the signature pink pasta delight.',
    price: '₹380',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },
  {
    id: 'pesto-pasta',
    name: 'Pesto Pasta',
    description: 'Creamy basil pesto blended with pasta and herbs for a refreshing gourmet delight.',
    price: '₹390',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },
  {
    id: 'tangy-twist-pasta',
    name: 'Tangy Twist Pasta',
    description: 'Spicy, tangy, and vibrant — pasta with a perfect balance of heat and zest.',
    price: '₹380',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },
  {
    id: 'garlic-spaghetti',
    name: 'Garlic Flavoured Spaghetti',
    description: 'Spaghetti tossed in fragrant olive oil infused with roasted garlic and herbs. Light, aromatic, and full of bold garlic flavour.',
    price: '₹280',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },
  {
    id: 'pesto-spaghetti',
    name: 'Pesto Spaghetti',
    description: 'Tender spaghetti coated in a velvety basil pesto and cream sauce, blended with parmesan. Finished with olive oil and a touch of garlic.',
    price: '₹330',
    category: 'mains',
    section: 'pasta',
    visual: 'wrap',
  },

  // Rice Bowl
  {
    id: 'dal-fry-jeera-rice',
    name: 'Dal Fry Jeera Rice',
    description: 'Flavorful yellow dal tempered with ghee and spices, served alongside aromatic cumin rice. A wholesome, comforting classic with a touch of cafe elegance.',
    price: '₹360',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },
  {
    id: 'paneer-tikka-rice',
    name: 'Paneer Tikka with Rice',
    description: 'Smoky, marinated paneer tikka grilled to perfection and served with fragrant spiced rice. A hearty fusion of rich flavours and comforting cafe-style indulgence.',
    price: '₹430',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },
  {
    id: 'mexican-rice-bowl',
    name: 'Mexican Rice Bowl',
    description: 'Fluffy spiced rice tossed with Mexican herbs, salsa, and peppers, topped with cheese and sour cream. A vibrant, zesty bowl full of bold flavours.',
    price: '₹420',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },
  {
    id: 'green-thai-curry-rice',
    name: 'Green Thai Curry with Rice',
    description: 'A vibrant blend of green curry paste, coconut milk, and fresh herbs, cooked with authentic Thai flavours. Creamy, aromatic, and soul-soothing.',
    price: '₹420',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },
  {
    id: 'red-thai-curry-rice',
    name: 'Red Thai Curry with Rice',
    description: 'A rich red curry with coconut milk, spices, and herbs, finished with authentic Thai heat. Creamy, aromatic, and best with rice.',
    price: '₹420',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },
  {
    id: 'schezwan-fried-rice',
    name: 'Schezwan Fried Rice',
    description: 'Wok-tossed rice loaded with garden-fresh veggies and Chinese flavours, paired with a flavorful veg gravy.',
    price: '₹330',
    category: 'mains',
    section: 'rice-bowl',
    visual: 'burger',
  },

  // Sizzlers
  {
    id: 'smoky-paneer-sizzler',
    name: 'Smoky Paneer Sizzler',
    description: 'Smoky grilled paneer tikka served on a sizzling bed of spiced rice and sautéed vegetables, finished with rich sauces.',
    price: '₹590',
    category: 'mains',
    section: 'sizzlers',
    visual: 'burger',
  },
  {
    id: 'spicy-paneer-sizzler',
    name: 'Spicy Paneer Sizzler',
    description: 'Crispy paneer tossed in spicy Indo-Chinese sauces, served on a sizzling platter with stir-fried veggies.',
    price: '₹590',
    category: 'mains',
    section: 'sizzlers',
    visual: 'burger',
  },
  {
    id: 'peri-peri-sizzler',
    name: 'Peri Peri Sizzler',
    description: 'Aromatic rice on a sizzling platter, enveloped in a luxurious peri peri cream sauce.',
    price: '₹560',
    category: 'mains',
    section: 'sizzlers',
    visual: 'burger',
  },
  {
    id: 'drama-sizzler',
    name: 'Drama Sizzler',
    description: 'A sizzling platter loaded with rice and noodles, topped with rich sauces and smoky aroma.',
    price: '₹620',
    category: 'mains',
    section: 'sizzlers',
    visual: 'burger',
  },

  // Dessert
  { id: 'walnut-brownie', name: 'Walnut Brownie', price: '₹120', category: 'desserts', section: 'dessert', visual: 'brownie' },
  { id: 'sizzling-brownie', name: 'Sizzling Brownie', price: '₹220', category: 'desserts', section: 'dessert', visual: 'brownie' },
  { id: 'brownie-vanilla', name: 'Brownie with Vanilla Ice Cream', price: '₹180', category: 'desserts', section: 'dessert', visual: 'cake' },
  { id: 'chocolate-cookies', name: 'Chocolate Cookies', price: '₹120', category: 'desserts', section: 'dessert', visual: 'cheesecake' },
  { id: 'cashew-brownie', name: 'Cashew Brownie', price: '₹130', category: 'desserts', section: 'dessert', visual: 'brownie' },
]

export const MENU_FILTERS: { id: MenuCategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'beverages', label: 'Coffee & Tea' },
  { id: 'coolers', label: 'Coolers & Shakes' },
  { id: 'bites', label: 'Bites & Shares' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
]
