import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API = "http://localhost:8000/items/";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API);
      setItems(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch items", "error");
    }
  };

  const handleAddOrUpdate = async () => {
    if (!form.title || !form.description) {
      return Swal.fire("Warning", "Please fill all fields", "warning");
    }

    try {
      if (editingId) {
        await axios.put(`${API}${editingId}`, form);
        Swal.fire("Updated!", "Item updated successfully", "success");
        setEditingId(null);
      } else {
        await axios.post(API, form);
        Swal.fire("Added!", "Item added successfully", "success");
      }
      setForm({ title: "", description: "" });
      fetchItems();
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}${id}`);
      Swal.fire("Deleted!", "Item deleted successfully", "success");
      fetchItems();
    } catch {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  const startEdit = (item) => {
    setForm({ title: item.title, description: item.description });
    setEditingId(item.id);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do CRUD App</h1>

      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="border p-2 flex-1 rounded"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">S.No</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Created At</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.title}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => startEdit(item)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
