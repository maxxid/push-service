# WIREFRAMES VISUALES AVANZADOS + PROMPT DEEPSEEK
## Push Service - Rediseño UX/UI

---

## PARTE 1: WIREFRAMES AVANZADOS CON INTERACCIONES

### 1.1 Sidebar: Estados y Transiciones

```
ESTADO 1: Collapsed (56px)
┌────────────────┐
│  LOGO (32x32)  │  ← Icon centered
├────────────────┤
│       ⊕        │  ← Nueva Campaña (CTA)
│                │     Tooltip: "Nueva Campaña"
│       🏠       │  ← Home
│                │
│       📋       │  ← Biblioteca
│                │
│       🎯       │  ← Segmentos
│                │
│       ⚙️        │  ← Config
│                │
├────────────────┤
│       👤       │  ← User (Avatar)
│       🚪       │  ← Logout
│                │
└────────────────┘

TRANSICIÓN: Hover → Expand
(250ms ease-in-out)

┌────────────────────────────┐
│ PUSH        [✕]            │  ← Collapsible toggle
├────────────────────────────┤
│ ✚ Nueva Campaña            │  ← Color: accent-primary
│   Crea tu próximo aviso    │  ← Subtext (aparece en hover)
├────────────────────────────┤
│ 🏠 Dashboard               │
│ 📋 Mi Biblioteca           │  ← With icon + name
│ 🎯 Segmentos               │
│ ⚙️ Configuración           │
├────────────────────────────┤
│ 👤 Juán Pérez              │  ← User profile
│    Admin                   │
│ 🚪 Salir                   │
└────────────────────────────┘

WIDTH: 240px
POSITION: Fixed left
SHADOW: --shadow-lg
ZINDEX: --z-fixed


MOBILE:
┌──────┐
│ ☰    │  ← Burger menu in top-nav
└──────┘

Taps → Drawer overlay
Drawer de full-screen
Swipe-left para cerrar
```

---

### 1.2 CampaignWizard: Flujo Completo Visualizado

```
┌────────────────────────────────────────────────────────────────┐
│                         CREAR CAMPAÑA                          │
│                                                                │
│ INDICADOR DE PROGRESO                                          │
│ [●──────────────────────────────────────────────────] 1/5      │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  LEFT COLUMN (55%):           RIGHT COLUMN (45%):              │
│                                                                │
│  PASO 1: MENSAJE               PREVIEW EN VIVO                 │
│  ─────────────────────         ───────────────────             │
│                                                                │
│  Título de la Campaña*         ┌──────────────────────┐        │
│  ┌──────────────────────────┐  │  📱 MOCKUP iPhone    │        │
│  │ Asamblea General 15 Marzo│  ├──────────────────────┤        │
│  │                          │  │ PUSH NOTIFICATION    │        │
│  └──────────────────────────┘  ├──────────────────────┤        │
│                                │ Asamblea General 15  │        │
│  Mensaje Push (160 caracteres) │ de Marzo             │        │
│  ┌──────────────────────────┐  │                      │        │
│  │ Asamblea General del 15  │  │ Salón Institucional  │        │
│  │ de marzo a las 14hs en el│  │ Viernes 15 de marzo  │        │
│  │ salón...                 │  │ 14:00 hs             │        │
│  └──────────────────────────┘  │                      │        │
│  [▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░] 98/160│ [Leer más]       │        │
│  ⚠️ Mensaje sugerido: 60 chars  │                      │        │
│                                │ ┌──────────────────┐ │        │
│  Imagen (Opcional)             │ │ [Botón Acción]   │ │        │
│  ┌──────────────────────────┐  │ └──────────────────┘ │        │
│  │  [📸 Subir Imagen]       │  │                      │        │
│  │  o                       │  └──────────────────────┘        │
│  │  Arrastra imagen aquí    │                                  │
│  └──────────────────────────┘  Orientación:                    │
│  [✓ Imagen aceptada: 240KB]    [📱 Portrait] [📱 Landscape]    │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│  [← Atrás]  [PASO 1/5: Mensaje]  [Siguiente →]                │
│                                                                │
└────────────────────────────────────────────────────────────────┘

PASO 2: TIPO DE ACCIÓN
───────────────────

┌──────────────────────────────────────────────────────────────┐
│                PASO 2/5: ¿A DÓNDE VA ESTO?                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Selecciona acción (radio buttons):                          │
│                                                              │
│  ○ Landing Interna (Crear desde aquí)                       │
│    "Micrositio dentro de la plataforma"                     │
│    [Si selecciona → abre mini-builder lado]                 │
│                                                              │
│  ○ WhatsApp                                                 │
│    URL predefinida en settings                              │
│    Preview: wa.me/123456789                                 │
│                                                              │
│  ○ Documento PDF                                             │
│    [Subir o seleccionar de biblioteca]                      │
│                                                              │
│  ○ URL Externa                                               │
│    ┌────────────────────────────┐                            │
│    │ https://ejemplo.com/evento │                            │
│    └────────────────────────────┘                            │
│                                                              │
│  ○ Google Maps                                               │
│    Dirección: [_________________]                            │
│    Preview del mapa                                          │
│                                                              │
│  ────────────────────────────────────────────────────────────  │
│  [← Atrás]  [PASO 2/5: Tipo de Acción]  [Siguiente →]        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

PASO 2B: LANDING BUILDER (Modal/Sidebar)
─────────────────────────────────────────

Si elige "Landing Interna":

┌─────────────┬────────────────────────┬────────────────┐
│ BLOQUES     │ EDITOR VISUAL           │ PREVIEW MÓVIL  │
├─────────────┼────────────────────────┼────────────────┤
│             │                        │ ┌────────────┐ │
│ ✚ Texto     │ [Texto introducción]   │ │            │ │
│ ✚ Imagen    │ Asamblea General...    │ │ Asamblea   │ │
│ ✚ Botón     │                        │ │ General    │ │
│ ✚ PDF       │ Características:       │ │            │ │
│ ✚ Video     │ • Profesionales        │ │ • Prof...  │ │
│ ✚ Formulario│ • Interactivos         │ │ • Inter...  │ │
│             │                        │ │            │ │
│ [Descartar] │ ┌────────────────────┐ │ │ [Leer]    │ │
│ [Guardar]   │ │ Botón primario      │ │ │            │ │
│             │ └────────────────────┘ │ │ ┌────────┐ │ │
│             │ Acción: Abre WhatsApp │ │ │Botón   │ │ │
│             │                        │ │ └────────┘ │ │
│             │ Drag to reorder ↕     │ │            │ │
│             │                        │ └────────────┘ │
└─────────────┴────────────────────────┴────────────────┘

PASO 3: DESTINATARIOS
──────────────────

┌──────────────────────────────────────────────────────────────┐
│               PASO 3/5: ¿A QUIÉN ENVIAR?                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Selector de Segmento:                                       │
│                                                              │
│  PREDETERMINADOS:                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ○ Todos                                              │   │
│  │   ⚡ 5,234 usuarios activos                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ○ Productores                                        │   │
│  │   ⚡ 1,200 usuarios                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ○ Afiliados Regulares                               │   │
│  │   ⚡ 3,000 usuarios                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ○ Directivos                                         │   │
│  │   ⚡ 34 usuarios                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  PERSONALIZADOS:                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ○ Zona Centro                    [⚡ 800]            │   │
│  │ ○ Zona Norte                     [⚡ 450]            │   │
│  │ ○ Morosos Vencidos               [⚡ 122]            │   │
│  │ ○ Sin Notificaciones Activas      [⚡ 89]             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [⚙️ Gestionar Segmentos]                                   │
│                                                              │
│  ────────────────────────────────────────────────────────────  │
│  [← Atrás]  [PASO 3/5: Destinatarios]  [Siguiente →]        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

PASO 4: PROGRAMACIÓN
────────────────────

┌──────────────────────────────────────────────────────────────┐
│              PASO 4/5: ¿CUÁNDO ENVIAR?                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Opciones:                                                   │
│                                                              │
│  ⦿ Enviar ahora                                              │
│    Se enviará inmediatamente a 5,234 usuarios               │
│                                                              │
│  ○ Programar                                                 │
│                                                              │
│    Fecha:                                                    │
│    [Calendario selector]                                     │
│                                                              │
│    Hora:                                                     │
│    [──────────────────] 14:30                               │
│                                                              │
│    Zona horaria:                                             │
│    [America/Argentina/Buenos Aires ▼]                       │
│                                                              │
│    ✓ Se enviará el 28 de marzo a las 14:30 (en 3 días)     │
│                                                              │
│  ────────────────────────────────────────────────────────────  │
│  [← Atrás]  [PASO 4/5: Programación]  [Siguiente →]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘

PASO 5: REVISAR Y ENVIAR
─────────────────────────

┌──────────────────────────────────────────────────────────────┐
│          PASO 5/5: REVISAR ANTES DE ENVIAR                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  RESUMEN:                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Título: Asamblea General 15 de Marzo                │   │
│  │ Mensaje: Asamblea General del 15 de marzo...        │   │
│  │ Imagen: asamblea.jpg (240KB) ✓                      │   │
│  │ Acción: Landing Interna (ver)                       │   │
│  │ Destinatarios: Todos (5,234 usuarios)               │   │
│  │ Envío: 28 de marzo 14:30 hs                         │   │
│  │ Zona Horaria: America/Argentina/Buenos Aires        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  PREVIEW FINAL:                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              📱 CÓMO VERÁN TUS USUARIOS              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  ╔════════════════════════════════╗                 │   │
│  │  ║ PUSH NOTIFICATION              ║                 │   │
│  │  ╠════════════════════════════════╣                 │   │
│  │  ║ Asamblea General 15 de Marzo   ║                 │   │
│  │  ║ Asamblea General del 15 de ... ║                 │   │
│  │  ║ [Leer]                         ║                 │   │
│  │  ╚════════════════════════════════╝                 │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [¿Editar algo?] [Ver Campaña Previa]                      │
│                                                              │
│  ────────────────────────────────────────────────────────────  │
│  [← Atrás]  [Cancelar]  [ENVIAR CAMPAÑA]                    │
│             Color: gray    Color: accent-primary (primary)   │
│                                                              │
│  Después de enviar:                                          │
│  ✓ Toast: "Campaña enviada a 5,234 usuarios"               │
│  → Redirect a: /campaigns/:id/stats                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 1.3 Dashboard Rediseñado: Full Layout

```
┌────────────────────────────────────────────────────────────────┐
│ PUSH  [☰]                                [🔔] [👤] [⚙️] [🚪]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Dashboard › Comunicación Institucional                         │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │  ¡HOLA, JUAN! 👋                                           ││
│ │                                                            ││
│ │  Aquí está el estado de tu comunicación institucional      ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ [✚ NUEVA CAMPAÑA] ← Button CTA grande, color accent      ││
│ │                                                            ││
│ │ Comienza a comunicar con tu institución                   ││
│ │ "Crea avisos, comunicados, alertas y más en minutos"      ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ESTADO RÁPIDO (3 CARDS)                                        │
│ ┌──────────────────┬──────────────────┬──────────────────┐   │
│ │ 📤 ENVIADAS      │ ⏱ PRÓXIMAS       │ 📝 BORRADORES    │   │
│ │ Esta semana      │ Programadas      │ Incompletas      │   │
│ │                  │                  │                  │   │
│ │ 12 campañas      │ 3 campañas       │ 2 campañas       │   │
│ │ 8,500 clics      │                  │                  │   │
│ │ CTR: 32%         │ Próxima:         │                  │   │
│ │                  │ 28 mar 10:00 AM  │                  │   │
│ │ [Más info] →     │ [Más info] →     │ [Más info] →     │   │
│ │                  │                  │                  │   │
│ └──────────────────┴──────────────────┴──────────────────┘   │
│                                                                │
│ ÚLTIMA CAMPAÑA ENVIADA                                        │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ Asamblea General 15 de Marzo                               ││
│ │ Enviada: 24 marzo 10:30 AM                                 ││
│ │                                                            ││
│ │ ┌────────────────────────────────────────────────────┐    ││
│ │ │ Usuarios destino: 5,234 │ Clics: 1,779 │ CTR: 34% │    ││
│ │ └────────────────────────────────────────────────────┘    ││
│ │                                                            ││
│ │ [📊 Ver Detalle] [↺ Duplicar] [✎ Editar]                 ││
│ │                                                            ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ TENDENCIA ESTE MES (Gráfico de barras compacto)               │
│ ┌────────────────────────────────────────────────────────────┐│
│ │                                                            ││
│ │      |           |                                        ││
│ │      |      |   |                                         ││
│ │  |   ||    ||  |||                                        ││
│ │ _||__|||___|||_||_||___________                           ││
│ │  Mar  Abr  May  Jun                                        ││
│ │                                                            ││
│ │ Semana 1: 2,100 clics | Semana 2: 3,450 | Semana 3: 2,950 ││
│ │                                                            ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ATAJOS RÁPIDOS (Bottom section)                               │
│ ┌─────────────────┬──────────────────┬──────────────────┐   │
│ │ ✚ Nueva Campaña │ ✚ Nuevo Segmento │ 📖 Ver Templates │   │
│ │                 │                  │                  │   │
│ │ Crear rápido    │ Segmentar públic │ Usar plantillas  │   │
│ └─────────────────┴──────────────────┴──────────────────┘   │
│                                                                │
│ ACTIVIDAD RECIENTE                                             │
│ ├─ "Avisos Urgentes" → 2,100 clics (hoy, 15:40)             │
│ ├─ "Reunión Directiva" → 1,900 clics (ayer)                 │
│ ├─ "Comunicado Importante" → 1,055 clics (hace 3 días)       │
│ └─ "Evento Institucional" → 890 clics (hace 1 semana)        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 1.4 Mi Biblioteca: Campaign Library

```
┌────────────────────────────────────────────────────────────────┐
│ PUSH  [☰]                                [🔔] [👤] [⚙️] [🚪]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Dashboard › Mi Biblioteca                                      │
│                                                                │
│ [Filtro: TODAS ▼] [Búsqueda de campañas...]  [+ Nueva]       │
│                                                                │
│ FILTROS ACTIVOS: Mostrar todas                                 │
│ ○ Todas  ○ Enviadas  ○ Borradores  ○ Templates              │
│                                                                │
│ ─────────────────────────────────────────────────────────────│
│                                                                │
│ ENVIADAS (12 campañas)                                         │
│                                                                │
│ ┌───────────────────────────────────┬───────────────────────┐│
│ │ 📤 ASAMBLEA GENERAL 15 MARZO       │ 📤 AVISO URGENTE      ││
│ │                                   │                       ││
│ │ Enviada: 24 mar 10:30 AM          │ Enviada: 23 mar 4:45pm││
│ │ Destinatarios: 5,234              │ Destinatarios: 4,100  ││
│ │                                   │                       ││
│ │ ┌─────────────────────────────┐   │ ┌───────────────────┐ ││
│ │ │ 1,779 clics | CTR 34% | ... │   │ │ 1,148 clics | 28% │ ││
│ │ └─────────────────────────────┘   │ └───────────────────┘ ││
│ │                                   │                       ││
│ │ [≡] ↺ Duplicar   ✎ Editar         │ [≡] ↺ Duplicar   ✎    ││
│ │     📊 Ver Stats  🔄 Clonar        │     📊 Ver Stats  🔄   ││
│ │                                   │                       ││
│ └───────────────────────────────────┴───────────────────────┘│
│                                                                │
│ ┌───────────────────────────────────┬───────────────────────┐│
│ │ 📤 COMUNICADO IMPORTANTE           │ 📤 EVENTO INSTITUC.   ││
│ │                                   │                       ││
│ │ Enviada: 20 mar 02:00 PM          │ Enviada: 18 mar 10:00 ││
│ │ Destinatarios: 5,234              │ Destinatarios: 4,500  ││
│ │                                   │                       ││
│ │ [≡] ↺ Duplicar   ✎ Editar         │ [≡] ↺ Duplicar   ✎    ││
│ └───────────────────────────────────┴───────────────────────┘│
│                                                                │
│ [Mostrar más campañas (8 restantes)]                          │
│                                                                │
│ ─────────────────────────────────────────────────────────────│
│                                                                │
│ BORRADORES (2 incompletas)                                     │
│                                                                │
│ ┌───────────────────────────────────┬───────────────────────┐│
│ │ 📝 COMUNICADO ESPECIAL            │ 📝 FORMULARIO INSCR.   ││
│ │                                   │                       ││
│ │ Editado: hace 2 horas             │ Editado: hace 1 día   ││
│ │ Destinatarios: 3,500 (asignados)  │ Destinatarios: 4,000  ││
│ │                                   │                       ││
│ │ Progreso: PASO 3/5 (Falta)        │ Progreso: PASO 2/5    ││
│ │                                   │                       ││
│ │ [✎ Continuar Editando] [✕ Elim]  │ [✎ Continuar] [✕]     ││
│ │                                   │                       ││
│ └───────────────────────────────────┴───────────────────────┘│
│                                                                │
│ ─────────────────────────────────────────────────────────────│
│                                                                │
│ PLANTILLAS DISPONIBLES                                         │
│                                                                │
│ [+ Asamblea Institucional] [+ Alerta Urgente] [+ Comunicado]  │
│ [+ Evento/Reunión] [+ Cambio de Horario] [+ Documento Imp.]  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 1.5 Segmento Selector: Integrado en Workflow

```
(Durante PASO 3 del wizard)

┌──────────────────────────────────────────────────────────────┐
│ PASO 3/5: ¿A QUIÉN ENVIAR?                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Escoge quién recibirá tu campaña:                            │
│                                                              │
│ SEGMENTOS PREDETERMINADOS:                                   │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ⦿ Todos                                                  ││
│ │   ⚡ 5,234 usuarios activos                              ││
│ │   (100% con notificaciones activas)                      ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ○ Productores                                            ││
│ │   ⚡ 1,200 usuarios                                      ││
│ │   (1,050 activos + 150 inactivos)                        ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ○ Afiliados Regulares                                    ││
│ │   ⚡ 3,000 usuarios                                      ││
│ │   (2,850 activos + 150 sin notificaciones)               ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ○ Directivos Ejecutivos                                  ││
│ │   ⚡ 34 usuarios (todos activos)                          ││
│ │   (Grupo VIP para comunicados urgentes)                  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ○ [+ Crear Nuevo Segmento]                               ││
│ │   Define un segmento personalizado ahora                 ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ SEGMENTOS PERSONALIZADOS:                                    │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ○ Zona Centro (Salta Capital)          ⚡ 800 usuarios   ││
│ │ ○ Zona Norte (Localidades Fronterizas) ⚡ 450 usuarios   ││
│ │ ○ Zona Sur (Valle de Lerma)            ⚡ 350 usuarios   ││
│ │ ○ Morosos Vencidos (> 90 días)         ⚡ 122 usuarios   ││
│ │ ○ Sin Notificaciones Activas (Inactiv) ⚡ 89 usuarios    ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ [Gestionar Segmentos] → Abre /segments en nueva pestaña      │
│                                                              │
│ INFORMACIÓN DETALLADA (si selecciona uno):                   │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ ZONA CENTRO (Seleccionado)                               ││
│ │                                                          ││
│ │ Usuarios: 800 total                                      ││
│ │ • Activos con notificaciones: 780                        ││
│ │ • Inactivos: 20                                          ││
│ │ • Sin notificaciones: 0                                  ││
│ │                                                          ││
│ │ Tasa de apertura histórica: 36%                          ││
│ │ CTR promedio: 32%                                        ││
│ │                                                          ││
│ │ Este segmento recibirá de: 780 usuarios (97.5%)          ││
│ │ ⚠️ 20 usuarios inactivos serán ignorados                  ││
│ │                                                          ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## PARTE 2: PROMPT OPTIMIZADO PARA DEEPSEEK

---

### MEGA-PROMPT: Sistema Completo para DeepSeek

```markdown
# SISTEMA DE DESARROLLO: Push Service UX Rediseño
## Prompts Modulares para DeepSeek

---

## 🎯 CONTEXTO GLOBAL

**PROYECTO:** Push Service - SaaS Comunicación Institucional
**STACK:** Next.js 14+ (App Router), React, TailwindCSS, Shadcn/ui, Prisma, PostgreSQL
**USUARIOS:** Gremios, cámaras, pequeñas organizaciones (no técnicos)
**FILOSOFÍA:** Dark mode premium + UX moderna (Stripe/Linear/Vercel style) + Densidad funcional

---

## 📐 PALETA VISUAL (Obligatoria)

### Colores
```css
--bg-primary: #0F172A      /* Fondo principal */
--bg-secondary: #1E293B    /* Cards, backgrounds secundarios */
--bg-tertiary: #334155     /* Hover, elevated states */
--text-primary: #F1F5F9    /* Texto principal */
--text-secondary: #CBD5E1  /* Texto secundario */
--text-tertiary: #94A3B8   /* Hints, disabled */
--accent-primary: #3B82F6  /* Azul primario (CTAs) */
--accent-secondary: #10B981/* Verde (success) */
--accent-danger: #EF4444   /* Rojo (error, delete) */
--accent-warning: #F59E0B  /* Ámbar (warning) */
--border: #334155          /* Borders */
--border-light: #475569    /* Borders light */
```

### Spacing (8px Grid)
```
xs: 4px  | sm: 8px  | md: 12px | lg: 16px | xl: 20px
2xl: 24px | 3xl: 32px | 4xl: 48px | 5xl: 64px
```

### Bordes y Radios
```
Radius: 4px (inputs), 8px (cards), 12px (modals), 9999px (pills)
Borders: 1px solid var(--border)
Shadow: 
  - sm: 0 1px 2px rgba(15,23,42,0.3)
  - md: 0 4px 12px rgba(15,23,42,0.4)
  - lg: 0 20px 25px rgba(15,23,42,0.5)
```

### Tipografía
```
Font-family: Inter (sans-serif)
Sizes: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl), 24px (2xl), 32px (3xl)
Weight: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
Line-height: 1.5 (body), 1.2 (headings)
Letter-spacing: -0.5px (headings)
```

---

## 🎬 PROMPTS POR COMPONENTE

### PROMPT 1: Sidebar Rediseñado
```markdown
Necesito un Sidebar colapsable para un SaaS dark-mode premium.

## Requerimientos

1. **Estados:**
   - Collapsed (56px): Solo icons, nombres en tooltip
   - Expanded (240px): Icons + nombres visibles
   - Transición suave (250ms ease-in-out)

2. **Contenido:**
   ```
   TOP:
   - Logo compacto (32x32) en el centro
   - Botón CTA "Nueva Campaña" (color accent-primary)
   
   MIDDLE:
   - Ítems de navegación con icons
     - 🏠 Dashboard
     - 📋 Mi Biblioteca
     - 🎯 Segmentos
     - ⚙️ Configuración
   
   BOTTOM:
   - Avatar usuario + nombre (collapsed: solo avatar)
   - Botón logout
   ```

3. **Styling:**
   - Background: var(--bg-primary)
   - Active item: Ring con accent-primary
   - Hover: bg-tertiary
   - Shadows: var(--shadow-lg)
   - Z-index: 300 (fixed)

4. **Mobile:**
   - En pantallas < 768px: Convertir a drawer overlay
   - Hamburger menu en top-nav
   - Swipe-left para cerrar
   - Full screen (con backdrop blur)

5. **Interactividad:**
   - Click en item nav → update active state
   - Click en CTA "Nueva Campaña" → navegar a /campaigns/create
   - Hover tooltip con nombre en estado collapsed
   - Keyboard: F11 para toggle collapse (opcional)

## Estructura de Props
```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeItem?: string;
  onNavigate?: (path: string) => void;
  user?: { name: string; role: string };
  onLogout?: () => void;
}
```

## Componentes a Usar
- Radix UI Dialog (drawer en mobile)
- Radix UI NavigationMenu (items)
- Icons de lucide-react
- TailwindCSS (sin componentes Shadcn, CSS puro)

## Output
Componente React functional con TypeScript + archivo CSS variables aplicadas + stories de Storybook (opcional).
```

---

### PROMPT 2: Dashboard Home Rediseñado
```markdown
Rediseña el dashboard de una plataforma SaaS. NO debe mostrar KPIs genéricos vacíos.

## Secciones (en orden)

### 1. Greeting + CTA Principal
```
¡HOLA, [NOMBRE]! 👋
"Aquí está el estado de tu comunicación institucional"
[✚ NUEVA CAMPAÑA] ← Button gigante, color accent-primary
```

### 2. Status Cards (3 cards)
Mostrar:
- Campañas enviadas esta semana (número grande, CTR promedio)
- Próximas campañas programadas (lista de las 3 siguientes)
- Borradores incompletos (número + CTA "Continuar")

Cards deben ser clickeables (→ a secciones correspondientes)

### 3. Última Campaña Enviada
Card destacada mostrando:
- Título de campaña
- Fecha/hora de envío
- KPIs: usuarios destino | clics | CTR
- 3 botones: [Ver Detalle] [Duplicar] [Editar]

Si NO hay campañas enviadas, mostrar empty state con CTA a crear.

### 4. Gráfico de Tendencias
Mini gráfico de barras mostrando clics por semana (este mes).
Usar recharts library si está disponible, sino canvas.

### 5. Atajos Rápidos (Bottom)
Grid de 3 botones grandes:
- Nueva Campaña
- Nuevo Segmento
- Ver Templates

### 6. Actividad Reciente
Lista de últimas 4 campañas con timestamp y clics.
Formato: "Título → X clics (hace 2 horas)"

## Datos de Ejemplo (usar props o context)
```typescript
interface DashboardHomeProps {
  user?: User;
  stats?: {
    sentThisWeek: number;
    ctrAverage: number;
    draftCount: number;
  };
  lastCampaign?: Campaign;
  upcomingCampaigns?: Campaign[];
  recentActivity?: Activity[];
}
```

## Styling
- Spacing: sections separadas por space-3xl
- Cards: bg-secondary, border, shadow-md
- CTA button: bg-accent-primary, hover: brightness 110%
- Empty states: illustración + texto + CTA

## Comportamiento
- Todos los elementos son clickeables (navegan o abren modales)
- Si datos están loading: skeleton screens (NO spinners)
- Si datos están error: mostrar banner con retry

## Output
Componente React + subcomponentes (StatCard, ActivityItem, etc)
```

---

### PROMPT 3: Campaign Wizard (5-Step Modal)
```markdown
Crea un wizard de 5 pasos para crear una campaña push con preview en vivo.

## Layout
```
┌─────────────────────────────────────────────────────┐
│ LEFT (60%): Inputs | RIGHT (40%): Live Preview     │
│                                                    │
│ Paso X/5 indicador visual (progress bar)          │
│ [Step indicator]                                   │
└─────────────────────────────────────────────────────┘
```

## Los 5 Pasos

### Paso 1: MENSAJE
Campos:
- Título (required)
- Mensaje push 160 chars (required)
- Imagen opcional (jpg/png)

Preview vivo muestra:
- Mock iPhone (portrait)
- Notificación push estilo iOS
- Contador de caracteres

### Paso 2: TIPO DE ACCIÓN
Radio buttons:
1. Landing Interna → si selecciona, abre mini landing builder (modal)
2. WhatsApp → URL predefinida
3. PDF → file upload
4. URL Externa → text input
5. Google Maps → address input

Cada opción tiene descripción corta.

### Paso 3: DESTINATARIOS
Selector de segmento:
- Radio buttons de segmentos predefinidos (Todos, Productores, etc)
- Lista de segmentos personalizados
- Live count: "⚡ 5,234 usuarios"
- [Botón: Gestionar Segmentos] → abre /segments en nueva tab

### Paso 4: PROGRAMACIÓN
- Radio: Enviar ahora / Programado
- Si programado:
  - Calendario visual
  - Time picker (14:30)
  - Timezone selector
  - Display: "Se enviará el 28 de marzo a las 14:30 (en 3 días)"

### Paso 5: REVISAR & ENVIAR
- Summary de todos los datos
- Preview final de la notificación
- Botones: [Atrás] [Cancelar] [ENVIAR CAMPAÑA]
- ENVIAR es color accent-primary, grande

## Comportamiento

- Progress bar bajo "PASO X/5"
- Validaciones en tiempo real (subrayado rojo si falta)
- Si hay error, mostrar banner rojo
- Al enviarse → Toast success + redirect a /campaigns/:id/stats
- Si usuario cancel → confirmar modal (¿descartar borrador?)

## Preview Panel (lado derecho)
- Muestra mock iPhone actual
- Se actualiza en tiempo real conforme edita
- Botón para rotar portrait/landscape
- Si paso 2 = "Landing", muestra preview de landing
- Si paso 2 = "WhatsApp", muestra enlace wa.me

## Props
```typescript
interface CampaignWizardProps {
  onSubmit: (campaign: Partial<Campaign>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Campaign>;
  isLoading?: boolean;
}
```

## Componentes Internos Necesarios
- StepIndicator (progress visual)
- PreviewPanel (mock device)
- FormFields (inputs + validations)
- SegmentSelector (paso 3)
- CalendarPicker (paso 4)

## Output
Modal component completo + subcomponentes + hooks custom (useWizard, usePreview)
```

---

### PROMPT 4: Campaign Library (Mi Biblioteca)
```markdown
Crea una página de "Mi Biblioteca" que muestre todas las campañas.

## Estructura

### Top Bar
- Título: "Mi Biblioteca"
- Searchbox: "Buscar campañas..."
- Filtros en tabs: [Todas] [Enviadas] [Borradores] [Templates]
- Botón: [+ Nueva Campaña]

### Contenido por Sección

#### ENVIADAS
Grid de cards (2 cols en desktop, 1 en mobile):
Cada card muestra:
- Ícono 📤
- Título campaña
- Fecha/hora envío
- Destinatarios: "5,234 usuarios"
- Stats: "1,779 clics | CTR 34%"
- Botones contextuales: [↺ Duplicar] [✎ Editar] [📊 Ver]

#### BORRADORES
Cards iguales pero:
- Ícono 📝
- Muestra progreso: "PASO 3/5 (Incompleta)"
- Botón principal: [✎ Continuar Editando]
- Botón secundario: [✕ Eliminar]

#### PLANTILLAS
Grid de botones/cards para insertar:
- "Asamblea Institucional"
- "Alerta Urgente"
- "Comunicado Oficial"
- etc.

Click → abre wizard con template preseleccionado

## Comportamiento

- Filtros: click en tab → muestra solo esa categoría
- Search: live filter por título (case-insensitive)
- Sorting: por defecto newest first
- Cards clickeables: click → abre detalle / edit
- Loading state: skeleton cards
- Empty state: ilustración + CTA crear

## Data Structure
```typescript
interface CampaignCard {
  id: string;
  title: string;
  status: 'draft' | 'sent' | 'scheduled';
  createdAt: Date;
  sentAt?: Date;
  recipientCount: number;
  clicks: number;
  ctr: number;
}
```

## Output
Página completa en `/campaigns` + CampaignCard subcomponente + filtro logic
```

---

### PROMPT 5: Landing Builder (Integrado)
```markdown
Crea un constructor visual de landing pages para usarse DENTRO del campaign wizard.

## Estructura (Modal/Sidebar)

```
┌───────────┬────────────────────┬──────────────┐
│ Bloques   │ Editor Visual      │ Preview      │
│ (Palette) │ (Drag to reorder)  │ (Live)       │
├───────────┼────────────────────┼──────────────┤
│ ✚ Texto   │ [Texto intro...]   │ ┌──────────┐│
│ ✚ Imagen  │ [Botón]            │ │ iPhone   ││
│ ✚ Botón   │ [Formulario...]    │ │ Mock     ││
│ ✚ PDF     │                    │ │          ││
│ ✚ Video   │                    │ │ Content  ││
│ ✚ Form    │                    │ │ previews ││
│           │                    │ │          ││
│ [Guardar] │                    │ └──────────┘│
│ [Descar.] │                    │             │
└───────────┴────────────────────┴──────────────┘
```

## Bloques Disponibles

1. **Texto:** 
   - Input WYSIWYG con formato básico
   - Preview en vivo

2. **Imagen:**
   - Upload o seleccionar de biblioteca
   - Resize en builder

3. **Botón:**
   - Text
   - Color (accent, secondary)
   - Link (URL / WhatsApp / internal landing)

4. **PDF:**
   - Upload de PDF
   - Previsualizando nombre

5. **Video:**
   - URL de YouTube/Vimeo
   - Embed preview

6. **Formulario:**
   - Campos: email, text, selects
   - CTA button

7. **Separador:**
   - Just visual divider

## Interactividad

- Drag & drop para reordenar bloques
- Click en bloque → editar propiedades lado derecho
- Preview en vivo se actualiza
- Delete ícono por bloque
- Save → guarda landing en BD
- Estado validado: ¿tiene al menos 1 bloque?

## Data Shape
```typescript
interface LandingBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'pdf' | 'video' | 'form' | 'divider';
  order: number;
  content: {
    // varía según type
    text?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    // etc
  };
}
```

## Output
Landing Builder modal component + block components + hooks para drag-drop
```

---

### PROMPT 6: Segment Selector (Contextual)
```markdown
Crea un selector de segmentos para el paso 3 del wizard.

## Estructura

Mostrar segmentos en radio buttons:
- Grupo "PREDETERMINADOS": Todos, Productores, Afiliados, Directivos
- Grupo "PERSONALIZADOS": Zona Centro, Zona Norte, Morosos, etc

Cada opción muestra:
- Radio button
- Nombre segmento
- ⚡ Contador de usuarios activos
- Opcionalmente: breakdown en hover

## Interactividad

- Select radio → actualiza preview a la derecha del wizard
- Hover en segmento → muestra popover con:
  - Total usuarios
  - Activos vs inactivos
  - Sin notificaciones
  - Tasa apertura histórica
  
- Botón: [⚙️ Gestionar Segmentos] → abre /segments en nueva tab

## Validación

- Siempre debe haber uno seleccionado
- Display: "Enviarás a X usuarios"
- Si hay usuarios sin notificaciones: ⚠️ Warning

## Output
SegmentSelector component + hook useSegmentInfo
```

---

## 📋 CHECKLIST: Componentes en Orden de Desarrollo

### Semana 1: Foundation
- [ ] **Prompt 1:** Sidebar.tsx (56px/240px collapsible)
- [ ] **Prompt 2:** DashboardHome.tsx (new dashboard design)
- [ ] CSS Variables global file + TailwindCSS config update
- [ ] Common components: StepIndicator, StatCard, ActivityItem

### Semana 2: Campaign Creation
- [ ] **Prompt 3:** CampaignWizard.tsx (5-step modal)
- [ ] **Prompt 4:** CampaignLibrary.tsx (Mi Biblioteca)
- [ ] **Prompt 5:** LandingBuilder.tsx (integrado al wizard)
- [ ] **Prompt 6:** SegmentSelector.tsx (paso 3)
- [ ] PreviewPanel.tsx (lado derecho del wizard)

### Semana 3: Polish & Mobile
- [ ] Mobile responsive ajustes (bottom nav, drawer sidebar)
- [ ] Animations & transitions
- [ ] Loading states (skeletons)
- [ ] Error boundaries
- [ ] Toast notifications

### Semana 4: Integration & Testing
- [ ] Integrar wizards al backend existente
- [ ] Update API routes si es necesario
- [ ] Database schema updates (si falta)
- [ ] Testing (unit + integration)

---

## 🎨 TOKENS FINALES

Pegar en archivo global (CSS o dentro de Tailwind):
```css
:root {
  /* COLORS */
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --accent-primary: #3B82F6;
  --accent-secondary: #10B981;
  --accent-danger: #EF4444;
  
  /* SPACING */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;
  
  /* RADII */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* SHADOWS */
  --shadow-sm: 0 1px 2px rgba(15,23,42,0.3);
  --shadow-md: 0 4px 12px rgba(15,23,42,0.4);
  --shadow-lg: 0 20px 25px rgba(15,23,42,0.5);
  
  /* TRANSITIONS */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 🚀 CÓMO USAR ESTOS PROMPTS

1. **Para cada componente:** Copia el PROMPT correspondiente
2. **Pasa a DeepSeek:** "Desarrolla este componente según estas especificaciones..."
3. **Entrega esperada:** Archivo .tsx completo + tipado + funcional
4. **Integración:** Copia a `src/components/` en tu proyecto Next.js

---

## 📞 EJEMPLOS DE INPUTS PARA DEEPSEEK

### Input 1 (Sidebar):
"Necesito un Sidebar colapsable para un SaaS dark-mode premium [copiar PROMPT 1]. Stack: Next.js 14, React, TailwindCSS, lucide-react. Quiero que sea completamente funcional con estados de hover y transiciones suaves. Usa los colores y spacing especificados. Output: archivo .tsx listo para importar."

### Input 2 (Dashboard):
"Rediseña el dashboard de una SaaS de comunicación institucional [copiar PROMPT 2]. Debe tener las 6 secciones listadas. Usa componentes funcionales React con TypeScript. Datos vienen como props. Output: DashboardHome.tsx + subcomponentes."

### Input 3 (Wizard):
"Implementa un campaign wizard de 5 pasos según estas specs [copiar PROMPT 3]. Key features: multi-step con validación, live preview en lado derecho mostrando mock iPhone, transiciones suaves. Si en paso 2 elige "Landing Interna", abre un mini-builder. Output: CampaignWizard.tsx + subcomponentes + hooks."

---

## ⚡ TIPS FINALES

- **Colores:** NUNCA hardcodear colores. Siempre usar CSS vars
- **Spacing:** Grid de 8px, NO números random
- **Naming:** Usa nombres descriptivos (CampaignWizardStep1, no Step1)
- **Props:** Siempre tipadas con TypeScript interfaces
- **A11y:** Incluir ARIA labels, keyboard navigation si aplica
- **Mobile:** Testing en móvil es CRÍTICO
- **Performance:** Lazy load de componentes donde sea posible
```

---

## PARTE 3: ARQUITECTURA DE CARPETAS PROPUESTA

```
src/
├── components/
│   ├── common/
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── StatCard.tsx
│   │   ├── ActivityItem.tsx
│   │   └── BreadcrumbNav.tsx
│   │
│   ├── campaigns/
│   │   ├── CampaignWizard.tsx (main 5-step)
│   │   ├── CampaignWizardStep1.tsx (message)
│   │   ├── CampaignWizardStep2.tsx (action type)
│   │   ├── CampaignWizardStep3.tsx (recipients)
│   │   ├── CampaignWizardStep4.tsx (schedule)
│   │   ├── CampaignWizardStep5.tsx (review)
│   │   ├── CampaignCard.tsx
│   │   └── CampaignStats.tsx
│   │
│   ├── library/
│   │   ├── CampaignLibrary.tsx
│   │   ├── LibraryFilter.tsx
│   │   └── TemplateSelector.tsx
│   │
│   ├── landing/
│   │   ├── LandingBuilder.tsx
│   │   ├── LandingBlockPalette.tsx
│   │   ├── LandingBlockEditor.tsx
│   │   ├── blocks/
│   │   │   ├── TextBlock.tsx
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── ButtonBlock.tsx
│   │   │   ├── PDFBlock.tsx
│   │   │   ├── VideoBlock.tsx
│   │   │   └── FormBlock.tsx
│   │   └── LandingPreview.tsx
│   │
│   └── segments/
│       ├── SegmentSelector.tsx
│       ├── SegmentList.tsx
│       └── SegmentModal.tsx
│
├── pages/
│   ├── dashboard.tsx
│   ├── campaigns/
│   │   ├── index.tsx (library)
│   │   ├── create.tsx (wizard)
│   │   └── [id]/
│   │       ├── edit.tsx
│   │       └── stats.tsx
│   ├── segments/
│   │   ├── index.tsx
│   │   └── [id]/edit.tsx
│   └── settings/
│       ├── general.tsx
│       ├── branding.tsx
│       └── team.tsx
│
├── hooks/
│   ├── useCampaignWizard.ts
│   ├── useLandingBuilder.ts
│   ├── useSegmentInfo.ts
│   └── usePreview.ts
│
├── store/ (Zustand)
│   ├── campaignStore.ts
│   ├── wizardStore.ts
│   └── previewStore.ts
│
└── styles/
    ├── globals.css
    ├── variables.css
    └── animations.css
```

---

**DOCUMENTO COMPLETO Y LISTO PARA IMPLEMENTACIÓN**
**Versión: 2.0 - Mayo 2026**
