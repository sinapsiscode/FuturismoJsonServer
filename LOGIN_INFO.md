# Información de Login - Futurismo

## Acceso a la aplicación

La aplicación está corriendo en: http://localhost:5178

## Credenciales de Acceso

Para hacer login en la aplicación, usa cualquiera de estos usuarios con la contraseña indicada:

### Administrador
- **Email**: admin@futurismo.com
- **Password**: demo123

### Agencia
- **Email**: agency@futurismo.com
- **Password**: demo123

### Guía
- **Email**: guide@futurismo.com
- **Password**: demo123

## Notas Importantes

1. **Contraseña única**: Por seguridad del simulador, todos los usuarios usan la misma contraseña temporal: `demo123`

2. **Errores esperados**: Al hacer login exitoso, es normal ver algunos errores en la consola relacionados con:
   - Notificaciones (el endpoint funciona pero puede faltar data inicial)
   - Estadísticas del dashboard (algunos endpoints están en desarrollo)

3. **Funcionalidad disponible**: Una vez autenticado, podrás acceder a las diferentes secciones según el rol del usuario.

## Solución de Problemas

Si tienes problemas para hacer login:

1. Verifica que el backend esté corriendo en el puerto 4050
2. Verifica que el frontend esté corriendo en el puerto 5178
3. Limpia el caché del navegador (Ctrl+Shift+R)
4. Revisa la consola del navegador para mensajes de error específicos

## Resumen de las correcciones realizadas

1. ✅ **Corregido el bucle infinito** en `useAppConfig` - Se arregló la violación de Rules of Hooks
2. ✅ **Configurado el proxy de Vite** - Las llamadas API ahora usan URLs relativas en desarrollo
3. ✅ **Actualizado authService** - Usa URLs relativas para funcionar con el proxy
4. ✅ **Actualizado baseService** - Todos los servicios ahora usan URLs relativas en desarrollo
5. ✅ **ConfigProvider habilitado** - Funciona sin causar bucles infinitos
6. ✅ **Token de autenticación** - Se obtiene correctamente del store de Zustand