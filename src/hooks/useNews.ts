// src/hooks/useNews.ts
import { useState, useEffect } from "react";
import { fetchNews } from "../services/newsService";
import { NewsFeed } from "../utils/types";

const useNews = (searchParams: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NewsFeed | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("searchParams", searchParams);
      try {
        const data: NewsFeed = await fetchNews(searchParams);

        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "An error occurred with the API or we exceeded API daily limit"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return { loading, error, data };
};

export default useNews;
