import { FoodSelectionPage } from "../components/FoodSelectionPage";

export default function Page() {
  return (
    <div className="">
      <FoodSelectionPage />
      <div className="mt-4"></div>
      <label htmlFor="note" className="block text-sm font-medium text-gray-700">
        Note
      </label>
      <input
        type="text"
        id="note"
        name="note"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Add a note..."
      />
    </div>
  );
}
