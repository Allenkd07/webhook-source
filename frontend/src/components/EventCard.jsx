import React from "react";
import { GitBranch, GitPullRequest, GitMerge, User, Calendar, Clock } from "lucide-react";

export default function EventCard({ event, text }) {
  if (!text) return null;

  const getActionIcon = (action) => {
    switch (action) {
      case "PUSH":
        return <GitBranch className="h-5 w-5" />;
      case "PULL_REQUEST":
        return <GitPullRequest className="h-5 w-5" />;
      case "MERGE":
        return <GitMerge className="h-5 w-5" />;
      default:
        return <GitBranch className="h-5 w-5" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "PUSH":
        return {
          bg: "bg-blue-100 text-blue-600 border-blue-200",
          badge: "bg-blue-500 text-white",
          gradient: "from-blue-500 to-blue-600"
        };
      case "PULL_REQUEST":
        return {
          bg: "bg-green-100 text-green-600 border-green-200",
          badge: "bg-green-500 text-white",
          gradient: "from-green-500 to-green-600"
        };
      case "MERGE":
        return {
          bg: "bg-purple-100 text-purple-600 border-purple-200",
          badge: "bg-purple-500 text-white",
          gradient: "from-purple-500 to-purple-600"
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-600 border-gray-200",
          badge: "bg-gray-500 text-white",
          gradient: "from-gray-500 to-gray-600"
        };
    }
  };

  const formatDate = (timestamp) => {
    // Parse the UTC timestamp from API and treat it as UTC
    const eventDateUTC = new Date(timestamp + 'Z'); // Ensure it's treated as UTC
    
    // Convert UTC time to local time
    const eventDateLocal = new Date(eventDateUTC.getTime());
    
    // Get current local time
    const nowLocal = new Date();
    
    // Calculate difference between converted local event time and current local time
    const diffMs = nowLocal.getTime() - eventDateLocal.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours === 0) {
        return diffMinutes <= 1 ? "just now" : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    
    return `${diffDays}d ago`;
  };

  const formatFullTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }) + " UTC";
  };

  const colors = getActionColor(event.action);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 group hover:scale-[1.02]">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className={`p-4 rounded-2xl border-2 ${colors.bg} group-hover:scale-110 transition-transform duration-200`}>
            {getActionIcon(event.action)}
          </div>
          <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${colors.gradient} rounded-full border-2 border-white`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${colors.badge}`}>
              {event.action.replace('_', ' ')}
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{formatDate(event.timestamp)}</span>
            </div>
          </div>
          
          <p className="text-gray-900 font-medium mb-4 leading-relaxed text-lg">
            {text}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-semibold text-gray-800">{event.author}</span>
              </div>
              
              {event.from_branch && (
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                    {event.from_branch}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                    {event.to_branch}
                  </span>
                </div>
              )}
              
              {!event.from_branch && event.to_branch && (
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                    {event.to_branch}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Full Timestamp Section */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span className="font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                {formatFullTimestamp(event.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}