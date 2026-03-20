import { useEffect, useState } from "react";
import type { Producer } from "../types/Producer";
import { getProducers, deleteProducer } from "../api/producers";
import { useUserRole } from "../hooks/useUserRole";

type Props = {
  onEdit?: (p: Producer) => void;
};

export default function ProducerList({ onEdit }: Props) {
  const [producers, setProducers] = useState<Producer[]>([]);
  const { isAdmin } = useUserRole();

  const load = async () => {
    const res = await getProducers();
    if (res && res.data) setProducers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("¿Estás seguro de que querés eliminar este productor?")) return;
    await deleteProducer(id);
    load();
  };

  if (producers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No hay productores registrados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {producers.map((p) => (
        <div key={p._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">{p.name}</p>
            <p className="text-sm text-gray-500">{p.email ?? "—"}</p>
            {p.phone && <p className="text-sm text-gray-500">{p.phone}</p>}
          </div>
          {isAdmin() && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(p)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
