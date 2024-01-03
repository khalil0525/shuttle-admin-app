import './App.css';
import React, { useEffect, useState } from 'react';

import { SnackbarProvider } from './context/SnackbarProvider';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import AppRouter from './AppRouter';

const lightTheme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        color: '#fff',
        textDecoration: 'none',
        _hover: {
          color: '#666666',
          textDecoration: 'none',
        },
        _active: {
          color: '#000',
        },
      },
    },
  },

  semanticTokens: {
    colors: {
      hoverBg: { default: 'gray.200' },
      hoverText: { default: 'gray.600' },
      compBg: {
        default: '#fff',
      },
      text: {
        default: '#000',
      },
    },
  },
});

const darkTheme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        color: '#333333',
        textDecoration: 'none',
        _hover: {
          color: '#fff',
          textDecoration: 'none',
        },
        _active: {
          color: '#000',
        },
      },
    },
  },

  styles: {
    global: {
      option: {
        backgroundColor: '#333333 !important',
      },
    },
  },

  semanticTokens: {
    colors: {
      hoverBg: { default: 'gray.700' },
      hoverText: { default: 'gray.200' },
      compBg: {
        default: '#333333',
      },
      text: {
        default: '#fff',
      },
    },
  },
});
function App() {
  const [themeChange, setThemeChange] = useState(null);
  const [autoThemeMode, setAutoThemeMode] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  const setAndStoreThemeMode = (newThemeMode) => {
    setThemeChange(newThemeMode);
    localStorage.setItem('themeMode', newThemeMode);
  };

  useEffect(() => {
    if (themeChange) {
      if (themeChange === 'auto') {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 6 && hours < 18) {
          setAutoThemeMode('light');
        } else {
          setAutoThemeMode('dark');
        }
      } else {
        setAutoThemeMode(null);
        setThemeMode(themeChange);
      }
      setThemeChange(null);
    }
  }, [themeChange]);

  useEffect(() => {
    const storedThemeMode = localStorage.getItem('themeMode');
    if (storedThemeMode) {
      setThemeMode(storedThemeMode);
    }
  }, []);

  return (
    <ChakraProvider
      theme={
        autoThemeMode === null
          ? themeMode === 'light'
            ? lightTheme
            : darkTheme
          : autoThemeMode === 'light'
          ? lightTheme
          : darkTheme
      }>
      <ColorModeScript initialColorMode={themeMode} />
      <SnackbarProvider>
        <AppRouter
          themeMode={themeMode}
          setAndStoreThemeMode={setAndStoreThemeMode}
          setAutoThemeMode={setAutoThemeMode}
          autoThemeMode={autoThemeMode}
        />
      </SnackbarProvider>
    </ChakraProvider>
  );
}

export default App;
