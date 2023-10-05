import './error.css'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="error">
            <h1>Ups algo ha ido mal 😭</h1>

            <h3>Por favor asegurese de tener conexion a internet y luego presione el boton "RECARGAR".</h3>
            {error.message && <span>Este es el error: {error.message}</span>}
            <button className='btn btn-verde' onClick={resetErrorBoundary}>Recargar</button>
        </div>
    )
}

export default ErrorFallback