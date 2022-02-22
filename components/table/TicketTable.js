import { useEffect, useState } from "react";
import { formatDate } from "../../utilities/formatDate";
import { sortArr } from "../../utilities/sortArr";

function TicketTable({
  tableHeaders,
  tableDatas,
  onClick = null,
  sortOptions = [],
  dataSetter = () => {},
}) {
  const [sorter, setSorter] = useState("created_at");
  useEffect(() => {
    if (tableDatas) {
      dataSetter(sortArr(tableDatas, sorter));
    }
  }, [sorter, tableDatas]);
  return (
    <table className="w-full table-auto">
      <thead>
        {sortOptions.length !== 0 && (
          <tr>
            <td>
              <label>
                Sort by:
                <select>
                  {sortOptions.map((sortOption) => (
                    <option key={sortOption} value={sortOption}>
                      {sortOption.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </td>
          </tr>
        )}
        <tr className="text-left sticky top-0 bg-white">
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
            <td>
              {sortOptions.includes("modifier") ? (
                <strong>Currently Working on this </strong>
              ) : (
                "Currently No Data"
              )}
            </td>
            <td></td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TicketTable;
