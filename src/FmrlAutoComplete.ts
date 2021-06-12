"use strict";

import vscode = require('vscode');
import FmrlApiData from "./FmrlApiData";
import { getLastMatch, keys, assign } from "./utils";

const wordsRegex = /([\w\[\]]+\.[\w\[\]\.]*)/g;

export class FmrlAutocomplete implements vscode.CompletionItemProvider {
    constructor(private apiData: FmrlApiData) { }

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);

            let match = getLastMatch(wordsRegex, lineTillCurrentPosition);
            let line = match ? match[1] : "";

            let words = line.split(".");
            words.pop();

            let type = this.apiData.findType(words);

            if (!type || !type.properties) {
                return reject();
            }

            let suggestions = this.toCompletionItems(type.properties);
            return resolve(suggestions);
        });
    }

    private toCompletionItems(types: FmrlTypeMap): vscode.CompletionItem[] {
        return keys(types).map(key => this.toCompletionItem(types[key], <string>key));
    }

    private toCompletionItem(type: FmrlType, key: string): vscode.CompletionItem {
        const { doc, name, mode } = type;

        let completionItem = assign(new vscode.CompletionItem(key), {
            detail: type.type,
            documentation: new vscode.MarkdownString([doc, mode].filter(Boolean).join("\n\n")),
            kind: vscode.CompletionItemKind.Property
        });

        if (type.type === "function") {
            assign(completionItem, {
                detail: name,
                kind: vscode.CompletionItemKind.Function
            });
        };

        return completionItem;
    }
}