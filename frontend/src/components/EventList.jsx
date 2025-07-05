import React from "react";
import EventCard from "./EventCard";
import { GitBranch, Search } from "lucide-react";

export default function EventList({ events }) {
  const formatEvent = (event) => {
    const date = new Date(event.timestamp);
    const formatted =
      date.toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      }) + " UTC";

    switch (event.action) {
      case "PUSH":
        return `${event.author} pushed changes to ${event.to_branch} branch`;
      case "PULL_REQUEST":
        return `${event.author} opened a pull request from ${event.from_branch} to ${event.to_branch}`;
      case "MERGE":
        return `${event.author} merged ${event.from_branch} into ${event.to_branch}`;
      default:
        return null;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No events found</h3>
          <p className="text-gray-600 mb-6">
            No events match your current filters. Try adjusting your filter settings or check back later for new activity.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <GitBranch className="h-4 w-4" />
            <span>Events will appear here when there's repository activity</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Activity
          <span className="ml-3 text-lg font-normal text-gray-500">
            ({events.length} event{events.length !== 1 ? 's' : ''})
          </span>
        </h2>
      </div>
      
      {events.map((event, index) => (
        <div
          key={event._uniqueKey || `${event.request_id}-${index}`}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <EventCard
            event={event}
            text={formatEvent(event)}
          />
        </div>
      ))}
    </div>
  );
}