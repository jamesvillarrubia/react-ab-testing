import { PLAY, WIN } from './constants'
import { EventTypes } from 'redux-segment'

// Create a middleware that listens for plays & wins
const pushToAnalytics = store => next => action => {
  // console.log('EXPERIMENT MIDDLEWARE')
  // next(action)
  // return
  // console.log('FIRST ACTION', action)
  if (!action || !action.type) {
    return
  }
  switch (action.type) {
    case PLAY: {
      const experiment = action.payload['experiment']
      const variant = action.payload['variant']
      let userMeta = action.payload['meta']
      let meta = {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Experiment Viewed',
            properties: Object.assign({
              experiment_name: experiment,
              variation_name: variant,
            }, userMeta),
          },
        },
      }
      action.type = `A/B :: ${PLAY} :: ${experiment} :: ${variant}`
      action.meta = meta
      // console.log('PLAY ACTION', action)
      // next(action)
      break
    }
    case WIN: {
      const experiment = action.payload['experiment']
      const variant = action.payload['variant']
      let userMeta = action.payload['meta']
      let meta = {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            event: 'Experiment Won',
            properties: Object.assign({
              experiment_name: experiment,
              variation_name: variant,
            }, userMeta),
          },
        },
      }
      action.type = `A/B :: ${WIN} :: ${experiment} :: ${variant}`
      action.meta = meta
      // console.log('WIN ACTION', action)
      // next(action)
      break
    }
  }
  next(action)
}

export default pushToAnalytics
