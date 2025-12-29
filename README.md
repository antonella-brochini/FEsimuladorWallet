# Simulador Wallet - React Native

## Descripción
Simulador de wallet digital desarrollado en **React Native**, pensado para presentaciones a futuros clientes. La app permite:

- Autenticar usuarios (simulado).
- Agregar y eliminar tarjetas.  
- Visualizar balance.
- Visualizar perfil de usuario y log out.
- Realizar transferencias con wallet o tarjeta.
- Visualizar confrimacion de pago.
- Realizar top-ups de manera simulada.  

---

## Tecnologías

- **React Native**  
- **Expo** para simular app movil en navegador 
- **React Navigation** para la navegación entre pantallas  
- **Fetch API** para comunicación con el backend (simulado)  
- **Context**  para manejar estado  
- **Node.js** (backend simulado)  

---

### Usuario de prueba

La API cuenta con un **usuario de prueba** ya creado para facilitar el testeo de la app:

- **Email:** `anto@test.com`  
- **Contraseña:** `1234`

### Flujo de la aplicación

1. **Inicio en Login**  
   Al abrir la app por primera vez, el usuario ve la pantalla de **Login**.

2. **Persistencia de sesión**  
   - Si el usuario **ya inició sesión previamente** y **no hizo logout**, la app guarda sus datos localmente.  
   - En ese caso, al volver a abrir la app, **se salta el login** y lo redirige automáticamente a la pantalla de **Balance**.
   - La persistencia funciona tanto para window como para apps. 

3. **Pantalla de Balance**  
   Desde el balance, el usuario puede:
   - Ver su saldo actual.
   - Realizar una tranferencia.
   - Recargar saldo a la wallet.
     
4. **Pantalla tarjetas**  
   - El usuario puede ver sus tarjetas e ingresa una nueva.
   - Puede eliminar una tarjeta.
   - Puede marcar como principal una tarjeta.

5. **Perfil usuario**  
   - El usuario puede ver sus datos.
   - Las funcionlidades como Configuracion, notificaciones etc que se muestran no estan implementadas.
   
6. **Logout**  
   Al cerrar sesión, los datos guardados se eliminan y la próxima vez que se abra la app, volverá a mostrarse la pantalla de **Login**.

### 1. Requisitos
Para ejecutar la app necesitas tener instalados:

- **Node.js** ≥ 18.x
- **npm** o **yarn**
-**Expo CLI**: No es necesario instalar globalmente. Se ejecuta con `npx expo start` usando la versión incluida en el proyecto.
- Navegador web o la app **Expo Go** para ver en en el celular.
- 
### 2. Instalar dependencias y ejecutar

Desde la carpeta del proyecto:

- PowerShell
npm install
npx expo start -c

