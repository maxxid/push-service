# Plan de Trabajo — Plataforma de Comunicación Institucional PWA + Push

## Sprint 0 — Setup y Fundaciones (Semana 1)

- [ ] Inicializar proyecto Next.js + TypeScript + TailwindCSS
- [ ] Configurar ESLint, Prettier, tsconfig
- [ ] Configurar Prisma + PostgreSQL (local y Vercel Postgres)
- [ ] Definir schema de base de datos (users, companies, campaigns, notifications, subscriptions, segments, landing_pages, logs, roles)
- [ ] Configurar NextAuth / JWT con roles (admin, company_owner, company_editor)
- [ ] Crear layout base del panel administrativo (sidebar, header, responsive)
- [ ] Configurar multi-tenancy en middleware (subdominio → empresa)
- [ ] Crear seeders iniciales
- [ ] Deploy inicial a Vercel

---

## Sprint 1 — Multiempresa y Branding (Semana 2)

- [ ] CRUD de empresas (solo superadmin)
- [ ] Configuración de branding por empresa: logo, colores, nombre institucional
- [ ] Subdominios por empresa (avisos.camaradeltabaco.com.ar)
- [ ] Middleware que resuelve empresa por subdominio/host
- [ ] Portal PWA muestra branding dinámico según empresa
- [ ] Login con redirección al panel de la empresa correspondiente
- [ ] Gestión de roles y permisos por empresa

---

## Sprint 2 — Integración OneSignal + PWA + Suscripciones (Semana 3)

- [ ] Configurar proyecto OneSignal
- [ ] Integrar OneSignal SDK en landing pública
- [ ] Configurar Service Worker para PWA
- [ ] Implementar manifest.json dinámico por empresa
- [ ] Landing principal con branding institucional y botón "Activar notificaciones"
- [ ] Guía de instalación PWA (especial atención iPhone/iOS)
- [ ] Sistema de suscripciones (OneSignal player ID ↔ usuario)
- [ ] Endpoints de registro/desregistro de suscriptores

---

## Sprint 3 — Segmentos (Semana 4)

- [ ] CRUD de segmentos por empresa
- [ ] Asignación manual de usuarios a segmentos
- [ ] Filtros: listar/exportar suscriptores por segmento
- [ ] Listado de usuarios suscriptos con datos (navegador, dispositivo, fecha, segmentos, estado)
- [ ] API: enviar notificación a segmento específico
- [ ] UI de selección de segmento al crear campaña

---

## Sprint 4 — Campañas y Envío de Notificaciones (Semana 5)

- [ ] CRUD de campañas
- [ ] Formulario: título, mensaje push, imagen opcional, segmento, fecha/hora, tipo de acción, prioridad
- [ ] Tipos de destino: landing interna, WhatsApp, PDF, Maps, URL externa
- [ ] Envío inmediato y programado (fecha/hora)
- [ ] Integración real con OneSignal API para envío
- [ ] Prioridades (normal / urgente) con estilos diferenciados en push
- [ ] Historial de campañas: enviadas, pendientes, fallidas
- [ ] Duplicar campaña

---

## Sprint 5 — Constructor de Landing y Micrositios (Semana 6)

- [ ] CRUD de landing pages por empresa
- [ ] Constructor visual simple con bloques: texto, imagen, botón, PDF, video, separadores
- [ ] Editor de contenido por bloque
- [ ] Preview en tiempo real (mobile-first)
- [ ] URL única por landing (slug)
- [ ] Vinculación campaña ↔ landing page
- [ ] Templates iniciales para gremios: comunicado, asamblea, alerta urgente, reunión, documento importante, cambio de horario, aviso importante

---

## Sprint 6 — Dashboard y Estadísticas (Semana 7)

- [ ] Dashboard del panel admin: usuarios suscriptos, campañas enviadas, clics, CTR
- [ ] Métricas por campaña (entregas, clics, CTR)
- [ ] Actividad reciente (últimas campañas, últimos suscriptores)
- [ ] Estadísticas por segmento
- [ ] Exportación de reportes básicos (CSV)

---

## Sprint 7 — Módulos Específicos para Gremios (Semana 8)

- [ ] Sistema de módulos activables/desactivables por empresa
- [ ] Módulo Comunicados (base — ya implementado con campañas + landing)
- [ ] Módulo Documentación: subir PDFs, resoluciones, estatutos (biblioteca)
- [ ] Módulo Contacto Rápido: botones WhatsApp, llamar, email configurables
- [ ] Módulo Formularios: confirmar asistencia, inscripción, solicitudes
- [ ] Módulo Agenda/Eventos: crear eventos con fecha, notificación push asociada

---

## Sprint 8 — Pulido, Onboarding y Seguridad (Semana 9)

- [ ] Flujo de onboarding para nuevos clientes (setup guiado de empresa)
- [ ] Onboarding del afiliado optimizado (QR → landing → activar notificaciones → instalar PWA)
- [ ] Rate limiting en API routes
- [ ] Validaciones y sanitización de inputs
- [ ] Protección de rutas por rol y empresa (no leak cross-company)
- [ ] Página de error 404/500 custom
- [ ] Optimización de carga y lighthouse score
- [ ] Testing manual end-to-end con datos reales (Cámara del Tabaco de Jujuy)

---

## Backlog Futuro (post-MVP)

- Repetición automática de campañas
- Email marketing
- SMS
- Chat interno
- CRM básico
- App nativa (React Native / Capacitor)
- Automatizaciones complejas
- IA para redacción de comunicados
- Módulos para otros verticales (peluquerías, comercios, etc.)

---

## Stack

| Capa       | Tecnología        |
|------------|-------------------|
| Frontend   | Next.js + React + TailwindCSS |
| Backend    | API Routes Next.js |
| Base datos | PostgreSQL        |
| ORM        | Prisma            |
| Auth       | NextAuth / JWT    |
| Push       | OneSignal         |
| Hosting    | Vercel            |
