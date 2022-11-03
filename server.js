const App = require("./App.js")
const PORT = process.env.PORT || 9000;
App.listen(PORT, () => console.log("Server running on port "+PORT));
