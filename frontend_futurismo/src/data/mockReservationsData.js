import { RESERVATION_STATUS_SPANISH, PAYMENT_STATUS_SPANISH } from '../constants/reservationConstants';

export const mockReservations = [
  {
    id: 'RES001',
    tourName: 'City Tour Lima Histórica',
    clientName: 'Juan Pérez',
    clientPhone: '+51 987654321',
    date: new Date('2024-02-15'),
    time: '09:00',
    adults: 2,
    children: 1,
    total: 105,
    status: RESERVATION_STATUS_SPANISH.confirmada,
    pickupLocation: 'Hotel Marriott Miraflores',
    createdAt: new Date('2024-02-01'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [
      {
        id: '1',
        name: 'Juan Pérez',
        documentType: 'DNI',
        documentNumber: '12345678',
        phone: '+51 987654321'
      },
      {
        id: '2',
        name: 'María Pérez',
        documentType: 'DNI',
        documentNumber: '87654321',
        phone: '+51 987654321'
      },
      {
        id: '3',
        name: 'Carlos García',
        documentType: 'DNI',
        documentNumber: '11223344',
        phone: '+51 987654322'
      }
    ],
    groups: [
      {
        representativeName: 'Juan Pérez',
        representativePhone: '+51 987654321',
        companionsCount: 2
      },
      {
        representativeName: 'Carlos García',
        representativePhone: '+51 987654322',
        companionsCount: 1
      }
    ],
    isRated: false
  },
  {
    id: 'RES002',
    tourName: 'Tour Gastronómico Miraflores',
    clientName: 'María García',
    clientPhone: '+51 976543210',
    date: new Date('2024-02-16'),
    time: '12:00',
    adults: 4,
    children: 0,
    total: 260,
    status: RESERVATION_STATUS_SPANISH.pendiente,
    pickupLocation: 'Parque Kennedy',
    createdAt: new Date('2024-02-05'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pendiente,
    tourists: [
      {
        id: '4',
        name: 'María García',
        documentType: 'DNI',
        documentNumber: '22334455',
        phone: '+51 976543210'
      },
      {
        id: '5',
        name: 'Ana García',
        documentType: 'DNI',
        documentNumber: '33445566',
        phone: '+51 976543210'
      },
      {
        id: '6',
        name: 'Luis García',
        documentType: 'DNI',
        documentNumber: '44556677',
        phone: '+51 976543210'
      },
      {
        id: '7',
        name: 'Pedro García',
        documentType: 'DNI',
        documentNumber: '55667788',
        phone: '+51 976543210'
      }
    ],
    groups: [
      {
        representativeName: 'María García',
        representativePhone: '+51 976543210',
        companionsCount: 3
      }
    ],
    isRated: true
  },
  {
    id: 'RES003',
    tourName: 'Islas Palomino',
    clientName: 'Carlos Rodríguez',
    clientPhone: '+51 965432198',
    date: new Date('2024-02-18'),
    time: '06:00',
    adults: 3,
    children: 2,
    total: 340,
    status: RESERVATION_STATUS_SPANISH.completada,
    pickupLocation: 'Hotel Hilton',
    createdAt: new Date('2024-02-08'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [
      {
        id: '8',
        name: 'Carlos Rodríguez',
        documentType: 'DNI',
        documentNumber: '66778899',
        phone: '+51 965432198'
      },
      {
        id: '9',
        name: 'Sofia Rodríguez',
        documentType: 'DNI',
        documentNumber: '77889900',
        phone: '+51 965432198'
      },
      {
        id: '10',
        name: 'Miguel Rodríguez',
        documentType: 'DNI',
        documentNumber: '88990011',
        phone: '+51 965432198'
      },
      {
        id: '11',
        name: 'Elena Rodríguez',
        documentType: 'DNI',
        documentNumber: '99001122',
        phone: '+51 965432198'
      },
      {
        id: '12',
        name: 'Pablo Rodríguez',
        documentType: 'DNI',
        documentNumber: '00112233',
        phone: '+51 965432198'
      }
    ],
    groups: [],
    isRated: false
  },
  {
    id: 'RES004',
    tourName: 'Pachacámac y Barranco',
    clientName: 'Ana López',
    clientPhone: '+51 954321876',
    date: new Date('2024-02-14'),
    time: '14:00',
    adults: 2,
    children: 0,
    total: 90,
    status: RESERVATION_STATUS_SPANISH.cancelada,
    pickupLocation: 'JW Marriott',
    createdAt: new Date('2024-01-28'),
    paymentStatus: PAYMENT_STATUS_SPANISH.reembolsado,
    tourists: [
      {
        id: '13',
        name: 'Ana López',
        documentType: 'DNI',
        documentNumber: '11223344',
        phone: '+51 954321876'
      },
      {
        id: '14',
        name: 'Roberto López',
        documentType: 'DNI',
        documentNumber: '22334455',
        phone: '+51 954321876'
      }
    ],
    groups: [],
    isRated: false
  },
  {
    id: 'RES005',
    tourName: 'Tour de Museos Lima',
    clientName: 'Luis Martínez',
    clientPhone: '+51 943210987',
    date: new Date('2024-02-19'),
    time: '10:00',
    adults: 2,
    children: 0,
    total: 90,
    status: RESERVATION_STATUS_SPANISH.confirmada,
    pickupLocation: 'Plaza de Armas',
    createdAt: new Date('2024-02-10'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES006',
    tourName: 'City Tour Barranco Bohemio',
    clientName: 'Sofía Ramírez',
    clientPhone: '+51 932109876',
    date: new Date('2024-02-20'),
    time: '15:00',
    adults: 5,
    children: 3,
    total: 180,
    status: RESERVATION_STATUS_SPANISH.en_proceso,
    pickupLocation: 'Puente de los Suspiros',
    createdAt: new Date('2024-02-12'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pendiente,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES007',
    tourName: 'Tour Nocturno Lima',
    clientName: 'Diego Fernández',
    clientPhone: '+51 921098765',
    date: new Date('2024-02-21'),
    time: '19:00',
    adults: 4,
    children: 0,
    total: 200,
    status: RESERVATION_STATUS_SPANISH.confirmada,
    pickupLocation: 'Hotel Country Club',
    createdAt: new Date('2024-02-14'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES008',
    tourName: 'Tour Islas Palomino',
    clientName: 'Patricia Torres',
    clientPhone: '+51 910987654',
    date: new Date('2024-02-22'),
    time: '07:00',
    adults: 6,
    children: 2,
    total: 340,
    status: RESERVATION_STATUS_SPANISH.pendiente,
    pickupLocation: 'Marina del Callao',
    createdAt: new Date('2024-02-15'),
    paymentStatus: PAYMENT_STATUS_SPANISH.parcial,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES009',
    tourName: 'Tour Caral Ciudad Sagrada',
    clientName: 'Roberto Silva',
    clientPhone: '+51 909876543',
    date: new Date('2024-02-23'),
    time: '06:00',
    adults: 8,
    children: 4,
    total: 480,
    status: RESERVATION_STATUS_SPANISH.confirmada,
    pickupLocation: 'Hotel JW Marriott',
    createdAt: new Date('2024-02-16'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [],
    groups: [],
    isRated: true
  },
  {
    id: 'RES010',
    tourName: 'Tour de Compras Lima',
    clientName: 'Valeria Castro',
    clientPhone: '+51 898765432',
    date: new Date('2024-02-24'),
    time: '11:00',
    adults: 3,
    children: 1,
    total: 85,
    status: RESERVATION_STATUS_SPANISH.cancelada,
    pickupLocation: 'Centro Comercial Jockey Plaza',
    createdAt: new Date('2024-02-17'),
    paymentStatus: PAYMENT_STATUS_SPANISH.reembolsado,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES011',
    tourName: 'Tour Aventura Lunahuaná',
    clientName: 'Miguel Vargas',
    clientPhone: '+51 887654321',
    date: new Date('2024-02-25'),
    time: '05:00',
    adults: 10,
    children: 0,
    total: 850,
    status: RESERVATION_STATUS_SPANISH.confirmada,
    pickupLocation: 'Hotel Swissôtel',
    createdAt: new Date('2024-02-18'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pagado,
    tourists: [],
    groups: [],
    isRated: false
  },
  {
    id: 'RES012',
    tourName: 'Tour Paracas Ica',
    clientName: 'Claudia Mendoza',
    clientPhone: '+51 876543210',
    date: new Date('2024-02-26'),
    time: '04:30',
    adults: 12,
    children: 6,
    total: 1080,
    status: RESERVATION_STATUS_SPANISH.pendiente,
    pickupLocation: 'Aeropuerto Jorge Chávez',
    createdAt: new Date('2024-02-19'),
    paymentStatus: PAYMENT_STATUS_SPANISH.pendiente,
    tourists: [],
    groups: [],
    isRated: false
  }
];