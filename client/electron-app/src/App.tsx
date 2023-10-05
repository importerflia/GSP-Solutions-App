import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import ComponentsRoutes from './components/routes/ComponentsRoutes'
import ErrorFallback from './components/error/ErrorFallback'


const App = () => {
  return (
    <Fragment>
      <Header />
      <div className='grid contenedor contenido-principal'>
          <Sidebar />

          <main className="caja-contenido col-9-flex">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error) => {
              console.log(error)
            }}
          >
            <ComponentsRoutes />
            </ErrorBoundary>
          </main>
      </div>
    </Fragment>
  )
}

export default App
