import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import EventList from "./components/EventList";
import StatsCards from "./components/StatsCards";
import Pagination from "./components/Pagination";

// Mock data
const mockEvents = [
  {
    request_id: "req_001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action: "PUSH",
    author: "john.doe",
    to_branch: "main"
  },
  {
    request_id: "req_002",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    action: "PULL_REQUEST",
    author: "jane.smith",
    to_branch: "main",
    from_branch: "feature/user-auth"
  },
  {
    request_id: "req_003",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action: "MERGE",
    author: "bob.wilson",
    to_branch: "main",
    from_branch: "bugfix/login-issue"
  },
  {
    request_id: "req_004",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    action: "PUSH",
    author: "alice.johnson",
    to_branch: "develop"
  },
  {
    request_id: "req_005",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    action: "PULL_REQUEST",
    author: "charlie.brown",
    to_branch: "develop",
    from_branch: "feature/dashboard"
  },
  {
    request_id: "req_006",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    action: "MERGE",
    author: "david.lee",
    to_branch: "main",
    from_branch: "hotfix/security-patch"
  }
];

export default function App() {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(
    () => JSON.parse(localStorage.getItem("filters") || "[]")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Events per page

  // Function to remove duplicate events and ensure unique keys
  const deduplicateEvents = (events) => {
    const seen = new Set();
    const uniqueEvents = [];
    
    for (const event of events) {
      // Create a unique identifier combining request_id, action, and timestamp
      const uniqueKey = `${event.request_id}-${event.action}-${event.timestamp}`;
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        // Add a unique key for React rendering
        uniqueEvents.push({
          ...event,
          _uniqueKey: uniqueKey
        });
      }
    }
    
    return uniqueEvents;
  };

  // Fetch all events from Flask API (for proper filtering and stats)
  const fetchAllEvents = async (resetData = false) => {
    try {
      if (resetData) {
        setLoading(true);
      }
      setError(null);
      
      // Fetch all events with a large limit to get everything
      const res = await fetch(`http://localhost:5000/webhook/events?page=1&limit=10000`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const rawEvents = data.results || [];
      
      // Remove duplicates and add unique keys
      const uniqueEvents = deduplicateEvents(rawEvents);
      
      setAllEvents(uniqueEvents);
      setUsingMockData(false);
    } catch (err) {
      console.warn("Failed to fetch from API, using mock data:", err);
      // Use mock data as fallback with unique keys
      const uniqueMockEvents = deduplicateEvents(mockEvents);
      setAllEvents(uniqueMockEvents);
      setUsingMockData(true);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents(true);
    const interval = setInterval(() => fetchAllEvents(), 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  // Filter events by selected action types
  const filteredEvents = React.useMemo(() => {
    if (!allEvents || allEvents.length === 0) {
      return [];
    }
    
    if (selectedFilters.length === 0) {
      return allEvents;
    }
    
    return allEvents.filter((event) => selectedFilters.includes(event.action));
  }, [allEvents, selectedFilters]);

  // Calculate pagination for filtered events
  const totalFilteredCount = filteredEvents.length;
  const totalPages = Math.ceil(totalFilteredCount / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top of events section when page changes
      document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate stats from all events (not filtered)
  const allStats = React.useMemo(() => {
    if (!allEvents || allEvents.length === 0) {
      return { total: 0, pushes: 0, pullRequests: 0, merges: 0 };
    }
    
    return {
      total: allEvents.length,
      pushes: allEvents.filter(e => e.action === 'PUSH').length,
      pullRequests: allEvents.filter(e => e.action === 'PULL_REQUEST').length,
      merges: allEvents.filter(e => e.action === 'MERGE').length,
    };
  }, [allEvents]);

  // Calculate filtered stats for display
  const filteredStats = React.useMemo(() => {
    if (!filteredEvents || filteredEvents.length === 0) {
      return { total: 0, pushes: 0, pullRequests: 0, merges: 0 };
    }
    
    return {
      total: filteredEvents.length,
      pushes: filteredEvents.filter(e => e.action === 'PUSH').length,
      pullRequests: filteredEvents.filter(e => e.action === 'PULL_REQUEST').length,
      merges: filteredEvents.filter(e => e.action === 'MERGE').length,
    };
  }, [filteredEvents]);

  // Determine which stats to show
  const statsToShow = selectedFilters.length > 0 ? filteredStats : allStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Repository Activity
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Monitor your Git repository events in real-time
          </p>
          
          {usingMockData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Demo Mode:</span> Using sample data. 
                  Start your Flask API server at localhost:5000 to see live events.
                </p>
              </div>
            </div>
          )}

          {selectedFilters.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Filtered View:</span> Showing {filteredStats.total} of {allStats.total} events
                    <span className="ml-2 text-blue-600">({selectedFilters.join(', ')})</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        <StatsCards stats={statsToShow} />

        <FilterBar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <div className="mt-8">
          {loading && allEvents.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                <span className="text-lg text-gray-600">Loading events...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchAllEvents(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <EventList 
                events={paginatedEvents}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalFilteredCount}
                onPageChange={handlePageChange}
                loading={loading}
              />
              
              {/* Bottom Pagination (Optional - can be removed if you only want top pagination) */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalFilteredCount}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}