# Configuración de EmailJS para el Formulario de Contacto

El formulario de contacto usa **EmailJS** para enviar correos directamente a **patrickyoel13@gmail.com**.

## 📋 Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate gratuitamente (el plan gratuito incluye 200 emails/mes)
3. Verifica tu correo electrónico

### 2. Agregar un Servicio de Email

1. En el dashboard de EmailJS, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **Gmail** (o el servicio que prefieras)
4. Conecta tu cuenta de Gmail: **patrickyoel13@gmail.com**
5. Copia el **Service ID** que se genera (algo como: `service_xxxxxxx`)

### 3. Crear un Template de Email

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura el template con estos parámetros:

**Subject:**
```
Nuevo mensaje de contacto: {{subject}}
```

**Content (Body):**
```
Has recibido un nuevo mensaje desde tu portfolio:

Nombre: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de tu portfolio.
```

**To Email:**
```
{{to_email}}
```

4. Guarda el template y copia el **Template ID** (algo como: `template_xxxxxxx`)

### 4. Obtener tu Public Key

1. Ve a **"Account"** en el menú
2. En la sección **"General"**, encontrarás tu **Public Key** (algo como: `xxxxxxxxxxxxx`)
3. Cópiala

### 5. Configurar las credenciales en el código

Abre el archivo `src/app/components/Contact.tsx` y reemplaza las siguientes líneas (líneas 36-38):

```typescript
const serviceId = 'YOUR_SERVICE_ID'; // Reemplazar con tu Service ID
const templateId = 'YOUR_TEMPLATE_ID'; // Reemplazar con tu Template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Reemplazar con tu Public Key
```

Por ejemplo:
```typescript
const serviceId = 'service_abc123';
const templateId = 'template_xyz789';
const publicKey = 'abcdef123456';
```

### 6. ¡Listo!

Guarda los cambios y prueba el formulario. Los mensajes llegarán directamente a **patrickyoel13@gmail.com**.

## 🔒 Seguridad

- La **Public Key** es segura para usar en el frontend (por eso se llama "pública")
- EmailJS maneja la seguridad del envío de emails
- Puedes configurar límites de envío en tu dashboard de EmailJS

## 🎯 Características implementadas

✅ Validación de campos requeridos
✅ Indicador de carga mientras se envía
✅ Mensajes de éxito/error
✅ Limpieza automática del formulario tras envío exitoso
✅ Diseño responsive y animado

## 📧 Emails incluidos en el plan gratuito

- **200 emails/mes** gratis
- Si necesitas más, puedes actualizar a un plan pago

---

**¿Problemas?** Verifica que:
- Las credenciales estén correctamente copiadas
- Tu cuenta de Gmail esté conectada en EmailJS
- El template esté guardado y publicado

