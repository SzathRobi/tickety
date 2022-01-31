export const ticketStatusData = {
  labels: ["New", "Open", "In Progress", "Resolved", "Need Extra Info"],
  datasets: [
    {
      label: "# Tickets By Status",
      data: [
        newTickets.length,
        openTickets.length,
        inProgressTickets.length,
        resolvedTickets.length,
        needMoreInfoTickets.length,
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
