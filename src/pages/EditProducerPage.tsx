import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProducerForm from "../components/ProducerForm";
import { getProducerById, updateProducer } from "../api/producers";
import type { Producer } from "../types/Producer";

export default function EditProducerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producer, setProducer] = useState<Producer | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getProducerById(id);
      setProducer(res.data);
    };
    load();
  }, [id]);

  const handleUpdate = async (data: Producer) => {
    if (!id) return;
    await updateProducer(id, data);
    navigate("/producers");
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Productor</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {producer ? (
          <ProducerForm initialData={producer} onSubmit={handleUpdate} />
        ) : (
          <p className="text-gray-500">Cargando...</p>
        )}
      </div>
    </div>
  );
}
