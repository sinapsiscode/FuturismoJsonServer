# Prueba del Calendario de Agencias

## Problema Identificado

El calendario de coordinación de agencias no mostraba las reservas porque:

1. El endpoint `/api/agencies/:id/calendar` requiere autenticación JWT
2. Las reservas existen en la base de datos pero no se estaban visualizando correctamente

## Solución Implementada

### 1. Backend (routes/agencies.js)

- Agregado logs de depuración para rastrear:
  - Parámetros de la solicitud (agency_id, startDate, endDate)
  - Número total de reservas encontradas
  - Número de reservas en el rango de fechas
  - Fechas con reservas organizadas

- Corregido el mapeo de campos:
  - Ahora busca `tour_id` o `service_id` para encontrar el tour
  - Mejora en la búsqueda de guías, clientes y tours relacionados

### 2. Frontend (pages/AgencyCalendar.jsx)

- Agregado manejo de estados de carga:
  - Loading mientras se inicializa la agencia
  - Loading mientras se cargan datos del calendario
  - Mensajes de error si la agencia no se puede cargar

- Agregado logs de depuración:
  - Log cuando se espera la inicialización de la agencia
  - Log de los parámetros de la solicitud
  - Log de los datos recibidos
  - Log del número de días con reservas

- Mejoras en la UI:
  - Indicador visual de carga
  - Mensajes informativos
  - Mejor manejo de errores

## Datos de Prueba en db.json

Hay 4 reservas para Noviembre 2025 con `agency_id: "agency-001"`:

1. **2025-11-15** - City Tour Lima Centro Histórico
   - Cliente: Juan Pérez
   - 6 personas, S/. 450
   - Estado: confirmed

2. **2025-11-16** - Tour Gastronómico Barranco
   - Cliente: María Torres
   - 4 personas, S/. 320
   - Estado: pending

3. **2025-11-18** - Museo Larco + Huaca Pucllana
   - Cliente: Carlos Ramírez
   - 8 personas, S/. 640
   - Estado: confirmed

4. **2025-11-20** - City Tour Lima Centro Histórico
   - Cliente: Ana López
   - 3 personas, S/. 225
   - Estado: pending

## Cómo Probar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd backend-simulator
npm run dev
```

Deberías ver en la consola:
```
🚀 Futurismo JSON Server is running!
📡 HTTP Server: http://localhost:4050
```

### 2. Inicia sesión como Agencia

Credenciales:
- Email: `contacto@tourslima.com`
- Password: `demo123`

### 3. Navega al Calendario de Reservas

Ve a la sección "Calendario" o "Coordinación" en el menú

### 4. Verifica en la Consola del Navegador

Abre las herramientas de desarrollador (F12) y mira la consola.

Deberías ver:
```
Waiting for agency to be initialized...
Fetching calendar data for: agency-001 from 2025-11-01 to 2025-11-30
Calendar data received: {...}
Number of days with reservations: 4
```

### 5. Verifica en la Consola del Backend

En la terminal del backend deberías ver:
```
✅ [Auth] Token valid for user: contacto@tourslima.com | Role: agency
Calendar request for agency: agency-001 from 2025-11-01 to 2025-11-30
Total reservations for agency: 23
Reservations in date range: 4
Calendar data organized for 4 days
Dates with reservations: 2025-11-15, 2025-11-16, 2025-11-18, 2025-11-20
```

### 6. Verifica en la UI

El calendario debería mostrar:
- 4 días con reservas en noviembre (15, 16, 18, 20)
- Cada día muestra las reservas como tarjetas con:
  - Nombre del servicio
  - Estado (confirmado/pendiente) con color
  - Información del cliente

En el resumen del mes deberías ver:
- Total Reservas: 4
- Ingresos del Mes: S/. 1,635
- Total Turistas: 21
- Confirmadas: 2

## Solución de Problemas

### Si no ves las reservas:

1. **Verifica que estés autenticado**
   - Abre la consola del navegador
   - Ejecuta: `localStorage.getItem('futurismo_authToken')`
   - Debería retornar un token JWT

2. **Verifica que la agencia esté inicializada**
   - En la consola del navegador busca: "Fetching calendar data for: agency-001"
   - Si ves "Waiting for agency to be initialized...", espera unos segundos

3. **Verifica la respuesta del backend**
   - En las herramientas de desarrollador, ve a la pestaña Network
   - Busca la solicitud a `/api/agencies/agency-001/calendar`
   - Verifica que:
     - Status: 200
     - Response tenga `success: true`
     - Response tenga `data` con las fechas

4. **Verifica el formato de las fechas**
   - Las reservas deben tener campos `date`, `tour_date` o `service_date`
   - El formato debe ser: `YYYY-MM-DD`

### Si recibes error 401 (No autorizado):

1. Cierra sesión y vuelve a iniciar sesión
2. Limpia el localStorage: `localStorage.clear()`
3. Recarga la página

### Si el backend no responde:

1. Verifica que esté corriendo en el puerto 4050:
   ```bash
   netstat -ano | findstr :4050
   ```

2. Reinicia el backend:
   ```bash
   cd backend-simulator
   npm run dev
   ```

## Archivos Modificados

1. `backend-simulator/routes/agencies.js` - Endpoint de calendario con logs
2. `frontend_futurismo/src/pages/AgencyCalendar.jsx` - Componente mejorado
3. `backend-simulator/db.json` - 4 reservas de prueba para noviembre 2025

## Próximos Pasos

1. Probar la asignación de guías desde el calendario
2. Agregar filtros por estado de reserva
3. Agregar funcionalidad de arrastrar y soltar para reasignar fechas
4. Implementar vista semanal y diaria
5. Agregar exportación de calendario a PDF/Excel
