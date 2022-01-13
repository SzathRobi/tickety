import { formatDate } from "../../utilities/formatDate";

function TicketTable({ tableHeaders, tableDatas, onClick = null }) {
  //console.log(tableDatas);
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="text-left">
          {tableHeaders.map((header) => (
            <th key={header} className="font-medium p-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableDatas.length !== 0 ? (
          tableDatas.map((datas) => (
            <tr
              key={datas._id}
              onClick={onClick ? () => onClick(datas) : null}
              className={`p-2 border-b-2 border-gray-400 transition-colors ${
                onClick && "cursor-pointer hover:bg-gray-200"
              }`}
            >
              {Object.entries(datas)
                .filter(
                  (data) =>
                    data[0] !== "_id" &&
                    data[0] !== "url" &&
                    data[0] !== "fileType"
                )
                .map((data) => (
                  <td key={data[0]} className="py-2 max-w-xs">
                    {data[0] === "created_at"
                      ? //modify here to work
                        formatDate(data[1])
                      : Array.isArray(data[1]) && data[1].length > 1
                      ? data[1].map((subData) => <p key={subData}>{subData}</p>)
                      : data[1]}
                  </td>
                ))}
            </tr>
          ))
        ) : (
          <tr>
            <td></td>
            <td></td>
            <td>Currently No Data</td>
            <td></td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TicketTable;
