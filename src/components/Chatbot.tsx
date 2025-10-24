import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const responses: Record<string, string> = {
  fever: "You might need a General Physician. Would you like to book an appointment with one?",
  headache: "This could be neurological. I recommend seeing a Neurologist for a proper diagnosis.",
  "chest pain": "⚠️ This is serious. Please visit Emergency or contact a Cardiologist immediately!",
  "stomach pain": "This could be digestive. Consider consulting a Gastroenterologist.",
  cough: "For persistent cough, I recommend consulting a General Physician or Pulmonologist.",
  cold: "For common cold, rest and hydration help. You can also consult a General Physician if it persists.",
  "book appointment": "Sure! You can browse our doctors and book appointments here: /doctors",
  "find doctor": "I can help you find the right doctor. Visit our doctors page: /doctors",
  "find hospital": "Browse trusted hospitals in your area: /hospitals",
  hospital: "You can explore hospitals near you at: /hospitals",
  diabetes: "Diabetes is a condition where blood sugar levels are too high. Consult an Endocrinologist for management.",
  "blood pressure": "High blood pressure should be monitored regularly. Consider consulting a Cardiologist.",
  emergency: "🚨 For emergencies, please call 102 (Ambulance) or visit the nearest hospital immediately!",
  help: "I can assist you with:\n• Finding doctors by specialty\n• Booking appointments\n• Finding hospitals\n• Health information\n• Emergency guidance",
  hi: "Hello! I'm your health assistant. How can I help you today?",
  hello: "Hi there! I'm here to assist you with your health queries. What can I do for you?",
  thanks: "You're welcome! Feel free to ask if you need anything else. 😊",
  "thank you": "Happy to help! Stay healthy! 😊",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Error parsing chat history:", error);
        // If parsing fails, start with welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Hi! I'm your health assistant. Ask me about symptoms, book appointments, or find hospitals!",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hi! I'm your health assistant. Ask me about symptoms, book appointments, or find hospitals!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Update unread count when chat is closed
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        const stored = localStorage.getItem("lastReadTimestamp");
        const lastReadTime = stored ? new Date(stored) : new Date(0);
        if (lastMessage.timestamp > lastReadTime) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = getBotResponse(textToSend.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    // Check for exact matches
    for (const [key, response] of Object.entries(responses)) {
      if (userInput.includes(key)) {
        return response;
      }
    }

    // Default response
    return "I'm here to help! You can ask me about symptoms, booking appointments, finding doctors or hospitals, or general health information. What would you like to know?";
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      localStorage.setItem("lastReadTimestamp", new Date().toISOString());
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {!isOpen && (
          <Button
            onClick={toggleChat}
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-all duration-300 relative group"
          >
            <MessageCircle className="h-7 w-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] z-[9999] flex flex-col shadow-2xl animate-fade-in border-primary/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Health Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t bg-background">
              <p className="text-xs text-muted-foreground mb-2">
                Quick actions:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleQuickAction("book appointment")}
                >
                  Book Appointment
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleQuickAction("find doctor")}
                >
                  Find Doctor
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleQuickAction("find hospital")}
                >
                  Find Hospital
                </Badge>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                {isTyping ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
