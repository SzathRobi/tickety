function SuccessPopup({ msg, success = true }) {
  return (
    <div
      className={`${
        success ? "bg-emerald-500" : "bg-rose-600"
      } text-white fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 p-8 rounded shadow-xl shadow-slate-600 z-30`}
    >
      <p>{msg}</p>
    </div>
  );
}

export default SuccessPopup;
