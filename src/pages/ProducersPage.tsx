import ProducerList from "../components/ProducerList";
import { useNavigate } from "react-router-dom";
import type { Producer } from "../types/Producer";
import { useUserRole } from "../hooks/useUserRole";

export default function ProducersPage() {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  const handleEdit = (p: Producer) => {
    if (p._id) navigate(`/producers/edit/${p._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productores</h1>
        {isAdmin() && (
          <button
            onClick={() => navigate("/producers/create")}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nuevo productor
          </button>
        )}
      </div>
      <ProducerList onEdit={handleEdit} />
    </div>
  );
}
