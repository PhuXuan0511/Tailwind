type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type ToolTableProps = {
  tools: Array<Tool>;
  title: string;
};

export function ToolTable({ tools, title }: ToolTableProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">URL</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id}>
                <td className="border border-gray-300 px-4 py-2">{tool.title}</td>
                <td className="border border-gray-300 px-4 py-2">{tool.description}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {tool.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
