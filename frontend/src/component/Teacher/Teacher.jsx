import "./style.scss";

import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import request from "../../request/query/request";

import { useState } from "react";
import { Link } from "react-router-dom";

import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";
import TeacherCard from "../TeacherCard/TeacherCard";
import Modal from "../Modal/Modal";
import PostTeacher from "../PostTeacher/PosteTeacher";
import DeleteTeacher from "../DeleteTeacher/DeleteTeacher";
import EditeTeacher from "../EditTeacher/EditTeacher";
import AddStudentToTeacher from "../AddStudentToTeacher/AddStudentToTeacher";
import DeleteStudentToTeacher from "../DeleteStudentToTeacher/DeleteStudentToTeacher";

function Teacher() {
  const [modalAdd, setModalAdd] = useState(false);

  const [modalDelete, setModalDelete] = useState(false);
  const [DeleteData, setDeleteData] = useState("");

  const [modalEdit, setModalEdit] = useState(false);
  const [editData, setEditData] = useState("");

  const [modalAddStudent, setModalmodalAddStudent] = useState(false);
  const [addStudentData, setAddStudentData] = useState("");

  const [modalDeleteStudent, setModalmodalDeleteStudent] = useState(false);
  const [deleteStudentData, setDeleteStudentData] = useState("");

  const handellModalAdd = (e) => {
    setModalAdd(true);
  };

  const handdelModalAddClose = () => {
    setModalAdd(false);
  };

  const handellModalDelete = (e) => {
    mutation.mutate({
      id: e,
      visibility: false,
    });
  };

  const handdelModalAddDeleteClose = () => {
    setModalDelete(false);
  };

  const handellModalEdit = (e) => {
    setModalEdit(true);
    setEditData(e);
  };

  const handdelModalEditClose = () => {
    setModalEdit(false);
  };

  const handellModalAddStudent = (e) => {
    setModalmodalAddStudent(true);
    setAddStudentData(e);
  };

  const handdelModalAddStudentClose = () => {
    setModalmodalAddStudent(false);
  };

  const handellModalDeleteStudent = (data, link) => {
    setModalmodalDeleteStudent(true);
    setDeleteStudentData(link);
  };

  const handdelModalDeleteStudentClose = () => {
    setModalmodalDeleteStudent(false);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.visibilityTeacher, {
    onSuccess: () => queryClient.invalidateQueries(["AllTeacher"]),
  });

  const { isLoading, error, data, isPreviousData } = useQuery(
    ["AllTeacher"],
    async () => {
      const data = await request.AllTeacher();
      return data;
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="teacher">
      <Titel text="Professeurs" />
      <div className="mycours_add" onClick={handellModalAdd}>
        Ajouter
      </div>
      <Link className="mycours_trash" to="/teacher-trash">
        Voir les Professeurs masqués.
      </Link>

      <div className="teacher-warpper">
        {data.map((item) => (
          <TeacherCard
            data={item}
            key={item.id}
            handellModalDelete={handellModalDelete}
            handellModalEdit={handellModalEdit}
            handellModalAddStudent={handellModalAddStudent}
            handellModalDeleteStudent={handellModalDeleteStudent}
          />
        ))}
      </div>
      {modalAdd && (
        <Modal Close={handdelModalAddClose}>
          <PostTeacher close={handdelModalAddClose} />
        </Modal>
      )}

      {modalDelete && (
        <Modal Close={handdelModalAddDeleteClose}>
          <DeleteTeacher id={DeleteData} Close={handdelModalAddDeleteClose} />
        </Modal>
      )}

      {modalEdit && (
        <Modal Close={handdelModalEditClose}>
          <EditeTeacher data={editData} Close={handdelModalEditClose} />
        </Modal>
      )}

      {modalAddStudent && (
        <Modal Close={handdelModalAddStudentClose}>
          <AddStudentToTeacher
            teacherData={addStudentData}
            Close={handdelModalAddStudentClose}
          />
        </Modal>
      )}

      {modalDeleteStudent && (
        <Modal Close={handdelModalDeleteStudentClose}>
          <DeleteStudentToTeacher
            Close={handdelModalDeleteStudentClose}
            id={deleteStudentData}
          />
        </Modal>
      )}
    </div>
  );
}

export default Teacher;
