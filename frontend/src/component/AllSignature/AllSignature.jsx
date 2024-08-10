import "./style.scss";
import { useQuery } from "react-query";
import request from "../../request/query/request";
import Date from "../Date/Date";
import { useState } from "react";
import dayjs from "dayjs";

import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";
import RecapInterval from "../recapInterval/RecapInterval";

import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import * as XLSX from "xlsx";

import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
dayjs.locale("fr");

function AllSignature() {
  const [date, setDate] = useState(dayjs());
  const [exelToggle, setExelToggle] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "student", //access nested data with dot notation
        header: "L'étudiant",
        maxSize: 30,
      },
      {
        accessorKey: "teacher", //normal accessorKey
        header: "L'enseignant",
        size: 30, //small column
      },

      {
        accessorKey: "intervention",
        header: "Nombre d'intervention",
        size: 30, //small column
      },
      {
        accessorKey: "deplacement",
        header: "Déplacement",
        size: 30, //small column
      },
      {
        accessorKey: "is_absent",
        header: "Absent",
        size: 30, //small column
      },
      {
        accessorKey: "duration",
        header: "Temps total",
        size: 30, //small column
      },
      {
        accessorKey: "deci_duration",
        header: "Temps décimal",
        size: 30, //small column
      },
    ],
    []
  );

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["mycours", Number(date.format("M")), Number(date.format("YYYY"))],
    async () => {
      const data = await request.AllSignature(
        Number(date.format("M")),
        Number(date.format("YYYY"))
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
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feuille1");
    XLSX.writeFile(wb, `Recap ${date.format("MMMM/YYYY")}` + ".xlsx");
  };

  const handleExportExel = () => {
    setExelToggle(!exelToggle);
  };

  return (
    <>
      <div className="mycours">
        <Titel text="Recap" />
        <div className="allsignature-nav">
          <Date
            addMonth={addMonth}
            subMonth={subMonth}
            date={date.format("MMMM YYYY")}
          />
          <div className="allsignature-nav-export" onClick={handleExportExel}>
            Exporter
          </div>
          {exelToggle && (
            <div className="allsignature_toggle">
              <div
                className="allsignature-nav-export"
                onClick={handleExportData}
              >
                Exporter {date.format("MMMM YYYY")}
              </div>
              <RecapInterval />
            </div>
          )}
        </div>

        <div className="allsignature-warpper">
          <MaterialReactTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}

export default AllSignature;
