import React from "react";

function Ticket() {
  return (
    <section>
      <h1>Ticket yeeeee</h1>
      <h1>Ticket yeeeee</h1>
      <h1>Ticket yeeeee</h1>
      <h1>Ticket yeeeee</h1>
    </section>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.ticket[1];
  console.log("id:", id);

  return {
    props: {},
  };
}

export default Ticket;
