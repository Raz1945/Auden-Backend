const alreadyAdded = (id) => {
  const errores = [];

  if (id.includes(id)) {
    errores.push("Completado debe de ser 'true' o 'false'.");
  }

  return errores
};
