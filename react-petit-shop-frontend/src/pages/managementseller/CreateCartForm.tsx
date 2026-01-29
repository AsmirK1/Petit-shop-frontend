import { useState } from "react";
import type { CartItem } from "./utilities/type";
import { categories } from "./utilities/categories";
type Props = {
  onSave: (cart: CartItem) => void;
  onCancel: () => void;
};

const cartCategories = categories;

export const CreateCartForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string>(""); // base64 string

  // Convert uploaded file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string); // save base64
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!title || !price || !category) return;

    onSave({
      id: crypto.randomUUID(),
      title,
      price: Number(price),
      category,
      image: image || undefined,
    });
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => { e.preventDefault(); handleSubmit(); }}
    >
      <h3 className="font-bold text-lg mb-2 text-primary">Create Cart Item</h3>

      <input
        className="input input-bordered w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        className="input input-bordered w-full"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
        required
        min={0}
        step={0.01}
      />

      <select
        className="select select-bordered mb-2 w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {cartCategories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        className="input input-bordered mb-2 w-full"
        onChange={handleFileChange}
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-20 h-20 object-cover mb-2 rounded"
        />
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-outline" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};
