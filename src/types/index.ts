export type NavItem = {
  id: string
  label: string
  href: string
}

export type MenuCategoryId =
  | 'beverages'
  | 'coolers'
  | 'bites'
  | 'mains'
  | 'desserts'

export type MenuSectionId =
  | 'hot-coffee'
  | 'tea'
  | 'iced-coffee'
  | 'iced-tea'
  | 'coolers-mocktails'
  | 'espresso-mocktails'
  | 'shakes'
  | 'sip-relax'
  | 'sandwiches'
  | 'garlic-bread'
  | 'rock-roll'
  | 'nachos'
  | 'pasta'
  | 'rice-bowl'
  | 'sizzlers'
  | 'dessert'

export type MenuCategoryPreview = {
  id: MenuCategoryId
  title: string
  priceFrom: string
  accent: string
  emoji: string
  description: string
  imageLabel: string
  image: string
}

export type MenuVisual =
  | 'cappuccino'
  | 'latte'
  | 'coldbrew'
  | 'filter'
  | 'sandwich'
  | 'fries'
  | 'wrap'
  | 'burger'
  | 'brownie'
  | 'cake'
  | 'cheesecake'
  | 'parfait'

export type MenuItem = {
  id: string
  name: string
  description?: string
  price: string
  category: MenuCategoryId
  section: MenuSectionId
  visual: MenuVisual
}

export type AboutFeature = {
  id: string
  title: string
  description: string
  icon: 'bean' | 'cozy' | 'fun'
}
