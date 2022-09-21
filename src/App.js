import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./app.css";
import { Box, Button, Text, Notification, CheckBox } from "grommet";
import { Download } from "grommet-icons";
import { CSVLink } from "react-csv";

const colNames = ["name", "device", "path", "status"];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedNum, setSelectedNum] = useState(0);
  const [downloadItem, setDownloadItem] = useState([]);
  const [isAlert, setIsAlert] = useState(false);

  const csvReport = {
    data: downloadItem,
    headers: colNames,
    filename: "Selected_Devices_With_Status_Available.csv",
  };

  const handleDownload = () => {
    let tempDownloadItem = [];
    devices.forEach((data) => {
      if (data.select) tempDownloadItem.push(data);
    });

    const result = tempDownloadItem.filter(
      (data) => data.select === true && data.status === "Available"
    );
    setDownloadItem(result);
    setIsAlert(true);
  };

  const onClose = () => setIsAlert(false);

  useEffect(() => {
    axios
      .get("api/devices")
      .then((res) => {
        const devicesList = res.data.devices;
        setDevices(
          devicesList.map((d) => {
            return {
              id: uuidv4(),
              select: false,
              name: d.name,
              device: d.device,
              path: d.path,
              status: capitalizeFirstLetter(d.status),
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {isAlert && (
        <Box gap="xsmall">
          <Notification
            toast
            onClose={onClose}
            status="normal"
            title="Download Devices with Available Status"
            message={downloadItem.map((data) => {
              return `Device Name: ${data.name} and Path is: ${data.path}`;
            })}
          />
        </Box>
      )}
      <th>
        <Box direction="row" gap="small">
          <CheckBox
            checked={devices.length === selectedNum}
            indeterminate={selectedNum > 0 && devices.length > selectedNum}
            onChange={(e) => {
              let checked = e.target.checked;
              setDevices(
                devices.map((d) => {
                  d.select = checked;
                  if (checked) {
                    setSelectedNum(devices.length);
                  } else {
                    setSelectedNum(0);
                  }
                  return d;
                })
              );
            }}
          />
          <Box margin="small">
            {selectedNum === 0 ? (
              <Text>None Selected</Text>
            ) : (
              <Text>Selected {selectedNum}</Text>
            )}
          </Box>

          <Box align="center">
            <CSVLink {...csvReport}>
              <Button hoverIndicator="light-1" onClick={handleDownload} active>
                <Box pad="small" direction="row" align="center" gap="small">
                  <Download />
                  <Text>Download Selected</Text>
                </Box>
              </Button>
            </CSVLink>
          </Box>
        </Box>
      </th>
      <table>
        <thead>
          <tr></tr>
          <tr>
            <th></th>
            {colNames &&
              colNames.map((head, index) => (
                <th key={index}>{head.toUpperCase()}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {devices &&
            devices.map((row) => (
              <tr className={`${"hover"}`} key={row.id}>
                <th>
                  <input
                    type="checkbox"
                    checked={row.select}
                    onChange={(event) => {
                      let checked = event.target.checked;
                      setDevices(
                        devices.map((data) => {
                          if (row.id === data.id) {
                            data.select = checked;
                            if (checked) {
                              setSelectedNum(selectedNum + 1);
                            } else {
                              setSelectedNum(selectedNum - 1);
                            }
                          }
                          return data;
                        })
                      );
                    }}
                  />
                </th>
                {colNames.map((col, index1) => (
                  <td key={index1}>{row[col]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {devices ? null : <p>No Data to show</p>}
    </>
  );
}

export default App;
