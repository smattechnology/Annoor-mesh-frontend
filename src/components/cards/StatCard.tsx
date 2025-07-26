const StatCard = ({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) => {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p
        className={`text-sm mt-2 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change} from last month
      </p>
    </div>
  );
};

export default StatCard;
