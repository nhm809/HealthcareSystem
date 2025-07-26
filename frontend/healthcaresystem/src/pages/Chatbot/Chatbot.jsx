import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, Space, Avatar, Spin, message } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { chatbotApi } from '../../services/api';
import './Chatbot.css';
import logo from '../../assets/imgs/logo.png';

const { TextArea } = Input;
const { Text, Title } = Typography;

const Chatbot = ({ isWidget = false }) => {
     const [messages, setMessages] = useState([
          {
               id: 1,
               type: 'bot',
               content: 'Xin chào! Tôi là trợ lý AI sức khỏe của bạn. Tôi có thể giúp bạn tư vấn về các vấn đề sức khỏe, giải đáp thắc mắc về dịch vụ y tế. Bạn có câu hỏi gì không?',
               timestamp: new Date()
          }
     ]);
     const [inputMessage, setInputMessage] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [conversationId, setConversationId] = useState(null);
     const messagesEndRef = useRef(null);
     const chatContainerRef = useRef(null);

     // Auto scroll to bottom when new messages arrive
     const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     };

     useEffect(() => {
          scrollToBottom();
     }, [messages]);

     // Generate unique conversation ID
     useEffect(() => {
          setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
     }, []);

     const handleSendMessage = async () => {
          if (!inputMessage.trim() || isLoading) return;

          const userMessage = {
               id: Date.now(),
               type: 'user',
               content: inputMessage.trim(),
               timestamp: new Date()
          };

          setMessages(prev => [...prev, userMessage]);
          const currentMessage = inputMessage.trim();
          setInputMessage('');
          setIsLoading(true);

          try {
               // Create a temporary bot message for streaming
               const botMessageId = Date.now() + 1;
               const botMessage = {
                    id: botMessageId,
                    type: 'bot',
                    content: '',
                    timestamp: new Date(),
                    isStreaming: true
               };

               setMessages(prev => [...prev, botMessage]);

               // Send message to chatbot API
               const response = await chatbotApi.sendMessage(currentMessage, conversationId);
               
               let fullResponse = '';
               
               // Process streaming response
               for await (const data of chatbotApi.parseStreamingResponse(response)) {
                    if (data.type === 'message') {
                         fullResponse += data.content;
                         // Update the bot message with streaming content
                         setMessages(prev => prev.map(msg => 
                              msg.id === botMessageId 
                                   ? { ...msg, content: fullResponse }
                                   : msg
                         ));
                    } else if (data.type === 'final') {
                         // Final response received
                         fullResponse = data.content.final_response || fullResponse;
                         setMessages(prev => prev.map(msg => 
                              msg.id === botMessageId 
                                   ? { ...msg, content: fullResponse, isStreaming: false }
                                   : msg
                         ));
                         break;
                    }
               }

          } catch (error) {
               console.error('Error sending message:', error);
               message.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!');
               
               // Remove the temporary bot message and add error message
               setMessages(prev => {
                    const filtered = prev.filter(msg => !msg.isStreaming);
                    return [...filtered, {
                         id: Date.now() + 2,
                         type: 'bot',
                         content: 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau ít phút.',
                         timestamp: new Date(),
                         isError: true
                    }];
               });
          } finally {
               setIsLoading(false);
          }
     };

     const handleKeyPress = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               handleSendMessage();
          }
     };

     const formatTime = (timestamp) => {
          return timestamp.toLocaleTimeString('vi-VN', { 
               hour: '2-digit', 
               minute: '2-digit' 
          });
     };

     const clearChat = () => {
          setMessages([{
               id: 1,
               type: 'bot',
               content: 'Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì cho bạn?',
               timestamp: new Date()
          }]);
          setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
     };

     return (
          <div className={`chatbot-container${isWidget ? ' chatbot-widget-container' : ''}`} style={isWidget ? { boxShadow: 'none', borderRadius: 0, height: '100%' } : {}}>
               <Card className={`chatbot-card${isWidget ? ' chatbot-widget-card' : ''}`} bodyStyle={isWidget ? { padding: 0, height: '100%' } : {}} style={isWidget ? { boxShadow: 'none', borderRadius: 0, height: '100%' } : {}}>
                    <div className="chatbot-header" style={isWidget ? { padding: '12px 16px', minHeight: 48 } : {}}>
                         <Space align="center">
                              <Avatar 
                                   src={logo}
                                   size={isWidget ? 'default' : 'large'}
                                   style={{ backgroundColor: '#fff', border: '2px solid #54AA7F', objectFit: 'cover' }}
                              />
                              <div>
                                   <Title level={isWidget ? 5 : 4} style={{ margin: 0, color: '#1890ff' }}>
                                        Trợ lý AI Sức khỏe
                                   </Title>
                                   {!isWidget && <Text type="secondary">Luôn sẵn sàng hỗ trợ bạn</Text>}
                              </div>
                         </Space>
                         {!isWidget && (
                         <Button 
                              type="link" 
                              onClick={clearChat}
                              style={{ color: '#1890ff' }}
                         >
                              Cuộc trò chuyện mới
                         </Button>
                         )}
                    </div>

                    <div className="messages-container" ref={chatContainerRef}>
                         {messages.map((msg) => (
                              <div key={msg.id} className={`message ${msg.type}-message`}>
                                   <div className="message-content">
                                        {msg.type === 'user' && (
                                            <Avatar 
                                                icon={<UserOutlined />}
                                                style={{ 
                                                    backgroundColor: '#52c41a',
                                                    marginLeft: '8px'
                                                }}
                                            />
                                        )}
                                        <div className="message-bubble">
                                             <div className="message-text">
                                                  {msg.content}
                                                  {msg.isStreaming && <span className="streaming-cursor">|</span>}
                                             </div>
                                             <div className="message-time">
                                                  {formatTime(msg.timestamp)}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                         {isLoading && (
                              <div className="message bot-message">
                                   <div className="message-content">
                                        {/* No bot avatar for loading/spin message */}
                                        <div className="message-bubble">
                                             <Spin size="small" />
                                             <Text style={{ marginLeft: '8px' }}>Đang soạn tin nhắn...</Text>
                                        </div>
                                   </div>
                              </div>
                         )}
                         <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                         <TextArea
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Nhập câu hỏi của bạn về sức khỏe..."
                              autoSize={{ minRows: 1, maxRows: 4 }}
                              disabled={isLoading}
                              className="chat-input"
                         />
                         <Button
                              type="primary"
                              icon={<SendOutlined />}
                              onClick={handleSendMessage}
                              disabled={!inputMessage.trim() || isLoading}
                              className="send-button"
                         >
                              Gửi
                         </Button>
                    </div>
               </Card>
          </div>
     );
};

export default Chatbot; 