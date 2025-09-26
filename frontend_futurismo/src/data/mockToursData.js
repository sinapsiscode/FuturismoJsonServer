export const TOUR_TYPES = {
  REGULAR: 'regular',
  FULLDAY: 'fullday'
};

export const mockAvailableTours = [
  { 
    id: '1', 
    name: 'City Tour Lima Histórica', 
    price: 35, 
    duration: 4, 
    type: TOUR_TYPES.REGULAR 
  },
  { 
    id: '2', 
    name: 'Tour Gastronómico Miraflores', 
    price: 65, 
    duration: 5, 
    type: TOUR_TYPES.REGULAR 
  },
  { 
    id: '3', 
    name: 'Pachacámac y Barranco', 
    price: 45, 
    duration: 6, 
    type: TOUR_TYPES.REGULAR 
  },
  { 
    id: '4', 
    name: 'Islas Palomino', 
    price: 85, 
    duration: 8, 
    type: TOUR_TYPES.FULLDAY 
  },
  { 
    id: '5', 
    name: 'Machu Picchu Full Day', 
    price: 180, 
    duration: 12, 
    type: TOUR_TYPES.FULLDAY 
  },
  { 
    id: '6', 
    name: 'Valle Sagrado Full Day', 
    price: 150, 
    duration: 10, 
    type: TOUR_TYPES.FULLDAY 
  }
];