# ![](https://github.com/unix4you2/practico/raw/master/img/logo.png) Conversor de Formatos (CSV, JSON, XML, SQL)

Este es un proyecto derivado de [Práctico Framework](https://www.practico.org//) articulable como plugin o complemento

Pruébalo en línea directamente en [Este enlace](https://conversor-archivos.practico.run) cargando tus archivos o los **"archivo_prueba.xxx"** disponibles en este repo.

Aplicación web completa, responsiva y en modo oscuro por defecto, desarrollada en **JavaScript vanilla** y **Bootstrap 5**. Permite cargar o pegar datos y convertirlos entre diferentes formatos: CSV, JSON, XML, y SQL (INSERTs). La herramienta es ideal para pruebas, exploración, migraciones y compatibilidad de datos.

---

## Características Principales

- **Modo Oscuro por defecto** con switch de alternancia.
- **Carga fácil** de archivos (drag & drop) soportando `.csv`, `.json`, `.xml` y archivos de texto plano.
- **Pegado directo** de datos en área de texto.
- **Detección automática de formato** (CSV, JSON, XML).
- **Visualización previa**:
  - CSV: en tabla responsiva.
  - JSON: en árbol interactivo expandible/colapsable.
  - XML: vista estructurada.
- **Conversión y descarga** a:
  - CSV (RFC 4180)
  - JSON
  - XML
  - SQL (INSERT), configurable vía modal (nombre de tabla, opciones DROP/CREATE TABLE).
- **Descargas funcionales** y seguras para todos los navegadores modernos.
- **Totalmente client-side**: no almacena datos ni los envía a servidores.
- **Responsive y amigable para móviles**.

---

## Instalación y Uso

1. **Clona o descarga** este repositorio.
2. Abre `index.html` en tu navegador preferido.
3. ¡Listo! No necesitas instalar dependencias ni usar un servidor.

---

## Estructura

- `index.html`: Estructura de la aplicación + modal SQL + incluye Bootstrap y SheetJS.
- `style.css`: Estilos personalizados para modo oscuro, drag & drop y árbol JSON.
- `app.js`: Toda la lógica de carga, parseo, conversión, previsualización y exportación.
- `README.md`: Este archivo.

---

## Cómo exportar datos

1. Carga un archivo o pega los datos.
2. Verifica la previsualización automática (tabla, árbol, XML).
3. Elige el formato deseado pulsando el botón correspondiente.
4. Para exportar a SQL:
   - Pulsa “A SQL”.
   - Completa nombre de tabla y activa opciones de DROP/CREATE si lo deseas.
   - Descarga el archivo `.sql` generado.

---

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Opera).
- No requiere instalación ni dependencias externas (excepto Bootstrap y SheetJS vía CDN).

---
