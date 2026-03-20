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
    <div className="max-w-lg mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Productor</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <ProducerForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
