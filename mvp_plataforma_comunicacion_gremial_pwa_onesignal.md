# Plataforma de Comunicación Institucional PWA + Push

## Objetivo General

Desarrollar una plataforma SaaS de comunicación institucional basada en:

- PWA (Progressive Web App)
- Push Notifications
- Landing pages dinámicas
- Panel administrativo
- Multiempresa
- Integración con OneSignal

La plataforma estará enfocada inicialmente en:

## Vertical Inicial

### Gremios / Cámaras / Instituciones

Primer cliente objetivo:
- Cámara del Tabaco de Jujuy

Problemas actuales detectados:
- WhatsApp bloquea mensajes masivos
- Los afiliados no leen emails
- Comunicación desordenada
- Información importante se pierde
- Difícil informar cambios urgentes
- Exceso de consultas repetidas

La plataforma debe resolver:

> Comunicación rápida, clara, institucional y confiable.

---

# Arquitectura General

El sistema se divide en:

## 1. Portal Público / PWA
Experiencia del afiliado/usuario final.

## 2. Panel Administrativo
Experiencia del cliente (gremio/institución).

## 3. Backend/API
Gestión centralizada de empresas, usuarios y campañas.

---

# Stack Tecnológico

## Frontend
- Next.js
- React
- TailwindCSS

## Backend
- API Routes de Next.js inicialmente

## Base de datos
- PostgreSQL

## ORM
- Prisma

## Auth
- NextAuth o JWT

## Hosting
- Vercel

## Push Notifications
- OneSignal

---

# Concepto del Producto

NO vender:
- “Push notifications”
- “PWA”
- “Notificaciones web”

SÍ vender:

## Plataforma de Comunicación Institucional

La plataforma permitirá:
- enviar avisos
- compartir comunicados
- generar micrositios informativos
- enviar alertas urgentes
- adjuntar PDFs
- derivar tráfico a WhatsApp
- informar reuniones/eventos
- centralizar comunicación institucional

---

# Multiempresa

El sistema debe soportar múltiples empresas/clientes.

Cada cliente debe tener:

- branding propio
- logo
- colores
- subdominio propio
- usuarios independientes
- campañas independientes
- segmentos independientes

Ejemplo:

- avisos.camaradeltabaco.com.ar
- notificaciones.empresa.com

El usuario final NO debe ver el dominio principal del sistema.

---

# Sistema Modular

## Objetivo

Mostrar únicamente funciones relevantes según el rubro.

Ejemplo:
- un gremio NO necesita promociones
- una peluquería SÍ necesita promociones

---

# Módulo Base (Siempre Activo)

Todas las empresas deben tener:

- Push notifications
- PWA
- Landing pages dinámicas
- Programación de envíos
- Historial
- Dashboard
- Segmentos
- Usuarios suscriptos
- Estadísticas

---

# Módulos Iniciales para Gremios

## 1. Comunicados

Permitir:
- crear comunicado
- enviar push
- adjuntar PDF
- generar landing

---

## 2. Alertas Urgentes

Ejemplos:
- reuniones urgentes
- cambios importantes
- avisos institucionales

Características:
- prioridad alta
- push destacada

---

## 3. Documentación

Permitir:
- compartir PDFs
- resoluciones
- formularios
- estatutos
- documentos oficiales

---

## 4. Contacto Rápido

Botones:
- WhatsApp
- llamar
- email

---

## 5. Formularios

Ejemplos:
- confirmar asistencia
- inscripción
- solicitudes

---

## 6. Segmentos

Ejemplos:
- productores
- afiliados
- directivos
- zonas

---

## 7. Agenda/Eventos

Permitir:
- asambleas
- reuniones
- capacitaciones
- eventos

---

# Portal Público / PWA

## Objetivo

Permitir que los afiliados:
- activen notificaciones
- instalen la PWA
- reciban avisos
- accedan a contenido institucional

---

# Pantallas del Portal

## 1. Landing Principal

Debe incluir:
- logo institucional
- mensaje claro
- explicación simple
- botón “Activar notificaciones”

IMPORTANTE:
NO pedir permisos automáticamente.

Primero explicar el beneficio.
Luego solicitar permisos.

---

## 2. Instalación PWA

Especialmente importante para iPhone.

Mostrar:
- cómo agregar a pantalla principal
- ventajas
- pasos simples

---

## 3. Landing Dinámica de Campaña

Cada notificación debe poder abrir:

## Un micrositio informativo

Componentes posibles:
- título
- subtítulo
- banner
- texto
- imagen
- PDF
- botones
- CTA
- formulario
- video

---

# Tipos de Acciones

Las notificaciones podrán:

- abrir landing interna
- abrir WhatsApp
- abrir Maps
- descargar PDF
- abrir URL externa
- abrir formulario
- llamar

---

# Panel Administrativo

## Objetivo

Permitir que el cliente gestione toda su comunicación institucional.

---

# Pantallas del Panel

## 1. Login

Simple y moderno.

---

## 2. Dashboard

Mostrar:
- usuarios suscriptos
- campañas enviadas
- clics
- CTR
- actividad reciente
- notificaciones recientes

---

## 3. Campañas

Pantalla principal del sistema.

Permitir:
- crear campaña
- editar
- programar
- enviar
- duplicar
- ver estadísticas

---

# Crear Campaña

Campos:
- título
- mensaje push
- imagen opcional
- segmento
- fecha/hora
- tipo de acción
- prioridad

---

# Tipos de Destino

## Opciones:
- landing interna
- WhatsApp
- PDF
- Maps
- URL externa

---

## 4. Constructor de Landing

MUY importante.

Debe permitir construir micrositios simples.

Bloques:
- texto
- imagen
- botón
- PDF
- video
- separadores

Idealmente estilo constructor visual simple.

---

## 5. Segmentos

Permitir:
- crear
- editar
- asignar usuarios
- enviar campañas segmentadas

---

## 6. Usuarios Suscriptos

Mostrar:
- navegador
- dispositivo
- fecha suscripción
- segmentos
- estado

---

## 7. Programación

Permitir:
- enviar ahora
- programar fecha/hora

Futuro:
- repetición automática

---

## 8. Historial

Mostrar:
- enviadas
- pendientes
- fallidas
- CTR
- clics

---

## 9. Branding

Cada empresa debe poder configurar:
- logo
- colores
- nombre institucional

---

# Flujo del Afiliado

## Paso 1
Escanea QR.

## Paso 2
Abre:
- avisos.camaradeltabaco.com.ar

## Paso 3
Ve:
“Recibí avisos importantes de la institución”.

## Paso 4
Activa notificaciones.

## Paso 5
Opcional:
“Instalar app”.

## Paso 6
Recibe notificaciones push.

## Paso 7
Abre micrositio informativo.

---

# Flujo Administrativo

## Paso 1
Empresa ingresa al panel.

## Paso 2
Crea campaña.

## Paso 3
Selecciona:
- segmento
- fecha
- tipo de acción

## Paso 4
Sistema envía push.

## Paso 5
Empresa ve estadísticas.

---

# UX Importante

La activación de notificaciones debe ser:

- simple
- clara
- guiada
- amigable

El onboarding debe incluir:
- QR
- instrucciones
- mensajes claros
- beneficios visibles

---

# Templates Iniciales para Gremios

Crear templates listos para usar.

## Ejemplos

### Comunicado institucional
### Asamblea
### Alerta urgente
### Reunión
### Documento importante
### Cambio de horario
### Aviso importante

---

# Seguridad

Implementar:

- autenticación segura
- protección API
- validaciones
- sanitización
- rate limit
- separación segura multiempresa

---

# Base de Datos

Tablas sugeridas:

- users
- companies
- campaigns
- notifications
- subscriptions
- segments
- landing_pages
- logs
- roles

---

# Funciones Futuras (NO IMPLEMENTAR AHORA)

NO incluir en el MVP:

- CRM completo
- chat interno
- app nativa
- bots
- automatizaciones complejas
- email marketing
- SMS
- IA

---

# Prioridades del MVP

## CRÍTICO

Implementar primero:

- PWA
- Push notifications
- OneSignal
- Panel admin
- Programación
- Landing dinámica
- WhatsApp CTA
- Segmentos
- Multiempresa
- Branding institucional

---

# Objetivo del MVP

Tener una plataforma:

- funcional
- rápida
- profesional
- fácil de usar
- escalable
- lista para clientes reales

El objetivo NO es construir un sistema enorme.

El objetivo es:

## Resolver comunicación institucional de manera simple y efectiva.

