import "./style.scss";
import { useQuery } from "react-query";
import request from "../../request/query/request";
import MyCoursCard from "../MyCoursCard/MyCoursCard";
import Date from "../Date/Date";
import { useState } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import EditeSignature from "../EditSignature/EditeSignature";
import DeleteSignature from "../DeleteSignature/DeleteSignature";
import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";
import * as XLSX from "xlsx";
dayjs.locale("fr");

function Mycours() {
  let { id } = useParams();

  let userId = "";

  if (id) {
    userId = id;
  }

  const [date, setDate] = useState(dayjs());
  const [toggelPost, setToggelPost] = useState(false);
  const [toggelSign, setToggleSin] = useState("");

  const [toggelDeleteModal, setToggelDeleteModal] = useState(false);
  const [idDeleteModal, setIdDeleteModal] = useState("");

  const deleteHandel = (id) => {
    setIdDeleteModal(id);
    setToggelDeleteModal(true);
  };
  const deleteHandelClose = () => {
    setToggelDeleteModal(false);
  };

  const toggelHandel = (id) => {
    setToggelPost(true);
    setToggleSin(id);
  };

  const toggelHandelClose = (id) => {
    setToggelPost(false);
  };

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["mycours", Number(date.format("M")), Number(date.format("YYYY")), userId],
    async () => {
      const data = await request.myCoursByStudent(
        Number(date.format("M")),
        Number(date.format("YYYY")),
        userId
      );
      return data;
    },
    {
      refetchOnWindowFocus: true,
      staleTime: 0,
      cacheTime: 0,
      refetchInterval: 0,
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  const addMonth = () => {
    setDate(date.add(1, "month"));
  };

  const subMonth = () => {
    setDate(date.add(-1, "month"));
  };

  const handleExportData = () => {
    const ws = XLSX.utils.json_to_sheet(data.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feuille1");
    XLSX.writeFile(wb, `Mes cours ${date.format("MMMM/YYYY")}` + ".xlsx");
  };

  return (
    <>
      {toggelDeleteModal && (
        <DeleteSignature
          deleteHandelClose={deleteHandelClose}
          id={idDeleteModal}
        />
      )}

      <div className="mycours">
        {userId == "" && <Titel text="Mes cours" />}
        {userId != "" && <Titel text="Mes éleves" />}

        <div className="mycour-nav">
          <Date
            addMonth={addMonth}
            subMonth={subMonth}
            date={date.format("MMMM YYYY")}
          />
        </div>
        <div className="mycours-info">
          <p className="">Cours dispensés : {data.total.nbSignature}</p>
          <p className="">Heures travaillées : {data.total.hoursDeci}</p>
          <p className="">Nombre de trajets : {data.total.shifting}</p>
        </div>
        <div className="allsignature-nav-export" onClick={handleExportData}>
          Exporter vers excel
        </div>
        <div className="mycours-warpper">
          {data.data.map((item) => (
            <MyCoursCard
              data={item}
              key={item.id}
              toggelHandel={toggelHandel}
              deleteHandel={deleteHandel}
            />
          ))}
        </div>
      </div>

      {toggelPost && (
        <EditeSignature
          signatureId={toggelSign}
          toggelHandelClose={toggelHandelClose}
        />
      )}
    </>
  );
}

export default Mycours;
