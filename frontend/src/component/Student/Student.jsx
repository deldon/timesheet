import "./style.scss";
import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import request from "../../request/query/request";
import { useState } from "react";

import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";

import React, { useMemo } from "react";

import PostStudent from "../PostStudent/PostStudent";
import DeleteStudent from "../DeleteStudent/DeleteStudent";
import EditStudent from "../EditStudent/EditStudent";

import MaterialReactTable from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Link } from "react-router-dom";

function Student() {
  const [toggelAdd, setToggelAdd] = useState(false);

  const [toggelEdit, setToggelEdit] = useState(false);
  const [toggelEditId, settoggelEditId] = useState("");

  const [toggelDeleteModal, setToggelDeleteModal] = useState(false);
  const [idDeleteModal, setIdDeleteModal] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "lastname", //access nested data with dot notation
        header: "Nom",
        maxSize: 30,
      },
      {
        accessorKey: "firstname", //normal accessorKey
        header: "Prénom",
        size: 30, //small column
      },
    ],
    []
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.invisibleStudent, {
    onSuccess: () => queryClient.invalidateQueries(["AllStudent"]),
  });

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["AllStudent"],
    async () => {
      const data = await request.AllStudent();
      return data;
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  const handleAdd = (e) => {
    setToggelAdd(true);
  };

  const handleAddClose = () => {
    setToggelAdd(false);
  };

  const handleEditRow = (e) => {
    setToggelEdit(true);
    settoggelEditId(e.original);
  };

  const handleEditClose = (e) => {
    setToggelEdit(false);
  };

  const handleDeleteRow = (e) => {
    setToggelDeleteModal(true);
    setIdDeleteModal(e.original.id);
  };

  const deleteHandelClose = () => {
    setToggelDeleteModal(false);
  };
  const invisibleSignature = (e) => {
    mutation.mutate(e.original.id);
  };

  return (
    <>
      <div className="mycours">
        <Titel text="Eléves" />

        <nav className="mycours_nav">
          <div className="mycours_add" onClick={handleAdd}>
            Ajouter
          </div>
          <Link className="mycours_trash" to="/student-trash">
          Voir les étudiants masqués.
          </Link>
        </nav>

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
                <Tooltip arrow placement="right" title="Invisible">
                  <IconButton
                    color="error"
                    onClick={() => invisibleSignature(row)}
                  >
                    <VisibilityOffIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </div>
        {toggelAdd && (
          <Modal Close={handleAddClose}>
            <PostStudent toggelHandelClose={handleAddClose} />
          </Modal>
        )}

        {toggelDeleteModal && (
          <Modal Close={deleteHandelClose}>
            <DeleteStudent
              deleteHandelClose={deleteHandelClose}
              id={idDeleteModal}
            />
          </Modal>
        )}
        {toggelEdit && (
          <Modal Close={handleEditClose}>
            <EditStudent
              toggelEditId={toggelEditId}
              toggelHandelClose={handleEditClose}
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default Student;
