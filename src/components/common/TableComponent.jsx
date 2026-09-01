const TableComponent = ({
  columns,
  data,
  actions,
  actionLabel,
  headerBg,
  onClick,
  checkLabel,
  check,
  loading,
}) => {
  return (
    <table className="w-full bg-white">
      <thead className={`h-12 ${headerBg}`}>
        <tr>
          {check && (
            <th
              className={`font-semibold w-10 border-b border-t border-[#d3cccc] text-sm xl:text-base`}
            >
              {checkLabel}
            </th>
          )}
          {columns.map((col, index) => (
            <th key={index} className={`font-semibold text-sm xl:text-base ${col.headerClassName}`}>
              {col.label}
            </th>
          ))}
          {actions && <th className={`font-semibold text-sm xl:text-base`}>{actionLabel}</th>}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <tr
              key={i}
              className="animate-pulse h-12 border-b border-[#d3cccc]"
            >
              {check && (
                <td className="">
                  <div className="bg-gray-200 h-4 w-4 rounded-[4px] mx-auto"></div>
                </td>
              )}
              {columns.map((_, index) => (
                <td key={index} className="px-2">
                  <div className="bg-gray-200 h-4 w-full "></div>
                </td>
              ))}
              {actions && (
                <td className="">
                  <div className="bg-gray-200 h-4 w-10 "></div>
                </td>
              )}
            </tr>
          ))
        ) : data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={(e) => {
                if (e.target.type !== "checkbox" && onClick) {
                  onClick(item);
                }
              }}
              className="w-full border-b border-[#d3cccc] text-xs md:text-base h-12 cursor-pointer hover:bg-[#f6eeee]"
            >
              {check && <td>{check ? check(item, rowIndex) : null}</td>}
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`${col.className}`}>
                  {col.render ? col.render(item, rowIndex) : item[col.field]}
                </td>
              ))}
              {actions && <td>{actions ? actions(item, rowIndex) : null}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length + (actions ? 1 : 0) + (check ? 1 : 0)}
              className="text-center py-2 border border-[#d3cccc]"
            >
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableComponent;
