interface Sentiment {
  ticker: string;
  relevance_score: string;
  ticker_sentiment_score: string;
  ticker_sentiment_label: string;
}

interface NewsSummaryProps {
  title: string;
  summary: string;
  url: string;
  overallSentimentLabel: string;
  overallSentimentScore: number;
  tickerSentiment: Sentiment[];
}

const NewsSummary: React.FC<NewsSummaryProps> = ({
  title,
  summary,
  url,
  overallSentimentLabel,
  overallSentimentScore,
  tickerSentiment,
}) => {
  const sentimentWidth = Math.max(
    0,
    Math.min(100, overallSentimentScore * 100)
  );

  return (
    <div className="border p-4 rounded-lg mb-4">
      <h3 className="font-bold">{title}</h3>
      <p>{summary}</p>
      <div className="mt-2 flex flex-wrap">
        {/* Combine score and label */}
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold mr-2 mb-2 rounded-full ${getSentimentColor(
            overallSentimentLabel
          )}`}
        >
          {`${overallSentimentLabel} ${
            overallSentimentScore
              ? Number(overallSentimentLabel).toFixed(2)
              : ""
          }`}
        </span>
        {tickerSentiment.map(
          ({ ticker, ticker_sentiment_label, ticker_sentiment_score }) => (
            <span
              key={ticker}
              className={`inline-block px-3 py-1 text-xs font-semibold mr-2 mb-2 rounded-full ${getSentimentColor(
                ticker_sentiment_label
              )}`}
            >
              {`${ticker}: ${ticker_sentiment_label} (${
                ticker_sentiment_score
                  ? Number(ticker_sentiment_score).toFixed(2)
                  : ""
              })`}
            </span>
          )
        )}
      </div>

      <div className="mt-2 mb-2">
        <div className="text-xs font-semibold text-gray-500 mb-1">
          Sentiment Score
        </div>
        <svg width="100%" height="10">
          <rect x="0" y="0" width="100%" height="10" fill="#f1f5f9" />
          <rect
            x="0"
            y="0"
            width={`${sentimentWidth}%`}
            height="10"
            fill={
              overallSentimentScore > 0.35
                ? "#10b981"
                : overallSentimentScore < -0.35
                ? "#ef4444"
                : "#eab308"
            }
          />
        </svg>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Read more
      </a>
    </div>
  );
};

// Utility function to determine badge color based on sentiment
function getSentimentColor(label: string): string {
  switch (label) {
    case "Bullish":
      return "bg-green-200 text-green-800";
    case "Somewhat-Bullish":
      return "bg-green-100 text-green-800";
    case "Neutral":
      return "bg-yellow-200 text-yellow-800";
    case "Somewhat-Bearish":
      return "bg-red-100 text-red-800";
    case "Bearish":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

export default NewsSummary;
