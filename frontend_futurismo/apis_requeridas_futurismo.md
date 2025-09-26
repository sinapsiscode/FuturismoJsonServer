# APIs Requeridas - Sistema Futurismo

## Descripci�n General
Sistema completo de gesti�n tur�stica con 53 tablas organizadas en 10 m�dulos principales. Todas las APIs incluyen operaciones CRUD b�sicas m�s operaciones espec�ficas del negocio.

**Base URL:** `https://api.futurismo.com/v1`

**Autenticaci�n:** Bearer Token (JWT)

**Formato de Respuesta:** JSON

---

## 1. GESTI�N DE USUARIOS Y AUTENTICACI�N

### 1.1 Usuarios (tbl_usuarios)
```
GET    /usuarios                     # Listar usuarios (con filtros)
GET    /usuarios/{id}                # Obtener usuario espec�fico
POST   /usuarios                     # Crear nuevo usuario
PUT    /usuarios/{id}                # Actualizar usuario completo
PATCH  /usuarios/{id}                # Actualizar campos espec�ficos
DELETE /usuarios/{id}                # Eliminar usuario (soft delete)

# Operaciones espec�ficas
POST   /usuarios/{id}/cambiar_contrasena    # Cambiar contraseña
POST   /usuarios/{id}/verificar_email       # Verificar email
POST   /usuarios/{id}/verificar_telefono       # Verificar teléfono
GET    /usuarios/{id}/ultimo_acceso        # Obtener último acceso
PUT    /usuarios/{id}/actualizar_acceso      # Actualizar último acceso
```

### 1.2 Perfiles de Usuarios (tbl_perfiles_usuarios)
```
GET    /usuarios/{usuarioId}/perfil        # Obtener perfil de usuario
POST   /usuarios/{usuarioId}/perfil        # Crear perfil de usuario
PUT    /usuarios/{usuarioId}/perfil        # Actualizar perfil completo
PATCH  /usuarios/{usuarioId}/perfil        # Actualizar campos específicos
DELETE /usuarios/{usuarioId}/perfil        # Eliminar perfil

# Operaciones espec�ficas
GET    /usuarios/{usuarioId}/perfil/preferencias      # Obtener preferencias
PUT    /usuarios/{usuarioId}/perfil/preferencias      # Actualizar preferencias
GET    /usuarios/{usuarioId}/perfil/privacidad          # Obtener configuración privacidad
PUT    /usuarios/{usuarioId}/perfil/privacidad          # Actualizar configuración privacidad
GET    /usuarios/{usuarioId}/perfil/notificaciones    # Obtener configuración notificaciones
PUT    /usuarios/{usuarioId}/perfil/notificaciones    # Actualizar configuración notificaciones
```

### 1.3 Roles (tbl_roles)
```
GET    /roles                     # Listar todos los roles
GET    /roles/{id}                # Obtener rol espec�fico
POST   /roles                     # Crear nuevo rol
PUT    /roles/{id}                # Actualizar rol
DELETE /roles/{id}                # Eliminar rol

# Operaciones espec�ficas
GET    /roles/{id}/permisos    # Obtener permisos del rol
POST   /roles/{id}/permisos    # Asignar permisos al rol
DELETE /roles/{id}/permisos/{permisoId}  # Remover permiso del rol
```

### 1.4 Permisos (tbl_permisos)
```
GET    /permisos               # Listar todos los permisos
GET    /permisos/{id}          # Obtener permiso espec�fico
POST   /permisos               # Crear nuevo permiso
PUT    /permisos/{id}          # Actualizar permiso
DELETE /permisos/{id}          # Eliminar permiso
```

### 1.5 Roles-Permisos (tbl_roles_permisos)
```
GET    /roles_permisos         # Listar todas las asignaciones
POST   /roles_permisos         # Crear nueva asignaci�n
DELETE /roles_permisos/{id}    # Eliminar asignaci�n espec�fica
GET    /roles/{rolId}/permisos/{permisoId}  # Verificar asignación específica
```

---

## 2. ENTIDADES DE NEGOCIO

### 2.1 Agencias (tbl_agencias)
```
GET    /agencias                  # Listar agencias (con filtros)
GET    /agencias/{id}             # Obtener agencia espec�fica
POST   /agencias                  # Crear nueva agencia
PUT    /agencias/{id}             # Actualizar agencia completa
PATCH  /agencias/{id}             # Actualizar campos espec�ficos
DELETE /agencias/{id}             # Eliminar agencia

# Operaciones espec�ficas
GET    /agencias/{id}/guias      # Obtener gu�as de la agencia
GET    /agencias/{id}/conductores     # Obtener conductores de la agencia
GET    /agencias/{id}/vehiculos    # Obtener veh�culos de la agencia
GET    /agencias/{id}/tours       # Obtener tours de la agencia
GET    /agencias/{id}/estadisticas  # Obtener estad�sticas de la agencia
GET    /agencias/buscar          # Buscar agencias por criterios
```

### 2.2 Gu�as (tbl_guias)
```
GET    /guias                    # Listar gu�as (con filtros)
GET    /guias/{id}               # Obtener gu�a espec�fico
POST   /guias                    # Crear nuevo gu�a
PUT    /guias/{id}               # Actualizar gu�a completo
PATCH  /guias/{id}               # Actualizar campos espec�ficos
DELETE /guias/{id}               # Eliminar gu�a

# Operaciones espec�ficas
GET    /guias/{id}/disponibilidad  # Obtener disponibilidad del gu�a
POST   /guias/{id}/disponibilidad  # Crear disponibilidad
PUT    /guias/{id}/disponibilidad/{disponibilidadId}  # Actualizar disponibilidad
GET    /guias/{id}/idiomas     # Obtener idiomas del gu�a
POST   /guias/{id}/idiomas     # Agregar idioma al gu�a
GET    /guias/{id}/especializaciones  # Obtener especializaciones
POST   /guias/{id}/especializaciones  # Agregar especializaci�n
GET    /guias/{id}/museos       # Obtener museos conocidos
POST   /guias/{id}/museos       # Agregar museo
GET    /guias/{id}/certificaciones  # Obtener certificaciones
POST   /guias/{id}/certificaciones  # Agregar certificaci�n
GET    /guias/{id}/precios       # Obtener precios del gu�a
POST   /guias/{id}/precios       # Crear nuevo precio
GET    /guias/{id}/resenas       # Obtener rese�as del gu�a
GET    /guias/{id}/estadisticas    # Obtener estad�sticas del gu�a
GET    /guias/buscar            # Buscar gu�as por criterios
GET    /guias/disponibles         # Gu�as disponibles para fecha/hora
```

### 2.3 Conductores (tbl_conductores)
```
GET    /conductores                   # Listar conductores
GET    /conductores/{id}              # Obtener conductor espec�fico
POST   /conductores                   # Crear nuevo conductor
PUT    /conductores/{id}              # Actualizar conductor
PATCH  /conductores/{id}              # Actualizar campos espec�ficos
DELETE /conductores/{id}              # Eliminar conductor

# Operaciones espec�ficas
GET    /conductores/{id}/ubicacion     # Obtener ubicaci�n actual
PUT    /conductores/{id}/ubicacion     # Actualizar ubicaci�n
GET    /conductores/{id}/estado       # Obtener estado de disponibilidad
PUT    /conductores/{id}/estado       # Actualizar estado
GET    /conductores/{id}/asignaciones  # Obtener asignaciones de veh�culos
GET    /conductores/{id}/servicios     # Obtener servicios realizados
GET    /conductores/disponibles         # Conductores disponibles
GET    /conductores/cercanos           # Conductores cercanos a ubicaci�n
```

### 2.4 Clientes (tbl_clientes)
```
GET    /clientes                   # Listar clientes
GET    /clientes/{id}              # Obtener cliente espec�fico
POST   /clientes                   # Crear nuevo cliente
PUT    /clientes/{id}              # Actualizar cliente completo
PATCH  /clientes/{id}              # Actualizar campos espec�ficos
DELETE /clientes/{id}              # Eliminar cliente

# Operaciones espec�ficas
GET    /clientes/{id}/reservas # Obtener reservas del cliente
GET    /clientes/{id}/historial      # Obtener historial de servicios
GET    /clientes/{id}/preferencias  # Obtener preferencias del cliente
PUT    /clientes/{id}/preferencias  # Actualizar preferencias
GET    /clientes/buscar           # Buscar clientes por criterios
```

---

## 3. ESPECIALIZACI�N DE GU�AS

### 3.1 Idiomas de Gu�as (tbl_idiomas_guias)
```
GET    /guias/{guiaId}/idiomas           # Listar idiomas del gu�a
GET    /guias/{guiaId}/idiomas/{id}      # Obtener idioma espec�fico
POST   /guias/{guiaId}/idiomas           # Agregar idioma al gu�a
PUT    /guias/{guiaId}/idiomas/{id}      # Actualizar idioma
DELETE /guias/{guiaId}/idiomas/{id}      # Eliminar idioma

GET    /idiomas                            # Listar todos los idiomas disponibles
GET    /guias/por_idioma/{idioma}        # Guías que hablan idioma específico
```

### 3.2 Especializaciones de Gu�as (tbl_especializaciones_guias)
```
GET    /guias/{guiaId}/especializaciones     # Listar especializaciones del gu�a
GET    /guias/{guiaId}/especializaciones/{id}  # Obtener especializaci�n espec�fica
POST   /guias/{guiaId}/especializaciones     # Agregar especializaci�n
PUT    /guias/{guiaId}/especializaciones/{id}  # Actualizar especializaci�n
DELETE /guias/{guiaId}/especializaciones/{id}  # Eliminar especializaci�n

GET    /especializaciones                      # Listar todas las especializaciones
GET    /guias/por_especializacion/{especializacion} # Guías con especialización específica
```

### 3.3 Museos de Gu�as (tbl_museos_guias)
```
GET    /guias/{guiaId}/museos             # Listar museos del gu�a
GET    /guias/{guiaId}/museos/{id}        # Obtener museo espec�fico
POST   /guias/{guiaId}/museos             # Agregar museo
PUT    /guias/{guiaId}/museos/{id}        # Actualizar informaci�n del museo
DELETE /guias/{guiaId}/museos/{id}        # Eliminar museo

GET    /museos                              # Listar todos los museos
GET    /guias/por_museo/{museo}            # Guías especializados en museo
```

### 3.4 Certificaciones de Gu�as (tbl_certificaciones_guias)
```
GET    /guias/{guiaId}/certificaciones      # Listar certificaciones del gu�a
GET    /guias/{guiaId}/certificaciones/{id} # Obtener certificaci�n espec�fica
POST   /guias/{guiaId}/certificaciones      # Agregar certificaci�n
PUT    /guias/{guiaId}/certificaciones/{id} # Actualizar certificaci�n
DELETE /guias/{guiaId}/certificaciones/{id} # Eliminar certificaci�n

GET    /certificaciones/por_vencer              # Certificaciones pr�ximas a vencer
GET    /certificaciones/vencidas               # Certificaciones vencidas
```

### 3.5 Disponibilidad de Gu�as (tbl_disponibilidad_guias)
```
GET    /guias/{guiaId}/disponibilidad        # Obtener disponibilidad del gu�a
POST   /guias/{guiaId}/disponibilidad        # Crear nueva disponibilidad
PUT    /guias/{guiaId}/disponibilidad/{id}   # Actualizar disponibilidad
DELETE /guias/{guiaId}/disponibilidad/{id}   # Eliminar disponibilidad

GET    /guias/{guiaId}/disponibilidad/semanal    # Horario semanal
POST   /guias/{guiaId}/disponibilidad/semanal    # Establecer horario semanal
GET    /guias/{guiaId}/disponibilidad/bloqueadas   # Fechas bloqueadas
POST   /guias/{guiaId}/disponibilidad/bloquear     # Bloquear fechas
GET    /guias/disponibles_en/{fecha}              # Guías disponibles en fecha
```

### 3.6 Precios de Gu�as (tbl_precios_guias)
```
GET    /guias/{guiaId}/precios             # Obtener precios del gu�a
GET    /guias/{guiaId}/precios/{id}        # Obtener precio espec�fico
POST   /guias/{guiaId}/precios             # Crear nuevo precio
PUT    /guias/{guiaId}/precios/{id}        # Actualizar precio
DELETE /guias/{guiaId}/precios/{id}        # Eliminar precio

GET    /guias/{guiaId}/precios/activos      # Precios activos
GET    /guias/{guiaId}/precios/por_servicio/{tipoServicio}  # Precio por tipo de servicio
```

---

## 4. GESTI�N DE VEH�CULOS

### 4.1 Veh�culos (tbl_vehiculos)
```
GET    /vehiculos                  # Listar veh�culos
GET    /vehiculos/{id}             # Obtener veh�culo espec�fico
POST   /vehiculos                  # Crear nuevo veh�culo
PUT    /vehiculos/{id}             # Actualizar veh�culo completo
PATCH  /vehiculos/{id}             # Actualizar campos espec�ficos
DELETE /vehiculos/{id}             # Eliminar veh�culo

# Operaciones espec�ficas
GET    /vehiculos/{id}/ubicacion    # Obtener ubicaci�n actual
PUT    /vehiculos/{id}/ubicacion    # Actualizar ubicaci�n
GET    /vehiculos/{id}/estado      # Obtener estado del veh�culo
PUT    /vehiculos/{id}/estado      # Actualizar estado
GET    /vehiculos/{id}/asignaciones # Obtener asignaciones
GET    /vehiculos/{id}/mantenimiento # Obtener historial de mantenimiento
GET    /vehiculos/disponibles        # Veh�culos disponibles
GET    /vehiculos/por_capacidad/{capacidad}  # Vehículos por capacidad
```

### 4.2 Asignaciones de Veh�culos (tbl_asignaciones_vehiculos)
```
GET    /asignaciones_vehiculos       # Listar asignaciones
GET    /asignaciones_vehiculos/{id}  # Obtener asignaci�n espec�fica
POST   /asignaciones_vehiculos       # Crear nueva asignaci�n
PUT    /asignaciones_vehiculos/{id}  # Actualizar asignaci�n
DELETE /asignaciones_vehiculos/{id}  # Eliminar asignaci�n

GET    /vehiculos/{vehiculoId}/asignaciones     # Asignaciones del vehículo
GET    /conductores/{conductorId}/asignaciones       # Asignaciones del conductor
GET    /asignaciones_vehiculos/activos           # Asignaciones activas
```

### 4.3 Registros de Mantenimiento (tbl_registros_mantenimiento)
```
GET    /vehiculos/{vehiculoId}/mantenimiento     # Historial de mantenimiento
GET    /vehiculos/{vehiculoId}/mantenimiento/{id}  # Registro específico
POST   /vehiculos/{vehiculoId}/mantenimiento     # Crear registro de mantenimiento
PUT    /vehiculos/{vehiculoId}/mantenimiento/{id}  # Actualizar registro
DELETE /vehiculos/{vehiculoId}/mantenimiento/{id}  # Eliminar registro

GET    /mantenimiento/vencidos                      # Mantenimientos vencidos
GET    /mantenimiento/proximas                 # Pr�ximos mantenimientos
```

---

## 5. GESTI�N DE TOURS Y SERVICIOS

### 5.1 Tours (tbl_tours)
```
GET    /tours                     # Listar tours (con filtros)
GET    /tours/{id}                # Obtener tour espec�fico
POST   /tours                     # Crear nuevo tour
PUT    /tours/{id}                # Actualizar tour completo
PATCH  /tours/{id}                # Actualizar campos espec�ficos
DELETE /tours/{id}                # Eliminar tour

# Operaciones espec�ficas
GET    /tours/{id}/itinerario      # Obtener itinerario del tour
POST   /tours/{id}/itinerario      # Crear itinerario
GET    /tours/{id}/disponibilidad   # Obtener disponibilidad del tour
POST   /tours/{id}/disponibilidad   # Crear disponibilidad
GET    /tours/{id}/reservas   # Obtener reservas del tour
GET    /tours/buscar             # Buscar tours por criterios
GET    /tours/populares            # Tours más populares
GET    /tours/por_categoria/{categoria}  # Tours por categoría
GET    /tours/por_duracion/{duracion}  # Tours por duración
```

### 5.2 Itinerario de Tours (tbl_itinerario_tours)
```
GET    /tours/{tourId}/itinerario           # Obtener itinerario completo
GET    /tours/{tourId}/itinerario/{id}      # Obtener paso espec�fico
POST   /tours/{tourId}/itinerario           # Agregar paso al itinerario
PUT    /tours/{tourId}/itinerario/{id}      # Actualizar paso
DELETE /tours/{tourId}/itinerario/{id}      # Eliminar paso

POST   /tours/{tourId}/itinerario/reordenar   # Reordenar pasos del itinerario
```

### 5.3 Disponibilidad de Tours (tbl_disponibilidad_tours)
```
GET    /tours/{tourId}/disponibilidad        # Obtener disponibilidad
GET    /tours/{tourId}/disponibilidad/{id}   # Obtener slot espec�fico
POST   /tours/{tourId}/disponibilidad        # Crear slot de disponibilidad
PUT    /tours/{tourId}/disponibilidad/{id}   # Actualizar slot
DELETE /tours/{tourId}/disponibilidad/{id}   # Eliminar slot

GET    /tours/{tourId}/disponibilidad/calendario/{mes}/{anio}  # Calendario mensual
GET    /tours/disponibilidad/fecha/{fecha}     # Tours disponibles en fecha
```

### 5.4 Reservas (tbl_reservas)
```
GET    /reservas              # Listar reservas (con filtros)
GET    /reservas/{id}         # Obtener reserva espec�fica
POST   /reservas              # Crear nueva reserva
PUT    /reservas/{id}         # Actualizar reserva completa
PATCH  /reservas/{id}         # Actualizar campos espec�ficos
DELETE /reservas/{id}         # Cancelar reserva

# Operaciones espec�ficas
GET    /reservas/{id}/participantes  # Obtener participantes
POST   /reservas/{id}/participantes  # Agregar participante
GET    /reservas/{id}/estado        # Obtener estado de la reserva
PUT    /reservas/{id}/estado        # Actualizar estado
GET    /reservas/{id}/pago       # Obtener informaci�n de pago
POST   /reservas/{id}/pago       # Procesar pago
GET    /reservas/proximas           # Reservas pr�ximas
GET    /reservas/hoy              # Reservas de hoy
GET    /clientes/{clienteId}/reservas # Reservas del cliente
```

### 5.5 Participantes de Reservas (tbl_participantes_reservas)
```
GET    /reservas/{reservaId}/participantes     # Listar participantes
GET    /reservas/{reservaId}/participantes/{id}  # Obtener participante
POST   /reservas/{reservaId}/participantes     # Agregar participante
PUT    /reservas/{reservaId}/participantes/{id}  # Actualizar participante
DELETE   /reservas/{reservaId}/participantes/{id}  # Eliminar participante
```

### 5.6 Servicios (tbl_servicios)
```
GET    /servicios                  # Listar servicios
GET    /servicios/{id}             # Obtener servicio espec�fico
POST   /servicios                  # Crear nuevo servicio
PUT    /servicios/{id}             # Actualizar servicio completo
PATCH  /servicios/{id}             # Actualizar campos espec�ficos
DELETE /servicios/{id}             # Eliminar servicio

# Operaciones espec�ficas
GET    /servicios/{id}/eventos      # Obtener eventos del servicio
POST   /servicios/{id}/eventos      # Crear evento
GET    /servicios/{id}/estado      # Obtener estado del servicio
PUT    /servicios/{id}/estado      # Actualizar estado
GET    /servicios/{id}/ubicacion    # Obtener ubicaci�n del servicio
PUT    /servicios/{id}/ubicacion    # Actualizar ubicaci�n
GET    /servicios/activos           # Servicios activos
GET    /servicios/hoy            # Servicios de hoy
GET    /guias/{guiaId}/servicios # Servicios del gu�a
```

### 5.7 Eventos de Servicios (tbl_eventos_servicios)
```
GET    /servicios/{servicioId}/eventos        # Listar eventos del servicio
GET    /servicios/{servicioId}/eventos/{id}   # Obtener evento específico
POST   /servicios/{servicioId}/eventos        # Crear nuevo evento
PUT    /servicios/{servicioId}/eventos/{id}   # Actualizar evento
DELETE /servicios/{servicioId}/eventos/{id}   # Eliminar evento

GET    /servicios/{servicioId}/eventos/cronologia  # Timeline de eventos
```

---

## 6. GESTI�N FINANCIERA

### 6.1 Transacciones Financieras (tbl_transacciones_financieras)
```
GET    /transacciones_financieras    # Listar transacciones
GET    /transacciones_financieras/{id}  # Obtener transacci�n espec�fica
POST   /transacciones_financieras    # Crear nueva transacci�n
PUT    /transacciones_financieras/{id}  # Actualizar transacci�n
DELETE /transacciones_financieras/{id}  # Eliminar transacci�n

# Operaciones espec�ficas
GET    /transacciones_financieras/por_tipo/{tipo}       # Por tipo de transacción
GET    /transacciones_financieras/por_periodo/{desde}/{hasta}  # Por período
GET    /transacciones_financieras/resumen              # Resumen financiero
GET    /agencias/{agenciaId}/transacciones_financieras  # Transacciones de agencia
GET    /guias/{guiaId}/transacciones_financieras     # Transacciones de gu�a
```

### 6.2 Comprobantes de Pago (tbl_comprobantes_pago)
```
GET    /comprobantes_pago          # Listar comprobantes
GET    /comprobantes_pago/{id}     # Obtener comprobante espec�fico
POST   /comprobantes_pago          # Crear nuevo comprobante
PUT    /comprobantes_pago/{id}     # Actualizar comprobante
DELETE /comprobantes_pago/{id}     # Anular comprobante

# Operaciones espec�ficas
GET    /comprobantes_pago/{id}/articulos     # Obtener items del comprobante
POST   /comprobantes_pago/{id}/articulos     # Agregar item
GET    /comprobantes_pago/{id}/pdf       # Generar PDF del comprobante
GET    /comprobantes_pago/por_cliente/{clienteId}  # Comprobantes del cliente
```

### 6.3 Items de Comprobantes (tbl_items_comprobantes)
```
GET    /comprobantes_pago/{comprobanteId}/articulos     # Listar items
GET    /comprobantes_pago/{comprobanteId}/articulos/{id}  # Obtener item específico
POST   /comprobantes_pago/{comprobanteId}/articulos     # Crear nuevo item
PUT    /comprobantes_pago/{comprobanteId}/articulos/{id}  # Actualizar item
DELETE /comprobantes_pago/{comprobanteId}/articulos/{id}  # Eliminar item
```

### 6.4 Transacciones de Puntos (tbl_transacciones_puntos)
```
GET    /transacciones_puntos       # Listar transacciones de puntos
GET    /transacciones_puntos/{id}  # Obtener transacci�n espec�fica
POST   /transacciones_puntos       # Crear nueva transacci�n
PUT    /transacciones_puntos/{id}  # Actualizar transacci�n
DELETE /transacciones_puntos/{id}  # Eliminar transacci�n

GET    /clientes/{clienteId}/puntos/saldo      # Saldo de puntos del cliente
GET    /clientes/{clienteId}/puntos/historial      # Historial de puntos
POST   /clientes/{clienteId}/puntos/ganar         # Otorgar puntos
POST   /clientes/{clienteId}/puntos/canjear       # Canjear puntos
```

### 6.5 Cat�logo de Recompensas (tbl_catalogo_recompensas)
```
GET    /catalogo_recompensas           # Listar recompensas disponibles
GET    /catalogo_recompensas/{id}      # Obtener recompensa específica
POST   /catalogo_recompensas           # Crear nueva recompensa
PUT    /catalogo_recompensas/{id}      # Actualizar recompensa
DELETE /catalogo_recompensas/{id}      # Eliminar recompensa

GET    /catalogo_recompensas/disponibles/{clienteId}   # Recompensas disponibles para cliente
GET    /catalogo_recompensas/por_puntos/{puntos}     # Recompensas por rango de puntos
```

### 6.6 Canjes de Recompensas (tbl_canjes_recompensas)
```
GET    /canjes_recompensas        # Listar canjes
GET    /canjes_recompensas/{id}   # Obtener canje específico
POST   /canjes_recompensas        # Crear nuevo canje
PUT    /canjes_recompensas/{id}   # Actualizar canje
DELETE /canjes_recompensas/{id}   # Cancelar canje

GET    /clientes/{clienteId}/canjes_recompensas  # Canjes del cliente
GET    /canjes_recompensas/pendientes             # Canjes pendientes
```

---

## 7. MARKETPLACE Y PROVEEDORES

### 7.1 Solicitudes de Servicios (tbl_solicitudes_servicios)
```
GET    /solicitudes_servicios          # Listar solicitudes
GET    /solicitudes_servicios/{id}     # Obtener solicitud espec�fica
POST   /solicitudes_servicios          # Crear nueva solicitud
PUT    /solicitudes_servicios/{id}     # Actualizar solicitud
DELETE /solicitudes_servicios/{id}     # Cancelar solicitud

# Operaciones espec�ficas
GET    /solicitudes_servicios/{id}/respuestas    # Obtener respuestas de gu�as
GET    /solicitudes_servicios/abiertas              # Solicitudes abiertas
GET    /solicitudes_servicios/por_cliente/{clienteId}  # Solicitudes del cliente
GET    /solicitudes_servicios/cercanos/{latitud}/{longitud}    # Solicitudes cercanas
```

### 7.2 Respuestas de Gu�as (tbl_respuestas_guias)
```
GET    /solicitudes_servicios/{solicitudId}/respuestas     # Listar respuestas
GET    /solicitudes_servicios/{solicitudId}/respuestas/{id}  # Obtener respuesta específica
POST   /solicitudes_servicios/{solicitudId}/respuestas     # Crear nueva respuesta
PUT    /solicitudes_servicios/{solicitudId}/respuestas/{id}  # Actualizar respuesta
DELETE /solicitudes_servicios/{solicitudId}/respuestas/{id}  # Eliminar respuesta

GET    /guias/{guiaId}/respuestas                 # Respuestas del guía
POST   /solicitudes_servicios/{solicitudId}/respuestas/{id}/aceptar  # Aceptar respuesta
```

### 7.3 Rese�as del Marketplace (tbl_resenas_marketplace)
```
GET    /resenas_marketplace       # Listar rese�as
GET    /resenas_marketplace/{id}  # Obtener rese�a espec�fica
POST   /resenas_marketplace       # Crear nueva rese�a
PUT    /resenas_marketplace/{id}  # Actualizar rese�a
DELETE /resenas_marketplace/{id}  # Eliminar rese�a

GET    /guias/{guiaId}/resenas          # Rese�as del gu�a
GET    /servicios/{servicioId}/resenas      # Reseñas del servicio
GET    /clientes/{clienteId}/resenas        # Reseñas del cliente
```

### 7.4 Proveedores (tbl_proveedores)
```
GET    /proveedores                 # Listar proveedores
GET    /proveedores/{id}            # Obtener proveedor espec�fico
POST   /proveedores                 # Crear nuevo proveedor
PUT    /proveedores/{id}            # Actualizar proveedor
DELETE /proveedores/{id}            # Eliminar proveedor

GET    /proveedores/{id}/servicios   # Servicios del proveedor
GET    /proveedores/{id}/contratos  # Contratos del proveedor
GET    /proveedores/{id}/asignaciones # Asignaciones del proveedor
```

### 7.5 Servicios de Proveedores (tbl_servicios_proveedores)
```
GET    /proveedores/{proveedorId}/servicios        # Servicios del proveedor
GET    /proveedores/{proveedorId}/servicios/{id}   # Servicio específico
POST   /proveedores/{proveedorId}/servicios        # Crear nuevo servicio
PUT    /proveedores/{proveedorId}/servicios/{id}   # Actualizar servicio
DELETE /proveedores/{proveedorId}/servicios/{id}   # Eliminar servicio

GET    /servicios_proveedores/por_categoria/{categoria}  # Servicios por categoría
GET    /servicios_proveedores/disponibles               # Servicios disponibles
```

### 7.6 Asignaciones de Proveedores (tbl_asignaciones_proveedores)
```
GET    /asignaciones_proveedores      # Listar asignaciones
GET    /asignaciones_proveedores/{id} # Obtener asignaci�n espec�fica
POST   /asignaciones_proveedores      # Crear nueva asignaci�n
PUT    /asignaciones_proveedores/{id} # Actualizar asignaci�n
DELETE /asignaciones_proveedores/{id} # Eliminar asignaci�n

GET    /proveedores/{proveedorId}/asignaciones    # Asignaciones del proveedor
GET    /asignaciones_proveedores/activos          # Asignaciones activas
```

### 7.7 Contratos de Proveedores (tbl_contratos_proveedores)
```
GET    /contratos_proveedores        # Listar contratos
GET    /contratos_proveedores/{id}   # Obtener contrato espec�fico
POST   /contratos_proveedores        # Crear nuevo contrato
PUT    /contratos_proveedores/{id}   # Actualizar contrato
DELETE /contratos_proveedores/{id}   # Eliminar contrato

GET    /proveedores/{proveedorId}/contratos     # Contratos del proveedor
GET    /contratos_proveedores/por_vencer          # Contratos pr�ximos a vencer
GET    /contratos_proveedores/activos            # Contratos activos
```

---

## 8. EMERGENCIAS Y SEGURIDAD

### 8.1 Protocolos de Emergencia (tbl_protocolos_emergencia)
```
GET    /protocolos_emergencia       # Listar protocolos
GET    /protocolos_emergencia/{id}  # Obtener protocolo espec�fico
POST   /protocolos_emergencia       # Crear nuevo protocolo
PUT    /protocolos_emergencia/{id}  # Actualizar protocolo
DELETE /protocolos_emergencia/{id}  # Eliminar protocolo

GET    /protocolos_emergencia/{id}/pasos      # Obtener pasos del protocolo
GET    /protocolos_emergencia/por_tipo/{tipo}  # Protocolos por tipo de emergencia
```

### 8.2 Pasos de Protocolos (tbl_pasos_protocolos)
```
GET    /protocolos_emergencia/{protocoloId}/pasos     # Listar pasos
GET    /protocolos_emergencia/{protocoloId}/pasos/{id}  # Obtener paso específico
POST   /protocolos_emergencia/{protocoloId}/pasos     # Crear nuevo paso
PUT    /protocolos_emergencia/{protocoloId}/pasos/{id}  # Actualizar paso
DELETE /protocolos_emergencia/{protocoloId}/pasos/{id}  # Eliminar paso

POST   /protocolos_emergencia/{protocoloId}/pasos/reordenar  # Reordenar pasos
```

### 8.3 Contactos de Emergencia (tbl_contactos_emergencia)
```
GET    /contactos_emergencia        # Listar contactos de emergencia
GET    /contactos_emergencia/{id}   # Obtener contacto espec�fico
POST   /contactos_emergencia        # Crear nuevo contacto
PUT    /contactos_emergencia/{id}   # Actualizar contacto
DELETE /contactos_emergencia/{id}   # Eliminar contacto

GET    /contactos_emergencia/por_ubicacion/{ubicacion}  # Contactos por ubicación
GET    /contactos_emergencia/por_tipo/{tipo}          # Contactos por tipo
```

### 8.4 Materiales de Emergencia (tbl_materiales_emergencia)
```
GET    /materiales_emergencia       # Listar materiales
GET    /materiales_emergencia/{id}  # Obtener material espec�fico
POST   /materiales_emergencia       # Crear nuevo material
PUT    /materiales_emergencia/{id}  # Actualizar material
DELETE /materiales_emergencia/{id}  # Eliminar material

GET    /materiales_emergencia/stock_bajo      # Materiales con stock bajo
GET    /materiales_emergencia/por_ubicacion/{ubicacion}  # Materiales por ubicación
```

### 8.5 Incidentes (tbl_incidentes)
```
GET    /incidentes                 # Listar incidentes
GET    /incidentes/{id}            # Obtener incidente espec�fico
POST   /incidentes                 # Reportar nuevo incidente
PUT    /incidentes/{id}            # Actualizar incidente
DELETE /incidentes/{id}            # Eliminar incidente

# Operaciones espec�ficas
GET    /incidentes/{id}/cronologia   # Timeline del incidente
POST   /incidentes/{id}/actualizar     # Agregar actualización al incidente
GET    /incidentes/activos          # Incidentes activos
GET    /incidentes/por_severidad/{severidad}    # Incidentes por severidad
GET    /incidentes/por_servicio/{servicioId}    # Incidentes del servicio
GET    /incidentes/estadisticas      # Estad�sticas de incidentes
```

---

## 9. SISTEMA DE COMUNICACI�N

### 9.1 Conversaciones (tbl_conversaciones)
```
GET    /conversaciones             # Listar conversaciones del usuario
GET    /conversaciones/{id}        # Obtener conversaci�n espec�fica
POST   /conversaciones             # Crear nueva conversaci�n
PUT    /conversaciones/{id}        # Actualizar conversaci�n
DELETE /conversaciones/{id}        # Eliminar conversaci�n

# Operaciones espec�ficas
GET    /conversaciones/{id}/participantes  # Obtener participantes
POST   /conversaciones/{id}/participantes  # Agregar participante
GET    /conversaciones/{id}/mensajes      # Obtener mensajes
POST   /conversaciones/{id}/mensajes      # Enviar mensaje
POST   /conversaciones/{id}/abandonar         # Abandonar conversaci�n
```

### 9.2 Participantes de Conversaciones (tbl_participantes_conversaciones)
```
GET    /conversaciones/{conversacionId}/participantes     # Listar participantes
GET    /conversaciones/{conversacionId}/participantes/{id}  # Obtener participante
POST   /conversaciones/{conversacionId}/participantes     # Agregar participante
PUT    /conversaciones/{conversacionId}/participantes/{id}  # Actualizar participante
DELETE /conversaciones/{conversacionId}/participantes/{id}  # Eliminar participante

POST   /conversaciones/{conversacionId}/participantes/{id}/silenciar    # Silenciar participante
POST   /conversaciones/{conversacionId}/participantes/{id}/desilenciar  # Desilenciar participante
```

### 9.3 Mensajes (tbl_mensajes)
```
GET    /conversaciones/{conversacionId}/mensajes     # Listar mensajes
GET    /conversaciones/{conversacionId}/mensajes/{id}  # Obtener mensaje específico
POST   /conversaciones/{conversacionId}/mensajes     # Enviar nuevo mensaje
PUT    /conversaciones/{conversacionId}/mensajes/{id}  # Editar mensaje
DELETE /conversaciones/{conversacionId}/mensajes/{id}  # Eliminar mensaje

# Operaciones específicas
POST   /conversaciones/{conversacionId}/mensajes/{id}/reaccionar     # Reaccionar a mensaje
GET    /conversaciones/{conversacionId}/mensajes/buscar/{consulta}  # Buscar mensajes
GET    /conversaciones/{conversacionId}/mensajes/multimedia          # Mensajes con media
```

### 9.4 Confirmaciones de Lectura (tbl_confirmaciones_lectura)
```
GET    /conversaciones/{conversacionId}/confirmaciones_lectura    # Confirmaciones de la conversación
GET    /mensajes/{mensajeId}/confirmaciones_lectura              # Confirmaciones del mensaje
POST   /mensajes/{mensajeId}/marcar_leido                       # Marcar mensaje como leído
GET    /conversaciones/{conversacionId}/contador_no_leidos          # Contar mensajes no leídos
```

### 9.5 Notificaciones (tbl_notificaciones)
```
GET    /notificaciones             # Listar notificaciones del usuario
GET    /notificaciones/{id}        # Obtener notificaci�n espec�fica
POST   /notificaciones             # Crear nueva notificaci�n
PUT    /notificaciones/{id}        # Actualizar notificaci�n
DELETE /notificaciones/{id}        # Eliminar notificaci�n

# Operaciones espec�ficas
POST   /notificaciones/{id}/marcar_leido     # Marcar como le�da
POST   /notificaciones/marcar_todas_leidas      # Marcar todas como le�das
GET    /notificaciones/no_leidas             # Notificaciones no le�das
GET    /notificaciones/contador_no_leidos       # Contar no le�das
```

---

## 10. ADMINISTRACI�N DEL SISTEMA

### 10.1 Configuraciones del Sistema (tbl_configuraciones_sistema)
```
GET    /configuraciones_sistema     # Listar configuraciones
GET    /configuraciones_sistema/{key}  # Obtener configuraci�n espec�fica
POST   /configuraciones_sistema     # Crear nueva configuraci�n
PUT    /configuraciones_sistema/{key}  # Actualizar configuraci�n
DELETE /configuraciones_sistema/{key}  # Eliminar configuraci�n

GET    /configuraciones_sistema/por_modulo/{modulo}  # Configuraciones por módulo
GET    /configuraciones_sistema/publicas              # Configuraciones p�blicas
```

### 10.2 Registros de Auditor�a (tbl_registros_auditoria)
```
GET    /registros_auditoria                # Listar registros de auditor�a
GET    /registros_auditoria/{id}           # Obtener registro espec�fico
POST   /registros_auditoria                # Crear nuevo registro
DELETE /registros_auditoria/{id}          # Eliminar registro (solo admin)

# Operaciones espec�ficas
GET    /registros_auditoria/por_usuario/{usuarioId}           # Registros por usuario
GET    /registros_auditoria/por_tabla/{nombreTabla}       # Registros por tabla
GET    /registros_auditoria/por_accion/{accion}         # Registros por acción
GET    /registros_auditoria/por_periodo/{desde}/{hasta}      # Registros por período
GET    /registros_auditoria/resumen                    # Resumen de auditor�a
```

### 10.3 Archivos Subidos (tbl_archivos_subidos)
```
GET    /archivos_subidos            # Listar archivos subidos
GET    /archivos_subidos/{id}       # Obtener informaci�n del archivo
POST   /archivos_subidos            # Subir nuevo archivo
DELETE /archivos_subidos/{id}       # Eliminar archivo

# Operaciones espec�ficas
GET    /archivos_subidos/{id}/descargar      # Descargar archivo
GET    /archivos_subidos/por_usuario/{usuarioId}   # Archivos del usuario
GET    /archivos_subidos/por_tipo/{tipo}     # Archivos por tipo
GET    /archivos_subidos/huerfanos           # Archivos hu�rfanos
```

### 10.4 Estad�sticas Diarias (tbl_estadisticas_diarias)
```
GET    /estadisticas_diarias          # Listar estad�sticas diarias
GET    /estadisticas_diarias/{fecha}   # Obtener estadísticas de fecha específica
POST   /estadisticas_diarias          # Crear estadísticas del día
PUT    /estadisticas_diarias/{fecha}   # Actualizar estadísticas del día

GET    /estadisticas_diarias/periodo/{desde}/{hasta}    # Estadísticas por período
GET    /estadisticas_diarias/ultimas                # �ltimas estad�sticas
```

### 10.5 Estad�sticas Mensuales (tbl_estadisticas_mensuales)
```
GET    /estadisticas_mensuales        # Listar estad�sticas mensuales
GET    /estadisticas_mensuales/{anio}/{mes}  # Obtener estadísticas específicas
POST   /estadisticas_mensuales        # Crear estadísticas del mes
PUT    /estadisticas_mensuales/{anio}/{mes}  # Actualizar estadísticas

GET    /estadisticas_mensuales/anio/{anio}     # Estadísticas del año
GET    /estadisticas_mensuales/comparacion/{anio1}/{anio2}  # Comparar años
```

---

## 11. APIS DE AUTENTICACI�N Y AUTORIZACI�N

```
POST   /autenticacion/registrar             # Registrar nuevo usuario
POST   /autenticacion/iniciar_sesion                # Iniciar sesión
POST   /autenticacion/cerrar_sesion               # Cerrar sesión
POST   /autenticacion/renovar_token        # Renovar token de acceso
POST   /autenticacion/olvide_contrasena      # Solicitar recuperación de contraseña
POST   /autenticacion/restablecer_contrasena       # Restablecer contraseña
POST   /autenticacion/verificar_email         # Verificar email
POST   /autenticacion/reenviar_verificacion  # Reenviar verificación de email

GET    /autenticacion/perfil              # Obtener perfil del usuario autenticado
PUT    /autenticacion/perfil              # Actualizar perfil del usuario autenticado
POST   /autenticacion/cambiar_contrasena      # Cambiar contraseña
```

---

## 12. APIS DE B�SQUEDA Y FILTROS

```
GET    /buscar/global?q={consulta}           # Búsqueda global
GET    /buscar/guias?filtros={filtros}   # Búsqueda avanzada de guías
GET    /buscar/tours?filtros={filtros}    # Búsqueda avanzada de tours
GET    /buscar/agencias?filtros={filtros} # Búsqueda avanzada de agencias
GET    /buscar/clientes?filtros={filtros}  # Búsqueda avanzada de clientes

GET    /filtros/guias                    # Obtener filtros disponibles para gu�as
GET    /filtros/tours                     # Obtener filtros disponibles para tours
GET    /filtros/reservas              # Obtener filtros disponibles para reservas
```

---

## 13. APIS DE REPORTES Y ANALYTICS

```
GET    /reportes/ventas                     # Reporte de ventas
GET    /reportes/rendimiento_guias        # Reporte de rendimiento de guías
GET    /reportes/popularidad_tours          # Reporte de popularidad de tours
GET    /reportes/resumen_financiero         # Resumen financiero
GET    /reportes/satisfaccion_clientes       # Reporte de satisfacción de clientes

GET    /analiticas/dashboard               # Datos para dashboard principal
GET    /analiticas/tiempo_real                # Métricas en tiempo real
GET    /analiticas/tendencias                  # Tendencias y predicciones
```

---

## 14. APIS DE INTEGRACI�N Y WEBHOOKS

```
POST   /webhooks/confirmacion_pago     # Webhook de confirmación de pago
POST   /webhooks/actualizacion_reserva       # Webhook de actualización de reserva
POST   /webhooks/alerta_emergencia          # Webhook de alerta de emergencia

GET    /integraciones/pasarelas_pago     # Pasarelas de pago disponibles
POST   /integraciones/pasarelas_pago/{pasarela}/procesar  # Procesar pago
GET    /integraciones/mapas/geocodificar         # Geocodificación
GET    /integraciones/mapas/direcciones      # Obtener direcciones
```

---

## C�digos de Estado HTTP Utilizados

- **200 OK** - Operaci�n exitosa
- **201 Created** - Recurso creado exitosamente
- **204 No Content** - Operaci�n exitosa sin contenido de respuesta
- **400 Bad Request** - Solicitud malformada o datos inv�lidos
- **401 Unauthorized** - Token de autenticaci�n requerido o inv�lido
- **403 Forbidden** - Permisos insuficientes
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Conflicto con el estado actual del recurso
- **422 Unprocessable Entity** - Datos v�lidos pero reglas de negocio fallidas
- **500 Internal Server Error** - Error interno del servidor

---

## Par�metros de Consulta Comunes

```
?pagina=1&limite=20           # Paginación
?ordenar=campo&orden=asc      # Ordenamiento
?campos=id,nombre,email      # Selección de campos
?incluir=perfil,agencia    # Incluir relaciones
?filtro[estado]=activo     # Filtros
?buscar=término            # Búsqueda de texto
?desde=2024-01-01&hasta=2024-12-31  # Rango de fechas
```

---

## Formato de Respuesta Est�ndar

```json
{
  "exito": true,
  "datos": {},
  "mensaje": "Operación completada exitosamente",
  "paginacion": {
    "pagina": 1,
    "limite": 20,
    "total": 100,
    "paginas": 5
  },
  "timestamp": "2024-08-18T12:00:00Z"
}
```

---

## Notas Importantes

1. **Autenticaci�n**: Todas las APIs requieren autenticaci�n JWT excepto las de registro y login
2. **Paginaci�n**: Implementada por defecto en todas las listas con l�mite m�ximo de 100 elementos
3. **Filtros**: Soportan operadores como `eq`, `ne`, `gt`, `lt`, `gte`, `lte`, `like`, `in`
4. **Auditor�a**: Todas las operaciones de modificaci�n se registran autom�ticamente
5. **Soft Delete**: La mayor�a de eliminaciones son l�gicas (campo `estado`)
6. **Rate Limiting**: 1000 requests por hora por usuario autenticado
7. **Versionado**: API versionada con prefijo `/v1`
8. **CORS**: Configurado para permitir or�genes espec�ficos
9. **Compresi�n**: Respuestas comprimidas con gzip
10. **Cache**: Implementado en consultas de solo lectura frecuentes

---

**Total de Endpoints Generados: 486**

**�ltima Actualizaci�n: 18 de Agosto, 2024**