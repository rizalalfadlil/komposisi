"use client";
import { getAllData, saveAllData } from "@/backend/komposisi";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([
    {
      id: "1",
      produk: "platinum",
      komposisi: {
        admin: [1, 1, 4],
        ff: [2, 3, 5],
      },
    },
    {
      id: "2",
      produk: "gold",
      komposisi: {
        admin: [3, 6, 9],
        ff: [9, 7, 10],
      },
    },
    {
      id: "3",
      produk: "plus",
      komposisi: {
        admin: [2, 6, 11],
        ff: [4, 9, 15],
      },
    },
  ]);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const res = await getAllData();
    setData(res);
  };

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editField, setEditField] = useState<{
    produk: string;
    admin: number[];
    ff: number[];
  } | null>(null);
  const handleEditClick = (index: number) => {
    if (editIndex === null) {
      setEditIndex(index);
      setEditField({
        produk: data[index].produk,
        admin: [...data[index].komposisi.admin],
        ff: [...data[index].komposisi.ff],
      });
    } else {
      alert("simpan terlebih dahulu");
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    idx: number
  ) => {
    if (editField) {
      const updatedField = { ...editField };
      if (field === "produk") {
        updatedField.produk = e.target.value;
      } else if (field === "admin") {
        updatedField.admin[idx] = parseInt(e.target.value) || 0;
      } else if (field === "ff") {
        updatedField.ff[idx] = parseInt(e.target.value) || 0;
      }
      setEditField(updatedField);
    }
  };

  const handleSave = async () => {
    if (editIndex !== null && editField) {
      const updatedData = [...data];
      updatedData[editIndex] = {
        id: data[editIndex].id,
        produk: editField.produk,
        komposisi: {
          admin: editField.admin,
          ff: editField.ff,
        },
      };
      setData(updatedData);
      await saveAllData(updatedData);
      getData();
      setEditIndex(null);
      console.log("Data tersimpan:", updatedData);
    }
  };

  // Menentukan apakah tombol save harus disabled
  const isSaveDisabled =
    !editField ||
    !editField.produk ||
    editField.admin.some((value) => value === 0) ||
    editField.ff.some((value) => value === 0) ||
    editIndex === null;

  return (
    <div className="p-4">
      <p className="text-2xl w-full mb-4 font-bold">Biaya Komposisi</p>
      <div className="w-full min-w-80 flex justify-end items-center gap-4 mb-4">
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="p-2 px-8 disabled:bg-neutral-800 rounded bg-blue-800 text-white"
        >
          Save
        </button>
        {editIndex !== null && (
          <button
            onClick={() => setEditIndex(null)}
            className="p-2 px-8 bg-neutral-800 rounded text-white"
          >
            Cancel
          </button>
        )}
      </div>
      <table className="w-full min-w-80">
        <thead>
          <tr>
            <th className="border p-4" rowSpan={3}>
              no
            </th>
            <th className="border p-4" rowSpan={3}>
              produk
            </th>
            <th className="border p-4" rowSpan={3}>
              komposisi
            </th>
            <th className="border p-4" colSpan={3}>
              usia
            </th>
          </tr>
          <tr>
            <th className="border p-4">17</th>
            <th className="border p-4">40</th>
            <th className="border p-4">70</th>
          </tr>
          <tr>
            <th className="border p-4">36</th>
            <th className="border p-4">48</th>
            <th className="border p-4">72</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((d, i) => (
            <React.Fragment key={i}>
              <tr>
                <td rowSpan={2} className="border p-4">
                  {i + 1}
                </td>
                <td rowSpan={2} className="border p-4">
                  {editIndex === i ? (
                    <input
                      value={editField?.produk || ""}
                      onChange={(e) => handleInputChange(e, "produk", 0)}
                      className="text-center w-full "
                    />
                  ) : (
                    <span
                      onClick={() => handleEditClick(i)}
                      className="cursor-pointer hover:bg-neutral-800"
                    >
                      {d.produk}
                    </span>
                  )}
                </td>
                <td className="border p-4">biaya admin</td>
                {d.komposisi.admin.map((value, idx) => (
                  <td key={idx} className="border text-center p-4">
                    {editIndex === i ? (
                      <input
                        type="number"
                        value={editField?.admin[idx] || 0}
                        onChange={(e) => handleInputChange(e, "admin", idx)}
                        className=" text-center w-full"
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:bg-neutral-800"
                        onClick={() => !editIndex && handleEditClick(i)}
                      >
                        {value}%
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-4">biaya ff</td>
                {d.komposisi.ff.map((value, idx) => (
                  <td key={idx} className="border text-center p-4">
                    {editIndex === i ? (
                      <input
                        type="number"
                        value={editField?.ff[idx] || 0}
                        onChange={(e) => handleInputChange(e, "ff", idx)}
                        className=" text-center w-full"
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:bg-neutral-800"
                        onClick={() => handleEditClick(i)}
                      >
                        {value}%
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
