# Changelog

Todos los cambios y mejoras realizados en el proyecto **Conversor de Formatos** se documentan aquí.

---

## [1.0.0] - 2025-08-19
### Inicial
- Versión estable inicial: conversión entre CSV, JSON, XML
- Modo oscuro activado por defecto y cambio dinámico.
- Visualización previa inteligente: tabla, árbol JSON, XML.
- Detección automática de formato del contenido.
- Drag & drop para archivos y soporte de área de texto.
- Descargas funcionales en todos los formatos soportados.
- Totalmente responsive con Bootstrap 5.

---

## [1.1.0] - 2025-08-19
### Nuevas funcionalidades
- **Conversor a SQL:**  
  - Botón “A SQL” con modal Bootstrap configurable (nombre de tabla, opciones DROP/CREATE).
  - Generador de scripts SQL INSERT multifila con escape seguro y tipos básicos.
  - Vista previa del script antes de descargar el archivo `.sql`.

---

## [1.1.1] - 2025-08-19
### Correcciones y mejoras
- **Corrección exportación Excel:**  
  - Agregado (SheetJS) para posibles descargas en excel, por ahora anulado.
  - Se implementa manejo de errores con try-catch.
- **Corrección exportación SQL:**  
  - Modal SQL estable y generación confiable de scripts.
  - Corrección de listeners y preview dinámica del SQL.
- Mensajes de error y feedback más claros.
- Mantención de toda la funcionalidad existente sin modificaciones a otras partes del sistema.

---

## [Proximamente]
- Mejoras en tipos de datos de SQL (detectar INT, DECIMAL, DATE, EMAIL).
- Exportación selectiva y filtros.
- Visualización de estadísticas sobre los datos.

---
