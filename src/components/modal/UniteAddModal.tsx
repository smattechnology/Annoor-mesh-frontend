import React, { useState } from "react";
import Modal from "./Modal";
import api from "@/utils/api";
import { Unit } from "@/types";

interface UniteAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  selectedUnites: { [unit_id: string]: { unite: Unit; price: number } };
  setSelectedUnites: React.Dispatch<
    React.SetStateAction<{ [unit_id: string]: { unite: Unit; price: number } }>
  >;
}

const UniteAddModal: React.FC<UniteAddModalProps> = ({
  open,
  onClose,
  onSuccess,
  units,
  selectedUnites,
  setSelectedUnites,
}) => {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [newUniteShow, setNewUniteShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (price > 0) {
      if (newUniteShow && label.trim() && emoji.trim()) {
        const payload = {
          label: label.trim(),
          icon: emoji.trim(),
        };

        try {
          const res = await api.post("/product/add/unite", payload);
          if (res.status === 201) {
            const data: Unit = res.data;
            const prev = { ...selectedUnites };

            prev[data.id] = {
              unite: data,
              price: price,
            };
            setSelectedUnites(prev);
            handleClose();
          }
        } catch (err: any) {
          console.error(err.response?.data?.message || "Error adding unit");
        }
      } else {
        if (selectedUnit) {
          const prev = { ...selectedUnites };

          prev[selectedUnit] = {
            unite: units.find((u) => u.id === selectedUnit) as Unit,
            price: price,
          };
          setSelectedUnites(prev);
          handleClose();
        }
      }
    }
  };

  const handleClose = () => {
    setLabel("");
    setEmoji("");
    setPrice(0);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      title="Add New Unit"
      header
    >
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {newUniteShow ? (
          <div className="flex flex-col gap-3">
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Unit Name (e.g. kg, liter)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Unit Emoji (e.g. ⚖️)"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </div>
        ) : (
          <select
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="" disabled>
              Select an existing unit
            </option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.icon} {unit.label}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setNewUniteShow(!newUniteShow)}
        >
          {newUniteShow ? "Use Existing Unit" : "Add New Unit"}
        </button>

        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          type="number"
          placeholder="Price"
          value={price > 0 ? price : ""}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
            onClick={handleSubmit}
          >
            Add Unit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UniteAddModal;
