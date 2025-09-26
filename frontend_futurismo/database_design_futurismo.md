# Diseño de Base de Datos - Sistema Futurismo

## Resumen Ejecutivo

Este documento presenta el diseño completo de la base de datos para el sistema Futurismo, una plataforma integral de gestión turística que incluye:

- Gestión de usuarios multi-rol (admin, agencias, guías, clientes)
- Sistema de reservas y tours
- Gestión de vehículos y conductores
- Marketplace de guías freelance
- Sistema de recompensas y puntos
- Protocolos de emergencia
- Sistema financiero
- Chat y notificaciones
- Análisis y reportes

## Arquitectura de Base de Datos

**Motor Recomendado:** PostgreSQL 14+
**Motivo:** Soporte nativo para JSON, arrays, funciones geoespaciales, transacciones ACID, escalabilidad horizontal

---

## 1. TABLA PRINCIPAL DE USUARIOS

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- bcrypt hash
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'agency', 'guide', 'guide-planta', 'guide-freelance', 'driver', 'client')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    
    -- Información personal básica
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar TEXT, -- URL de la imagen
    
    -- Metadatos del sistema
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Índices
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_check CHECK (phone ~ '^\+?[0-9\s\-\(\)]+$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

## 2. GESTIÓN DE PERFILES ESPECÍFICOS

### user_profiles
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Datos personales extendidos
    dni VARCHAR(20),
    passport VARCHAR(20),
    birth_date DATE,
    nationality VARCHAR(50),
    address TEXT,
    emergency_contact JSONB, -- {name, relationship, phone}
    
    -- Configuraciones
    preferences JSONB DEFAULT '{}', -- idioma, moneda, timezone, formato fecha
    privacy_settings JSONB DEFAULT '{}', -- visibilidad perfil, mostrar email/teléfono
    notification_settings JSONB DEFAULT '{}', -- email, push, sms preferences
    
    -- Datos específicos por rol (JSONB para flexibilidad)
    role_data JSONB DEFAULT '{}',
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_profile UNIQUE(user_id)
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_dni ON user_profiles(dni);
```

### agencies
```sql
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información de la empresa
    business_name VARCHAR(255) NOT NULL,
    commercial_name VARCHAR(255),
    ruc VARCHAR(20) UNIQUE NOT NULL,
    website VARCHAR(255),
    
    -- Dirección
    address_street TEXT NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_postal_code VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'Peru',
    
    -- Contacto comercial
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_position VARCHAR(100),
    
    -- Configuración financiera
    credit_limit DECIMAL(12,2) DEFAULT 0,
    credit_used DECIMAL(12,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30, -- días
    preferred_payment_method VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Sistema de puntos
    points_balance INTEGER DEFAULT 0,
    points_total_earned INTEGER DEFAULT 0,
    points_total_redeemed INTEGER DEFAULT 0,
    points_tier VARCHAR(20) DEFAULT 'bronze' CHECK (points_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    
    -- Estado y metadatos
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_documents JSONB DEFAULT '[]', -- URLs de documentos
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_agency_user UNIQUE(user_id),
    CONSTRAINT agency_ruc_check CHECK (ruc ~ '^[0-9]{11}$')
);

CREATE INDEX idx_agencies_ruc ON agencies(ruc);
CREATE INDEX idx_agencies_status ON agencies(status);
CREATE INDEX idx_agencies_points_tier ON agencies(points_tier);
```

### guides
```sql
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información profesional
    guide_type VARCHAR(20) NOT NULL CHECK (guide_type IN ('planta', 'freelance')),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    years_experience INTEGER DEFAULT 0,
    
    -- Información personal extendida
    bio TEXT,
    video_presentation TEXT, -- URL del video
    highlights TEXT[], -- Array de puntos destacados
    photos TEXT[], -- URLs de fotos del perfil
    
    -- Estado y disponibilidad
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vacation', 'suspended')),
    verified BOOLEAN DEFAULT FALSE,
    badges TEXT[] DEFAULT '{}', -- Array de badges del marketplace
    
    -- Preferencias de trabajo
    max_group_size INTEGER DEFAULT 50,
    min_booking_hours INTEGER DEFAULT 1,
    advance_booking_days INTEGER DEFAULT 1,
    instant_booking BOOLEAN DEFAULT FALSE,
    requires_deposit BOOLEAN DEFAULT FALSE,
    deposit_percentage INTEGER CHECK (deposit_percentage BETWEEN 10 AND 50),
    cancellation_policy TEXT,
    
    -- Datos bancarios (solo freelance)
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_account_type VARCHAR(20),
    bank_cci VARCHAR(50),
    
    -- Estadísticas
    total_tours INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 60, -- tiempo promedio de respuesta
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_user UNIQUE(user_id),
    CONSTRAINT guide_license_check CHECK (license_number ~ '^[A-Z0-9\-]+$')
);

CREATE INDEX idx_guides_type ON guides(guide_type);
CREATE INDEX idx_guides_status ON guides(status);
CREATE INDEX idx_guides_verified ON guides(verified);
CREATE INDEX idx_guides_rating ON guides(average_rating);
CREATE INDEX idx_guides_license_expiry ON guides(license_expiry);
```

### guide_languages
```sql
CREATE TABLE guide_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL, -- ISO 639-1
    language_name VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL CHECK (proficiency_level IN ('native', 'expert', 'advanced', 'intermediate', 'basic')),
    certified BOOLEAN DEFAULT FALSE,
    certification_date DATE,
    certification_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_language UNIQUE(guide_id, language_code)
);

CREATE INDEX idx_guide_languages_guide_id ON guide_languages(guide_id);
CREATE INDEX idx_guide_languages_code ON guide_languages(language_code);
```

### guide_specializations
```sql
CREATE TABLE guide_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    
    -- Tipos de tour
    tour_types TEXT[] DEFAULT '{}', -- cultural, aventura, gastronomico, mistico, fotografico
    work_zones TEXT[] DEFAULT '{}', -- cusco-ciudad, valle-sagrado, machu-picchu, sur-valle
    
    -- Experiencia con grupos específicos
    group_experience JSONB DEFAULT '{}', -- {children: {level, years}, schools: {level, years}, etc.}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_specialization UNIQUE(guide_id)
);

CREATE INDEX idx_guide_specializations_guide_id ON guide_specializations(guide_id);
CREATE INDEX idx_guide_specializations_tour_types ON guide_specializations USING GIN(tour_types);
CREATE INDEX idx_guide_specializations_work_zones ON guide_specializations USING GIN(work_zones);
```

### guide_museums
```sql
CREATE TABLE guide_museums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    museum_name VARCHAR(255) NOT NULL,
    expertise_level VARCHAR(20) NOT NULL CHECK (expertise_level IN ('expert', 'intermediate', 'basic')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_museum UNIQUE(guide_id, museum_name)
);

CREATE INDEX idx_guide_museums_guide_id ON guide_museums(guide_id);
```

### guide_certifications
```sql
CREATE TABLE guide_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    
    certification_name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    document_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guide_certifications_guide_id ON guide_certifications(guide_id);
CREATE INDEX idx_guide_certifications_expiry ON guide_certifications(expiry_date);
```

### guide_availability
```sql
CREATE TABLE guide_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    
    -- Horario semanal
    weekly_schedule JSONB NOT NULL DEFAULT '{}', -- {monday: [{start, end}], tuesday: [], ...}
    
    -- Fechas especiales
    blackout_dates DATE[] DEFAULT '{}',
    vacation_periods JSONB DEFAULT '[]', -- [{start, end, reason}]
    
    -- Configuración
    timezone VARCHAR(50) DEFAULT 'America/Lima',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_availability UNIQUE(guide_id)
);

CREATE INDEX idx_guide_availability_guide_id ON guide_availability(guide_id);
```

### guide_pricing
```sql
CREATE TABLE guide_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    
    -- Tarifas base
    hourly_rate DECIMAL(8,2) NOT NULL CHECK (hourly_rate BETWEEN 10 AND 200),
    half_day_rate DECIMAL(8,2) NOT NULL CHECK (half_day_rate BETWEEN 30 AND 500),
    full_day_rate DECIMAL(8,2) NOT NULL CHECK (full_day_rate BETWEEN 50 AND 1000),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Tarifas especiales
    special_rates JSONB DEFAULT '[]', -- [{group_type, rate, description}]
    
    -- Configuración
    price_includes TEXT[],
    price_excludes TEXT[],
    
    -- Validez
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_pricing_active UNIQUE(guide_id, valid_from) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_guide_pricing_guide_id ON guide_pricing(guide_id);
CREATE INDEX idx_guide_pricing_validity ON guide_pricing(valid_from, valid_until);
```

---

## 3. GESTIÓN DE VEHÍCULOS Y CONDUCTORES

### vehicles
```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    plate VARCHAR(10) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year BETWEEN 1980 AND 2030),
    color VARCHAR(30),
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('car', 'suv', 'van', 'minibus', 'bus')),
    
    -- Capacidades
    passenger_capacity INTEGER NOT NULL CHECK (passenger_capacity > 0),
    luggage_capacity INTEGER DEFAULT 0,
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
    
    -- Estado y mantenimiento
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'out-of-service')),
    mileage INTEGER DEFAULT 0,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_km_interval INTEGER DEFAULT 5000,
    
    -- Documentación
    registration_document TEXT, -- URL
    technical_inspection_date DATE,
    technical_inspection_expiry DATE,
    soat_expiry DATE,
    
    -- Seguro
    insurance_company VARCHAR(100),
    insurance_policy VARCHAR(50),
    insurance_expiry DATE,
    
    -- Fotos
    photos JSONB DEFAULT '{}', -- {front, side, interior, documents}
    
    -- Ubicación actual
    current_location POINT,
    last_location_update TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_capacity ON vehicles(passenger_capacity);
CREATE INDEX idx_vehicles_maintenance ON vehicles(next_maintenance_date);
CREATE INDEX idx_vehicles_location ON vehicles USING GIST(current_location);
```

### drivers
```sql
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Información de licencia
    license_number VARCHAR(20) UNIQUE NOT NULL,
    license_class VARCHAR(10) NOT NULL, -- A1, A2, B, etc.
    license_expiry DATE NOT NULL,
    license_restrictions TEXT[],
    
    -- Experiencia y capacidades
    years_experience INTEGER DEFAULT 0,
    vehicle_types TEXT[] DEFAULT '{}', -- tipos de vehículos que puede manejar
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vacation', 'suspended')),
    verified BOOLEAN DEFAULT FALSE,
    
    -- Estadísticas
    total_trips INTEGER DEFAULT 0,
    safety_rating DECIMAL(3,2) DEFAULT 5.0,
    punctuality_rate DECIMAL(5,2) DEFAULT 100.0,
    customer_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_driver_user UNIQUE(user_id)
);

CREATE INDEX idx_drivers_license ON drivers(license_number);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_rating ON drivers(customer_rating);
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry);
```

### vehicle_assignments
```sql
CREATE TABLE vehicle_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    service_id UUID, -- Referencia a services (definida más adelante)
    
    -- Programación
    assignment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    estimated_duration INTEGER, -- minutos
    
    -- Estado
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    
    -- Ubicaciones
    pickup_location TEXT,
    pickup_coordinates POINT,
    dropoff_location TEXT,
    dropoff_coordinates POINT,
    
    -- Métricas
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    actual_duration INTEGER,
    distance_km DECIMAL(8,2),
    fuel_consumed DECIMAL(6,2),
    
    -- Notas
    notes TEXT,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vehicle_assignments_vehicle ON vehicle_assignments(vehicle_id);
CREATE INDEX idx_vehicle_assignments_driver ON vehicle_assignments(driver_id);
CREATE INDEX idx_vehicle_assignments_date ON vehicle_assignments(assignment_date);
CREATE INDEX idx_vehicle_assignments_status ON vehicle_assignments(status);
```

### maintenance_records
```sql
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Tipo de mantenimiento
    maintenance_type VARCHAR(20) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'emergency')),
    category VARCHAR(50), -- motor, frenos, llantas, etc.
    
    -- Detalles
    description TEXT NOT NULL,
    work_performed TEXT,
    parts_replaced TEXT[],
    
    -- Costos
    labor_cost DECIMAL(10,2) DEFAULT 0,
    parts_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (labor_cost + parts_cost) STORED,
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Fechas y responsables
    maintenance_date DATE NOT NULL,
    performed_by VARCHAR(255),
    workshop VARCHAR(255),
    
    -- Kilometraje
    mileage_at_service INTEGER,
    next_service_km INTEGER,
    
    -- Documentos
    invoice_number VARCHAR(50),
    receipt_url TEXT,
    photos TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_maintenance_records_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_records_date ON maintenance_records(maintenance_date);
CREATE INDEX idx_maintenance_records_type ON maintenance_records(maintenance_type);
```

---

## 4. GESTIÓN DE TOURS Y SERVICIOS

### tours
```sql
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Categorización
    category VARCHAR(50) NOT NULL,
    tour_type VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'hard', 'extreme')),
    
    -- Duración y logística
    duration_hours INTEGER NOT NULL,
    duration_days INTEGER DEFAULT 1,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER NOT NULL,
    
    -- Precios
    base_price DECIMAL(10,2) NOT NULL,
    child_price DECIMAL(10,2),
    senior_price DECIMAL(10,2),
    group_discount_threshold INTEGER,
    group_discount_percentage DECIMAL(5,2),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Ubicación y logística
    meeting_point TEXT NOT NULL,
    meeting_coordinates POINT,
    ending_point TEXT,
    ending_coordinates POINT,
    
    -- Configuración
    languages TEXT[] DEFAULT '{"es"}',
    included_items TEXT[],
    excluded_items TEXT[],
    requirements TEXT[],
    recommendations TEXT[],
    
    -- Estado y disponibilidad
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    seasonal BOOLEAN DEFAULT FALSE,
    available_seasons TEXT[], -- spring, summer, autumn, winter
    
    -- Política
    cancellation_policy TEXT,
    weather_policy TEXT,
    age_restrictions TEXT,
    
    -- Medios
    featured_image TEXT,
    gallery_images TEXT[],
    video_url TEXT,
    virtual_tour_url TEXT,
    
    -- SEO y marketing
    seo_title VARCHAR(255),
    seo_description TEXT,
    marketing_tags TEXT[],
    
    -- Asignaciones por defecto
    default_guide_id UUID REFERENCES guides(id),
    default_vehicle_id UUID REFERENCES vehicles(id),
    
    -- Estadísticas
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_tours_code ON tours(code);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_type ON tours(tour_type);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_tours_price ON tours(base_price);
CREATE INDEX idx_tours_rating ON tours(average_rating);
CREATE INDEX idx_tours_languages ON tours USING GIN(languages);
CREATE INDEX idx_tours_meeting_point ON tours USING GIST(meeting_coordinates);
```

### tour_itinerary
```sql
CREATE TABLE tour_itinerary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    
    -- Orden y timing
    day_number INTEGER NOT NULL DEFAULT 1,
    step_number INTEGER NOT NULL,
    start_time TIME,
    duration_minutes INTEGER,
    
    -- Contenido
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    location_coordinates POINT,
    
    -- Actividades
    activity_type VARCHAR(50), -- visit, meal, transport, activity, rest
    included_in_price BOOLEAN DEFAULT TRUE,
    optional BOOLEAN DEFAULT FALSE,
    additional_cost DECIMAL(8,2),
    
    -- Medios
    photos TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_tour_step UNIQUE(tour_id, day_number, step_number)
);

CREATE INDEX idx_tour_itinerary_tour ON tour_itinerary(tour_id);
CREATE INDEX idx_tour_itinerary_order ON tour_itinerary(tour_id, day_number, step_number);
```

### tour_availability
```sql
CREATE TABLE tour_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    
    -- Configuración semanal
    weekly_schedule JSONB NOT NULL DEFAULT '{}', -- {monday: true, tuesday: false, ...}
    
    -- Horarios específicos
    time_slots JSONB DEFAULT '[]', -- [{start_time, max_capacity, price_modifier}]
    
    -- Fechas especiales
    blackout_dates DATE[],
    special_dates JSONB DEFAULT '[]', -- [{date, available, capacity, price_modifier, reason}]
    
    -- Configuración estacional
    seasonal_config JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_tour_availability UNIQUE(tour_id)
);

CREATE INDEX idx_tour_availability_tour ON tour_availability(tour_id);
```

---

## 5. SISTEMA DE RESERVAS

### clients
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de cliente
    client_type VARCHAR(20) NOT NULL CHECK (client_type IN ('individual', 'agency', 'corporate', 'wholesale')),
    
    -- Información básica
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Documentos de identidad
    dni VARCHAR(20),
    passport VARCHAR(20),
    ruc VARCHAR(20), -- Para agencias
    
    -- Información adicional
    nationality VARCHAR(50),
    address TEXT,
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Configuración comercial (para agencias)
    credit_limit DECIMAL(12,2) DEFAULT 0,
    credit_used DECIMAL(12,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 0, -- días
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Preferencias
    preferred_language VARCHAR(5) DEFAULT 'es',
    dietary_restrictions TEXT[],
    accessibility_needs TEXT[],
    communication_preferences JSONB DEFAULT '{}',
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    vip_status BOOLEAN DEFAULT FALSE,
    
    -- Estadísticas
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    last_booking_date DATE,
    
    -- Origen
    source VARCHAR(50), -- web, phone, referral, agency, etc.
    referral_code VARCHAR(20),
    marketing_campaign VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_dni ON clients(dni);
CREATE INDEX idx_clients_passport ON clients(passport);
CREATE INDEX idx_clients_ruc ON clients(ruc);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_nationality ON clients(nationality);
```

### reservations
```sql
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencia externa
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Relaciones principales
    client_id UUID REFERENCES clients(id),
    agency_id UUID REFERENCES agencies(id),
    tour_id UUID REFERENCES tours(id),
    guide_id UUID REFERENCES guides(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Tipo de servicio
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('tour', 'transfer', 'package', 'custom')),
    
    -- Fechas y horarios
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    
    -- Participantes
    adults_count INTEGER NOT NULL DEFAULT 0,
    children_count INTEGER DEFAULT 0,
    infants_count INTEGER DEFAULT 0,
    total_participants INTEGER GENERATED ALWAYS AS (adults_count + children_count + infants_count) STORED,
    
    -- Precios
    adult_price DECIMAL(10,2) NOT NULL,
    child_price DECIMAL(10,2) DEFAULT 0,
    infant_price DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (
        (adults_count * adult_price) + 
        (children_count * child_price) + 
        (infants_count * infant_price)
    ) STORED,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (subtotal - discount_amount + tax_amount) STORED,
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'partial', 'paid', 'refunded', 'failed'
    )),
    
    -- Ubicaciones específicas (para transfers)
    pickup_location TEXT,
    pickup_coordinates POINT,
    dropoff_location TEXT,
    dropoff_coordinates POINT,
    
    -- Detalles adicionales
    special_requests TEXT,
    dietary_requirements TEXT[],
    accessibility_needs TEXT[],
    languages_required TEXT[],
    
    -- Comunicación
    booking_source VARCHAR(50), -- web, phone, whatsapp, email, etc.
    customer_notes TEXT,
    internal_notes TEXT,
    
    -- Cancelación
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    refund_amount DECIMAL(10,2),
    
    -- Confirmación
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_reservations_code ON reservations(booking_code);
CREATE INDEX idx_reservations_client ON reservations(client_id);
CREATE INDEX idx_reservations_agency ON reservations(agency_id);
CREATE INDEX idx_reservations_tour ON reservations(tour_id);
CREATE INDEX idx_reservations_guide ON reservations(guide_id);
CREATE INDEX idx_reservations_date ON reservations(booking_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_payment_status ON reservations(payment_status);
CREATE INDEX idx_reservations_created_at ON reservations(created_at);
```

### reservation_participants
```sql
CREATE TABLE reservation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    
    -- Información personal
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Documentos
    dni VARCHAR(20),
    passport VARCHAR(20),
    birth_date DATE,
    nationality VARCHAR(50),
    
    -- Categoría
    participant_type VARCHAR(20) NOT NULL CHECK (participant_type IN ('adult', 'child', 'infant')),
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Necesidades especiales
    dietary_restrictions TEXT[],
    medical_conditions TEXT[],
    accessibility_needs TEXT[],
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Estado
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    no_show BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reservation_participants_reservation ON reservation_participants(reservation_id);
CREATE INDEX idx_reservation_participants_type ON reservation_participants(participant_type);
CREATE INDEX idx_reservation_participants_passport ON reservation_participants(passport);
```

---

## 6. SERVICIOS ACTIVOS Y SEGUIMIENTO

### services
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id),
    
    -- Estado del servicio
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'on_way', 'in_progress', 'paused', 'completed', 'cancelled'
    )),
    
    -- Asignaciones
    guide_id UUID NOT NULL REFERENCES guides(id),
    driver_id UUID REFERENCES drivers(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Tracking en tiempo real
    current_location POINT,
    last_location_update TIMESTAMP WITH TIME ZONE,
    estimated_completion_time TIMESTAMP WITH TIME ZONE,
    
    -- Eventos importantes
    started_at TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE,
    resumed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Motivos de pausa/cancelación
    pause_reason TEXT,
    cancellation_reason TEXT,
    
    -- Métricas finales
    actual_duration INTEGER, -- minutos
    distance_covered DECIMAL(8,2), -- km
    
    -- Evaluación final
    service_rating DECIMAL(3,2),
    service_feedback TEXT,
    reported_issues TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_reservation ON services(reservation_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_guide ON services(guide_id);
CREATE INDEX idx_services_location ON services USING GIST(current_location);
CREATE INDEX idx_services_date ON services(started_at);
```

### service_events
```sql
CREATE TABLE service_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    -- Tipo y momento del evento
    event_type VARCHAR(50) NOT NULL, -- start, pause, resume, location_update, incident, complete, etc.
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ubicación del evento
    location POINT,
    location_description TEXT,
    
    -- Detalles del evento
    description TEXT,
    metadata JSONB DEFAULT '{}', -- datos específicos del evento
    
    -- Quién reportó el evento
    reported_by UUID REFERENCES users(id),
    automatic BOOLEAN DEFAULT FALSE, -- si fue generado automáticamente
    
    -- Adjuntos
    photos TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_events_service ON service_events(service_id);
CREATE INDEX idx_service_events_type ON service_events(event_type);
CREATE INDEX idx_service_events_timestamp ON service_events(event_timestamp);
CREATE INDEX idx_service_events_location ON service_events USING GIST(location);
```

---

## 7. SISTEMA FINANCIERO

### financial_transactions
```sql
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de transacción
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
        'income', 'expense', 'commission', 'tip', 'refund', 'penalty', 'bonus'
    )),
    
    -- Referencias
    guide_id UUID REFERENCES guides(id),
    reservation_id UUID REFERENCES reservations(id),
    service_id UUID REFERENCES services(id),
    
    -- Montos
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    exchange_rate DECIMAL(10,6), -- si aplica conversión
    amount_base_currency DECIMAL(12,2), -- monto en moneda base
    
    -- Categorización
    category VARCHAR(50) NOT NULL, -- transport, food, tickets, accommodation, equipment, other
    subcategory VARCHAR(50),
    
    -- Detalles
    description TEXT NOT NULL,
    reference_number VARCHAR(50), -- número de factura, recibo, etc.
    receipt_url TEXT,
    
    -- Fechas
    transaction_date DATE NOT NULL,
    due_date DATE,
    paid_date DATE,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'paid', 'cancelled'
    )),
    
    -- Aprobación
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- Pago
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    bank_account VARCHAR(50),
    
    -- Impuestos
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    tax_included BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX idx_financial_transactions_guide ON financial_transactions(guide_id);
CREATE INDEX idx_financial_transactions_reservation ON financial_transactions(reservation_id);
CREATE INDEX idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_transactions_status ON financial_transactions(status);
```

### payment_vouchers
```sql
CREATE TABLE payment_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del voucher
    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    voucher_type VARCHAR(20) NOT NULL CHECK (voucher_type IN ('invoice', 'receipt', 'payment_slip')),
    
    -- Referencias
    reservation_id UUID REFERENCES reservations(id),
    client_id UUID REFERENCES clients(id),
    agency_id UUID REFERENCES agencies(id),
    
    -- Montos
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Fechas
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    payment_date DATE,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'paid', 'overdue', 'cancelled', 'refunded'
    )),
    
    -- Método de pago
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Detalles adicionales
    notes TEXT,
    terms_and_conditions TEXT,
    
    -- URLs de documentos
    pdf_url TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payment_vouchers_number ON payment_vouchers(voucher_number);
CREATE INDEX idx_payment_vouchers_reservation ON payment_vouchers(reservation_id);
CREATE INDEX idx_payment_vouchers_client ON payment_vouchers(client_id);
CREATE INDEX idx_payment_vouchers_status ON payment_vouchers(status);
CREATE INDEX idx_payment_vouchers_date ON payment_vouchers(issue_date);
```

### payment_voucher_items
```sql
CREATE TABLE payment_voucher_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id UUID NOT NULL REFERENCES payment_vouchers(id) ON DELETE CASCADE,
    
    -- Detalles del item
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Referencia opcional
    tour_id UUID REFERENCES tours(id),
    service_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_voucher_items_voucher ON payment_voucher_items(voucher_id);
```

---

## 8. SISTEMA DE PUNTOS Y RECOMPENSAS

### points_transactions
```sql
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agencies(id),
    
    -- Tipo de transacción
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
        'earned', 'redeemed', 'expired', 'adjusted', 'bonus', 'penalty'
    )),
    
    -- Puntos
    points_amount INTEGER NOT NULL,
    points_balance_after INTEGER NOT NULL,
    
    -- Detalles
    description TEXT NOT NULL,
    reference_id UUID, -- puede referenciar a reservation, voucher, etc.
    reference_type VARCHAR(50), -- 'reservation', 'voucher', 'promotion', etc.
    
    -- Expiración (para puntos ganados)
    expires_at DATE,
    
    -- Metadatos
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_points_transactions_agency ON points_transactions(agency_id);
CREATE INDEX idx_points_transactions_type ON points_transactions(transaction_type);
CREATE INDEX idx_points_transactions_date ON points_transactions(created_at);
CREATE INDEX idx_points_transactions_expiry ON points_transactions(expires_at);
```

### rewards_catalog
```sql
CREATE TABLE rewards_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Costo en puntos
    points_cost INTEGER NOT NULL,
    monetary_value DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Categoría
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    
    -- Disponibilidad
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    stock_quantity INTEGER,
    unlimited_stock BOOLEAN DEFAULT FALSE,
    
    -- Restricciones
    min_tier_required VARCHAR(20) CHECK (min_tier_required IN ('bronze', 'silver', 'gold', 'platinum')),
    valid_from DATE,
    valid_until DATE,
    usage_limit_per_user INTEGER,
    
    -- Medios
    image_url TEXT,
    terms_and_conditions TEXT,
    
    -- Estadísticas
    total_redeemed INTEGER DEFAULT 0,
    popularity_score DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_rewards_catalog_status ON rewards_catalog(status);
CREATE INDEX idx_rewards_catalog_category ON rewards_catalog(category);
CREATE INDEX idx_rewards_catalog_points_cost ON rewards_catalog(points_cost);
CREATE INDEX idx_rewards_catalog_tier ON rewards_catalog(min_tier_required);
```

### rewards_redemptions
```sql
CREATE TABLE rewards_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencias
    agency_id UUID NOT NULL REFERENCES agencies(id),
    reward_id UUID NOT NULL REFERENCES rewards_catalog(id),
    points_transaction_id UUID NOT NULL REFERENCES points_transactions(id),
    
    -- Detalles de la redención
    redemption_code VARCHAR(20) UNIQUE NOT NULL,
    points_used INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'delivered', 'used', 'expired', 'cancelled'
    )),
    
    -- Fechas importantes
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at DATE,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Entrega (si aplica)
    delivery_method VARCHAR(50), -- email, pickup, mail
    delivery_address TEXT,
    delivery_status VARCHAR(20),
    delivery_tracking VARCHAR(100),
    
    -- Notas
    notes TEXT,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rewards_redemptions_agency ON rewards_redemptions(agency_id);
CREATE INDEX idx_rewards_redemptions_reward ON rewards_redemptions(reward_id);
CREATE INDEX idx_rewards_redemptions_code ON rewards_redemptions(redemption_code);
CREATE INDEX idx_rewards_redemptions_status ON rewards_redemptions(status);
```

---

## 9. MARKETPLACE DE GUÍAS FREELANCE

### service_requests
```sql
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Solicitante
    requester_id UUID NOT NULL REFERENCES users(id),
    requester_type VARCHAR(20) NOT NULL CHECK (requester_type IN ('agency', 'client')),
    
    -- Detalles del servicio
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('tour', 'transfer', 'custom')),
    tour_name VARCHAR(255),
    
    -- Fecha y horario
    service_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INTEGER NOT NULL,
    end_time TIME GENERATED ALWAYS AS (start_time + (duration_hours || ' hours')::INTERVAL) STORED,
    
    -- Ubicación
    location TEXT NOT NULL,
    pickup_location TEXT,
    pickup_coordinates POINT,
    dropoff_location TEXT,
    dropoff_coordinates POINT,
    
    -- Grupo
    group_size INTEGER NOT NULL,
    group_type VARCHAR(50) NOT NULL,
    languages_required TEXT[] NOT NULL,
    
    -- Detalles adicionales
    special_requirements TEXT,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Estado
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN (
        'open', 'assigned', 'in_progress', 'completed', 'cancelled', 'expired'
    )),
    
    -- Asignación
    assigned_guide_id UUID REFERENCES guides(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Finalización
    completed_at TIMESTAMP WITH TIME ZONE,
    final_rate DECIMAL(10,2),
    payment_terms TEXT,
    
    -- Configuración
    auto_assign BOOLEAN DEFAULT FALSE,
    response_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_requests_requester ON service_requests(requester_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_date ON service_requests(service_date);
CREATE INDEX idx_service_requests_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_assigned_guide ON service_requests(assigned_guide_id);
CREATE INDEX idx_service_requests_languages ON service_requests USING GIN(languages_required);
```

### guide_responses
```sql
CREATE TABLE guide_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    guide_id UUID NOT NULL REFERENCES guides(id),
    
    -- Propuesta
    proposed_rate DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    message TEXT,
    
    -- Disponibilidad confirmada
    availability_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    alternative_times JSONB, -- si no está disponible en el horario solicitado
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'rejected', 'withdrawn', 'expired'
    )),
    
    -- Tiempos
    response_time_minutes INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Respuesta del solicitante
    client_response TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_guide_request_response UNIQUE(service_request_id, guide_id)
);

CREATE INDEX idx_guide_responses_request ON guide_responses(service_request_id);
CREATE INDEX idx_guide_responses_guide ON guide_responses(guide_id);
CREATE INDEX idx_guide_responses_status ON guide_responses(status);
CREATE INDEX idx_guide_responses_rate ON guide_responses(proposed_rate);
```

### marketplace_reviews
```sql
CREATE TABLE marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencias
    guide_id UUID NOT NULL REFERENCES guides(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    service_request_id UUID REFERENCES service_requests(id),
    reservation_id UUID REFERENCES reservations(id),
    
    -- Calificaciones (1-5)
    overall_rating DECIMAL(3,2) NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    knowledge_rating DECIMAL(3,2) NOT NULL CHECK (knowledge_rating BETWEEN 1 AND 5),
    communication_rating DECIMAL(3,2) NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    punctuality_rating DECIMAL(3,2) NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
    professionalism_rating DECIMAL(3,2) NOT NULL CHECK (professionalism_rating BETWEEN 1 AND 5),
    value_rating DECIMAL(3,2) NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    
    -- Contenido de la reseña
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    would_recommend BOOLEAN NOT NULL,
    would_hire_again BOOLEAN NOT NULL,
    
    -- Fotos de la experiencia
    photos TEXT[],
    
    -- Metadatos
    verified_booking BOOLEAN DEFAULT FALSE,
    service_date DATE,
    tour_type VARCHAR(50),
    group_size INTEGER,
    
    -- Interacción
    helpful_votes INTEGER DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE,
    
    -- Respuesta del guía
    guide_response TEXT,
    guide_response_at TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN (
        'draft', 'pending', 'published', 'hidden', 'removed'
    )),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_review_per_service UNIQUE(reviewer_id, service_request_id)
);

CREATE INDEX idx_marketplace_reviews_guide ON marketplace_reviews(guide_id);
CREATE INDEX idx_marketplace_reviews_reviewer ON marketplace_reviews(reviewer_id);
CREATE INDEX idx_marketplace_reviews_rating ON marketplace_reviews(overall_rating);
CREATE INDEX idx_marketplace_reviews_date ON marketplace_reviews(created_at);
CREATE INDEX idx_marketplace_reviews_status ON marketplace_reviews(status);
```

---

## 10. SISTEMA DE PROVEEDORES

### providers
```sql
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    provider_type VARCHAR(50) NOT NULL CHECK (provider_type IN (
        'restaurant', 'hotel', 'transport', 'activity', 'guide_service', 'equipment', 'other'
    )),
    category VARCHAR(100),
    
    -- Documentos
    ruc VARCHAR(20),
    business_license VARCHAR(50),
    
    -- Contacto
    contact_person VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternative_phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Dirección
    address_street TEXT NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_region VARCHAR(100),
    address_postal_code VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'Peru',
    coordinates POINT,
    
    -- Horarios de operación
    operating_hours JSONB DEFAULT '{}', -- {monday: [{start, end}], ...}
    
    -- Precios y comisiones
    price_range VARCHAR(20) CHECK (price_range IN ('budget', 'moderate', 'premium', 'luxury')),
    commission_rate DECIMAL(5,2), -- porcentaje de comisión
    payment_terms INTEGER DEFAULT 30, -- días
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Calificaciones
    overall_rating DECIMAL(3,2) DEFAULT 0,
    quality_rating DECIMAL(3,2) DEFAULT 0,
    service_rating DECIMAL(3,2) DEFAULT 0,
    punctuality_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'active', 'inactive', 'pending', 'suspended'
    )),
    verified BOOLEAN DEFAULT FALSE,
    preferred_provider BOOLEAN DEFAULT FALSE,
    
    -- Certificaciones
    certifications TEXT[],
    certifications_urls TEXT[],
    
    -- Capacidades
    max_group_size INTEGER,
    languages_supported TEXT[],
    accessibility_features TEXT[],
    
    -- Medios
    logo_url TEXT,
    photos TEXT[],
    
    -- Notas internas
    internal_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_providers_type ON providers(provider_type);
CREATE INDEX idx_providers_category ON providers(category);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_rating ON providers(overall_rating);
CREATE INDEX idx_providers_location ON providers USING GIST(coordinates);
CREATE INDEX idx_providers_ruc ON providers(ruc);
```

### provider_services
```sql
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Detalles del servicio
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    service_code VARCHAR(50),
    
    -- Precios
    unit_price DECIMAL(10,2) NOT NULL,
    unit_type VARCHAR(50) NOT NULL, -- per_person, per_group, per_hour, per_day, per_item
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Disponibilidad
    available BOOLEAN DEFAULT TRUE,
    seasonal BOOLEAN DEFAULT FALSE,
    available_seasons TEXT[],
    
    -- Configuración
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER,
    advance_booking_required INTEGER DEFAULT 0, -- días
    
    -- Incluye/Excluye
    includes TEXT[],
    excludes TEXT[],
    requirements TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_provider_services_provider ON provider_services(provider_id);
CREATE INDEX idx_provider_services_available ON provider_services(available);
CREATE INDEX idx_provider_services_code ON provider_services(service_code);
```

### provider_assignments
```sql
CREATE TABLE provider_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencias
    provider_id UUID NOT NULL REFERENCES providers(id),
    reservation_id UUID REFERENCES reservations(id),
    tour_id UUID REFERENCES tours(id),
    
    -- Detalles de la asignación
    assignment_date DATE NOT NULL,
    assignment_time TIME,
    participants_count INTEGER NOT NULL,
    
    -- Servicios asignados
    services_detail JSONB NOT NULL, -- [{service_id, quantity, unit_price, subtotal}]
    
    -- Montos
    total_amount DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    )),
    
    -- Confirmación
    confirmation_code VARCHAR(50),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by VARCHAR(255),
    
    -- Notas
    special_instructions TEXT,
    provider_notes TEXT,
    internal_notes TEXT,
    
    -- Cancelación
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_provider_assignments_provider ON provider_assignments(provider_id);
CREATE INDEX idx_provider_assignments_reservation ON provider_assignments(reservation_id);
CREATE INDEX idx_provider_assignments_date ON provider_assignments(assignment_date);
CREATE INDEX idx_provider_assignments_status ON provider_assignments(status);
```

### provider_contracts
```sql
CREATE TABLE provider_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Detalles del contrato
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- service_agreement, preferred_provider, exclusive, etc.
    
    -- Vigencia
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renewal BOOLEAN DEFAULT FALSE,
    renewal_period_months INTEGER,
    
    -- Términos comerciales
    commission_rate DECIMAL(5,2),
    payment_terms INTEGER, -- días
    credit_limit DECIMAL(12,2),
    volume_discounts JSONB, -- escalas de descuento por volumen
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'draft', 'active', 'expired', 'terminated', 'suspended'
    )),
    
    -- Documentos
    contract_url TEXT,
    terms_and_conditions TEXT,
    
    -- Métricas
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_provider_contracts_provider ON provider_contracts(provider_id);
CREATE INDEX idx_provider_contracts_number ON provider_contracts(contract_number);
CREATE INDEX idx_provider_contracts_status ON provider_contracts(status);
CREATE INDEX idx_provider_contracts_dates ON provider_contracts(start_date, end_date);
```

---

## 11. PROTOCOLOS DE EMERGENCIA

### emergency_protocols
```sql
CREATE TABLE emergency_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    title VARCHAR(255) NOT NULL,
    protocol_code VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'medical', 'natural_disaster', 'security', 'accident', 'weather', 'equipment', 'other'
    )),
    subcategory VARCHAR(100),
    
    -- Prioridad y severidad
    priority_level VARCHAR(20) NOT NULL CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    severity_level VARCHAR(20) CHECK (severity_level IN ('minor', 'moderate', 'major', 'catastrophic')),
    
    -- Contenido del protocolo
    description TEXT NOT NULL,
    objective TEXT,
    scope TEXT,
    
    -- Responsabilidades
    primary_responsible VARCHAR(255),
    secondary_responsible VARCHAR(255),
    escalation_contacts JSONB, -- [{name, role, phone, when_to_contact}]
    
    -- Recursos necesarios
    required_materials TEXT[],
    required_personnel TEXT[],
    required_vehicles TEXT[],
    
    -- Estado y vigencia
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'under_review', 'archived')),
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    review_frequency_months INTEGER DEFAULT 12,
    next_review_date DATE,
    last_review_date DATE,
    
    -- Documentos adjuntos
    attachments TEXT[],
    training_materials TEXT[],
    
    -- Metadatos
    version VARCHAR(10) DEFAULT '1.0',
    supersedes_protocol_id UUID REFERENCES emergency_protocols(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id)
);

CREATE INDEX idx_emergency_protocols_code ON emergency_protocols(protocol_code);
CREATE INDEX idx_emergency_protocols_category ON emergency_protocols(category);
CREATE INDEX idx_emergency_protocols_priority ON emergency_protocols(priority_level);
CREATE INDEX idx_emergency_protocols_status ON emergency_protocols(status);
CREATE INDEX idx_emergency_protocols_review_date ON emergency_protocols(next_review_date);
```

### protocol_steps
```sql
CREATE TABLE protocol_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID NOT NULL REFERENCES emergency_protocols(id) ON DELETE CASCADE,
    
    -- Orden y organización
    step_number INTEGER NOT NULL,
    parent_step_id UUID REFERENCES protocol_steps(id), -- para sub-pasos
    
    -- Contenido del paso
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    detailed_instructions TEXT,
    
    -- Responsabilidad y timing
    responsible_role VARCHAR(100),
    estimated_time_minutes INTEGER,
    max_time_minutes INTEGER,
    
    -- Condiciones
    prerequisite_steps INTEGER[],
    conditions_required TEXT[],
    
    -- Recursos
    materials_needed TEXT[],
    tools_required TEXT[],
    personnel_needed TEXT[],
    
    -- Verificación
    verification_required BOOLEAN DEFAULT FALSE,
    verification_criteria TEXT,
    documentation_required TEXT[],
    
    -- Escalación
    escalation_trigger TEXT,
    escalation_time_minutes INTEGER,
    escalation_contact VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_protocol_step UNIQUE(protocol_id, step_number)
);

CREATE INDEX idx_protocol_steps_protocol ON protocol_steps(protocol_id);
CREATE INDEX idx_protocol_steps_number ON protocol_steps(protocol_id, step_number);
CREATE INDEX idx_protocol_steps_parent ON protocol_steps(parent_step_id);
```

### emergency_contacts
```sql
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    
    -- Contacto
    primary_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    email VARCHAR(255),
    radio_frequency VARCHAR(50),
    
    -- Disponibilidad
    available_24h BOOLEAN DEFAULT FALSE,
    available_hours JSONB, -- horarios específicos si no es 24h
    languages TEXT[] DEFAULT '{"es"}',
    
    -- Especialidad
    specialties TEXT[],
    coverage_areas TEXT[], -- zonas geográficas de cobertura
    contact_types TEXT[], -- tipos de emergencia que maneja
    
    -- Prioridad y orden de contacto
    priority_level INTEGER DEFAULT 1,
    contact_order INTEGER,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'temporary')),
    
    -- Última verificación
    last_verified_date DATE,
    verification_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emergency_contacts_role ON emergency_contacts(role);
CREATE INDEX idx_emergency_contacts_status ON emergency_contacts(status);
CREATE INDEX idx_emergency_contacts_available_24h ON emergency_contacts(available_24h);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(priority_level);
```

### emergency_materials
```sql
CREATE TABLE emergency_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del material
    name VARCHAR(255) NOT NULL,
    material_code VARCHAR(50) UNIQUE,
    category VARCHAR(50) NOT NULL, -- medical, safety, communication, tools, etc.
    subcategory VARCHAR(100),
    
    -- Descripción
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    specifications TEXT,
    
    -- Inventario
    current_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 1,
    maximum_quantity INTEGER,
    unit_of_measure VARCHAR(20) NOT NULL, -- units, boxes, liters, kg, etc.
    
    -- Ubicación
    location VARCHAR(255) NOT NULL,
    storage_location VARCHAR(255),
    coordinates POINT,
    
    -- Estado y condición
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN (
        'available', 'in_use', 'maintenance', 'expired', 'missing', 'damaged'
    )),
    condition_rating VARCHAR(20) CHECK (condition_rating IN ('excellent', 'good', 'fair', 'poor')),
    
    -- Fechas importantes
    expiry_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    
    -- Costo y proveedor
    unit_cost DECIMAL(10,2),
    supplier VARCHAR(255),
    supplier_contact TEXT,
    
    -- Clasificación de emergencia
    emergency_types TEXT[], -- tipos de emergencia donde se usa
    mandatory BOOLEAN DEFAULT FALSE, -- si es obligatorio tenerlo
    
    -- Documentación
    photo_url TEXT,
    manual_url TEXT,
    certificate_url TEXT,
    
    -- Auditoría
    last_checked_by VARCHAR(255),
    last_checked_date DATE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emergency_materials_code ON emergency_materials(material_code);
CREATE INDEX idx_emergency_materials_category ON emergency_materials(category);
CREATE INDEX idx_emergency_materials_status ON emergency_materials(status);
CREATE INDEX idx_emergency_materials_location ON emergency_materials(location);
CREATE INDEX idx_emergency_materials_expiry ON emergency_materials(expiry_date);
CREATE INDEX idx_emergency_materials_mandatory ON emergency_materials(mandatory);
```

### incidents
```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información básica
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Cuándo y dónde
    incident_date DATE NOT NULL,
    incident_time TIME NOT NULL,
    location TEXT NOT NULL,
    coordinates POINT,
    
    -- Contexto del tour/servicio
    tour_id UUID REFERENCES tours(id),
    service_id UUID REFERENCES services(id),
    reservation_id UUID REFERENCES reservations(id),
    guide_id UUID REFERENCES guides(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Descripción del incidente
    description TEXT NOT NULL,
    immediate_cause TEXT,
    root_cause TEXT,
    contributing_factors TEXT[],
    
    -- Personas afectadas
    affected_people JSONB DEFAULT '[]', -- [{name, age, nationality, injury_type, medical_attention}]
    total_affected INTEGER DEFAULT 0,
    
    -- Testigos
    witnesses JSONB DEFAULT '[]', -- [{name, contact, statement}]
    
    -- Medidas inmediatas
    immediate_actions TEXT NOT NULL,
    first_aid_provided BOOLEAN DEFAULT FALSE,
    emergency_services_called BOOLEAN DEFAULT FALSE,
    evacuation_performed BOOLEAN DEFAULT FALSE,
    
    -- Autoridades
    authorities_notified BOOLEAN DEFAULT FALSE,
    police_report_number VARCHAR(50),
    police_officer_name VARCHAR(255),
    fire_department_notified BOOLEAN DEFAULT FALSE,
    medical_services_notified BOOLEAN DEFAULT FALSE,
    
    -- Seguros
    insurance_notified BOOLEAN DEFAULT FALSE,
    insurance_claim_number VARCHAR(50),
    insurance_adjuster VARCHAR(255),
    
    -- Estado del incidente
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN (
        'open', 'investigating', 'resolved', 'closed'
    )),
    
    -- Resolución
    resolution_description TEXT,
    preventive_measures TEXT[],
    lessons_learned TEXT,
    
    -- Documentación
    photos TEXT[],
    documents TEXT[],
    medical_reports TEXT[],
    
    -- Seguimiento
    follow_up_required BOOLEAN DEFAULT TRUE,
    follow_up_actions TEXT[],
    next_review_date DATE,
    
    -- Notificaciones
    family_notified BOOLEAN DEFAULT FALSE,
    embassy_notified BOOLEAN DEFAULT FALSE,
    tour_operator_notified BOOLEAN DEFAULT FALSE,
    
    -- Costos
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    insurance_coverage DECIMAL(12,2),
    
    -- Auditoría
    reported_by UUID REFERENCES users(id),
    investigated_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    closed_by UUID REFERENCES users(id),
    closed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_incidents_number ON incidents(incident_number);
CREATE INDEX idx_incidents_category ON incidents(category);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_date ON incidents(incident_date);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_tour ON incidents(tour_id);
CREATE INDEX idx_incidents_service ON incidents(service_id);
CREATE INDEX idx_incidents_guide ON incidents(guide_id);
CREATE INDEX idx_incidents_location ON incidents USING GIST(coordinates);
```

---

## 12. SISTEMA DE COMUNICACIONES

### conversations
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de conversación
    conversation_type VARCHAR(20) NOT NULL CHECK (conversation_type IN (
        'direct', 'group', 'support', 'service_related', 'emergency'
    )),
    
    -- Participantes (para conversaciones directas)
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES users(id),
    
    -- Para conversaciones grupales
    group_name VARCHAR(255),
    group_description TEXT,
    group_admin_id UUID REFERENCES users(id),
    
    -- Contexto relacionado
    reservation_id UUID REFERENCES reservations(id),
    service_id UUID REFERENCES services(id),
    service_request_id UUID REFERENCES service_requests(id),
    incident_id UUID REFERENCES incidents(id),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'active', 'archived', 'blocked', 'deleted'
    )),
    
    -- Configuración
    allow_attachments BOOLEAN DEFAULT TRUE,
    allow_location_sharing BOOLEAN DEFAULT TRUE,
    muted_participants UUID[],
    
    -- Última actividad
    last_message_at TIMESTAMP WITH TIME ZONE,
    last_message_preview TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_conversation_participants CHECK (
        (conversation_type = 'direct' AND user1_id IS NOT NULL AND user2_id IS NOT NULL) OR
        (conversation_type != 'direct')
    )
);

CREATE INDEX idx_conversations_type ON conversations(conversation_type);
CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_reservation ON conversations(reservation_id);
CREATE INDEX idx_conversations_service ON conversations(service_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at);
```

### conversation_participants
```sql
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Permisos
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    can_add_participants BOOLEAN DEFAULT FALSE,
    can_remove_participants BOOLEAN DEFAULT FALSE,
    
    -- Estado de participación
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'left', 'removed', 'muted')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Configuración personal
    notifications_enabled BOOLEAN DEFAULT TRUE,
    muted_until TIMESTAMP WITH TIME ZONE,
    
    -- Última lectura
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_conversation_participant UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_status ON conversation_participants(status);
```

### messages
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Remitente
    sender_id UUID NOT NULL REFERENCES users(id),
    
    -- Tipo y contenido
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN (
        'text', 'image', 'file', 'location', 'voice', 'video', 'system'
    )),
    content TEXT NOT NULL,
    
    -- Respuesta a otro mensaje
    reply_to_message_id UUID REFERENCES messages(id),
    
    -- Adjuntos
    attachments JSONB DEFAULT '[]', -- [{type, url, name, size, thumbnail_url}]
    
    -- Ubicación (si es tipo location)
    location_coordinates POINT,
    location_address TEXT,
    
    -- Estado del mensaje
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN (
        'sent', 'delivered', 'read', 'failed', 'deleted'
    )),
    
    -- Edición
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    original_content TEXT, -- para mantener historial
    
    -- Eliminación
    deleted_for_sender BOOLEAN DEFAULT FALSE,
    deleted_for_all BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Prioridad (para mensajes del sistema)
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Metadatos
    metadata JSONB DEFAULT '{}', -- información adicional específica del tipo
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_reply_to ON messages(reply_to_message_id);
```

### message_read_receipts
```sql
CREATE TABLE message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_message_read UNIQUE(message_id, user_id)
);

CREATE INDEX idx_message_read_receipts_message ON message_read_receipts(message_id);
CREATE INDEX idx_message_read_receipts_user ON message_read_receipts(user_id);
```

### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Destinatario
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Tipo y categoría
    notification_type VARCHAR(50) NOT NULL, -- booking_confirmed, payment_due, service_started, etc.
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'booking', 'payment', 'service', 'system', 'marketing', 'security', 'emergency'
    )),
    
    -- Contenido
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Prioridad
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Referencias relacionadas
    reference_type VARCHAR(50), -- 'reservation', 'service', 'payment', etc.
    reference_id UUID,
    
    -- Acción
    action_type VARCHAR(50), -- 'view_reservation', 'make_payment', 'rate_service', etc.
    action_url TEXT,
    action_data JSONB DEFAULT '{}',
    
    -- Canales de entrega
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    push_sent BOOLEAN DEFAULT FALSE,
    push_sent_at TIMESTAMP WITH TIME ZONE,
    sms_sent BOOLEAN DEFAULT FALSE,
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Expiración
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
```

---

## 13. CONFIGURACIONES Y SISTEMA

### system_settings
```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Clave y valor
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN (
        'string', 'integer', 'decimal', 'boolean', 'json', 'array'
    )),
    
    -- Categorización
    category VARCHAR(50) NOT NULL, -- general, payment, email, sms, etc.
    subcategory VARCHAR(50),
    
    -- Metadatos
    description TEXT,
    default_value TEXT,
    validation_rules TEXT, -- reglas de validación
    
    -- Configuración
    is_public BOOLEAN DEFAULT FALSE, -- si se puede mostrar al frontend
    is_editable BOOLEAN DEFAULT TRUE, -- si se puede editar desde admin
    requires_restart BOOLEAN DEFAULT FALSE, -- si requiere reinicio del sistema
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Quién y cuándo
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Qué acción
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, etc.
    entity_type VARCHAR(50) NOT NULL, -- users, reservations, tours, etc.
    entity_id UUID,
    
    -- Detalles de la acción
    description TEXT,
    old_values JSONB, -- valores anteriores
    new_values JSONB, -- valores nuevos
    
    -- Metadatos
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    execution_time_ms INTEGER,
    
    -- Contexto
    request_id UUID, -- para agrupar acciones relacionadas
    source VARCHAR(50) DEFAULT 'web', -- web, api, mobile, system
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_session ON audit_logs(session_id);
```

### file_uploads
```sql
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del archivo
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- SHA-256 hash para deduplicación
    
    -- Metadatos
    alt_text TEXT,
    caption TEXT,
    tags TEXT[],
    
    -- Categorización
    category VARCHAR(50), -- avatar, document, photo, etc.
    entity_type VARCHAR(50), -- tabla relacionada
    entity_id UUID, -- ID del registro relacionado
    
    -- Configuración
    is_public BOOLEAN DEFAULT FALSE,
    is_temporary BOOLEAN DEFAULT FALSE, -- para archivos temporales
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Auditoría
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX idx_file_uploads_category ON file_uploads(category);
CREATE INDEX idx_file_uploads_hash ON file_uploads(file_hash);
CREATE INDEX idx_file_uploads_expires_at ON file_uploads(expires_at);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
```

---

## 14. ESTADÍSTICAS Y ANÁLISIS

### daily_statistics
```sql
CREATE TABLE daily_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Fecha de la estadística
    stat_date DATE NOT NULL,
    
    -- Reservas
    total_reservations INTEGER DEFAULT 0,
    confirmed_reservations INTEGER DEFAULT 0,
    cancelled_reservations INTEGER DEFAULT 0,
    completed_reservations INTEGER DEFAULT 0,
    no_show_reservations INTEGER DEFAULT 0,
    
    -- Ingresos
    total_revenue DECIMAL(15,2) DEFAULT 0,
    tour_revenue DECIMAL(15,2) DEFAULT 0,
    transfer_revenue DECIMAL(15,2) DEFAULT 0,
    commission_revenue DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'PEN',
    
    -- Participantes
    total_participants INTEGER DEFAULT 0,
    adult_participants INTEGER DEFAULT 0,
    child_participants INTEGER DEFAULT 0,
    
    -- Servicios
    active_services INTEGER DEFAULT 0,
    completed_services INTEGER DEFAULT 0,
    cancelled_services INTEGER DEFAULT 0,
    
    -- Guías
    active_guides INTEGER DEFAULT 0,
    busy_guides INTEGER DEFAULT 0,
    available_guides INTEGER DEFAULT 0,
    
    -- Vehículos
    active_vehicles INTEGER DEFAULT 0,
    busy_vehicles INTEGER DEFAULT 0,
    maintenance_vehicles INTEGER DEFAULT 0,
    
    -- Satisfacción
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Marketplace
    service_requests INTEGER DEFAULT 0,
    guide_responses INTEGER DEFAULT 0,
    marketplace_bookings INTEGER DEFAULT 0,
    
    -- Metadatos
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_daily_stat UNIQUE(stat_date)
);

CREATE INDEX idx_daily_statistics_date ON daily_statistics(stat_date);
```

### monthly_statistics
```sql
CREATE TABLE monthly_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Período
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    
    -- Métricas principales
    total_reservations INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    total_services INTEGER DEFAULT 0,
    
    -- Crecimiento
    reservation_growth_rate DECIMAL(5,2) DEFAULT 0,
    revenue_growth_rate DECIMAL(5,2) DEFAULT 0,
    participant_growth_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Por tipo de servicio
    tour_reservations INTEGER DEFAULT 0,
    transfer_reservations INTEGER DEFAULT 0,
    custom_reservations INTEGER DEFAULT 0,
    
    -- Por fuente
    direct_bookings INTEGER DEFAULT 0,
    agency_bookings INTEGER DEFAULT 0,
    marketplace_bookings INTEGER DEFAULT 0,
    
    -- Calidad de servicio
    average_rating DECIMAL(3,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    cancellation_rate DECIMAL(5,2) DEFAULT 0,
    no_show_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Top performers
    top_tours JSONB DEFAULT '[]', -- top 10 tours por reservas
    top_guides JSONB DEFAULT '[]', -- top 10 guías por rating/servicios
    top_agencies JSONB DEFAULT '[]', -- top 10 agencias por volumen
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_monthly_stat UNIQUE(year, month)
);

CREATE INDEX idx_monthly_statistics_period ON monthly_statistics(year, month);
```

---

## RELACIONES Y CONSTRAINTS ADICIONALES

### Claves foráneas adicionales
```sql
-- Relación entre services y vehicle_assignments
ALTER TABLE vehicle_assignments 
ADD CONSTRAINT fk_vehicle_assignments_service 
FOREIGN KEY (service_id) REFERENCES services(id);

-- Triggers para auditoría automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, 
        old_values, new_values, description
    ) VALUES (
        current_setting('app.current_user_id', true)::UUID,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        TG_OP || ' on ' || TG_TABLE_NAME
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoría a tablas críticas
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_reservations AFTER INSERT OR UPDATE OR DELETE ON reservations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_financial_transactions AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Funciones para estadísticas automáticas
```sql
-- Función para calcular estadísticas diarias
CREATE OR REPLACE FUNCTION calculate_daily_statistics(target_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_statistics (
        stat_date,
        total_reservations,
        confirmed_reservations,
        completed_reservations,
        total_revenue,
        total_participants
    )
    SELECT 
        target_date,
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'confirmed'),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COALESCE(SUM(total_amount), 0),
        COALESCE(SUM(total_participants), 0)
    FROM reservations 
    WHERE booking_date = target_date
    ON CONFLICT (stat_date) DO UPDATE SET
        total_reservations = EXCLUDED.total_reservations,
        confirmed_reservations = EXCLUDED.confirmed_reservations,
        completed_reservations = EXCLUDED.completed_reservations,
        total_revenue = EXCLUDED.total_revenue,
        total_participants = EXCLUDED.total_participants,
        last_calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

## CONFIGURACIÓN INICIAL Y DATOS SEMILLA

### Datos iniciales del sistema
```sql
-- Configuraciones básicas del sistema
INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('app.name', 'Futurismo Tourism Management', 'general', 'Nombre de la aplicación'),
('app.version', '1.0.0', 'general', 'Versión del sistema'),
('app.timezone', 'America/Lima', 'general', 'Zona horaria del sistema'),
('app.currency', 'PEN', 'general', 'Moneda base del sistema'),
('app.language', 'es', 'general', 'Idioma por defecto'),
('booking.advance_days', '1', 'booking', 'Días mínimos de anticipación para reservas'),
('booking.max_participants', '50', 'booking', 'Máximo de participantes por reserva'),
('payment.tax_rate', '18', 'payment', 'Tasa de IGV en porcentaje'),
('notification.email_enabled', 'true', 'notification', 'Activar notificaciones por email'),
('marketplace.commission_rate', '10', 'marketplace', 'Comisión del marketplace en porcentaje');

-- Usuario administrador inicial
INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, phone, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@futurismo.com',
    '$2b$12$hash_placeholder', -- Reemplazar con hash real
    'admin',
    'Administrador',
    'Sistema',
    '+51999999999',
    'active'
);

-- Contactos de emergencia básicos
INSERT INTO emergency_contacts (name, organization, role, primary_phone, available_24h) VALUES
('Policía Nacional', 'PNP', 'Seguridad Ciudadana', '105', true),
('Bomberos', 'Bomberos Voluntarios', 'Emergencias y Rescate', '116', true),
('SAMU', 'Sistema de Atención Móvil de Urgencia', 'Emergencias Médicas', '106', true),
('Serenazgo Cusco', 'Municipalidad de Cusco', 'Seguridad Local', '(084) 240000', true),
('Defensa Civil', 'INDECI', 'Desastres Naturales', '115', true);

-- Protocolo de emergencia básico
INSERT INTO emergency_protocols (
    title, protocol_code, category, priority_level, description, 
    primary_responsible, status
) VALUES (
    'Emergencia Médica durante Tour',
    'EMER-MED-001',
    'medical',
    'high',
    'Protocolo para atender emergencias médicas durante servicios turísticos',
    'Guía Responsable del Tour',
    'active'
);
```

---

## CONSIDERACIONES TÉCNICAS

### Rendimiento
- **Índices:** Se han definido índices estratégicos para optimizar consultas frecuentes
- **Particionamiento:** Considerar particionar tablas grandes como `audit_logs` por fecha
- **Archivado:** Implementar estrategias de archivado para datos históricos
- **Caché:** Utilizar Redis para cachear consultas frecuentes y sesiones

### Seguridad
- **Encriptación:** Passwords hasheados con bcrypt, datos sensibles encriptados
- **Auditoría:** Registro completo de todas las acciones críticas
- **Permisos:** Control granular de acceso basado en roles
- **Backup:** Respaldos automáticos diarios y replicación

### Escalabilidad
- **Conexiones:** Pool de conexiones optimizado
- **Réplicas de lectura:** Para consultas de reporting
- **CDN:** Para archivos estáticos y multimedia
- **Microservicios:** Posible separación futura por dominios

### Monitoreo
- **Métricas:** Estadísticas automáticas diarias y mensuales
- **Alertas:** Notificaciones automáticas para eventos críticos
- **Logs:** Registro detallado para debugging y análisis
- **Health checks:** Verificaciones de estado del sistema

---

## ESTIMACIONES DE VOLUMEN

### Proyecciones anuales (año 1)
- **Usuarios:** ~500 usuarios activos
- **Reservas:** ~50,000 reservas anuales
- **Servicios:** ~45,000 servicios completados
- **Mensajes:** ~500,000 mensajes
- **Archivos:** ~100,000 archivos (10GB aprox.)
- **Logs de auditoría:** ~2,000,000 registros

### Crecimiento esperado
- **Año 2:** 150% del volumen año 1
- **Año 3:** 200% del volumen año 1
- **Año 5:** 500% del volumen año 1

---

Este diseño de base de datos proporciona una base sólida y escalable para el sistema Futurismo, cubriendo todos los aspectos identificados en el análisis del frontend y permitiendo futuras expansiones de funcionalidad.