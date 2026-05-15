# 📖 Guía de Estilo: Minimalismo Premium (Light & Dark) - Edición Extendida

## 1. Filosofía Core (El Concepto)
Este diseño se basa en la **elegancia a través de la sustracción** y la escuela del Diseño Suizo (International Typographic Style). Se prohíbe el uso de elementos decorativos innecesarios (sombras gruesas, gradientes, cajas con colores de fondo de alto contraste, elementos 3D o neomorfismo). El **espacio negativo** (el vacío) es el elemento estructural primario, actuando como el principal separador de contenido. El objetivo es que la interfaz se sienta como una revista editorial técnica o el menú de un dispositivo o aplicación de alta gama. La asimetría controlada y el uso riguroso de una grilla geométrica son esenciales.

## 2. Paletas de Color (Ultra-Restringidas)
El diseño funciona puramente por contraste de luminosidad y escala de grises. Los colores de acento se eliminan o se usan en un 1% de la interfaz solo para estados críticos o llamadas a la acción primarias.

### 🌑 Modo Oscuro (Dark Theme)
*   **Background (Fondo Principal):** `#000000` (Negro puro) o `#050505`. Nunca grises claros.
*   **Superficies Elevadas (Modales/Desplegables):** `#111111` o `#161616`. Nunca usar "Lighter gray" que destruya el aura oscura.
*   **Texto Primario (High-Emphasis):** `#F0F0F0` o `rgba(255, 255, 255, 0.9)`. Evitar el `#FFFFFF` puro para no causar fatiga visual por resplandor.
*   **Texto Secundario (Medium-Emphasis):** `#777777` o `rgba(255, 255, 255, 0.5)`.
*   **Texto Terciario (Low-Emphasis / Disabled):** `#444444` o `rgba(255, 255, 255, 0.25)`.
*   **Bordes y Líneas (Dividers):** `#1A1A1A` o `rgba(255, 255, 255, 0.08)`.

### ☀️ Modo Claro (Light Theme)
*   **Background (Fondo Principal):** `#FFFFFF` (Blanco puro) o `#FAFAFA` (Blanco roto muy sutil). Nunca grises oscuros.
*   **Superficies Elevadas (Modales/Desplegables):** `#FFFFFF` (mismo que fondo con un sutil borde gris) o `#F5F5F5`.
*   **Texto Primario (High-Emphasis):** `#111111` o `#1A1A1A`. **Nunca usar `#000000` (Negro puro) sobre fondo blanco**, ya que causa fatiga visual extrema por exceso de contraste.
*   **Texto Secundario (Medium-Emphasis):** `#666666` o `#737373` (Gris medio oscuro).
*   **Texto Terciario (Low-Emphasis / Disabled):** `#A3A3A3` o `#BDBDBD`.
*   **Bordes y Líneas (Dividers):** `#E5E5E5` o `#EEEEEE`. Deben ser grises ultra-claros, apenas perceptibles.

## 3. Tipografía (El pilar del diseño)
Al no haber cajas ni bloques de color sólido, la tipografía dicta la jerarquía visual, la estructura y el ritmo en ambos temas.

*   **Familia Tipográfica:** Fuentes Sans-Serif geométricas, neo-grotescas y limpias (ej. *Inter*, *Roboto Mono*, *Geist*, *Helvetica Neue*, *Univers*, *Akzidenz-Grotesk*). Se recomienda combinar una fuente Sans-Serif para títulos y una fuente Mono-espaciada para datos o micro-textos.
*   **Títulos Principales (H1 / H2) / "HERRAMIENTAS", "CLIENTES", "MENÚ":**
    *   `text-transform: uppercase;` (Generalmente en mayúsculas para encabezados estructurales).
    *   `font-weight: 300` o `400` (Trazos finos, nunca negritas gruesas/Black a menos que sea un "Hero Text" gigante).
    *   `letter-spacing: 0.05em` a `0.15em` (Tracking amplio, clave para el aspecto editorial).
    *   Para Hero Text (H1 Gigante): `font-weight: 500` o `600`, `letter-spacing: -0.02em` a `-0.04em` (tracking negativo para textos enormes).
*   **Subtítulos / Overlines / Etiquetas Pequeñas:**
    *   `text-transform: uppercase;`
    *   `font-size: 10px` a `12px` (Micro-tipografía).
    *   `letter-spacing: 0.15em` a `0.25em`.
    *   Color: Siempre Texto Secundario.
*   **Cuerpo de Texto y Listas (Body):**
    *   `font-size: 14px` a `16px` (idealmente legibilidad alta).
    *   `font-weight: 300` o `400`.
    *   `line-height: 1.6` a `1.8` (Mucho espacio respirable entre líneas).
*   **Datos, Números y Metadatos:** Usar tipografía `monospace` (ej. Roboto Mono).

## 4. Estructura y Layout (Anti-Tarjetas y Grillas)
La regla de oro para ambos temas: **Prohibido usar "Cards" (tarjetas) tradicionales con fondos grises/oscuros, o con sombras o bordes redondeados, para agrupar contenido.**

*   **Grilla (Grid System):** Usar un sistema de columnas estricto (ej. 12 columnas). Alinear el contenido a los bordes de la grilla. Las líneas divisorias deben conectar elementos a lo largo de la grilla.
*   **Elementos Flotantes:** El contenido debe existir directamente sobre el fondo base (blanco o negro).
*   **División por Líneas (Hairlines):** Para separar secciones, filas o elementos de una lista, usar únicamente bordes de 1px. No usar fondos diferentes para delimitar áreas.
    *   *Dark:* `border-color: rgba(255,255,255,0.08)` o `#1A1A1A`
    *   *Light:* `border-color: rgba(0,0,0,0.08)` o `#E5E5E5`
*   **Márgenes y Padding (Respiración):** El espacio negativo es estructura. Multiplicar por 2 o 3 el espacio en blanco estándar. Si normalmente usarías `margin-bottom: 32px`, aquí debes usar `64px` o `120px` entre bloques principales.
*   **Alineación Asimétrica:** Fomentar el uso de alineaciones atípicas (ej. título a la extrema izquierda, contenido desplazado 4 columnas a la derecha).

## 5. Componentes de Interfaz

### 5.1 Botones y Enlaces
*   **Estilos de Botón Primario:** Sin bordes redondeados (`border-radius: 0`). Fondo de contraste máximo (Negro en Light theme, Blanco en Dark theme). Texto invertido. Padding amplio y geométrico (ej. `padding: 16px 32px`).
*   **Estilos de Botón Secundario (Ghost/Outline):** Borde de 1px del color del texto secundario, fondo transparente, texto secundario.
*   **Enlaces Inline:** Evitar el clásico subrayado azul. Usar el color del texto primario con un `border-bottom: 1px solid` que aparece o se refuerza en el `hover`.
*   **Llamadas a la Acción (CTAs) Ocultas:** Utilizar flechas geométricas (ej. `→` o `↗`) alineadas a la derecha, en lugar de grandes botones contenedores para navegación sutil.

### 5.2 Formularios e Inputs
*   **Inputs de Texto:** Sin cajas de fondo. Solo una línea inferior (`border-bottom`) muy fina. El `placeholder` en texto terciario. Al hacer `focus`, la línea inferior se oscurece/ilumina al color primario y el outline general se anula (`outline: none`).
*   **Labels (Etiquetas):** Micro-tipografía (uppercase, letter-spacing amplio) posicionada por encima del input, o en la misma línea a la izquierda (alineación tabular).
*   **Checkboxes / Radios:** Estrictamente cuadrados (incluso los radios pueden representarse como cuadrados o cruces geométricas `[ x ]`). Cero redondeo.

### 5.3 Iconografía
*   **Estilo:** Minimalista, lineal, stroke constante de 1px a 1.5px. Geométricos y sin rellenos (outlines).
*   **Tamaño:** Pequeños y consistentes (ej. 16x16px o 24x24px).
*   **Uso:** Usar iconos solo cuando sean estrictamente funcionales, no como decoración pura. En muchas ocasiones es preferible una etiqueta en texto de micro-tipografía (ej. `[ CERRAR ]`) en vez de un ícono (`X`).

## 6. Detalles y Micro-interacciones (Motion)
Los pequeños detalles mantienen la cohesión premium en cualquier tema. Las animaciones no deben ser juguetonas o elásticas (bouncy), sino fluidas y matemáticas.

*   **Marcadores de Lista (Bullets):** No usar el `<ul>` estándar (círculos rellenos grandes). Usar un punto minúsculo atenuado (`·`), un guion (`-`), un cuadrado geométrico minúsculo (`<span class="opacity-30 text-[10px]">▪</span>`), o numeración.
*   **Numeración Indexada (Paginación/Listas):** Elementos de lista o secciones numeradas como `[01]`, `02/`, `(03)`, renderizadas en tamaño micro y tipografía mono-espaciada en color Secundario.
*   **Transiciones y Easing:** 
    *   Curvas de animación sofisticadas y rápidas (ej. `cubic-bezier(0.16, 1, 0.3, 1)` - Ease Out Expo).
    *   Duración: `300ms` a `500ms` para estados hover, `800ms` a `1200ms` para entradas de página o revelación de imágenes (Fade In + Y-offset ligero).
*   **Estados Hover (Silenciosos):** 
    *   **Prohibido** poner un fondo sólido repentino al hacer hover en un contenedor o listado.
    *   *Texto:* El texto secundario pasa a texto primario (ej. de gris a blanco/negro), con transición fluida.
    *   *Imágenes:* Ligero oscurecimiento o escala infinitesimal para dar percepción de profundidad controlada (`scale(1.02)` o `scale(0.98)`).
    *   *Listas/Filas:* Si una fila completa es clickeable, el hover puede revelar una flecha (`→`) sutil a la derecha o subrayar el título principal, sin ensuciar el contenedor.
*   **Imágenes y Contenido Visual:** 
    *   **Bordes:** Totalmente cuadrados (`border-radius: 0`). Si por razones extremas del contenido (ej. un avatar genérico) se requiere redondeo, máximo `2px`.
    *   **Sombras:** **Prohibidas terminantemente.** Sin excepciones (`box-shadow: none`).
    *   **Tratamiento de Color:** Se recomienda utilizar filtros de escala de grises o desaturación parcial (`filter: grayscale(1)`) para las imágenes de galería si no son el foco primario de atención, revelando el color completo solo en el estado hover.
