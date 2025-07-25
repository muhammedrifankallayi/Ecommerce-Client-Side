import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "orders",
      title: "Orders & Delivery",
      count: 12,
      faqs: [
        {
          question: "How can I track my order?",
          answer: "You can track your order by going to 'My Orders' in your account or using the tracking link sent to your email. You'll get real-time updates on your order status."
        },
        {
          question: "What is the expected delivery time?",
          answer: "Standard delivery takes 3-5 business days. Express delivery (available in select cities) takes 1-2 business days. Remote areas may take 5-7 business days."
        },
        {
          question: "Can I change my delivery address?",
          answer: "You can change your delivery address within 2 hours of placing the order, provided it hasn't been shipped yet. Contact our support team for assistance."
        },
        {
          question: "What if my order is delayed?",
          answer: "If your order is delayed beyond the expected delivery date, you'll receive a notification with a new delivery estimate. You can also contact support for compensation if applicable."
        }
      ]
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      count: 8,
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and in resalable condition. Some categories like food items are non-returnable."
        },
        {
          question: "How do I initiate a return?",
          answer: "Go to 'My Orders', select the item you want to return, choose a reason, and schedule a pickup. Our team will collect the item from your address."
        },
        {
          question: "When will I get my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive and verify the returned item. The amount will be credited to your original payment method."
        },
        {
          question: "Are return shipping charges free?",
          answer: "Return shipping is free for defective products or wrong items delivered. For other returns, a nominal shipping charge may apply as per our policy."
        }
      ]
    },
    {
      id: "payments",
      title: "Payments & Pricing",
      count: 6,
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, wallets, and cash on delivery (COD) for eligible orders."
        },
        {
          question: "Is it safe to pay online?",
          answer: "Yes, all payments are secured with 128-bit SSL encryption. We don't store your card details on our servers."
        },
        {
          question: "Can I pay partially with wallet balance?",
          answer: "Yes, you can combine wallet balance with other payment methods for your purchase."
        }
      ]
    },
    {
      id: "account",
      title: "Account & Profile",
      count: 5,
      faqs: [
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page, enter your email/phone number, and follow the instructions sent to reset your password."
        },
        {
          question: "Can I change my registered email/phone?",
          answer: "Yes, you can update your email and phone number from the 'Account Settings' section in your profile."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team to request account deletion. Note that this action is irreversible and all your data will be permanently deleted."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Find quick answers to common questions. Can't find what you're looking for? Contact our support team.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Link to="/help/chat" className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Chat with our support team</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Link to="/help" className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Submit Ticket</h3>
                  <p className="text-sm text-muted-foreground">Create a support request</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Call Support</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQs.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant="secondary">{category.faqs.length} questions</Badge>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchQuery && filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any FAQs matching your search.
            </p>
            <Button asChild>
              <Link to="/help">Submit a Support Ticket</Link>
            </Button>
          </div>
        )}

        {/* Still Need Help */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/help/chat">Start Live Chat</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/help">Submit Ticket</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;