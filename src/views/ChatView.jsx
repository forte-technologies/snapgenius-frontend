import React from 'react';
import PropTypes from 'prop-types';
import UnifiedChatInterface from '../components/UnifiedChatInterface';

// This component mainly acts as a structural container for the chat interface 
// within the Dashboard's main content area.
function ChatView({
    activeChatMode,
    setActiveChatMode,
    promptSettings,
    setPromptSettings,
    chatToken,
    tokenError,
    onUploadSuccess
}) {
    return (
        // The UnifiedChatInterface handles its own height and layout internally
        <UnifiedChatInterface 
            key={activeChatMode} 
            activeChatMode={activeChatMode}
            setActiveChatMode={setActiveChatMode}
            promptSettings={promptSettings}
            setPromptSettings={setPromptSettings}
            chatToken={chatToken}
            tokenError={tokenError}
            onUploadSuccess={onUploadSuccess}
        />
    );
}

ChatView.propTypes = {
    activeChatMode: PropTypes.string.isRequired,
    setActiveChatMode: PropTypes.func.isRequired,
    promptSettings: PropTypes.object.isRequired,
    setPromptSettings: PropTypes.func.isRequired,
    chatToken: PropTypes.string,
    tokenError: PropTypes.string,
    onUploadSuccess: PropTypes.func.isRequired,
};

export default ChatView; 