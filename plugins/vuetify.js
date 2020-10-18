import colors from 'vuetify/es5/util/colors'

import 'typeface-montserrat/index.css'

// Make sure css loader is installed first
import 'line-awesome/dist/line-awesome/css/line-awesome.css'

const LINE_AWESOME = {
  complete: 'la-check',
  cancel: 'la-ban',
  close: 'la-times',
  delete: 'la-trash', // delete (e.g. v-chip close)
  clear: 'la-times',
  success: 'la-check',
  info: 'la-exclamation-circle',
  warning: 'la-exclamation-triangle',
  error: 'la-exclamation-triangle',
  prev: 'la-angle-left',
  next: 'la-angle-right',
  checkboxOn: 'la-check',
  checkboxOff: 'la-stop',
  checkboxIndeterminate: '...',
  delimiter: '...', // for carousel
  sort: '...',
  expand: 'la-angle-down',
  menu: '...',
  subgroup: '...',
  dropdown: 'la-angle-down',
  radioOn: 'la-check-circle',
  radioOff: 'la-circle',
  edit: 'la-edit',
  ratingEmpty: '...',
  ratingFull: '...',
  ratingHalf: '...',
  loading: '...',
  first: '...',
  last: '...',
  unfold: '...',
  file: '...'
}

export default {
  icons: {
    iconfont: 'la', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    values: LINE_AWESOME
  },
  theme: {
    themes: {
      light: {
        success: '#A4DB75', //  Success
        error: '#DA4E71', //  Error
        primary: '#12152F', //  ALtron Grey BLue
        accent: '#01C5FF', //  ALtron light BLue
        secondary: '#20274F', //  ALtron white
        info: '#0169FF', //  ALtron dark Blue
        primaryShade: '#161A37',
        accentShade: '#41D4FF',
        secondaryShade: '#184F7B',
        infoShade: '#0180FF',
        primaryhover: '#12152F',
        accenthover: '#0599CB',
        secondaryhover: '#099ED3',
        infohover: '#01AEFF',
      },



    }
  }
}
