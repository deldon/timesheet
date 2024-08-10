import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "./style.scss";

function Date({ subMonth, addMonth, date }) {
  return (
    <div className="date">
      <img
        onClick={subMonth}
        src="https://api.iconify.design/ooui:next-rtl.svg"
      />
      <div className="date-text">
        <p className="date-text-p">{date}</p>
      </div>
      <img
        onClick={addMonth}
        src="https://api.iconify.design/ooui:next-ltr.svg"
      />
    </div>
  );
}

export default Date;
