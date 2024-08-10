import { useState } from "react";
import Menu from "../Menu/Menu";

import "./style.scss";

function Header({user, disconnect}) {
  const [menuToggel, setMenuToggel] = useState(false);

  return (
    <div className="header">
      <p className="header-name">{user.lastname} {user.firstname}</p>
      <img
      onClick={()=>{setMenuToggel(true)}}
        className="header-menu"
        src="https://api.iconify.design/material-symbols:menu.svg"
      />
      {menuToggel && (<Menu user={user} setMenuToggel={setMenuToggel} disconnect={disconnect}/>)}
    </div>
  );
}

export default Header;
