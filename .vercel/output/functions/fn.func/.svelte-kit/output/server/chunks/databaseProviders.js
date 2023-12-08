const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter"
];
const databaseProviders = [
  {
    name: "PostgreSQL",
    client: "pg"
  },
  {
    name: "MySQL",
    client: "mysql"
  },
  {
    name: "MSSQL / SQL Server",
    client: "mssql"
  },
  {
    name: "SQLite",
    client: "sqlite3"
  },
  {
    name: "Better-SQLite",
    client: "better-sqlite3"
  },
  {
    name: "Oracle DB",
    client: "oracledb"
  }
];
export {
  databaseProviders as d,
  themes as t
};
