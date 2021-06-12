import * as fs from "fs";
import * as _ from "lodash";

const brackets = /\[.*\]/g;

export default class FmrlApiData {
    private classes!: FmrlTypeMap;

    constructor(private datapath: string) {
        this.loadData(datapath);
    }

    public findType(words: string[]) : FmrlType {
        if(words.length === 0) {
            return { properties: this.classes };
        }

        words = words.map(p => p.replace(brackets, ""));

        let type = this.classes[words.shift()!];

        if(!type) {
            return null as any;
        }

        if(!type.properties || words.length === 0)
        {
            return type;
        }

        let props = type.properties;

        for(let i = 0; i < words.length; i++) {
            type = props[words[i]];

            // Not found
            if (!type) {
                return null as any;
            }

            // First try traverse it's own properties
            if (type.properties) {
                props = type.properties;
                continue;
            }

            // Then the complete type list
            let parentType = type.type;

            type = this.classes[parentType!];

            if (type && type.properties) {
                props = type.properties;
                continue;
            }
        }

        return type;
    }

    private loadData(dataPath: string) {
        const classes = this.loadDataFile(dataPath + "/classes.json");
        this.classes = classes;
    }

    private loadDataFile(fileName: string): FmrlTypeMap {
        const jsonStr = fs.readFileSync(fileName, "utf8");
        const data = JSON.parse(jsonStr);
        return data;
    }
}
