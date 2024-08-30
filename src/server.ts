import app from "./app";

app.listen({ port: 4000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
