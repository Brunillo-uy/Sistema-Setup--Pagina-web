import { useState } from 'react';
function Header({ alNavegar = () => {} }) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [buscadorAbierto, setBuscadorAbierto] = useState(false);
    const [submenus, setSubmenus] = useState({
        catalogo: false,
        componentes: false,
        procesadores: false,
        almacenamiento: false,
        perifericos: false,
        accesorios: false
    })
    const alternarSubmenu = (nombre) => {
        setSubmenus({ ...submenus, [nombre]: !submenus[nombre] })
    }
    // Helper mecánico: evita recargar la página y avisa a App qué página mostrar.
    const irA = (pagina) => (evento) => {
        evento.preventDefault()
        alNavegar(pagina)
    }
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="logo">
            <a href="#inicio" onClick={irA('inicio')}>
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
            <span className="icono-encabezado">
                <img src="/img/iniciar sesion.png" alt="Boton para Iniciar sesión" className="icono-imagen" />
            </span>
            <span className="icono-encabezado">
                <img src="/img/carrito.png" alt="Boton para carrito" className="icono-imagen" />
            </span>
        </div>

        <div className="controles-movil">
                  <button
                      className={`boton-buscador-movil ${buscadorAbierto ? 'activo' : ''}`}
                      type="button"
                      aria-label="Abrir buscador"
                      aria-expanded={buscadorAbierto}
                      onClick={() => setBuscadorAbierto(!buscadorAbierto)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
            </button>

                  <button className={`boton-hamburguesa ${menuAbierto ? 'activo' : ''}`}
                      type="button"
                      aria-label="Abrir menú"
                      aria-expanded={menuAbierto}
                      onClick={() => setMenuAbierto(!menuAbierto)}
                  >
                      <span className="barra-hamburguesa"></span>
                      <span className="barra-hamburguesa"></span>
                      <span className="barra-hamburguesa"></span>
                  </button>
        </div>
    </div>
        <div className={`contenedor-buscador-movil ${buscadorAbierto ? 'activo' : ''}`}
              id="contenedor-buscador-movil"
          >
              <form className="formulario-buscador-movil" action="#" method="GET">
                  <input type="text" placeholder="Buscar..." className="entrada-buscador-movil" />
                  <button type="submit" className="boton-enviar-buscador-movil">Buscar</button>
              </form>
        </div>

    <nav className={`menu-movil ${menuAbierto ? 'activo' : ''}`} id="menu-movil" aria-label="Menú móvil">
        <ul className="lista-menu-movil">
            <li className="item-menu-movil item-menu-movil-con-submenu">
                <button
                    className={`boton-principal-menu-movil ${submenus.catalogo ? 'activo' : ''}`}
                    type="button"
                    aria-expanded={submenus.catalogo}
                    onClick={() => alternarSubmenu('catalogo')}
                >
                    Catalogo
                </button>

                <ul className={`submenu-movil ${submenus.catalogo ? 'activo' : ''}`}>
                          <li className="item-submenu-movil">
                              <button
                                  className={`boton-submenu-movil ${submenus.componentes ? 'activo' : ''}`}
                                  type="button"
                                  aria-expanded={submenus.componentes}
                                  onClick={() => alternarSubmenu('componentes')}
                              >
                                  Componentes
                              </button>

                        <ul className={`submenu-interno-movil ${submenus.componentes ? 'activo' : ''}`}>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>+Ver todo</a></li>

                            <li className="item-submenu-movil">
                                      <button
                                          className={`boton-submenu-movil ${submenus.procesadores ? 'activo' : ''}`}
                                          type="button"
                                          aria-expanded={submenus.procesadores}
                                          onClick={() => alternarSubmenu('procesadores')}
                                      >
                                          Procesadores
                                      </button>
                                <ul className={`submenu-interno-movil ${submenus.procesadores ? 'activo' : ''}`}>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>+Ver todo</a></li>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>AMD</a></li>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>NVIDIA</a></li>
                                </ul>
                            </li>

                            <li><a href="#catalogo" onClick={irA('catalogo')}>Memoria RAM</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Motherboards</a></li>

                            <li className="item-submenu-movil">
                                <button
                                className={`boton-submenu-movil ${submenus.almacenamiento ? 'activo' : ''}`}
                                type="button" aria-expanded={submenus.almacenamiento}
                                onClick={() => alternarSubmenu('almacenamiento')}
                                >
                                Almacenamiento
                                </button>
                                <ul className={`submenu-interno-movil ${submenus.almacenamiento ? 'activo' : ''}`}>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>+Ver todo</a></li>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>SSD</a></li>
                                    <li><a href="#catalogo" onClick={irA('catalogo')}>HDD</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li><a href="#monitores" onClick={irA('monitores')} className="enlace-menu-movil">Monitores</a></li>

                    <li className="item-submenu-movil">
                              <button
                                  className={`boton-submenu-movil ${submenus.perifericos ? 'activo' : ''}`}
                                  type="button"
                                  aria-expanded={submenus.perifericos}
                                  onClick={() => alternarSubmenu('perifericos')}
                              >
                                  Perifericos
                              </button>
                                <ul className={`submenu-interno-movil ${submenus.perifericos ? 'activo' : ''}`}>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>+Ver todo</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Teclados</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Mouse</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Auriculares</a></li>
                        </ul>
                    </li>

                    <li className="item-submenu-movil">
                              <button
                                  className={`boton-submenu-movil ${submenus.accesorios ? 'activo' : ''}`}
                                  type="button" aria-expanded={submenus.accesorios}
                                  onClick={() => alternarSubmenu('accesorios')}
                              >
                                  Accesorios
                              </button>
                                <ul className={`submenu-interno-movil ${submenus.accesorios ? 'activo' : ''}`}>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>+Ver todo</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Cables</a></li>
                            <li><a href="#catalogo" onClick={irA('catalogo')}>Soportes</a></li>
                        </ul>
                    </li>

                    <li><a href="#catalogo" onClick={irA('catalogo')} className="enlace-menu-movil">Escritorios</a></li>
                    <li><a href="#catalogo" onClick={irA('catalogo')} className="enlace-menu-movil">Sillas</a></li>
                </ul>
            </li>

            <li className="item-menu-movil">
                <a href="#contacto" onClick={irA('contacto')} className="enlace-menu-movil">Contacto</a>
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
                        <a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Componentes</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">+Ver todo</a></li>
                                <li className="catalogo-item-con-submenu">
                                    <a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Procesadores</a>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">+Ver todo</a></li>
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">AMD</a></li>
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">NVIDIA</a></li>
                                        </ul>
                                    </div>
                                </li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Memoria RAM</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Motherboards</a></li>
                                <li className="catalogo-item-con-submenu">
                                    <a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Almacenamiento</a>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">+Ver todo</a></li>
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">SSD</a></li>
                                            <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">HDD</a></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="#monitores" onClick={irA('monitores')} className="catalogo-link-menu">Monitores</a></li>
                    <li className="catalogo-item-con-submenu">
                        <a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Perifericos</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">+Ver todo</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Teclados</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Mouse</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Auriculares</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="catalogo-item-con-submenu">
                        <a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Accesorios</a>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">+Ver todo</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Cables</a></li>
                                <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Soportes</a></li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Escritorios</a>
                    </li>
                    <li><a href="#catalogo" onClick={irA('catalogo')} className="catalogo-link-menu">Sillas</a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="header-contacto-container">
            <a href="#contacto" onClick={irA('contacto')} className="contacto-header-link">Contacto</a>
        </div>
    </div>
    </header>
  )
}

export default Header
