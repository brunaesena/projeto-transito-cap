import axios from "axios"
import { useEffect, useState } from "react";

interface Suggestion {
    text: string;
  }
  
export const SerachBox = () => {

    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
            console.log('CHAMO API')
            const response = await app.post("https://places.googleapis.com/v1/places:autocomplete", body, {headers})
            const suggestionsFromApi: Suggestion[] = response.data.suggestions.map((suggestion: any) => suggestion.placePrediction.text);
            setSuggestions(suggestionsFromApi);
        } catch (error) {
            console.log('DEU MERDA')
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
    return (
        <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite aqui..."
        />
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion.text}</li>
          ))}
        </ul>
      </div>
      );
    };
    