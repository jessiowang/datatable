import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DataTable from "./components/data-table/DataTable";

const colNames = [
  { field: "name", header: "Name" },
  { field: "device", header: "Device" },
  { field: "path", header: "Path" },
  { field: "status", header: "Status" },
];

function App() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios
      .get("api/devices")
      .then((res) => {
        const devicesList = res.data.devices;
        setDevices(
          devicesList.map((d) => {
            return {
              id: uuidv4(),
              name: d.name,
              device: d.device,
              path: d.path,
              status: d.status,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <DataTable
        data={devices}
        downloadFilename="Selected_Devices_With_Status_Available.csv"
        columns={colNames}
        downloadAttr={{ attribute: "status", value: "available" }}
        hover={true}
      />
    </>
  );
}

export default App;
