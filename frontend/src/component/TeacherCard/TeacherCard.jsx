import "./style.scss";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
function TeacherCard({
  data,
  handellModalDelete,
  handellModalEdit,
  handellModalAddStudent,
  handellModalDeleteStudent,
}) {
  const handellDelete = () => {
    handellModalDelete(data.id);
  };

  const handellEdit = () => {
    handellModalEdit(data);
  };

  const handellAddStudent = () => {
    handellModalAddStudent(data);
  };

  const handellDeleteStudent = (e) => {
    handellModalDeleteStudent(data, e.target.id);
  };

  return (
    <div className="teacher_card">
      <div className="teacher_card_head">
        {data.lastname} {data.firstname} {data.is_admin && " - Admin"}
      </div>

      <div className="teacher_card_info"></div>

      <div className="teacher_card_student">
        {data.students.map((item) => (
          <div className="teacher_card_student_item">
            <img
              onClick={handellDeleteStudent}
              className="teacher_card_student_item_supr"
              src="../icones/RiCloseCircleFill.svg"
              id={item.id_link}
            />

            <div className="teacher_card_student_item_name">
              {item.lastname} {item.firstname}
            </div>
          </div>
        ))}
      </div>

      <div onClick={handellAddStudent} className="teacher_card_student_add">
        Ajouter un étudiant
      </div>
      <div className="teacher_card_footer">
        <div className="teacher_card_footer_icon">
          <img
            onClick={handellEdit}
            src="../icones/update.svg"
            alt=""
            className="teacher_card_footer_icon-update"
          />
        </div>
        <div className="teacher_card_footer_icon">
        <VisibilityOffIcon  style={{ fontSize: 32 }} className="teacher_card_footer_icon_delete"  onClick={handellDelete} />
      
        </div>
      </div>
    </div>
  );
}

export default TeacherCard;
