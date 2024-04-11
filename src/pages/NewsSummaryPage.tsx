import { useState, useMemo } from "react";
import useNews from "../hooks/useNews";
import NewsSummary from "../components/NewsSummary";
import MultiSelectInput from "../components/MultiSelectInput";
import { FetchNewsParams, NewsArticle, NewsFeed } from "../utils/types";

import DateTimeRangePicker from "../components/DateTimeRangePicker"; // Adjust the import path as needed
import { APP_NAME, TICKER_OPTIONS, TOPIC_OPTIONS } from "../utils/constants";

// Placeholder values for tickers and topics
const NewsSummaryPage = () => {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([
    TICKER_OPTIONS[0],
  ]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    TOPIC_OPTIONS[0],
  ]);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [sort, setSort] = useState<"LATEST" | "EARLIEST" | "RELEVANCE">(
    "LATEST"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const itemsPerPage = 10;

  const searchParams = useMemo(() => {
    const params: FetchNewsParams = {
      function: "NEWS_SENTIMENT",
      tickers: selectedTickers.join(","),
      topics: selectedTopics.join(","),
      limit,
    };

    // Conditionally add optional parameters if they have values
    if (startDateTime) {
      params.time_from = startDateTime;
    }
    if (endDateTime) {
      params.time_to = endDateTime;
    }
    if (sort) {
      params.sort = sort;
    }

    return params;
  }, [
    selectedTickers,
    selectedTopics,
    startDateTime,
    endDateTime,
    sort,
    limit,
    currentPage,
  ]);

  const {
    loading,
    error,
    data,
  }: { loading: boolean; error: string | null; data: NewsFeed | null } =
    useNews(searchParams);

  const displayedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data && data?.feed?.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalNumberOfPages = Math.ceil(
    data?.feed?.length ? data.feed.length / itemsPerPage : 1
  );

  const handleDateTimeRangeChange = (
    startDateTime: string,
    endDateTime: string
  ) => {
    setStartDateTime(startDateTime);
    setEndDateTime(endDateTime);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1); // This example assumes unlimited next pages.
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="flex text-2xl font-bold my-4 mb-8 gap-2">
        <BotLogo />
        {APP_NAME}
      </h1>
      <div className="flex flex-wrap gap-4 my-4">
        <div className="flex-1 min-w-[160px]">
          <MultiSelectInput
            options={TICKER_OPTIONS}
            placeholder="Search Tickers..."
            selectedOptions={selectedTickers}
            setSelectedOptions={setSelectedTickers}
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <MultiSelectInput
            options={TOPIC_OPTIONS}
            placeholder="Search Topics..."
            selectedOptions={selectedTopics}
            setSelectedOptions={setSelectedTopics}
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <DateTimeRangePicker
            onDateTimeRangeChange={handleDateTimeRangeChange}
          />
        </div>
        <div className="flex py-2.5 px-3.5 flex-1 flex-col gap-2 min-w-[160px] border">
          <div className="flex min-w-[160px] flex-row">
            <label
              htmlFor="sort-select"
              className="inline-block font-semibold py-1 mr-2"
            >
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "LATEST" | "EARLIEST" | "RELEVANCE")
              }
              className="min-w-[150px] border py-1 px-2 rounded cursor-pointer"
              defaultValue="LATEST"
            >
              <option value="LATEST">Latest</option>
              <option value="EARLIEST">Earliest</option>
              <option value="RELEVANCE">Relevance</option>
            </select>
          </div>

          <div className="flex min-w-[160px] flex-row">
            <label
              htmlFor="page-limit"
              className="inline-block font-semibold py-1 mr-2"
            >
              Posts #:
            </label>
            <div className="inline-block relative">
              <select
                className="block appearance-none w-full bg-gray-200 border 
                         border-gray-200 text-gray-700 py-1 px-4 pr-8 rounded 
                           leading-tight focus:outline-none focus:bg-white 
                           focus:border-gray-500 cursor-pointer"
                id="page-limit"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <p className="py-8 text-center">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="py-8">
        {displayedItems && displayedItems.length > 0
          ? displayedItems.map((item: NewsArticle) => (
              <NewsSummary
                key={item.url}
                title={item.title}
                summary={item.summary}
                url={item.url}
                overallSentimentLabel={item.overall_sentiment_label}
                overallSentimentScore={item.overall_sentiment_score}
                tickerSentiment={item.ticker_sentiment}
              />
            ))
          : !loading && <></>}

        {
          <>
            {data && data["Information"] && !loading ? (
              data["Information"]
            ) : (
              <></>
            )}
          </>
        }

        {
          <>
            {data && data["Error Message"] && !loading ? (
              data["Error Message"]
            ) : (
              <></>
            )}
          </>
        }
      </div>
      <div className="flex justify-between items-center space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          onClick={() => handlePrevPage()}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalNumberOfPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          onClick={() => handleNextPage()}
          disabled={currentPage >= totalNumberOfPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

interface BotLogoProps {
  size?: number; // Optional size prop
}

const BotLogo: React.FC<BotLogoProps> = ({ size = 32 }) => {
  // Default size is 32px
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_150_356)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
          fill="#3F3D56"
        />
        <path
          d="M12 6C11.45 6 11 6.45 11 7V9C11 9.55 11.45 10 12 10C12.55 10 13 9.55 13 9V7C13 6.45 12.55 6 12 6Z"
          fill="#3F3D56"
        />
        <path
          d="M18 14H6C5.45 14 5 14.45 5 15V17C5 17.55 5.45 18 6 18H18C18.55 18 19 17.55 19 17V15C19 14.45 18.55 14 18 14ZM17 16H7V15H17V16Z"
          fill="#3F3D56"
        />
        <path
          d="M15.6 11.2C15.15 11.65 15.04 12.31 15.31 12.9C15.58 13.49 16.16 13.89 16.83 13.97C17.5 14.05 18.18 13.79 18.62 13.35C19.06 12.91 19.32 12.23 19.24 11.56C19.16 10.89 18.76 10.31 18.17 10.04C17.58 9.77 16.92 9.88 16.47 10.33C16.45 10.35 16.42 10.36 16.4 10.38C16.36 10.42 16.33 10.46 16.29 10.5C16.25 10.53 16.21 10.57 16.18 10.61C16.14 10.65 16.11 10.69 16.07 10.73C16.03 10.77 16 10.82 15.96 10.86L15.9 10.92C15.84 10.98 15.79 11.04 15.74 11.1C15.69 11.15 15.64 11.21 15.6 11.27V11.2Z"
          fill="#3F3D56"
        />
        <path
          d="M8.4 11.2C8.85 11.65 8.96 12.31 8.69 12.9C8.42 13.49 7.84 13.89 7.17 13.97C6.5 14.05 5.82 13.79 5.38 13.35C4.94 12.91 4.68 12.23 4.76 11.56C4.84 10.89 5.24 10.31 5.83 10.04C6.42 9.77 7.08 9.88 7.53 10.33C7.55 10.35 7.58 10.36 7.6 10.38C7.64 10.42 7.67 10.46 7.71 10.5C7.75 10.53 7.79 10.57 7.82 10.61C7.86 10.65 7.89 10.69 7.93 10.73C7.97 10.77 8 10.82 8.04 10.86L8.1 10.92C8.16 10.98 8.21 11.04 8.26 11.1C8.31 11.15 8.36 11.21 8.4 11.27V11.2Z"
          fill="#3F3D56"
        />
      </g>
      <defs>
        <clipPath id="clip0_150_356">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default NewsSummaryPage;
