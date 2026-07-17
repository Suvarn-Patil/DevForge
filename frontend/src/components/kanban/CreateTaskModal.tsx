import { useState } from "react";
import { createTask } from "../../services/taskService";

type Props = {
  onClose: () => void;
};

export default function CreateTaskModal({
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const handleCreate = async () => {
    try {
      await createTask(
        title,
        description,
        "6a594457fd65f3f925f8a234"
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">

        <h2 className="mb-4 text-2xl font-bold text-white">
          Create Task
        </h2>

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white"
        />

        <div className="flex gap-3">

          <button
            onClick={handleCreate}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-white"
          >
            Create
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-700 py-3 text-white"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}