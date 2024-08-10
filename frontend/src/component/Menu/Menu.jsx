import "./style.scss";
import { NavLink } from "react-router-dom";

function Menu({ setMenuToggel, user, disconnect }) {
  const handelClose = () => {
    setMenuToggel(false);
  };

  return (
    <div className="menu">
      <div className="menu-close">
        <img onClick={handelClose} src="../icones/RiCloseCircleFill.svg" />
      </div>

      <nav className="menu-nav">
        <ul className="menu_nav_ul">
          <li className="menu_nav_li">
            <NavLink
              onClick={handelClose}
              to="/"
              className={({ isActive }) => {
                if (isActive) {
                  return "menu_nav_link navlink";
                }
                return "menu_nav_link";
              }}
            >
              Émargement
            </NavLink>
          </li>
          <li className="menu_nav_li">
            <NavLink
              onClick={handelClose}
              to="/mycours"
              className={({ isActive }) => {
                if (isActive) {
                  return "menu_nav_link navlink";
                }
                return "menu_nav_link";
              }}
            >
              Mes cours
            </NavLink>
          </li>
          <li className="menu_nav_li">
            <NavLink
              onClick={handelClose}
              to="/mystudent"
              className={({ isActive }) => {
                if (isActive) {
                  return "menu_nav_link navlink";
                }
                return "menu_nav_link";
              }}
            >
              Mes élèves
            </NavLink>
          </li>

          <li className="menu_nav_li">
            <NavLink
              onClick={handelClose}
              to="/myprofile"
              className={({ isActive }) => {
                if (isActive) {
                  return "menu_nav_link navlink";
                }
                return "menu_nav_link";
              }}
            >
              Mon profil
            </NavLink>
          </li>

          {user.is_admin && (
            <>
              <div className="menu_nav_link_space"></div>
              <li className="menu_nav_li">
                <NavLink
                  onClick={handelClose}
                  to="/teacher"
                  className={({ isActive }) => {
                    if (isActive) {
                      return "menu_nav_link navlink";
                    }
                    return "menu_nav_link";
                  }}
                >
                  Professeurs
                </NavLink>
              </li>
              <li className="menu_nav_li">
                <NavLink
                  onClick={handelClose}
                  to="/student"
                  className={({ isActive }) => {
                    if (isActive) {
                      return "menu_nav_link navlink";
                    }
                    return "menu_nav_link";
                  }}
                >
                  Elèves
                </NavLink>
              </li>
              <li className="menu_nav_li">
                <NavLink
                  onClick={handelClose}
                  to="/recap"
                  className={({ isActive }) => {
                    if (isActive) {
                      return "menu_nav_link navlink";
                    }
                    return "menu_nav_link";
                  }}
                >
                  Recap
                </NavLink>
              </li>
              <li className="menu_nav_li">
                <NavLink
                  onClick={handelClose}
                  to="/detail"
                  className={({ isActive }) => {
                    if (isActive) {
                      return "menu_nav_link navlink";
                    }
                    return "menu_nav_link";
                  }}
                >
                  Detail
                </NavLink>
              </li>
            </>
          )}

          <li className="menu_nav_li">
            <a
              onClick={disconnect}
              aria-current="page"
              className="menu_nav_link"
            >
              Se déconnecter
            </a>
          </li>
        </ul>
      </nav>
      <p className="version">Version : 1.3</p>
    </div>
  );
}

export default Menu;
