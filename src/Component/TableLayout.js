/** @format */

import React from "react";
import { Alert, Table } from "react-bootstrap";
import FullScreenLoader from "./FullScreenLoader";

const TableLayout = ({ thead, tbody, loading }) => {
  return (
    <>
      {loading && <FullScreenLoader />}
      {tbody ? (
        <div className="overFlowCont">
          <Table>
            <thead>
              <tr>
                {thead?.map((i, index) => (
                  <th key={`thead${index}`}> {i} </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbody?.map((rowData, rowIndex) => (
                <tr key={`row${rowIndex}`}>
                  {rowData?.map((cellData, cellIndex) => (
                    <td key={`cell${cellIndex}`}>{cellData}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert>No data found</Alert>
      )}
    </>
  );
};

export default TableLayout;
