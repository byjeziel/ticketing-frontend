import { useState } from "react";
import type { EventEntity, ScheduleItem } from "../types/Event";

type Props = {
  onSubmit: (data: EventEntity) => void;
  initialData?: EventEntity;
};

export default function EventForm({ onSubmit, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    initialData?.schedule ?? [{ date: "", time: "", tickets: 0 }]
  );

  const handleAddSchedule = () => {
    setSchedule([...schedule, { date: "", time: "", tickets: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, schedule });
    setTitle("");
    setDescription("");
    setSchedule([{ date: "", time: "", tickets: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? "Editar Evento" : "Crear Evento"}</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br/>
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      /><br/>

      {schedule.map((s, i) => (
        <div key={i}>
          <input
            type="date"
            value={s.date}
            onChange={(e) => {
              const copy = [...schedule];
              copy[i].date = e.target.value;
              setSchedule(copy);
            }}
          />
          <input
            type="time"
            value={s.time}
            onChange={(e) => {
              const copy = [...schedule];
              copy[i].time = e.target.value;
              setSchedule(copy);
            }}
          />
          <input
            type="number"
            value={s.tickets}
            onChange={(e) => {
              const copy = [...schedule];
              copy[i].tickets = Number(e.target.value);
              setSchedule(copy);
            }}
          />
        </div>
      ))}

      <button type="button" onClick={handleAddSchedule}>+ Fecha</button>
      <br />
      <button type="submit">{initialData ? "Guardar" : "Crear"}</button>
    </form>
  );
}