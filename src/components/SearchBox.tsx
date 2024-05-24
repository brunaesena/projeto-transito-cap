import axios from "axios"
import { useEffect, useState } from "react";


interface Suggestion {
    text: string;
  }
  
export const SerachBox = () => {

    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    // const apiKey = process.env.API_KEY;

    const app = axios;
    const body = {
        input: inputValue.toString()
    }
    const headers = {
        'X-Goog-Api-Key': 'AIzaSyCLcwHTpc-ANeWqPy3eOZjWH9zsDynlLbQ',
        'Content-Type': 'application/json'
    };

    useEffect(() => {
      const funtionCallApiSuggestion = async () => {
        try {
            const response = await app.post("https://places.googleapis.com/v1/places:autocomplete", body, {headers})
            const suggestionsFromApi: Suggestion[] = response.data.suggestions.map((suggestion: any) => suggestion.placePrediction.text);
            setSuggestions(suggestionsFromApi);
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
      }
      // Verifica se há texto no input antes de fazer a chamada à API
    if (inputValue.trim() !== '') {
        funtionCallApiSuggestion();
      } else {
        setSuggestions([]); // Limpa as sugestões se o campo estiver vazio
      }
    }, [inputValue]);
    console.log('SUGGESTAO', suggestions)

    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setSuggestions([]); // Limpa as sugestões após a seleção
    };

    const handleBlur = () => {
      setSuggestions([])
    }

    return (
        <div>
          <input
          type="text"
          id = "search-input"
          placeholder="Digite o endereço do local reportado"
          className="w-full mb-5 p-2 rounded"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          />
        <ul className="bg-gray-100 text-gray-800">
          {suggestions.map((suggestion, index) => (
            <li 
            key={index} 
            onBlur={handleBlur} 
            onClick={() => handleSuggestionClick(suggestion.text)}
            className="p-2 border-b border-gray-300 hover:bg-gray-200 cursor-pointer">
              {suggestion.text}
            </li>
          ))}
        </ul>
      </div>
      );
    };
    