export interface Movie {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  duration: number;
  genre: string;
  rating: number;
  views: number;
  streamUrl: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  genre: string;
  rating: number;
  views: number;
  seasons: Season[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=1080&fit=crop",
    releaseYear: 2008,
    duration: 152,
    genre: "Action",
    rating: 9.0,
    views: 15420,
    streamUrl: "https://example.com/stream/1"
  },
  {
    id: "2",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    releaseYear: 2010,
    duration: 148,
    genre: "Sci-Fi",
    rating: 8.8,
    views: 12350,
    streamUrl: "https://example.com/stream/2"
  },
  {
    id: "3",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
    releaseYear: 2014,
    duration: 169,
    genre: "Sci-Fi",
    rating: 8.6,
    views: 11200,
    streamUrl: "https://example.com/stream/3"
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    releaseYear: 1994,
    duration: 142,
    genre: "Drama",
    rating: 9.3,
    views: 18900,
    streamUrl: "https://example.com/stream/4"
  },
  {
    id: "5",
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
    releaseYear: 1994,
    duration: 154,
    genre: "Crime",
    rating: 8.9,
    views: 14500,
    streamUrl: "https://example.com/stream/5"
  },
  {
    id: "6",
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    releaseYear: 1999,
    duration: 136,
    genre: "Sci-Fi",
    rating: 8.7,
    views: 16800,
    streamUrl: "https://example.com/stream/6"
  },
  {
    id: "7",
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&h=1080&fit=crop",
    releaseYear: 1999,
    duration: 139,
    genre: "Drama",
    rating: 8.8,
    views: 13200,
    streamUrl: "https://example.com/stream/7"
  },
  {
    id: "8",
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop",
    releaseYear: 1994,
    duration: 142,
    genre: "Drama",
    rating: 8.8,
    views: 15600,
    streamUrl: "https://example.com/stream/8"
  },
  {
    id: "9",
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
    releaseYear: 1972,
    duration: 175,
    genre: "Crime",
    rating: 9.2,
    views: 17400,
    streamUrl: "https://example.com/stream/9"
  },
  {
    id: "10",
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backdrop: "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=1920&h=1080&fit=crop",
    releaseYear: 2000,
    duration: 155,
    genre: "Action",
    rating: 8.5,
    views: 12100,
    streamUrl: "https://example.com/stream/10"
  },
  {
    id: "11",
    title: "Dune",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    releaseYear: 2021,
    duration: 155,
    genre: "Sci-Fi",
    rating: 8.0,
    views: 9800,
    streamUrl: "https://example.com/stream/11"
  },
  {
    id: "12",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 180,
    genre: "Drama",
    rating: 8.4,
    views: 8500,
    streamUrl: "https://example.com/stream/12"
  },
  {
    id: "13",
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    duration: 192,
    genre: "Sci-Fi",
    rating: 7.6,
    views: 14200,
    streamUrl: "https://example.com/stream/13"
  },
  {
    id: "14",
    title: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice.",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DG35LeH.jpg",
    backdrop: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    duration: 130,
    genre: "Action",
    rating: 8.3,
    views: 16500,
    streamUrl: "https://example.com/stream/14"
  },
  {
    id: "15",
    title: "Spider-Man: No Way Home",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1080&fit=crop",
    releaseYear: 2021,
    duration: 148,
    genre: "Action",
    rating: 8.2,
    views: 19800,
    streamUrl: "https://example.com/stream/15"
  },
  {
    id: "16",
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber9r3s2Tic0LR.jpg",
    backdrop: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    duration: 176,
    genre: "Action",
    rating: 7.8,
    views: 13400,
    streamUrl: "https://example.com/stream/16"
  },
  {
    id: "17",
    title: "John Wick: Chapter 4",
    description: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
    poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    backdrop: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 169,
    genre: "Action",
    rating: 7.7,
    views: 11200,
    streamUrl: "https://example.com/stream/17"
  },
  {
    id: "18",
    title: "Everything Everywhere All at Once",
    description: "A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence by exploring other universes.",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    duration: 139,
    genre: "Sci-Fi",
    rating: 7.8,
    views: 9800,
    streamUrl: "https://example.com/stream/18"
  },
  {
    id: "19",
    title: "Barbie",
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    backdrop: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 114,
    genre: "Comedy",
    rating: 6.9,
    views: 15600,
    streamUrl: "https://example.com/stream/19"
  },
  {
    id: "20",
    title: "Guardians of the Galaxy Vol. 3",
    description: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own.",
    poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    backdrop: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 150,
    genre: "Action",
    rating: 7.9,
    views: 12300,
    streamUrl: "https://example.com/stream/20"
  },
  {
    id: "21",
    title: "Killers of the Flower Moon",
    description: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major FBI investigation.",
    poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    backdrop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 206,
    genre: "Crime",
    rating: 7.6,
    views: 7200,
    streamUrl: "https://example.com/stream/21"
  },
  {
    id: "22",
    title: "The Meg 2: The Trench",
    description: "A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.",
    poster: "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg",
    backdrop: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 116,
    genre: "Action",
    rating: 5.0,
    views: 8900,
    streamUrl: "https://example.com/stream/22"
  },
  {
    id: "23",
    title: "Mission: Impossible - Dead Reckoning",
    description: "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    backdrop: "https://images.unsplash.com/photo-1547499417-29d7056a6e3c?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 163,
    genre: "Action",
    rating: 7.7,
    views: 10500,
    streamUrl: "https://example.com/stream/23"
  },
  {
    id: "24",
    title: "Wonka",
    description: "The story of how Willy Wonka became the renowned chocolate maker.",
    poster: "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
    backdrop: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 116,
    genre: "Comedy",
    rating: 7.1,
    views: 6800,
    streamUrl: "https://example.com/stream/24"
  },
  {
    id: "25",
    title: "Napoleon",
    description: "An epic look at Napoleon Bonaparte's rise and fall, focusing on his relationship with his wife, Josephine.",
    poster: "https://image.tmdb.org/t/p/w500/jE5o7y9K6pZtWNNMEw3IdpHuncR.jpg",
    backdrop: "https://images.unsplash.com/photo-1569937756447-1d44f657dc69?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 158,
    genre: "Drama",
    rating: 6.4,
    views: 5400,
    streamUrl: "https://example.com/stream/25"
  },
  {
    id: "26",
    title: "Aquaman and the Lost Kingdom",
    description: "Black Manta seeks revenge on Aquaman for his father's death. Wielding the power of the mythic Black Trident, he will stop at nothing to avenge him.",
    poster: "https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 124,
    genre: "Action",
    rating: 5.6,
    views: 7100,
    streamUrl: "https://example.com/stream/26"
  },
  {
    id: "27",
    title: "The Hunger Games: Ballad of Songbirds",
    description: "Years before he becomes the tyrannical president of Panem, 18-year-old Coriolanus Snow is the last hope for his fading lineage.",
    poster: "https://image.tmdb.org/t/p/w500/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 157,
    genre: "Action",
    rating: 6.9,
    views: 8200,
    streamUrl: "https://example.com/stream/27"
  },
  {
    id: "28",
    title: "Poor Things",
    description: "The incredible tale of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    poster: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    backdrop: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 141,
    genre: "Comedy",
    rating: 7.9,
    views: 4500,
    streamUrl: "https://example.com/stream/28"
  },
  {
    id: "29",
    title: "The Marvels",
    description: "Carol Danvers, Kamala Khan and Monica Rambeau must team up when their powers become entangled.",
    poster: "https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 105,
    genre: "Action",
    rating: 5.5,
    views: 6200,
    streamUrl: "https://example.com/stream/29"
  },
  {
    id: "30",
    title: "Rebel Moon - Part One",
    description: "When a peaceful colony on the edge of the galaxy finds itself threatened by the armies of the tyrannical Regent Balisarius, they dispatch a young woman to seek out warriors from neighboring planets to help them take a stand.",
    poster: "https://image.tmdb.org/t/p/w500/ui4DrH1cKk2vkHshcUcGt2lKxCm.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 134,
    genre: "Sci-Fi",
    rating: 5.6,
    views: 9100,
    streamUrl: "https://example.com/stream/30"
  }
];

export const sampleSeries: Series[] = [
  {
    id: "s1",
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop",
    releaseYear: 2008,
    genre: "Crime",
    rating: 9.5,
    views: 25000,
    seasons: [
      {
        id: "s1-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s1-se1-e1", episodeNumber: 1, title: "Pilot", description: "Walter White, a struggling high school chemistry teacher, is diagnosed with advanced lung cancer.", duration: 58, thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/s1e1" },
          { id: "s1-se1-e2", episodeNumber: 2, title: "Cat's in the Bag...", description: "Walt and Jesse attempt to dispose of the bodies of Emilio and Krazy-8.", duration: 48, thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/s1e2" },
          { id: "s1-se1-e3", episodeNumber: 3, title: "...And the Bag's in the River", description: "Walt struggles with the decision to kill Krazy-8.", duration: 48, thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/s1e3" }
        ]
      },
      {
        id: "s1-se2",
        seasonNumber: 2,
        title: "Season 2",
        episodes: [
          { id: "s1-se2-e1", episodeNumber: 1, title: "Seven Thirty-Seven", description: "Walt and Jesse face consequences of their drug trade.", duration: 47, thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/s2e1" },
          { id: "s1-se2-e2", episodeNumber: 2, title: "Grilled", description: "Walt and Jesse are held hostage by Tuco.", duration: 48, thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/s2e2" }
        ]
      }
    ]
  },
  {
    id: "s2",
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
    releaseYear: 2011,
    genre: "Fantasy",
    rating: 9.3,
    views: 28000,
    seasons: [
      {
        id: "s2-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s2-se1-e1", episodeNumber: 1, title: "Winter Is Coming", description: "Eddard Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon.", duration: 62, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/got-s1e1" },
          { id: "s2-se1-e2", episodeNumber: 2, title: "The Kingsroad", description: "While Bran recovers from his fall, Ned takes only his daughters to King's Landing.", duration: 56, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/got-s1e2" }
        ]
      }
    ]
  },
  {
    id: "s3",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=1920&h=1080&fit=crop",
    releaseYear: 2016,
    genre: "Sci-Fi",
    rating: 8.7,
    views: 22000,
    seasons: [
      {
        id: "s3-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s3-se1-e1", episodeNumber: 1, title: "Chapter One: The Vanishing of Will Byers", description: "On his way home from a friend's house, young Will sees something terrifying.", duration: 49, thumbnail: "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/st-s1e1" },
          { id: "s3-se1-e2", episodeNumber: 2, title: "Chapter Two: The Weirdo on Maple Street", description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods.", duration: 55, thumbnail: "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/st-s1e2" }
        ]
      }
    ]
  },
  {
    id: "s4",
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    poster: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    backdrop: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=1920&h=1080&fit=crop",
    releaseYear: 2019,
    genre: "Fantasy",
    rating: 8.2,
    views: 18000,
    seasons: [
      {
        id: "s4-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s4-se1-e1", episodeNumber: 1, title: "The End's Beginning", description: "Geralt of Rivia, a mutated monster hunter, accepts a contract to kill a beast terrorizing the town.", duration: 61, thumbnail: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/tw-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s5",
    title: "The Last of Us",
    description: "Joel and Ellie must survive a brutal journey across a post-apocalyptic United States.",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdrop: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    genre: "Drama",
    rating: 8.8,
    views: 20000,
    seasons: [
      {
        id: "s5-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s5-se1-e1", episodeNumber: 1, title: "When You're Lost in the Darkness", description: "Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with smuggling Ellie.", duration: 81, thumbnail: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/tlou-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s6",
    title: "House of the Dragon",
    description: "The story of the Targaryen civil war that took place about 200 years before the events of Game of Thrones.",
    poster: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    backdrop: "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    genre: "Fantasy",
    rating: 8.5,
    views: 19000,
    seasons: [
      {
        id: "s6-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s6-se1-e1", episodeNumber: 1, title: "The Heirs of the Dragon", description: "Viserys hosts a tournament to celebrate the birth of his second child.", duration: 66, thumbnail: "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/hotd-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s7",
    title: "Wednesday",
    description: "Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers.",
    poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    genre: "Comedy",
    rating: 8.1,
    views: 17500,
    seasons: [
      {
        id: "s7-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s7-se1-e1", episodeNumber: 1, title: "Wednesday's Child Is Full of Woe", description: "Wednesday Addams is expelled from yet another school.", duration: 52, thumbnail: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/wed-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s8",
    title: "Peaky Blinders",
    description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.",
    poster: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
    releaseYear: 2013,
    genre: "Crime",
    rating: 8.8,
    views: 21000,
    seasons: [
      {
        id: "s8-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s8-se1-e1", episodeNumber: 1, title: "Episode 1", description: "Thomas Shelby plans to fix a horse race.", duration: 57, thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/pb-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s9",
    title: "The Mandalorian",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    releaseYear: 2019,
    genre: "Sci-Fi",
    rating: 8.7,
    views: 19500,
    seasons: [
      {
        id: "s9-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s9-se1-e1", episodeNumber: 1, title: "Chapter 1: The Mandalorian", description: "A Mandalorian bounty hunter tracks a target for a client.", duration: 39, thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/mando-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s10",
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
    poster: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1080&fit=crop",
    releaseYear: 2021,
    genre: "Thriller",
    rating: 8.0,
    views: 24000,
    seasons: [
      {
        id: "s10-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s10-se1-e1", episodeNumber: 1, title: "Red Light, Green Light", description: "Hoping to win easy money, a broke man joins 455 others to compete in children's games.", duration: 60, thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/sg-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s11",
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    poster: "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    backdrop: "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=1920&h=1080&fit=crop",
    releaseYear: 2016,
    genre: "Drama",
    rating: 8.6,
    views: 16000,
    seasons: [
      {
        id: "s11-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s11-se1-e1", episodeNumber: 1, title: "Wolferton Splash", description: "Princess Elizabeth marries Prince Philip.", duration: 57, thumbnail: "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/crown-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s12",
    title: "Dark",
    description: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes relationships among four families.",
    poster: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    backdrop: "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=1920&h=1080&fit=crop",
    releaseYear: 2017,
    genre: "Sci-Fi",
    rating: 8.7,
    views: 14000,
    seasons: [
      {
        id: "s12-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s12-se1-e1", episodeNumber: 1, title: "Secrets", description: "In 2019, a local boy's disappearance stokes fear in the residents of Winden.", duration: 51, thumbnail: "https://images.unsplash.com/photo-1509248961895-b5c5c5a74648?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/dark-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s13",
    title: "Money Heist",
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    poster: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    backdrop: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop",
    releaseYear: 2017,
    genre: "Crime",
    rating: 8.2,
    views: 22000,
    seasons: [
      {
        id: "s13-se1",
        seasonNumber: 1,
        title: "Part 1",
        episodes: [
          { id: "s13-se1-e1", episodeNumber: 1, title: "Episode 1", description: "A mysterious man recruits eight people to carry out an elaborate heist.", duration: 47, thumbnail: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/mh-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s14",
    title: "Succession",
    description: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company.",
    poster: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
    releaseYear: 2018,
    genre: "Drama",
    rating: 8.8,
    views: 15000,
    seasons: [
      {
        id: "s14-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s14-se1-e1", episodeNumber: 1, title: "Celebration", description: "Logan Roy turns 80 with his family in attendance.", duration: 63, thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/succ-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s15",
    title: "The Boys",
    description: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
    poster: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
    backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1080&fit=crop",
    releaseYear: 2019,
    genre: "Action",
    rating: 8.7,
    views: 18500,
    seasons: [
      {
        id: "s15-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s15-se1-e1", episodeNumber: 1, title: "The Name of the Game", description: "When a Supe kills the love of his life, Hughie joins a vigilante group.", duration: 68, thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/boys-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s16",
    title: "Ozark",
    description: "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
    poster: "https://image.tmdb.org/t/p/w500/pCGyPVrI9Fzw6XIqWStmqFfq0P4.jpg",
    backdrop: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop",
    releaseYear: 2017,
    genre: "Crime",
    rating: 8.5,
    views: 17000,
    seasons: [
      {
        id: "s16-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s16-se1-e1", episodeNumber: 1, title: "Sugarwood", description: "Financial adviser Marty Byrde proposes to make amends for a money-laundering scheme gone wrong.", duration: 67, thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/ozark-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s17",
    title: "Loki",
    description: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
    poster: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
    backdrop: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop",
    releaseYear: 2021,
    genre: "Sci-Fi",
    rating: 8.2,
    views: 16500,
    seasons: [
      {
        id: "s17-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s17-se1-e1", episodeNumber: 1, title: "Glorious Purpose", description: "Loki is brought before the TVA for crimes against the Sacred Timeline.", duration: 51, thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/loki-s1e1" }
        ]
      }
    ]
  },
  {
    id: "s18",
    title: "The Bear",
    description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a heartbreaking death.",
    poster: "https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    backdrop: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop",
    releaseYear: 2022,
    genre: "Drama",
    rating: 8.6,
    views: 12000,
    seasons: [
      {
        id: "s18-se1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { id: "s18-se1-e1", episodeNumber: 1, title: "System", description: "Carmen returns to run his family's sandwich shop.", duration: 28, thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=225&fit=crop", streamUrl: "https://example.com/stream/bear-s1e1" }
        ]
      }
    ]
  }
];

export const genres = [
  "Action",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller"
];

export const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2008, 2000, 1999, 1994, 1972];
