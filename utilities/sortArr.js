export const sortArr = (arr = [], key = "email") => {
  const newArr = arr;
  if (key === "role")
    return newArr.sort((a, b) =>
      a.user_metadata.role.toUpperCase() > b.user_metadata.role.toUpperCase()
        ? 1
        : -1
    );
  return newArr.sort((a, b) =>
    a[key].toUpperCase() > b[key].toUpperCase() ? 1 : -1
  );
};
