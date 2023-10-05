import Iframe from "react-iframe"
import { Link } from "react-router-dom"
import "./manual.css"
import Swal from "sweetalert2"

const Manual = () => {
    const handleClick = () => {
        Swal.fire(
            'Importante!',
            'Para evitar errores, lea el manual de usuarios en la seccion importacion masiva antes de rellenar la plantilla',
            'warning'
        )
    }

  return (
    <>
        <div className="manual">
            <Iframe
                url="https://scribehow.com/page-embed/Manual_de_Usuario_GSP_Solutions_App__1Ghu1iskTkCZyBJRmwp6AQ"
                width="70%"
                height="640"
                allowFullScreen
                frameBorder={0}
            />
        </div>
        <div className="templates">
            {/* <h3>Manual de Usuarios</h3>
            <Link 
                to="https://scribehow.com/page/Manual_de_Usuario_GSP_Solutions_App__1Ghu1iskTkCZyBJRmwp6AQ" 
                className="btn btn-verde"
                target="blank"
            >
                Manual de Usuarios
            </Link> */}
            <h3>Descargar Plantillas Excel</h3>
            <Link 
                to="https://docs.google.com/spreadsheets/d/1gH4IcD1ytWy_BtsCmm9CcTZdrNMyfPazPBAw5rmJm9I/export?format=xlsx" 
                className="btn btn-verde"
                onClick={handleClick}
            >
                Plantilla de Productos
            </Link>
            <Link 
                to="https://docs.google.com/spreadsheets/d/1cfhlyyKSGeq054PiQlEkYuWIk7kEy8XnztMM3LmzkVk/export?format=xlsx" 
                className="btn btn-verde"
                onClick={handleClick}
            >
                Plantilla de Contactos
            </Link>
            <Link 
                to="https://docs.google.com/spreadsheets/d/1JCdkPqcuI9jWcvmIuqFFeoZvfZBNHDJfgY8Icxqbz_o/export?format=xlsx" 
                className="btn btn-verde"
                onClick={handleClick}
            >
                Plantilla de Pagos
            </Link>
        </div>
    </>
  )
}

export default Manual