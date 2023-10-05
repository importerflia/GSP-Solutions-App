import { useState, Fragment, useContext } from "react"
import { FaBars, FaChartBar, FaTimes, FaBoxes, FaUsers, FaTruck, FaShoppingBag, FaShippingFast, FaMoneyBill, FaRegIdBadge, FaBook } from "react-icons/fa"
import { Menu, MenuItem, MenuItemLink, MobileIcon } from "./Sidebar.elements"
import { AuthContext } from "../../context/authContext"
import { Link } from "react-router-dom"

const Header = () => {
    const context = useContext(AuthContext)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const handleMobileClick = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    const handleSignOutClick = (...args: {[key:string]: any}[]) => {
        const kwargs = args[0] ? args[0] : {}
        if(kwargs.hasOwnProperty('isMobile')) handleMobileClick()
        context.signOut()
    }

    const handleManualClick = () => {
        
    }

    return (
        <Fragment>
            <header className="barra" style={{ display: "flex" }}>
                <div className="contenedor">
                    <div className="contenido-barra">
                        <h1>GSP Solutions App</h1>
                        {
                            context.user
                            ? <Link to='/signin' className="btn btn-rojo signout" onClick={ handleSignOutClick }>
                                <i><FaTimes/></i> Cerrar Sesion
                            </Link>
                            : null
                        }
                    </div>
                </div>
                {   context.user
                    ? <MobileIcon onClick={ handleMobileClick }>
                        {   showMobileMenu
                            ? <FaTimes size="2.5rem"/>
                            : <FaBars size="2.5rem"/>
                        }
                    </MobileIcon>
                    : null
                }
            </header>
            <Menu open={showMobileMenu}>
                <MenuItem>
                    <MenuItemLink to="/" onClick={ handleMobileClick }>
                        <div>
                            <FaChartBar/>
                            Inicio
                        </div>  
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/products" onClick={ handleMobileClick }>
                        <div>
                            <FaUsers/>
                            Productos
                        </div> 
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/contacts/C" onClick={ handleMobileClick }>
                        <div>
                            <FaBoxes/>
                            Clientes
                        </div>
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/contacts/P" onClick={ handleMobileClick }>
                        <div>
                            <FaTruck/>
                            Proveedores
                        </div>
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/transactions/V" onClick={ handleMobileClick }>
                        <div>
                            <FaShoppingBag/>
                            Ventas
                        </div>
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/transactions/C" onClick={ handleMobileClick }>
                        <div>
                            <FaShippingFast/>
                            Compras
                        </div>
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to="/payments" onClick={ handleMobileClick }>
                        <div>
                            <FaMoneyBill/>
                            Pagos
                        </div>
                    </MenuItemLink>
                </MenuItem>
                {   context.isModerator
                    ? <MenuItem>
                        <MenuItemLink to="/users" onClick={ handleMobileClick }>
                            <div>
                                <FaRegIdBadge/>
                                Usuarios
                            </div>
                        </MenuItemLink>
                    </MenuItem>
                    : null
                }
                <MenuItem>
                    <MenuItemLink to='/manual' onClick={handleManualClick}>
                        <div>
                            <FaBook/>
                            Manual Instructivo
                        </div>
                    </MenuItemLink>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink to='/signin' onClick={() => handleSignOutClick({isMobile: true})}>
                        <div>
                            <FaTimes/>
                            Cerrar Sesion
                        </div>
                    </MenuItemLink>
                </MenuItem>
            </Menu>
    </Fragment>
    )
}

export default Header