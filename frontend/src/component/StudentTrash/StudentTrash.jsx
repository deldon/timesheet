import "./style.scss";
import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import request from "../../request/query/request";
import { useState } from "react";
import React, { useMemo } from "react";

import Spinner from "../Spinner/Spinner";
import Titel from "../Title/Title";
import Modal from "../Modal/Modal";
import DeleteStudent from "../DeleteStudent/DeleteStudent";

import MaterialReactTable from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Link } from "react-router-dom";

function StudentTrash() {

    const [toggelDeleteModal, setToggelDeleteModal] = useState(false);
    const [idDeleteModal, setIdDeleteModal] = useState("");

    const handleDelete = (row) => {
        setToggelDeleteModal(true);
        setIdDeleteModal(row.original.id);
      };
    
      const deleteHandelClose = () => {
        setToggelDeleteModal(false);
      };

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
  const mutation = useMutation(requestMutation.visibleStudent,{
      onSuccess:() => queryClient.invalidateQueries(['VisibleStudent']),
  });

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["VisibleStudent"],
    async () => {
      const data = await request.InvisibleStudent();
      return data;
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;








  const HandelVisible = (e)=>{
      mutation.mutate(e.original.id);
  }

  return (
    <div className="mycours">
      <Titel text="Eleves masquer" />

      <Link className="mycours_trash" to="/student">
        Voir les élèves visibles
      </Link>

      <div className="allsignature-warpper">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableEditing
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Visible">
                <IconButton onClick={() => HandelVisible(row)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDelete(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </div>
      {toggelDeleteModal && (
                <Modal Close={deleteHandelClose}>
                  <DeleteStudent
                    deleteHandelClose={deleteHandelClose}
                    id={idDeleteModal}
                  />
                </Modal>
              )}
    </div>

  );
}

export default StudentTrash;
