import { extendTheme } from "native-base";




export const theme = extendTheme({
    fonts: {
        heading: 'Poppins',
        body: 'Poppins',
        mono: 'Poppins'
    },
    fontConfig: {
        Poppins: {
            100: {
                normal: 'Poppins Light',
              },
              200: {
                normal: 'Poppins Light',
              },
              300: {
                normal: 'Poppins Light',
              },
              400: {
                normal: 'Poppins Regular',
              },
              500: {
                normal: 'Poppins Medium',
              },
              600: {
                normal: 'Poppins SemiBold',
              },
              700: {
                  normal: 'Poppins Bold'
              },
              800: {
                  normal: 'Poppins Bold'
              }
        },
        
    },
    colors: {
        primary: {
            600: "#2A9A4A",
            500: "#2A9A4A",
            400: "#5DB777",
            300: "#9CCDAA",
            200: "#CFE1D4",
            100: "#EEF5F0"
        },
        secondary: {
            600: "#FBEB85",
            500: "#FBEB85",
            400: "#F5EEBF",
            300: "#FAF6DE",
            200: "#FDFBF0",
            100: "#FEFCF4"
        }
    }
})