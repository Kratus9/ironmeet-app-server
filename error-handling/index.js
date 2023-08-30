module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    
    //* Este 401 viene de la libreria jwt cuando el token no es valido. Si esto ocurre, le indicamos a nuestro FE que el error es de ese tipo.
    if (err.status === 401) {
      res.status(401).json({ errorMessage: "Token no existe o no valido" })
      return;
    }
    
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          message: "Internal server error. Check the server console",
        });
    }
  });
};
