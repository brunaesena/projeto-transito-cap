import { useState, useRef, useEffect, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { BrowserRouter } from "react-router-dom";
import { api } from "../services/api";
import Header from "./Header";
import axios from "axios";

interface DenunciasProps {
  id: string;
  titulo: string;
  descricao: string;
  local: string;
  dataCriacao: string;
  dataAtualizacao: string;
  ativa: boolean;
}

interface Suggestion {
  text: string;
}

export const Home = () => {
  const [denuncias, setDenuncias] = useState<DenunciasProps[]>([]);
  const tituloRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    carregarDenuncias();
  }, []);

  async function carregarDenuncias() {
    const response = await api.get("/denuncias");
    setDenuncias(response.data);
  }

  async function handleSubmitDenuncia(e: FormEvent) {
    e.preventDefault();

    if (
      !tituloRef.current?.value ||
      !descRef.current?.value ||
      !inputValue
    ) {
      console.log("ta faltando algum elemento");
      return;
    }

    const response = await api.post("/denuncia", {
      titulo: tituloRef.current?.value,
      descricao: descRef.current?.value,
      local: inputValue
    });
    console.log(inputValue)

    setDenuncias((listaDenuncias) => [...listaDenuncias, response.data]);

    tituloRef.current.value = "";
    descRef.current.value = "";
    setInputValue(""); 
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/denuncia", {
        params: {
          id: id,
        },
      });

      const listaDenuncias = denuncias.filter((denuncia) => denuncia.id !== id);
      setDenuncias(listaDenuncias);
    } catch (err) {
      console.log(err);
    }
  }

  const app = axios;
  const body = {
    input: inputValue.toString(),
  };
  const headers = {
    "X-Goog-Api-Key": "AIzaSyCLcwHTpc-ANeWqPy3eOZjWH9zsDynlLbQ",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const funtionCallApiSuggestion = async () => {
      try {
        const response = await app.post(
          "https://places.googleapis.com/v1/places:autocomplete",
          body,
          { headers }
        );
        const suggestionsFromApi: Suggestion[] = response.data.suggestions.map(
          (suggestion: any) => suggestion.placePrediction.text
        );
        setSuggestions(suggestionsFromApi);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    };
    // Verifica se há texto no input antes de fazer a chamada à API
    if (inputValue.trim() !== "") {
      funtionCallApiSuggestion();
    } else {
      setSuggestions([]); // Limpa as sugestões se o campo estiver vazio
    }
  }, [inputValue]);
  console.log("SUGGESTAO", suggestions);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]); 
  };

  const handleBlur = () => {
    setSuggestions([]);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2x1">
        <BrowserRouter>
          <Header />
        </BrowserRouter>
        <h1 className="text-4xl font-medium text-white">
          Denúncias - Rota Segura
        </h1>
        <form className="flex flex-col my-6" onSubmit={handleSubmitDenuncia}>
          <label className="font-medium text-white"> Título da denúncia</label>
          <input
            type="text"
            placeholder="Digite o título da denúncia"
            className="w-full mb-5 p-2 rounded"
            ref={tituloRef}
          />

          <label className="font-medium text-white"> Descrição</label>
          <input
            type="text"
            placeholder="Informe a descrição da denúncia"
            className="w-full mb-5 p-2 rounded"
            ref={descRef}
          />

          <label className="font-medium text-white"> Local</label>
          <input
            type="text"
            id="search-input"
            placeholder="Digite o endereço do local reportado"
            className="w-full mb-5 p-2 rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            
          />
          <ul className="bg-gray-100 text-gray-800">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion.text)} // Usar onMouseDown para selecionar sugestão antes do blur
                className="p-2 border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion.text}
              </li>
            ))}
          </ul>

          <input
            type="submit"
            value="Enviar denúncia"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>

        <section className="flex flex-col gap-4">
          {denuncias.map((denuncia) => (
            <article
              key={denuncia.id}
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
            >
              <p>
                <span className="font-medium">Denúncia: </span>{" "}
                {denuncia.titulo}
              </p>
              <p>
                <span className="font-medium">Descrição: </span>{" "}
                {denuncia.descricao}
              </p>
              <p>
                <span className="font-medium">Local: </span>{" "}
                {denuncia.local}
              </p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(denuncia.id)}
              >
                <FiTrash size={18} color="#FFFFFF" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};
