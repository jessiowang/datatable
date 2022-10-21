import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button } from "grommet";
import { Download } from "grommet-icons";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import Notification from "../notification/Notification";
import "./dataTable.css";

function DataTable({ data, columns, hover, downloadAttr, downloadFilename }) {
  const [tableContent, setTableContent] = useState([]);
  const [selectedNum, setSelectedNum] = useState(0);
  const [downloadItem, setDownloadItem] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const checkboxRef = useRef();

  const getCaps = (head, field) => {
    if (head) return head.toUpperCase();
    return field.toUpperCase();
  };

  const capitalizeFirstLetter = (col, string) => {
    if (col.field === "status") {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  };

  useEffect(() => {
    setTableContent(data);
  }, [data]);

  useEffect(() => {
    if (selectedNum > 0 && selectedNum < tableContent.length) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [selectedNum, tableContent.length]);

  const handleDownload = () => {
    let tempDownloadItem = [];
    tableContent.forEach((item) => {
      if (item.isChecked) tempDownloadItem.push(item);
    });

    const result = tempDownloadItem.filter(
      (item) =>
        item.isChecked === true &&
        item[downloadAttr.attribute] === downloadAttr.value
    );
    setDownloadItem(result);
    setIsOpen(true);
  };

  const csvReport = {
    data: downloadItem,
    headers: columns.map((item) => item.field),
    filename: downloadFilename,
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempData = data.map((item) => {
        return { ...item, isChecked: checked };
      });
      setTableContent(tempData);
      if (checked) {
        setSelectedNum(data.length);
      } else {
        setSelectedNum(0);
      }
    } else {
      let tempData = tableContent.map((item) =>
        item.id === name ? { ...item, isChecked: checked } : item
      );
      setTableContent(tempData);
      tableContent.forEach((item) => {
        if (name === item.id) {
          if (checked) {
            setSelectedNum(selectedNum + 1);
          } else {
            setSelectedNum(selectedNum - 1);
          }
        }
      });
    }
  };
  return (
    <>
      {isOpen && downloadItem.length > 0 ? (
        <Notification
          toast={{ position: "bottom", autoClose: true }}
          onClose={() => setIsOpen(false)}
          status="normal"
          title="Download Devices with Available Status"
          message={downloadItem.map((item) => {
            return (
              <Box margin="small">
                <Text>{`Device Name: ${item.name} Path is: ${item.path}`}</Text>
              </Box>
            );
          })}
        />
      ) : null}

      <Box direction="row" gap="small" pad={{ left: "small" }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          name="allSelect"
          checked={tableContent.every((item) => item?.isChecked === true)}
          onChange={handleChange}
        />
        <Box margin="small">
          {selectedNum === 0 ? (
            <Text>None Selected</Text>
          ) : (
            <Text>Selected {selectedNum}</Text>
          )}
        </Box>
        {selectedNum > 0 ? (
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
        ) : null}
      </Box>
      <table>
        <thead>
          <tr>
            <th></th>
            {columns &&
              columns.map((head, index) => (
                <th key={index}>{getCaps(head.header, head.field)}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableContent &&
            tableContent.map((row) => (
              <tr
                key={row.id}
                className={`${hover && "hover"} ${
                  row.isChecked ? "selected" : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    name={row.id}
                    checked={row?.isChecked || false}
                    onChange={handleChange}
                  />
                </td>
                {columns.map((col, index1) => (
                  <td key={index1}>
                    {capitalizeFirstLetter(col, row[col.field])}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {data ? null : <Text>No Data To Show :</Text>}
    </>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  hover: PropTypes.bool,
  downloadAttr: PropTypes.object.isRequired,
  downloadFilename: PropTypes.string.isRequired,
};

DataTable.defaultProps = {
  data: [],
  columns: [],
  hover: false,
  downloadFilename: undefined,
  downloadAttr: {},
};
export default DataTable;
