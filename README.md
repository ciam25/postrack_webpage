# Postrack Webpage

Landing publica para preregistro de descargas de Postrack Local.

## Objetivo

- Mostrar la vista inicial publica con la misma identidad visual del cliente.
- Ofrecer llamadas a accion para Android y Windows.
- Capturar preregistro de contacto sin crear empresa ni cuenta.

## Desarrollo local

Este sitio es estatico. Puedes abrir `index.html` directamente o servirlo con cualquier servidor local.

```bash
npx serve .
```

## Formulario

El formulario guarda el preregistro en `localStorage` y abre un `mailto:` con los datos. Para produccion se recomienda conectar `app.js` a una API de leads, CRM, Google Sheets o servicio de formularios.

## Deploy

Incluye workflow de GitHub Pages en `.github/workflows/pages.yml`.
