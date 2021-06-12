import vscode = require("vscode");
import FmrlApiData from "./FmrlApiData";
import { FmrlAutocomplete } from "./FmrlAutoComplete";
import { FmrlHover } from "./FmrlHover";

const LUA_MODE = { language: "lua", scheme: "file" };

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	let dataPath = context.asAbsolutePath("./data");
    const fmrlApiData = new FmrlApiData(dataPath);

    // register for autocomplete feature
    context.subscriptions.push (
        vscode.languages.registerCompletionItemProvider (
            LUA_MODE,
            new FmrlAutocomplete(fmrlApiData),
            '.'
        )
    );

    // register for the hover feature
    context.subscriptions.push (
        vscode.languages.registerHoverProvider (
            LUA_MODE,
            new FmrlHover(fmrlApiData)
        )
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
