import { Fragment, useContext } from "react"
import { FaChartBar, FaBoxes, FaUsers, FaTruck, FaShoppingBag, FaShippingFast, FaMoneyBill, FaRegIdBadge, FaBook } from "react-icons/fa"
import { MenuLeftItemLink } from "./Sidebar.elements"
import { AuthContext } from "../../context/authContext"


const Sidebar = () => {
    const context = useContext(AuthContext)

    if (!context.user) return null

    return (
        <Fragment>
            <aside className="sidebar">
                <h2>Administración</h2>

                <nav className="navegacion">
                    <MenuLeftItemLink to="/">
                        <div>
                            <FaChartBar/>Inicio
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/products">
                        <div>
                            <FaBoxes/>Productos
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/contacts/C">
                        <div>
                            <FaUsers/>Clientes
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/contacts/P">
                        <div>
                            <FaTruck/>Proveedores
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/transactions/V">
                        <div>
                            <FaShoppingBag/>Ventas
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/transactions/C">
                        <div>
                            <FaShippingFast/>Compras
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/payments">
                        <div>
                            <FaMoneyBill/>Pagos
                        </div>
                    </MenuLeftItemLink>
                    <MenuLeftItemLink to="/manual">
                        <div>
                            <FaBook/>Manual Instructivo
                        </div>
                    </MenuLeftItemLink>
                    {   context.isAdmin
                        ? <MenuLeftItemLink to="/users">
                            <div>
                                <FaRegIdBadge/>Usuarios
                            </div>
                        </MenuLeftItemLink>
                        : null
                    }
                </nav>
            </aside>
        </Fragment>
    )
}

export default Sidebar