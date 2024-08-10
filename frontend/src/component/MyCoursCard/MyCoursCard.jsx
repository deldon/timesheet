import "./style.scss";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

// import { useQuery } from "react-query";
// import request from "../../request/query/request";
// import { useState } from "react";

function MyCoursCard({ data, toggelHandel, deleteHandel }) {
  const date = dayjs(data.signature_date).format("DD/MM/YYYY");
  const startTime = dayjs(data.start_time).format("HH:mm");
  const editHandel = () => {
    toggelHandel(data.id);
  };

  const delHandel = () => {
    deleteHandel(data.id);
  };

  console.log(data);
  return (
    <div className="mycours-card">
      <div className="mycours-card-info">
        <h2 className="mycours-card-info-title">
          {data.student_firstname} {data.student_lastname}
        </h2>
        <p className="mycours-card-info-date">
          {date} {data.start_time.slice(0, -3)} / {data.end_time.slice(0, -3)}
        </p>

        <div className="mycours-card-info-time">{data.deci_duration}</div>

        <img
          src={data.shifting ? "../icones/car-on.svg" : "../icones/car-off.svg"}
          alt=""
          className="mycours-card-info-cars"
        />
        <img
          src={data.is_absent ? "../icones/user-off.svg" : ""}
          alt=""
          className="mycours-card-info-cars"
        />
        
      </div>

      <div className="mycours-card-edit">
        <img
          onClick={delHandel}
          src="../icones/delete.svg"
          alt=""
          className="mycours-card-delete"
        />
        {/* <Link to={`/edit/${data.id}`}> */}
        <img
          data={data.id}
          onClick={editHandel}
          src="../icones/update.svg"
          alt=""
          className="mycours-card-update"
        />
        {/* </Link> */}
      </div>
    </div>
  );
}

export default MyCoursCard;
