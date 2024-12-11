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
    primary: '#E6E6E6',
    hover: '#CFCFCF',
    selected: '#C3A8F9',
    icon: 'black',
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
