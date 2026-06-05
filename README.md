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

El formulario no crea empresas ni usuarios. Genera un token y un enlace unico de descarga para la plataforma elegida.

Para envio real por correo, define antes de cargar `app.js`:

```html
<script>
  window.POSTRACK_LEAD_ENDPOINT = "https://tu-api.com/leads";
  window.POSTRACK_DOWNLOAD_BASE_URL = "https://tu-api.com/download";
</script>
```

El endpoint recibira `name`, `email`, `phone`, `business`, `platform`, `downloadToken` y `downloadLink`. Sin endpoint, la pagina conserva el preregistro en `localStorage` y abre un `mailto:` operativo prellenado.

## Deploy

Incluye workflow de GitHub Pages en `.github/workflows/pages.yml`.
