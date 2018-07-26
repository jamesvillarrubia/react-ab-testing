import { Experiment, Variant, play, win } from '../ABTesting'

// VARIANTS
import NoText from './variants/no-text'
import Text1 from './variants/text1'

// experimentDebugger.enable();

class Main extends Component {
  constructor (props) {
    super(props)
    autoBind(this)
  }

  render () {
    return (
        <Experiment name="RegistrationFormVariation">
        <Variant name="NoText" >
            <NoText {...this.props} />
        </Variant>
        <Variant name="Text1">
            <Text1 {...this.props} />
        </Variant>
        </Experiment>
    )
  }
}

export default Main