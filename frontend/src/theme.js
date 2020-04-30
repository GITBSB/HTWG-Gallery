import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#388e3c',
      main: '#ffffff',
      dark: '#cccccc',
      contrastText: '#388e3c',
    },
    secondary: {
      light: '#388e3c',
      main: '#388e3c',
      dark: '#000',
      contrastText: '#388e3c',
    },
  }
})

export default theme
