export interface Article {
  slug: string
  title: string
  summary: string
  category: string
  readTime: string
  image: string
  paragraphs: string[]
}

export const articles: Article[] = [
  {
    slug: 'build-a-matchday-kit',
    title: 'Build a matchday kit that works',
    summary: 'A practical checklist for choosing layers, socks, protection, and the right shirt fit.',
    category: 'Gear guide',
    readTime: '5 min read',
    image: '/images/football/kit.png',
    paragraphs: [
      'Start with the conditions. A hot artificial pitch needs a light, quick-drying shirt. A cold evening match needs a fitted base layer that will not restrict movement.',
      'Treat socks and shin guards as one system. The guard should stay fixed while sprinting, and the sock should hold it without cutting circulation around the calf.',
      'Pack one dry layer for after the final whistle. Small choices before kickoff make recovery and the trip home much easier.',
    ],
  },
  {
    slug: 'goalkeeper-glove-fit',
    title: 'How goalkeeper gloves should fit',
    summary: 'Find a close fit that protects control without squeezing your fingers or wrist.',
    category: 'Goalkeeping',
    readTime: '4 min read',
    image: '/images/football/gloves.png',
    paragraphs: [
      'Goalkeeper gloves should follow the shape of your hand with a little room at each fingertip. Too much space reduces control. Too little space strains the seams.',
      'Test the wrist closure with your match shirt on. You should be able to secure the strap firmly without blocking wrist movement.',
      'Keep match gloves separate from training gloves. Rotating pairs protects the latex and gives each pair time to dry naturally.',
    ],
  },
  {
    slug: 'care-for-football-shirts',
    title: 'Make football shirts last longer',
    summary: 'Simple washing and drying habits that protect prints, badges, and technical fabric.',
    category: 'Kit care',
    readTime: '3 min read',
    image: '/images/football/shirts.png',
    paragraphs: [
      'Turn shirts inside out before washing and use a cool cycle. This reduces abrasion on names, numbers, and sponsor prints.',
      'Skip fabric softener. It can coat technical fibers and reduce their ability to move moisture away from the skin.',
      'Air dry shirts away from direct heat. Tumble dryers and radiators can damage transfers long before the fabric itself wears out.',
    ],
  },
]
