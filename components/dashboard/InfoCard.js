import React from "react";

function InfoCard({ text, data }) {
  return (
    <div className="bg-white px-2 py-12 flex flex-col gap-4 justify-start items-center shadow-lg shadow-gray-500 rounded-md">
      <p className="text-xl">{text}</p>
      <p className="text-2xl">{data}</p>
    </div>
  );
}

export default InfoCard;
