import "./style.scss";


function StudentCard({ data, handelClick }) {

const handel = () =>{
  handelClick(data)
}

  return (
    <div
    onClick={handel}
    className="signature-name"
    id={data.id}
    
  >
    {data.lastname} {data.firstname}
  </div>
  );
}

export default StudentCard;