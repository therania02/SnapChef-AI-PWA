import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { BottomNav } from "../../../ui/BottomNav";
import { mockContacts, mockChats } from "../../lib/data";

export default function MessageScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Swipe handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swipe right to go back to shopping list
    if (swipe > swipeConfidenceThreshold) {
      navigate("/shopping-list");
    }
    // Swipe left to go to account
    else if (swipe < -swipeConfidenceThreshold) {
      navigate("/account");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background pb-24"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <h1
            className="text-2xl"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Pesan
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/80" />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-2xl text-primary-foreground placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      {/* Stories/Online Contacts */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 -mt-4">
        <div className="bg-white rounded-3xl p-4 shadow-lg mb-4">
          <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
            {mockContacts.map((contact) => (
              <motion.div
                key={contact.id}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <span className="text-xs text-center max-w-[70px] truncate">
                  {contact.name.split(" ")[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 space-y-2">
        {filteredChats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/messages/${chat.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all flex gap-4 items-center"
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {chat.isOnline && !chat.isGroup && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
              )}
              {chat.isGroup && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                  <Users className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {chat.lastMessageTime}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
            </div>

            {chat.unreadCount > 0 && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-primary-foreground font-medium">
                  {chat.unreadCount}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </motion.div>
  );
}