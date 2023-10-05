import { Fragment } from "react"

const RadioState = ({ input }) => {
    return (
        <Fragment>
            <input type="radio" name={ input.name } id={ input.id } value={ input.value } 
            checked={ input.state === input.value } onChange={ input.handle }/>
            <label htmlFor={ input.id }>{ input.label }</label>
        </Fragment>
    )
}

export default RadioState