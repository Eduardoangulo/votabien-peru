/**
 * Calcula la luminancia relativa de un color
 * @param color - Color en formato hex (#RRGGBB) u oklch/rgb
 * @returns Valor de luminancia entre 0 y 1
 */
export const getLuminance = (color: string): number => {
  let r = 0,
    g = 0,
    b = 0;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith("oklch") || color.startsWith("rgb")) {
    return 0.3;
  }

  // Luminosidad relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance;
};

/**
 * Determina si necesitamos texto oscuro o claro basado en el color de fondo
 * @param backgroundColor - Color de fondo en formato hex u oklch/rgb
 * @returns color del texto
 */
export const getTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  // Si la luminosidad es alta (> 0.6), usar texto oscuro
  return luminance > 0.6 ? "text-gray-900" : "text-white";
};

/**
 * Determina si un color necesita un overlay oscuro para mejorar el contraste
 * @param backgroundColor - Color de fondo en formato hex u oklch/rgb
 * @returns true si el color es muy claro (luminancia > 0.7)
 */
export const needsOverlay = (backgroundColor: string): boolean => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.7;
};

/**
 * Genera estilos inline para text-shadow basados en luminancia
 * @param backgroundColor - Color de fondo
 * @returns Objeto con propiedad textShadow o undefined
 */
export const getTextShadowStyle = (backgroundColor: string) => {
  const hasOverlay = needsOverlay(backgroundColor);
  const textColor = getTextColor(backgroundColor);

  if (hasOverlay) {
    return undefined;
  }

  if (textColor === "text-white") {
    return { textShadow: "0 1px 2px rgba(0,0,0,0.1)" };
  }

  return undefined;
};
