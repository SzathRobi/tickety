function Modal({ children, isOpen = false, updateIsOpen = null }) {
  return (
    <section
      className={`${
        isOpen ? "block" : "hidden"
      } flex items-center justify-center p-4 fixed inset-0 w-full h-screen bg-stone-800/70`}
    >
      <button
        onClick={() => updateIsOpen()}
        className="transition-colors w-14 h-14 text-center rounded-full absolute top-4 right-4 font-medium text-4xl text-white bg-teal-600 hover:bg-teal-800 active:bg-teal-900"
      >
        X
      </button>
      {children}
    </section>
  );
}

export default Modal;
