import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth.js'
import { useCarrito } from '../context/useCarrito.js'

function Header() {
    const { usuario, cerrarSesion } = useAuth();
    const { totalUnidades } = useCarrito();
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [buscadorAbierto, setBuscadorAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [submenus, setSubmenus] = useState({
        catalogo: false,
        componentes: false,
        procesadores: false,
        tarjetasVideo: false,
        almacenamiento: false,
        perifericos: false
    })

    const alternarSubmenu = (nombre) => {
        setSubmenus({ ...submenus, [nombre]: !submenus[nombre] })
    }

    const cerrarMenus = () => {
        setMenuAbierto(false)
        setBuscadorAbierto(false)
    }

    const nombreCorto = usuario?.nombre?.split(' ')[0]

    const salir = () => {
        cerrarSesion()
        cerrarMenus()
    }

    const alHacerClicMenuMovil = (evento) => {
        if (evento.target.closest('a')) setMenuAbierto(false)
    }

    const buscarProductos = (evento) => {
        evento.preventDefault()
        const texto = busqueda.trim()
        cerrarMenus()
        navigate(texto ? `/catalogo?buscar=${encodeURIComponent(texto)}` : '/catalogo')
    }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="logo">
            <Link to="/" onClick={cerrarMenus}>
                <img src="/img/logitaso_nav.png" alt="Logo de Sistema Setup" />
            </Link>
        </div>

        <div className="contenedor-buscador">
            <form className="formulario-buscador" role="search" onSubmit={buscarProductos}>
                <input
                    type="search"
                    placeholder="Buscar productos..."
                    className="entrada-buscador"
                    aria-label="Buscar productos"
                    value={busqueda}
                    onChange={(evento) => setBusqueda(evento.target.value)}
                />
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
            <Link
                to={usuario ? '/cuenta' : '/login'}
                className="icono-encabezado enlace-sesion"
                aria-label={usuario ? 'Ir a mi cuenta' : 'Iniciar sesión'}
                title={usuario ? 'Ir a mi cuenta' : 'Iniciar sesión'}
            >
                <img
                    src="/img/iniciar sesion.png"
                    alt={usuario ? 'Mi cuenta' : 'Botón para iniciar sesión'}
                    className="icono-imagen"
                />
                {usuario && <span className="nombre-usuario-header">Hola, {nombreCorto}</span>}
            </Link>
            <Link
                to="/carrito"
                className="icono-encabezado enlace-carrito"
                aria-label={`Carrito: ${totalUnidades} ${totalUnidades === 1 ? 'producto' : 'productos'}`}
                title="Ver carrito"
            >
                <img src="/img/carrito.png" alt="Carrito de compras" className="icono-imagen" />
                {totalUnidades > 0 && (
                    <span key={totalUnidades} className="carrito-contador" aria-live="polite">
                        {totalUnidades > 99 ? '99+' : totalUnidades}
                    </span>
                )}
            </Link>
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
              <form className="formulario-buscador-movil" role="search" onSubmit={buscarProductos}>
                  <input
                      type="search"
                      placeholder="Buscar productos..."
                      className="entrada-buscador-movil"
                      aria-label="Buscar productos"
                      value={busqueda}
                      onChange={(evento) => setBusqueda(evento.target.value)}
                  />
                  <button type="submit" className="boton-enviar-buscador-movil">Buscar</button>
              </form>
        </div>

    <nav className={`menu-movil ${menuAbierto ? 'activo' : ''}`} id="menu-movil" aria-label="Menú móvil">
        <ul className="lista-menu-movil" onClick={alHacerClicMenuMovil}>
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
                            <li><Link to="/catalogo">+Ver todo</Link></li>

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
                                    <li><Link to="/catalogo?categoria=procesadores">+Ver todo</Link></li>
                                    <li><Link to="/catalogo?categoria=procesadores&marcas=amd">AMD</Link></li>
                                    <li><Link to="/catalogo?categoria=procesadores&marcas=intel">Intel</Link></li>
                                </ul>
                            </li>

                            <li className="item-submenu-movil">
                                      <button
                                          className={`boton-submenu-movil ${submenus.tarjetasVideo ? 'activo' : ''}`}
                                          type="button"
                                          aria-expanded={submenus.tarjetasVideo}
                                          onClick={() => alternarSubmenu('tarjetasVideo')}
                                      >
                                          Tarjetas de video
                                      </button>
                                <ul className={`submenu-interno-movil ${submenus.tarjetasVideo ? 'activo' : ''}`}>
                                    <li><Link to="/catalogo?categoria=tarjetas-video">+Ver todo</Link></li>
                                    <li><Link to="/catalogo?categoria=tarjetas-video&chipset=amd">AMD</Link></li>
                                    <li><Link to="/catalogo?categoria=tarjetas-video&chipset=nvidia">NVIDIA</Link></li>
                                </ul>
                            </li>

                            <li><Link to="/catalogo?categoria=memorias-ram">Memoria RAM</Link></li>
                            <li><Link to="/catalogo?categoria=motherboards">Motherboards</Link></li>

                            <li className="item-submenu-movil">
                                <button
                                className={`boton-submenu-movil ${submenus.almacenamiento ? 'activo' : ''}`}
                                type="button" aria-expanded={submenus.almacenamiento}
                                onClick={() => alternarSubmenu('almacenamiento')}
                                >
                                Almacenamiento
                                </button>
                                <ul className={`submenu-interno-movil ${submenus.almacenamiento ? 'activo' : ''}`}>
                                    <li><Link to="/catalogo?categoria=almacenamiento">+Ver todo</Link></li>
                                    <li><Link to="/catalogo?categoria=almacenamiento">SSD</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li><Link to="/catalogo?categoria=monitores" className="enlace-menu-movil">Monitores</Link></li>

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
                            <li><Link to="/catalogo?categoria=perifericos">+Ver todo</Link></li>
                            <li><Link to="/catalogo?categoria=perifericos">Teclados</Link></li>
                            <li><Link to="/catalogo?categoria=mouse">Mouse</Link></li>
                        </ul>
                    </li>

                    <li><Link to="/catalogo?categoria=escritorios" className="enlace-menu-movil">Escritorios</Link></li>
                    <li><Link to="/catalogo?categoria=sillas" className="enlace-menu-movil">Sillas</Link></li>
                </ul>
            </li>

            <li className="item-menu-movil">
                <Link to="/contacto" className="enlace-menu-movil">Contacto</Link>
            </li>

            <li className="item-menu-movil">
                <Link to="/carrito" className="enlace-menu-movil">
                    Carrito {totalUnidades > 0 ? `(${totalUnidades})` : ''}
                </Link>
            </li>

            <li className="item-menu-movil item-menu-movil-sesion">
                {usuario ? (
                    <>
                        <Link to="/cuenta" className="enlace-menu-movil">
                            Mi cuenta ({nombreCorto})
                        </Link>
                        <button type="button" className="enlace-menu-movil" onClick={salir}>
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="enlace-menu-movil">Iniciar sesión</Link>
                        <Link to="/registro" className="enlace-menu-movil">Crear cuenta</Link>
                    </>
                )}
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
                        <Link to="/catalogo" className="catalogo-link-menu">Componentes</Link>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><Link to="/catalogo" className="catalogo-link-menu">+Ver todo</Link></li>
                                <li className="catalogo-item-con-submenu">
                                    <Link to="/catalogo?categoria=procesadores" className="catalogo-link-menu">Procesadores</Link>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><Link to="/catalogo?categoria=procesadores" className="catalogo-link-menu">+Ver todo</Link></li>
                                            <li><Link to="/catalogo?categoria=procesadores&marcas=amd" className="catalogo-link-menu">AMD</Link></li>
                                            <li><Link to="/catalogo?categoria=procesadores&marcas=intel" className="catalogo-link-menu">Intel</Link></li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="catalogo-item-con-submenu">
                                    <Link to="/catalogo?categoria=tarjetas-video" className="catalogo-link-menu">Tarjetas de video</Link>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><Link to="/catalogo?categoria=tarjetas-video" className="catalogo-link-menu">+Ver todo</Link></li>
                                            <li><Link to="/catalogo?categoria=tarjetas-video&chipset=amd" className="catalogo-link-menu">AMD</Link></li>
                                            <li><Link to="/catalogo?categoria=tarjetas-video&chipset=nvidia" className="catalogo-link-menu">NVIDIA</Link></li>
                                        </ul>
                                    </div>
                                </li>
                                <li><Link to="/catalogo?categoria=memorias-ram" className="catalogo-link-menu">Memoria RAM</Link></li>
                                <li><Link to="/catalogo?categoria=motherboards" className="catalogo-link-menu">Motherboards</Link></li>
                                <li className="catalogo-item-con-submenu">
                                    <Link to="/catalogo?categoria=almacenamiento" className="catalogo-link-menu">Almacenamiento</Link>
                                    <div className="catalogo-panel-submenu">
                                        <ul className="catalogo-menu-columna">
                                            <li><Link to="/catalogo?categoria=almacenamiento" className="catalogo-link-menu">+Ver todo</Link></li>
                                            <li><Link to="/catalogo?categoria=almacenamiento" className="catalogo-link-menu">SSD</Link></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li><Link to="/catalogo?categoria=monitores" className="catalogo-link-menu">Monitores</Link></li>
                    <li className="catalogo-item-con-submenu">
                        <Link to="/catalogo?categoria=perifericos" className="catalogo-link-menu">Perifericos</Link>
                        <div className="catalogo-panel-submenu">
                            <ul className="catalogo-menu-columna">
                                <li><Link to="/catalogo?categoria=perifericos" className="catalogo-link-menu">+Ver todo</Link></li>
                                <li><Link to="/catalogo?categoria=perifericos" className="catalogo-link-menu">Teclados</Link></li>
                                <li><Link to="/catalogo?categoria=mouse" className="catalogo-link-menu">Mouse</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li><Link to="/catalogo?categoria=escritorios" className="catalogo-link-menu">Escritorios</Link>
                    </li>
                    <li><Link to="/catalogo?categoria=sillas" className="catalogo-link-menu">Sillas</Link>
                    </li>
                </ul>
            </div>
        </div>
        <div className="header-contacto-container">
            <Link to="/contacto" className="contacto-header-link">Contacto</Link>
        </div>
    </div>
    </header>
  )
}

export default Header
