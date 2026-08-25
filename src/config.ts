import path from "path";
import os from "os";
import fs from "fs";

interface Config {
    dbUrl: string;
    currentUserName?: string;
}

export function setUser(username: string): void {
    let config = readConfig()
    config.currentUserName = username;
    writeConfig(config)
};

export function readConfig(): Config {
    let readFile = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8"});
    let parsed = JSON.parse(readFile);
    let properConfig = validateConfig(parsed);
    return properConfig;
};

function  getConfigFilePath(): string {
    const fullPath = path.join(os.homedir(), ".gatorconfig.json");
    return fullPath;
}
function writeConfig(cfg: Config): void {
    let jsonReady = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    let stringify = JSON.stringify(jsonReady);
    fs.writeFileSync(getConfigFilePath(), stringify);
}
 function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url) {
        throw new Error("Required field 'db_url' not found.")
    };
    let validConfig = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    }
    return validConfig;
}