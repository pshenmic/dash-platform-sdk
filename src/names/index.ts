import search from "./search";

export class NamesController {
    search(name: string) {
        return search(name)
    }
}
