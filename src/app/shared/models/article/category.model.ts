export enum ArticleCategoryTitle {
  BREAKING_NEWS = 'Breaking News',
  POLITICS = 'Politics',
  BUSINESS_AND_ECONOMY = 'Business and Economy',
  TECHNOLOGY = 'Technology',
  SCIENCE_AND_INNOVATION = 'Science and Innovation',
  HEALTH_AND_WELLNESS = 'Health and Wellness',
  ENTERTAINMENT = 'Entertainment',
  SPORTS = 'Sports',
  LIFESTYLE_AND_CULTURE = 'Lifestyle and Culture',
  TRAVEL_AND_EXPLORATION = 'Travel and Exploration',
  ENVIRONMENT_AND_SUSTAINABILITY = 'Environment and Sustainability',
  EDUCATION = 'Education',
  WORLD_NEWS = 'World News',
  LOCAL_NEWS = 'Local News',
  OPINION_AND_ANALYSIS = 'Opinion and Analysis',
  ART_AND_DESIGN = 'Art and Design',
  FOOD_AND_COOKING = 'Food and Cooking',
  AUTOMOTIVE = 'Automotive',
  FASHION_AND_BEAUTY = 'Fashion and Beauty',
  PARENTING_AND_FAMILY = 'Parenting and Family',
}

export interface ArticleCategory {
  imageURL: string;
  title: ArticleCategoryTitle;
  description: string;
  slug: string;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    imageURL: 'assets/images/categories/breaking-news.jpg',
    title: ArticleCategoryTitle.BREAKING_NEWS,
    description:
      'Stay updated with the latest and most important news happening around the world.',
    slug: 'breaking-news',
  },
  {
    imageURL: 'assets/images/categories/politics.jpg',
    title: ArticleCategoryTitle.POLITICS,
    description:
      'Explore the world of politics and delve into the latest political developments and analysis.',
    slug: 'politics',
  },
  {
    imageURL: 'assets/images/categories/business-and-economy.jpg',
    title: ArticleCategoryTitle.BUSINESS_AND_ECONOMY,
    description:
      'Get insights into the world of business and economy, including market trends and financial news.',
    slug: 'business-and-economy',
  },
  {
    imageURL: 'assets/images/categories/technology.jpg',
    title: ArticleCategoryTitle.TECHNOLOGY,
    description:
      'Discover the latest advancements and innovations in the world of technology.',
    slug: 'technology',
  },
  {
    imageURL: 'assets/images/categories/science-and-innovation.jpg',
    title: ArticleCategoryTitle.SCIENCE_AND_INNOVATION,
    description:
      'Uncover groundbreaking scientific discoveries and explore the realm of innovation.',
    slug: 'science-and-innovation',
  },
  {
    imageURL: 'assets/images/categories/health-and-wellness.jpg',
    title: ArticleCategoryTitle.HEALTH_AND_WELLNESS,
    description:
      'Learn about maintaining a healthy lifestyle and get insights into medical breakthroughs.',
    slug: 'health-and-wellness',
  },
  {
    imageURL: 'assets/images/categories/entertainment.jpg',
    title: ArticleCategoryTitle.ENTERTAINMENT,
    description:
      'Stay entertained with the latest news, gossip, and updates from the world of entertainment.',
    slug: 'entertainment',
  },
  {
    imageURL: 'assets/images/categories/sports.jpg',
    title: ArticleCategoryTitle.SPORTS,
    description:
      'Follow your favorite sports and athletes, and stay up to date with sporting events and news.',
    slug: 'sports',
  },
  {
    imageURL: 'assets/images/categories/lifestyle-and-culture.jpg',
    title: ArticleCategoryTitle.LIFESTYLE_AND_CULTURE,
    description:
      'Explore articles on lifestyle, culture, fashion, trends, and the arts.',
    slug: 'lifestyle-and-culture',
  },
  {
    imageURL: 'assets/images/categories/travel-and-exploration.jpg',
    title: ArticleCategoryTitle.TRAVEL_AND_EXPLORATION,
    description:
      'Embark on exciting journeys, discover new destinations, and get travel tips and recommendations.',
    slug: 'travel-and-exploration',
  },
  {
    imageURL: 'assets/images/categories/environment-and-sustainability.jpg',
    title: ArticleCategoryTitle.ENVIRONMENT_AND_SUSTAINABILITY,
    description:
      'Learn about environmental issues, sustainable living, and efforts to protect our planet.',
    slug: 'environment-and-sustainability',
  },
  {
    imageURL: 'assets/images/categories/education.jpg',
    title: ArticleCategoryTitle.EDUCATION,
    description:
      'Stay informed about the latest trends and developments in the field of education.',
    slug: 'education',
  },
  {
    imageURL: 'assets/images/categories/world-news.jpg',
    title: ArticleCategoryTitle.WORLD_NEWS,
    description:
      'Explore news and events from around the world, covering diverse topics and regions.',
    slug: 'world-news',
  },
  {
    imageURL: 'assets/images/categories/local-news.jpg',
    title: ArticleCategoryTitle.LOCAL_NEWS,
    description:
      'Stay informed about news and events happening in your local area.',
    slug: 'local-news',
  },
  {
    imageURL: 'assets/images/categories/opinion-and-analysis.jpg',
    title: ArticleCategoryTitle.OPINION_AND_ANALYSIS,
    description:
      'Read thought-provoking opinions and in-depth analysis on various topics.',
    slug: 'opinion-and-analysis',
  },
  {
    imageURL: 'assets/images/categories/art-and-design.jpg',
    title: ArticleCategoryTitle.ART_AND_DESIGN,
    description:
      'Discover inspiring artworks, creative designs, and artistic endeavors.',
    slug: 'art-and-design',
  },
  {
    imageURL: 'assets/images/categories/food-and-cooking.jpg',
    title: ArticleCategoryTitle.FOOD_AND_COOKING,
    description:
      'Explore culinary delights, recipes, food trends, and cooking tips.',
    slug: 'food-and-cooking',
  },
  {
    imageURL: 'assets/images/categories/automotive.jpg',
    title: ArticleCategoryTitle.AUTOMOTIVE,
    description:
      'Stay updated with the latest news, reviews, and developments in the automotive industry.',
    slug: 'automotive',
  },
  {
    imageURL: 'assets/images/categories/fashion-and-beauty.jpg',
    title: ArticleCategoryTitle.FASHION_AND_BEAUTY,
    description:
      'Get insights into fashion trends, beauty tips, and the world of style.',
    slug: 'fashion-and-beauty',
  },
  {
    imageURL: 'assets/images/categories/parenting-and-family.jpg',
    title: ArticleCategoryTitle.PARENTING_AND_FAMILY,
    description:
      'Find advice, tips, and stories related to parenting, family life, and relationships.',
    slug: 'parenting-and-family',
  },
];
