import { useState } from "react";
import type { Producer } from "../types/Producer";

type Props = {
  onSubmit: (data: Producer) => void;
  initialData?: Producer;
};

export default function ProducerForm({ onSubmit, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ _id: initialData?._id, name, email, phone });
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? "Editar Productor" : "Crear Productor"}</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <br />
      <button type="submit">{initialData ? "Guardar" : "Crear"}</button>
    </form>
  );
}