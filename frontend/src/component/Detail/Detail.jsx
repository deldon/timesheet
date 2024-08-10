import "./style.scss";
import { useQuery } from "react-query";
import request from "../../request/query/request";
import Date from "../Date/Date";
import { useState } from "react";
import dayjs from "dayjs";

import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";
import DetailInterval from "../DetailInterval/DetailInterval"

import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import * as XLSX from "xlsx";

import EditeSignature from "../EditSignature/EditeSignature";
import DeleteSignature from "../DeleteSignature/DeleteSignature";

import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
dayjs.locale("fr");

function Detail() {
  const [date, setDate] = useState(dayjs());

  const [toggelPost, setToggelPost] = useState(false);
  const [toggelEditId, settoggelEditId] = useState("");

  const [toggelDeleteModal, setToggelDeleteModal] = useState(false);
  const [idDeleteModal, setIdDeleteModal] = useState("");

  const [exelToggle, setExelToggle] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "student", //access nested data with dot notation
        header: "l'étudiant",
        maxSize: 30,
      },
      {
        accessorKey: "teacher", //normal accessorKey
        header: "l'enseignant",
        size: 30, //small column
      },
      {
        accessorKey: "signature_date",
        header: "date",
        size: 30, //small column
      },
      {
        accessorKey: "start_time",
        header: "start",
        size: 30, //small column
      },
      {
        accessorKey: "end_time",
        header: "end",
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
      {
        accessorKey: "shifting",
        header: "Trajet",
        size: 20, //small column,
        Cell: ({ cell }) => {
          if (cell.getValue()) {
            return (
              <img
                src="../icones/car-on.svg"
                alt=""
                className="mycours-card-info-cars"
              />
            );
          } else {
            return (
              <img
                src="../icones/car-off.svg"
                alt=""
                className="mycours-card-info-cars"
              />
            );
          }
        },
      },
      {
        accessorKey: "is_absent",
        header: "Absent",
        size: 20, //small column,
        Cell: ({ cell }) => {
          if (cell.getValue()) {
            return (
              <img
                src="../icones/user-off.svg"
                alt=""
                className="mycours-card-info-cars"
              />
            );
          }
        },
      },
    ],
    []
  );

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["mycours", Number(date.format("M")), Number(date.format("YYYY"))],
    async () => {
      const data = await request.DetailSignature(
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
    XLSX.writeFile(wb, `Detail ${date.format("MMMM/YYYY")}` + ".xlsx");
  };

  const handleExportExel = () => {
    setExelToggle(!exelToggle);
  };


  const handleEditRow = (e) => {
    setToggelPost(true);
    settoggelEditId(e.original.id);
  };

  const handleEditClose = (e) => {
    setToggelPost(false);
  };

  const handleDeleteRow = (e) => {
    setToggelDeleteModal(true);
    setIdDeleteModal(e.original.id);
  };

  const deleteHandelClose = () => {
    setToggelDeleteModal(false);
  };

  return (
    <>
      <div className="mycours">
        <Titel text="Detail" />
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
              <DetailInterval />
            </div>
          )}
        </div>

        <div className="allsignature-warpper">
          <MaterialReactTable
            columns={columns}
            data={data}
            enableEditing
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => handleEditRow(row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRow(row)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </div>
        {toggelPost && (
          <EditeSignature
            signatureId={toggelEditId}
            toggelHandelClose={handleEditClose}
          />
        )}
        {toggelDeleteModal && (
          <DeleteSignature
            deleteHandelClose={deleteHandelClose}
            id={idDeleteModal}
          />
        )}
      </div>
    </>
  );
}

export default Detail;
