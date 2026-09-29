# 🐌 SnailBet

Aplicación Full-Stack desarrollada como parte de una prueba técnica.

SnailBet simula una plataforma de apuestas de carreras de caracoles. La aplicación permite registrar usuarios, iniciar sesión, consultar un dashboard con estadísticas y cargar saldo mediante una integración simulada con el proveedor de pagos **SnailPay**.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Recharts
- CSS
- LocalStorage

### Backend

- Node.js
- Express
- TypeScript
- CORS

## Estructura del proyecto

```text
diego-5831/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── snailPay.controller.ts
│   │   ├── routes/
│   │   │   └── snailPay.routes.ts
│   │   ├── types/
│   │   │   └── snailPay.types.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── BalanceRecharge.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── utils/
│   │   │   └── hashPassword.ts
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Funcionalidades

La aplicación implementa:

- Registro de usuario.
- Inicio y cierre de sesión.
- Validación básica de formularios.
- Hash de contraseña antes de almacenarla.
- Persistencia local del usuario y del saldo.
- Dashboard con saldo disponible.
- Gráfica de apuestas ganadas y perdidas.
- Gráfica de victorias por caracol.
- Recarga de saldo.
- Integración simulada con SnailPay.
- Manejo de transacciones aprobadas.
- Manejo de transacciones rechazadas.
- Simulación de indisponibilidad del proveedor de pagos.
- Persistencia del saldo después de recargar la página.
- Interfaz responsive.

## Instalación

Es necesario tener instalado:

- Node.js
- npm

Clonar o descargar el proyecto y abrir una terminal en la carpeta raíz.

### Backend

Entrar al backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor:

```bash
npm run dev
```

El backend se ejecutará en:

```text
http://localhost:3000
```

El endpoint de SnailPay es:

```text
POST http://localhost:3000/api/snailpay/charge
```

### Frontend

Desde otra terminal:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar la aplicación:

```bash
npm run dev
```

Vite mostrará la dirección local de la aplicación, normalmente:

```text
http://localhost:5173
```

## Registro e inicio de sesión

La aplicación permite crear una cuenta proporcionando:

- Nombre completo.
- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.

La contraseña no se almacena directamente como texto plano. Antes de almacenarse se procesa mediante la función de hash utilizada por la aplicación.

Después del registro, la información necesaria para esta demostración se conserva mediante LocalStorage.

## SnailPay

SnailPay es un proveedor de pagos simulado implementado en el backend.

Para producir una transacción aprobada se utilizan los siguientes datos de prueba:

```text
Número de tarjeta: 1234123412341234
Vencimiento:        12/26
CVV:                543
```

El nombre debe contener un valor y el monto debe ser mayor que cero.

### Transacción aprobada

Con los datos correctos, SnailPay responde con una transacción aprobada.

Ejemplo:

```json
{
  "card_number": "1234123412341234",
  "expiration_date": "12/26",
  "cvv": "543",
  "full_name": "Usuario Prueba",
  "transaction_amount": 500,
  "payer_id": "user-test-001",
  "payer_email": "prueba@correo.com"
}
```

Resultado esperado:

```text
HTTP 200
status: approved
```

El monto aprobado se suma al saldo del usuario y se persiste en LocalStorage.

### Transacción rechazada

Una tarjeta diferente a la configurada para el escenario exitoso permite comprobar el flujo de rechazo.

Ejemplo:

```text
1111222233334444
```

Resultado esperado:

```text
HTTP 402
status: rejected
```

Una transacción rechazada no modifica el saldo.

### Error interno

La aplicación incluye una opción de prueba:

```text
Simular error interno de SnailPay
```

Esta opción envía:

```json
{
  "simulate_system_error": true
}
```

y permite reproducir el escenario de indisponibilidad del proveedor.

Resultado esperado:

```text
HTTP 500
status: error
```

El saldo tampoco se modifica cuando ocurre este escenario.

## Decisiones técnicas

### Separación frontend/backend

El proyecto se dividió en dos aplicaciones independientes.

React se encarga de la interfaz y del estado de la aplicación, mientras que Express expone la simulación del servicio SnailPay.

Esto mantiene separada la presentación de la lógica asociada al proveedor de pagos.

### TypeScript

Se utilizó TypeScript tanto en frontend como en backend para definir las estructuras de datos y detectar errores durante el desarrollo y compilación.

### Persistencia

Para esta prueba se utilizó LocalStorage como mecanismo de persistencia.

Esto permite conservar información como la sesión, el usuario y el saldo sin incorporar una base de datos.

### Manejo del saldo

El frontend modifica el saldo únicamente cuando el backend devuelve una transacción con estado:

```text
approved
```

Los escenarios `rejected` y `error` no alteran el saldo.

### Gráficas

Se utilizó Recharts para representar visualmente:

- Apuestas ganadas y perdidas.
- Victorias por caracol.

## Validación realizada

Durante el desarrollo se probaron manualmente los principales escenarios.

### Backend

El endpoint de SnailPay se probó utilizando Postman.

Se comprobaron:

1. Pago aprobado.
2. Pago rechazado.
3. Error interno del proveedor.

### Frontend

Se comprobó:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Persistencia de sesión.
- Persistencia de saldo.
- Recarga aprobada.
- Recarga rechazada.
- Error interno.
- Actualización del saldo después de una operación aprobada.
- Conservación del saldo después de actualizar el navegador.

También se verificó la compilación de producción.

Frontend:

```bash
npm run build
```

Backend:

```bash
npx tsc
```

Ambos finalizaron correctamente durante la revisión previa a la entrega.

## Consideraciones de seguridad

La aplicación es una simulación para una prueba técnica.

Los números de tarjeta y CVV utilizados son datos ficticios proporcionados exclusivamente para reproducir los escenarios de SnailPay.

En una aplicación real no almacenaría CVV ni información sensible de tarjetas en LocalStorage.

Para un sistema de producción utilizaría un proveedor de pagos real y seguiría sus mecanismos de tokenización y las prácticas de seguridad correspondientes.

De la misma manera, LocalStorage no sustituye un sistema real de autenticación, sesiones y persistencia del lado del servidor.

## Limitaciones

Por tratarse de una prueba técnica:

- No se utiliza una base de datos.
- Los datos se almacenan localmente en el navegador.
- SnailPay es una simulación.
- Las estadísticas del dashboard utilizan información simulada.
- No existe procesamiento de pagos reales.
- El sistema de autenticación es local y no representa una implementación de producción.

## Uso de inteligencia artificial

Durante el desarrollo utilicé ChatGPT como herramienta de apoyo.

La utilicé principalmente para:

- Organizar el desarrollo en etapas.
- Revisar y mejorar fragmentos de código.
- Interpretar errores de TypeScript, React, Express y configuración.
- Analizar posibles soluciones cuando aparecieron problemas.
- Revisar la estructura del proyecto.
- Mejorar la documentación y presentación final.

Las respuestas generadas por IA fueron revisadas mediante la ejecución del código y pruebas manuales.

Los flujos principales fueron comprobados directamente en la aplicación y el endpoint de SnailPay también fue probado mediante Postman.

La IA fue utilizada como herramienta de apoyo durante el desarrollo y no como sustituto de la validación del funcionamiento de la aplicación.

## Pruebas automatizadas

El backend incluye pruebas automatizadas desarrolladas con **Vitest** y **Supertest**.

Actualmente se validan los siguientes escenarios:

- Disponibilidad de la API mediante `GET /api/health`.
- Procesamiento exitoso de una transacción con SnailPay.
- Rechazo de una transacción cuando los datos de la tarjeta no son válidos.

Para ejecutar las pruebas:

```bash
cd backend
npm test
```

Resultado esperado:

```text
Test Files  1 passed (1)
Tests       3 passed (3)
```

También puede comprobarse que el backend compile correctamente mediante:

```bash
npm run build
```

Las pruebas fueron ejecutadas localmente y los tres casos implementados finalizaron correctamente.

## Posibles mejoras

Con más tiempo se podrían incorporar:

- Base de datos.
- Autenticación mediante backend.
- Tokens de sesión.
- Historial de transacciones.
- Historial de apuestas.
- Variables de entorno para las URLs de servicios.
- Mejor manejo global de errores.
- División del bundle mediante code splitting.
- Contenedores Docker.
- Despliegue del frontend y backend.

## Autor

**Diego Alejandro Rodriguez Zarate**