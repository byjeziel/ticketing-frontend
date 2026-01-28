import { useEffect, useState } from "react";
import type { Producer } from "../types/Producer";
import { getProducers, deleteProducer } from "../api/producers";

type Props = {
  onEdit?: (p: Producer) => void;
};

export default function ProducerList({ onEdit }: Props) {
  const [producers, setProducers] = useState<Producer[]>([]);

  const load = async () => {
    const res = await getProducers();
    if (res && res.data) setProducers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteProducer(id);
    load();
  };

  return (
    <div className="p-4">
      <h2>🎤 Productores</h2>
      <ul>
        {producers.map((p) => (
          <li key={p._id} style={{ marginBottom: 8 }}>
            <strong>{p.name}</strong> — {p.email ?? "—"}
            <div>
              <button onClick={() => onEdit?.(p)}>Editar</button>
              <button onClick={() => handleDelete(p._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}