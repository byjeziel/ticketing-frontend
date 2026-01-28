import ProducerList from "../components/ProducerList";
import { useNavigate } from "react-router-dom";
import type { Producer } from "../types/Producer";

export default function ProducersPage() {
  const navigate = useNavigate();
  const handleEdit = (p: Producer) => {
    if (p._id) navigate(`/producers/edit/${p._id}`);
  };

  return (
    <div>
      <h1>Productores</h1>
      <button onClick={() => navigate("/producers/create")}>+ Nuevo productor</button>
      <ProducerList onEdit={handleEdit} />
    </div>
  );
}