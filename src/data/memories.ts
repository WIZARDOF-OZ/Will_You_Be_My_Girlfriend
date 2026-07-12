export interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  contributor: string;
  date: string;
  tags: string[];
}

export const memoriesData: Memory[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Our first trip to the beach together! The sunset was absolutely magical.",
    contributor: "You",
    date: "2023-06-15",
    tags: ["travel", "beach", "sunset"]
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "That time we tried to bake a cake and ended up ordering pizza instead.",
    contributor: "Me",
    date: "2023-08-22",
    tags: ["funny", "food", "home"]
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Coffee dates are the best dates.",
    contributor: "You",
    date: "2023-11-05",
    tags: ["coffee", "date"]
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Looking at the stars.",
    contributor: "Me",
    date: "2024-01-14",
    tags: ["night", "romantic"]
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Party time! Happy birthday!",
    contributor: "You",
    date: "2024-03-10",
    tags: ["party", "celebration"]
  }
];
