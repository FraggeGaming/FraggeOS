import { SearchFs } from "./FileManager";
import { Node } from "./FileManager";
interface SearchProps {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setSearchResult: React.Dispatch<React.SetStateAction<Node[]>>; // only if used here
    node: Node; // if you need these inside

}

export function SearchBar({
    searchValue,
    setSearchValue,
    setSearchResult,
    node,
}: SearchProps) {
    const handleSearch = (e: { target: { value: any; }; }) => {
        const t = e.target.value;
        setSearchValue(t);
        if (t.length === 0) return
        console.log("This is the value in the serach: " + t)

        const q = t.trim();
        if (q.length === 0) {
            setSearchResult([]); // clear results when empty
            return;
        }

        const result = SearchFs(t, node);
        setSearchResult(result);

        console.log("search: " + result.at(0)?.label);
    }

    return (
        <div className="bg-gray-700 flex flex-1 items-center justify-center rounded p-1">
            <div className="flex items-center">
                <input type="text" placeholder="Search" onChange={handleSearch} value={searchValue} />
            </div>
        </div>
    );

}