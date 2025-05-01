import React from 'react';
// import PublicNavbar from '../components/PublicNavbar'; // Removed

const headingCharcoal = '#1F2937';
const bodyGray = '#475569';
const primaryBlue = '#3366FF';

function Features() {
  return (
    // Standard section padding and container
    <div className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Page Heading */}
          <h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl text-center mb-12 lg:mb-16"
            style={{ color: headingCharcoal }}
          >
            Features
          </h1>

          {/* Academic AI Section */}
          <section className="mb-12 lg:mb-16">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: primaryBlue }}>Academic AI Assistant</h2>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: bodyGray }}>
              Leverage our specialized Academic AI Assistant for generating papers, long-form written answers, and other academic content. Tailor the output precisely to your needs using the intuitive Prompt Tuner.
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2 text-lg" style={{ color: bodyGray }}>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Fine-tune responses:</span> Adjust Tone (Casual to Formal), Complexity (Simple to Advanced), Focus (Narrow to Broad), Depth (Concise to Thorough), and Clarity.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Choose your knowledge base:</span> Select the assistant that strictly uses only your uploaded documents for source-verified answers, or choose the assistant that augments your uploads with its broader knowledge base for additional context and insights.
              </li>
            </ul>
          </section>

          {/* General & Image Chat Section */}
          <section className="mb-12 lg:mb-16">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: primaryBlue }}>General & Image Chat</h2>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: bodyGray }}>
              Beyond academic tasks, snapGenius offers versatile chat modes for interacting with your uploaded content and general knowledge.
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2 text-lg" style={{ color: bodyGray }}>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>General Chat:</span> Ask questions that require a blend of information from your uploaded files and the AI's general training data.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Uploads Chat (Strict RAG):</span> Engage in conversations where the AI assistant *only* uses the content derived from your uploaded images and documents, ensuring answers are strictly based on your provided sources.
              </li>
            </ul>
          </section>

          {/* Uploads Section */}
          <section className="mb-12 lg:mb-16">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: primaryBlue }}>Intelligent Uploads</h2>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: bodyGray }}>
              Upload virtually any document or image, and let snapGenius make it instantly searchable and usable by the AI.
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2 text-lg" style={{ color: bodyGray }}>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Supported File Types:</span> Upload PDFs, TXT, DOC/DOCX, common image formats (JPG, PNG, WEBP, GIF), and hundreds more text-based document types.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Document Processing:</span> Text is intelligently parsed and embedded into a vector database, optimized for fast and relevant information retrieval when you chat with the AI.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Image Processing:</span> Upload images or screenshots containing text (receipts, posters, notes, etc.). The text is extracted verbatim. If an image contains no text, a detailed AI-generated description is created. Both extracted text and descriptions become searchable context for the AI.
              </li>
            </ul>
          </section>

          {/* Upcoming Features Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6" style={{ color: primaryBlue }}>Coming Soon</h2>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: bodyGray }}>
              We're continuously working to enhance snapGenius. Here's a sneak peek at upcoming features:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-3 text-lg" style={{ color: bodyGray }}>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Advanced Prompt Tuning:</span> More granular controls for the Academic AI, including output presets for length (pages, paragraphs, character count).
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>"Write Like Me":</span> Upload writing samples and have the Academic AI emulate your personal writing style.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>Context Selection:</span> Specify exactly which uploaded documents or images should be used as context for a particular query or chat session.
              </li>
              <li>
                <span className="font-semibold" style={{ color: headingCharcoal }}>File Vault:</span> A new file explorer interface within the uploads section, making it significantly easier to organize, browse, and find your uploaded content.
              </li>
            </ul>
          </section>
       </div>
    </div>
  );
}

export default Features; 