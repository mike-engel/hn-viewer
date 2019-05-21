export const formatDate = (time: number) => {
  const date = new Date(time * 1000);
  const formatter = new Intl.DateTimeFormat("default", {
    month: "short",
    year: "numeric",
    day: "numeric"
  });

  return formatter.format(date);
};
