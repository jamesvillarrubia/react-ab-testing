import middleware from './middleware'
import { createExperiments, loadExperimentVariants, bakeCookies, digestCookies, actions, Experiment, Variant } from './core'
import Cookies from 'js-cookie'
import * as constants from './constants'

function initialize (experiments) {
// INITIALIZE THE ROUTER
  const reducer = createExperiments(experiments)
  let initialstate = reducer(undefined, loadExperimentVariants({}))

  // console.log('***** ABTESTING GET DIGEST')
  let existingExperiments = digestCookies(Cookies.get())

  // console.log('\n***** INITIAL STATE', initialstate)
  // console.log('\n***** EXISTING COOKIES', existingExperiments, Object.keys(existingExperiments).length)
  if (Object.keys(existingExperiments).length === 0) {
  // console.log('\n\n\n\n***** NO EXPERIMENTS', existingExperiments)
    bakeCookies({experiments: initialstate}, Cookies.set)
  } else {
    initialstate = existingExperiments
  }
  return initialstate
  // return { reducer, initialstate, middleware }
}

// STORE THE INITIAL COOKIE VALUES
let reducer = createExperiments()
export { initialize, reducer, middleware, constants, bakeCookies, digestCookies, actions, Experiment, Variant }
