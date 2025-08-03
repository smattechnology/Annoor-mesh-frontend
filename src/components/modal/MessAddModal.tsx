import React, { useState } from "react";

interface MessOwner {
  name: string;
  contact: string;
  email: string;
}

interface MessAddress {
  street: string;
  area: string;
  city: string;
  postalCode: string;
  country: string;
}

interface MessContact {
  phone: string;
  email: string;
  facebook?: string;
  website?: string;
}

interface MealTiming {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface MessInfo {
  name: string;
  established: string;
  type: string;
  owner: MessOwner;
  address: MessAddress;
  contact: MessContact;
  capacity: number;
  mealTiming: MealTiming;
  offDays: string[];
  notes: string;
}

interface MessAddModalProps {
  open: boolean;
  onClose: () => void;
}

const MessAddModal: React.FC<MessAddModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<MessInfo>({
    name: "",
    established: "",
    type: "",
    owner: { name: "", contact: "", email: "" },
    address: { street: "", area: "", city: "", postalCode: "", country: "" },
    contact: { phone: "", email: "", facebook: "", website: "" },
    capacity: 0,
    mealTiming: { breakfast: "", lunch: "", dinner: "" },
    offDays: [],
    notes: "",
  });

  // Handle simple input changes (for nested objects, update carefully)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    section?: keyof MessInfo,
    subsection?: string
  ) => {
    const { name, value } = e.target;

    if (section && subsection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: value,
        },
      }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // OffDays input as comma-separated string (convert to array on submit)
  const [offDaysStr, setOffDaysStr] = useState("");

  const handleOffDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOffDaysStr(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offDaysArray = offDaysStr
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    onSubmit({ ...formData, offDays: offDaysArray });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Add / Edit Mess Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block font-medium mb-1" htmlFor="name">
              Mess Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Mess Name"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="established">
              Established Date
            </label>
            <input
              type="date"
              id="established"
              name="established"
              value={formData.established}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              <option value="Boys Mess">Boys Mess</option>
              <option value="Girls Mess">Girls Mess</option>
              <option value="Co-ed Mess">Co-ed Mess</option>
            </select>
          </div>

          {/* Owner Info */}
          <fieldset className="border p-4 rounded space-y-4">
            <legend className="font-semibold">Owner Information</legend>
            <div>
              <label className="block font-medium mb-1" htmlFor="ownerName">
                Name
              </label>
              <input
                id="ownerName"
                name="ownerName"
                value={formData.owner.name}
                onChange={(e) => handleChange(e, "owner", "name")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="ownerContact">
                Contact
              </label>
              <input
                id="ownerContact"
                name="ownerContact"
                value={formData.owner.contact}
                onChange={(e) => handleChange(e, "owner", "contact")}
                className="w-full border rounded px-3 py-2"
                placeholder="+8801XXXXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="ownerEmail">
                Email
              </label>
              <input
                type="email"
                id="ownerEmail"
                name="ownerEmail"
                value={formData.owner.email}
                onChange={(e) => handleChange(e, "owner", "email")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="border p-4 rounded space-y-4">
            <legend className="font-semibold">Address</legend>
            <div>
              <label className="block font-medium mb-1" htmlFor="street">
                Street
              </label>
              <input
                id="street"
                name="street"
                value={formData.address.street}
                onChange={(e) => handleChange(e, "address", "street")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="area">
                Area
              </label>
              <input
                id="area"
                name="area"
                value={formData.address.area}
                onChange={(e) => handleChange(e, "address", "area")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                value={formData.address.city}
                onChange={(e) => handleChange(e, "address", "city")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={(e) => handleChange(e, "address", "postalCode")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                name="country"
                value={formData.address.country}
                onChange={(e) => handleChange(e, "address", "country")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset className="border p-4 rounded space-y-4">
            <legend className="font-semibold">Contact</legend>
            <div>
              <label className="block font-medium mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.contact.phone}
                onChange={(e) => handleChange(e, "contact", "phone")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="contactEmail">
                Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contact.email}
                onChange={(e) => handleChange(e, "contact", "email")}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="facebook">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                value={formData.contact.facebook}
                onChange={(e) => handleChange(e, "contact", "facebook")}
                className="w-full border rounded px-3 py-2"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="website">
                Website URL
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.contact.website}
                onChange={(e) => handleChange(e, "contact", "website")}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com"
              />
            </div>
          </fieldset>

          {/* Capacity */}
          <div>
            <label className="block font-medium mb-1" htmlFor="capacity">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min={0}
              required
            />
          </div>

          {/* Meal Timings */}
          <fieldset className="border p-4 rounded space-y-4">
            <legend className="font-semibold">Meal Timings</legend>
            <div>
              <label className="block font-medium mb-1" htmlFor="breakfast">
                Breakfast
              </label>
              <input
                id="breakfast"
                name="breakfast"
                value={formData.mealTiming.breakfast}
                onChange={(e) => handleChange(e, "mealTiming", "breakfast")}
                className="w-full border rounded px-3 py-2"
                placeholder="7:30 AM - 9:00 AM"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="lunch">
                Lunch
              </label>
              <input
                id="lunch"
                name="lunch"
                value={formData.mealTiming.lunch}
                onChange={(e) => handleChange(e, "mealTiming", "lunch")}
                className="w-full border rounded px-3 py-2"
                placeholder="1:00 PM - 2:30 PM"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="dinner">
                Dinner
              </label>
              <input
                id="dinner"
                name="dinner"
                value={formData.mealTiming.dinner}
                onChange={(e) => handleChange(e, "mealTiming", "dinner")}
                className="w-full border rounded px-3 py-2"
                placeholder="8:00 PM - 9:30 PM"
                required
              />
            </div>
          </fieldset>

          {/* Off Days */}
          <div>
            <label className="block font-medium mb-1" htmlFor="offDays">
              Off Days (comma separated)
            </label>
            <input
              id="offDays"
              name="offDays"
              value={offDaysStr}
              onChange={handleOffDaysChange}
              placeholder="Friday, Saturday"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Additional information..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessAddModal;
