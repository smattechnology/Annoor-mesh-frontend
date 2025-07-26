import StatCard from "@/components/cards/StatCard";

const DashboardContent = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Users" value="1,234" change="+12%" />
        <StatCard title="Total Products" value="567" change="+5%" />
        <StatCard title="Revenue" value="$12,345" change="+23%" />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Recent Activity</h3>
        <p className="text-gray-500">Dashboard content will go here...</p>
      </div>
    </div>
  );
};

export default DashboardContent;
