# AplicacionIA

# 🧠 MultiLabel Image Classifier Web App

Una aplicación web fullstack que captura imágenes, identifica múltiples objetos mediante redes neuronales y describe los resultados por voz. Además, genera un historial visual de las predicciones almacenado en PostgreSQL a través de **PostgREST**.

---

## 📝 Descripción del Proyecto

Este sistema permite a los usuarios:

1. Capturar imágenes desde la cámara o cargarlas desde el dispositivo.
2. Detectar múltiples objetos mediante un modelo de clasificación multietiqueta (MobileNet o ResNet).
3. Reproducir descripciones habladas de los objetos detectados usando la API de Google Cloud Text-to-Speech.
4. Consultar un historial visual con la imagen analizada, las etiquetas reconocidas y la fecha.
5. Almacenar resultados en una base de datos PostgreSQL mediante la API RESTful autogenerada por PostgREST.

---

## ⚙️ Tecnologías Usadas

- **Frontend:** Angular 16+
- **Backend:** Flask (solo como puente entre frontend y modelo IA)
- **Modelo IA:** MobileNetV2 o ResNet50 (con salida multietiqueta)
- **Base de datos:** PostgreSQL + PostgREST (API RESTful generada desde DB)
- **Google Cloud:**
  - **Text-to-Speech API:** generación de audio
  - (opcional) **Vision API:** para detección OCR o etiquetas automáticas

---

## 🔁 Flujo de Trabajo

### 1. 📸 Captura de Imágenes (Angular)
- Angular accede a la cámara con `navigator.mediaDevices`.
- La imagen se puede subir o capturar desde la vista principal.
- Se envía al backend Flask mediante `FormData`.

### 2. 🧼 Preprocesamiento (Flask)
- Flask redimensiona la imagen a 224x224 (input del modelo).
- Normaliza los píxeles (0–1).
- Convierte a tensor para Keras.

### 3. 🧠 Clasificación Multietiqueta (Keras)
- El modelo preentrenado `.keras` predice múltiples etiquetas.
- Se aplica umbral (ej: `>0.5`) para filtrar etiquetas significativas.

### 4. 🔊 Descripción por Voz (Google API)
- Flask genera una frase como:
  `"Los objetos detectados son: leche, jabón, y cereal."`
- Esta frase se convierte en un archivo `.mp3` con Google Text-to-Speech.

### 5. 📂 Almacenamiento (PostgREST)
- Flask envía un `POST` a la API de PostgREST con:
  - URL de la imagen
  - Lista de predicciones
  - Fecha y hora
  - URL del audio generado
  - ID del usuario
- Angular consulta el historial desde PostgREST (`GET` por `user_id`).

---

## 🗃️ Estructura del Proyecto
/AppPrediccionMultiLabel
│
├── frontend/ (Angular)
│ ├── src/app/file-upload/
│ ├── src/app/history/
│ └── ...
│
├── backend/ (Flask)
│ ├── src.py
│ ├── modelo_entrenado.keras
│ ├── project_clv.json
│ ├── static/uploads/
│ ├── static/audio/
│ └── templates/index.html
│
└── postgrest/
