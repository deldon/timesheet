import "./style.scss";

function Error({error}) {
  return (
    <div className="error">
        <p className="error-text">{error.message} ---++--</p>
    </div>
  );
}

export default Error;
