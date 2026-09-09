# Modelos 3D

Coloca aquí el modelo real del producto:

```
public/assets/3d/quinoa.glb
```

El visor lo detecta automáticamente (`loadGltfModel` hace un `HEAD` antes de
descargarlo). Si el archivo no existe, la web genera el envase QUI9 de forma
procedimental con Three.js, así que nunca se rompe la experiencia.

Recomendaciones para el GLB:

- Formato **glTF binario** (`.glb`), Draco opcional.
- Altura del modelo normalizada automáticamente a ~2 unidades.
- Materiales PBR (`metalness` / `roughness`); la escena aporta la iluminación.
- Peso objetivo: **< 3 MB** para no penalizar el móvil.
- Origen del modelo centrado en su base o en su centro geométrico.

Para usar un modelo distinto por producto, rellena el campo `model3D` del
producto en `src/app/core/data/products.data.ts`.
