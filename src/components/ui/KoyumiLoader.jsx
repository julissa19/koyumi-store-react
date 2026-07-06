import { Spinner } from "react-bootstrap";

function KoyumiLoader({ text = "Cargando..." }) {
  return (
    <div className="state-box koyumi-loader">
      <Spinner animation="border" role="status" className="koyumi-spinner">
        <span className="visually-hidden">{text}</span>
      </Spinner>

      <p>{text}</p>
    </div>
  );
}

export default KoyumiLoader;