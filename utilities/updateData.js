export const updateData = async (route, data) => {
  const res = await fetch(`/api/${route}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  return resData;
};
