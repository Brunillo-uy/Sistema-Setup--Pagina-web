function Header() {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="logo">
            <a href="index.html">
                <img src="/img/logitaso_nav.png" alt="Logo de Sistema Setup" />
            </a>
        </div>

        <div className="contenedor-buscador">
            <form className="formulario-buscador" action="#" method="GET">
                <input type="text" placeholder="Buscar..." className="entrada-buscador" />
                <button type="submit" aria-label="Buscar" className="boton-buscador">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </form>
        </div>

        <div className="iconos-usuario">
            <a href="mi_cuenta.html" className="icono-encabezado">
                <img src="/img/iniciar sesion.png" alt="Boton para Iniciar sesión" className="icono-imagen" />
            </a>
            <a href="carrito.html" className="icono-encabezado">
                <img src="/img/carrito.png" alt="Boton para carrito" className="icono-imagen" />
            </a>
        </div>

        <div className="controles-movil">
            <button className="boton-buscador-movil" type="button" aria-label="Abrir buscador" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>

            <button className="boton-hamburguesa" type="button" aria-label="Abrir menú" aria-expanded="false">
                <span className="barra-hamburguesa"></span>
                <span className="barra-hamburguesa"></span>
                <span className="barra-hamburguesa"></span>
            </button>
        </div>
    </div>

    <div className="contenedor-buscador-movil" id="contenedor-buscador-movil">
        <form className="formulario-buscador-movil" action="#" method="GET">
            <input type="text" placeholder="Buscar..." className="entrada-buscador-movil" />
            <button type="submit" className="boton-enviar-buscador-movil">Buscar</button>
        </form>
    </div>

    <nav className="menu-movil" id="menu-movil" aria-label="Menú móvil">
        <ul className="lista-menu-movil">
            <li className="item-menu-movil item-menu-movil-con-submenu">
                <button className="boton-principal-menu-movil" type="button" aria-expanded="false">
                    Catalogo
                </button>

                <ul className="submenu-movil">
                    <li className="item-submenu-movil">
                        <button className="boton-submenu-movil" type="button" aria-expanded="false">
                            Componentes
                        </button>

                        <ul className="submenu-interno-movil">
                            <li><a href="catalogo.html">+Ver todo</a></li>

                            <li className="item-submenu-movil">
                                <button className="boton-submenu-movil" type="button" aria-expanded="false">
                                    Procesadores
                                </button>
                                <ul className="submenu-interno-movil">
                                    <li><a href="catalogo.html">+Ver todo</a></li>
                                    <li><a href="catalogo.html">AMD</a></li>
                                    <li><a href="catalogo.html">NVIDIA</a></li>
                                </ul>
                            </li>

                            <li><a href="catalogo.html">Memoria RAM</a></li>
                            <li><a href="catalogo.html">Motherboards</a></li>

                            <li className="item-submenu-movil">
                                <button className="boton-submenu-movil" type="button" aria-expanded="false">
                                    Almacenamiento
                                </button>
                                <ul className="submenu-interno-movil">
                                    <li><a href="catalogo.html">+Ver todo</a></li>
                                    <li><a href="catalogo.html">SSD</a></li>
                                    <li><a href="catalogo.html">HDD</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li><a href="catalogo-monitores.html" className="enlace-menu-movil">Monitores</a></li>

                    <li className="item-submenu-movil">
                        <button className="boton-submenu-movil" type="button" aria-expanded="false">
                            Perifericos
                        </button>
                        <ul className="submenu-interno-movil">
                            <li><a href="catalogo.html">+Ver todo</a></li>
                            <li><a href="catalogo.html">Teclados</a></li>
                            <li><a href="catalogo.html">Mouse</a></li>
                            <li><a href="catalogo.html">Auriculares</a></li>
                        </ul>
                    </li>

                    <li className="item-submenu-movil">
                        <button className="boton-submenu-movil" type="button" aria-expanded="false">
                            Accesorios
                        </button>
                        <ul className="submenu-interno-movil">
                            <li><a href="catalogo.html">+Ver todo</a></li>
                            <li><a href="catalogo.html">Cables</a></li>
                            <li><a href="catalogo.html">Soportes</a></li>
                        </ul>
                    </li>

                    <li><a href="catalogo.html" className="enlace-menu-movil">Escritorios</a></li>
                    <li><a href="catalogo.html" className="enlace-menu-movil">Sillas</a></li>
                </ul>
            </li>

            <li className="item-menu-movil">
                <a href="carrito.html" className="enlace-menu-movil">Mi carrito</a>
            </li>

            <li className="item-menu-movil">
                <a href="mi_cuenta.html" className="enlace-menu-movil">Iniciar sesión</a>
            </li>

            <li className="item-menu-movil">
                <a href="contacto.html" className="enlace-menu-movil">Contacto</a>
            </li>
        </ul>
    </nav>
    <div className="navbar-bottom">
        <div className="header-container-catalogo">
            <div className="catalogo-activador">
                <span className="catalogo-icono-menu" aria-hidden="true">&#9776;</span>
                <span className="catalogo-titulo-menu">Catalogo</span>
            </div>
            <div className="catalogo-desplegable">
                <ul className="catalogo-menu-columna">
                    <li className="catalogo-item-con-submenu">
                        <a href="catalogo.html" className="catalogo-link-menu">Componentes</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="catalogo.html" className="catalogo-link-menu">+Ver todo</a></li>
                                <li className="catalogo-item-con-submenu">
                                    <a href="catalogo.html" className="catalogo-link-menu">Procesadores</a>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><a href="catalogo.html" className="catalogo-link-menu">+Ver todo</a></li>
                                            <li><a href="catalogo.html" className="catalogo-link-menu">AMD</a></li>
                                            <li><a href="catalogo.html" className="catalogo-link-menu">NVIDIA</a></li>
                                        </ul>
                                    </div>
                                </li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Memoria RAM</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Motherboards</a></li>
                                <li className="catalogo-item-con-submenu">
                                    <a href="catalogo.html" className="catalogo-link-menu">Almacenamiento</a>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><a href="catalogo.html" className="catalogo-link-menu">+Ver todo</a></li>
                                            <li><a href="catalogo.html" className="catalogo-link-menu">SSD</a></li>
                                            <li><a href="catalogo.html" className="catalogo-link-menu">HDD</a></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="catalogo-monitores.html" className="catalogo-link-menu">Monitores</a></li>
                    <li className="catalogo-item-con-submenu">
                        <a href="catalogo.html" className="catalogo-link-menu">Perifericos</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="catalogo.html" className="catalogo-link-menu">+Ver todo</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Teclados</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Mouse</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Auriculares</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="catalogo-item-con-submenu">
                        <a href="catalogo.html" className="catalogo-link-menu">Accesorios</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="catalogo.html" className="catalogo-link-menu">+Ver todo</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Cables</a></li>
                                <li><a href="catalogo.html" className="catalogo-link-menu">Soportes</a></li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="catalogo.html" className="catalogo-link-menu">Escritorios</a>
                    </li>
                    <li><a href="catalogo.html" className="catalogo-link-menu">Sillas</a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="header-contacto-container">
            <a href="contacto.html" className="contacto-header-link">Contacto</a>
        </div>
    </div>
    </header>
  )
}

export default Header
