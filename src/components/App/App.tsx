import css from "./App.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes({ search: debouncedSearch, page: currentPage }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox value={searchValue} onChange={setSearchValue} />}
        {}
        <button className={css.button}>Create note +</button>
      </header>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {data?.notes && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  );
}
