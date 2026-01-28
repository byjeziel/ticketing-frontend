import { useNavigate } from "react-router-dom";
import ProducerForm from "../components/ProducerForm";
import { createProducer } from "../api/producers";
import type { Producer } from "../types/Producer";

export default function CreateProducerPage() {
  const navigate = useNavigate();

  const handleCreate = async (data: Producer) => {
    await createProducer(data);
    navigate("/producers");
  };

  return (
    <div>
      <h2>Crear Productor</h2>
      <ProducerForm onSubmit={handleCreate} />
    </div>
  );
}