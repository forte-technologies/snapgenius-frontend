import { ENDPOINTS } from '../config/api';

/**
 * Sends a message to a specified chat stream endpoint and yields response chunks.
 * @param {string} endpointUrl - The specific chat stream endpoint URL.
 * @param {object} payload - The request payload (e.g., { message: '...', promptSettings: {...} }).
 * @param {string} token - The user's chat authentication token.
 * @yields {string} Chunks of the AI's response.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function* streamChatResponse(endpointUrl, payload, token) {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const body = JSON.stringify(payload);

    try {
        console.log(`Streaming chat request to: ${endpointUrl} with payload:`, body);
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Try to get error details
            console.error(`Streaming chat HTTP error! Status: ${response.status}, Body: ${errorBody}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            yield chunk;
        }
        console.log(`Streaming chat finished for: ${endpointUrl}`);

    } catch (error) {
        console.error(`Streaming chat error for ${endpointUrl}:`, error);
        // Propagate the error so the UI can display a specific message
        throw error; 
        // // Or yield a generic error message if preferred
        // yield 'Sorry, I encountered an error while processing your request. Please try again.';
    }
} 