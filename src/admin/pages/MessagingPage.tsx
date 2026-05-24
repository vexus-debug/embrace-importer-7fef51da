import { useState } from "react";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useStaff, useCurrentStaff } from "@/hooks/useStaff";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagingPage() {
  const { data: currentStaff } = useCurrentStaff();
  const { data: allStaff = [], isLoading: loadingStaff } = useStaff();
  const { data: messages = [], isLoading: loadingMessages } = useMessages();
  const sendMessage = useSendMessage();
  const { toast } = useToast();

  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = currentStaff?.id;
  const contacts = allStaff.filter((s) => s.id !== currentUserId);

  // Auto-select first contact
  const activeContact = selectedContact || contacts[0]?.id;
  const selectedStaff = allStaff.find((s) => s.id === activeContact);

  const unreadCounts: Record<string, number> = {};
  messages.forEach((m) => {
    if (m.receiver?.id === currentUserId && !m.read) {
      unreadCounts[m.sender?.id || ""] = (unreadCounts[m.sender?.id || ""] || 0) + 1;
    }
  });

  const conversation = messages.filter(
    (m) =>
      (m.sender?.id === currentUserId && m.receiver?.id === activeContact) ||
      (m.sender?.id === activeContact && m.receiver?.id === currentUserId)
  );

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUserId || !activeContact) return;
    try {
      await sendMessage.mutateAsync({
        sender_id: currentUserId,
        receiver_id: activeContact,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const isLoading = loadingStaff || loadingMessages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Messaging</h1>
        <p className="text-sm text-muted-foreground">Internal staff communication</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="flex h-[500px]">
              {/* Contact list */}
              <div className="w-64 border-r border-border shrink-0 hidden md:block">
                <div className="p-3 border-b border-border">
                  <Input placeholder="Search contacts..." className="h-8 text-sm" />
                </div>
                <ScrollArea className="h-[calc(500px-49px)]">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContact(c.id)}
                      className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${activeContact === c.id ? "bg-muted" : ""}`}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">{c.role}</p>
                      </div>
                      {unreadCounts[c.id] && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">{unreadCounts[c.id]}</Badge>
                      )}
                    </button>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-border flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{selectedStaff?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{selectedStaff?.name || "Select a contact"}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">{selectedStaff?.role}{selectedStaff?.specialty ? ` — ${selectedStaff.specialty}` : ""}</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {conversation.map((msg) => {
                      const isMine = msg.sender?.id === currentUserId;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-xl px-4 py-2 ${isMine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              {isMine && msg.read && " ✓✓"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {conversation.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-10">No messages yet. Start a conversation!</p>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-border flex gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0"><Paperclip className="h-4 w-4" /></Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button size="icon" className="shrink-0" onClick={handleSend} disabled={sendMessage.isPending}><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
