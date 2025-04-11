// src/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  sizes: {
    // Custom sizes for breakpoints
    container: {
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // Add other custom sizes as needed
    full: '100%',
    half: '50%',
    quarter: '25%',
  },
  colors: {
    primary: '#d3dd5a',
    hover: '#c8aeec',
    selected: '#d3dd5a',
    icon: '#171947',
  },
  fonts: {
    heading: "'Manrope', sans-serif", // Utilisez Manrope pour les titres
    body: "'Manrope', sans-serif",    // Utilisez Manrope pour le texte du corps
  },
  components: {
    IconButton: {
      baseStyle: {
        fontSize: '30px',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
