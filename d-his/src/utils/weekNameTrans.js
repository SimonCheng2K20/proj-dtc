const weekNameTrans = (item, toType) => {
  switch (toType) {
    case 'chi':
      switch (item) {
        case 'SUN':
          return '日'
        case 'MON':
          return '一'
        case 'TUE':
          return '二'
        case 'WED':
          return '三'
        case 'THU':
          return '四'
        case 'FRI':
          return '五'
        case 'SAT':
          return '六'
        case 0:
          return '日'
        case 1:
          return '一'
        case 2:
          return '二'
        case 3:
          return '三'
        case 4:
          return '四'
        case 5:
          return '五'
        case 6:
          return '六'
      }
      break
    case 'eng':
      switch (item) {
        case '日':
          return 'SUN'
        case '一':
          return 'MON'
        case '二':
          return 'TUE'
        case '三':
          return 'WED'
        case '四':
          return 'THU'
        case '五':
          return 'FRI'
        case '六':
          return 'SAT'
        case 0:
          return 'SUN'
        case 1:
          return 'MON'
        case 2:
          return 'TUE'
        case 3:
          return 'WED'
        case 4:
          return 'THU'
        case 5:
          return 'FRI'
        case 6:
          return 'SAT'
      }
      break
    case 'num':
      switch (item) {
        case '日':
          return 0
        case '一':
          return 1
        case '二':
          return 2
        case '三':
          return 3
        case '四':
          return 4
        case '五':
          return 5
        case '六':
          return 6
        case 'SUN':
          return 0
        case 'MON':
          return 1
        case 'TUE':
          return 2
        case 'WED':
          return 3
        case 'THU':
          return 4
        case 'FRI':
          return 5
        case 'SAT':
          return 6
      }
      break
  }
}

export default weekNameTrans
