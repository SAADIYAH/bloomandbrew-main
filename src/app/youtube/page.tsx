"use client";

import { useState } from "react";

export default function YouTubeExtractorPage() {
  const [apiKey, setApiKey] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<any>(null);

  function extractVideoId(input: string) {
    try {
      const url = new URL(input);

      if (url.hostname.includes("youtube.com")) {
        return url.searchParams.get("v");
      }

      if (url.hostname.includes("youtu.be")) {
        return url.pathname.replace("/", "");
      }

      return input;
    } catch {
      return input;
    }
  }

  async function extractData() {
    setError("");
    setVideoData(null);

    if (!apiKey.trim()) {
      setError("Please enter YouTube API key.");
      return;
    }

    if (!videoInput.trim()) {
      setError("Please enter YouTube link or Video ID.");
      return;
    }

    const videoId = extractVideoId(videoInput);

    setLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
      );

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setError("Video not found.");
        setLoading(false);
        return;
      }

      setVideoData(data.items[0]);
    } catch (err) {
      setError("Failed to fetch YouTube data.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-2 text-center">
          YouTube Social Media Data Extraction
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Live YouTube API Data Extraction for CSC795 Assignment
        </p>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">YouTube API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste API Key"
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              YouTube Video Link or Video ID
            </label>
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="Paste YouTube link"
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <button
            onClick={extractData}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
          >
            Extract Data
          </button>
        </div>

        {loading && (
          <div className="mt-6 text-blue-600 font-semibold">
            Extracting data...
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {videoData && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">
              Extracted YouTube Data
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 shadow">
              <img
                src={videoData.snippet.thumbnails.high.url}
                alt="Thumbnail"
                className="rounded-xl mb-6 w-full"
              />

              <h3 className="text-2xl font-bold mb-2">
                {videoData.snippet.title}
              </h3>

              <p className="text-gray-600 mb-6">
                Channel: {videoData.snippet.channelTitle}
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow text-center">
                  <h4 className="text-2xl font-bold">
                    {Number(
                      videoData.statistics.viewCount
                    ).toLocaleString()}
                  </h4>
                  <p className="text-gray-500">Views</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow text-center">
                  <h4 className="text-2xl font-bold">
                    {Number(
                      videoData.statistics.likeCount
                    ).toLocaleString()}
                  </h4>
                  <p className="text-gray-500">Likes</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow text-center">
                  <h4 className="text-2xl font-bold">
                    {Number(
                      videoData.statistics.commentCount
                    ).toLocaleString()}
                  </h4>
                  <p className="text-gray-500">Comments</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}