import * as yup from 'yup';

// Esquema para perfil de guía freelance
export const guideProfileSchema = yup.object().shape({
  fullName: yup.string()
    .required('El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  
  dni: yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{8}$/, 'El DNI debe tener 8 dígitos'),
  
  phone: yup.string()
    .required('El teléfono es requerido')
    .matches(/^\+?[0-9\s-()]+$/, 'Formato de teléfono inválido'),
  
  email: yup.string()
    .required('El email es requerido')
    .email('Email inválido'),
  
  address: yup.string()
    .required('La dirección es requerida'),
  
  profile: yup.object().shape({
    bio: yup.string()
      .required('La biografía es requerida')
      .min(50, 'La biografía debe tener al menos 50 caracteres')
      .max(500, 'La biografía no puede exceder 500 caracteres'),
    
    videoPresentation: yup.string()
      .url('URL de video inválida')
      .nullable()
  }),
  
  specializations: yup.object().shape({
    languages: yup.array()
      .of(yup.object().shape({
        code: yup.string().required(),
        level: yup.string()
          .oneOf(['nativo', 'experto', 'avanzado', 'intermedio', 'basico'])
          .required(),
        certified: yup.boolean(),
        certificationDate: yup.date().nullable()
      }))
      .min(1, 'Debe dominar al menos un idioma')
      .required('Los idiomas son requeridos'),
    
    tourTypes: yup.array()
      .of(yup.string().oneOf(['cultural', 'aventura', 'gastronomico', 'mistico', 'fotografico']))
      .min(1, 'Debe seleccionar al menos un tipo de tour')
      .required('Los tipos de tour son requeridos'),
    
    workZones: yup.array()
      .of(yup.string().oneOf(['cusco-ciudad', 'valle-sagrado', 'machu-picchu', 'sur-valle', 'otros']))
      .min(1, 'Debe seleccionar al menos una zona de trabajo')
      .required('Las zonas de trabajo son requeridas'),
    
    groupExperience: yup.object().shape({
      children: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      }),
      schools: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      }),
      elderly: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      }),
      corporate: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      }),
      vip: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      }),
      specialNeeds: yup.object().shape({
        level: yup.string().oneOf(['experto', 'intermedio', 'basico']).required(),
        yearsExperience: yup.number().min(0).required()
      })
    })
  }),
  
  pricing: yup.object().shape({
    hourlyRate: yup.number()
      .required('La tarifa por hora es requerida')
      .min(10, 'La tarifa mínima es S/10')
      .max(200, 'La tarifa máxima es S/200'),
    
    fullDayRate: yup.number()
      .required('La tarifa por día completo es requerida')
      .min(50, 'La tarifa mínima es S/50')
      .max(1000, 'La tarifa máxima es S/1000'),
    
    halfDayRate: yup.number()
      .required('La tarifa por medio día es requerida')
      .min(30, 'La tarifa mínima es S/30')
      .max(500, 'La tarifa máxima es S/500'),
    
    specialRates: yup.array()
      .of(yup.object().shape({
        groupType: yup.string().required(),
        rate: yup.number().min(0).required()
      }))
  }),
  
  preferences: yup.object().shape({
    maxGroupSize: yup.number()
      .required('El tamaño máximo de grupo es requerido')
      .min(1, 'Mínimo 1 persona')
      .max(50, 'Máximo 50 personas'),
    
    minBookingHours: yup.number()
      .required('Las horas mínimas de reserva son requeridas')
      .min(1, 'Mínimo 1 hora')
      .max(8, 'Máximo 8 horas'),
    
    cancellationPolicy: yup.string()
      .required('La política de cancelación es requerida')
      .max(200, 'Máximo 200 caracteres'),
    
    instantBooking: yup.boolean().required(),
    
    requiresDeposit: yup.boolean().required(),
    
    depositPercentage: yup.number()
      .when('requiresDeposit', {
        is: true,
        then: yup.number()
          .required('El porcentaje de depósito es requerido')
          .min(10, 'Mínimo 10%')
          .max(50, 'Máximo 50%'),
        otherwise: yup.number().nullable()
      })
  }),
  
  availability: yup.object().shape({
    workingDays: yup.array()
      .of(yup.string().oneOf(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
      .min(1, 'Debe trabajar al menos un día')
      .required('Los días de trabajo son requeridos'),
    
    advanceBooking: yup.number()
      .required('Los días de anticipación son requeridos')
      .min(0, 'Mínimo 0 días')
      .max(30, 'Máximo 30 días')
  })
});

// Esquema para certificación
export const certificationSchema = yup.object().shape({
  name: yup.string()
    .required('El nombre de la certificación es requerido'),
  
  issuer: yup.string()
    .required('La institución emisora es requerida'),
  
  issueDate: yup.date()
    .required('La fecha de emisión es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  
  expiryDate: yup.date()
    .required('La fecha de vencimiento es requerida')
    .min(yup.ref('issueDate'), 'La fecha de vencimiento debe ser posterior a la emisión'),
  
  documentUrl: yup.string()
    .url('URL inválida')
    .required('El documento es requerido')
});

// Esquema para solicitud de servicio
export const serviceRequestSchema = yup.object().shape({
  guideId: yup.string()
    .required('Debe seleccionar un guía'),
  
  serviceDetails: yup.object().shape({
    type: yup.string()
      .oneOf(['tour', 'transfer', 'custom'])
      .required('El tipo de servicio es requerido'),
    
    date: yup.date()
      .required('La fecha es requerida')
      .min(new Date(), 'La fecha debe ser futura'),
    
    startTime: yup.string()
      .required('La hora de inicio es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    
    endTime: yup.string()
      .required('La hora de fin es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    
    location: yup.string()
      .required('La ubicación es requerida'),
    
    tourName: yup.string()
      .when('type', {
        is: 'tour',
        then: yup.string().required('El nombre del tour es requerido'),
        otherwise: yup.string().nullable()
      }),
    
    groupSize: yup.number()
      .required('El tamaño del grupo es requerido')
      .min(1, 'Mínimo 1 persona')
      .max(50, 'Máximo 50 personas'),
    
    groupType: yup.string()
      .required('El tipo de grupo es requerido'),
    
    specialRequirements: yup.string()
      .max(500, 'Máximo 500 caracteres'),
    
    languages: yup.array()
      .of(yup.string())
      .min(1, 'Debe seleccionar al menos un idioma')
      .required('Los idiomas son requeridos')
  }),
  
  pricing: yup.object().shape({
    proposedRate: yup.number()
      .required('La tarifa propuesta es requerida')
      .min(0, 'La tarifa debe ser positiva'),
    
    paymentTerms: yup.string()
      .required('Los términos de pago son requeridos'),
    
    currency: yup.string()
      .oneOf(['PEN', 'USD'])
      .required('La moneda es requerida')
  })
});

// Esquema para reseña
export const reviewSchema = yup.object().shape({
  ratings: yup.object().shape({
    overall: yup.number()
      .required('La calificación general es requerida')
      .min(1, 'Mínimo 1 estrella')
      .max(5, 'Máximo 5 estrellas'),
    
    communication: yup.number()
      .required('Califique la comunicación')
      .min(1)
      .max(5),
    
    knowledge: yup.number()
      .required('Califique el conocimiento')
      .min(1)
      .max(5),
    
    punctuality: yup.number()
      .required('Califique la puntualidad')
      .min(1)
      .max(5),
    
    professionalism: yup.number()
      .required('Califique el profesionalismo')
      .min(1)
      .max(5),
    
    valueForMoney: yup.number()
      .required('Califique la relación calidad-precio')
      .min(1)
      .max(5)
  }),
  
  review: yup.object().shape({
    title: yup.string()
      .required('El título es requerido')
      .min(5, 'Mínimo 5 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    
    content: yup.string()
      .required('El comentario es requerido')
      .min(20, 'Mínimo 20 caracteres')
      .max(1000, 'Máximo 1000 caracteres'),
    
    wouldRecommend: yup.boolean()
      .required('Indique si recomendaría al guía'),
    
    wouldHireAgain: yup.boolean()
      .required('Indique si contrataría nuevamente')
  })
});

// Esquema para filtros de búsqueda
export const searchFiltersSchema = yup.object().shape({
  languages: yup.array().of(yup.string()),
  tourTypes: yup.array().of(yup.string()),
  workZones: yup.array().of(yup.string()),
  groupTypes: yup.array().of(yup.string()),
  priceRange: yup.object().shape({
    min: yup.number().min(0),
    max: yup.number().min(0)
  }),
  rating: yup.number().min(0).max(5),
  availability: yup.date().nullable(),
  instantBooking: yup.boolean(),
  verified: yup.boolean()
});

// Esquema para disponibilidad del calendario
export const availabilitySlotSchema = yup.object().shape({
  date: yup.date().required(),
  slots: yup.array().of(
    yup.object().shape({
      startTime: yup.string()
        .required()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: yup.string()
        .required()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      available: yup.boolean().required()
    })
  )
});

// Esquema para mensaje en solicitud
export const messageSchema = yup.object().shape({
  message: yup.string()
    .required('El mensaje es requerido')
    .min(1, 'El mensaje no puede estar vacío')
    .max(500, 'Máximo 500 caracteres')
});