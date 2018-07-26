'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex }

var React = _interopDefault(require('react'))
var PropTypes = _interopDefault(require('prop-types'))
var reactRedux = require('react-redux')
var WIN = require('./constants').WIN
var PLAY = require('./constants').PLAY

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }

  return obj
}

var get = function get (object, property, receiver) {
  if (object === null) object = Function.prototype
  var desc = Object.getOwnPropertyDescriptor(object, property)

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object)

    if (parent === null) {
      return undefined
    } else {
      return get(parent, property, receiver)
    }
  } else if ('value' in desc) {
    return desc.value
  } else {
    var getter = desc.get

    if (getter === undefined) {
      return undefined
    }

    return getter.call(receiver)
  }
}

var set = function set (object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property)

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object)

    if (parent !== null) {
      set(parent, property, value, receiver)
    }
  } else if ('value' in desc && desc.writable) {
    desc.value = value
  } else {
    var setter = desc.set

    if (setter !== undefined) {
      setter.call(receiver, value)
    }
  }

  return value
}

function chooseRandomly (variants) {
  var weighedVariants = []
  variants.forEach(function (variant) {
    var weight = variant.weight || 1
    for (var i = 0; i < weight; i++) {
      weighedVariants.push(variant)
    }
  })
  return weighedVariants[Math.floor(Math.random() * weighedVariants.length)].name
}

function getRandomVariant (experiment) {
  var choose = experiment.choose || chooseRandomly
  return choose(experiment.variants)
}

function createExperiments (experiments) {
  function generateRandomState () {
    var initialState = {}
    for (var name in experiments) {
      // console.log(name)
      // console.log(experiments)
      initialState[name] = getRandomVariant(experiments[name])
    }
    return initialState
  }
  return function reducer () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : generateRandomState()
    var action = arguments[1]
    // console.log('createExperiments => arguments ', arguments)
    // console.log('createExperiments => state ', state)
    // console.log('createExperiments => action ', action)

    switch (action.type) {
      case 'RESET_EXPERIMENT_VARIANT':
        // console.log('RESET_EXPERIMENT_VARIANT')

        return Object.assign({}, state, defineProperty({}, action.experiment, getRandomVariant(experiments[action.experiment])))

      case 'LOAD_EXPERIMENTS_VARIANTS':
        // console.log('LOAD_EXPERIMENTS_VARIANTS')
        var newState = {}
        for (var key in state) {
          if (action.state.hasOwnProperty(key) && state.hasOwnProperty(key)) {
            newState[key] = action.state[key]
          } else {
            newState[key] = state[key]
          }
        }
        return newState

      case 'SET_EXPERIMENT_VARIANT':
        // console.log('USING SET_EXPERIMENT_VARIANT')
        return Object.assign({}, state, defineProperty({}, action.experiment, action.variant))

      default:
        // console.log('USING DEFAULT')
        return state
    }
  }
}

// function Variant (props) {
//   console.log('LOADING VARIANT -> props', props)
//   let payload = {experiment: props.experiment, variant: props.name}
//   props.children.props.dispatch({ type: `PLAY :: ${props.experiment} :: ${props.variant}`, payload })
//   let child = React.Children.only(props.children)
//   return React.cloneElement(child, payload)
// }

class Variant extends React.Component {
  componentWillMount () {
    let props = this.props
    // console.log('LOADING VARIANT -> props', props)
    let payload = {experiment: props.experiment, variant: props.name}
    props.children.props.dispatch({ type: `${PLAY}`, payload })
  }

  render () {
    let props = this.props
    let child = React.Children.only(props.children)
    let payload = {experiment: props.experiment, variant: props.name}
    return React.cloneElement(child, payload)
  }
}

function play (experiment, variant, meta = {}) {
  // console.log('IN THE VARIANT')
  return { type: `${PLAY}`, payload: { experiment, variant, meta } }
}
function win (experiment, variant, meta = {}) {
  // console.log('IN THE WIN')
  return { type: `${WIN}`, payload: { experiment, variant, meta } }
}

const actions = {
  play,
  win,
}

Variant.propTypes = {
  name: PropTypes.string.isRequired,
}

function setExperimentVariant (experiment, variant) {
  return {
    type: 'SET_EXPERIMENT_VARIANT',
    experiment: experiment,
    variant: variant,
  }
}

function loadExperimentVariants (state) {
  return {
    type: 'LOAD_EXPERIMENTS_VARIANTS',
    state: state,
  }
}

function Selector (props) {
  var variant = props.variant
  var name = props.name
  var children = props.children
  var chosenOne = void 0
  React.Children.forEach(children, function (child) {
    if (child.type === Variant && child.props.name === variant) {
      chosenOne = React.cloneElement(child, { experiment: name, variant: variant })
    }
  })
  return chosenOne || null
}

Selector.propTypes = {
  name: PropTypes.string.isRequired,
}

var mapStateToProps = function mapStateToProps (state, ownProps) {
  // console.log('MAPPING STATE TO PROPS ON EXPERIMENT')
  return {
    variant: state.experiments[ownProps.name] || null,
  }
}

var mapDispatchToProps = function mapDispatchToProps (dispatch) {
  return {
    dispatch: dispatch,
  }
}

var Experiment = reactRedux.connect(mapStateToProps, mapDispatchToProps)(Selector)

var prefix = '_react_redux_ab_'

function digestCookies (cookies) {
  // console.log('digestCookies => COOKIES ', cookies)
  var experiments = {}
  for (var key in cookies) {
    if (key.indexOf(prefix) === 0) {
      var name = key.slice(prefix.length)
      experiments[name] = cookies[key]
    }
  }
  // console.log('digestCookies => EXPERIMENTS ', experiments)
  return experiments
}

function bakeCookies (state, setter) {
  // console.log('BAKE COOKIES -> state', state)
  // console.log('BAKE COOKIES -> setter', setter)
  for (var experiment in state.experiments) {
    setter(prefix + experiment, state.experiments[experiment])
  }
}

exports.createExperiments = createExperiments
exports.Variant = Variant
exports.Experiment = Experiment
exports.setExperimentVariant = setExperimentVariant
exports.loadExperimentVariants = loadExperimentVariants
exports.digestCookies = digestCookies
exports.bakeCookies = bakeCookies
exports.actions = actions
