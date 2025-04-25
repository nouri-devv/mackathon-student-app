import { useState, useEffect } from "react";
import { Calendar, Users, Award, Clock, MapPin, Heart, MessageCircle, Share2, Search, Filter, User } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [interestFilter, setInterestFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInterestSelector, setShowInterestSelector] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: "Traditional Japanese Matcha Workshop",
          description: "Learn authentic matcha preparation techniques and explore traditional Japanese tea ceremony rituals!",
          date: "May 1, 2025",
          time: "2:00 PM - 4:00 PM",
          location: "Sir Louis Matheson Library, Japanese Cultural Room",
          points: 45,
          category: "cultural",
          interest: ["japanese-culture", "tea-ceremony", "matcha"],
          registered: false,
          maxAttendees: 25,
          currentAttendees: 18,
          likes: 32,
          comments: 12,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Alex", "Jamie", "Taylor"],
          tags: ["japanese", "matcha", "tea-ceremony"],
          collaborative: true,
        },
        {
          id: 2,
          title: "Study Jam & Snack Session",
          description: "Help each other ace those exams while enjoying great snacks and music!",
          date: "May 3, 2025",
          time: "3:30 PM - 5:00 PM",
          location: "Matheson Library, Group Study Room 4B",
          points: 25,
          category: "academic",
          interest: ["studying", "food", "music"],
          registered: true,
          maxAttendees: 15,
          currentAttendees: 10,
          likes: 12,
          comments: 5,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Morgan", "Casey"],
          tags: ["learning", "collaboration", "music"],
          collaborative: true,
        },
        {
          id: 3,
          title: "Basketball 3v3 Tournament",
          description: "Competitive 3v3 basketball tournament with music, prizes, and a post-game BBQ social!",
          date: "May 7, 2025",
          time: "1:00 PM - 5:00 PM",
          location: "Monash Sports Centre, Court 3",
          points: 75,
          category: "sports",
          interest: ["basketball", "competition", "food"],
          registered: false,
          maxAttendees: 36,
          currentAttendees: 24,
          likes: 45,
          comments: 17,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Jordan", "Riley", "Avery", "Sam"],
          tags: ["basketball", "teamwork", "competition"],
          collaborative: true,
        },
        {
          id: 4,
          title: "Python Data Visualization Workshop",
          description: "Learn to create powerful data visualizations using Python, Matplotlib and Seaborn with industry professionals from IBM.",
          date: "May 10, 2025",
          time: "10:00 AM - 2:00 PM",
          location: "Information Technology Building, Lab 304",
          points: 40,
          category: "academic",
          interest: ["programming", "data-science", "python"],
          registered: false,
          maxAttendees: 30,
          currentAttendees: 22,
          likes: 33,
          comments: 14,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Quinn", "Cameron"],
          tags: ["python", "data-viz", "programming"],
          collaborative: true,
        },
        {
          id: 5,
          title: "International Cultural Festival",
          description: "Experience cultures from around the world with authentic international foods, music and performances!",
          date: "May 15, 2025",
          time: "12:00 PM - 3:00 PM",
          location: "Robert Blackwood Hall, Monash Clayton",
          points: 60,
          category: "cultural",
          interest: ["arts", "food", "music", "dance"],
          registered: false,
          maxAttendees: 200,
          currentAttendees: 120,
          likes: 56,
          comments: 23,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Reese", "Dakota", "Jordan", "Blake"],
          tags: ["diversity", "food", "performance"],
          collaborative: true,
        },
        {
          id: 6,
          title: "Yoga at Sunset",
          description: "Rejuvenate with flowing yoga and guided meditation followed by tea and fresh fruit.",
          date: "May 5, 2025",
          time: "5:30 PM - 6:30 PM",
          location: "Monash Wellness Centre, Studio 2",
          points: 30,
          category: "wellness",
          interest: ["yoga", "mindfulness", "fitness"],
          registered: false,
          maxAttendees: 25,
          currentAttendees: 18,
          likes: 42,
          comments: 11,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Jamie", "Casey"],
          tags: ["yoga", "meditation", "wellness"],
          collaborative: false,
        },
        {
          id: 7,
          title: "Power Pilates & Protein Smoothies",
          description: "High-intensity Pilates core workout followed by custom protein smoothies with nutrition consultation.",
          date: "May 9, 2025",
          time: "4:00 PM - 5:30 PM",
          location: "Doug Ellis Swimming Pool, Studio Room",
          points: 35,
          category: "wellness",
          interest: ["pilates", "fitness", "nutrition"],
          registered: false,
          maxAttendees: 20,
          currentAttendees: 12,
          likes: 28,
          comments: 9,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Riley", "Alex"],
          tags: ["fitness", "nutrition", "core-strength"],
          collaborative: true,
        },
        {
          id: 8,
          title: "Impressionist Watercolor Workshop",
          description: "Explore the theoretical foundations and practical techniques of French Impressionism through chromatic theory and plein-air watercolor methodologies.",
          date: "May 12, 2025",
          time: "1:00 PM - 4:00 PM",
          location: "Monash Art & Design Building, Studio 3B",
          points: 55,
          category: "arts",
          interest: ["art", "watercolor", "painting"],
          registered: false,
          maxAttendees: 20,
          currentAttendees: 14,
          likes: 37,
          comments: 15,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Taylor", "Dakota"],
          tags: ["impressionism", "watercolor", "painting"],
          collaborative: true,
        },
        {
          id: 9,
          title: "Sourdough Bread Baking Masterclass",
          description: "Master artisanal sourdough bread making with award-winning baker Professor Richards from Hospitality Management!",
          date: "May 17, 2025",
          time: "10:00 AM - 1:00 PM",
          location: "Monash Culinary School, Kitchen 2",
          points: 50,
          category: "food",
          interest: ["baking", "sourdough", "culinary-arts"],
          registered: false,
          maxAttendees: 16,
          currentAttendees: 12,
          likes: 45,
          comments: 18,
          image: "/api/placeholder/600/300",
          friendsAttending: ["Casey", "Jordan"],
          tags: ["sourdough", "baking", "artisanal"],
          collaborative: true,
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegister = (eventId) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, registered: !event.registered } : event
    );
    setEvents(updatedEvents);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleLike = (eventId, e) => {
    e.stopPropagation();
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, likes: event.likes + 1 } : event
    ));
  };

  // Filter events based on category, interest, and search
  const filteredEvents = events.filter(event => {
    const matchesCategory = filter === "all" || event.category === filter;
    const matchesInterest = interestFilter === "all" || (event.interest && event.interest.includes(interestFilter));
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesInterest && matchesSearch;
  });

  // Get unique interests from all events
  const allInterests = [...new Set(events.flatMap(event => event.interest || []))].sort();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-blue-50 border-b border-blue-100 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-800">Campus Events</h1>
              <p className="text-blue-600">Find events, connect with others, earn rewards</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-white px-4 py-2 rounded border border-blue-200 text-blue-700 hover:bg-blue-50">
                <span className="flex items-center">
                  <User size={16} className="mr-2" /> 
                  My Events
                </span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <div className="flex">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  className="w-full py-2 px-4 pl-10 rounded-l border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-blue-400" size={18} />
              </div>
              <button 
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r text-white"
                onClick={() => setShowInterestSelector(!showInterestSelector)}
              >
                <Filter size={18} />
              </button>
            </div>
            
            {/* Interest Selector Popup */}
            {showInterestSelector && (
              <div className="absolute z-10 mt-1 p-4 bg-white rounded border border-blue-100 shadow-md w-64">
                <h3 className="font-medium mb-3 text-gray-700">Filter by interest</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-2 py-1 rounded text-sm ${interestFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => { 
                      setInterestFilter("all");
                      setShowInterestSelector(false);
                    }}
                  >
                    All
                  </button>
                  {allInterests.map(interest => (
                    <button 
                      key={interest}
                      className={`px-2 py-1 rounded text-sm ${interestFilter === interest ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => { 
                        setInterestFilter(interest);
                        setShowInterestSelector(false);
                      }}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(filter !== "all" || interestFilter !== "all" || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filter !== "all" && (
                <div className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center text-blue-700">
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <button className="ml-2" onClick={() => setFilter("all")}>&times;</button>
                </div>
              )}
              {interestFilter !== "all" && (
                <div className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center text-blue-700">
                  #{interestFilter}
                  <button className="ml-2" onClick={() => setInterestFilter("all")}>x</button>
                </div>
              )}
              {searchTerm && (
                <div className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center text-blue-700">
                  "{searchTerm}"
                  <button className="ml-2" onClick={() => setSearchTerm("")}>x</button>
                </div>
              )}
              {(filter !== "all" || interestFilter !== "all" || searchTerm) && (
                <button 
                  className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700"
                  onClick={() => {
                    setFilter("all");
                    setInterestFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "all" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("all")}
          >
            All Events
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "academic" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("academic")}
          >
            Academic
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "community" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("community")}
          >
            Community
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "sports" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("sports")}
          >
            Sports
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "wellness" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("wellness")}
          >
            Wellness
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "arts" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("arts")}
          >
            Arts
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "cultural" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("cultural")}
          >
            Cultural
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium ${filter === "food" ? "bg-blue-500 text-white" : "bg-white border border-blue-200 text-blue-700"}`}
            onClick={() => setFilter("food")}
          >
            Food
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-blue-700">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => handleEventClick(event)}
              >
                <div className="p-2 bg-blue-50">
                  <div className="absolute top-2 right-2">
                    {event.collaborative && (
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        <Users size={12} className="inline mr-1" /> Group
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-16 bg-blue-500 rounded px-2 py-1 text-white text-sm">
                    {event.points} pts
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{event.description}</p>
                  
                  <div className="flex items-center mb-2 text-gray-600 text-sm">
                    <Calendar size={14} className="mr-2 text-blue-500" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center mb-2 text-gray-600 text-sm">
                    <Clock size={14} className="mr-2 text-blue-500" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center mb-3 text-gray-600 text-sm">
                    <MapPin size={14} className="mr-2 text-blue-500" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Attending</span>
                      <span className="text-xs text-gray-500">{event.currentAttendees}/{event.maxAttendees}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-500"
                        style={{width: `${(event.currentAttendees / event.maxAttendees) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-3">
                      <button 
                        onClick={(e) => handleLike(event.id, e)} 
                        className="flex items-center text-gray-500 hover:text-blue-500"
                      >
                        <Heart size={16} className="mr-1" />
                        <span className="text-sm">{event.likes}</span>
                      </button>
                      <div className="flex items-center text-gray-500">
                        <MessageCircle size={16} className="mr-1" />
                        <span className="text-sm">{event.comments}</span>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-blue-500">
                      <Share2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(event.id);
                    }}
                    className={`w-full py-2 rounded font-medium ${
                      event.registered 
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {event.registered ? "Cancel Registration" : "Register"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded shadow-sm">
            <p className="text-lg mb-4 font-bold text-gray-700">No events match your search</p>
            <p className="text-gray-600 mb-6">Try changing your filters to find events</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                setFilter("all");
                setInterestFilter("all");
                setSearchTerm("");
              }}
            >
              See All Events
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div 
            className="bg-white rounded max-w-2xl w-full max-h-screen overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-blue-50 p-4">
              <button 
                className="absolute top-3 right-3 bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-300"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              
              <div className="flex justify-between items-center">
                <div className="bg-white px-2 py-1 rounded text-blue-700 text-sm">
                  {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                </div>
                
                <div className="bg-blue-500 px-3 py-1 rounded text-white text-sm font-bold">
                  <Award size={14} className="inline mr-1" />
                  {selectedEvent.points} points
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold mb-3 text-gray-800">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-3 text-blue-500" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock size={16} className="mr-3 text-blue-500" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin size={16} className="mr-3 text-blue-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3 text-gray-800">Rewards</h3>
                  <div className="bg-blue-50 p-4 rounded border border-blue-100">
                    <div className="font-bold text-blue-700 text-xl mb-1">{selectedEvent.points} points</div>
                    <div className="text-blue-600 text-sm">Join this event to earn points</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-800">Attendance</h3>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {Array(Math.min(5, selectedEvent.currentAttendees)).fill(0).map((_, index) => (
                      <div 
                        key={index} 
                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm font-bold border border-white"
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                    ))}
                    {selectedEvent.currentAttendees > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold border border-white">
                        +{selectedEvent.currentAttendees - 5}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-800">{selectedEvent.currentAttendees} attending</div>
                    <div className="text-sm text-gray-500">{selectedEvent.maxAttendees - selectedEvent.currentAttendees} spots left</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-800">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                  {selectedEvent.interest && selectedEvent.interest.map((int, index) => (
                    <span 
                      key={`int-${index}`} 
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer"
                      onClick={() => {
                        setInterestFilter(int);
                        setShowModal(false);
                      }}
                    >
                      #{int}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => {
                    handleRegister(selectedEvent.id);
                    setShowModal(false);
                  }}
                  className={`w-full py-2 rounded font-medium ${
                    selectedEvent.registered 
                      ? "bg-red-100 text-red-600 hover:bg-red-200" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {selectedEvent.registered ? "Cancel Registration" : "Register for Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}