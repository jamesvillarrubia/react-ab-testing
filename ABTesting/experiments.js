// console.log('***** LOADING ABTESTING')
const experiments = {
  'RegistrationFormVariation': {
    variants: [
      {name: 'NoText'},
      {name: 'Text1', weight: 1},
    ],
  },
}

export default experiments
