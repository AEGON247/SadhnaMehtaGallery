export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  price: number;
  section: 'portraits' | 'landscapes' | 'abstracts';
  imageUrl?: string;
  rotationY: number; // Y-rotation angle in degrees
  // 3D positioning coordinates relative to the corridor path
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export const artworkData: Record<string, Artwork> = {
  // --- PORTRAITS SECTION (Segment 1: Z: 0 to -3800, X: 0, Y-Rot: 0) ---
  'portrait-1': {
    id: 'portrait-1',
    title: "Soul's Mirror",
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '80 x 100 cm',
    description: 'A contemplative portrait exploring the depths of human introspection. This piece captures the essence of self-reflection through carefully layered brushstrokes and a harmonious color palette.',
    price: 250000,
    section: 'portraits',
    imageUrl: '/assets/portrait-1.jpeg',
    rotationY: 90, // Left wall
    position: { x: -380, y: 0, z: -1400 }
  },
  'portrait-2': {
    id: 'portrait-2',
    title: 'Gentle Gaze',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Acrylic on Canvas',
    dimensions: '75 x 95 cm',
    description: "A serene portrait that radiates calm and warmth. The subject's eyes convey a story of peaceful contemplation and inner strength.",
    price: 220000,
    section: 'portraits',
    imageUrl: '/assets/portrait-2.jpeg',
    rotationY: -90, // Right wall
    position: { x: 380, y: 0, z: -1800 }
  },
  'portrait-3': {
    id: 'portrait-3',
    title: 'Whispers of Time',
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Mixed Media',
    dimensions: '85 x 105 cm',
    description: 'This portrait blends traditional portraiture with contemporary techniques, creating a striking visual narrative about the passage of time.',
    price: 300000,
    section: 'portraits',
    imageUrl: '/assets/portrait-3.jpeg',
    rotationY: 90, // Left wall
    position: { x: -380, y: 0, z: -2200 }
  },
  'portrait-4': {
    id: 'portrait-4',
    title: 'Golden Hour',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '80 x 100 cm',
    description: 'Bathed in the warm glow of evening light, this portrait captures a fleeting moment of beauty and tranquility.',
    price: 280000,
    section: 'portraits',
    imageUrl: '/assets/portrait-4.jpeg',
    rotationY: -90, // Right wall
    position: { x: 380, y: 0, z: -2600 }
  },
  'portrait-5': {
    id: 'portrait-5',
    title: 'Essence of Being',
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Watercolor on Paper',
    dimensions: '70 x 90 cm',
    description: 'An ethereal portrait rendered with delicate watercolor techniques, expressing the innermost essence of the subject.',
    price: 180000,
    section: 'portraits',
    imageUrl: '/assets/portrait-5.jpeg',
    rotationY: 90, // Left wall
    position: { x: -380, y: 0, z: -3000 }
  },
  'portrait-6': {
    id: 'portrait-6',
    title: 'Strength and Grace',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '85 x 105 cm',
    description: 'A powerful portrait that combines bold technique with refined elegance, celebrating human dignity and character.',
    price: 320000,
    section: 'portraits',
    imageUrl: '/assets/portrait-6.jpeg',
    rotationY: -90, // Right wall
    position: { x: 380, y: 0, z: -3400 }
  },

  // --- LANDSCAPES SECTION (Segment 2: X: 0 to -3800, Z: -3800, Y-Rot: 90) ---
  // Left wall of Segment 2 is at Z = -3420 (facing -Z, rotationY: 180)
  // Right wall of Segment 2 is at Z = -4180 (facing +Z, rotationY: 0)
  'landscape-1': {
    id: 'landscape-1',
    title: "Mountain's Call",
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '100 x 80 cm',
    description: 'Majestic peaks rise against a pristine sky in this breathtaking landscape. The interplay of light and shadow creates depth and drama.',
    price: 280000,
    section: 'landscapes',
    rotationY: 180, // Left wall
    position: { x: -1000, y: 0, z: -3420 }
  },
  'landscape-2': {
    id: 'landscape-2',
    title: 'Sunset Symphony',
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Acrylic on Canvas',
    dimensions: '95 x 75 cm',
    description: 'A harmonious blend of warm hues capturing the magical moment when day transforms into night. Colors dance across the canvas in perfect balance.',
    price: 240000,
    section: 'landscapes',
    rotationY: 0, // Right wall
    position: { x: -1400, y: 0, z: -4180 }
  },
  'landscape-3': {
    id: 'landscape-3',
    title: 'Forest Whispers',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Mixed Media',
    dimensions: '90 x 110 cm',
    description: 'Deep within the woodland realm, nature speaks through layered textures and earthy tones. A meditation on wilderness and solitude.',
    price: 310000,
    section: 'landscapes',
    rotationY: 180, // Left wall
    position: { x: -1800, y: 0, z: -3420 }
  },
  'landscape-4': {
    id: 'landscape-4',
    title: "Ocean's Embrace",
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Oil on Canvas',
    dimensions: '100 x 80 cm',
    description: 'The vastness of the sea captured in flowing brushstrokes. Waves dance with light, creating a sense of movement and freedom.',
    price: 290000,
    section: 'landscapes',
    rotationY: 0, // Right wall
    position: { x: -2200, y: 0, z: -4180 }
  },
  'landscape-5': {
    id: 'landscape-5',
    title: 'Desert Bloom',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Watercolor on Paper',
    dimensions: '80 x 100 cm',
    description: 'Life blooms in unexpected places. This landscape captures the resilience and beauty found in arid landscapes at dawn.',
    price: 210000,
    section: 'landscapes',
    rotationY: 180, // Left wall
    position: { x: -2600, y: 0, z: -3420 }
  },
  'landscape-6': {
    id: 'landscape-6',
    title: "Meadow's Dream",
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '95 x 75 cm',
    description: 'Rolling meadows stretch toward distant horizons in this pastoral landscape. A celebration of nature\'s peaceful abundance.',
    price: 260000,
    section: 'landscapes',
    rotationY: 0, // Right wall
    position: { x: -3000, y: 0, z: -4180 }
  },

  // --- ABSTRACTS SECTION (Segment 3: Z: -3800 to -7800, X: -3800, Y-Rot: 0) ---
  // Left wall of Segment 3 is at X = -4180 (facing +X, rotationY: 90)
  // Right wall of Segment 3 is at X = -3420 (facing -X, rotationY: -90)
  'abstract-1': {
    id: 'abstract-1',
    title: 'Cosmic Dance',
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Acrylic on Canvas',
    dimensions: '100 x 100 cm',
    description: 'An explosion of color and form representing the chaotic beauty of the universe. Lines and shapes intertwine in cosmic harmony.',
    price: 220000,
    section: 'abstracts',
    rotationY: 90, // Left wall
    position: { x: -4180, y: 0, z: -4600 }
  },
  'abstract-2': {
    id: 'abstract-2',
    title: 'Urban Energy',
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Mixed Media',
    dimensions: '95 x 95 cm',
    description: 'Pulsing with vibrant energy, this abstract work captures the rhythm and dynamism of modern urban life.',
    price: 250000,
    section: 'abstracts',
    rotationY: -90, // Right wall
    position: { x: -3420, y: 0, z: -5000 }
  },
  'abstract-3': {
    id: 'abstract-3',
    title: "Serenity's Echo",
    artist: 'Sadhna Mehta',
    year: 2024,
    medium: 'Oil on Canvas',
    dimensions: '90 x 90 cm',
    description: 'Gentle waves of calm wash across the canvas. Soft colors and flowing forms evoke a sense of inner peace and meditation.',
    price: 230000,
    section: 'abstracts',
    rotationY: 90, // Left wall
    position: { x: -4180, y: 0, z: -5400 }
  },
  'abstract-4': {
    id: 'abstract-4',
    title: 'Fragmented Light',
    artist: 'Sadhna Mehta',
    year: 2023,
    medium: 'Digital Art & Mixed Media',
    dimensions: '85 x 85 cm',
    description: 'Light breaks into infinite fragments creating a kaleidoscopic effect. This piece explores the nature of perception and transformation.',
    price: 190000,
    section: 'abstracts',
    rotationY: -90, // Right wall
    position: { x: -3420, y: 0, z: -5800 }
  }
};

export const artworksList = Object.values(artworkData);

// Section Depth Mappings for scroll progress path solver
export const sectionDepths = {
  entrance: 0,
  portraits: 1400,
  landscapes: 5800,
  abstracts: 10400,
  contact: 13450
};
