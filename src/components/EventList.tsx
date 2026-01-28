import { useEffect, useState } from "react";
import type { EventEntity } from "../types/Event";
import { getEvents, deleteEvent } from "../api/events";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  onEdit?: (event: EventEntity) => void;
};

export default function EventList({ onEdit }: Props) {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const loadEvents = async () => {
    const res = await getEvents();
    if (res && res.data) setEvents(res.data as unknown as EventEntity[]);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      await deleteEvent(id, token);
      loadEvents();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  return (
    <div className="p-4">
      <h2>Lista de eventos</h2>
      <ul>
        {events.map((ev) => (
          <li key={ev._id} style={{ marginBottom: 8 }}>
            <strong>{ev.title}</strong> — {ev.description}
            <button onClick={() => onEdit?.(ev)}>Editar</button>
            <button onClick={() => handleDelete(ev._id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}