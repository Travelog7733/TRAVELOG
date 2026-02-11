
import { Activity } from "../types";

export interface TourTemplate {
  id: string;
  name: string;
  region: 'HANOI' | 'DANANG' | 'PHU QUOC' | 'HCMC';
  description: string;
  activities: Omit<Activity, 'id'>[];
}

export const VIETNAM_TEMPLATES: TourTemplate[] = [
  // HANOI REGION
  {
    id: 'T-HN1',
    name: 'HANOI CITY TOUR - FULL DAY',
    region: 'HANOI',
    description: 'Comprehensive historical journey through the capital.',
    activities: [
      { name: 'Ho Chi Minh Complex Visit', startTime: '08:00', category: 'Sightseeing', notes: 'Mausoleum, One Pillar Pagoda, and the House on Stilts.' },
      { name: 'Temple of Literature', startTime: '10:30', category: 'Sightseeing', notes: 'Vietnam\'s first university.' },
      { name: 'Traditional Vietnamese Lunch', startTime: '12:30', category: 'Food', notes: 'Authentic local cuisine.' },
      { name: 'Museum of Ethnology', startTime: '14:30', category: 'Sightseeing', notes: 'Learn about the 54 ethnic groups.' },
      { name: 'Hoan Kiem Lake & Old Quarter', startTime: '16:30', category: 'Sightseeing', notes: 'Heart of the city walk.' }
    ]
  },
  {
    id: 'T-HN2',
    name: 'HANOI CITY TOUR - HALF DAY - MORNING',
    region: 'HANOI',
    description: 'Morning highlights of the thousand-year-old city.',
    activities: [
      { name: 'Ho Chi Minh Mausoleum', startTime: '08:00', category: 'Sightseeing', notes: 'Morning visit to the resting place of Uncle Ho.' },
      { name: 'One Pillar Pagoda', startTime: '09:30', category: 'Sightseeing', notes: 'Unique Buddhist temple architecture.' },
      { name: 'Tran Quoc Pagoda', startTime: '10:30', category: 'Sightseeing', notes: 'Oldest pagoda in Hanoi on West Lake.' }
    ]
  },
  {
    id: 'T-HN4',
    name: 'HANOI CITY TOUR - JEEP - MORNING / AFTERNOON / EVENING',
    region: 'HANOI',
    description: 'Adventure through the backstreets in a vintage army jeep.',
    activities: [
      { name: 'Jeep Pickup & Alleys Explore', startTime: '08:30', category: 'Transport', notes: 'Winding through hidden Hanoi.' },
      { name: 'Railway Village Visit', startTime: '10:00', category: 'Sightseeing', notes: 'The famous train street.' },
      { name: 'Long Bien Bridge Crossing', startTime: '11:00', category: 'Sightseeing', notes: 'Iconic French-built bridge.' },
      { name: 'Egg Coffee Tasting', startTime: '12:00', category: 'Food', notes: 'Hanoi specialty stop.' }
    ]
  },
  {
    id: 'T-HN5',
    name: 'INCENSE VILLAGE + CONICAL VILLAGE - HALF DAY - AFTERNOON',
    region: 'HANOI',
    description: 'Colorful photography and craft heritage tour.',
    activities: [
      { name: 'Quang Phu Cau Incense Village', startTime: '13:30', category: 'Sightseeing', notes: 'Stunning displays of colorful incense sticks.' },
      { name: 'Chuong Conical Hat Village', startTime: '15:30', category: 'Sightseeing', notes: 'See the making of the traditional Non La.' }
    ]
  },
  {
    id: 'T-HN6',
    name: 'NINH BINH - HOA LU - TRANG AN (WITH LUNCH) - FULL DAY',
    region: 'HANOI',
    description: 'UNESCO heritage river and cave exploration.',
    activities: [
      { name: 'Hoa Lu Ancient Capital', startTime: '10:00', category: 'Sightseeing', notes: 'Temples of Dinh and Le dynasties.' },
      { name: 'Local Specialty Lunch', startTime: '12:30', category: 'Food', notes: 'Try the famous goat meat dishes.' },
      { name: 'Trang An Sampan Ride', startTime: '14:00', category: 'Sightseeing', notes: 'Paddling through stunning river caves.' }
    ]
  },
  {
    id: 'T-HN8',
    name: 'HALONG BAY - APPOLO 5 STAR LUXURY CRUISE - FULL DAY TOUR',
    region: 'HANOI',
    description: 'Luxury day sailing through the world-famous UNESCO site.',
    activities: [
      { name: 'Harbor Boarding', startTime: '11:45', category: 'Other', notes: 'Welcome and safety briefing.' },
      { name: 'Gourmet Buffet Lunch', startTime: '12:15', category: 'Food', notes: 'Sailing past fighting cocks islets.' },
      { name: 'Sung Sot Cave', startTime: '14:00', category: 'Sightseeing', notes: 'Largest cavern in the bay.' },
      { name: 'Titop Island Hike', startTime: '15:30', category: 'Sightseeing', notes: 'Panoramic viewpoint ascent.' }
    ]
  },
  {
    id: 'T-HN10',
    name: 'HALONG BAY OVERNIGHT CRUISE (2 DAY 1 NIGHT) - VERDURE LOTUS',
    region: 'HANOI',
    description: 'A premium stay on the emerald waters.',
    activities: [
      { name: 'Day 1: Embarkation & Lunch', startTime: '12:00', category: 'Stay', notes: 'Check into your luxury cabin.' },
      { name: 'Day 1: Kayaking & Sunset', startTime: '15:30', category: 'Sightseeing', notes: 'Sunset party on the sundeck.' },
      { name: 'Day 2: Tai Chi & Brunch', startTime: '06:30', category: 'Other', notes: 'Morning ritual and breakfast.' }
    ]
  },

  // DANANG REGION
  {
    id: 'T-DN1',
    name: 'BA NA HILLS – GOLDEN BRIDGE FULL DAY TOUR (with lunch)',
    region: 'DANANG',
    description: 'Iconic Hand Bridge and French Village.',
    activities: [
      { name: 'Cable Car to Ba Na Hills', startTime: '09:00', category: 'Transport', notes: 'Breathtaking mountain ascent.' },
      { name: 'Golden Bridge (Hand Bridge)', startTime: '10:00', category: 'Sightseeing', notes: 'A walk on the clouds.' },
      { name: 'International Buffet Lunch', startTime: '12:30', category: 'Food', notes: 'Gourmet buffet at Mercure.' },
      { name: 'Fantasy Park & Gardens', startTime: '14:30', category: 'Other', notes: 'Explore the 9 flower gardens.' }
    ]
  },
  {
    id: 'T-DN4',
    name: 'MY SON HOLYLAND & RICE PAPER MAKING DELUXE MORNING',
    region: 'DANANG',
    description: 'History and craft combined.',
    activities: [
      { name: 'My Son Sanctuary Tour', startTime: '09:00', category: 'Sightseeing', notes: 'Ancient Champa ruins.' },
      { name: 'Rice Paper Crafting', startTime: '11:30', category: 'Other', notes: 'Traditional workshop.' },
      { name: 'Danang Local Lunch', startTime: '13:00', category: 'Food', notes: 'Authentic regional meal.' }
    ]
  },
  {
    id: 'T-DN7',
    name: 'HAI VAN PASS & HUE CITY EXPLORE FULL DAY TOUR',
    region: 'DANANG',
    description: 'Imperial history and scenic passes.',
    activities: [
      { name: 'Hai Van Pass Photo Stop', startTime: '08:30', category: 'Sightseeing', notes: 'Ocean Cloud Pass.' },
      { name: 'Hue Citadel Discovery', startTime: '11:00', category: 'Sightseeing', notes: 'Forbidden Purple City.' },
      { name: 'Thien Mu Pagoda', startTime: '14:00', category: 'Sightseeing', notes: 'Iconic 7-story temple.' },
      { name: 'Khai Dinh Tomb', startTime: '15:30', category: 'Sightseeing', notes: 'Stunning mosaic architecture.' }
    ]
  },
  {
    id: 'T-DN11',
    name: 'HOI AN CITY TOUR – BOAT RIDE – RELEASE FLOWER LANTERN',
    region: 'DANANG',
    description: 'The magical evening charm of Hoi An.',
    activities: [
      { name: 'Ancient Town Walking Tour', startTime: '16:00', category: 'Sightseeing', notes: 'Japanese Bridge and Old Houses.' },
      { name: 'River Boat Ride', startTime: '18:30', category: 'Sightseeing', notes: 'Lantern release on Hoai River.' },
      { name: 'Hoi An Set Dinner', startTime: '19:30', category: 'Food', notes: 'Local specialties: Cao Lau, White Rose.' }
    ]
  },

  // PHU QUOC REGION
  {
    id: 'T-PQ1',
    name: 'STARFISH BEACH + GRAND WORLD - FULL DAY TOUR',
    region: 'PHU QUOC',
    description: 'Nature meets entertainment.',
    activities: [
      { name: 'Starfish Beach Visit', startTime: '09:30', category: 'Sightseeing', notes: 'Crystal waters and starfish.' },
      { name: 'Grand World City Tour', startTime: '14:00', category: 'Sightseeing', notes: 'Explore the "City of Festivals".' },
      { name: 'Teddy Bear Museum', startTime: '16:00', category: 'Other', notes: 'Whimsical tour for all ages.' }
    ]
  },
  {
    id: 'T-PQ3',
    name: '4 ISLANDS HOPPING TOUR + KISS BRIDGE - FULL DAY TOUR',
    region: 'PHU QUOC',
    description: 'The ultimate island adventure.',
    activities: [
      { name: 'Speedboat to Mong Tay', startTime: '09:00', category: 'Transport', notes: 'Pure white beach landing.' },
      { name: 'Gam Ghi Snorkeling', startTime: '11:00', category: 'Sightseeing', notes: 'Coral kingdom exploration.' },
      { name: 'May Rut Island Lunch', startTime: '13:00', category: 'Food', notes: 'BBQ seafood on the beach.' },
      { name: 'Kiss Bridge Walk', startTime: '16:30', category: 'Sightseeing', notes: 'The iconic sunset landmark.' }
    ]
  },
  {
    id: 'T-PQ8',
    name: 'VINWONDER + VINPEARL SAFARI - FULL DAY TOUR',
    region: 'PHU QUOC',
    description: 'Double the fun at Vietnam\'s top theme parks.',
    activities: [
      { name: 'Vinpearl Safari Morning', startTime: '09:00', category: 'Sightseeing', notes: 'Wildlife safari bus tour.' },
      { name: 'VinWonders Afternoon', startTime: '13:30', category: 'Other', notes: 'Rides, water park, and aquarium.' }
    ]
  },

  // HCMC REGION
  {
    id: 'T-HC1',
    name: 'MEKONG DELTA - FULL DAY',
    region: 'HCMC',
    description: 'Traditional river life exploration.',
    activities: [
      { name: 'Vinh Trang Pagoda', startTime: '09:30', category: 'Sightseeing', notes: 'Beautiful Buddhist temple.' },
      { name: 'River Boat Cruise', startTime: '11:00', category: 'Transport', notes: 'Passing island orchards.' },
      { name: 'Sampan Narrow Canal Ride', startTime: '14:00', category: 'Sightseeing', notes: 'Row through coconut palm canals.' },
      { name: 'Coconut Candy Workshop', startTime: '15:30', category: 'Other', notes: 'Local craft demonstration.' }
    ]
  },
  {
    id: 'T-HC2',
    name: 'CUCHI TUNNEL - HALF DAY - MORNING / AFTERNOON',
    region: 'HCMC',
    description: 'Legendary war history tunnels.',
    activities: [
      { name: 'Cu Chi Tunnels Guided Walk', startTime: '09:30', category: 'Sightseeing', notes: 'Walk through history.' },
      { name: 'Trap & Tank Displays', startTime: '10:30', category: 'Sightseeing', notes: 'Defensive systems artifacts.' },
      { name: 'Wartime Tapioca Tasting', startTime: '11:30', category: 'Food', notes: 'Taste the resistance diet.' }
    ]
  },
  {
    id: 'T-HC6',
    name: 'CUCHI TUNNEL + MEKONG DELTA - FULL DAY',
    region: 'HCMC',
    description: 'The best of history and nature in one day.',
    activities: [
      { name: 'Cu Chi Tunnels Discovery', startTime: '08:30', category: 'Sightseeing', notes: 'Morning history exploration.' },
      { name: 'Specialty Lunch', startTime: '12:00', category: 'Food', notes: 'Elephant ear fish feast.' },
      { name: 'Mekong Highlights', startTime: '14:00', category: 'Sightseeing', notes: 'Boat trip and island visit.' }
    ]
  },
  {
    id: 'T-HC11',
    name: 'SAIGON STEET FOOD TOUR BY BIKE - EVENING',
    region: 'HCMC',
    description: 'Taste the real city flavor on two wheels.',
    activities: [
      { name: 'Scooter Pickup', startTime: '18:00', category: 'Transport', notes: 'Start your evening adventure.' },
      { name: 'Street Food Crawl', startTime: '19:00', category: 'Food', notes: '8 dishes across different districts.' },
      { name: 'City Skyline Night View', startTime: '21:00', category: 'Sightseeing', notes: 'Skyline view from Thu Thiem.' }
    ]
  }
];
