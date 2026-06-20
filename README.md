# Simulador de Refracción de la Luz Web

Aplicación web didáctica para simular la refracción de la luz mediante la Ley de Snell.

El proyecto transforma un diseño experimental sobre refracción en una herramienta interactiva. Permite modificar índices de refracción, cambiar el ángulo de incidencia, visualizar el rayo incidente y refractado, detectar reflexión total interna y comparar datos experimentales.

---

## Objetivo del proyecto

Crear una herramienta visual para reforzar el estudio de la refracción de la luz y la Ley de Snell.

El sistema permite:

- Simular el paso de la luz entre dos medios.
- Elegir medios como aire, agua, vidrio y diamante.
- Modificar índices de refracción personalizados.
- Cambiar el ángulo de incidencia.
- Calcular el ángulo de refracción.
- Detectar reflexión total interna.
- Visualizar la normal, la frontera entre medios y los rayos.
- Consultar datos experimentales.
- Descargar un resumen del cálculo.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Canvas API
- MathJax
- GitHub Pages

---

## Estructura del repositorio

```text
simulador-refraccion-luz-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## Fórmula principal

El simulador usa la Ley de Snell:

```text
n1 · sen(θ1) = n2 · sen(θ2)
```

Donde:

- `n1` es el índice de refracción del medio de incidencia.
- `n2` es el índice de refracción del medio de refracción.
- `θ1` es el ángulo de incidencia.
- `θ2` es el ángulo de refracción.

---

## Medios incluidos

El proyecto incluye valores iniciales para:

```text
Aire: 1.0003
Agua: 1.33
Vidrio: 1.50
Diamante: 2.42
```

También permite ingresar valores personalizados.

---

## Datos experimentales incluidos

El proyecto incluye una tabla con rayos de referencia:

```text
Normal
Rojo
Celeste
Violeta
Verde
```

Para cada rayo se muestran:

- Ángulo de incidencia.
- Ángulo de refracción.
- Seno del ángulo de incidencia.
- Seno del ángulo de refracción.
- Cociente `sen α / sen γ`.
- Comparación con `n2 / n1`.

---

## Cómo usar el proyecto

Abre el archivo:

```text
index.html
```

en cualquier navegador moderno.

No requiere instalación de dependencias locales.

---

## Publicación en GitHub Pages

Este proyecto puede publicarse como sitio estático desde GitHub Pages.

Pasos generales:

1. Subir los archivos al repositorio.
2. Entrar a **Settings**.
3. Abrir **Pages**.
4. Seleccionar la rama `main`.
5. Guardar.
6. Abrir el enlace publicado por GitHub.

---

## Enfoque académico

Este simulador convierte un diseño experimental de óptica en una aplicación interactiva.

El objetivo es que el usuario pueda observar cómo cambia la dirección de un rayo cuando pasa entre medios con distinto índice de refracción y relacionarlo con la Ley de Snell.

---

## Autora

**Sofía Pacheco**  
GitHub: [SofiPv](https://github.com/SofiPv)

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
