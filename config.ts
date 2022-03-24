import config from 'dotenv';
config.config();

export = {
  MONGODB_URI: "mongodb://147.182.239.233/empresas", //147.182.239.233 http://147.182.239.233/
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "somesecretkey",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1y",
};
