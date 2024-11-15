import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#E6E6E6', // Background color of navbar
    hover: '#CFCFCF', // Hover color for icons
    selected: '#C3A8F9', // Color for selected icon
    icon: 'black', // Default icon color
  },
  components: {
    IconButton: {
      baseStyle: {
        fontSize: '30px', // Icon size
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
