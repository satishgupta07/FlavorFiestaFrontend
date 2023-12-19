import { toast } from "react-toastify";

const notify = (prompt) =>
  toast.success(prompt, {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

export {notify}
