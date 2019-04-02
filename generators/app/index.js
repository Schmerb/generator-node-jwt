"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag

    this.argument("appname", { type: String, required: false });
  }

  // 1)
  initializing() {
    this.log(`${chalk.red("initializing!")}`);
  }

  // 2)
  async prompting() {
    this.log(`${chalk.blue("prompting!")}`);
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the primo ${chalk.red("generator-node-jwt")} generator!`
      )
    );

    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.options.appname // Defaults to optional argument
      },
      {
        type: "input",
        name: "port",
        message: `Port server will run on`,
        default: "8080"
      },
      {
        type: "input",
        name: "databaseURI",
        message:
          "Your project's PRODUCTION MongoDB instance URI (If you have one)",
        default: "mongodb://localhost/CREATE-ME-db"
      },
      {
        type: "input",
        name: "testDatabaseURI",
        message: "Your project's TEST MongoDB instance URI (If you have one)",
        default: "mongodb://localhost/test-db"
      },
      {
        type: "input",
        name: "jwtSecret",
        message: 'Provide string to use as JWT "secret"',
        default: "secret"
      },
      {
        type: "input",
        name: "jwtExpiray",
        message: `Provide a valid JWT expiration duration`,
        default: "7d"
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
    this.log("app name: ", this.answers.name);
    this.log("cool feature: ", this.answers.cool);
  }

  // 3)
  configuring() {
    this.log(`${chalk.yellow("configuring!")}`);
  }

  // // // // // // // // // // // // // // //
  // Default -- cusom methods run here
  // 4)
  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }
  //
  // // // // // // // // // // // // // // //

  // 5)
  writing() {
    this.log(`${chalk.green("writing!")}`);

    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      {
        name: this.answers.name
      }
    );

    this.fs.copy(
      this.templatePath("_.babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copy(
      this.templatePath("_.gitignore"),
      this.destinationPath(".gitignore")
    );
    this.fs.copy(
      this.templatePath("_README.md"),
      this.destinationPath("README.md")
    );
    this.fs.copyTpl(this.templatePath("_.env"), this.destinationPath(".env"), {
      databaseURI: this.answers.databaseURI,
      testDatabaseURI: this.answers.testDatabaseURI,
      port: this.answers.port,
      jwtSecret: this.answers.jwtSecret,
      jwtExpiray: this.answers.jwtExpiray
    });

    // Server.js
    this.fs.copy(
      this.templatePath("_server.js"),
      this.destinationPath("server.js")
    );

    // Write entire /src directory
    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));
  }

  // 6)
  conflicts() {
    this.log(`${chalk.red("Checking for confilcts!")}`);
  }

  // 7)
  install() {
    this.log(`${chalk.green("install!")}`);
    // Install via package.json file --> this.installDependencies();
    this.npmInstall(
      ["gulp", "nodemon", "@babel/core", "@babel/node", "@babel/preset-env"],
      {
        "save-dev": true
      }
    );

    this.npmInstall(
      [
        "bcryptjs",
        "body-parser",
        "busboy-body-parser",
        "cors",
        "dotenv",
        "express",
        "express-jwt",
        "mongoose",
        "morgan",
        "passport",
        "passport-http",
        "passport-jwt"
      ],
      {
        "save-dev": false
      }
    );
  }

  // 8)
  end() {
    this.log(yosay(`${chalk.green("ALL DONE SON!")}`));
    this.log(
      `${chalk.green(`Starting ${this.answers.name}..`)}${chalk.blue(
        ".."
      )}${chalk.red("..")}${chalk.yellow("..")}${chalk.green("..")}`
    );
    this.spawnCommand("npm", ["start"]);
  }
};
