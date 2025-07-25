import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

const ChatSupportPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Sarah from EcoShop support. How can I help you today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 60000),
      status: "read"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(newMessage),
        sender: "agent",
        timestamp: new Date(),
        status: "read"
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  const getAgentResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("order") || msg.includes("track")) {
      return "I can help you track your order. Could you please provide your order number? It usually starts with #EC followed by numbers.";
    } else if (msg.includes("return") || msg.includes("refund")) {
      return "I'll be happy to help with your return. Our return policy allows returns within 30 days. What item would you like to return?";
    } else if (msg.includes("payment") || msg.includes("card")) {
      return "For payment-related issues, I can assist you right away. What specific payment issue are you experiencing?";
    } else if (msg.includes("delivery") || msg.includes("shipping")) {
      return "I can help with delivery questions. Standard delivery takes 3-5 business days. Do you have a specific delivery concern?";
    } else {
      return "Thank you for your message. I'm here to help! Could you please provide more details about your query so I can assist you better?";
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReplies = [
    "Track my order",
    "Return a product", 
    "Payment issue",
    "Delivery problem",
    "Account help"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/help/faq">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Sarah" />
                  <AvatarFallback className="bg-primary text-primary-foreground">SA</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sarah Wilson</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Online • Support Agent</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {message.sender === "agent" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Agent" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">SA</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`space-y-1`}>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${
                      message.sender === "user" ? "justify-end" : ""
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === "user" && message.status && (
                        <Badge variant="outline" className="text-xs h-4">
                          {message.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Agent" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">SA</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <>
              <Separator />
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage(reply)}
                      className="text-sm"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Message Input */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-10"
                />
                <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Typically replies in a few minutes • Available 24/7
            </p>
          </div>
        </Card>

        {/* Support Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-sm">Average Response</h4>
                <p className="text-2xl font-bold text-primary">2 min</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Customer Satisfaction</h4>
                <p className="text-2xl font-bold text-primary">4.8/5</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Resolution Rate</h4>
                <p className="text-2xl font-bold text-primary">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatSupportPage;