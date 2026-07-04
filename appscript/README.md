# Lyon Wear API — Google Apps Script

Copia versionada del código que corre en script.google.com (vinculado al Google Sheet "Productos").
Este directorio es la fuente de verdad para cambios: edita aquí, luego pega en el editor de Apps Script.

## Cómo desplegar un cambio

1. Abre el proyecto en https://script.google.com (desde el Sheet: Extensiones → Apps Script).
2. Pega el contenido del archivo modificado en el archivo `.gs` correspondiente y guarda (Ctrl+S).
3. **OBLIGATORIO**: Implementar → Administrar implementaciones → ✏️ Editar → Versión: **Nueva versión** → Implementar.

> Sin el paso 3, la URL `/exec` sigue sirviendo la versión anterior aunque hayas guardado.
> La URL NO cambia al crear una nueva versión — el frontend no necesita tocarse.

## Verificar después de desplegar

```
https://script.google.com/macros/s/AKfycbxMK5rZllw2cWm1FmQJ7rEZgRzNCfnLBNk0wQ3p8DEwlgM4wxqTel0T-MruPOvOHDL2/exec?action=productos
```

Debe responder `{"success":true, "total":N, "productos":[...]}` con URLs de imagen completas.

## Contrato con el frontend (src/services/api.ts)

- Booleanos como texto: `"SI"` / `"NO"` (columnas activo, disponible, nuevo, destacado).
- `tallas` y `etiquetas`: texto separado por comas.
- `imagen1..imagen5`: ID de Google Drive **o** URL completa — `image()` en Utils.gs acepta ambos.
- Productos con `activo != SI` no se publican; orden ascendente por columna `orden`.
