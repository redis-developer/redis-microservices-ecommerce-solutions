
import { useState, ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';

import { createMarkup } from '@/utils/convert';

interface IChatMessageCallbackData {
    newChatMessage: IChatMessage;
    chatHistory: IChatMessage[];
    setChatHistory: Dispatch<SetStateAction<IChatMessage[]>>;
}

interface IChatProps {
    placeHolder?: string;
    chatMessageCallback?: (data: IChatMessageCallbackData) => Promise<void>;
    oldChatHistory?: IChatMessage[];
}

const CHAT_CONSTANTS = { //also in backend
    SENDER_ASSISTANT: "Assistant",
    SENDER_USER: "User"
}

const Chat = ({ placeHolder, chatMessageCallback, oldChatHistory }: IChatProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [chatHistory, setChatHistory] = useState<IChatMessage[]>([{
        sender: CHAT_CONSTANTS.SENDER_ASSISTANT,
        message: 'Hello, how can I help you?'
    }]);

    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.chat-history-ctr');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = async () => {
        if (message.trim() !== '') {
            const newChatMessage: IChatMessage = {
                sender: CHAT_CONSTANTS.SENDER_USER,
                message: message.trim()
            };
            const chatHistoryArr = [...chatHistory, newChatMessage]
            setChatHistory(chatHistoryArr); //updates async
            setMessage('');
            setIsLoading(true);

            if (chatMessageCallback) {
                await chatMessageCallback({
                    newChatMessage,
                    chatHistory: chatHistoryArr,
                    setChatHistory
                });
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        //scroll to bottom after new message
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        if (oldChatHistory?.length) {
            setChatHistory(c => [...c, ...oldChatHistory]);
        }
    }, [oldChatHistory]);

    return (
        <div className="fixed bottom-20 right-4">
            <button className="bg-orange-300 text-white rounded-full p-2 w-12 h-12" onClick={toggleChat}>
                <i className="fas fa-comments"></i>
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50">
                    <div className="bg-white w-2/6 h-full rounded-lg p-4 m-2 relative">
                        <button className="absolute top-1 right-1 bg-orange-400 text-white rounded-lg p-2" onClick={toggleChat}>
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="flex flex-col h-full">
                            <div className="flex-grow overflow-y-auto chat-history-ctr">
                                {chatHistory.map((chat, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-start mb-2"
                                    >
                                        <div className="flex items-start">
                                            {chat.sender === CHAT_CONSTANTS.SENDER_USER ? (
                                                <div className="text-base text-white bg-gray-600 rounded-full p-2 mr-2">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                            ) : (
                                                <div className="text-base text-white bg-blue-500 rounded-full p-2 mr-2">
                                                    <i className="fas fa-robot"></i>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-700">
                                                    {chat.sender === CHAT_CONSTANTS.SENDER_USER ? 'You' : 'Assistant'}
                                                </h4>

                                                <div className="rounded-lg p-2 text-sm">
                                                    <div dangerouslySetInnerHTML={createMarkup(chat.message)}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isLoading && (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-300 mr-2"></div>
                                    <p className="text-gray-900">Generating your response, hold on...</p>
                                </div>
                            )}

                            <div className='flex mt-2'>
                                <input
                                    type="text"
                                    className="flex-grow border border-gray-300 rounded-l-lg p-2 outline-none focus:border-orange-400"
                                    placeholder={!isLoading ?
                                        (placeHolder ? placeHolder : 'Ask your question...')
                                        : ''}
                                    value={message}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key.toLowerCase() === 'enter') {
                                            handleSend();
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                                <button
                                    className="bg-orange-400 text-white rounded-r-lg p-2"
                                    onClick={handleSend} disabled={isLoading}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export {
    CHAT_CONSTANTS,
    Chat as default
}

export type {
    IChatProps,
    IChatMessageCallbackData
}
